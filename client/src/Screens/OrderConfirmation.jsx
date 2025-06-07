import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../axios";
import Layout from "../Layouts/Layout";
import PropTypes from "prop-types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  FiShoppingBag,
  FiDownload,
  FiX,
  FiHome,
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiCreditCard,
} from "react-icons/fi";

const imageBaseUrl =
  import.meta.env.VITE_STORAGE_URL || "https://fallback.example.com/storage";

// Reusable Components
const Button = ({
  children,
  onClick,
  className = "",
  ariaLabel,
  disabled = false,
  icon: Icon,
}) => (
  <button
    onClick={onClick}
    aria-label={ariaLabel}
    className={`flex items-center justify-center gap-2 font-medium rounded-lg px-5 py-3 transition-all duration-200 ${
      disabled
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "hover:shadow-md"
    } ${className}`}
    disabled={disabled}
  >
    {Icon && <Icon className="w-5 h-5" />}
    {children}
  </button>
);

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  ariaLabel: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  icon: PropTypes.elementType,
};

const StatusPill = ({ status }) => {
  const statusColors = {
    pending: "bg-amber-100 text-amber-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
        statusColors[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
};

StatusPill.propTypes = {
  status: PropTypes.string.isRequired,
};

// Main Component
const OrderConfirmation = () => {
  // Hooks and State
  const { state } = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(state || {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Effects
  useEffect(() => {
    if (!state || !Object.keys(state).length) {
      const orderId = new URLSearchParams(window.location.search).get("orderId");
      if (orderId) fetchOrder(orderId);
    }
  }, [state]);

  // API Functions
  const fetchOrder = async (orderId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/orders/${orderId}`);
      
      if (response.data.success) {
        setOrder(response.data.order);
      } else {
        const errorMsg = response.data.message || "Failed to fetch order details.";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error("Fetch order error:", err);
      const errorMsg = err.response?.data?.message ||
        "An error occurred while fetching order details.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`/cancel-order/${order.id}`);
      
      if (response.data.success) {
        setOrder({
          ...order,
          status: "cancelled",
          paymentStatus: response.data.order.payment_status,
        });
        toast.success("Order cancelled successfully!");
      } else {
        const errorMsg = response.data.message || "Failed to cancel order.";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error("Cancel order error:", err);
      const errorMsg = err.response?.data?.message ||
        "An error occurred while cancelling the order.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Helper Functions
  const generateInvoice = () => {
    const doc = new jsPDF();
    
    // Invoice Header
    doc.setFontSize(18);
    doc.text("Order Invoice", 14, 20);
    doc.setFontSize(12);
    
    // Customer Information
    doc.text(`Order ID: ${order.id || "N/A"}`, 14, 30);
    doc.text(`Customer: ${order.customerName || order.customer_name || "N/A"}`, 14, 40);
    doc.text(`Email: ${order.customerEmail || order.customer_email || "N/A"}`, 14, 50);
    doc.text(
      `Address: ${order.customerAddress || order.customer_address
        ? `${order.customerAddress || order.customer_address}, ${
            order.customerCity || order.customer_city || ""
          }, ${
            order.customerPostalCode || order.customer_postal_code || ""
          }, ${order.customerCountry || order.customer_country || ""}`
        : "N/A"}`,
      14,
      60
    );
    doc.text(`Order Date: ${order.orderDate || new Date().toLocaleDateString()}`, 14, 70);
    
    // Products Table
    doc.autoTable({
      startY: 80,
      head: [["Product ID", "Name", "Size", "Quantity", "Price"]],
      body: (order.products || order.items || []).map((item) => [
        item.productId || item.product_id || "N/A",
        item.name || "Unknown Product",
        item.size || "N/A",
        item.quantity || 0,
        `$${item.price ? item.price.toFixed(2) : "0.00"}`,
      ]),
      theme: "striped",
      headStyles: { fillColor: [22, 160, 133] },
    });

    // Order Summary
    const finalY = doc.lastAutoTable.finalY || 100;
    doc.text(`Total: $${order.total || order.total_amount || "0.00"}`, 14, finalY + 10);
    doc.text(`Payment Method: ${order.payment_method || "N/A"}`, 14, finalY + 20);
    doc.text(
      `Payment Status: ${order.paymentStatus || order.payment_status || "Pending"}`,
      14,
      finalY + 30
    );

    doc.save(`order_${order.id || "confirmation"}.pdf`);
  };

  const getStatusSteps = () => {
    const statuses = ["pending", "processing", "shipped", "delivered"];
    const currentStatus = (order.status || "pending").toLowerCase();
    
    return statuses.map((status) => ({
      status,
      active:
        statuses.indexOf(status) <= statuses.indexOf(currentStatus) &&
        currentStatus !== "cancelled",
    }));
  };

  // Render Functions
  const renderErrorState = () => (
    <div className="container mx-auto py-12 px-4 max-w-4xl text-center">
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiX className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Order Not Found
        </h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {error || "No order details available. Please check your order ID or try again later."}
        </p>
        <div className="flex justify-center">
          <Button
            onClick={() => navigate("/")}
            ariaLabel="Return to home"
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            icon={FiHome}
          >
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );

  const renderOrderHeader = () => (
    <div className="flex items-center gap-3 mb-6">
      <FiShoppingBag className="w-6 h-6 text-indigo-600" />
      <h1 className="text-2xl font-bold text-gray-800">
        Order #{order.id || "N/A"}
      </h1>
      <StatusPill status={order.status?.toLowerCase()} />
    </div>
  );

  const renderOrderSummaryHeader = () => (
    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 border-b">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-1">
            Thank you for your order!
          </h2>
          <p className="text-gray-600">
            We've received your order and will process it shortly.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button
            onClick={generateInvoice}
            ariaLabel="Download invoice"
            className="bg-white border border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50"
            icon={FiDownload}
          >
            Download Invoice
          </Button>
        </div>
      </div>
    </div>
  );

  const renderStatusTimeline = () => (
    <div className="p-6 border-b">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Status</h3>
      <div className="relative">
        <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200 md:left-1/2 md:-translate-x-1/2 md:w-4/5"></div>
        {getStatusSteps().map((step, index) => (
          <div
            key={step.status}
            className={`relative flex items-center gap-4 mb-8 last:mb-0 md:even:flex-row-reverse md:even:text-right md:justify-between`}
          >
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step.active
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : "bg-white border-gray-300 text-gray-400"
              }`}
            >
              {index + 1}
            </div>
            <div className="flex-1 md:w-5/12">
              <div
                className={`text-sm font-medium ${
                  step.active ? "text-indigo-600" : "text-gray-500"
                }`}
              >
                {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {step.active
                  ? index === getStatusSteps().length - 1
                    ? "Your order has been delivered"
                    : "Step completed"
                  : "Pending"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCustomerInfo = () => (
    <div className="bg-gray-50 rounded-lg p-5">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Customer Information
      </h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <FiMail className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-gray-800">
              {order.customerEmail || order.customer_email || "N/A"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <FiPhone className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium text-gray-800">
              {order.customerPhone || "N/A"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <FiMapPin className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Shipping Address</p>
            <p className="font-medium text-gray-800">
              {order.customerAddress || order.customer_address
                ? `${order.customerAddress || order.customer_address}, ${
                    order.customerCity || order.customer_city || ""
                  }, ${
                    order.customerPostalCode || order.customer_postal_code || ""
                  }`
                : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrderSummary = () => (
    <div className="bg-gray-50 rounded-lg p-5">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <FiClock className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Order Date</p>
            <p className="font-medium text-gray-800">
              {order.orderDate || new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <FiDollarSign className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="font-medium text-gray-800">
              ${order.total || order.total_amount || "0.00"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <FiCreditCard className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Payment Method</p>
            <p className="font-medium text-gray-800">
              {order.payment_method || "N/A"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <FiShoppingBag className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Payment Status</p>
            <p className="font-medium text-gray-800">
              {order.paymentStatus || order.payment_status || "Pending"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrderItems = () => (
    <div className="p-6 border-t">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h3>
      {(order.products || order.items || []).length > 0 ? (
        <div className="divide-y divide-gray-200">
          {(order.products || order.items).map((item) => {
            let imageUrl;
            if (item.image) {
              imageUrl = item.image.startsWith("http")
                ? item.image
                : `${imageBaseUrl}/${item.image.replace(/^\/+/, "")}`;
            } else {
              imageUrl = "https://via.placeholder.com/100?text=No+Image";
            }

            return (
              <div
                key={`${item.productId || item.product_id}-${item.size || "default"}`}
                className="py-4 flex gap-4"
              >
                <img
                  src={imageUrl}
                  alt={item.name || "Product image"}
                  className="w-20 h-20 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/100?text=No+Image";
                  }}
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium text-gray-800">
                      {item.name || `Product ID: ${item.productId || item.product_id || "N/A"}`}
                    </h4>
                    <p className="font-medium text-gray-800">
                      ${item.price ? Number(item.price).toFixed(2) : "0.00"}
                    </p>
                  </div>
                  <div className="flex gap-4 mt-1 text-sm text-gray-500">
                    <span>Size: {item.size || "N/A"}</span>
                    <span>Qty: {item.quantity || 0}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500">No items found in this order.</p>
      )}
    </div>
  );

  const renderActionButtons = () => (
    <div className="p-6 border-t flex flex-col sm:flex-row gap-3">
      <Button
        onClick={() => navigate("/")}
        ariaLabel="Continue shopping"
        className="bg-indigo-600 hover:bg-indigo-700 text-white"
        icon={FiHome}
      >
        Continue Shopping
      </Button>
      {["pending", "processing"].includes((order.status || "").toLowerCase()) && (
        <Button
          onClick={handleCancelOrder}
          ariaLabel="Cancel order"
          className="bg-white border border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50"
          disabled={loading}
          icon={FiX}
        >
          {loading ? "Cancelling..." : "Cancel Order"}
        </Button>
      )}
      <Button
        onClick={() => navigate("/contact", { state: { orderId: order.id } })}
        ariaLabel="Contact support"
        className="bg-white border border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50 ml-auto"
      >
        Contact Support
      </Button>
    </div>
  );

  // Main Render
  if (!order || !Object.keys(order).length || error) {
    return (
      <Layout>
        {renderErrorState()}
        <ToastContainer position="bottom-right" autoClose={5000} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        {renderOrderHeader()}

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {renderOrderSummaryHeader()}

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg mx-6 mt-6 text-sm flex items-center">
              <FiX className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          {renderStatusTimeline()}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {renderCustomerInfo()}
            {renderOrderSummary()}
          </div>

          {renderOrderItems()}
          {renderActionButtons()}
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={5000} />
    </Layout>
  );
};

OrderConfirmation.propTypes = {
  state: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    customerName: PropTypes.string,
    customer_name: PropTypes.string,
    customerEmail: PropTypes.string,
    customer_email: PropTypes.string,
    customerPhone: PropTypes.string,
    customerAddress: PropTypes.string,
    customer_address: PropTypes.string,
    customerCity: PropTypes.string,
    customer_city: PropTypes.string,
    customerPostalCode: PropTypes.string,
    customer_postal_code: PropTypes.string,
    customerCountry: PropTypes.string,
    customer_country: PropTypes.string,
    total: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    total_amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    payment_method: PropTypes.string,
    paymentStatus: PropTypes.string,
    payment_status: PropTypes.string,
    status: PropTypes.string,
    orderDate: PropTypes.string,
    products: PropTypes.arrayOf(
      PropTypes.shape({
        productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        product_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string,
        size: PropTypes.string,
        quantity: PropTypes.number,
        price: PropTypes.number,
        image: PropTypes.string,
      })
    ),
    items: PropTypes.arrayOf(
      PropTypes.shape({
        productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        product_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string,
        size: PropTypes.string,
        quantity: PropTypes.number,
        price: PropTypes.number,
        image: PropTypes.string,
      })
    ),
  }),
};

export default OrderConfirmation;