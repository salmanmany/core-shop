import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useSound } from '@/hooks/useSound';
import { CheckIcon } from '@/components/icons';

const PaymentSuccessPage = () => {
  const { language } = useLanguage();
  const { clearCart } = useCart();
  const { playSound } = useSound();

  useEffect(() => {
    // Clear cart on successful payment
    clearCart();
    playSound('levelUp');
  }, [clearCart, playSound]);

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <AnimatedBackground />
      <Navbar />
      <main className="pt-24 pb-16 min-h-[80vh] flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center glass-card p-8 animate-scale-bounce">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
              <CheckIcon className="w-10 h-10 text-primary animate-bounce-in" />
            </div>
            
            <h1 className="text-2xl font-bold mb-4">
              {language === 'ar' ? 'تم الدفع بنجاح!' : 'Payment Successful!'}
            </h1>
            
            <p className="text-muted-foreground mb-6">
              {language === 'ar' 
                ? 'شكراً لك! سيتم تفعيل مشترياتك خلال دقائق.'
                : 'Thank you! Your purchase will be activated within minutes.'}
            </p>
            
            <Link
              to="/"
              className="btn-primary inline-block"
              onClick={() => playSound('click')}
              onMouseEnter={() => playSound('hover')}
            >
              {language === 'ar' ? 'العودة للمتجر' : 'Back to Store'}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccessPage;
