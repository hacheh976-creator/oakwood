import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

// Create storage bucket on startup
const initStorage = async () => {
  try {
    const bucketName = "make-04a8a779-products";
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some((bucket) => bucket.name === bucketName);
    
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, {
        public: false,
        fileSizeLimit: 5242880, // 5MB
      });
      console.log(`Created storage bucket: ${bucketName}`);
    }
  } catch (error) {
    console.error("Error initializing storage:", error);
  }
};

initStorage();

// Enable logger
app.use("*", logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  })
);

// Health check endpoint
app.get("/make-server-04a8a779/health", (c) => {
  return c.json({ status: "ok" });
});

// ==================== ADMIN AUTH ====================

app.post("/make-server-04a8a779/admin/login", async (c) => {
  try {
    const { password } = await c.req.json();
    
    if (password === "admin123") {
      return c.json({ success: true, message: "Login successful" });
    } else {
      return c.json({ success: false, message: "Invalid password" }, 401);
    }
  } catch (error) {
    console.error("Admin login error:", error);
    return c.json({ error: "Login failed" }, 500);
  }
});

// ==================== PRODUCTS ====================

// Get all products
app.get("/make-server-04a8a779/products", async (c) => {
  try {
    const products = await kv.getByPrefix("product:");
    return c.json({ products: products || [] });
  } catch (error) {
    console.error("Error fetching products:", error);
    return c.json({ error: "Failed to fetch products" }, 500);
  }
});

// Get single product
app.get("/make-server-04a8a779/products/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const product = await kv.get(`product:${id}`);
    
    if (!product) {
      return c.json({ error: "Product not found" }, 404);
    }
    
    return c.json({ product });
  } catch (error) {
    console.error("Error fetching product:", error);
    return c.json({ error: "Failed to fetch product" }, 500);
  }
});

// Create product
app.post("/make-server-04a8a779/products", async (c) => {
  try {
    const productData = await c.req.json();
    const id = Date.now();
    const product = { ...productData, id };
    
    await kv.set(`product:${id}`, product);
    return c.json({ product, message: "Product created successfully" });
  } catch (error) {
    console.error("Error creating product:", error);
    return c.json({ error: "Failed to create product" }, 500);
  }
});

// Update product
app.put("/make-server-04a8a779/products/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const productData = await c.req.json();
    const product = { ...productData, id: parseInt(id) };
    
    await kv.set(`product:${id}`, product);
    return c.json({ product, message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    return c.json({ error: "Failed to update product" }, 500);
  }
});

// Delete product
app.delete("/make-server-04a8a779/products/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`product:${id}`);
    return c.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return c.json({ error: "Failed to delete product" }, 500);
  }
});

// Upload product image
app.post("/make-server-04a8a779/upload-image", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return c.json({ error: "No file provided" }, 400);
    }

    const fileName = `${Date.now()}-${file.name}`;
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const { data, error } = await supabase.storage
      .from("make-04a8a779-products")
      .upload(fileName, uint8Array, {
        contentType: file.type,
      });

    if (error) {
      console.error("Upload error:", error);
      return c.json({ error: "Failed to upload image" }, 500);
    }

    // Get signed URL (valid for 10 years)
    const { data: signedUrlData } = await supabase.storage
      .from("make-04a8a779-products")
      .createSignedUrl(fileName, 315360000);

    return c.json({ 
      imageUrl: signedUrlData?.signedUrl,
      message: "Image uploaded successfully" 
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return c.json({ error: "Failed to upload image" }, 500);
  }
});

// ==================== CATEGORIES ====================

app.get("/make-server-04a8a779/categories", async (c) => {
  try {
    const categories = await kv.getByPrefix("category:");
    return c.json({ categories: categories || [] });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return c.json({ error: "Failed to fetch categories" }, 500);
  }
});

app.post("/make-server-04a8a779/categories", async (c) => {
  try {
    const categoryData = await c.req.json();
    const id = Date.now();
    const category = { ...categoryData, id };
    
    await kv.set(`category:${id}`, category);
    return c.json({ category, message: "Category created successfully" });
  } catch (error) {
    console.error("Error creating category:", error);
    return c.json({ error: "Failed to create category" }, 500);
  }
});

app.put("/make-server-04a8a779/categories/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const categoryData = await c.req.json();
    const category = { ...categoryData, id: parseInt(id) };
    
    await kv.set(`category:${id}`, category);
    return c.json({ category, message: "Category updated successfully" });
  } catch (error) {
    console.error("Error updating category:", error);
    return c.json({ error: "Failed to update category" }, 500);
  }
});

