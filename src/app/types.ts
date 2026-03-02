export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  gallery?: string[];
  description: string;
  isFeatured: boolean;
}

export interface Category {
  id: number;
  name: string;
  imageUrl: string;
}

export interface HomeBanner {
  id: number;
  title: string;
  subtitle: string;
  ctaText: string;
  mediaUrl: string;
  isActive: boolean;
}

export interface ProductComment {
  id: number;
  productId: number;
  userName: string;
  text: string;
  rating: number;
  createdAt: Date;
}

export interface Sale {
  id: number;
  productName: string;
  customerName: string;
  customerPhone: string;
  quantity: number;
  amount: number;
  paidAmount: number;
  paymentMethod: string;
  paymentType: "Discount" | "Credit" | "Full";
  discountPercent: number;
  discountAmount: number;
  date: Date;
}

export interface Order {
  id: number;
  productName: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  quantity: number;
  totalAmount: number;
  advanceAmount: number;
  orderDate: Date;
  expectedDelivery: Date;
  status: "Pending" | "In Production" | "Ready" | "Delivered";
  orderType: "Custom" | "Stock";
}

export interface Expense {
  id: number;
  item: string;
  category: string;
  cost: number;
  quantity: number;
  supplier: string;
  paymentMethod: string;
  date: Date;
  notes?: string;
}

export interface Employee {
  id: number;
  name: string;
  position: string;
  phone: string;
  salary: number;
  joinDate: Date;
}

export interface AttendanceEntry {
  employeeId: number;
  date: string;
  status: "Present" | "Absent" | "Half Day" | "Leave";
  hours?: number;
  notes?: string;
}

export interface Theme {
  name: string;
  value: string;
  primary: string;
}
