import { useLanguage } from '@/contexts/LanguageContext';
import heroImage from '@/assets/minecraft-hero.jpg';

export function Hero() {
  const { t, language } = useLanguage();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="min-h-screen flex items-center pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className={`grid lg:grid-cols-2 gap-12 items-center ${language === 'ar' ? 'lg:grid-flow-dense' : ''}`}>
          {/* Text Content */}
          <div className={`space-y-6 ${language === 'ar' ? 'lg:col-start-2 text-right' : 'text-left'}`}>
            <span className="inline-block px-4 py-1 rounded-full bg-primary/20 text-primary text-sm font-semibold uppercase tracking-wide">
              {t('hero.tagline')}
            </span>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              {language === 'ar' ? (
                <>
                  مرحباً بك، <span className="gradient-text">سلمان</span>
                </>
              ) : (
                <>
                  Welcome, <span className="gradient-text">Salman</span>
                </>
              )}
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-lg">
              {t('hero.description')}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollTo('ranks')}
                className="btn-primary animate-pulse-glow"
              >
                {t('hero.exploreCta')}
              </button>
              <button
                onClick={() => scrollTo('keys')}
                className="btn-outline-glass"
              >
                {t('hero.viewOffers')}
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className={`${language === 'ar' ? 'lg:col-start-1' : ''}`}>
            <div className="relative">
              <img
                src={heroImage}
                alt="Minecraft Adventure"
                className="w-full rounded-3xl glow-green"
              />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-background/50 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
