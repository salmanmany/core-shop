export type Language = 'ar' | 'en';

export const translations = {
  // Navbar
  nav: {
    home: { ar: 'الرئيسية', en: 'Home' },
    ranks: { ar: 'الرتب', en: 'Ranks' },
    keys: { ar: 'المفاتيح', en: 'Keys' },
    mods: { ar: 'المودات', en: 'Mods' },
    contact: { ar: 'التواصل', en: 'Contact' },
    login: { ar: 'تسجيل الدخول', en: 'Login' },
    logout: { ar: 'تسجيل الخروج', en: 'Logout' },
    premiumShop: { ar: 'متجر فاخر', en: 'Premium Shop' },
    admin: { ar: 'لوحة التحكم', en: 'Admin' },
     discover: { ar: 'اكتشف المتاجر', en: 'Discover' },
     seller: { ar: 'لوحة البائع', en: 'Seller Dashboard' },
  },

  // Cart
  cart: {
    title: { ar: 'سلة التسوق', en: 'Shopping Cart' },
    empty: { ar: 'سلتك فارغة', en: 'Your cart is empty' },
    total: { ar: 'المجموع', en: 'Total' },
    clear: { ar: 'إفراغ', en: 'Clear' },
    checkout: { ar: 'الدفع', en: 'Checkout' },
    addedToCart: { ar: 'تمت الإضافة للسلة', en: 'Added to cart' },
  },

  // Admin
  admin: {
    title: { ar: 'لوحة التحكم', en: 'Admin Dashboard' },
    ranks: { ar: 'إدارة الرتب', en: 'Manage Ranks' },
    keys: { ar: 'إدارة المفاتيح', en: 'Manage Keys' },
    mods: { ar: 'إدارة المودات', en: 'Manage Mods' },
    add: { ar: 'إضافة', en: 'Add' },
    edit: { ar: 'تعديل', en: 'Edit' },
    delete: { ar: 'حذف', en: 'Delete' },
    save: { ar: 'حفظ', en: 'Save' },
    cancel: { ar: 'إلغاء', en: 'Cancel' },
    confirmDelete: { ar: 'هل أنت متأكد من الحذف؟', en: 'Are you sure you want to delete?' },
    noAccess: { ar: 'ليس لديك صلاحية', en: 'Access denied' },
    saved: { ar: 'تم الحفظ بنجاح', en: 'Saved successfully' },
    deleted: { ar: 'تم الحذف بنجاح', en: 'Deleted successfully' },
  },
  
  // Hero
  hero: {
    tagline: { ar: 'منزلك الثاني', en: 'Your Second Home' },
    welcome: { ar: 'مرحباً بك، سلمان', en: 'Welcome, Salman' },
    description: {
      ar: 'استمتع بتجربة تسوق فريدة مصممة خصيصاً للاعبين. نحن هنا لنرتقي بمغامرتك.',
      en: 'Enjoy a unique shopping experience tailored for players. We are here to elevate your adventure.'
    },
    exploreCta: { ar: 'ابدأ الاستكشاف', en: 'Start Exploring' },
    viewOffers: { ar: 'مشاهدة العروض', en: 'View Offers' },
  },
  
  // Ranks Section
  ranks: {
    title: { ar: 'الرتب', en: 'Ranks' },
    titleAccent: { ar: 'المميزة', en: 'Premium' },
    subtitle: {
      ar: 'اختر رتبتك واحصل على مميزات حصرية داخل السيرفر',
      en: 'Choose your rank and unlock exclusive perks inside the server'
    },
    finalPrice: { ar: 'سعر نهائي', en: 'Final Price' },
    perks: { ar: 'المميزات', en: 'Perks' },
    alsoGet: { ar: 'ستحصل أيضاً على', en: 'You will also get' },
    buyNow: { ar: 'اشترِ الآن', en: 'Buy Now' },
  },
  
  // Keys Section
  keys: {
    title: { ar: 'المفاتيح', en: 'Keys' },
    titleAccent: { ar: 'السحرية', en: 'Magic' },
    subtitle: {
      ar: 'افتح الصناديق واحصل على جوائز أسطورية',
      en: 'Open crates and win legendary rewards'
    },
    paymentMethods: { ar: 'طرق الدفع المقبولة', en: 'Accepted Payment Methods' },
  },
  
  // Contact Section
  contact: {
    title: { ar: 'تواصل', en: 'Contact' },
    titleAccent: { ar: 'معنا', en: 'Us' },
    discord: {
      title: { ar: 'ديسكورد', en: 'Discord' },
      desc: { ar: 'انضم لسيرفر الديسكورد واحصل على دعم فوري', en: 'Join our Discord for instant support' },
      copy: { ar: 'نسخ اسم المستخدم', en: 'Copy Username' },
    },
    whatsapp: {
      title: { ar: 'واتساب', en: 'WhatsApp' },
      desc: { ar: 'تواصل معنا مباشرة عبر الواتساب', en: 'Contact us directly on WhatsApp' },
      open: { ar: 'فتح واتساب', en: 'Open WhatsApp' },
    },
    gmail: {
      title: { ar: 'جيميل', en: 'Gmail' },
      desc: { ar: 'تواصل معنا عبر البريد الإلكتروني', en: 'Contact us via email' },
      send: { ar: 'إرسال بريد', en: 'Send Email' },
    },
    instagram: {
      title: { ar: 'انستغرام', en: 'Instagram' },
      desc: { ar: 'تابعنا على Instagram', en: 'Follow us on Instagram' },
      comingSoon: { ar: 'قريباً', en: 'Coming Soon' },
    },
    copied: { ar: 'تم النسخ بنجاح', en: 'Copied successfully' },
  },

  // Mods Section
  mods: {
    title: { ar: 'المودات', en: 'Mods' },
    titleAccent: { ar: 'المميزة', en: 'Featured' },
    subtitle: { ar: 'حمّل أفضل المودات لتحسين تجربة اللعب', en: 'Download the best mods to enhance your gameplay' },
    download: { ar: 'تحميل', en: 'Download' },
    noMods: { ar: 'لا توجد مودات حالياً', en: 'No mods available yet' },
  },
  
  // FAQ
  faq: {
    title: { ar: 'أسئلة شائعة', en: 'Frequently Asked Questions' },
    q1: { ar: 'كيف أشتري رتبة من المتجر؟', en: 'How do I buy a rank?' },
    a1: {
      ar: 'اختر الرتبة المناسبة، اضغط على اشترِ الآن، وأكمل عملية الدفع. سيتم تفعيل الرتبة تلقائياً خلال دقائق!',
      en: 'Choose a rank, click Buy Now, and complete payment. Your rank activates automatically within minutes!'
    },
    q2: { ar: 'هل يمكنني استرجاع أموالي؟', en: 'Can I get a refund?' },
    a2: {
      ar: 'نعم! نوفر ضمان استرجاع كامل خلال 24 ساعة من الشراء إذا لم تحصل على ما وعدنا به.',
      en: 'Yes! We offer a full refund within 24 hours if you did not receive what was promised.'
    },
    q3: { ar: 'كيف أحصل على الدعم الفني؟', en: 'How do I get support?' },
    a3: {
      ar: 'تواصل معنا عبر Discord أو WhatsApp. نحن متواجدون 24/7!',
      en: 'Contact us via Discord or WhatsApp. We are available 24/7!'
    },
    q4: { ar: 'هل المتجر آمن؟', en: 'Is the store secure?' },
    a4: {
      ar: 'نعم 100%! نستخدم بوابات دفع آمنة ومشفرة. بياناتك محمية بأحدث تقنيات الأمان.',
      en: 'Yes 100%! We use secure encrypted payment gateways. Your data is protected with latest security.'
    },
  },
  
  // Footer
  footer: {
    about: {
      ar: 'متجر ماينكرافت الأول في المغرب، نقدم أفضل الرتب والمفاتيح بأسعار ممتازة وبضمان 100%.',
      en: 'The #1 Minecraft store in Morocco. Best ranks and keys at great prices with 100% guarantee.'
    },
    contactTitle: { ar: 'تواصل معي يا بطل!', en: 'Contact me, Hero!' },
    developerTitle: { ar: 'المطور', en: 'Developer' },
    developerName: { ar: 'سلمان (King_Salman1)', en: 'Salman (King_Salman1)' },
    developerRole: { ar: 'مطور ولاعب', en: 'Gamer & Developer' },
    copyright: {
      ar: 'جميع الحقوق محفوظة 2025 - سلمان، فخر مبرمجي المغرب',
      en: 'All Rights Reserved 2025 - Salman, Proud Moroccan Developer'
    },
  },
  
  // Login Modal
  login: {
    title: { ar: 'سجل الدخول بحساب Minecraft', en: 'Log in with your Minecraft account' },
    info: { ar: 'اكتب اسم حسابك وسيظهر سكنك فوراً', en: 'Type your Minecraft username and your skin will appear instantly' },
    usernamePlaceholder: { ar: 'مثال: King_Salman1', en: 'Example: King_Salman1' },
    accountType: { ar: 'نوع الحساب', en: 'Account Type' },
    autoDetect: { ar: 'اكتشاف تلقائي', en: 'Auto Detect' },
    javaOriginal: { ar: 'جافا أصلي', en: 'Java Original' },
    javaCracked: { ar: 'جافا مكركة', en: 'Java Cracked' },
    bedrock: { ar: 'بيدروك', en: 'Bedrock' },
    passwordPlaceholder: { ar: 'كلمة المرور', en: 'Password' },
    passwordNote: { ar: 'إذا كان حسابك جديد، هذه ستكون كلمة مرورك', en: 'If your account is new, this will be your password' },
    loginButton: { ar: 'دخول', en: 'Login' },
    backToStore: { ar: 'العودة للمتجر بدون تسجيل', en: 'Back to store without login' },
    welcomeMessage: { ar: 'مرحباً بك', en: 'Welcome' },
    wrongPassword: { ar: 'كلمة المرور غير صحيحة', en: 'Wrong password' },
    orContinueWith: { ar: 'أو تابع باستخدام', en: 'Or continue with' },
    googleSignIn: { ar: 'تسجيل الدخول بـ Google', en: 'Sign in with Google' },
  },

  // Profile Page
  profile: {
    title: { ar: 'الملف الشخصي', en: 'My Profile' },
    subtitle: { ar: 'إدارة معلومات حسابك', en: 'Manage your account information' },
    email: { ar: 'البريد الإلكتروني', en: 'Email' },
    displayName: { ar: 'اسم العرض', en: 'Display Name' },
    displayNamePlaceholder: { ar: 'أدخل اسمك', en: 'Enter your name' },
    minecraftUsername: { ar: 'اسم مستخدم Minecraft', en: 'Minecraft Username' },
    minecraftUsernamePlaceholder: { ar: 'مثال: King_Salman1', en: 'Example: King_Salman1' },
    minecraftUsernameHint: { ar: 'سيتم تحديث صورتك تلقائياً بناءً على سكن Minecraft', en: 'Your avatar will update automatically based on your Minecraft skin' },
    memberSince: { ar: 'عضو منذ', en: 'Member Since' },
    saveButton: { ar: 'حفظ التغييرات', en: 'Save Changes' },
    saving: { ar: 'جارِ الحفظ...', en: 'Saving...' },
    saved: { ar: 'تم حفظ التغييرات بنجاح', en: 'Changes saved successfully' },
    logoutButton: { ar: 'تسجيل الخروج', en: 'Logout' },
    backToStore: { ar: 'العودة للمتجر', en: 'Back to Store' },
    errorLoading: { ar: 'خطأ في تحميل الملف الشخصي', en: 'Error loading profile' },
    errorSaving: { ar: 'خطأ في حفظ التغييرات', en: 'Error saving changes' },
  },
  
  // Ranks Data
  ranksData: {
    vip: {
      name: { ar: 'VIP', en: 'VIP' },
      desc: { ar: 'لون اسم مميز - الطيران في اللوبي - دخول السيرفر عند الامتلاء', en: 'Colored name - Lobby fly - Join full server' },
      reward: { ar: '1000 عملة + مفتاح أساسي', en: '1000 coins + Basic key' },
    },
    vipPlus: {
      name: { ar: 'VIP+', en: 'VIP+' },
      desc: { ar: 'لون اسم أزرق - رسائل ملونة - استخدام Pets', en: 'Blue name - Colored chat - Use Pets' },
      reward: { ar: '5000 عملة + 2 مفتاح نادر', en: '5000 coins + 2 rare keys' },
    },
    mvp: {
      name: { ar: 'MVP', en: 'MVP' },
      desc: { ar: 'لون بنفسجي - تغيير النك - أوامر /nick و /workbench', en: 'Purple name - Nick change - /nick and /workbench' },
      reward: { ar: '15000 عملة + 5 مفاتيح نادرة', en: '15000 coins + 5 rare keys' },
    },
    mvpPlus: {
      name: { ar: 'MVP+', en: 'MVP+' },
      desc: { ar: 'لون أحمر - خرائط حصرية - تأثيرات Particles', en: 'Red name - Exclusive maps - Particles' },
      reward: { ar: '50000 عملة + 10 مفاتيح أسطورية', en: '50000 coins + 10 legendary keys' },
    },
    legend: {
      name: { ar: 'Legend', en: 'Legend' },
      desc: { ar: 'لقب الأسطوري - Giveaways - مميزات غير محدودة', en: 'Legendary title - Giveaways - Unlimited perks' },
      reward: { ar: '100000 عملة + Kit أسطوري', en: '100000 coins + Legendary Kit' },
    },
  },
  
  // Keys Data
  keysData: {
    common: {
      name: { ar: 'المفتاح العادي', en: 'Common Key' },
      rarity: { ar: 'عادي', en: 'Common' },
      desc: { ar: 'مواد أساسية - أدوات مطورة - تعويضات عشوائية', en: 'Basic materials - Upgraded tools - Random rewards' },
    },
    rare: {
      name: { ar: 'المفتاح النادر', en: 'Rare Key' },
      rarity: { ar: 'نادر', en: 'Rare' },
      desc: { ar: 'دايموند - دروع مطورة - رؤوس لاعبين', en: 'Diamond - Upgraded armor - Player heads' },
    },
    legendary: {
      name: { ar: 'المفتاح الأسطوري', en: 'Legendary Key' },
      rarity: { ar: 'أسطوري', en: 'Legendary' },
      desc: { ar: 'أدوات OP - عملات ضخمة - رتبة VIP مؤقتة', en: 'OP tools - Huge coins - Temp VIP rank' },
    },
    rankKey: {
      name: { ar: 'مفتاح الرتب', en: 'Rank Key' },
      rarity: { ar: 'نادر جداً', en: 'Very Rare' },
      desc: { ar: 'رتب عشوائية من VIP إلى MVP+', en: 'Random ranks from VIP to MVP+' },
    },
  },
} as const;

export function t(key: string, lang: Language): string {
  const keys = key.split('.');
  let value: any = translations;
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  if (value && typeof value === 'object' && lang in value) {
    return value[lang];
  }
  
  return key;
}
