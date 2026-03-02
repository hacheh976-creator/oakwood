# 🔄 OAKWOOD Update Flow - Visual Guide

## Update Types at a Glance

```
┌─────────────────────────────────────────────────────────────┐
│                    OAKWOOD FURNITURE UPDATES                 │
└─────────────────────────────────────────────────────────────┘

TYPE 1: DATA UPDATES (Instant ⚡)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Admin Panel → Click "Add Product" → Fill form → Save
                                                  │
                                                  ▼
                                        Supabase Database
                                                  │
                                                  ▼
                              Customer App → Refresh → See new product

✅ NO CODE CHANGES NEEDED
✅ NO REDEPLOYMENT NEEDED  
✅ UPDATES INSTANTLY

Examples:
  • Add/edit/delete products
  • Change prices
  • Update stock
  • Add categories
  • Record sales
  • Track orders
  • Manage expenses


TYPE 2: FEATURE UPDATES (Requires Redeploy 🚀)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Figma Make → Edit code → Test preview
                              │
                              ▼
                    Download updated code
                              │
                              ▼
              Push to GitHub or Upload to Netlify
                              │
                              ▼
                   Vercel/Netlify deploys
                              │
                              ▼
               Live site updates (1-2 minutes)

❌ REQUIRES CODE CHANGES
❌ REQUIRES REDEPLOYMENT
⏱️  TAKES 1-2 MINUTES

Examples:
  • Change colors/theme
  • Add new pages
  • Modify layout
  • Add new features
  • Update admin password
  • Change navigation
```

---

## File Location Quick Reference

```
📁 OAKWOOD FURNITURE PROJECT
│
├── 🎨 STYLES (Colors, Fonts)
│   └── /src/styles/
│       ├── theme.css          ← Change colors here
│       └── fonts.css          ← Change fonts here
│
├── 👥 USER STOREFRONT (Customer-facing)
│   └── /src/app/screens/user/
│       ├── UserHomeScreen.tsx           ← Homepage
│       ├── UserProductsScreen.tsx       ← Product listing
│       ├── UserProductDetailScreen.tsx  ← Product details
│       ├── UserCategoriesScreen.tsx     ← Categories
│       ├── UserSavedScreen.tsx          ← Favorites
│       └── UserSettingsScreen.tsx       ← Settings
│
├── 👨‍💼 ADMIN PANEL (Management)
│   └── /src/app/screens/admin/
│       ├── AdminMainScreen.tsx          ← Dashboard
│       ├── AdminLoginScreen.tsx         ← Login page
│       ├── AdminSalesScreen.tsx         ← Sales tracking
│       ├── AdminOrdersScreen.tsx        ← Order management
│       ├── AdminExpensesScreen.tsx      ← Expenses
│       ├── AdminAttendanceScreen.tsx    ← Staff attendance
│       └── /storefront/
│           ├── AdminProductsScreen.tsx  ← Product management
│           ├── AdminCategoriesScreen.tsx← Categories
│           └── AdminBannerScreen.tsx    ← Banners
│
├── 🔧 CORE SYSTEM
│   └── /src/app/
│       ├── App.tsx               ← Main app
│       ├── routes.ts             ← Page navigation
│       ├── types.ts              ← Data structures
│       ├── /contexts/
│       │   └── AppContext.tsx    ← State management & API
│       └── /services/
│           └── api.ts            ← Backend communication
│
└── 🖥️ BACKEND
    └── /supabase/functions/server/
        └── index.tsx             ← API server
```

---

## Common Tasks - Quick Guide

### 🎨 Change Website Colors

**File:** `/src/styles/theme.css`
**Search for:** `:root {`
**Change:** Color values
**Deploy:** Yes (redeploy needed)

```css
:root {
  --color-primary: #5C3B1E;     ← Change this
  --color-background: #F5EFE7;   ← Or this
}
```

---

### 📦 Add Product Field (e.g., "Weight")

**Step 1:** `/src/app/types.ts`
```typescript
export interface Product {
  // existing fields...
  weight?: number;  ← Add this
}
```

**Step 2:** `/src/app/screens/admin/storefront/AdminProductsScreen.tsx`
```tsx
// Add input field in form
<input
  type="number"
  value={formData.weight || 0}
  onChange={(e) => setFormData({ ...formData, weight: +e.target.value })}
/>
```

**Step 3:** `/src/app/screens/user/UserProductDetailScreen.tsx`
```tsx
// Display the field
<p>Weight: {product.weight} kg</p>
```

**Deploy:** Yes

---

### 🔐 Change Admin Password

**File:** `/supabase/functions/server/index.tsx`
**Search for:** `if (password === "admin123")`
**Change:** Password value
**Deploy:** Yes

