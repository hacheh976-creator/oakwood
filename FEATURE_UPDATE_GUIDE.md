# 🛠️ OAKWOOD Furniture - Feature Update Guide

## 🎯 Understanding Updates

### Two Types of Updates:

#### 1. **Data Updates (Automatic)**
- ✅ Adding/editing/deleting products
- ✅ Changing prices
- ✅ Updating categories
- ✅ Recording sales
- ✅ Managing orders
- **Where:** Admin Panel
- **Updates:** Instantly for all users

#### 2. **Feature Updates (Requires Redeployment)**
- ❌ Changing website design
- ❌ Adding new features
- ❌ Modifying navigation
- ❌ Updating colors/themes
- **Where:** Code files in Figma Make
- **Updates:** After redeploying

---

## 📁 File Structure Guide

### User-Facing Storefront Files:

```
/src/app/screens/user/
├── UserHomeScreen.tsx          → Homepage with banners
├── UserProductsScreen.tsx      → Product listing/browse
├── UserProductDetailScreen.tsx → Single product details
├── UserCategoriesScreen.tsx    → Category listing
├── UserSavedScreen.tsx         → Saved/favorite products
└── UserSettingsScreen.tsx      → User settings
```

### Admin Panel Files:

```
/src/app/screens/admin/
├── AdminMainScreen.tsx              → Admin dashboard
├── AdminLoginScreen.tsx             → Admin login
├── AdminStorefrontScreen.tsx        → Storefront menu
├── AdminSalesScreen.tsx             → Sales tracking
├── AdminOrdersScreen.tsx            → Order management
├── AdminExpensesScreen.tsx          → Expense tracking
├── AdminAttendanceScreen.tsx        → Staff attendance
├── AdminReportsScreen.tsx           → Business reports
│
└── /storefront/
    ├── AdminProductsScreen.tsx      → Product management
    ├── AdminCategoriesScreen.tsx    → Category management
    ├── AdminBannerScreen.tsx        → Banner editor
    └── AdminCommentsScreen.tsx      → Product reviews
```

### Core System Files:

```
/src/app/
├── App.tsx                     → Main app entry point
├── routes.ts                   → Page routing
├── types.ts                    → Data structures
│
├── /contexts/
│   └── AppContext.tsx          → Global state & API calls
│
├── /services/
│   └── api.ts                  → Backend API functions
│
├── /components/
│   └── [reusable components]   → Buttons, cards, etc.
│
└── /data/
    └── mockData.ts             → Initial demo data
```

### Backend Files:

```
/supabase/functions/server/
├── index.tsx                   → Backend API server
└── kv_store.tsx               → Database utilities (DON'T EDIT)
```

### Style Files:

```
/src/styles/
├── theme.css                   → Colors, fonts, base styles
└── fonts.css                   → Font imports
```

---

## 🎨 Common Feature Updates

### 1. Change Colors/Theme

**File:** `/src/styles/theme.css`

```css
:root {
  /* Change primary color */
  --color-primary: #5C3B1E;  /* Change this to your color */
  
  /* Change background color */
  --color-background: #F5EFE7;  /* Change this */
  
  /* Change text color */
  --color-text: #2C1810;  /* Change this */
}
```

**After changing:** Redeploy to see changes

---

### 2. Change Admin Password

**File:** `/supabase/functions/server/index.tsx`

**Find line 53:**
```typescript
if (password === "admin123") {
```

**Change to:**
```typescript
if (password === "your-secure-password-here") {
```

**After changing:** Redeploy to apply new password

---

### 3. Modify Homepage Banner Display

**File:** `/src/app/screens/user/UserHomeScreen.tsx`

**Find the banner section (around line 80-120)**

Example: Change banner height
```tsx
// Find this:
<div className="h-64 sm:h-96">

// Change to:
<div className="h-48 sm:h-80">  // Shorter banner
```

**After changing:** Redeploy to see changes

---

### 4. Change Product Card Layout

**File:** `/src/app/screens/user/UserProductsScreen.tsx`

**Find the product grid (around line 150-200)**

Example: Show 3 columns instead of 2
```tsx
// Find this:
<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

// Change to:
<div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
```

**After changing:** Redeploy to see changes

---

### 5. Add New Field to Product Form

**Step 1:** Update data type

**File:** `/src/app/types.ts`
```typescript
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
  
  // ADD YOUR NEW FIELD:
  weight?: number;  // Example: product weight
  material?: string;  // Example: product material
}
```

**Step 2:** Update admin product form

**File:** `/src/app/screens/admin/storefront/AdminProductsScreen.tsx`

Find the form section and add new input:
```tsx
{/* Add after description field */}
<div>
  <label className="block text-sm font-medium mb-1">
    Weight (kg)
  </label>
  <input
    type="number"
    value={formData.weight || 0}
    onChange={(e) => setFormData({ 
      ...formData, 
      weight: parseFloat(e.target.value) 
    })}
    className="w-full px-3 py-2 border rounded-lg"
  />
</div>
```

