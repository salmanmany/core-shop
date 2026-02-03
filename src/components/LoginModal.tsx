import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToastContext } from '@/contexts/ToastContext';
import logo from '@/assets/logo.png';
import {
  CloseIcon,
  SearchIcon,
  CoffeeIcon,
  KeyIcon,
  SmartphoneIcon,
} from '@/components/icons';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const accountTypes = [
  { key: 'autoDetect', icon: SearchIcon },
  { key: 'javaOriginal', icon: CoffeeIcon },
  { key: 'javaCracked', icon: KeyIcon },
  { key: 'bedrock', icon: SmartphoneIcon },
] as const;

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { t, language } = useLanguage();
  const { login } = useAuth();
  const { showToast } = useToastContext();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState('autoDetect');
  const [skinUrl, setSkinUrl] = useState('https://mc-heads.net/avatar/Steve/100');
  const [error, setError] = useState('');

  // Debounced skin update
  const updateSkin = useCallback((name: string) => {
    if (name.trim()) {
      setSkinUrl(`https://mc-heads.net/avatar/${name}/100`);
    } else {
      setSkinUrl('https://mc-heads.net/avatar/Steve/100');
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateSkin(username);
    }, 600);

    return () => clearTimeout(timer);
  }, [username, updateSkin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      return;
    }

    const accountTypeLabel = t(`login.${accountType}`);
    const result = login(username.trim(), password, accountTypeLabel);

    if (result.success) {
      showToast(`${t('login.welcomeMessage')} ${username}!`);
      onClose();
      setUsername('');
      setPassword('');
      setAccountType('autoDetect');
    } else if (result.error === 'wrongPassword') {
      setError(t('login.wrongPassword'));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-card w-full max-w-md mx-4 p-6 animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 end-4 p-2 rounded-lg hover:bg-secondary transition-colors"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Core CMS" className="w-16 h-16 object-contain" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-center mb-2">
          {t('login.title')}
        </h2>
        <p className="text-sm text-muted-foreground text-center mb-6">
          {t('login.info')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder={t('login.usernamePlaceholder')}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none transition-colors"
          />

          {/* Skin Preview */}
          <div className="flex justify-center">
            <img
              src={skinUrl}
              alt="Minecraft Skin"
              className="w-28 h-28 skin-preview"
              onError={() => setSkinUrl('https://mc-heads.net/avatar/Steve/100')}
            />
          </div>

          {/* Account Type */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              {t('login.accountType')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {accountTypes.map(type => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.key}
                    type="button"
                    onClick={() => setAccountType(type.key)}
                    className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${
                      accountType === type.key
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm">{t(`login.${type.key}`)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={t('login.passwordPlaceholder')}
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none transition-colors"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {t('login.passwordNote')}
            </p>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full btn-primary"
          >
            {t('login.loginButton')}
          </button>

          {/* Back Link */}
          <button
            type="button"
            onClick={onClose}
            className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('login.backToStore')}
          </button>
        </form>
      </div>
    </div>
  );
}
