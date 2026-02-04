import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSound } from '@/hooks/useSound';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

interface SupabaseUserData {
  minecraft_username?: string | null;
}

export function Hero() {
  const { t, language } = useLanguage();
  const { playSound } = useSound();
  const { user: localUser, isLoggedIn: isLocalLoggedIn } = useAuth();
  const [supabaseUser, setSupabaseUser] = useState<{ email: string | null; minecraft_username: string | null } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Fetch profile for minecraft username
        const { data: profile } = await supabase
          .from('profiles')
          .select('minecraft_username')
          .eq('user_id', session.user.id)
          .single();
        
        setSupabaseUser({
          email: session.user.email || null,
          minecraft_username: (profile as SupabaseUserData)?.minecraft_username || null,
        });
      }
    };
    fetchUser();
  }, []);

  // Determine username for skin display
  const getMinecraftUsername = () => {
    if (supabaseUser?.minecraft_username) return supabaseUser.minecraft_username;
    if (localUser?.username) return localUser.username;
    return 'Steve';
  };

  const isLoggedIn = isLocalLoggedIn || supabaseUser !== null;
  const minecraftUsername = getMinecraftUsername();
  const displayName = supabaseUser?.minecraft_username || supabaseUser?.email?.split('@')[0] || localUser?.username || 'Player';

  return (
    <section id="home" className="min-h-screen flex items-center pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/20 text-primary text-sm font-semibold uppercase tracking-wide animate-fade-in-down">
            {t('hero.tagline')}
          </span>
          
          {/* Minecraft Skin Display */}
          {isLoggedIn && (
            <div className="flex justify-center animate-bounce-in">
              <div className="relative">
                <img
                  src={`https://mc-heads.net/body/${minecraftUsername}/150`}
                  alt={minecraftUsername}
                  className="h-40 object-contain drop-shadow-2xl animate-float"
                  style={{ imageRendering: 'pixelated' }}
                />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-black/20 rounded-full blur-md" />
              </div>
            </div>
          )}
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight animate-scale-bounce">
            {language === 'ar' ? (
              <>
                {isLoggedIn ? 'مرحباً بك، ' : 'مرحباً بك في '}
                <span className="gradient-text animate-shimmer bg-[length:200%_100%]">
                  {isLoggedIn ? displayName : 'Core CMS'}
                </span>
              </>
            ) : (
              <>
                {isLoggedIn ? 'Welcome, ' : 'Welcome to '}
                <span className="gradient-text animate-shimmer bg-[length:200%_100%]">
                  {isLoggedIn ? displayName : 'Core CMS'}
                </span>
              </>
            )}
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-lg mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
            {t('hero.description')}
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <Link
              to="/ranks"
              onClick={() => playSound('levelUp')}
              onMouseEnter={() => playSound('hover')}
              className="btn-primary animate-glow-pulse hover:animate-none hover:scale-110 transition-transform"
            >
              {t('hero.exploreCta')}
            </Link>
            <Link
              to="/keys"
              onClick={() => playSound('click')}
              onMouseEnter={() => playSound('hover')}
              className="btn-outline-glass hover:scale-105 transition-transform"
            >
              {t('hero.viewOffers')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
