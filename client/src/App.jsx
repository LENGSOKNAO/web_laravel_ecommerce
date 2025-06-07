import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios"; // Added missing axios import
import Product from "./Screens/Admin/List/Product";
import CreateProduct from "./Screens/Admin/Create/CreateProduct";
import Banner from "./Screens/Admin/List/Banner";
import Slider from "./Screens/Admin/List/Slider";
import Logo from "./Screens/Admin/List/Logo";
import Order from "./Screens/Admin/List/Order";
import Email from "./Screens/Admin/List/Email";
import Customer from "./Screens/Admin/List/Customer";
import Settings from "./Screens/Admin/List/Settings";
import Profile from "./Screens/Admin/List/Profile";
import Dashboard from "./Screens/Admin/Dashboard";
import CreateBanner from "./Screens/Admin/Create/CreateBanner";
import CreateSlider from "./Screens/Admin/Create/CreateSlider";
import CreateLogo from "./Screens/Admin/Create/CreateLogo";
import EditLogo from "./Screens/Admin/Edit/EditLogo";
import ViewProduct from "./Screens/Admin/List/ViewProduct";
import EditProduct from "./Screens/Admin/Edit/EditProduct";
import ViewBanner from "./Screens/Admin/List/ViewBanner";
import EditBanner from "./Screens/Admin/Edit/EditBanner";
import ViewSlider from "./Screens/Admin/List/ViewSlider";
import EditSlider from "./Screens/Admin/Edit/EditSlider";
import ViewLogo from "./Screens/Admin/List/ViewLogo";
import Home from "./Screens/Home";
import AOS from "aos";
import "aos/dist/aos.css";
import "swiper/css";
import Shop from "./Screens/Shop";
import Cart from "./Screens/Cart";
import CartPage from "./Screens/CartPage";
import WishlistPage from "./Screens/WishlistPage";
import Checkout from "./Screens/Checkout";
import OrderConfirmation from "./Screens/OrderConfirmation";
import ProductDetails from "./Screens/Admin/List/ProductDetails";
import Login from "./components/Login";
import Register from "./Components/register";
import OrderHistory from "./Screens/OrderHistory";
import Orders from "./Screens/Orders";

// ProtectedRoute component to guard admin routes
const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init();
  }, []);

  useEffect(() => {
    console.log("Token changed:", token);
    const validateToken = async () => {
      console.log("Validating token...");
      if (token) {
        try {
          const response = await axios.get(
            "http://localhost:1629/api/admin/me",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          console.log("Validation response:", response.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error(
            "Token validation failed:",
            error.response?.status,
            error.message
          );
          setToken(null);
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };
    validateToken();
  }, [token]);

  useEffect(() => {
    console.log("Updating localStorage, token:", token);
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  console.log(
    "App render - isAuthenticated:",
    isAuthenticated,
    "token:",
    token
  );

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 text-white z-50 flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 border-2 border-gold-500 rounded-full flex items-center justify-center animate-spin">
            <div className="w-16 h-16 border-t-2 border-gold-500 rounded-full animate-spin-reverse"></div>
          </div>
          <h3 className="text-sm  mb-2 text-gold-400">
            © 2025, All right reserved By soknao And Rith
          </h3>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes (Client) */}
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/:id" element={<Cart />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-confirmation" element={<OrderConfirmation />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/order-history" element={<OrderHistory />} />
      <Route path="/order/:id" element={<Orders />} />
      {/* login */}
      <Route path="/login" element={<Login setToken={setToken} />} />
      <Route path="/register" element={<Register setToken={setToken} />} />

      {/* Admin Routes (Protected) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/product/list"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Product />
          </ProtectedRoute>
        }
      />
      <Route
        path="/product/create"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <CreateProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/product/edit/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <EditProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/product/view/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ViewProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/banner/list"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Banner />
          </ProtectedRoute>
        }
      />
      <Route
        path="/banner/create"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <CreateBanner />
          </ProtectedRoute>
        }
      />
      <Route
        path="/banner/edit/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <EditBanner />
          </ProtectedRoute>
        }
      />
      <Route
        path="/banner/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ViewBanner />
          </ProtectedRoute>
        }
      />
      <Route
        path="/slider/list"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Slider />
          </ProtectedRoute>
        }
      />
      <Route
        path="/slider/create"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <CreateSlider />
          </ProtectedRoute>
        }
      />
      <Route
        path="/slider/edit/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <EditSlider />
          </ProtectedRoute>
        }
      />
      <Route
        path="/slider/view/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ViewSlider />
          </ProtectedRoute>
        }
      />
      <Route
        path="/logo/list"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Logo />
          </ProtectedRoute>
        }
      />
      <Route
        path="/logo/create"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <CreateLogo />
          </ProtectedRoute>
        }
      />
      <Route
        path="/logo/edit/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <EditLogo />
          </ProtectedRoute>
        }
      />
      <Route
        path="/logo/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ViewLogo />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Order />
          </ProtectedRoute>
        }
      />
      <Route
        path="/email"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Email />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Customer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/setting"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
        }
      />
    </Routes>
  );
};

export default App;
