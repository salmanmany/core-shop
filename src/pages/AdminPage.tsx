import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LoginModal } from '@/components/LoginModal';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToastContext } from '@/contexts/ToastContext';
import { useSound } from '@/hooks/useSound';
import { useAdmin } from '@/hooks/useAdmin';
import { supabase } from '@/integrations/supabase/client';
import {
  ShieldIcon,
  KeyIcon,
  PackageIcon,
  EditIcon,
  TrashIcon,
  PlusIcon,
  SaveIcon,
} from '@/components/icons';

interface Rank {
  id: string;
  key: string;
  name_ar: string;
  name_en: string;
  desc_ar: string;
  desc_en: string;
  reward_ar: string;
  reward_en: string;
  price: number;
  color_class: string;
  bg_class: string;
  border_class: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
}

interface Key {
  id: string;
  key: string;
  name_ar: string;
  name_en: string;
  desc_ar: string;
  desc_en: string;
  rarity_ar: string;
  rarity_en: string;
  price: number;
  color_class: string;
  bg_class: string;
  border_class: string;
  sort_order: number;
  is_active: boolean;
}

interface Mod {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar: string | null;
  description_en: string | null;
  download_url: string;
  image_url: string | null;
  version: string | null;
  minecraft_version: string | null;
  sort_order: number;
  is_active: boolean;
}

type TabType = 'ranks' | 'keys' | 'mods';

