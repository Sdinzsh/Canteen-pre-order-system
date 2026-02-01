import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AdminUser, FoodItem, Order, CartItem, ViewType } from '../types';
import { foodItems as initialFoodItems, initialOrders, generateUniqueCode, canteens } from '../data/mockData';

interface AppContextType {
  // View State
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  
  // User Auth
  user: User | null;
  setUser: (user: User | null) => void;
  adminUser: AdminUser | null;
  setAdminUser: (admin: AdminUser | null) => void;
  
  // Food Items
  foodItems: FoodItem[];
  updateFoodItem: (item: FoodItem) => void;
  addFoodItem: (item: FoodItem) => void;
  deleteFoodItem: (id: string) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (item: FoodItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Orders
  orders: Order[];
  createOrder: (paymentType: 'advance' | 'full') => Order | null;
  updateOrderStatus: (orderId: string, status: Order['orderStatus']) => void;
  markOrderAsUsed: (orderId: string) => void;
  
  // Selected Canteen
  selectedCanteenId: string | null;
  setSelectedCanteenId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewType>('user');
  const [user, setUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [foodItems, setFoodItems] = useState<FoodItem[]>(initialFoodItems);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedCanteenId, setSelectedCanteenId] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    const savedOrders = localStorage.getItem('canteen-orders');
    if (savedOrders) {
      try {
        const parsed = JSON.parse(savedOrders);
        setOrders(parsed.map((o: Order) => ({
          ...o,
          createdAt: new Date(o.createdAt),
          validUntil: new Date(o.validUntil),
        })));
      } catch (e) {
        console.error('Failed to load orders');
      }
    }
  }, []);

  // Save orders to localStorage
  useEffect(() => {
    localStorage.setItem('canteen-orders', JSON.stringify(orders));
  }, [orders]);

  const updateFoodItem = (item: FoodItem) => {
    setFoodItems(prev => prev.map(f => f.id === item.id ? item : f));
  };

  const addFoodItem = (item: FoodItem) => {
    setFoodItems(prev => [...prev, item]);
  };

  const deleteFoodItem = (id: string) => {
    setFoodItems(prev => prev.filter(f => f.id !== id));
  };

  const addToCart = (item: FoodItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) {
        return prev.map(c => 
          c.id === item.id 
            ? { ...c, quantity: Math.min(c.quantity + 1, item.availableQuantity) }
            : c
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(c => c.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev => prev.map(c => 
      c.id === itemId ? { ...c, quantity } : c
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const createOrder = (paymentType: 'advance' | 'full'): Order | null => {
    if (!user || cart.length === 0 || !selectedCanteenId) return null;

    const canteen = canteens.find(c => c.id === selectedCanteenId);
    if (!canteen) return null;

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const advanceAmount = paymentType === 'advance' ? Math.ceil(totalAmount * 0.2) : totalAmount;

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      uniqueCode: generateUniqueCode(),
      userId: user.id,
      userName: user.name,
      canteenId: selectedCanteenId,
      canteenName: canteen.name,
      items: [...cart],
      totalAmount,
      advanceAmount,
      paymentStatus: paymentType === 'full' ? 'full' : 'advance',
      orderStatus: 'pending',
      createdAt: new Date(),
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
      isUsed: false,
    };

    // Update food quantities
    cart.forEach(cartItem => {
      const food = foodItems.find(f => f.id === cartItem.id);
      if (food) {
        updateFoodItem({
          ...food,
          availableQuantity: Math.max(0, food.availableQuantity - cartItem.quantity),
          isAvailable: food.availableQuantity - cartItem.quantity > 0,
        });
      }
    });

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['orderStatus']) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, orderStatus: status } : o
    ));
  };

  const markOrderAsUsed = (orderId: string) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, isUsed: true, orderStatus: 'completed' } : o
    ));
  };

  return (
    <AppContext.Provider value={{
      currentView,
      setCurrentView,
      user,
      setUser,
      adminUser,
      setAdminUser,
      foodItems,
      updateFoodItem,
      addFoodItem,
      deleteFoodItem,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      orders,
      createOrder,
      updateOrderStatus,
      markOrderAsUsed,
      selectedCanteenId,
      setSelectedCanteenId,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
