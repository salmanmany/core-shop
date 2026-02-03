import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToastContext } from '@/contexts/ToastContext';
import { useSound } from '@/hooks/useSound';
import {
  DiscordIcon,
  WhatsAppIcon,
  MailIcon,
  InstagramIcon,
  CopyIcon,
  ChevronDownIcon,
} from '@/components/icons';

const faqItems = ['q1', 'q2', 'q3', 'q4'] as const;

export function Contact() {
  const { t, language } = useLanguage();
  const { showToast } = useToastContext();
  const { playSound } = useSound();
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    playSound('success');
    showToast(t('contact.copied'));
  };

  const toggleFaq = (id: string) => {
    playSound('pop');
    setOpenFaq(openFaq === id ? null : id);
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
    <section id="contact" className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Section Header */}
        <div className={`text-center mb-8 ${language === 'ar' ? 'text-right md:text-center' : ''}`}>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            {t('contact.title')} <span className="text-primary">{t('contact.titleAccent')}</span>
          </h2>
        </div>

        {/* Social Cards Grid - Compact 2x2 */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          {/* Discord */}
          <div 
            className="glass-card p-4 border-s-4 border-s-discord hover:border-s-discord/80 cursor-pointer group"
            onClick={() => copyToClipboard('king_salman1')}
            onMouseEnter={() => playSound('hover')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-discord/20 flex items-center justify-center shrink-0">
                <DiscordIcon className="w-5 h-5 text-discord" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold">{t('contact.discord.title')}</h3>
                <p className="font-mono text-xs truncate">king_salman1</p>
              </div>
              <CopyIcon className="w-4 h-4 text-muted-foreground group-hover:text-discord transition-colors shrink-0" />
            </div>
          </div>

          {/* WhatsApp */}
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playSound('click')}
            onMouseEnter={() => playSound('hover')}
            className="glass-card p-4 border-s-4 border-s-whatsapp hover:border-s-whatsapp/80 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-whatsapp/20 flex items-center justify-center shrink-0">
                <WhatsAppIcon className="w-5 h-5 text-whatsapp" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold">{t('contact.whatsapp.title')}</h3>
                <p className="font-mono text-xs truncate direction-ltr">+212 607-566602</p>
              </div>
            </div>
          </a>

          {/* Gmail */}
          <a
            href={getEmailUrl()}
            onClick={() => playSound('click')}
            onMouseEnter={() => playSound('hover')}
            className="glass-card p-4 border-s-4 border-s-gmail hover:border-s-gmail/80 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gmail/20 flex items-center justify-center shrink-0">
                <MailIcon className="w-5 h-5 text-gmail" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold">{t('contact.gmail.title')}</h3>
                <p className="font-mono text-xs truncate">salmanarid17@gmail.com</p>
              </div>
            </div>
          </a>

          {/* Instagram */}
          <div className="glass-card p-4 border-s-4 border-s-instagram/50 opacity-70 relative">
            <span className="absolute top-2 end-2 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-instagram/20 text-instagram">
              {t('contact.instagram.comingSoon')}
            </span>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-instagram/20 flex items-center justify-center shrink-0">
                <InstagramIcon className="w-5 h-5 text-instagram" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold">{t('contact.instagram.title')}</h3>
                <p className="font-mono text-xs truncate text-muted-foreground">@core_cms</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods in Contact */}
        <div className="glass-card p-4 mb-10 text-center">
          <p className="text-sm text-muted-foreground mb-3">{t('keys.paymentMethods')}</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="h-9 w-16 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-sm">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                alt="PayPal"
                className="h-5 object-contain"
              />
            </div>
            <div className="h-9 w-16 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-sm">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                alt="Visa"
                className="h-4 object-contain"
              />
            </div>
            <div className="h-9 w-16 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-sm">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                alt="Mastercard"
                className="h-5 object-contain"
              />
            </div>
          </div>
        </div>

        {/* FAQ Section - Compact */}
        <div>
          <h3 className="text-lg font-bold text-primary mb-4 text-center">
            {t('faq.title')}
          </h3>

          <div className="space-y-2">
            {faqItems.map(faqKey => (
              <div
                key={faqKey}
                className={`accordion-item ${openFaq === faqKey ? 'border-l-4 border-l-primary' : ''}`}
                data-state={openFaq === faqKey ? 'open' : 'closed'}
              >
                <button
                  onClick={() => toggleFaq(faqKey)}
                  className="w-full p-3 flex items-center justify-between text-start"
                >
                  <span className="text-sm font-semibold">{t(`faq.${faqKey}`)}</span>
                  <ChevronDownIcon
                    className={`w-4 h-4 transition-transform duration-300 shrink-0 ${
                      openFaq === faqKey ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === faqKey ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="px-3 pb-3 text-sm text-muted-foreground">
                    {t(`faq.a${faqKey.slice(1)}`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