app.delete("/make-server-04a8a779/categories/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`category:${id}`);
    return c.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return c.json({ error: "Failed to delete category" }, 500);
  }
});

// ==================== HOME BANNERS ====================

app.get("/make-server-04a8a779/banners", async (c) => {
  try {
    const banners = await kv.getByPrefix("banner:");
    return c.json({ banners: banners || [] });
  } catch (error) {
    console.error("Error fetching banners:", error);
    return c.json({ error: "Failed to fetch banners" }, 500);
  }
});

app.post("/make-server-04a8a779/banners", async (c) => {
  try {
    const bannerData = await c.req.json();
    const id = Date.now();
    const banner = { ...bannerData, id };
    
    await kv.set(`banner:${id}`, banner);
    return c.json({ banner, message: "Banner created successfully" });
  } catch (error) {
    console.error("Error creating banner:", error);
    return c.json({ error: "Failed to create banner" }, 500);
  }
});

app.put("/make-server-04a8a779/banners/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const bannerData = await c.req.json();
    const banner = { ...bannerData, id: parseInt(id) };
    
    await kv.set(`banner:${id}`, banner);
    return c.json({ banner, message: "Banner updated successfully" });
  } catch (error) {
    console.error("Error updating banner:", error);
    return c.json({ error: "Failed to update banner" }, 500);
  }
});

app.delete("/make-server-04a8a779/banners/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`banner:${id}`);
    return c.json({ message: "Banner deleted successfully" });
  } catch (error) {
    console.error("Error deleting banner:", error);
    return c.json({ error: "Failed to delete banner" }, 500);
  }
});

// ==================== SALES ====================

app.get("/make-server-04a8a779/sales", async (c) => {
  try {
    const sales = await kv.getByPrefix("sale:");
    return c.json({ sales: sales || [] });
  } catch (error) {
    console.error("Error fetching sales:", error);
    return c.json({ error: "Failed to fetch sales" }, 500);
  }
});

app.post("/make-server-04a8a779/sales", async (c) => {
  try {
    const saleData = await c.req.json();
    const id = Date.now();
    const sale = { ...saleData, id, date: new Date().toISOString() };
    
    await kv.set(`sale:${id}`, sale);
    return c.json({ sale, message: "Sale recorded successfully" });
  } catch (error) {
    console.error("Error creating sale:", error);
    return c.json({ error: "Failed to create sale" }, 500);
  }
});

app.delete("/make-server-04a8a779/sales/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`sale:${id}`);
    return c.json({ message: "Sale deleted successfully" });
  } catch (error) {
    console.error("Error deleting sale:", error);
    return c.json({ error: "Failed to delete sale" }, 500);
  }
});

// ==================== ORDERS ====================

app.get("/make-server-04a8a779/orders", async (c) => {
  try {
    const orders = await kv.getByPrefix("order:");
    return c.json({ orders: orders || [] });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return c.json({ error: "Failed to fetch orders" }, 500);
  }
});

app.post("/make-server-04a8a779/orders", async (c) => {
  try {
    const orderData = await c.req.json();
    const id = Date.now();
    const order = { 
      ...orderData, 
      id, 
      orderDate: new Date().toISOString(),
      status: orderData.status || "Pending"
    };
    
    await kv.set(`order:${id}`, order);
    return c.json({ order, message: "Order created successfully" });
  } catch (error) {
    console.error("Error creating order:", error);
    return c.json({ error: "Failed to create order" }, 500);
  }
});

app.put("/make-server-04a8a779/orders/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const orderData = await c.req.json();
    const order = { ...orderData, id: parseInt(id) };
    
    await kv.set(`order:${id}`, order);
    return c.json({ order, message: "Order updated successfully" });
  } catch (error) {
    console.error("Error updating order:", error);
    return c.json({ error: "Failed to update order" }, 500);
  }
});

app.delete("/make-server-04a8a779/orders/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`order:${id}`);
    return c.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    return c.json({ error: "Failed to delete order" }, 500);
  }
});

// ==================== EXPENSES ====================

app.get("/make-server-04a8a779/expenses", async (c) => {
  try {
    const expenses = await kv.getByPrefix("expense:");
    return c.json({ expenses: expenses || [] });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return c.json({ error: "Failed to fetch expenses" }, 500);
  }
});

app.post("/make-server-04a8a779/expenses", async (c) => {
  try {
    const expenseData = await c.req.json();
    const id = Date.now();
    const expense = { ...expenseData, id, date: new Date().toISOString() };
    
    await kv.set(`expense:${id}`, expense);
    return c.json({ expense, message: "Expense recorded successfully" });
  } catch (error) {
    console.error("Error creating expense:", error);
    return c.json({ error: "Failed to create expense" }, 500);
  }
});

