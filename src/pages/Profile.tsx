import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToastContext } from '@/contexts/ToastContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import logo from '@/assets/logo.png';

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  minecraft_username: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export default function Profile() {
  const { t, language } = useLanguage();
  const { showToast } = useToastContext();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [minecraftUsername, setMinecraftUsername] = useState('');
  const [skinPreview, setSkinPreview] = useState('https://mc-heads.net/avatar/Steve/100');

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/');
        return;
      }

      setEmail(session.user.email || '');
      
      // Fetch profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        showToast(t('profile.errorLoading'));
      } else if (data) {
        setProfile(data);
        setDisplayName(data.display_name || '');
        setMinecraftUsername(data.minecraft_username || '');
        if (data.minecraft_username) {
          setSkinPreview(`https://mc-heads.net/avatar/${data.minecraft_username}/100`);
        } else if (data.avatar_url) {
          setSkinPreview(data.avatar_url);
        }
      }

      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, showToast, t]);

  // Update skin preview when Minecraft username changes
  const updateSkinPreview = useCallback((username: string) => {
    if (username.trim()) {
      setSkinPreview(`https://mc-heads.net/avatar/${username}/100`);
    } else {
      setSkinPreview('https://mc-heads.net/avatar/Steve/100');
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateSkinPreview(minecraftUsername);
    }, 600);
    return () => clearTimeout(timer);
  }, [minecraftUsername, updateSkinPreview]);

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: displayName || null,
        minecraft_username: minecraftUsername || null,
        avatar_url: minecraftUsername 
          ? `https://mc-heads.net/avatar/${minecraftUsername}/100`
          : profile.avatar_url,
      })
      .eq('user_id', profile.user_id);

    setSaving(false);

    if (error) {
      console.error('Error updating profile:', error);
      showToast(t('profile.errorSaving'));
    } else {
      showToast(t('profile.saved'));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <img src={logo} alt="Core CMS" className="w-12 h-12 object-contain" />
              <div>
                <h1 className="text-2xl font-bold">{t('profile.title')}</h1>
                <p className="text-sm text-muted-foreground">{t('profile.subtitle')}</p>
              </div>
            </div>

            {/* Avatar/Skin Preview */}
            <div className="flex justify-center mb-8">
              <img
                src={skinPreview}
                alt="Avatar"
                className="w-32 h-32 rounded-xl border-4 border-primary/30 shadow-lg shadow-primary/20"
                style={{ imageRendering: 'pixelated' }}
                onError={() => setSkinPreview('https://mc-heads.net/avatar/Steve/100')}
              />
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Email (read-only) */}
              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">
                  {t('profile.email')}
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-secondary/30 border border-border text-muted-foreground cursor-not-allowed"
                />
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('profile.displayName')}
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={t('profile.displayNamePlaceholder')}
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              {/* Minecraft Username */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('profile.minecraftUsername')}
                </label>
                <input
                  type="text"
                  value={minecraftUsername}
                  onChange={(e) => setMinecraftUsername(e.target.value)}
                  placeholder={t('profile.minecraftUsernamePlaceholder')}
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none transition-colors"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {t('profile.minecraftUsernameHint')}
                </p>
              </div>

              {/* Account Created */}
              {profile && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-muted-foreground">
                    {t('profile.memberSince')}
                  </label>
                  <p className="text-sm">
                    {new Date(profile.created_at).toLocaleDateString(
                      language === 'ar' ? 'ar-MA' : 'en-US',
                      { year: 'numeric', month: 'long', day: 'numeric' }
                    )}
                  </p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {saving ? t('profile.saving') : t('profile.saveButton')}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-6 py-3 rounded-xl border border-destructive text-destructive hover:bg-destructive/10 transition-colors"
                >
                  {t('profile.logoutButton')}
                </button>
              </div>

              {/* Back to Store */}
              <button
                onClick={() => navigate('/')}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('profile.backToStore')}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}