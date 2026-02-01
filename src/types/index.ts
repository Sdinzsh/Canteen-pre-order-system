export interface User {
  id: string;
  name: string;
  email: string;
  type: 'student' | 'employee';
  collegeId?: string;
  employeeId?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  canteenId: string;
}

export interface Canteen {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  isOpen: boolean;
}

export interface FoodItem {
  id: string;
  canteenId: string;
  name: string;
  description: string;
  price: number;
  category: 'breakfast' | 'lunch' | 'snacks' | 'beverages' | 'dessert';
  image: string;
  availableQuantity: number;
  isAvailable: boolean;
  preparationTime: number; // in minutes
}

export interface CartItem extends FoodItem {
  quantity: number;
}

export interface Order {
  id: string;
  uniqueCode: string;
  userId: string;
  userName: string;
  canteenId: string;
  canteenName: string;
  items: CartItem[];
  totalAmount: number;
  advanceAmount: number;
  paymentStatus: 'advance' | 'full' | 'pending';
  orderStatus: 'pending' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'rejected';
  createdAt: Date;
  validUntil: Date;
  isUsed: boolean;
}

export type ViewType = 'user' | 'admin';