**Step 3:** Update product detail display

**File:** `/src/app/screens/user/UserProductDetailScreen.tsx`

Add display for new field:
```tsx
{/* Add in product details section */}
{product.weight && (
  <p className="text-sm text-gray-600">
    Weight: {product.weight} kg
  </p>
)}
```

**After changing:** Redeploy to see changes

---

### 6. Add New Page/Screen

**Step 1:** Create new screen file

**File:** `/src/app/screens/user/UserAboutScreen.tsx`
```tsx
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

export default function UserAboutScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F5EFE7]">
      <div className="bg-[#D4C4B0] border-b p-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-6 h-6 text-[#2C1810]" />
        </button>
        <h1 className="text-xl font-black text-[#2C1810]">About Us</h1>
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">OAKWOOD Furniture</h2>
        <p className="text-gray-700 mb-4">
          Your trusted furniture partner since 2020...
        </p>
      </div>
    </div>
  );
}
```

**Step 2:** Add route

**File:** `/src/app/routes.ts`
```typescript
import UserAboutScreen from "./screens/user/UserAboutScreen";

// Find the routes array and add:
{
  path: "/user/about",
  Component: UserAboutScreen,
},
```

**Step 3:** Add navigation link

**File:** `/src/app/screens/user/UserSettingsScreen.tsx`
```tsx
// Add a button to navigate:
<button
  onClick={() => navigate("/user/about")}
  className="w-full text-left px-4 py-3 bg-white rounded-lg"
>
  About Us
</button>
```

**After changing:** Redeploy to see new page

---

### 7. Change Logo Tap Count for Admin

**File:** `/src/app/screens/RoleSelectionScreen.tsx`

**Find (around line 10-20):**
```typescript
const handleLogoTap = () => {
  setTapCount(prev => prev + 1);
  if (tapCount + 1 === 5) {  // Change this number
    navigate("/admin/login");
  }
```

**Change to:**
```typescript
if (tapCount + 1 === 3) {  // Now need 3 taps instead of 5
```

**After changing:** Redeploy to apply changes

---

### 8. Add New Admin Feature

**Example: Add Product Export Feature**

**Step 1:** Add function to AppContext

**File:** `/src/app/contexts/AppContext.tsx`

Add to interface:
```typescript
interface AppContextType {
  // ... existing code ...
  exportProducts: () => void;  // Add this
}
```

Add function:
```typescript
const exportProducts = () => {
  const dataStr = JSON.stringify(products, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'products.json';
  link.click();
};
```

Add to provider value:
```typescript
<AppContext.Provider
  value={{
    // ... existing values ...
    exportProducts,  // Add this
  }}
>
```

**Step 2:** Add button in admin

**File:** `/src/app/screens/admin/storefront/AdminProductsScreen.tsx`

```tsx
const { products, exportProducts } = useApp();  // Get function

// Add button in header:
<button
  onClick={exportProducts}
  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
>
  Export Products
</button>
```

**After changing:** Redeploy to see new feature

---

### 9. Modify Backend API

**Example: Add Product Search Endpoint**

**File:** `/supabase/functions/server/index.tsx`

Add new endpoint:
```typescript
// Add after other product endpoints:
app.get("/make-server-04a8a779/products/search/:query", async (c) => {
  try {
    const query = c.req.param("query").toLowerCase();
    const allProducts = await kv.getByPrefix("product:");
    
    const filtered = allProducts.filter((product: any) => 
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
    
    return c.json({ products: filtered });
  } catch (error) {
    console.error("Search error:", error);
    return c.json({ error: "Search failed" }, 500);
  }
});
```

**Step 2:** Add to API service

**File:** `/src/app/services/api.ts`

```typescript
export const productApi = {
  // ... existing methods ...
  
  search: async (query: string): Promise<Product[]> => {
    try {
      const response = await fetch(`${API_BASE}/products/search/${query}`, { 
        headers 
      });
      const data = await response.json();
      return data.products || [];
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  },
};
```

**After changing:** Redeploy to apply backend changes

---

### 10. Change Currency Display

**File:** `/src/app/utils/format.ts`

```typescript
export function formatCurrency(amount: number): string {
  // Current format:
  return `₹${amount.toLocaleString()}`;
  
  // Change to USD:
  return `$${amount.toLocaleString()}`;
  
  // Or EUR:
  return `€${amount.toLocaleString()}`;
  
  // Or custom:
  return `Rs. ${amount.toLocaleString()}`;
}
```

**After changing:** Redeploy to see new currency format

---

## 🚀 How to Deploy Updates

### Method 1: Vercel (Recommended)

#### If you used GitHub:
```bash
# Make your changes in Figma Make
# Download updated code
# Push to GitHub:
git add .
git commit -m "Updated features"
git push

# Vercel will automatically deploy! ✅
```