app.put("/make-server-04a8a779/expenses/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const expenseData = await c.req.json();
    const expense = { ...expenseData, id: parseInt(id) };
    
    await kv.set(`expense:${id}`, expense);
    return c.json({ expense, message: "Expense updated successfully" });
  } catch (error) {
    console.error("Error updating expense:", error);
    return c.json({ error: "Failed to update expense" }, 500);
  }
});

app.delete("/make-server-04a8a779/expenses/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`expense:${id}`);
    return c.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return c.json({ error: "Failed to delete expense" }, 500);
  }
});

// ==================== EMPLOYEES ====================

app.get("/make-server-04a8a779/employees", async (c) => {
  try {
    const employees = await kv.getByPrefix("employee:");
    return c.json({ employees: employees || [] });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return c.json({ error: "Failed to fetch employees" }, 500);
  }
});

app.post("/make-server-04a8a779/employees", async (c) => {
  try {
    const employeeData = await c.req.json();
    const id = Date.now();
    const employee = { ...employeeData, id, joinDate: new Date().toISOString() };
    
    await kv.set(`employee:${id}`, employee);
    return c.json({ employee, message: "Employee added successfully" });
  } catch (error) {
    console.error("Error creating employee:", error);
    return c.json({ error: "Failed to create employee" }, 500);
  }
});

app.put("/make-server-04a8a779/employees/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const employeeData = await c.req.json();
    const employee = { ...employeeData, id: parseInt(id) };
    
    await kv.set(`employee:${id}`, employee);
    return c.json({ employee, message: "Employee updated successfully" });
  } catch (error) {
    console.error("Error updating employee:", error);
    return c.json({ error: "Failed to update employee" }, 500);
  }
});

app.delete("/make-server-04a8a779/employees/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`employee:${id}`);
    return c.json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return c.json({ error: "Failed to delete employee" }, 500);
  }
});

// ==================== ATTENDANCE ====================

app.get("/make-server-04a8a779/attendance", async (c) => {
  try {
    const attendanceRecords = await kv.getByPrefix("attendance:");
    return c.json({ attendance: attendanceRecords || [] });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return c.json({ error: "Failed to fetch attendance" }, 500);
  }
});

app.post("/make-server-04a8a779/attendance", async (c) => {
  try {
    const attendanceData = await c.req.json();
    const key = `attendance:${attendanceData.employeeId}:${attendanceData.date}`;
    
    await kv.set(key, attendanceData);
    return c.json({ attendance: attendanceData, message: "Attendance recorded successfully" });
  } catch (error) {
    console.error("Error recording attendance:", error);
    return c.json({ error: "Failed to record attendance" }, 500);
  }
});

app.put("/make-server-04a8a779/attendance/:employeeId/:date", async (c) => {
  try {
    const employeeId = c.req.param("employeeId");
    const date = c.req.param("date");
    const attendanceData = await c.req.json();
    const key = `attendance:${employeeId}:${date}`;
    
    await kv.set(key, { ...attendanceData, employeeId: parseInt(employeeId), date });
    return c.json({ attendance: attendanceData, message: "Attendance updated successfully" });
  } catch (error) {
    console.error("Error updating attendance:", error);
    return c.json({ error: "Failed to update attendance" }, 500);
  }
});

// ==================== PRODUCT COMMENTS ====================

app.get("/make-server-04a8a779/comments/:productId", async (c) => {
  try {
    const productId = c.req.param("productId");
    const allComments = await kv.getByPrefix("comment:");
    const productComments = allComments.filter((comment: any) => 
      comment.productId === parseInt(productId)
    );
    return c.json({ comments: productComments || [] });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return c.json({ error: "Failed to fetch comments" }, 500);
  }
});

app.post("/make-server-04a8a779/comments", async (c) => {
  try {
    const commentData = await c.req.json();
    const id = Date.now();
    const comment = { 
      ...commentData, 
      id, 
      createdAt: new Date().toISOString() 
    };
    
    await kv.set(`comment:${id}`, comment);
    return c.json({ comment, message: "Comment added successfully" });
  } catch (error) {
    console.error("Error creating comment:", error);
    return c.json({ error: "Failed to create comment" }, 500);
  }
});

app.delete("/make-server-04a8a779/comments/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`comment:${id}`);
    return c.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return c.json({ error: "Failed to delete comment" }, 500);
  }
});

Deno.serve(app.fetch);