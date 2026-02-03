import { useLanguage } from '@/contexts/LanguageContext';
import {
  ShieldIcon,
  GemIcon,
  StarIcon,
  FlameIcon,
  TrophyIcon,
  CheckIcon,
  GoldStarIcon,
} from '@/components/icons';

const rankIcons = {
  vip: ShieldIcon,
  vipPlus: GemIcon,
  mvp: StarIcon,
  mvpPlus: FlameIcon,
  legend: TrophyIcon,
};

const ranksConfig = [
  { key: 'vip', price: 10, colorClass: 'text-vip', bgClass: 'bg-vip', borderClass: 'border-vip' },
  { key: 'vipPlus', price: 20, colorClass: 'text-vip-plus', bgClass: 'bg-vip-plus', borderClass: 'border-vip-plus' },
  { key: 'mvp', price: 40, colorClass: 'text-mvp', bgClass: 'bg-mvp', borderClass: 'border-mvp' },
  { key: 'mvpPlus', price: 70, colorClass: 'text-mvp-plus', bgClass: 'bg-mvp-plus', borderClass: 'border-mvp-plus' },
  { key: 'legend', price: 100, colorClass: 'text-legend', bgClass: 'bg-legend', borderClass: 'border-legend' },
] as const;

export function Ranks() {
  const { t, language } = useLanguage();

  return (
    <section id="ranks" className="py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className={`text-center mb-12 ${language === 'ar' ? 'text-right md:text-center' : ''}`}>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {t('ranks.title')} <span className="text-primary">{t('ranks.titleAccent')}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('ranks.subtitle')}
          </p>
        </div>

        {/* Ranks Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ranksConfig.map(rank => {
            const IconComponent = rankIcons[rank.key as keyof typeof rankIcons];
            return (
              <div
                key={rank.key}
                className={`rank-card hover:border-${rank.key === 'vipPlus' ? 'vip-plus' : rank.key}`}
                style={{
                  ['--hover-glow' as string]: `var(--${rank.key})`
                }}
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <IconComponent className={`w-8 h-8 ${rank.colorClass}`} />
                  <h3 className={`text-2xl font-bold ${rank.colorClass}`}>
                    {t(`ranksData.${rank.key}.name`)}
                  </h3>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <span className="text-3xl font-bold text-primary">${rank.price}</span>
                  <p className="text-sm text-muted-foreground">{t('ranks.finalPrice')}</p>
                </div>

                {/* Divider */}
                <div className="border-t border-border my-4" />

                {/* Perks */}
                <div className="mb-4">
                  <p className="text-xs uppercase text-muted-foreground tracking-wide mb-2">
                    {t('ranks.perks')}
                  </p>
                  <div className="flex items-start gap-2">
                    <CheckIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{t(`ranksData.${rank.key}.desc`)}</p>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-border my-4" />

                {/* Rewards */}
                <div className="mb-6">
                  <p className="text-xs uppercase text-muted-foreground tracking-wide mb-2">
                    {t('ranks.alsoGet')}
                  </p>
                  <div className="flex items-start gap-2">
                    <GoldStarIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{t(`ranksData.${rank.key}.reward`)}</p>
                  </div>
                </div>

                {/* Buy Button */}
                <button className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg ${rank.bgClass}`}>
                  {t('ranks.buyNow')}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
