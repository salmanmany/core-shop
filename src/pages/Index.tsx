import { useState } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Ranks } from '@/components/Ranks';
import { Keys } from '@/components/Keys';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { LoginModal } from '@/components/LoginModal';
import { ToastContainer } from '@/components/ToastContainer';

const Index = () => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <div className="min-h-screen relative overflow-x-hidden">
              <AnimatedBackground />
              <Navbar onLoginClick={() => setLoginModalOpen(true)} />
              <main>
                <Hero />
                <Ranks />
                <Keys />
                <Contact />
              </main>
              <Footer />
              <LoginModal 
                isOpen={loginModalOpen} 
                onClose={() => setLoginModalOpen(false)} 
              />
              <ToastContainer />
            </div>
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default Index;
