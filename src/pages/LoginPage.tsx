import { AnimatedBackground } from '@/components/AnimatedBackground';
import { LoginModal } from '@/components/LoginModal';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/logo.png';

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-x-hidden flex items-center justify-center">
      <AnimatedBackground />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Core CMS" className="w-16 h-16 object-contain mb-4" />
          <h1 className="font-bold text-2xl">Core CMS</h1>
        </div>
        <LoginModal 
          isOpen={true} 
          onClose={() => navigate('/')} 
        />
      </div>
    </div>
  );
};

export default LoginPage;
