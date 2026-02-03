import { useLanguage } from '@/contexts/LanguageContext';
import { useToastContext } from '@/contexts/ToastContext';
import { useSound } from '@/hooks/useSound';
import logo from '@/assets/logo.png';
import { DiscordIcon, WhatsAppIcon, MailIcon } from '@/components/icons';

export function Footer() {
  const { t, language } = useLanguage();
  const { showToast } = useToastContext();
  const { playSound } = useSound();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    playSound('success');
    showToast(t('contact.copied'));
  };

  const getWhatsAppUrl = () => {
    const message = language === 'ar' 
      ? 'مرحباً! أريد الاستفسار عن متجر Core CMS'
      : 'Hello! I would like to inquire about Core CMS store';
    return `https://wa.me/212607566602?text=${encodeURIComponent(message)}`;
  };

  const getEmailUrl = () => {
    const subject = language === 'ar' 
      ? 'استفسار من متجر Core CMS'
      : 'Inquiry from Core CMS Store';
    const body = language === 'ar'
      ? 'مرحباً سلمان،\n\nأريد الاستفسار عن...'
      : 'Hello Salman,\n\nI would like to inquire about...';
    return `mailto:salmanarid17@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <footer className="border-t border-border py-10 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* About */}
          <div className={language === 'ar' ? 'text-right' : 'text-left'}>
            <div className="flex items-center gap-3 mb-3">
              <img 
                src={logo} 
                alt="Core CMS" 
                className="w-12 h-12 object-contain glow-green rounded-xl" 
              />
              <div>
                <h3 className="font-bold text-lg">Core CMS</h3>
                <p className="text-xs text-muted-foreground">{t('nav.premiumShop')}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t('footer.about')}
            </p>
          </div>

          {/* Quick Contact */}
          <div className={language === 'ar' ? 'text-right' : 'text-left'}>
            <h4 className="text-sm font-bold text-primary mb-3">
              {t('footer.contactTitle')}
            </h4>
            <div className="space-y-2">
              <button
                onClick={() => copyToClipboard('king_salman1')}
                onMouseEnter={() => playSound('hover')}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-discord transition-colors group"
              >
                <DiscordIcon className="w-4 h-4 text-discord" />
                <span className="group-hover:underline">king_salman1</span>
              </button>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playSound('click')}
                onMouseEnter={() => playSound('hover')}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-whatsapp transition-colors group"
              >
                <WhatsAppIcon className="w-4 h-4 text-whatsapp" />
                <span className="group-hover:underline direction-ltr">+212 607566602</span>
              </a>
              <a
                href={getEmailUrl()}
                onClick={() => playSound('click')}
                onMouseEnter={() => playSound('hover')}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-gmail transition-colors group"
              >
                <MailIcon className="w-4 h-4 text-gmail" />
                <span className="group-hover:underline">salmanarid17@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Developer */}
          <div className={language === 'ar' ? 'text-right' : 'text-left'}>
            <h4 className="text-sm font-bold text-primary mb-3">
              {t('footer.developerTitle')}
            </h4>
            <div className="flex items-center gap-3">
              <img
                src="https://flagcdn.com/w40/ma.png"
                alt="Morocco"
                className="w-8 h-5 object-cover rounded"
              />
              <div>
                <p className="font-semibold text-sm">{t('footer.developerName')}</p>
                <p className="text-xs text-muted-foreground">{t('footer.developerRole')}</p>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className={language === 'ar' ? 'text-right' : 'text-left'}>
            <h4 className="text-sm font-bold text-primary mb-3">
              {t('keys.paymentMethods')}
            </h4>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="h-8 w-14 bg-white rounded-md flex items-center justify-center p-1">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                  alt="PayPal"
                  className="h-5 object-contain"
                />
              </div>
              <div className="h-8 w-14 bg-white rounded-md flex items-center justify-center p-1">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                  alt="Visa"
                  className="h-4 object-contain"
                />
              </div>
              <div className="h-8 w-14 bg-white rounded-md flex items-center justify-center p-1">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                  alt="Mastercard"
                  className="h-5 object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-4 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
