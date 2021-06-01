// Protected imports
import Dashboard from "./admin/Dashboard";
import Orders from "./admin/Orders";
import OrderDetails from "./admin/OrderDetails";
import ProductsAdmin from "./admin/ProductsAdmin";
import ProductDetailsAdmin from "./admin/ProductDetailsAdmin";
import NewProduct from "./admin/NewProduct";
import ForgotPassword from "./admin/ForgotPassword";

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
  { path: "/admin/new-product", component: NewProduct },
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
  { path: "/resetPassword", component: ForgotPassword },
];

export { routes, protectedRoutes };
