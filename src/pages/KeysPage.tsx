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
import { KeyIcon, CartIcon } from '@/components/icons';

interface Key {
  id: string;
  key: string;
  price: number;
  color_class: string;
  bg_class: string;
  border_class: string;
  name_ar: string;
  name_en: string;
  rarity_ar: string;
  rarity_en: string;
  desc_ar: string;
  desc_en: string;
  sort_order: number;
}

const KeysPage = () => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { t, language } = useLanguage();
  const { addItem } = useCart();
  const { showToast } = useToastContext();
  const { playSound } = useSound();
  const [keys, setKeys] = useState<Key[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKeys = async () => {
      const { data, error } = await supabase
        .from('keys')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!error && data) {
        setKeys(data);
      }
      setLoading(false);
    };

    fetchKeys();
  }, []);

  const handleAddToCart = (keyItem: Key) => {
    playSound('collect');
    playSound('xp');
    addItem({
      id: keyItem.id,
      type: 'key',
      name: keyItem.name_en,
      nameAr: keyItem.name_ar,
      price: keyItem.price,
      colorClass: keyItem.color_class,
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
                {t('keys.title')} <span className="text-primary">{t('keys.titleAccent')}</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t('keys.subtitle')}
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin-slow rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {keys.map((keyItem, index) => (
                  <div 
                    key={keyItem.id} 
                    className="key-card animate-scale-bounce group"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onMouseEnter={() => playSound('hover')}
                  >
                    {/* Rarity Badge */}
                    <div className={`absolute top-4 end-4 px-2 py-0.5 rounded-full text-xs font-semibold text-white ${keyItem.bg_class} animate-pulse`}>
                      {language === 'ar' ? keyItem.rarity_ar : keyItem.rarity_en}
                    </div>

                    {/* Key Icon */}
                    <div className={`w-14 h-14 rounded-xl ${keyItem.bg_class}/20 flex items-center justify-center mb-4`}>
                      <KeyIcon className={`w-8 h-8 ${keyItem.color_class} group-hover:animate-wiggle`} />
                    </div>

                    {/* Name */}
                    <h3 className={`text-xl font-bold mb-1 ${keyItem.color_class} group-hover:scale-105 transition-transform`}>
                      {language === 'ar' ? keyItem.name_ar : keyItem.name_en}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      ({keyItem.key === 'common' ? 'Common Key' : 
                        keyItem.key === 'rare' ? 'Rare Key' : 
                        keyItem.key === 'legendary' ? 'Legendary Key' : 'Rank Key'})
                    </p>

                    {/* Price */}
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-primary group-hover:animate-pulse">${keyItem.price}</span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-6 flex-grow">
                      {language === 'ar' ? keyItem.desc_ar : keyItem.desc_en}
                    </p>

                    {/* Buy Button */}
                    <button 
                      onClick={() => handleAddToCart(keyItem)}
                      onMouseEnter={() => playSound('hover')}
                      className={`w-full py-2.5 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg group-hover:animate-glow-pulse ${keyItem.bg_class} flex items-center justify-center gap-2`}
                    >
                      <CartIcon className="w-5 h-5" />
                      {t('ranks.buyNow')}
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

export default KeysPage;
