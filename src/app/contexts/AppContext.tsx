import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type {
  Product,
  Category,
  HomeBanner,
  ProductComment,
  Sale,
  Order,
  Expense,
  Employee,
  AttendanceEntry,
  Theme,
} from "../types";
import {
  products as initialProducts,
  categories as initialCategories,
  banners as initialBanners,
  sales as initialSales,
  orders as initialOrders,
  expenses as initialExpenses,
  employees as initialEmployees,
} from "../data/mockData";
import {
  productApi,
  categoryApi,
  bannerApi,
  saleApi,
  orderApi,
  expenseApi,
  employeeApi,
  attendanceApi,
} from "../services/api";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface AppContextType {
  // Products
  products: Product[];
  categories: Category[];
  banners: HomeBanner[];
  addProduct: (product: Product) => void;
  updateProduct: (
    id: number,
    product: Partial<Product>,
  ) => void;
  deleteProduct: (id: number) => void;
  addCategory: (category: Category) => void;
  updateCategory: (
    id: number,
    category: Partial<Category>,
  ) => void;
  deleteCategory: (id: number) => void;
  addBanner: (banner: HomeBanner) => void;
  updateBanner: (
    id: number,
    banner: Partial<HomeBanner>,
  ) => void;
  deleteBanner: (id: number) => void;

  // Saved/Favorites
  savedProductIds: number[];
  toggleSaved: (productId: number) => void;

  // Comments
  comments: ProductComment[];
  addComment: (
    comment: Omit<ProductComment, "id" | "createdAt">,
  ) => void;
  deleteComment: (id: number) => void;

  // Sales
  sales: Sale[];
  addSale: (sale: Omit<Sale, "id">) => void;
  updateSale: (id: number, sale: Partial<Sale>) => void;
  deleteSale: (id: number) => void;

  // Orders
  orders: Order[];
  addOrder: (order: Omit<Order, "id">) => void;
  updateOrder: (id: number, order: Partial<Order>) => void;
  deleteOrder: (id: number) => void;

  // Expenses
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, "id">) => void;
  updateExpense: (
    id: number,
    expense: Partial<Expense>,
  ) => void;
  deleteExpense: (id: number) => void;

  // Attendance
  employees: Employee[];
  addEmployee: (employee: Employee) => void;
  attendance: Record<string, AttendanceEntry>;
  updateAttendance: (entry: AttendanceEntry) => void;

  // Theme
  themes: Theme[];
  selectedTheme: string;
  setTheme: (theme: string) => void;

  // Auth
  isAdminLoggedIn: boolean;
  setAdminLoggedIn: (value: boolean) => void;

  // Loading state
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(
  undefined,
);