```typescript
if (password === "your-new-password") {
```

---

### 🏠 Add New Page

**Step 1:** Create file `/src/app/screens/user/UserAboutScreen.tsx`
```tsx
export default function UserAboutScreen() {
  return <div>About Us Content</div>
}
```

**Step 2:** Add to `/src/app/routes.ts`
```typescript
{
  path: "/user/about",
  Component: UserAboutScreen,
}
```

**Step 3:** Add navigation button somewhere
```tsx
<button onClick={() => navigate("/user/about")}>
  About Us
</button>
```

**Deploy:** Yes

---

### 💰 Change Currency Symbol

**File:** `/src/app/utils/format.ts`
**Search for:** `formatCurrency`
**Change:** Currency symbol
**Deploy:** Yes

```typescript
export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString()}`;  // Change ₹ to $
}
```

---

### 🎯 Modify Product Grid Layout

**File:** `/src/app/screens/user/UserProductsScreen.tsx`
**Search for:** `grid grid-cols`
**Change:** Column numbers
**Deploy:** Yes

```tsx
// 2 columns on mobile, 3 on desktop:
<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

// Change to 3 columns on mobile, 4 on desktop:
<div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
```

---

## Deployment Process

### Using Vercel (with GitHub)

```
┌──────────────────────────────────────────────────────┐
│  Step 1: Make changes in Figma Make                  │
│  Step 2: Download updated code                       │
│  Step 3: Extract ZIP file                            │
│  Step 4: Push to GitHub                              │
│          $ git add .                                  │
│          $ git commit -m "Updated features"          │
│          $ git push                                   │
│  Step 5: Vercel auto-detects and deploys             │
│  Step 6: Wait 1-2 minutes                            │
│  Step 7: ✅ Live!                                     │
└──────────────────────────────────────────────────────┘
```

### Using Netlify (Drag & Drop)

```
┌──────────────────────────────────────────────────────┐
│  Step 1: Make changes in Figma Make                  │
│  Step 2: Download updated code                       │
│  Step 3: Extract ZIP file                            │
│  Step 4: Go to Netlify dashboard                     │
│  Step 5: Find your site                              │
│  Step 6: Drag folder onto "Deploys" tab             │
│  Step 7: Wait 2-3 minutes                            │
│  Step 8: ✅ Live!                                     │
└──────────────────────────────────────────────────────┘
```

---

## Testing Checklist Before Deploy

```
✅ Changes tested in Figma Make preview
✅ No console errors (Press F12)
✅ Admin panel works correctly
✅ User storefront displays properly
✅ Mobile view looks good
✅ Desktop view looks good
✅ All navigation works
✅ Forms submit correctly
✅ Database operations work
```

---

## Emergency Rollback

If something breaks after deployment:

### Vercel:
```
1. Go to Vercel dashboard
2. Click "Deployments"
3. Find last working deployment
4. Click "..." menu
5. Click "Promote to Production"
✅ Reverted to working version!
```

### Netlify:
```
1. Go to Netlify dashboard
2. Click "Deploys"
3. Find last working deploy
4. Click "Publish deploy"
✅ Reverted to working version!
```

---

## Summary Table

| What You Want To Do | Where To Edit | Redeploy? | Update Time |
|---------------------|---------------|-----------|-------------|
| Add product | Admin Panel | ❌ No | Instant |
| Change price | Admin Panel | ❌ No | Instant |
| Update stock | Admin Panel | ❌ No | Instant |
| Add category | Admin Panel | ❌ No | Instant |
| Change colors | `/src/styles/theme.css` | ✅ Yes | 1-2 min |
| Add new page | Create file + update routes | ✅ Yes | 1-2 min |
| Change password | `/supabase/functions/server/index.tsx` | ✅ Yes | 1-2 min |
| Modify layout | Screen files | ✅ Yes | 1-2 min |
| Add feature | Multiple files | ✅ Yes | 1-2 min |
| Change currency | `/src/app/utils/format.ts` | ✅ Yes | 1-2 min |

---

## Quick Tips

💡 **Start Small:** Make one change at a time  
💡 **Test First:** Always test in preview before deploying  
💡 **Keep Backups:** Save working versions  
💡 **Check Console:** Press F12 to see errors  
💡 **Clear Cache:** Ctrl+Shift+R to see latest changes  

---

For detailed instructions, see:
- `FEATURE_UPDATE_GUIDE.md` - Complete update guide
- `DEPLOYMENT_GUIDE.md` - Deployment instructions
- `ADMIN_QUICK_START.md` - Admin panel guide

Happy customizing! 🚀
