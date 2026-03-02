# 💼 Real-World Update Examples for OAKWOOD Furniture

## Common Business Scenarios & How to Update

---

## Scenario 1: "I want to add a WhatsApp contact button"

### ✅ Solution (15 minutes)

**Step 1:** Open `/src/app/screens/user/UserSettingsScreen.tsx`

**Step 2:** Find the settings menu (around line 40-80)

**Step 3:** Add this code:

```tsx
import { MessageCircle } from "lucide-react";  // Add to imports at top

// Add in the settings list:
<button
  onClick={() => {
    window.open('https://wa.me/1234567890?text=Hello%20OAKWOOD', '_blank');
  }}
  className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm w-full"
>
  <MessageCircle className="w-6 h-6 text-green-500" />
  <div className="flex-1 text-left">
    <div className="font-semibold">Contact on WhatsApp</div>
    <div className="text-sm text-gray-500">Chat with us</div>
  </div>
</button>
```

**Step 4:** Replace `1234567890` with your WhatsApp number (with country code)

**Step 5:** Download, redeploy

**Result:** Users can tap to open WhatsApp chat with you! ✅

---

## Scenario 2: "I want to show 'Out of Stock' instead of stock number"

### ✅ Solution (10 minutes)

**Step 1:** Open `/src/app/screens/user/UserProductsScreen.tsx`

**Step 2:** Find the stock display (search for "In Stock")

**Step 3:** Replace:

```tsx
// OLD:
<p className="text-sm text-gray-500">
  In Stock: {product.stock}
</p>

// NEW:
<p className={`text-sm font-semibold ${
  product.stock > 0 ? 'text-green-600' : 'text-red-600'
}`}>
  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
</p>
```

**Step 4:** Do the same in `/src/app/screens/user/UserProductDetailScreen.tsx`

**Step 5:** Download, redeploy

**Result:** Shows "In Stock" or "Out of Stock" instead of numbers! ✅

---

## Scenario 3: "I want to add my business address in footer"

### ✅ Solution (20 minutes)

**Step 1:** Create footer component `/src/app/components/Footer.tsx`

```tsx
export function Footer() {
  return (
    <footer className="bg-[#2C1810] text-white py-8 px-6">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-xl font-bold mb-4">OAKWOOD Furniture</h3>
        
        <div className="space-y-2 text-sm opacity-90">
          <p>📍 123 Furniture Street, Your City, PIN 123456</p>
          <p>📞 Phone: +91 1234567890</p>
          <p>📧 Email: info@oakwood.com</p>
          <p>🕒 Mon-Sat: 9AM - 7PM</p>
        </div>
        
        <div className="mt-6 pt-6 border-t border-white/20 text-center text-xs opacity-75">
          © 2026 OAKWOOD Furniture. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
```

**Step 2:** Add to user screens

Open each user screen file and add at the bottom:

```tsx
import { Footer } from "../../components/Footer";  // Add to imports

// At the end of your screen's return, before closing </div>:
<Footer />
```

**Step 3:** Update your business details in Footer.tsx

**Step 4:** Download, redeploy

**Result:** Professional footer on all user pages! ✅

---

## Scenario 4: "I want to add discount % to products"

### ✅ Solution (30 minutes)

**Step 1:** Update data type `/src/app/types.ts`

```tsx
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;  // ADD THIS
  discountPercent?: number; // ADD THIS
  stock: number;
  image: string;
  gallery?: string[];
  description: string;
  isFeatured: boolean;
}
```

**Step 2:** Update admin form `/src/app/screens/admin/storefront/AdminProductsScreen.tsx`

Add to form (around line 200-300):

```tsx
{/* Add after price input */}
<div>
  <label className="block text-sm font-medium mb-1">
    Original Price (Optional)
  </label>
  <input
    type="number"
    value={formData.originalPrice || ''}
    onChange={(e) => setFormData({ 
      ...formData, 
      originalPrice: parseFloat(e.target.value) || undefined 
    })}
    className="w-full px-3 py-2 border rounded-lg"
    placeholder="Enter if product is on discount"
  />
</div>

<div>
  <label className="block text-sm font-medium mb-1">
    Discount % (Optional)
  </label>
  <input
    type="number"
    value={formData.discountPercent || ''}
    onChange={(e) => setFormData({ 
      ...formData, 
      discountPercent: parseFloat(e.target.value) || undefined 
    })}
    className="w-full px-3 py-2 border rounded-lg"
    placeholder="e.g., 20 for 20% off"
  />
</div>
```

