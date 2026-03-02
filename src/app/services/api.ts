import { projectId, publicAnonKey } from '/utils/supabase/info';
import type { Product, Category, HomeBanner, Sale, Order, Expense, Employee, AttendanceEntry, ProductComment } from '../types';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-04a8a779`;

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
};

// ==================== PRODUCTS ====================

export const productApi = {
  getAll: async (): Promise<Product[]> => {
    try {
      const response = await fetch(`${API_BASE}/products`, { headers });
      const data = await response.json();
      return data.products || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  getById: async (id: number): Promise<Product | null> => {
    try {
      const response = await fetch(`${API_BASE}/products/${id}`, { headers });
      const data = await response.json();
      return data.product || null;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  create: async (product: Omit<Product, 'id'>): Promise<Product | null> => {
    try {
      const response = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers,
        body: JSON.stringify(product),
      });
      const data = await response.json();
      return data.product || null;
    } catch (error) {
      console.error('Error creating product:', error);
      return null;
    }
  },

  update: async (id: number, product: Partial<Product>): Promise<Product | null> => {
    try {
      const response = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(product),
      });
      const data = await response.json();
      return data.product || null;
    } catch (error) {
      console.error('Error updating product:', error);
      return null;
    }
  },

  delete: async (id: number): Promise<boolean> => {
    try {
      await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers,
      });
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  },

  uploadImage: async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE}/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: formData,
      });
      const data = await response.json();
      return data.imageUrl || null;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  },
};

// ==================== CATEGORIES ====================

export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    try {
      const response = await fetch(`${API_BASE}/categories`, { headers });
      const data = await response.json();
      return data.categories || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  create: async (category: Omit<Category, 'id'>): Promise<Category | null> => {
    try {
      const response = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers,
        body: JSON.stringify(category),
      });
      const data = await response.json();
      return data.category || null;
    } catch (error) {
      console.error('Error creating category:', error);
      return null;
    }
  },

  update: async (id: number, category: Partial<Category>): Promise<Category | null> => {
    try {
      const response = await fetch(`${API_BASE}/categories/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(category),
      });
      const data = await response.json();
      return data.category || null;
    } catch (error) {
      console.error('Error updating category:', error);
      return null;
    }
  },

  delete: async (id: number): Promise<boolean> => {
    try {
      await fetch(`${API_BASE}/categories/${id}`, {
        method: 'DELETE',
        headers,
      });
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    }
  },
};

// ==================== BANNERS ====================

export const bannerApi = {
  getAll: async (): Promise<HomeBanner[]> => {
    try {
      const response = await fetch(`${API_BASE}/banners`, { headers });
      const data = await response.json();
      return data.banners || [];
    } catch (error) {
      console.error('Error fetching banners:', error);
      return [];
    }
  },

  create: async (banner: Omit<HomeBanner, 'id'>): Promise<HomeBanner | null> => {
    try {
      const response = await fetch(`${API_BASE}/banners`, {
        method: 'POST',
        headers,
        body: JSON.stringify(banner),
      });
      const data = await response.json();
      return data.banner || null;
    } catch (error) {
      console.error('Error creating banner:', error);
      return null;
    }
  },

  update: async (id: number, banner: Partial<HomeBanner>): Promise<HomeBanner | null> => {
    try {
      const response = await fetch(`${API_BASE}/banners/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(banner),
      });
      const data = await response.json();
      return data.banner || null;
    } catch (error) {
      console.error('Error updating banner:', error);
      return null;
    }
  },

  delete: async (id: number): Promise<boolean> => {
    try {
      await fetch(`${API_BASE}/banners/${id}`, {
        method: 'DELETE',
        headers,
      });
      return true;
    } catch (error) {
      console.error('Error deleting banner:', error);
      return false;
    }
  },
};

// ==================== SALES ====================

export const saleApi = {
  getAll: async (): Promise<Sale[]> => {
    try {
      const response = await fetch(`${API_BASE}/sales`, { headers });
      const data = await response.json();
      return data.sales || [];
    } catch (error) {
      console.error('Error fetching sales:', error);
      return [];
    }
  },

  create: async (sale: Omit<Sale, 'id' | 'date'>): Promise<Sale | null> => {
    try {
      const response = await fetch(`${API_BASE}/sales`, {
        method: 'POST',
        headers,
        body: JSON.stringify(sale),
      });
      const data = await response.json();
      return data.sale || null;
    } catch (error) {
      console.error('Error creating sale:', error);
      return null;
    }
  },

  delete: async (id: number): Promise<boolean> => {
    try {
      await fetch(`${API_BASE}/sales/${id}`, {
        method: 'DELETE',
        headers,
      });
      return true;
    } catch (error) {
      console.error('Error deleting sale:', error);
      return false;
    }
  },
};

// ==================== ORDERS ====================

export const orderApi = {
  getAll: async (): Promise<Order[]> => {
    try {
      const response = await fetch(`${API_BASE}/orders`, { headers });
      const data = await response.json();
      return data.orders || [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  },

  create: async (order: Omit<Order, 'id' | 'orderDate'>): Promise<Order | null> => {
    try {
      const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify(order),
      });
      const data = await response.json();
      return data.order || null;
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  },

  update: async (id: number, order: Partial<Order>): Promise<Order | null> => {
    try {
      const response = await fetch(`${API_BASE}/orders/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(order),
      });
      const data = await response.json();
      return data.order || null;
    } catch (error) {
      console.error('Error updating order:', error);
      return null;
    }
  },

  delete: async (id: number): Promise<boolean> => {
    try {
      await fetch(`${API_BASE}/orders/${id}`, {
        method: 'DELETE',
        headers,
      });
      return true;
    } catch (error) {
      console.error('Error deleting order:', error);
      return false;
    }
  },
};

