import React, { useState, useContext, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import { CartContext } from "../Contexts/CartContext";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "../Layouts/Layout";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useContext(CartContext);
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("checkoutFormData");
    return savedData
      ? JSON.parse(savedData)
      : {
          name: "",
          email: "",
          phone: "",
          address: "",
          address2: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
          company: "",
          shippingMethod: "standard",
          lastName: "",
        };
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  // Expanded shipping options
  const shippingOptions = [
    { value: "standard", label: "Standard Shipping (Free, 5-7 days)", cost: 0 },
    {
      value: "express",
      label: "Express Shipping ($15.00, 2-3 days)",
      cost: 15,
    },
  ];

  const btnStyle = ` text-center py-4 px-10 rounded-4xl font-semibold text-sm transition-all duration-200 bg-black text-white hover:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed`;
  const secondaryBtnStyle = `  text-center py-5 px-10 rounded-4xl font-semibold text-sm transition-all duration-200 bg-gray-200 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2`;
  const imageBaseUrl =
    import.meta.env.VITE_STORAGE_URL || "https://fallback-url.com";

  useEffect(() => {
    const fetchCsrf = async (retries = 3) => {
      try {
        await axios.get("/sanctum/csrf-cookie");
      } catch (err) {
        if (retries > 0) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return fetchCsrf(retries - 1);
        }
        console.error("Failed to fetch CSRF token:", err);
        setError("Failed to initialize checkout.");
        toast.error("Failed to initialize checkout.");
      }
    };
    fetchCsrf();

    const fetchOrders = async () => {
      try {
        const response = await axios.get("/orders");
        setOrders(response.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        toast.error("Failed to load order history.");
      }
    };
    fetchOrders();

    localStorage.setItem("checkoutFormData", JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateSubtotal = useMemo(() => {
    return cartItems
      .reduce(
        (total, item) =>
          total + (item.sale_price || item.regular_price) * item.quantity,
        0
      )
      .toFixed(2);
  }, [cartItems]);

  const calculateTax = useMemo(() => {
    const taxRate = 0.08; // Example tax rate
    return (parseFloat(calculateSubtotal) * taxRate).toFixed(2);
  }, [calculateSubtotal]);

  const calculateTotal = useMemo(() => {
    const subtotal = parseFloat(calculateSubtotal);
    const shippingCost =
      shippingOptions.find((opt) => opt.value === formData.shippingMethod)
        ?.cost || 0;
    const tax = parseFloat(calculateTax);
    return (subtotal + shippingCost + tax).toFixed(2);
  }, [calculateSubtotal, calculateTax, formData.shippingMethod]);

  const createPayPalOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: calculateTotal,
            currency_code: "USD",
          },
          description: "Order from Your Store",
        },
      ],
    });
  };

  const onApprovePayPal = async (data, actions) => {
    try {
      setLoading(true);
      setError(null);

      const order = await actions.order.capture();

      const checkoutData = {
        customer: formData,
        products: cartItems.map((item) => ({
          product_id: item.id,
          name: item.name,
          size: item.selectedSize || null,
          quantity: item.quantity,
          price: item.sale_price || item.regular_price,
        })),
        total: parseFloat(calculateTotal),
        payment: {
          method: "PayPal",
          transaction_id: order.id,
          status: order.status.toLowerCase(),
        },
        shipping_method: formData.shippingMethod,
      };

      const response = await axios.post("/checkout", checkoutData);

      if (response.data.success) {
        clearCart();
        localStorage.removeItem("checkoutFormData");
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          address2: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
          company: "",
          shippingMethod: "standard",
          lastName: "",
        });
        setOrders([...orders, response.data.order]);
        setActiveStep(3);
        toast.success("Order placed successfully!");
        navigate("/order-confirmation", { state: response.data.order });
      } else {
        setError(response.data.message || "Checkout failed.");
        toast.error(response.data.message || "Checkout failed.");
      }
    } catch (err) {
      console.error("PayPal checkout error:", err);
      const errorMsg =
        err.response?.data?.message || "An error occurred during checkout.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      toast.error("Your cart is empty.");
      return;
    }

    const { name, email, phone, address, city, state, postalCode, country } =
      formData;
    if (
      !name ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !postalCode ||
      !country
    ) {
      setError("Please fill in all required fields.");
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      toast.error("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    const phoneRegex = /^[+\d][\d\s-]{6,14}\d$/;
    if (!phoneRegex.test(phone)) {
      setError("Please enter a valid phone number (e.g., +1 123-456-7890).");
      toast.error("Please enter a valid phone number.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const checkoutData = {
      customer: formData,
      products: cartItems.map((item) => ({
        product_id: item.id,
        name: item.name,
        size: item.selectedSize || null,
        quantity: item.quantity,
        price: item.sale_price || item.regular_price,
      })),
      total: parseFloat(calculateTotal),
      payment: {
        method: "Other",
        transaction_id: null,
        status: "pending",
      },
      shipping_method: formData.shippingMethod,
    };

    const productTotal = checkoutData.products
      .reduce((sum, product) => sum + product.price * product.quantity, 0)
      .toFixed(2);
    const shippingCost =
      shippingOptions.find((opt) => opt.value === formData.shippingMethod)
        ?.cost || 0;
    const expectedTotal = (
      parseFloat(productTotal) +
      shippingCost +
      parseFloat(calculateTax)
    ).toFixed(2);
    if (parseFloat(expectedTotal) !== checkoutData.total) {
      setError(
        `Total mismatch: Calculated ${expectedTotal}, Provided ${checkoutData.total}. Please refresh and try again.`
      );
      toast.error("Total mismatch. Please refresh and try again.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/checkout", checkoutData);
      if (response.data.success) {
        clearCart();
        localStorage.removeItem("checkoutFormData");
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          address2: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
          company: "",
          shippingMethod: "standard",
          lastName: "",
        });
        setOrders([...orders, response.data.order]);
        setActiveStep(3);
        toast.success("Order placed successfully!");
        navigate("/order-confirmation", { state: response.data.order });
      } else {
        setError(response.data.message || "Checkout failed.");
        toast.error(response.data.message || "Checkout failed.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      let errorMsg = "An error occurred during checkout.";
      if (err.response?.status === 422 && err.response.data.errors) {
        errorMsg = Object.entries(err.response.data.errors)
          .map(([key, messages]) => `${key}: ${messages.join(", ")}`)
          .join("; ");
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`/cancel-order/${orderId}`);
      if (response.data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  orderStatus: "Cancelled",
                  paymentStatus: response.data.order.payment_status,
                }
              : order
          )
        );
        toast.success("Order cancelled successfully!");
      } else {
        setError(response.data.message || "Failed to cancel order.");
        toast.error(response.data.message || "Failed to cancel order.");
      }
    } catch (err) {
      console.error("Cancel order error:", err);
      const errorMsg =
        err.response?.data?.message ||
        "An error occurred while cancelling the order.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="  min-h-screen py-6 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto">
          <h1 className="text-3xl sm:text-4xl font-[400] text-gray-900 mb-8 text-center">
            Checkout
          </h1>

          <div className="flex flex-col justify-center lg:flex-row gap-6 w-screen">
            {/* Left Column - Delivery Options */}
            <div className="w-full lg:w-[900px]">
              {activeStep === 1 && (
                <div className="p-6">
                  <h2 className="text-5xl font-[400] text-gray-800 mb-10">
                    Information
                  </h2>
                  {error && (
                    <div
                      id="form-error"
                      className="mb-6 p-4 bg-red-50 text-red-600 rounded-md text-lg"
                    >
                      {error}
                    </div>
                  )}
                  <form className="space-y-6">
                    <div className="text-2xl space-y-10">
                      <div className="relative">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Email *"
                          className="w-full border border-gray-300 rounded-lg py-4 px-4 text-lg focus:outline-none outline-none peer placeholder-transparent"
                          required
                          aria-label="Email"
                          aria-describedby={error ? "form-error" : undefined}
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-500 transition-all duration-200 transform origin-left peer-focus:-top-[1px] peer-focus:left-2 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1 peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:left-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-gray-700 peer-[&:not(:placeholder-shown)]:bg-white peer-[&:not(:placeholder-shown)]:px-1 pointer-events-none">
                          Email *<span className="text-red-500 ml-1">*</span>
                        </span>
                      </div>

                      <div className="grid lg:grid-cols-2 gap-[40px_20px]">
                        <div className="relative">
                          <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Full Name *"
                            className="w-full border border-gray-300 rounded-lg py-4 px-4 text-lg focus:outline-none outline-none peer placeholder-transparent"
                            required
                            aria-label="Full Name"
                            aria-describedby={error ? "form-error" : undefined}
                          />
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-500 transition-all duration-200 transform origin-left peer-focus:-top-[1px] peer-focus:left-2 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1 peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:left-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-gray-700 peer-[&:not(:placeholder-shown)]:bg-white peer-[&:not(:placeholder-shown)]:px-1 pointer-events-none">
                            Full Name *
                            <span className="text-red-500 ml-1">*</span>
                          </span>
                        </div>
                        <div className="relative">
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Phone Number *"
                            className="w-full border border-gray-300 rounded-lg py-4 px-4 text-lg focus:outline-none outline-none peer placeholder-transparent"
                            required
                            aria-label="Phone Number"
                            aria-describedby={error ? "form-error" : undefined}
                          />
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-500 transition-all duration-200 transform origin-left peer-focus:-top-[1px] peer-focus:left-2 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1 peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:left-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-gray-700 peer-[&:not(:placeholder-shown)]:bg-white peer-[&:not(:placeholder-shown)]:px-1 pointer-events-none">
                            Phone Number *
                            <span className="text-red-500 ml-1">*</span>
                          </span>
                        </div>
                      </div>
                      <div className="relative sm:col-span-2">
                        <input
                          id="address"
                          name="address"
                          type="text"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Address Line 1 *"
                          className="w-full border border-gray-300 rounded-lg py-4 px-4 text-lg focus:outline-none outline-none peer placeholder-transparent"
                          required
                          aria-label="Address Line 1"
                          aria-describedby={error ? "form-error" : undefined}
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-500 transition-all duration-200 transform origin-left peer-focus:-top-[1px] peer-focus:left-2 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1 peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:left-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-gray-700 peer-[&:not(:placeholder-shown)]:bg-white peer-[&:not(:placeholder-shown)]:px-1 pointer-events-none">
                          Address Line 1 *
                          <span className="text-red-500 ml-1">*</span>
                        </span>
                      </div>
                      <div className="relative sm:col-span-2">
                        <input
                          id="address2"
                          name="address2"
                          type="text"
                          value={formData.address2}
                          onChange={handleInputChange}
                          placeholder="Address Line 2 (Optional)"
                          className="w-full border border-gray-300 rounded-lg py-4 px-4 text-lg focus:outline-none outline-none peer placeholder-transparent"
                          aria-label="Address Line 2"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-500 transition-all duration-200 transform origin-left peer-focus:-top-[1px] peer-focus:left-2 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1 peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:left-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-gray-700 peer-[&:not(:placeholder-shown)]:bg-white peer-[&:not(:placeholder-shown)]:px-1 pointer-events-none">
                          Address Line 2 (Optional)
                        </span>
                      </div>
                      <div className="grid lg:grid-cols-2 gap-[40px_20px]">
                        <div className="relative">
                          <input
                            id="country"
                            name="country"
                            type="text"
                            value={formData.country}
                            onChange={handleInputChange}
                            placeholder="Country *"
                            className="w-full border border-gray-300 rounded-lg py-4 px-4 text-lg focus:outline-none outline-none peer placeholder-transparent"
                            required
                            aria-label="Country"
                            aria-describedby={error ? "form-error" : undefined}
                          />
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-500 transition-all duration-200 transform origin-left peer-focus:-top-[1px] peer-focus:left-2 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1 peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:left-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-gray-700 peer-[&:not(:placeholder-shown)]:bg-white peer-[&:not(:placeholder-shown)]:px-1 pointer-events-none">
                            Country *
                            <span className="text-red-500 ml-1">*</span>
                          </span>
                        </div>
                        <div className="relative">
                          <input
                            id="company"
                            name="company"
                            type="text"
                            value={formData.company}
                            onChange={handleInputChange}
                            placeholder="Company (Optional)"
                            className="w-full border border-gray-300 rounded-lg py-4 px-4 text-lg focus:outline-none outline-none peer placeholder-transparent"
                            aria-label="Company"
                          />
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-500 transition-all duration-200 transform origin-left peer-focus:-top-[1px] peer-focus:left-2 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1 peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:left-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-gray-700 peer-[&:not(:placeholder-shown)]:bg-white peer-[&:not(:placeholder-shown)]:px-1 pointer-events-none">
                            Company (Optional)
                          </span>
                        </div>
                      </div>
                      <div className="relative">
                        <input
                          id="city"
                          name="city"
                          type="text"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="City *"
                          className="w-full border border-gray-300 rounded-lg py-4 px-4 text-lg focus:outline-none outline-none peer placeholder-transparent"
                          required
                          aria-label="City"
                          aria-describedby={error ? "form-error" : undefined}
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-500 transition-all duration-200 transform origin-left peer-focus:-top-[1px] peer-focus:left-2 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1 peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:left-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-gray-700 peer-[&:not(:placeholder-shown)]:bg-white peer-[&:not(:placeholder-shown)]:px-1 pointer-events-none">
                          City *<span className="text-red-500 ml-1">*</span>
                        </span>
                      </div>
                      <div className="grid lg:grid-cols-2 gap-[40px_20px]">
                        <div className="relative">
                          <input
                            id="state"
                            name="state"
                            type="text"
                            value={formData.state}
                            onChange={handleInputChange}
                            placeholder="State/Province *"
                            className="w-full border border-gray-300 rounded-lg py-4 px-4 text-lg focus:outline-none outline-none peer placeholder-transparent"
                            required
                            aria-label="State/Province"
                            aria-describedby={error ? "form-error" : undefined}
                          />
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-500 transition-all duration-200 transform origin-left peer-focus:-top-[1px] peer-focus:left-2 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1 peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:left-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-gray-700 peer-[&:not(:placeholder-shown)]:bg-white peer-[&:not(:placeholder-shown)]:px-1 pointer-events-none">
                            State/Province *
                            <span className="text-red-500 ml-1">*</span>
                          </span>
                        </div>
                        <div className="relative">
                          <input
                            id="postalCode"
                            name="postalCode"
                            type="text"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            placeholder="Postal Code *"
                            className="w-full border border-gray-300 rounded-lg py-4 px-4 text-lg focus:outline-none outline-none peer placeholder-transparent"
                            required
                            aria-label="Postal Code"
                            aria-describedby={error ? "form-error" : undefined}
                          />
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-500 transition-all duration-200 transform origin-left peer-focus:-top-[1px] peer-focus:left-2 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1 peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:left-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-gray-700 peer-[&:not(:placeholder-shown)]:bg-white peer-[&:not(:placeholder-shown)]:px-1 pointer-events-none">
                            Postal Code *
                            <span className="text-red-500 ml-1">*</span>
                          </span>
                        </div>
                      </div>
                      <div className="sm:col-span-2 relative">
                        <select
                          id="shippingMethod"
                          name="shippingMethod"
                          value={formData.shippingMethod}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg py-5 px-4 text-lg focus:outline-none outline-none peer"
                          required
                          aria-label="Shipping Method"
                          aria-describedby={error ? "form-error" : undefined}
                        >
                          <option value="" disabled hidden>
                            Select Shipping Method *
                          </option>
                          {shippingOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-500 transition-all duration-200 transform origin-left peer-focus:-top-2 peer-focus:left-2 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1 peer-[&:not([value=''])]:-top-2 peer-[&:not([value=''])]:left-2 peer-[&:not([value=''])]:text-xs peer-[&:not([value=''])]:text-gray-700 peer-[&:not([value=''])]:bg-white peer-[&:not([value=''])]:px-1 pointer-events-none">
                          Select Shipping Method *
                          <span className="text-red-500 ml-1">*</span>
                        </span>
                      </div>
                    </div>
                    <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          const {
                            name,
                            email,
                            phone,
                            address,
                            city,
                            state,
                            postalCode,
                            country,
                          } = formData;
                          if (
                            !name ||
                            !email ||
                            !phone ||
                            !address ||
                            !city ||
                            !state ||
                            !postalCode ||
                            !country
                          ) {
                            setError("Please fill in all required fields.");
                            toast.error("Please fill in all required fields.");
                            return;
                          }
                          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                          if (!emailRegex.test(email)) {
                            setError("Please enter a valid email address.");
                            toast.error("Please enter a valid email address.");
                            return;
                          }
                          const phoneRegex = /^[+\d][\d\s-]{6,14}\d$/;
                          if (!phoneRegex.test(phone)) {
                            setError(
                              "Please enter a valid phone number (e.g., +1 123-456-7890)."
                            );
                            toast.error("Please enter a valid phone number.");
                            return;
                          }
                          setError(null);
                          setActiveStep(2);
                        }}
                        className={btnStyle}
                        disabled={cartItems.length === 0}
                      >
                        Save & Continue
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeStep === 2 && (
                <div className=" ">
                  {error && (
                    <div
                      id="payment-error"
                      className="mb-6 p-4 bg-red-50 text-red-600 rounded-md text-lg"
                    >
                      {error}
                    </div>
                  )}
                  {activeStep === 2 && (
                    <div className=" ">
                      {error && (
                        <div
                          id="payment-error"
                          className="mb-6 p-4 bg-red-50 text-red-600 rounded-md text-lg"
                        >
                          {error}
                        </div>
                      )}
                      <form
                        onSubmit={handleSubmit}
                        className="max-w-md w-[800px] mx-auto space-y-6"
                      >
                        {/* PayPal Button */}
                        <PayPalScriptProvider
                          options={{
                            clientId:
                              import.meta.env.VITE_PAYPAL_CLIENT_ID || "",
                            currency: "USD",
                          }}
                        >
                          <div className="h-[50px] w-full">
                            <PayPalButtons
                              style={{
                                layout: "vertical",
                                color: "white", // Use white to allow custom background
                                shape: "pill", // Matches rounded-4xl
                                label: "pay",
                                height: 50,
                              }}
                              createOrder={createPayPalOrder}
                              onApprove={onApprovePayPal}
                              onError={(err) => {
                                console.error("PayPal error:", err);
                                setError(
                                  "PayPal payment failed. Please try again."
                                );
                                toast.error("PayPal payment failed.");
                              }}
                              disabled={loading || cartItems.length === 0}
                              className="paypal-button w-full"
                            />
                          </div>
                        </PayPalScriptProvider>

                        {/* OR Divider */}
                        <div className="relative flex items-center py-4">
                          <div className="flex-grow border-t border-gray-300"></div>
                          <span className="mx-4 text-sm font-medium text-gray-500">
                            OR
                          </span>
                          <div className="flex-grow border-t border-gray-300"></div>
                        </div>

                        {/* Submit Button for Other Payment */}
                        <button
                          type="submit"
                          className={`${btnStyle} w-full h-[50px]`}
                          disabled={loading || cartItems.length === 0}
                        >
                          {loading ? (
                            <span className="flex items-center justify-center">
                              <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Processing...
                            </span>
                          ) : (
                            "Place Order (Other Payment)"
                          )}
                        </button>

                        {/* Back Button */}
                        <button
                          type="button"
                          onClick={() => setActiveStep(1)}
                          className={`${secondaryBtnStyle} w-full h-[50px]`}
                          disabled={loading}
                        >
                          Back
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {activeStep === 3 && (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Order Confirmation
                  </h2>
                  <div className="bg-green-50 p-4 rounded-md mb-6">
                    <div className="flex items-center">
                      <svg
                        className="h-6 w-6 text-green-600 mr-3"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-lg text-green-700">
                        Thank you for your order! A confirmation email will be
                        sent soon.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end gap-4">
                    <a href="/order-history" className={secondaryBtnStyle}>
                      View Order History
                    </a>
                    <a href="/" className={btnStyle}>
                      Continue Shopping
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Order Summary */}
            <div className="w-full lg:w-[500px] p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-[400] text-gray-800">
                  In Your Bag
                </h3>
                <button
                  type="button"
                  className="text-lg border-b-[3px] hover:text-gray-500 cursor-pointer  "
                  onClick={() => navigate("/cart")}
                >
                  Edit
                </button>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[16px] font-[600] ">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800">${calculateSubtotal}</span>
                </div>
                <div className="flex justify-between text-[16px] font-[600] ">
                  <span className="text-gray-600">Estimated Shipping</span>
                  <span className="text-gray-800">
                    $
                    {shippingOptions
                      .find((opt) => opt.value === formData.shippingMethod)
                      ?.cost.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="flex justify-between text-[16px] font-[600] ">
                  <span className="text-gray-600">Estimated Tax</span>
                  <span className="text-gray-800">${calculateTax}</span>
                </div>
                <div className="flex justify-between text-[16px] font-[600] ">
                  <span className="text-gray-600">Total</span>
                  <span className="text-gray-800">${calculateTotal}</span>
                </div>
                <p className="text-base text-gray-500 border-gray-300 border-t pt-3 py-2">
                  Arrives by{" "}
                  {shippingOptions
                    .find((opt) => opt.value === formData.shippingMethod)
                    ?.label.split("(")[1]
                    ?.split(")")[0] || "Thu, Jun 12"}
                </p>
                {cartItems.length > 0 && (
                  <div className=" ">
                    <div className="flex items-center gap-10">
                      <img
                        src={`${imageBaseUrl}/${
                          cartItems[0].image || "placeholder-image.jpg"
                        }`}
                        alt={cartItems[0].name}
                        onError={(e) =>
                          (e.target.src = `${imageBaseUrl}/placeholder-image.jpg`)
                        }
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div>
                        <p className="text-lg font-[400] text-gray-800">
                          {cartItems[0].name}
                        </p>
                        <p className="text-base text-gray-600">
                          Style #: {cartItems[0].id}
                        </p>
                        <p className="text-base text-gray-600">
                          Size: {cartItems[0].selectedSize || "N/A"}
                        </p>
                        <p className="text-base text-gray-600">
                          Qty: {cartItems[0].quantity} @ $
                          {cartItems[0].sale_price ||
                            cartItems[0].regular_price}
                        </p>
                        <p className="text-lg font-medium text-gray-600">
                          $
                          {(
                            (cartItems[0].sale_price ||
                              cartItems[0].regular_price) *
                            cartItems[0].quantity
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <ToastContainer position="bottom-right" autoClose={5000} />
      </div>
    </Layout>
  );
};

export default Checkout;
