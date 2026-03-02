import { createBrowserRouter } from "react-router";

// Root & Auth
import RoleSelectionScreen from "./screens/RoleSelectionScreen";
import AdminLoginScreen from "./screens/admin/AdminLoginScreen";

// User Screens
import UserMainLayout from "./screens/user/UserMainLayout";
import HomeScreen from "./screens/user/HomeScreen";
import CategoryScreen from "./screens/user/CategoryScreen";
import CategoryProductsScreen from "./screens/user/CategoryProductsScreen";
import ProductDetailScreen from "./screens/user/ProductDetailScreen";
import SavedScreen from "./screens/user/SavedScreen";
import AccountScreen from "./screens/user/AccountScreen";

// Admin Screens
import AdminMainScreen from "./screens/admin/AdminMainScreen";
import AdminSettingsScreen from "./screens/admin/AdminSettingsScreen";
import AdminStorefrontScreen from "./screens/admin/AdminStorefrontScreen";
import AttendanceScreen from "./screens/admin/AttendanceScreen";
import BusinessReportScreen from "./screens/admin/BusinessReportScreen";
import ExpensesScreen from "./screens/admin/ExpensesScreen";
import InventoryScreen from "./screens/admin/InventoryScreen";
import OrderManagementScreen from "./screens/admin/OrderManagementScreen";
import OrderReceiptScreen from "./screens/admin/OrderReceiptScreen";
import SaleReceiptScreen from "./screens/admin/SaleReceiptScreen";
import SalesManagementScreen from "./screens/admin/SalesManagementScreen";

// Admin Storefront Screens
import AdminBannerScreen from "./screens/admin/storefront/AdminBannerScreen";
import AdminCategoriesScreen from "./screens/admin/storefront/AdminCategoriesScreen";
import AdminCommentsScreen from "./screens/admin/storefront/AdminCommentsScreen";
import AdminProductsScreen from "./screens/admin/storefront/AdminProductsScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RoleSelectionScreen,
  },
  {
    path: "/admin-login",
    Component: AdminLoginScreen,
  },
  {
    path: "/user",
    Component: UserMainLayout,
    children: [
      {
        index: true,
        Component: HomeScreen,
      },
      {
        path: "category",
        Component: CategoryScreen,
      },
      {
        path: "category/:categoryName",
        Component: CategoryProductsScreen,
      },
      {
        path: "product/:productId",
        Component: ProductDetailScreen,
      },
      {
        path: "saved",
        Component: SavedScreen,
      },
      {
        path: "account",
        Component: AccountScreen,
      },
    ],
  },
  {
    path: "/admin",
    Component: AdminMainScreen,
  },
  {
    path: "/admin/settings",
    Component: AdminSettingsScreen,
  },
  {
    path: "/admin/storefront",
    Component: AdminStorefrontScreen,
  },
  {
    path: "/admin/storefront/banners",
    Component: AdminBannerScreen,
  },
  {
    path: "/admin/storefront/categories",
    Component: AdminCategoriesScreen,
  },
  {
    path: "/admin/storefront/products",
    Component: AdminProductsScreen,
  },
  {
    path: "/admin/storefront/comments",
    Component: AdminCommentsScreen,
  },
  {
    path: "/admin/attendance",
    Component: AttendanceScreen,
  },
  {
    path: "/admin/business-report",
    Component: BusinessReportScreen,
  },
  {
    path: "/admin/expenses",
    Component: ExpensesScreen,
  },
  {
    path: "/admin/inventory",
    Component: InventoryScreen,
  },
  {
    path: "/admin/orders",
    Component: OrderManagementScreen,
  },
  {
    path: "/admin/orders/:orderId",
    Component: OrderReceiptScreen,
  },
  {
    path: "/admin/sales",
    Component: SalesManagementScreen,
  },
  {
    // Sale receipt route - accessed from SalesManagementScreen
    path: "/admin/sales/:saleId",
    Component: SaleReceiptScreen,
  },
]);