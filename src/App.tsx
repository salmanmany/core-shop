import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { ToastContainer } from '@/components/ToastContainer';
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import RanksPage from "./pages/RanksPage";
import KeysPage from "./pages/KeysPage";
import ContactPage from "./pages/ContactPage";
import ModsPage from "./pages/ModsPage";
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
              <Route path="/ranks" element={<RanksPage />} />
              <Route path="/keys" element={<KeysPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/mods" element={<ModsPage />} />
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
