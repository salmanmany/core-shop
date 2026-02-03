import { useLanguage } from '@/contexts/LanguageContext';
import { useSound } from '@/hooks/useSound';
import { Link } from 'react-router-dom';

export function Hero() {
  const { t, language } = useLanguage();
  const { playSound } = useSound();

  return (
    <section id="home" className="min-h-screen flex items-center pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/20 text-primary text-sm font-semibold uppercase tracking-wide animate-fade-in-down">
            {t('hero.tagline')}
          </span>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight animate-scale-bounce">
            {language === 'ar' ? (
              <>
                مرحباً بك، <span className="gradient-text animate-shimmer bg-[length:200%_100%]">سلمان</span>
              </>
            ) : (
              <>
                Welcome, <span className="gradient-text animate-shimmer bg-[length:200%_100%]">Salman</span>
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