**Step 3:** Update product display `/src/app/screens/user/UserProductsScreen.tsx`

Replace price display:

```tsx
{/* OLD: */}
<p className="text-lg font-bold text-[#5C3B1E]">
  {formatCurrency(product.price)}
</p>

{/* NEW: */}
<div className="flex items-center gap-2">
  <p className="text-lg font-bold text-[#5C3B1E]">
    {formatCurrency(product.price)}
  </p>
  {product.originalPrice && (
    <>
      <p className="text-sm text-gray-500 line-through">
        {formatCurrency(product.originalPrice)}
      </p>
      {product.discountPercent && (
        <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">
          {product.discountPercent}% OFF
        </span>
      )}
    </>
  )}
</div>
```

**Step 4:** Do the same in `/src/app/screens/user/UserProductDetailScreen.tsx`

**Step 5:** Download, redeploy

**Result:** Products can show original price with discount badge! ✅

---

## Scenario 5: "I want customers to call me from the app"

### ✅ Solution (10 minutes)

**Step 1:** Open `/src/app/screens/user/UserSettingsScreen.tsx`

**Step 2:** Add call button:

```tsx
import { Phone } from "lucide-react";  // Add to imports

// Add in settings menu:
<a
  href="tel:+911234567890"  // Replace with your number
  className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm w-full"
>
  <Phone className="w-6 h-6 text-blue-500" />
  <div className="flex-1 text-left">
    <div className="font-semibold">Call Us</div>
    <div className="text-sm text-gray-500">+91 123 456 7890</div>
  </div>
</a>
```

**Step 3:** Download, redeploy

**Result:** Users can tap to call directly! ✅

---

## Scenario 6: "I want to add product dimensions field"

### ✅ Solution (25 minutes)

**Step 1:** Update type `/src/app/types.ts`

```tsx
export interface Product {
  // ... existing fields
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}
```

**Step 2:** Update admin form `/src/app/screens/admin/storefront/AdminProductsScreen.tsx`

```tsx
// Add to form state at top:
const [formData, setFormData] = useState({
  // ... existing fields
  dimensions: { length: 0, width: 0, height: 0 },
});

// Add in form:
<div className="space-y-2">
  <label className="block text-sm font-medium">
    Dimensions (L × W × H in cm)
  </label>
  <div className="grid grid-cols-3 gap-2">
    <input
      type="number"
      placeholder="Length"
      value={formData.dimensions?.length || 0}
      onChange={(e) => setFormData({ 
        ...formData, 
        dimensions: { 
          ...formData.dimensions, 
          length: parseFloat(e.target.value) || 0 
        }
      })}
      className="px-3 py-2 border rounded-lg"
    />
    <input
      type="number"
      placeholder="Width"
      value={formData.dimensions?.width || 0}
      onChange={(e) => setFormData({ 
        ...formData, 
        dimensions: { 
          ...formData.dimensions, 
          width: parseFloat(e.target.value) || 0 
        }
      })}
      className="px-3 py-2 border rounded-lg"
    />
    <input
      type="number"
      placeholder="Height"
      value={formData.dimensions?.height || 0}
      onChange={(e) => setFormData({ 
        ...formData, 
        dimensions: { 
          ...formData.dimensions, 
          height: parseFloat(e.target.value) || 0 
        }
      })}
      className="px-3 py-2 border rounded-lg"
    />
  </div>
</div>
```

**Step 3:** Display in product details `/src/app/screens/user/UserProductDetailScreen.tsx`

```tsx
{product.dimensions && (
  <div className="flex items-center gap-2 text-sm text-gray-600">
    <span>📏</span>
    <span>
      {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} cm
    </span>
  </div>
)}
```

**Step 4:** Download, redeploy

**Result:** Products now show dimensions! ✅

---

## Scenario 7: "I want to change the app name from OAKWOOD"

### ✅ Solution (20 minutes)

**Step 1:** Update main title in all screen files

Search for "OAKWOOD" in all files and replace with your name

**Files to check:**
- `/src/app/screens/RoleSelectionScreen.tsx`
- All admin screens
- All user screens
- Footer (if you added one)

**Step 2:** Update page title `/index.html`

```html
<title>Your Business Name</title>
```

**Step 3:** Update theme colors (optional) `/src/styles/theme.css`

```css
:root {
  --color-primary: #YOUR_COLOR;
}
```

