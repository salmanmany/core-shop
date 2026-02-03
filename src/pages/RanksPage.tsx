import { useState, useEffect } from 'react';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LoginModal } from '@/components/LoginModal';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useToastContext } from '@/contexts/ToastContext';
import { useSound } from '@/hooks/useSound';
import { supabase } from '@/integrations/supabase/client';
import {
  ShieldIcon,
  GemIcon,
  StarIcon,
  FlameIcon,
  TrophyIcon,
  CheckIcon,
  GoldStarIcon,
  CartIcon,
} from '@/components/icons';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  shield: ShieldIcon,
  gem: GemIcon,
  star: StarIcon,
  flame: FlameIcon,
  trophy: TrophyIcon,
};

interface Rank {
  id: string;
  key: string;
  price: number;
  color_class: string;
  bg_class: string;
  border_class: string;
  icon: string;
  name_ar: string;
  name_en: string;
  desc_ar: string;
  desc_en: string;
  reward_ar: string;
  reward_en: string;
  sort_order: number;
}

const RanksPage = () => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { t, language } = useLanguage();
  const { addItem } = useCart();
  const { showToast } = useToastContext();
  const { playSound } = useSound();
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanks = async () => {
      const { data, error } = await supabase
        .from('ranks')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!error && data) {
        setRanks(data);
      }
      setLoading(false);
    };

    fetchRanks();
  }, []);

  const handleAddToCart = (rank: Rank) => {
    playSound('collect');
    playSound('xp');
    addItem({
      id: rank.id,
      type: 'rank',
      name: rank.name_en,
      nameAr: rank.name_ar,
      price: rank.price,
      colorClass: rank.color_class,
    });
    showToast(t('cart.addedToCart'));
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
                {t('ranks.title')} <span className="text-primary">{t('ranks.titleAccent')}</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t('ranks.subtitle')}
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin-slow rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {ranks.map((rank, index) => {
                  const IconComponent = iconMap[rank.icon] || ShieldIcon;
                  return (
                    <div
                      key={rank.id}
                      className="rank-card animate-scale-bounce group"
                      style={{ animationDelay: `${index * 100}ms` }}
                      onMouseEnter={() => playSound('hover')}
                    >
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <IconComponent className={`w-8 h-8 ${rank.color_class} group-hover:animate-wiggle`} />
                        <h3 className={`text-2xl font-bold ${rank.color_class}`}>
                          {language === 'ar' ? rank.name_ar : rank.name_en}
                        </h3>
                      </div>

                      {/* Price */}
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-primary group-hover:animate-pulse">${rank.price}</span>
                        <p className="text-sm text-muted-foreground">{t('ranks.finalPrice')}</p>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-border my-4 group-hover:border-primary/50 transition-colors" />

                      {/* Perks */}
                      <div className="mb-4">
                        <p className="text-xs uppercase text-muted-foreground tracking-wide mb-2">
                          {t('ranks.perks')}
                        </p>
                        <div className="flex items-start gap-2">
                          <CheckIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <p className="text-sm">{language === 'ar' ? rank.desc_ar : rank.desc_en}</p>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-border my-4 group-hover:border-primary/50 transition-colors" />

                      {/* Rewards */}
                      <div className="mb-6">
                        <p className="text-xs uppercase text-muted-foreground tracking-wide mb-2">
                          {t('ranks.alsoGet')}
                        </p>
                        <div className="flex items-start gap-2">
                          <GoldStarIcon className="w-5 h-5 flex-shrink-0 mt-0.5 group-hover:animate-spin-slow" />
                          <p className="text-sm">{language === 'ar' ? rank.reward_ar : rank.reward_en}</p>
                        </div>
                      </div>

                      {/* Buy Button */}
                      <button 
                        onClick={() => handleAddToCart(rank)}
                        onMouseEnter={() => playSound('hover')}
                        className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg group-hover:animate-glow-pulse ${rank.bg_class} flex items-center justify-center gap-2`}
                      >
                        <CartIcon className="w-5 h-5" />
                        {t('ranks.buyNow')}
                      </button>
                    </div>
                  );
                })}
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

export default RanksPage;
