import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';

export function Hero() {
  const { t, language } = useLanguage();

  return (
    <section id="home" className="min-h-screen flex items-center pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
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
          
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            {t('hero.description')}
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/ranks"
              className="btn-primary animate-pulse-glow"
            >
              {t('hero.exploreCta')}
            </Link>
            <Link
              to="/keys"
              className="btn-outline-glass"
            >
              {t('hero.viewOffers')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
