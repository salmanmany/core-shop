import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useSound } from '@/hooks/useSound';
import { useAdmin } from '@/hooks/useAdmin';
 import { useSeller } from '@/hooks/useSeller';
import { supabase } from '@/integrations/supabase/client';
import logo from '@/assets/logo.png';
import { CartDrawer } from '@/components/CartDrawer';
import {
  SunIcon,
  MoonIcon,
  CartIcon,
  MenuIcon,
  CloseIcon,
  ChevronDownIcon,
  LogoutIcon,
  SettingsIcon,
   StoreIcon,
} from '@/components/icons';

interface NavbarProps {
  onLoginClick?: () => void;
}

interface SupabaseUser {
  id: string;
  email: string | null;
  avatar_url: string | null;
  display_name: string | null;
}

export function Navbar({ onLoginClick }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user: localUser, logout: localLogout, isLoggedIn: isLocalLoggedIn } = useAuth();
  const { totalItems } = useCart();
  const { playSound } = useSound();
  const { isAdmin } = useAdmin();
   const { isSeller } = useSeller();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Supabase auth state
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [isSupabaseLoggedIn, setIsSupabaseLoggedIn] = useState(false);

  // Check Supabase auth on mount
  useEffect(() => {
    const checkSupabaseAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setIsSupabaseLoggedIn(true);
        setSupabaseUser({
          id: session.user.id,
          email: session.user.email || null,
          avatar_url: session.user.user_metadata?.avatar_url || null,
          display_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || null,
        });
      }
    };
    
    checkSupabaseAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setIsSupabaseLoggedIn(true);
        setSupabaseUser({
          id: session.user.id,
          email: session.user.email || null,
          avatar_url: session.user.user_metadata?.avatar_url || null,
          display_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || null,
        });
      } else {
        setIsSupabaseLoggedIn(false);
        setSupabaseUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Determine if logged in (either localStorage or Supabase)
  const isLoggedIn = isLocalLoggedIn || isSupabaseLoggedIn;

  const navLinks = [
    { path: '/', label: t('nav.home') },
     { path: '/discover', label: t('nav.discover') },
    { path: '/ranks', label: t('nav.ranks') },
    { path: '/keys', label: t('nav.keys') },
    { path: '/mods', label: t('nav.mods') },
    { path: '/contact', label: t('nav.contact') },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-navbar">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-3 group"
              onClick={() => playSound('click')}
              onMouseEnter={() => playSound('hover')}
            >
              <img src={logo} alt="Core CMS" className="w-10 h-10 object-contain group-hover:animate-wiggle" />
              <div>
                <h1 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">Core CMS</h1>
                <p className="text-xs text-muted-foreground">{t('nav.premiumShop')}</p>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => playSound('click')}
                  onMouseEnter={() => playSound('hover')}
                  className={`nav-link hover:text-primary hover:bg-primary/10 ${location.pathname === link.path ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => playSound('anvil')}
                  onMouseEnter={() => playSound('hover')}
                  className={`nav-link hover:text-primary hover:bg-primary/10 flex items-center gap-1 ${location.pathname === '/admin' ? 'active' : ''}`}
                >
                  <SettingsIcon className="w-4 h-4" />
                  {t('nav.admin')}
                </Link>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1.5">
              {/* Theme Toggle */}
              <button
                onClick={() => {
                  playSound('pop');
                  toggleTheme();
                }}
                onMouseEnter={() => playSound('hover')}
                className="p-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
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
                onClick={() => {
                  playSound('pop');
                  toggleLanguage();
                }}
                onMouseEnter={() => playSound('hover')}
                className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors"
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
              <button 
                onClick={() => {
                  playSound('chest');
                  setCartOpen(true);
                }}
                onMouseEnter={() => playSound('hover')}
                className="p-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors relative group"
              >
                <CartIcon className="w-5 h-5 group-hover:animate-wiggle" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-semibold animate-bounce-in">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* User / Login */}
              {isLoggedIn ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => {
                      playSound('click');
                      setUserDropdownOpen(!userDropdownOpen);
                    }}
                    onMouseEnter={() => playSound('hover')}
                    className="flex items-center gap-2 p-1 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    <img
                      src={isSupabaseLoggedIn 
                        ? (supabaseUser?.avatar_url || 'https://mc-heads.net/avatar/Steve/100')
                        : localUser?.skinUrl || 'https://mc-heads.net/avatar/Steve/100'
                      }
                      alt="Avatar"
                      className="w-9 h-9 rounded-full skin-preview"
                    />
                    <span className="hidden sm:inline font-medium">
                      {isSupabaseLoggedIn 
                        ? (supabaseUser?.display_name || supabaseUser?.email?.split('@')[0])
                        : localUser?.username
                      }
                    </span>
                    <ChevronDownIcon className={`w-4 h-4 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute top-full mt-2 end-0 glass-card p-4 min-w-[200px] animate-scale-bounce">
                      <div className="flex flex-col items-center gap-3">
                        <img
                          src={isSupabaseLoggedIn 
                            ? (supabaseUser?.avatar_url || 'https://mc-heads.net/avatar/Steve/100')
                            : localUser?.skinUrl || 'https://mc-heads.net/avatar/Steve/100'
                          }
                          alt="Avatar"
                          className="w-16 h-16 rounded-xl skin-preview"
                        />
                        <div className="text-center">
                          <p className="font-bold">
                            {isSupabaseLoggedIn 
                              ? (supabaseUser?.display_name || supabaseUser?.email?.split('@')[0])
                              : localUser?.username
                            }
                          </p>
                          {isSupabaseLoggedIn && supabaseUser?.email && (
                            <p className="text-xs text-muted-foreground">{supabaseUser.email}</p>
                          )}
                          {!isSupabaseLoggedIn && localUser?.accountType && (
                            <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full">
                              {localUser.accountType}
                            </span>
                          )}
                        </div>
                        
                        {/* Profile Link */}
                        {isSupabaseLoggedIn && (
                          <button
                            onClick={() => {
                              playSound('click');
                              navigate('/profile');
                              setUserDropdownOpen(false);
                            }}
                            onMouseEnter={() => playSound('hover')}
                            className="w-full p-2 rounded-lg bg-secondary hover:bg-primary/20 hover:text-primary transition-colors text-center"
                          >
                            {t('profile.title')}
                          </button>
                        )}

                         {/* Seller Dashboard Link */}
                         {isSeller && (
                           <button
                             onClick={() => {
                               playSound('click');
                               navigate('/seller');
                               setUserDropdownOpen(false);
                             }}
                             onMouseEnter={() => playSound('hover')}
                             className="w-full p-2 rounded-lg bg-secondary hover:bg-primary/20 hover:text-primary transition-colors text-center flex items-center justify-center gap-2"
                           >
                             <StoreIcon className="w-4 h-4" />
                             {t('nav.seller')}
                           </button>
                         )}
 
                        {/* Admin Link */}
                        {isAdmin && (
                          <button
                            onClick={() => {
                              playSound('anvil');
                              navigate('/admin');
                              setUserDropdownOpen(false);
                            }}
                            onMouseEnter={() => playSound('hover')}
                            className="w-full p-2 rounded-lg bg-secondary hover:bg-primary/20 hover:text-primary transition-colors text-center flex items-center justify-center gap-2"
                          >
                            <SettingsIcon className="w-4 h-4" />
                            {t('nav.admin')}
                          </button>
                        )}
                        
                        <button
                          onClick={async () => {
                            playSound('click');
                            if (isSupabaseLoggedIn) {
                              await supabase.auth.signOut();
                            } else {
                              localLogout();
                            }
                            setUserDropdownOpen(false);
                          }}
                          onMouseEnter={() => playSound('hover')}
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
                  onClick={() => {
                    playSound('click');
                    onLoginClick?.();
                  }}
                  onMouseEnter={() => playSound('hover')}
                  className="hidden sm:block px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:scale-105 hover:animate-glow-pulse transition-all"
                >
                  {t('nav.login')}
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => {
                  playSound('click');
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
                className="md:hidden p-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
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
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => {
                      playSound('click');
                      setMobileMenuOpen(false);
                    }}
                    className={`nav-link text-start hover:text-primary hover:bg-primary/10 ${location.pathname === link.path ? 'active' : ''}`}
                  >
                    {link.label}
                  </Link>
                ))}
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => {
                      playSound('anvil');
                      setMobileMenuOpen(false);
                    }}
                    className="nav-link text-start hover:text-primary hover:bg-primary/10 flex items-center gap-2"
                  >
                    <SettingsIcon className="w-4 h-4" />
                    {t('nav.admin')}
                  </Link>
                )}
                 {isSeller && (
                   <Link
                     to="/seller"
                     onClick={() => {
                       playSound('click');
                       setMobileMenuOpen(false);
                     }}
                     className="nav-link text-start hover:text-primary hover:bg-primary/10 flex items-center gap-2"
                   >
                     <StoreIcon className="w-4 h-4" />
                     {t('nav.seller')}
                   </Link>
                 )}
                {!isLoggedIn && (
                  <button
                    onClick={() => {
                      playSound('click');
                      onLoginClick?.();
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

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
