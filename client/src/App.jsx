import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
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
import Login from "./Screens/Login";
import OrderConfirmation from "./Screens/OrderConfirmation";
import ProductDetails from "./Screens/Admin/List/ProductDetails";

const App = () => {
  useEffect(() => {
    AOS.init();
  }, []);
  return (
    <Routes>
      {/* Admin */}
      <Route path="/product/list" element={<Product />} />
      <Route path="/product/create" element={<CreateProduct />} />
      <Route path="/product/edit/:id" element={<EditProduct />} />
      <Route path="/product/view/:id" element={<ViewProduct />} />
      <Route path="/banner/list" element={<Banner />} />
      <Route path="/banner/create" element={<CreateBanner />} />
      <Route path="/banner/edit/:id" element={<EditBanner />} />
      <Route path="/banner/:id" element={<ViewBanner />} />
      <Route path="/slider/list" element={<Slider />} />
      <Route path="/slider/create" element={<CreateSlider />} />
      <Route path="/slider/edit/:id" element={<EditSlider />} />
      <Route path="/slider/view/:id" element={<ViewSlider />} />
      <Route path="/slider/:id" element={<ViewSlider />} />
      <Route path="/logo/list" element={<Logo />} />
      <Route path="/logo/create" element={<CreateLogo />} />\
      <Route path="/logo/edit/:id" element={<EditLogo />} />
      <Route path="/logo/:id" element={<ViewLogo />} />
      <Route path="/order" element={<Order />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/email" element={<Email />} />
      <Route path="/customer" element={<Customer />} />
      <Route path="/setting" element={<Settings />} />
      <Route path="/user" element={<Profile />} />
      <Route path="/dashboard" element={<Dashboard />} />
      {/* client */}
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/:id" element={<Cart />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/order-confirmation" element={<OrderConfirmation />} />
    </Routes>
  );
};

export default App;
