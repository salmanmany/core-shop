import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToastContext } from '@/contexts/ToastContext';
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
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast(t('contact.copied'));
  };

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className={`text-center mb-12 ${language === 'ar' ? 'text-right md:text-center' : ''}`}>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {t('contact.title')} <span className="text-primary">{t('contact.titleAccent')}</span>
          </h2>
        </div>

        {/* Social Cards Grid */}
        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          {/* Discord */}
          <div className="social-card border-l-4 border-l-discord">
            <div className="w-14 h-14 rounded-xl bg-discord/20 flex items-center justify-center mb-4">
              <DiscordIcon className="w-8 h-8 text-discord" />
            </div>
            <h3 className="text-xl font-bold mb-2">{t('contact.discord.title')}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t('contact.discord.desc')}</p>
            <p className="font-mono text-lg mb-4">king_salman1</p>
            <button
              onClick={() => copyToClipboard('king_salman1')}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-discord text-white font-semibold transition-all hover:scale-105"
            >
              <CopyIcon className="w-4 h-4" />
              {t('contact.discord.copy')}
            </button>
          </div>

          {/* WhatsApp */}
          <div className="social-card border-l-4 border-l-whatsapp">
            <div className="w-14 h-14 rounded-xl bg-whatsapp/20 flex items-center justify-center mb-4">
              <WhatsAppIcon className="w-8 h-8 text-whatsapp" />
            </div>
            <h3 className="text-xl font-bold mb-2">{t('contact.whatsapp.title')}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t('contact.whatsapp.desc')}</p>
            <p className="font-mono text-lg mb-4 direction-ltr">+212 607-566602</p>
            <a
              href="https://wa.me/212607566602"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-whatsapp text-white font-semibold transition-all hover:scale-105"
            >
              <WhatsAppIcon className="w-4 h-4" />
              {t('contact.whatsapp.open')}
            </a>
          </div>

          {/* Gmail */}
          <div className="social-card border-l-4 border-l-gmail">
            <div className="w-14 h-14 rounded-xl bg-gmail/20 flex items-center justify-center mb-4">
              <MailIcon className="w-8 h-8 text-gmail" />
            </div>
            <h3 className="text-xl font-bold mb-2">{t('contact.gmail.title')}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t('contact.gmail.desc')}</p>
            <p className="font-mono text-lg mb-4 break-all">salmanarid17@gmail.com</p>
            <a
              href="mailto:salmanarid17@gmail.com"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gmail text-white font-semibold transition-all hover:scale-105"
            >
              <MailIcon className="w-4 h-4" />
              {t('contact.gmail.send')}
            </a>
          </div>

          {/* Instagram */}
          <div className="social-card border-l-4 border-l-instagram relative">
            <span className="absolute top-4 end-4 px-2 py-0.5 rounded-full text-xs font-semibold bg-instagram/20 text-instagram">
              {t('contact.instagram.comingSoon')}
            </span>
            <div className="w-14 h-14 rounded-xl bg-instagram/20 flex items-center justify-center mb-4">
              <InstagramIcon className="w-8 h-8 text-instagram" />
            </div>
            <h3 className="text-xl font-bold mb-2">{t('contact.instagram.title')}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t('contact.instagram.desc')}</p>
            <p className="font-mono text-lg mb-4 text-muted-foreground">@core_cms</p>
            <button
              disabled
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-muted text-muted-foreground font-semibold cursor-not-allowed"
            >
              {t('contact.instagram.comingSoon')}
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-primary mb-6 text-center">
            {t('faq.title')}
          </h3>

          <div className="space-y-4">
            {faqItems.map(faqKey => (
              <div
                key={faqKey}
                className={`accordion-item ${openFaq === faqKey ? 'border-l-4 border-l-primary' : ''}`}
                data-state={openFaq === faqKey ? 'open' : 'closed'}
              >
                <button
                  onClick={() => toggleFaq(faqKey)}
                  className="w-full p-4 flex items-center justify-between text-start"
                >
                  <span className="font-semibold">{t(`faq.${faqKey}`)}</span>
                  <ChevronDownIcon
                    className={`w-5 h-5 transition-transform duration-300 ${
                      openFaq === faqKey ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === faqKey ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="px-4 pb-4 text-muted-foreground">
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