export function AppProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [products, setProducts] =
    useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(
    initialCategories,
  );
  const [banners, setBanners] =
    useState<HomeBanner[]>(initialBanners);
  const [savedProductIds, setSavedProductIds] = useState<
    number[]
  >([]);
  const [comments, setComments] = useState<ProductComment[]>(
    [],
  );
  const [sales, setSales] = useState<Sale[]>(initialSales);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [expenses, setExpenses] =
    useState<Expense[]>(initialExpenses);
  const [employees, setEmployees] =
    useState<Employee[]>(initialEmployees);
  const [attendance, setAttendance] = useState<
    Record<string, AttendanceEntry>
  >({});
  const [selectedTheme, setSelectedTheme] = useState("default");
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from API on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      // Test server connectivity first
      const testResponse = await fetch(
        `https://dnavfvczmpozfxhstloe.supabase.co/functions/v1/make-server-04a8a779/health`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        },
      ).catch(() => null);

      const serverAvailable = testResponse && testResponse.ok;

      if (!serverAvailable) {
        console.log(
          "ℹ️ Server connecting - loading initial data...",
        );
        // Use mock data if server is unavailable
        setProducts(initialProducts);
        setCategories(initialCategories);
        setBanners(initialBanners);
        setSales(initialSales);
        setOrders(initialOrders);
        setExpenses(initialExpenses);
        setEmployees(initialEmployees);
        setIsLoading(false);
        return;
      }

      const [
        productsData,
        categoriesData,
        bannersData,
        salesData,
        ordersData,
        expensesData,
        employeesData,
        attendanceData,
      ] = await Promise.all([
        productApi.getAll(),
        categoryApi.getAll(),
        bannerApi.getAll(),
        saleApi.getAll(),
        orderApi.getAll(),
        expenseApi.getAll(),
        employeeApi.getAll(),
        attendanceApi.getAll(),
      ]);

      // Seed database with initial data if empty
      if (
        productsData.length === 0 &&
        initialProducts.length > 0
      ) {
        console.log(
          "Seeding database with initial products...",
        );
        for (const product of initialProducts) {
          await productApi.create(product);
        }
        const newProducts = await productApi.getAll();
        setProducts(newProducts);
      } else {
        setProducts(productsData);
      }

      if (
        categoriesData.length === 0 &&
        initialCategories.length > 0
      ) {
        console.log(
          "Seeding database with initial categories...",
        );
        for (const category of initialCategories) {
          await categoryApi.create(category);
        }
        const newCategories = await categoryApi.getAll();
        setCategories(newCategories);
      } else {
        setCategories(categoriesData);
      }

      if (
        bannersData.length === 0 &&
        initialBanners.length > 0
      ) {
        console.log("Seeding database with initial banners...");
        for (const banner of initialBanners) {
          await bannerApi.create(banner);
        }
        const newBanners = await bannerApi.getAll();
        setBanners(newBanners);
      } else {
        setBanners(bannersData);
      }

      if (salesData.length === 0 && initialSales.length > 0) {
        console.log("Seeding database with initial sales...");
        for (const sale of initialSales) {
          await saleApi.create(sale);
        }
        const newSales = await saleApi.getAll();
        setSales(newSales);
      } else {
        setSales(salesData);
      }

      if (ordersData.length === 0 && initialOrders.length > 0) {
        console.log("Seeding database with initial orders...");
        for (const order of initialOrders) {
          await orderApi.create(order);
        }
        const newOrders = await orderApi.getAll();
        setOrders(newOrders);
      } else {
        setOrders(ordersData);
      }

      if (
        expensesData.length === 0 &&
        initialExpenses.length > 0
      ) {
        console.log(
          "Seeding database with initial expenses...",
        );
        for (const expense of initialExpenses) {
          await expenseApi.create(expense);
        }
        const newExpenses = await expenseApi.getAll();
        setExpenses(newExpenses);
      } else {
        setExpenses(expensesData);
      }

      if (
        employeesData.length === 0 &&
        initialEmployees.length > 0
      ) {
        console.log(
          "Seeding database with initial employees...",
        );
        for (const employee of initialEmployees) {
          await employeeApi.create(employee);
        }
        const newEmployees = await employeeApi.getAll();
        setEmployees(newEmployees);
      } else {
        setEmployees(employeesData);
      }

      // Convert attendance array to record
      const attendanceRecord: Record<string, AttendanceEntry> =
        {};
      attendanceData.forEach((entry) => {
        const key = `${entry.date}-${entry.employeeId}`;
        attendanceRecord[key] = entry;
      });
      if (attendanceData.length > 0)
        setAttendance(attendanceRecord);
    } catch (error) {
      console.error("Error loading data from API:", error);
      // If API fails, use initial mock data
      setProducts(initialProducts);
      setCategories(initialCategories);
      setBanners(initialBanners);
      setSales(initialSales);
      setOrders(initialOrders);
      setExpenses(initialExpenses);
      setEmployees(initialEmployees);
    } finally {
      setIsLoading(false);
    }
  };

  const themes: Theme[] = [
    { name: "Default", value: "default", primary: "#5C3B1E" },
    { name: "Dark Brown", value: "dark", primary: "#2C1810" },
    { name: "Light Beige", value: "light", primary: "#D4B896" },
  ];

  const addProduct = async (product: Product) => {
    // Optimistic update
    setProducts([...products, product]);

    // API call
    const created = await productApi.create(product);
    if (created) {
      // Update with actual data from server
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? created : p)),
      );
    }
  };

  const updateProduct = async (
    id: number,
    updatedProduct: Partial<Product>,
  ) => {
    // Optimistic update
    setProducts(
      products.map((p) =>
        p.id === id ? { ...p, ...updatedProduct } : p,
      ),
    );

    // API call
    const updated = await productApi.update(id, updatedProduct);
    if (updated) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? updated : p)),
      );
    }
  };

  const deleteProduct = async (id: number) => {
    // Optimistic update
    setProducts(products.filter((p) => p.id !== id));

    // API call
    await productApi.delete(id);
  };

  const addCategory = async (category: Category) => {
    setCategories([...categories, category]);
    const created = await categoryApi.create(category);
    if (created) {
      setCategories((prev) =>
        prev.map((c) => (c.id === category.id ? created : c)),
      );
    }
  };

  const updateCategory = async (
    id: number,
    updatedCategory: Partial<Category>,
  ) => {
    setCategories(
      categories.map((c) =>
        c.id === id ? { ...c, ...updatedCategory } : c,
      ),
    );
    const updated = await categoryApi.update(
      id,
      updatedCategory,
    );
    if (updated) {
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? updated : c)),
      );
    }
  };

  const deleteCategory = async (id: number) => {
    setCategories(categories.filter((c) => c.id !== id));
    await categoryApi.delete(id);
  };

  const addBanner = async (banner: HomeBanner) => {
    setBanners([...banners, banner]);
    const created = await bannerApi.create(banner);
    if (created) {
      setBanners((prev) =>
        prev.map((b) => (b.id === banner.id ? created : b)),
      );
    }
  };

  const updateBanner = async (
    id: number,
    updatedBanner: Partial<HomeBanner>,
  ) => {
    setBanners(
      banners.map((b) =>
        b.id === id ? { ...b, ...updatedBanner } : b,
      ),
    );
    const updated = await bannerApi.update(id, updatedBanner);
    if (updated) {
      setBanners((prev) =>
        prev.map((b) => (b.id === id ? updated : b)),
      );
    }
  };

  const deleteBanner = async (id: number) => {
    setBanners(banners.filter((b) => b.id !== id));
    await bannerApi.delete(id);
  };

  const toggleSaved = (productId: number) => {
    setSavedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const addComment = (
    comment: Omit<ProductComment, "id" | "createdAt">,
  ) => {
    const newComment: ProductComment = {
      ...comment,
      id: Date.now(),
      createdAt: new Date(),
    };
    setComments([...comments, newComment]);
  };

  const deleteComment = (id: number) => {
    setComments(comments.filter((c) => c.id !== id));
  };

  const addSale = async (sale: Omit<Sale, "id">) => {
    const newSale: Sale = {
      ...sale,
      id: Date.now(),
    };
    setSales([...sales, newSale]);
    const created = await saleApi.create(sale);
    if (created) {
      setSales((prev) =>
        prev.map((s) => (s.id === newSale.id ? created : s)),
      );
    }
  };

  const updateSale = (
    id: number,
    updatedSale: Partial<Sale>,
  ) => {
    setSales(
      sales.map((s) =>
        s.id === id ? { ...s, ...updatedSale } : s,
      ),
    );
  };

  const deleteSale = async (id: number) => {
    setSales(sales.filter((s) => s.id !== id));
    await saleApi.delete(id);
  };

  const addOrder = async (order: Omit<Order, "id">) => {
    const newOrder: Order = {
      ...order,
      id: Date.now(),
    };
    setOrders([...orders, newOrder]);
    const created = await orderApi.create(order);
    if (created) {
      setOrders((prev) =>
        prev.map((o) => (o.id === newOrder.id ? created : o)),
      );
    }
  };

  const updateOrder = async (
    id: number,
    updatedOrder: Partial<Order>,
  ) => {
    setOrders(
      orders.map((o) =>
        o.id === id ? { ...o, ...updatedOrder } : o,
      ),
    );
    const updated = await orderApi.update(id, updatedOrder);
    if (updated) {
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? updated : o)),
      );
    }
  };

  const deleteOrder = async (id: number) => {
    setOrders(orders.filter((o) => o.id !== id));
    await orderApi.delete(id);
  };

  const addExpense = async (expense: Omit<Expense, "id">) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now(),
    };
    setExpenses([...expenses, newExpense]);
    const created = await expenseApi.create(expense);
    if (created) {
      setExpenses((prev) =>
        prev.map((e) => (e.id === newExpense.id ? created : e)),
      );
    }
  };

  const updateExpense = async (
    id: number,
    updatedExpense: Partial<Expense>,
  ) => {
    setExpenses(
      expenses.map((e) =>
        e.id === id ? { ...e, ...updatedExpense } : e,
      ),
    );
    const updated = await expenseApi.update(id, updatedExpense);
    if (updated) {
      setExpenses((prev) =>
        prev.map((e) => (e.id === id ? updated : e)),
      );
    }
  };

  const deleteExpense = async (id: number) => {
    setExpenses(expenses.filter((e) => e.id !== id));
    await expenseApi.delete(id);
  };

  const addEmployee = async (employee: Employee) => {
    setEmployees([...employees, employee]);
    const created = await employeeApi.create(employee);
    if (created) {
      setEmployees((prev) =>
        prev.map((e) => (e.id === employee.id ? created : e)),
      );
    }
  };

  const updateAttendance = async (entry: AttendanceEntry) => {
    const key = `${entry.date}-${entry.employeeId}`;
    setAttendance({ ...attendance, [key]: entry });
    await attendanceApi.record(entry);
  };

  const setTheme = (theme: string) => {
    setSelectedTheme(theme);
  };

  const setAdminLoggedIn = (value: boolean) => {
    setIsAdminLoggedIn(value);
  };

  return (
    <AppContext.Provider
      value={{
        products,
        categories,
        banners,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        addBanner,
        updateBanner,
        deleteBanner,
        savedProductIds,
        toggleSaved,
        comments,
        addComment,
        deleteComment,
        sales,
        addSale,
        updateSale,
        deleteSale,
        orders,
        addOrder,
        updateOrder,
        deleteOrder,
        expenses,
        addExpense,
        updateExpense,
        deleteExpense,
        employees,
        addEmployee,
        attendance,
        updateAttendance,
        themes,
        selectedTheme,
        setTheme,
        isAdminLoggedIn,
        setAdminLoggedIn,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}