const AdminPage = () => {
  const navigate = useNavigate();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { t, language } = useLanguage();
  const { showToast } = useToastContext();
  const { playSound } = useSound();
  const { isAdmin, loading: adminLoading } = useAdmin();
  
  const [activeTab, setActiveTab] = useState<TabType>('ranks');
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [keys, setKeys] = useState<Key[]>([]);
  const [mods, setMods] = useState<Mod[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate('/');
    }
  }, [adminLoading, isAdmin, navigate]);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    if (activeTab === 'ranks') {
      const { data } = await supabase.from('ranks').select('*').order('sort_order');
      if (data) setRanks(data);
    } else if (activeTab === 'keys') {
      const { data } = await supabase.from('keys').select('*').order('sort_order');
      if (data) setKeys(data);
    } else {
      const { data } = await supabase.from('mods').select('*').order('sort_order');
      if (data) setMods(data);
    }
    setLoading(false);
  };

  const handleEdit = (item: any) => {
    playSound('click');
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const handleSave = async () => {
    if (!editForm) return;
    playSound('anvil');
    
    const table = activeTab;
    const { error } = await supabase
      .from(table)
      .update(editForm)
      .eq('id', editForm.id);
    
    if (error) {
      playSound('error');
      showToast('Error saving: ' + error.message);
    } else {
      playSound('levelUp');
      showToast(t('admin.saved'));
      setEditingId(null);
      setEditForm(null);
      fetchData();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.confirmDelete'))) return;
    playSound('break');
    
    const table = activeTab;
    const { error } = await supabase.from(table).delete().eq('id', id);
    
    if (error) {
      playSound('error');
      showToast('Error: ' + error.message);
    } else {
      showToast(t('admin.deleted'));
      fetchData();
    }
  };

  const handleAdd = async () => {
    playSound('place');
    
    if (activeTab === 'ranks') {
      const newRank = {
        key: 'new_rank',
        name_ar: 'رتبة جديدة',
        name_en: 'New Rank',
        desc_ar: 'وصف الرتبة',
        desc_en: 'Rank description',
        reward_ar: 'مكافأة',
        reward_en: 'Reward',
        price: 10,
        color_class: 'text-vip',
        bg_class: 'bg-vip',
        border_class: 'border-vip',
        icon: 'shield',
        sort_order: ranks.length,
        is_active: true,
      };
      const { data, error } = await supabase.from('ranks').insert(newRank).select().single();
      if (!error && data) {
        setRanks([...ranks, data]);
        handleEdit(data);
      }
    } else if (activeTab === 'keys') {
      const newKey = {
        key: 'new_key',
        name_ar: 'مفتاح جديد',
        name_en: 'New Key',
        desc_ar: 'وصف المفتاح',
        desc_en: 'Key description',
        rarity_ar: 'نادر',
        rarity_en: 'Rare',
        price: 5,
        color_class: 'text-rare',
        bg_class: 'bg-rare',
        border_class: 'border-rare',
        sort_order: keys.length,
        is_active: true,
      };
      const { data, error } = await supabase.from('keys').insert(newKey).select().single();
      if (!error && data) {
        setKeys([...keys, data]);
        handleEdit(data);
      }
    } else {
      const newMod = {
        name_ar: 'مود جديد',
        name_en: 'New Mod',
        description_ar: 'وصف المود',
        description_en: 'Mod description',
        download_url: 'https://example.com/mod.jar',
        image_url: null,
        version: '1.0.0',
        minecraft_version: '1.20.1',
        sort_order: mods.length,
        is_active: true,
      };
      const { data, error } = await supabase.from('mods').insert(newMod).select().single();
      if (!error && data) {
        setMods([...mods, data]);
        handleEdit(data);
      }
    }
  };

  const handleCancel = () => {
    playSound('pop');
    setEditingId(null);
    setEditForm(null);
  };

  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const tabs = [
    { id: 'ranks' as TabType, icon: ShieldIcon, label: t('admin.ranks') },
    { id: 'keys' as TabType, icon: KeyIcon, label: t('admin.keys') },
    { id: 'mods' as TabType, icon: PackageIcon, label: t('admin.mods') },
  ];

  const renderEditField = (label: string, field: string, type: 'text' | 'number' | 'checkbox' = 'text') => (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-muted-foreground">{label}</label>
      {type === 'checkbox' ? (
        <input
          type="checkbox"
          checked={editForm[field]}
          onChange={(e) => setEditForm({ ...editForm, [field]: e.target.checked })}
          className="w-5 h-5"
        />
      ) : (
        <input
          type={type}
          value={editForm[field] || ''}
          onChange={(e) => setEditForm({ ...editForm, [field]: type === 'number' ? Number(e.target.value) : e.target.value })}
          className="px-3 py-2 rounded-lg bg-secondary border border-border text-sm"
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <AnimatedBackground />
      <Navbar onLoginClick={() => setLoginModalOpen(true)} />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in-down">
            <h1 className="text-3xl font-bold mb-2">
              ⚙️ {t('admin.title')}
            </h1>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-2 mb-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    playSound('click');
                    setActiveTab(tab.id);
                    setEditingId(null);
                  }}
                  onMouseEnter={() => playSound('hover')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground animate-glow-pulse'
                      : 'glass-card hover:scale-105'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Add Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={handleAdd}
              onMouseEnter={() => playSound('hover')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold hover:scale-105 transition-all"
            >
              <PlusIcon className="w-5 h-5" />
              {t('admin.add')}
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {activeTab === 'ranks' && ranks.map((rank, index) => (
                <div 
                  key={rank.id} 
                  className="glass-card p-4 animate-scale-bounce"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {editingId === rank.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {renderEditField('Key', 'key')}
                        {renderEditField('Name (EN)', 'name_en')}
                        {renderEditField('Name (AR)', 'name_ar')}
                        {renderEditField('Price', 'price', 'number')}
                        {renderEditField('Desc (EN)', 'desc_en')}
                        {renderEditField('Desc (AR)', 'desc_ar')}
                        {renderEditField('Reward (EN)', 'reward_en')}
                        {renderEditField('Reward (AR)', 'reward_ar')}
                        {renderEditField('Color Class', 'color_class')}
                        {renderEditField('BG Class', 'bg_class')}
                        {renderEditField('Sort Order', 'sort_order', 'number')}
                        {renderEditField('Active', 'is_active', 'checkbox')}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground">
                          <SaveIcon className="w-4 h-4" /> {t('admin.save')}
                        </button>
                        <button onClick={handleCancel} className="px-4 py-2 rounded-lg bg-secondary">
                          {t('admin.cancel')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg ${rank.bg_class}/20 flex items-center justify-center`}>
                          <ShieldIcon className={`w-6 h-6 ${rank.color_class}`} />
                        </div>
                        <div>
                          <p className={`font-bold ${rank.color_class}`}>{language === 'ar' ? rank.name_ar : rank.name_en}</p>
                          <p className="text-sm text-muted-foreground">${rank.price} • {rank.is_active ? '✅' : '❌'}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(rank)} className="p-2 rounded-lg hover:bg-secondary">
                          <EditIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(rank.id)} className="p-2 rounded-lg hover:bg-destructive/20 text-destructive">
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {activeTab === 'keys' && keys.map((key, index) => (
                <div 
                  key={key.id} 
                  className="glass-card p-4 animate-scale-bounce"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {editingId === key.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {renderEditField('Key', 'key')}
                        {renderEditField('Name (EN)', 'name_en')}
                        {renderEditField('Name (AR)', 'name_ar')}
                        {renderEditField('Price', 'price', 'number')}
                        {renderEditField('Desc (EN)', 'desc_en')}
                        {renderEditField('Desc (AR)', 'desc_ar')}
                        {renderEditField('Rarity (EN)', 'rarity_en')}
                        {renderEditField('Rarity (AR)', 'rarity_ar')}
                        {renderEditField('Color Class', 'color_class')}
                        {renderEditField('BG Class', 'bg_class')}
                        {renderEditField('Sort Order', 'sort_order', 'number')}
                        {renderEditField('Active', 'is_active', 'checkbox')}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground">
                          <SaveIcon className="w-4 h-4" /> {t('admin.save')}
                        </button>
                        <button onClick={handleCancel} className="px-4 py-2 rounded-lg bg-secondary">
                          {t('admin.cancel')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg ${key.bg_class}/20 flex items-center justify-center`}>
                          <KeyIcon className={`w-6 h-6 ${key.color_class}`} />
                        </div>
                        <div>
                          <p className={`font-bold ${key.color_class}`}>{language === 'ar' ? key.name_ar : key.name_en}</p>
                          <p className="text-sm text-muted-foreground">${key.price} • {key.is_active ? '✅' : '❌'}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(key)} className="p-2 rounded-lg hover:bg-secondary">
                          <EditIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(key.id)} className="p-2 rounded-lg hover:bg-destructive/20 text-destructive">
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {activeTab === 'mods' && mods.map((mod, index) => (
                <div 
                  key={mod.id} 
                  className="glass-card p-4 animate-scale-bounce"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {editingId === mod.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {renderEditField('Name (EN)', 'name_en')}
                        {renderEditField('Name (AR)', 'name_ar')}
                        {renderEditField('Desc (EN)', 'description_en')}
                        {renderEditField('Desc (AR)', 'description_ar')}
                        {renderEditField('Download URL', 'download_url')}
                        {renderEditField('Image URL', 'image_url')}
                        {renderEditField('Version', 'version')}
                        {renderEditField('MC Version', 'minecraft_version')}
                        {renderEditField('Sort Order', 'sort_order', 'number')}
                        {renderEditField('Active', 'is_active', 'checkbox')}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground">
                          <SaveIcon className="w-4 h-4" /> {t('admin.save')}
                        </button>
                        <button onClick={handleCancel} className="px-4 py-2 rounded-lg bg-secondary">
                          {t('admin.cancel')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                          <PackageIcon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold">{language === 'ar' ? mod.name_ar : mod.name_en}</p>
                          <p className="text-sm text-muted-foreground">v{mod.version} • MC {mod.minecraft_version} • {mod.is_active ? '✅' : '❌'}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(mod)} className="p-2 rounded-lg hover:bg-secondary">
                          <EditIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(mod.id)} className="p-2 rounded-lg hover:bg-destructive/20 text-destructive">
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <LoginModal 
        isOpen={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
      />
    </div>
  );
};

export default AdminPage;