-- Create ranks table
CREATE TABLE public.ranks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  color_class TEXT NOT NULL,
  bg_class TEXT NOT NULL,
  border_class TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'shield',
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  desc_ar TEXT NOT NULL,
  desc_en TEXT NOT NULL,
  reward_ar TEXT NOT NULL,
  reward_en TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create keys table
CREATE TABLE public.keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  color_class TEXT NOT NULL,
  bg_class TEXT NOT NULL,
  border_class TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  rarity_ar TEXT NOT NULL,
  rarity_en TEXT NOT NULL,
  desc_ar TEXT NOT NULL,
  desc_en TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mods table
CREATE TABLE public.mods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  download_url TEXT NOT NULL,
  image_url TEXT,
  version TEXT,
  minecraft_version TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.ranks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mods ENABLE ROW LEVEL SECURITY;

-- Public read access for ranks (store data should be visible to everyone)
CREATE POLICY "Anyone can view active ranks"
  ON public.ranks FOR SELECT
  USING (is_active = true);

-- Public read access for keys
CREATE POLICY "Anyone can view active keys"
  ON public.keys FOR SELECT
  USING (is_active = true);

-- Public read access for mods
CREATE POLICY "Anyone can view active mods"
  ON public.mods FOR SELECT
  USING (is_active = true);

-- Create updated_at triggers
CREATE TRIGGER update_ranks_updated_at
  BEFORE UPDATE ON public.ranks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_keys_updated_at
  BEFORE UPDATE ON public.keys
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mods_updated_at
  BEFORE UPDATE ON public.mods
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default ranks data
INSERT INTO public.ranks (key, price, color_class, bg_class, border_class, icon, name_ar, name_en, desc_ar, desc_en, reward_ar, reward_en, sort_order) VALUES
  ('vip', 10, 'text-vip', 'bg-vip', 'border-vip', 'shield', 'VIP', 'VIP', 'لون اسم مميز - الطيران في اللوبي - دخول السيرفر عند الامتلاء', 'Colored name - Lobby fly - Join full server', '1000 عملة + مفتاح أساسي', '1000 coins + Basic key', 1),
  ('vipPlus', 20, 'text-vip-plus', 'bg-vip-plus', 'border-vip-plus', 'gem', 'VIP+', 'VIP+', 'لون اسم أزرق - رسائل ملونة - استخدام Pets', 'Blue name - Colored chat - Use Pets', '5000 عملة + 2 مفتاح نادر', '5000 coins + 2 rare keys', 2),
  ('mvp', 40, 'text-mvp', 'bg-mvp', 'border-mvp', 'star', 'MVP', 'MVP', 'لون بنفسجي - تغيير النك - أوامر /nick و /workbench', 'Purple name - Nick change - /nick and /workbench', '15000 عملة + 5 مفاتيح نادرة', '15000 coins + 5 rare keys', 3),
  ('mvpPlus', 70, 'text-mvp-plus', 'bg-mvp-plus', 'border-mvp-plus', 'flame', 'MVP+', 'MVP+', 'لون أحمر - خرائط حصرية - تأثيرات Particles', 'Red name - Exclusive maps - Particles', '50000 عملة + 10 مفاتيح أسطورية', '50000 coins + 10 legendary keys', 4),
  ('legend', 100, 'text-legend', 'bg-legend', 'border-legend', 'trophy', 'Legend', 'Legend', 'لقب الأسطوري - Giveaways - مميزات غير محدودة', 'Legendary title - Giveaways - Unlimited perks', '100000 عملة + Kit أسطوري', '100000 coins + Legendary Kit', 5);

-- Insert default keys data
INSERT INTO public.keys (key, price, color_class, bg_class, border_class, name_ar, name_en, rarity_ar, rarity_en, desc_ar, desc_en, sort_order) VALUES
  ('common', 2, 'text-common', 'bg-common', 'border-common', 'المفتاح العادي', 'Common Key', 'عادي', 'Common', 'مواد أساسية - أدوات مطورة - تعويضات عشوائية', 'Basic materials - Upgraded tools - Random rewards', 1),
  ('rare', 7, 'text-rare', 'bg-rare', 'border-rare', 'المفتاح النادر', 'Rare Key', 'نادر', 'Rare', 'دايموند - دروع مطورة - رؤوس لاعبين', 'Diamond - Upgraded armor - Player heads', 2),
  ('legendary', 15, 'text-legendary', 'bg-legendary', 'border-legendary', 'المفتاح الأسطوري', 'Legendary Key', 'أسطوري', 'Legendary', 'أدوات OP - عملات ضخمة - رتبة VIP مؤقتة', 'OP tools - Huge coins - Temp VIP rank', 3),
  ('rankKey', 30, 'text-rank-key', 'bg-rank-key', 'border-rank-key', 'مفتاح الرتب', 'Rank Key', 'نادر جداً', 'Very Rare', 'رتب عشوائية من VIP إلى MVP+', 'Random ranks from VIP to MVP+', 4);