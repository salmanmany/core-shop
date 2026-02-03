import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { ToastContainer } from '@/components/ToastContainer';
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const App = () => (
  <ThemeProvider>
    <LanguageProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <ToastContainer />
        </ToastProvider>
      </AuthProvider>
    </LanguageProvider>
  </ThemeProvider>
);

export default App;