#### If you used Vercel CLI:
```bash
# Download updated code from Figma Make
cd your-oakwood-folder
vercel --prod
```

**Your changes will be live in 1-2 minutes!**

### Method 2: Netlify

#### Drag & Drop:
1. Download updated code from Figma Make
2. Go to Netlify dashboard
3. Drag the folder onto your site
4. Wait for deployment

#### Or Git:
```bash
git push
# Netlify auto-deploys from GitHub
```

---

## 📝 Update Workflow Example

### Scenario: You want to add "Sale Badge" to products

**Step 1: Update Data Type**
```typescript
// /src/app/types.ts
export interface Product {
  // ... existing fields ...
  onSale?: boolean;
  salePercent?: number;
}
```

**Step 2: Update Admin Form**
```tsx
// /src/app/screens/admin/storefront/AdminProductsScreen.tsx
<div className="flex items-center gap-2">
  <input
    type="checkbox"
    checked={formData.onSale || false}
    onChange={(e) => setFormData({ 
      ...formData, 
      onSale: e.target.checked 
    })}
  />
  <label>On Sale</label>
</div>

{formData.onSale && (
  <input
    type="number"
    placeholder="Sale %"
    value={formData.salePercent || 0}
    onChange={(e) => setFormData({ 
      ...formData, 
      salePercent: parseInt(e.target.value) 
    })}
  />
)}
```

**Step 3: Update Product Display**
```tsx
// /src/app/screens/user/UserProductsScreen.tsx
{product.onSale && (
  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
    {product.salePercent}% OFF
  </div>
)}
```

**Step 4: Deploy**
```bash
# Download code
# Push to GitHub or upload to Netlify
# Wait for deployment
# ✅ Feature live!
```

---

## ⚡ Quick Reference

### What Updates Instantly (No Redeploy):
✅ Product data (name, price, stock, images)  
✅ Categories  
✅ Banners  
✅ Sales records  
✅ Orders  
✅ Expenses  
✅ Employee info  
✅ Attendance  

**How:** Admin Panel → Make changes → Automatically in database

### What Needs Redeployment:
❌ Design/layout changes  
❌ New features  
❌ Color changes  
❌ New pages  
❌ Form modifications  
❌ Backend API changes  
❌ Navigation updates  

**How:** Edit code in Figma Make → Download → Redeploy

---

## 🆘 Troubleshooting Updates

### Changes Not Showing After Redeploy:

1. **Clear Browser Cache:**
   - Press `Ctrl + Shift + R` (Windows)
   - Press `Cmd + Shift + R` (Mac)

2. **Check Deployment Status:**
   - Vercel: Check dashboard for deployment status
   - Netlify: Check deploy log

3. **Verify Code Was Updated:**
   - Check if you downloaded latest code
   - Check if git push was successful

### Database Changes Not Showing:

1. **Refresh the page**
2. **Check browser console (F12)** for errors
3. **Verify API is working:** Check Network tab in DevTools
4. **Check Supabase status:** Make sure backend is running

---

## 💡 Best Practices

### Before Making Changes:
1. ✅ Test in Figma Make preview first
2. ✅ Make small changes at a time
3. ✅ Keep backup of working code

### When Making Changes:
1. ✅ Update one feature at a time
2. ✅ Test thoroughly in preview
3. ✅ Check console for errors (F12)

### After Deploying:
1. ✅ Test on actual deployment URL
2. ✅ Test on mobile and desktop
3. ✅ Verify database operations work
4. ✅ Check all pages load correctly

---

## 🎯 Common Customizations Checklist

Use this checklist for your customizations:

- [ ] Change company name/logo
- [ ] Update color scheme
- [ ] Modify admin password
- [ ] Add custom product fields
- [ ] Change currency format
- [ ] Add about us page
- [ ] Modify homepage layout
- [ ] Add social media links
- [ ] Change contact information
- [ ] Customize email/phone formats

---

## 📞 Need Help?

### For Data Changes (Products, Sales, etc.):
→ Use Admin Panel - No coding needed!

### For Feature Changes:
1. Find the file in the structure above
2. Make the change
3. Test in Figma Make preview
4. Download and redeploy

### Finding Specific Code:
- Use Figma Make's search (Ctrl+F)
- Look in the file structure above
- Check component names match screen names

---

## 🎉 Summary

**Automatic Updates (Database):**
- Admin Panel changes
- Product/category/banner updates
- Sales/orders/expenses
- No redeployment needed

**Manual Updates (Code):**
- Design changes
- New features
- Layout modifications
- Requires redeployment

**Deployment Time:**
- Vercel: 1-2 minutes
- Netlify: 2-3 minutes

**Your changes will be live for all users!**

---

Ready to customize your OAKWOOD Furniture app! 🚀
