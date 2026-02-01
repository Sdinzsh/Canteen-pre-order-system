import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { canteens } from '../../data/mockData';
import { ArrowLeft, Plus, Minus, Clock, ShoppingCart, AlertCircle } from 'lucide-react';
import { FoodItem } from '../../types';

type Category = 'all' | 'breakfast' | 'lunch' | 'snacks' | 'beverages' | 'dessert';

const categoryEmojis: Record<Category, string> = {
  all: '🍽️',
  breakfast: '🌅',
  lunch: '🍱',
  snacks: '🍿',
  beverages: '☕',
  dessert: '🍰',
};

export const MenuView: React.FC = () => {
  const { selectedCanteenId, setSelectedCanteenId, foodItems, cart, addToCart, removeFromCart, updateCartQuantity } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');

  const canteen = canteens.find(c => c.id === selectedCanteenId);
  const menuItems = foodItems.filter(f => f.canteenId === selectedCanteenId);
  
  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(f => f.category === selectedCategory);

  const categories: Category[] = ['all', 'breakfast', 'lunch', 'snacks', 'beverages', 'dessert'];

  const getCartQuantity = (itemId: string) => {
    const cartItem = cart.find(c => c.id === itemId);
    return cartItem?.quantity || 0;
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleQuantityChange = (item: FoodItem, change: number) => {
    const currentQty = getCartQuantity(item.id);
    const newQty = currentQty + change;

    if (newQty <= 0) {
      removeFromCart(item.id);
    } else if (newQty <= item.availableQuantity) {
      if (currentQty === 0) {
        addToCart(item);
      } else {
        updateCartQuantity(item.id, newQty);
      }
    }
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSelectedCanteenId(null)}
          className="p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="font-bold text-gray-900">{canteen?.name}</h2>
          <p className="text-sm text-gray-500">{canteen?.location}</p>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-all flex items-center gap-2 ${
              selectedCategory === cat
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span>{categoryEmojis[cat]}</span>
            <span className="capitalize">{cat}</span>
          </button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No items available in this category</p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const cartQty = getCartQuantity(item.id);
            const isLowStock = item.availableQuantity > 0 && item.availableQuantity <= 5;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl shadow-sm overflow-hidden ${
                  !item.isAvailable || item.availableQuantity === 0 ? 'opacity-60' : ''
                }`}
              >
                <div className="flex">
                  <div className="w-28 h-28 bg-gray-200 flex-shrink-0 relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400';
                      }}
                    />
                    {(!item.isAvailable || item.availableQuantity === 0) && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white text-xs font-medium bg-red-500 px-2 py-1 rounded">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                        <span className="font-bold text-orange-500">₹{item.price}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.description}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {item.preparationTime} min
                        </span>
                        {isLowStock && (
                          <span className="flex items-center gap-1 text-amber-600">
                            <AlertCircle size={12} />
                            Only {item.availableQuantity} left
                          </span>
                        )}
                      </div>
                      
                      {item.isAvailable && item.availableQuantity > 0 && (
                        cartQty === 0 ? (
                          <button
                            onClick={() => handleQuantityChange(item, 1)}
                            className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-sm font-medium flex items-center gap-1 hover:bg-orange-600 transition-all"
                          >
                            <Plus size={14} />
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 bg-orange-50 rounded-lg p-1">
                            <button
                              onClick={() => handleQuantityChange(item, -1)}
                              className="w-7 h-7 bg-white rounded-md flex items-center justify-center text-orange-500 shadow-sm hover:bg-orange-500 hover:text-white transition-all"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-6 text-center font-semibold text-gray-900">{cartQty}</span>
                            <button
                              onClick={() => handleQuantityChange(item, 1)}
                              disabled={cartQty >= item.availableQuantity}
                              className="w-7 h-7 bg-orange-500 rounded-md flex items-center justify-center text-white shadow-sm hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Cart Bar */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-20 left-4 right-4 max-w-lg mx-auto">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-4 shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3 text-white">
              <div className="relative">
                <ShoppingCart size={24} />
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-orange-500 rounded-full text-xs font-bold flex items-center justify-center">
                  {cartItemCount}
                </span>
              </div>
              <div>
                <p className="text-sm opacity-90">{cartItemCount} items</p>
                <p className="font-bold">₹{cartTotal}</p>
              </div>
            </div>
            <button className="bg-white text-orange-500 px-6 py-2 rounded-xl font-semibold hover:bg-orange-50 transition-all">
              View Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
