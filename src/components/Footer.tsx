import { useLanguage } from '@/contexts/LanguageContext';
import { useToastContext } from '@/contexts/ToastContext';
import logo from '@/assets/logo.png';
import { DiscordIcon, WhatsAppIcon, MailIcon } from '@/components/icons';

export function Footer() {
  const { t, language } = useLanguage();
  const { showToast } = useToastContext();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast(t('contact.copied'));
  };

  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12">
          {/* About */}
          <div className={language === 'ar' ? 'text-right' : 'text-left'}>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={logo} 
                alt="Core CMS" 
                className="w-16 h-16 object-contain glow-green rounded-xl" 
              />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('footer.about')}
            </p>
          </div>

          {/* Contact */}
          <div className={language === 'ar' ? 'text-right' : 'text-left'}>
            <h4 className="text-lg font-bold text-primary mb-4">
              {t('footer.contactTitle')}
            </h4>
            <div className="space-y-3">
              <button
                onClick={() => copyToClipboard('king_salman1')}
                className="flex items-center gap-3 glass-card px-3 py-2 w-full hover:bg-discord/10 transition-colors"
              >
                <DiscordIcon className="w-5 h-5 text-discord" />
                <span className="text-sm">king_salman1</span>
              </button>
              <a
                href="https://wa.me/212607566602"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 glass-card px-3 py-2 w-full hover:bg-whatsapp/10 transition-colors"
              >
                <WhatsAppIcon className="w-5 h-5 text-whatsapp" />
                <span className="text-sm direction-ltr">+212 607566602</span>
              </a>
              <a
                href="mailto:salmanarid17@gmail.com"
                className="flex items-center gap-3 glass-card px-3 py-2 w-full hover:bg-gmail/10 transition-colors"
              >
                <MailIcon className="w-5 h-5 text-gmail" />
                <span className="text-sm">salmanarid17@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Developer */}
          <div className={language === 'ar' ? 'text-right' : 'text-left'}>
            <h4 className="text-lg font-bold text-primary mb-4">
              {t('footer.developerTitle')}
            </h4>
            <div className="space-y-2">
              <p className="font-semibold">{t('footer.developerName')}</p>
              <p className="text-sm text-muted-foreground">{t('footer.developerRole')}</p>
              <img
                src="https://flagcdn.com/w40/ma.png"
                alt="Morocco"
                className="w-8 h-5 object-cover rounded mt-2"
              />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
