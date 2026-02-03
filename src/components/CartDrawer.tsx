import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useSound } from '@/hooks/useSound';
import { CloseIcon, TrashIcon, MinusIcon, PlusIcon } from '@/components/icons';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { t, language } = useLanguage();
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const { playSound } = useSound();

  if (!isOpen) return null;

  const handleRemove = (id: string) => {
    playSound('break');
    removeItem(id);
  };

  const handleQuantityChange = (id: string, newQty: number) => {
    playSound('pop');
    updateQuantity(id, newQty);
  };

  const handleClear = () => {
    playSound('error');
    clearCart();
  };

  const handleCheckout = () => {
    playSound('levelUp');
    // TODO: Implement checkout
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={() => {
          playSound('click');
          onClose();
        }}
      />
      
      {/* Drawer */}
      <div className={`absolute top-0 ${language === 'ar' ? 'left-0' : 'right-0'} h-full w-full max-w-md glass-card rounded-none animate-slide-in-right`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-bold flex items-center gap-2">
            🛒 {t('cart.title')}
            {totalItems > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-primary text-primary-foreground">
                {totalItems}
              </span>
            )}
          </h2>
          <button
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {items.length === 0 ? (
            <div className="text-center py-12 animate-bounce-in">
              <p className="text-4xl mb-4">🛒</p>
              <p className="text-muted-foreground">{t('cart.empty')}</p>
            </div>
          ) : (
            items.map((item, index) => (
              <div 
                key={item.id}
                className="glass-card p-3 flex items-center gap-3 animate-scale-bounce"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Item Icon */}
                <div className={`w-12 h-12 rounded-lg ${item.colorClass.replace('text-', 'bg-')}/20 flex items-center justify-center`}>
                  <span className="text-2xl">{item.type === 'rank' ? '🛡️' : '🔑'}</span>
                </div>
                
                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">
                    {language === 'ar' ? item.nameAr : item.name}
                  </p>
                  <p className="text-sm text-primary font-bold">${item.price}</p>
                </div>
                
                {/* Quantity Controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="p-1 rounded hover:bg-secondary transition-colors"
                  >
                    <MinusIcon className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="p-1 rounded hover:bg-secondary transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(item.id)}
                  className="p-2 rounded-lg hover:bg-destructive/20 text-destructive transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-border space-y-3">
            {/* Total */}
            <div className="flex items-center justify-between text-lg font-bold">
              <span>{t('cart.total')}</span>
              <span className="text-primary animate-pulse">${totalPrice.toFixed(2)}</span>
            </div>
            
            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleClear}
                onMouseEnter={() => playSound('hover')}
                className="flex-1 py-2.5 rounded-xl font-semibold bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors"
              >
                {t('cart.clear')}
              </button>
              <button
                onClick={handleCheckout}
                onMouseEnter={() => playSound('hover')}
                className="flex-1 py-2.5 rounded-xl font-semibold bg-primary text-primary-foreground hover:scale-105 transition-all animate-glow-pulse"
              >
                {t('cart.checkout')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