**Step 4:** Download, redeploy

**Result:** Rebranded with your business name! ✅

---

## Scenario 8: "I want to add 'Sold Out' products at the bottom"

### ✅ Solution (15 minutes)

**Step 1:** Open `/src/app/screens/user/UserProductsScreen.tsx`

**Step 2:** Find where products are filtered/sorted (around line 100-150)

**Step 3:** Add sorting logic:

```tsx
// Find the products display section and update:
const sortedProducts = [...filteredProducts].sort((a, b) => {
  // In-stock products first
  if (a.stock > 0 && b.stock === 0) return -1;
  if (a.stock === 0 && b.stock > 0) return 1;
  return 0;
});

// Then map over sortedProducts instead of filteredProducts:
{sortedProducts.map((product) => (
  // ... product card
))}
```

**Step 4:** Add visual indication for out of stock:

```tsx
<div className={`relative ${product.stock === 0 ? 'opacity-60' : ''}`}>
  {product.stock === 0 && (
    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
      <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold">
        SOLD OUT
      </span>
    </div>
  )}
  {/* rest of product card */}
</div>
```

**Step 5:** Download, redeploy

**Result:** Sold out products appear at bottom with overlay! ✅

---

## Scenario 9: "I want to add Instagram link"

### ✅ Solution (10 minutes)

**Step 1:** Open `/src/app/screens/user/UserSettingsScreen.tsx`

**Step 2:** Add Instagram button:

```tsx
import { Instagram } from "lucide-react";  // Add to imports

// Add in settings menu:
<a
  href="https://instagram.com/yourusername"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm w-full"
>
  <Instagram className="w-6 h-6 text-pink-500" />
  <div className="flex-1 text-left">
    <div className="font-semibold">Follow Us on Instagram</div>
    <div className="text-sm text-gray-500">@yourusername</div>
  </div>
</a>
```

**Step 3:** Replace with your Instagram username

**Step 4:** Download, redeploy

**Result:** Direct link to your Instagram! ✅

---

## Scenario 10: "I want minimum order quantity"

### ✅ Solution (30 minutes)

**Step 1:** Update type `/src/app/types.ts`

```tsx
export interface Product {
  // ... existing fields
  minOrderQty?: number;  // ADD THIS
}
```

**Step 2:** Update admin form `/src/app/screens/admin/storefront/AdminProductsScreen.tsx`

```tsx
<div>
  <label className="block text-sm font-medium mb-1">
    Minimum Order Quantity (Optional)
  </label>
  <input
    type="number"
    value={formData.minOrderQty || 1}
    onChange={(e) => setFormData({ 
      ...formData, 
      minOrderQty: parseInt(e.target.value) || 1 
    })}
    className="w-full px-3 py-2 border rounded-lg"
    min="1"
  />
</div>
```

**Step 3:** Show in product details `/src/app/screens/user/UserProductDetailScreen.tsx`

```tsx
{product.minOrderQty && product.minOrderQty > 1 && (
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
    ⚠️ Minimum order quantity: {product.minOrderQty} units
  </div>
)}
```

**Step 4:** Download, redeploy

**Result:** Products can have minimum order requirements! ✅

---

## Time Estimates

| Task | Time | Difficulty |
|------|------|-----------|
| Add contact button | 10 min | ⭐ Easy |
| Change display text | 10 min | ⭐ Easy |
| Add footer | 20 min | ⭐⭐ Medium |
| Add product field | 25 min | ⭐⭐ Medium |
| Add discount system | 30 min | ⭐⭐⭐ Advanced |
| Rebrand app | 20 min | ⭐⭐ Medium |
| Sort products | 15 min | ⭐⭐ Medium |

---

## Testing Your Changes

After each change:

```
✅ Test in Figma Make preview
✅ Check mobile view (narrow browser)
✅ Check desktop view (wide browser)
✅ Test admin panel works
✅ Test user side works
✅ Check browser console (F12) for errors
✅ Deploy and test live site
```

---

## Quick Tips for Beginners

1. **Start with simple changes** (like adding buttons)
2. **Copy existing code patterns** (find similar feature, copy structure)
3. **Change one thing at a time** (easier to debug)
4. **Use Ctrl+F to search** (find specific text in files)
5. **Check console for errors** (F12 key)
6. **Test before deploying** (use Figma Make preview)
7. **Keep backups** (download working version before big changes)

---

Ready to customize! Pick a scenario and start updating! 🚀
