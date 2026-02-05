 import { useState, useEffect } from 'react';
 import { useNavigate, Link } from 'react-router-dom';
 import { useLanguage } from '@/contexts/LanguageContext';
 import { supabase } from '@/integrations/supabase/client';
 import { AnimatedBackground } from '@/components/AnimatedBackground';
 import { Navbar } from '@/components/Navbar';
 import { LoginModal } from '@/components/LoginModal';
 import { StoreIcon, CheckIcon } from '@/components/icons';
 
 const SellerRegister = () => {
   const navigate = useNavigate();
   const { language } = useLanguage();
   const [loginModalOpen, setLoginModalOpen] = useState(false);
   const [isLoggedIn, setIsLoggedIn] = useState(false);
   const [loading, setLoading] = useState(true);
   const [submitting, setSubmitting] = useState(false);
   const [submitted, setSubmitted] = useState(false);
 
   useEffect(() => {
     const checkAuth = async () => {
       const { data: { session } } = await supabase.auth.getSession();
       setIsLoggedIn(!!session?.user);
       setLoading(false);
     };
     checkAuth();
 
     const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
       setIsLoggedIn(!!session?.user);
     });
 
     return () => subscription.unsubscribe();
   }, []);
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setSubmitting(true);
 
     // For now, just show a success message
     // In production, you'd create an application record or send to admin
     setTimeout(() => {
       setSubmitting(false);
       setSubmitted(true);
     }, 1500);
   };
 
   if (loading) {
     return (
       <div className="min-h-screen flex items-center justify-center bg-background">
         <div className="animate-pulse">
           <StoreIcon className="w-16 h-16 mx-auto text-muted-foreground" />
         </div>
       </div>
     );
   }
 
   const benefits = [
     { ar: 'إنشاء متجر مخصص لسيرفرك', en: 'Create a custom store for your server' },
     { ar: 'بيع الرتب والمفاتيح بسهولة', en: 'Easily sell ranks and keys' },
     { ar: 'تتبع المبيعات والطلبات', en: 'Track sales and orders' },
     { ar: 'ربط مباشر مع سيرفر Minecraft', en: 'Direct integration with Minecraft server' },
     { ar: 'دعم فني على مدار الساعة', en: '24/7 technical support' },
   ];
 
   return (
     <div className="min-h-screen relative">
       <AnimatedBackground />
       <Navbar onLoginClick={() => setLoginModalOpen(true)} />
       
       <main className="container mx-auto px-4 pt-32 pb-16">
         <div className="max-w-2xl mx-auto">
           {submitted ? (
             <div className="glass-card p-8 text-center">
               <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                 <CheckIcon className="w-10 h-10 text-green-500" />
               </div>
               <h1 className="text-2xl font-bold mb-4">
                 {language === 'ar' ? 'تم إرسال طلبك بنجاح!' : 'Application Submitted!'}
               </h1>
               <p className="text-muted-foreground mb-6">
                 {language === 'ar'
                   ? 'سنراجع طلبك ونتواصل معك قريباً. عادة ما تستغرق المراجعة 24-48 ساعة.'
                   : 'We\'ll review your application and contact you soon. Review typically takes 24-48 hours.'
                 }
               </p>
               <Link to="/" className="btn-primary">
                 {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
               </Link>
             </div>
           ) : (
             <>
               <div className="text-center mb-8">
                 <StoreIcon className="w-16 h-16 mx-auto text-primary mb-4" />
                 <h1 className="text-3xl font-bold gradient-text mb-4">
                   {language === 'ar' ? 'سجل كبائع' : 'Register as Seller'}
                 </h1>
                 <p className="text-muted-foreground">
                   {language === 'ar'
                     ? 'انضم لمنصتنا وابدأ ببيع الرتب والمفاتيح لسيرفرك'
                     : 'Join our platform and start selling ranks & keys for your server'
                   }
                 </p>
               </div>
 
               {/* Benefits */}
               <div className="glass-card p-6 mb-8">
                 <h2 className="font-semibold mb-4">{language === 'ar' ? 'لماذا تنضم إلينا؟' : 'Why Join Us?'}</h2>
                 <ul className="space-y-3">
                   {benefits.map((benefit, i) => (
                     <li key={i} className="flex items-center gap-3">
                       <CheckIcon className="w-5 h-5 text-primary flex-shrink-0" />
                       <span>{language === 'ar' ? benefit.ar : benefit.en}</span>
                     </li>
                   ))}
                 </ul>
               </div>
 
               {!isLoggedIn ? (
                 <div className="glass-card p-8 text-center">
                   <p className="text-muted-foreground mb-4">
                     {language === 'ar' ? 'يجب تسجيل الدخول أولاً للتقديم كبائع' : 'You must log in first to apply as a seller'}
                   </p>
                   <button onClick={() => setLoginModalOpen(true)} className="btn-primary">
                     {language === 'ar' ? 'تسجيل الدخول' : 'Log In'}
                   </button>
                 </div>
               ) : (
                 <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
                   <div>
                     <label className="block text-sm font-medium mb-2">
                       {language === 'ar' ? 'اسم السيرفر' : 'Server Name'}
                     </label>
                     <input
                       type="text"
                       required
                       className="w-full p-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none"
                       placeholder={language === 'ar' ? 'مثال: سيرفر الأحلام' : 'Example: Dream Server'}
                     />
                   </div>
 
                   <div>
                     <label className="block text-sm font-medium mb-2">
                       {language === 'ar' ? 'عنوان السيرفر (IP)' : 'Server IP'}
                     </label>
                     <input
                       type="text"
                       required
                       className="w-full p-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none font-mono"
                       placeholder="play.myserver.com"
                     />
                   </div>
 
                   <div>
                     <label className="block text-sm font-medium mb-2">
                       {language === 'ar' ? 'رابط Discord (اختياري)' : 'Discord URL (optional)'}
                     </label>
                     <input
                       type="url"
                       className="w-full p-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none"
                       placeholder="https://discord.gg/..."
                     />
                   </div>
 
                   <div>
                     <label className="block text-sm font-medium mb-2">
                       {language === 'ar' ? 'لماذا تريد الانضمام؟' : 'Why do you want to join?'}
                     </label>
                     <textarea
                       required
                       rows={4}
                       className="w-full p-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none resize-none"
                       placeholder={language === 'ar' ? 'أخبرنا عن سيرفرك وخططك...' : 'Tell us about your server and plans...'}
                     />
                   </div>
 
                   <button
                     type="submit"
                     disabled={submitting}
                     className="btn-primary w-full"
                   >
                     {submitting 
                       ? (language === 'ar' ? 'جارِ الإرسال...' : 'Submitting...') 
                       : (language === 'ar' ? 'إرسال الطلب' : 'Submit Application')
                     }
                   </button>
                 </form>
               )}
             </>
           )}
         </div>
       </main>
 
       <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
     </div>
   );
 };
 
 export default SellerRegister;