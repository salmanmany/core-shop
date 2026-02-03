import { useState, useEffect } from 'react';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LoginModal } from '@/components/LoginModal';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSound } from '@/hooks/useSound';
import { supabase } from '@/integrations/supabase/client';
import { DownloadIcon, PackageIcon } from '@/components/icons';

interface Mod {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar: string | null;
  description_en: string | null;
  download_url: string;
  image_url: string | null;
  version: string | null;
  minecraft_version: string | null;
  sort_order: number;
}

const ModsPage = () => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { t, language } = useLanguage();
  const { playSound } = useSound();
  const [mods, setMods] = useState<Mod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMods = async () => {
      const { data, error } = await supabase
        .from('mods')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!error && data) {
        setMods(data);
      }
      setLoading(false);
    };

    fetchMods();
  }, []);

  const handleDownload = (url: string) => {
    playSound('chest');
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <AnimatedBackground />
      <Navbar onLoginClick={() => setLoginModalOpen(true)} />
      <main className="pt-24 pb-16">
        <section className="py-20">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className={`text-center mb-12 animate-fade-in-down ${language === 'ar' ? 'text-right md:text-center' : ''}`}>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                {t('mods.title')} <span className="text-primary animate-glow-pulse inline-block">{t('mods.titleAccent')}</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t('mods.subtitle')}
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin-slow rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : mods.length === 0 ? (
              <div className="text-center py-16 animate-bounce-in">
                <PackageIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4 animate-float" />
                <p className="text-muted-foreground text-lg">{t('mods.noMods')}</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mods.map((mod, index) => (
                  <div 
                    key={mod.id} 
                    className="glass-card p-6 flex flex-col animate-scale-bounce group"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onMouseEnter={() => playSound('hover')}
                  >
                    {/* Mod Image */}
                    {mod.image_url ? (
                      <img
                        src={mod.image_url}
                        alt={language === 'ar' ? mod.name_ar : mod.name_en}
                        className="w-full h-40 object-cover rounded-xl mb-4 transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-40 bg-secondary/50 rounded-xl mb-4 flex items-center justify-center">
                        <PackageIcon className="w-16 h-16 text-muted-foreground group-hover:animate-wiggle" />
                      </div>
                    )}

                    {/* Mod Info */}
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {language === 'ar' ? mod.name_ar : mod.name_en}
                    </h3>

                    {/* Version Info */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {mod.version && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary animate-pulse">
                          v{mod.version}
                        </span>
                      )}
                      {mod.minecraft_version && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-muted-foreground">
                          MC {mod.minecraft_version}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-6 flex-grow">
                      {language === 'ar' ? mod.description_ar : mod.description_en}
                    </p>

                    {/* Download Button */}
                    <button
                      onClick={() => handleDownload(mod.download_url)}
                      onMouseEnter={() => playSound('hover')}
                      className="w-full py-3 rounded-xl font-semibold text-white bg-primary transition-all duration-300 hover:scale-105 hover:shadow-lg hover:animate-glow-pulse flex items-center justify-center gap-2 group/btn"
                    >
                      <DownloadIcon className="w-5 h-5 group-hover/btn:animate-bounce" />
                      {t('mods.download')}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <LoginModal 
        isOpen={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
      />
    </div>
  );
};

export default ModsPage;
