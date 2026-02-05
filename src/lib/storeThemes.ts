 // Pre-built Minecraft themes for store customization
 export type StoreTheme = 
   | 'minecraft_classic'
   | 'nether_dark'
   | 'end_purple'
   | 'ocean_blue'
   | 'forest_green'
   | 'desert_gold'
   | 'ice_frost'
   | 'redstone_red'
   | 'diamond_cyan'
   | 'emerald_green';
 
 export interface ThemeColors {
   primary: string;
   primaryForeground: string;
   accent: string;
   background: string;
   backgroundStart: string;
   backgroundEnd: string;
   cardBg: string;
   borderColor: string;
   glowColor: string;
 }
 
 export const storeThemes: Record<StoreTheme, ThemeColors> = {
   minecraft_classic: {
     primary: '142 71% 45%', // Emerald green
     primaryForeground: '0 0% 0%',
     accent: '142 71% 45%',
     background: '230 69% 10%',
     backgroundStart: '230 69% 10%',
     backgroundEnd: '215 56% 16%',
     cardBg: '0 0% 100% / 0.05',
     borderColor: '142 71% 45% / 0.3',
     glowColor: '142 71% 45%',
   },
   nether_dark: {
     primary: '0 84% 50%', // Nether red
     primaryForeground: '0 0% 100%',
     accent: '25 95% 53%', // Orange lava
     background: '0 50% 8%',
     backgroundStart: '0 50% 8%',
     backgroundEnd: '15 40% 12%',
     cardBg: '0 0% 0% / 0.4',
     borderColor: '0 84% 50% / 0.3',
     glowColor: '0 84% 50%',
   },
   end_purple: {
     primary: '270 91% 65%', // End purple
     primaryForeground: '0 0% 100%',
     accent: '280 80% 70%',
     background: '270 50% 8%',
     backgroundStart: '270 50% 8%',
     backgroundEnd: '260 40% 15%',
     cardBg: '270 50% 20% / 0.3',
     borderColor: '270 91% 65% / 0.3',
     glowColor: '270 91% 65%',
   },
   ocean_blue: {
     primary: '200 80% 50%', // Ocean blue
     primaryForeground: '0 0% 0%',
     accent: '185 70% 45%',
     background: '210 60% 12%',
     backgroundStart: '210 60% 12%',
     backgroundEnd: '200 50% 18%',
     cardBg: '200 60% 20% / 0.3',
     borderColor: '200 80% 50% / 0.3',
     glowColor: '200 80% 50%',
   },
   forest_green: {
     primary: '120 50% 40%', // Forest green
     primaryForeground: '0 0% 100%',
     accent: '90 40% 50%',
     background: '120 40% 8%',
     backgroundStart: '120 40% 8%',
     backgroundEnd: '100 30% 15%',
     cardBg: '120 30% 15% / 0.3',
     borderColor: '120 50% 40% / 0.3',
     glowColor: '120 50% 40%',
   },
   desert_gold: {
     primary: '45 92% 50%', // Desert gold
     primaryForeground: '0 0% 0%',
     accent: '35 80% 55%',
     background: '40 40% 12%',
     backgroundStart: '40 40% 12%',
     backgroundEnd: '35 35% 18%',
     cardBg: '40 30% 20% / 0.3',
     borderColor: '45 92% 50% / 0.3',
     glowColor: '45 92% 50%',
   },
   ice_frost: {
     primary: '195 80% 70%', // Ice blue
     primaryForeground: '0 0% 0%',
     accent: '180 60% 80%',
     background: '200 50% 15%',
     backgroundStart: '200 50% 15%',
     backgroundEnd: '195 40% 22%',
     cardBg: '195 40% 25% / 0.3',
     borderColor: '195 80% 70% / 0.3',
     glowColor: '195 80% 70%',
   },
   redstone_red: {
     primary: '0 70% 45%', // Redstone red
     primaryForeground: '0 0% 100%',
     accent: '15 80% 50%',
     background: '0 40% 10%',
     backgroundStart: '0 40% 10%',
     backgroundEnd: '350 35% 15%',
     cardBg: '0 30% 18% / 0.3',
     borderColor: '0 70% 45% / 0.3',
     glowColor: '0 70% 45%',
   },
   diamond_cyan: {
     primary: '185 80% 55%', // Diamond cyan
     primaryForeground: '0 0% 0%',
     accent: '175 70% 60%',
     background: '190 50% 12%',
     backgroundStart: '190 50% 12%',
     backgroundEnd: '185 40% 18%',
     cardBg: '185 40% 20% / 0.3',
     borderColor: '185 80% 55% / 0.3',
     glowColor: '185 80% 55%',
   },
   emerald_green: {
     primary: '150 70% 50%', // Emerald
     primaryForeground: '0 0% 0%',
     accent: '140 60% 55%',
     background: '150 40% 10%',
     backgroundStart: '150 40% 10%',
     backgroundEnd: '145 35% 16%',
     cardBg: '150 35% 18% / 0.3',
     borderColor: '150 70% 50% / 0.3',
     glowColor: '150 70% 50%',
   },
 };
 
 export const themeLabels: Record<StoreTheme, { en: string; ar: string }> = {
   minecraft_classic: { en: 'Minecraft Classic', ar: 'ماينكرافت كلاسيك' },
   nether_dark: { en: 'Nether Dark', ar: 'نذر مظلم' },
   end_purple: { en: 'End Purple', ar: 'إند بنفسجي' },
   ocean_blue: { en: 'Ocean Blue', ar: 'محيط أزرق' },
   forest_green: { en: 'Forest Green', ar: 'غابة خضراء' },
   desert_gold: { en: 'Desert Gold', ar: 'ذهب الصحراء' },
   ice_frost: { en: 'Ice Frost', ar: 'جليد مثلج' },
   redstone_red: { en: 'Redstone Red', ar: 'ريدستون أحمر' },
   diamond_cyan: { en: 'Diamond Cyan', ar: 'دايموند سيان' },
   emerald_green: { en: 'Emerald Green', ar: 'زمرد أخضر' },
 };