// ==================== EXPENSES ====================

export const expenseApi = {
  getAll: async (): Promise<Expense[]> => {
    try {
      const response = await fetch(`${API_BASE}/expenses`, { headers });
      const data = await response.json();
      return data.expenses || [];
    } catch (error) {
      console.error('Error fetching expenses:', error);
      return [];
    }
  },

  create: async (expense: Omit<Expense, 'id' | 'date'>): Promise<Expense | null> => {
    try {
      const response = await fetch(`${API_BASE}/expenses`, {
        method: 'POST',
        headers,
        body: JSON.stringify(expense),
      });
      const data = await response.json();
      return data.expense || null;
    } catch (error) {
      console.error('Error creating expense:', error);
      return null;
    }
  },

  update: async (id: number, expense: Partial<Expense>): Promise<Expense | null> => {
    try {
      const response = await fetch(`${API_BASE}/expenses/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(expense),
      });
      const data = await response.json();
      return data.expense || null;
    } catch (error) {
      console.error('Error updating expense:', error);
      return null;
    }
  },

  delete: async (id: number): Promise<boolean> => {
    try {
      await fetch(`${API_BASE}/expenses/${id}`, {
        method: 'DELETE',
        headers,
      });
      return true;
    } catch (error) {
      console.error('Error deleting expense:', error);
      return false;
    }
  },
};

// ==================== EMPLOYEES ====================

export const employeeApi = {
  getAll: async (): Promise<Employee[]> => {
    try {
      const response = await fetch(`${API_BASE}/employees`, { headers });
      const data = await response.json();
      return data.employees || [];
    } catch (error) {
      console.error('Error fetching employees:', error);
      return [];
    }
  },

  create: async (employee: Omit<Employee, 'id' | 'joinDate'>): Promise<Employee | null> => {
    try {
      const response = await fetch(`${API_BASE}/employees`, {
        method: 'POST',
        headers,
        body: JSON.stringify(employee),
      });
      const data = await response.json();
      return data.employee || null;
    } catch (error) {
      console.error('Error creating employee:', error);
      return null;
    }
  },

  update: async (id: number, employee: Partial<Employee>): Promise<Employee | null> => {
    try {
      const response = await fetch(`${API_BASE}/employees/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(employee),
      });
      const data = await response.json();
      return data.employee || null;
    } catch (error) {
      console.error('Error updating employee:', error);
      return null;
    }
  },

  delete: async (id: number): Promise<boolean> => {
    try {
      await fetch(`${API_BASE}/employees/${id}`, {
        method: 'DELETE',
        headers,
      });
      return true;
    } catch (error) {
      console.error('Error deleting employee:', error);
      return false;
    }
  },
};

// ==================== ATTENDANCE ====================

export const attendanceApi = {
  getAll: async (): Promise<AttendanceEntry[]> => {
    try {
      const response = await fetch(`${API_BASE}/attendance`, { headers });
      const data = await response.json();
      return data.attendance || [];
    } catch (error) {
      console.error('Error fetching attendance:', error);
      return [];
    }
  },

  record: async (attendance: AttendanceEntry): Promise<AttendanceEntry | null> => {
    try {
      const response = await fetch(`${API_BASE}/attendance`, {
        method: 'POST',
        headers,
        body: JSON.stringify(attendance),
      });
      const data = await response.json();
      return data.attendance || null;
    } catch (error) {
      console.error('Error recording attendance:', error);
      return null;
    }
  },

  update: async (employeeId: number, date: string, attendance: AttendanceEntry): Promise<AttendanceEntry | null> => {
    try {
      const response = await fetch(`${API_BASE}/attendance/${employeeId}/${date}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(attendance),
      });
      const data = await response.json();
      return data.attendance || null;
    } catch (error) {
      console.error('Error updating attendance:', error);
      return null;
    }
  },
};

// ==================== COMMENTS ====================

export const commentApi = {
  getByProductId: async (productId: number): Promise<ProductComment[]> => {
    try {
      const response = await fetch(`${API_BASE}/comments/${productId}`, { headers });
      const data = await response.json();
      return data.comments || [];
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  },

  create: async (comment: Omit<ProductComment, 'id' | 'createdAt'>): Promise<ProductComment | null> => {
    try {
      const response = await fetch(`${API_BASE}/comments`, {
        method: 'POST',
        headers,
        body: JSON.stringify(comment),
      });
      const data = await response.json();
      return data.comment || null;
    } catch (error) {
      console.error('Error creating comment:', error);
      return null;
    }
  },

  delete: async (id: number): Promise<boolean> => {
    try {
      await fetch(`${API_BASE}/comments/${id}`, {
        method: 'DELETE',
        headers,
      });
      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      return false;
    }
  },
};
