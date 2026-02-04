import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { CartProvider } from '@/contexts/CartContext';
import { ToastContainer } from '@/components/ToastContainer';
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import RanksPage from "./pages/RanksPage";
import KeysPage from "./pages/KeysPage";
import ContactPage from "./pages/ContactPage";
import ModsPage from "./pages/ModsPage";
import AdminPage from "./pages/AdminPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import NotFound from "./pages/NotFound";

const App = () => (
  <ThemeProvider>
    <LanguageProvider>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/ranks" element={<RanksPage />} />
                <Route path="/keys" element={<KeysPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/mods" element={<ModsPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/payment-success" element={<PaymentSuccessPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            <ToastContainer />
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </LanguageProvider>
  </ThemeProvider>
);

export default App;
