import { useState } from 'react';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Ranks } from '@/components/Ranks';
import { Keys } from '@/components/Keys';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { LoginModal } from '@/components/LoginModal';

const Index = () => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  return (
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
    </div>
  );
};

export default Index;
