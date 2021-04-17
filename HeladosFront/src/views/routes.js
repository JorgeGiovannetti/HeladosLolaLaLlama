// Protected imports
import Dashboard from "./admin/Dashboard";
import Orders from "./admin/Orders";
import OrderDetails from "./admin/OrderDetails";
import ProductsAdmin from "./admin/ProductsAdmin";
import ProductDetailsAdmin from "./admin/ProductDetailsAdmin";

// General imports
import Landing from "./general/Landing";
import Login from "./admin/Login";
import Products from "./general/Products";
import ProductDetail from "./general/ProductDetail";
import Cart from "./general/Cart";
import Checkout from "./general/Checkout";

// Protected routes
const protectedRoutes = [
  { path: "/admin", component: Dashboard },
  { path: "/admin/orders", component: Orders },
  { path: "/admin/orders/:id", component: OrderDetails },
  { path: "/admin/products", component: ProductsAdmin },
  { path: "/admin/products/:id", component: ProductDetailsAdmin },
];

// General routes
const routes = [
  { path: "/", component: Landing },
  { path: "/admin/login", component: Login },
  { path: "/products", component: Products },
  { path: "/products/:id", component: ProductDetail },
  { path: "/cart", component: Cart },
  { path: "/checkout", component: Checkout },
];

export { routes, protectedRoutes };
