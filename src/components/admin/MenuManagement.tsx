import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FoodItem } from '../../types';
import { Plus, Edit2, Trash2, X, Check, AlertCircle } from 'lucide-react';

const categories = ['breakfast', 'lunch', 'snacks', 'beverages', 'dessert'] as const;

export const MenuManagement: React.FC = () => {
  const { adminUser, foodItems, updateFoodItem, addFoodItem, deleteFoodItem } = useApp();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editForm, setEditForm] = useState<Partial<FoodItem>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const canteenItems = foodItems.filter(f => f.canteenId === adminUser?.canteenId);

  const handleEdit = (item: FoodItem) => {
    setIsEditing(item.id);
    setEditForm(item);
  };

  const handleSaveEdit = () => {
    if (isEditing && editForm) {
      updateFoodItem(editForm as FoodItem);
      setIsEditing(null);
      setEditForm({});
    }
  };

  const handleAdd = () => {
    if (!adminUser) return;
    
    const newItem: FoodItem = {
      id: `food-${Date.now()}`,
      canteenId: adminUser.canteenId,
      name: editForm.name || 'New Item',
      description: editForm.description || '',
      price: editForm.price || 0,
      category: editForm.category || 'snacks',
      image: editForm.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
      availableQuantity: editForm.availableQuantity || 0,
      isAvailable: (editForm.availableQuantity || 0) > 0,
      preparationTime: editForm.preparationTime || 10,
    };

    addFoodItem(newItem);
    setIsAdding(false);
    setEditForm({});
  };

  const handleDelete = (id: string) => {
    deleteFoodItem(id);
    setDeleteConfirm(null);
  };

  const handleQuickStockUpdate = (item: FoodItem, change: number) => {
    const newQuantity = Math.max(0, item.availableQuantity + change);
    updateFoodItem({
      ...item,
      availableQuantity: newQuantity,
      isAvailable: newQuantity > 0,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
        <button
          onClick={() => {
            setIsAdding(true);
            setEditForm({});
          }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-all"
        >
          <Plus size={18} />
          Add Item
        </button>
      </div>

      {/* Add/Edit Modal */}
      {(isAdding || isEditing) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-bold text-lg">{isAdding ? 'Add New Item' : 'Edit Item'}</h3>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setIsEditing(null);
                  setEditForm({});
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={editForm.price || ''}
                    onChange={(e) => setEditForm({ ...editForm, price: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={editForm.availableQuantity || ''}
                    onChange={(e) => setEditForm({ ...editForm, availableQuantity: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={editForm.category || 'snacks'}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value as FoodItem['category'] })}
                    className="w-full px-4 py-2 border rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prep Time (min)</label>
                  <input
                    type="number"
                    value={editForm.preparationTime || ''}
                    onChange={(e) => setEditForm({ ...editForm, preparationTime: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={editForm.image || ''}
                  onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setIsEditing(null);
                    setEditForm({});
                  }}
                  className="flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={isAdding ? handleAdd : handleSaveEdit}
                  className="flex-1 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  {isAdding ? 'Add Item' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Item?</h3>
            <p className="text-gray-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menu Items Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {canteenItems.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="h-40 bg-gray-200 relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400';
                }}
              />
              {item.availableQuantity === 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Out of Stock
                  </span>
                </div>
              )}
              <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                item.availableQuantity > 5 ? 'bg-green-100 text-green-700' :
                item.availableQuantity > 0 ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'
              }`}>
                Stock: {item.availableQuantity}
              </span>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{item.category}</p>
                </div>
                <span className="text-lg font-bold text-emerald-600">₹{item.price}</span>
              </div>

              <p className="text-sm text-gray-500 line-clamp-2 mb-4">{item.description}</p>

              {/* Quick Stock Update */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Quick Stock:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuickStockUpdate(item, -5)}
                    className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200"
                  >
                    -5
                  </button>
                  <button
                    onClick={() => handleQuickStockUpdate(item, -1)}
                    className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200"
                  >
                    -1
                  </button>
                  <button
                    onClick={() => handleQuickStockUpdate(item, 1)}
                    className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 hover:bg-emerald-200"
                  >
                    +1
                  </button>
                  <button
                    onClick={() => handleQuickStockUpdate(item, 10)}
                    className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 hover:bg-emerald-200"
                  >
                    +10
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-all"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteConfirm(item.id)}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-500 rounded-lg font-medium hover:bg-red-50 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {canteenItems.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl">
          <p className="text-gray-500">No menu items yet. Add your first item!</p>
        </div>
      )}
    </div>
  );
};
