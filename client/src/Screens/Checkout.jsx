import React, { useState, useContext, useEffect } from "react";
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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const btnStyle = `w-full text-center py-3 rounded-lg transition duration-300`;
  const imageBaseUrl = import.meta.env.VITE_STORAGE_URL;

  useEffect(() => {
    const fetchCsrf = async () => {
      try {
        await axios.get("/sanctum/csrf-cookie");
      } catch (err) {
        console.error("Failed to fetch CSRF token:", err);
        setError("Failed to initialize checkout.");
        toast.error("Failed to initialize checkout.");
      }
    };
    fetchCsrf();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.product_price * item.quantity, 0)
      .toFixed(2);
  };

  const createPayPalOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: calculateTotal(),
            currency_code: "USD",
          },
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
          size: item.selectedSize || null,
          quantity: item.quantity,
          price: item.product_price,
        })),
        total: parseFloat(calculateTotal()),
        payment: {
          method: "PayPal",
          transaction_id: order.id,
          status: order.status,
        },
      };

      console.log("PayPal checkout data:", checkoutData);
      const response = await axios.post("/checkout", checkoutData);

      if (response.data.success) {
        clearCart();
        toast.success("Order placed successfully!");
        console.log("Navigating with order:", response.data.order);
        navigate("/order-confirmation", { state: response.data.order });
      } else {
        setError(response.data.message || "Checkout failed.");
        toast.error(response.data.message || "Checkout failed.");
      }
    } catch (err) {
      console.error("PayPal checkout error:", err);
      console.log("PayPal error response:", err.response?.data);
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

    setLoading(true);
    setError(null);

    console.log("Cart items:", cartItems);

    const checkoutData = {
      customer: formData,
      products: cartItems.map((item) => ({
        product_id: item.id,
        size: item.selectedSize || null,
        quantity: item.quantity,
        price: item.product_price,
      })),
      total: parseFloat(calculateTotal()),
      payment: {
        method: "Other",
        transaction_id: null,
        status: "pending",
      },
    };

    // Validate total
    const productTotal = checkoutData.products
      .reduce((sum, product) => sum + product.price * product.quantity, 0)
      .toFixed(2);
    if (parseFloat(productTotal) !== checkoutData.total) {
      setError(
        `Total mismatch: Calculated ${productTotal}, Provided ${checkoutData.total}`
      );
      toast.error("Total mismatch. Please refresh and try again.");
      setLoading(false);
      return;
    }

    try {
      console.log("Sending checkout data:", checkoutData);
      const response = await axios.post("/checkout", checkoutData);
      console.log("Checkout response:", response.data);

      if (response.data.success) {
        clearCart();
        toast.success("Order placed successfully!");
        console.log("Navigating with order:", response.data.order);
        navigate("/order-confirmation", { state: response.data.order });
      } else {
        setError(response.data.message || "Checkout failed.");
        toast.error(response.data.message || "Checkout failed.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      console.log("Full error response:", err.response?.data);
      let errorMsg = "An error occurred during checkout.";
      if (err.response?.status === 422 && err.response.data.errors) {
        const errors = err.response.data.errors;
        errorMsg = Object.entries(errors)
          .map(([key, messages]) => `${key}: ${messages.join(", ")}`)
          .join("; ");
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      console.log("Formatted error message:", errorMsg);
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <h2 className="text-2xl font-semibold mb-6">Checkout</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-2/3">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold">Shipping Information</h3>
              {error && (
                <p className="text-red-500 bg-red-100 p-3 rounded">{error}</p>
              )}
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Full Name"
                className="border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Address"
                className="border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="City"
                className="border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                placeholder="Postal Code"
                className="border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="Country"
                className="border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <h3 className="text-lg font-semibold mt-6">Payment Method</h3>
              <PayPalScriptProvider
                options={{
                  clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
                  currency: "USD",
                }}
              >
                <div className="w-full mb-4">
                  <PayPalButtons
                    style={{
                      layout: "vertical",
                      color: "blue",
                      shape: "pill",
                      label: "pay",
                      height: 50,
                    }}
                    createOrder={createPayPalOrder}
                    onApprove={onApprovePayPal}
                    onError={(err) => {
                      console.error("PayPal error:", err);
                      setError("PayPal payment failed. Please try again.");
                      toast.error("PayPal payment failed.");
                    }}
                    disabled={loading || cartItems.length === 0}
                  />
                </div>
              </PayPalScriptProvider>
              <button
                type="submit"
                className={`text-white bg-blue-600 hover:bg-blue-700 ${btnStyle} disabled:bg-gray-400`}
                disabled={loading || cartItems.length === 0}
              >
                {loading ? "Processing..." : "Place Order (Other Payment)"}
              </button>
            </form>
            <p className="mt-4 text-center">
              Have an account?{" "}
              <a
                href="/login"
                className="text-blue-600 hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login", { state: { from: "/checkout" } });
                }}
              >
                Login to save your details
              </a>
            </p>
          </div>
          <div className="w-full md:w-1/3">
            <div className="border p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize}`}
                  className="flex gap-4 mb-4"
                >
                  <img
                    className="w-16 h-16 object-cover rounded-lg"
                    src={`${imageBaseUrl}/${
                      item.image || "placeholder-image.jpg"
                    }`}
                    alt={item.name}
                    onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                  />
                  <div>
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-gray-600">
                      Size: {item.selectedSize || "N/A"}
                    </p>
                    <p className="text-gray-600">Qty: {item.quantity}</p>
                    <p className="font-semibold">
                      ${(item.product_price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              <div className="flex justify-between font-semibold mt-4">
                <span>Total</span>
                <span>${calculateTotal()}</span>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </Layout>
  );
};

export default Checkout;
