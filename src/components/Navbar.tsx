import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import logo from '@/assets/logo.png';
import {
  SunIcon,
  MoonIcon,
  CartIcon,
  MenuIcon,
  CloseIcon,
  ChevronDownIcon,
  LogoutIcon,
} from '@/components/icons';

interface NavbarProps {
  onLoginClick: () => void;
}

export function Navbar({ onLoginClick }: NavbarProps) {
  const { t, language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isLoggedIn } = useAuth();
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { id: 'home', label: t('nav.home') },
    { id: 'ranks', label: t('nav.ranks') },
    { id: 'keys', label: t('nav.keys') },
    { id: 'contact', label: t('nav.contact') },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'ranks', 'keys', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-navbar">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="Core CMS" className="w-10 h-10 object-contain" />
            <div>
              <h1 className="font-bold text-lg leading-tight">Core CMS</h1>
              <p className="text-xs text-muted-foreground">{t('nav.premiumShop')}</p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`nav-link ${activeSection === link.id ? 'active' : ''}`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <SunIcon className="w-5 h-5" />
              ) : (
                <MoonIcon className="w-5 h-5" />
              )}
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="p-1 rounded-lg hover:bg-secondary transition-colors"
              aria-label="Toggle language"
            >
              <img
                src={language === 'ar' 
                  ? 'https://flagcdn.com/w20/ma.png' 
                  : 'https://flagcdn.com/w20/gb.png'
                }
                alt={language === 'ar' ? 'Morocco' : 'UK'}
                className="w-6 h-4 object-cover rounded"
              />
            </button>

            {/* Cart */}
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors relative">
              <CartIcon className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-semibold">
                0
              </span>
            </button>

            {/* User / Login */}
            {isLoggedIn && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-secondary transition-colors"
                >
                  <img
                    src={user.skinUrl}
                    alt={user.username}
                    className="w-9 h-9 rounded-full skin-preview"
                  />
                  <span className="hidden sm:inline font-medium">{user.username}</span>
                  <ChevronDownIcon className={`w-4 h-4 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {userDropdownOpen && (
                  <div className="absolute top-full mt-2 end-0 glass-card p-4 min-w-[200px] animate-fade-in">
                    <div className="flex flex-col items-center gap-3">
                      <img
                        src={user.skinUrl}
                        alt={user.username}
                        className="w-16 h-16 rounded-xl skin-preview"
                      />
                      <div className="text-center">
                        <p className="font-bold">{user.username}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full">
                          {user.accountType}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors"
                      >
                        <LogoutIcon className="w-4 h-4" />
                        {t('nav.logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="hidden sm:block px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
              >
                {t('nav.login')}
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              {mobileMenuOpen ? (
                <CloseIcon className="w-5 h-5" />
              ) : (
                <MenuIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`nav-link text-start ${activeSection === link.id ? 'active' : ''}`}
                >
                  {link.label}
                </button>
              ))}
              {!isLoggedIn && (
                <button
                  onClick={() => {
                    onLoginClick();
                    setMobileMenuOpen(false);
                  }}
                  className="mt-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
                >
                  {t('nav.login')}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
