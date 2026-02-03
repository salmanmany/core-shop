import { useLanguage } from '@/contexts/LanguageContext';
import { useSound } from '@/hooks/useSound';
import { KeyIcon } from '@/components/icons';

const keysConfig = [
  { key: 'common', price: 2, colorClass: 'text-common', bgClass: 'bg-common', borderClass: 'border-common' },
  { key: 'rare', price: 7, colorClass: 'text-rare', bgClass: 'bg-rare', borderClass: 'border-rare' },
  { key: 'legendary', price: 15, colorClass: 'text-legendary', bgClass: 'bg-legendary', borderClass: 'border-legendary' },
  { key: 'rankKey', price: 30, colorClass: 'text-rank-key', bgClass: 'bg-rank-key', borderClass: 'border-rank-key' },
] as const;

export function Keys() {
  const { t, language } = useLanguage();
  const { playSound } = useSound();

  return (
    <section id="keys" className="py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className={`text-center mb-12 animate-fade-in-down ${language === 'ar' ? 'text-right md:text-center' : ''}`}>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {t('keys.title')} <span className="text-primary">{t('keys.titleAccent')}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('keys.subtitle')}
          </p>
        </div>

        {/* Keys Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {keysConfig.map((keyItem, index) => (
            <div 
              key={keyItem.key} 
              className="key-card animate-scale-bounce group"
              style={{ animationDelay: `${index * 100}ms` }}
              onMouseEnter={() => playSound('hover')}
            >
              {/* Rarity Badge */}
              <div className={`absolute top-4 end-4 px-2 py-0.5 rounded-full text-xs font-semibold text-white ${keyItem.bgClass}`}>
                {t(`keysData.${keyItem.key}.rarity`)}
              </div>

              {/* Key Icon */}
              <div className={`w-14 h-14 rounded-xl ${keyItem.bgClass}/20 flex items-center justify-center mb-4`}>
                <KeyIcon className={`w-8 h-8 ${keyItem.colorClass} group-hover:animate-wiggle`} />
              </div>

              {/* Name */}
              <h3 className={`text-xl font-bold mb-1 ${keyItem.colorClass} group-hover:scale-105 transition-transform`}>
                {t(`keysData.${keyItem.key}.name`)}
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                ({keyItem.key === 'common' ? 'Common Key' : 
                  keyItem.key === 'rare' ? 'Rare Key' : 
                  keyItem.key === 'legendary' ? 'Legendary Key' : 'Rank Key'})
              </p>

              {/* Price */}
              <div className="mb-4">
                <span className="text-2xl font-bold text-primary">${keyItem.price}</span>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-6 flex-grow">
                {t(`keysData.${keyItem.key}.desc`)}
              </p>

              {/* Buy Button */}
              <button 
                onClick={() => {
                  playSound('xp');
                  playSound('collect');
                }}
                onMouseEnter={() => playSound('hover')}
                className={`w-full py-2.5 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg group-hover:animate-glow-pulse ${keyItem.bgClass}`}
              >
                {t('ranks.buyNow')}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
