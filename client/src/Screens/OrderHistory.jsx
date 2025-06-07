import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../Layouts/Layout";
import { CiSearch } from "react-icons/ci";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailInput, setEmailInput] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");

  const navigate = useNavigate();

  const fetchOrders = async (email) => {
    try {
      if (!email) throw new Error("Please enter an email address");

      setLoading(true);
      setError(null);

      const API_URL = import.meta.env.VITE_API_URL;
      const API_KEY = import.meta.env.VITE_API_KEY;

      const response = await axios.get(`${API_URL}/orders`, {
        headers: {
          Accept: "application/json",
          "X-API-KEY": API_KEY,
        },
        params: { customer_email: email },
      });

      const ordersData = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];
      const filteredOrders = ordersData.filter(
        (order) => order.customer_email === email
      );

      setOrders(filteredOrders);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch orders. Please try again."
      );
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubmittedEmail(emailInput);
      fetchOrders(emailInput.trim());
    } else {
      setError("Please enter a valid email address");
    }
  };

  const handleViewDetails = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  return (
    <Layout>
      <div className="order-history-container">
        <div className="order-header">
          <h1>Your Orders</h1>
        </div>

        <form onSubmit={handleSubmit} className="email-form ">
          <div className="flex w-full border border-gray-300 rounded-lg  py-2 px-4 text-lg ">
            <div className="relative w-[500px]">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your email address *"
                className="w-full text-lg focus:outline-none outline-none peer placeholder-transparent"
                required
              />
              <span className="absolute left-0 top-1/2 -translate-y-1/2 text-lg text-gray-500 transition-all duration-200 transform origin-left peer-focus:-top-[8px] peer-focus:left-0 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1 peer-[&:not(:placeholder-shown)]:-top-[15px] peer-[&:not(:placeholder-shown)]:left-0 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-gray-700 peer-[&:not(:placeholder-shown)]:bg-white peer-[&:not(:placeholder-shown)]:px-1 pointer-events-none">
                Enter your email address *
                <span className="text-red-500 ml-1">*</span>
              </span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="ml-4  rounded-4xl p-2 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="spinner inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Searching...
                </>
              ) : (
                <CiSearch className="text-2xl" />
              )}
            </button>
          </div>
        </form>

        {error && <div className="error-message">{error}</div>}

        {submittedEmail && !loading && !error && (
          <div className="orders-section">
            {orders.length === 0 ? (
              <div className="empty-state">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3>No orders found</h3>
                <p>We couldn't find any orders for {submittedEmail}</p>
              </div>
            ) : (
              <>
                <h2 className="orders-title">Your Orders</h2>
                <div className="orders-grid">
                  {orders.map((order) => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <h3>Order #{order.id}</h3>
                        <span
                          className={`status-badge ${order.status?.toLowerCase()}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="order-details">
                        <div className="detail-row">
                          <span>Date:</span>
                          <span>{order.orderDate}</span>
                        </div>
                        <div className="detail-row">
                          <span>Customer:</span>
                          <span>{order.customerName}</span>
                        </div>
                        <div className="detail-row">
                          <span>Total:</span>
                          <span className="order-total">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(order.total_amount)}
                          </span>
                        </div>
                        <div className="detail-row">
                          <span>Payment:</span>
                          <span
                            className={`payment-status ${order.paymentStatus?.toLowerCase()}`}
                          >
                            {order.paymentStatus}
                          </span>
                        </div>
                      </div>
                      <div className="order-products-preview">
                        {order.products.length > 2 && (
                          <div className="more-items">
                            +{order.products.length - 2} more items
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleViewDetails(order.id)}
                        className="view-details-btn"
                      >
                        View Order Details
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <style jsx>{`
          .order-history-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          }
          .order-header {
            text-align: center;
            margin-bottom: 2rem;
          }
          .order-header h1 {
            font-size: 2.2rem;
            color: #2d3748;
            margin-bottom: 0.5rem;
          }
          .email-form {
            max-width: 600px;
            margin: 0 auto 2rem;
          }
          .form-group {
            display: flex;
            gap: 10px;
          }
          .form-group input {
            flex: 1;
            padding: 12px 16px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            font-size: 1rem;
            transition: all 0.3s ease;
          }
          .form-group input:focus {
            outline: none;
            border-color: #4299e1;
            box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
          }
          .form-group button {
            background-color: #4299e1;
            color: white;
            border: none;
            padding: 0 24px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .form-group button:hover {
            background-color: #3182ce;
          }
          .form-group button:disabled {
            background-color: #a0aec0;
            cursor: not-allowed;
          }
          .spinner {
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
          }
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
          .error-message {
            background-color: #fff5f5;
            color: #e53e3e;
            padding: 12px 16px;
            border-radius: 8px;
            margin: 1rem auto;
            max-width: 600px;
            text-align: center;
            border-left: 4px solid #e53e3e;
          }
          .orders-section {
            margin-top: 2rem;
          }
          .orders-title {
            font-size: 1.5rem;
            color: #2d3748;
            margin-bottom: 1.5rem;
            font-weight: 600;
          }
          .empty-state {
            text-align: center;
            padding: 3rem 1rem;
            background-color: #f8fafc;
            border-radius: 12px;
            color: #4a5568;
          }
          .empty-state svg {
            margin: 0 auto 1rem;
            color: #cbd5e0;
          }
          .empty-state h3 {
            font-size: 1.25rem;
            margin-bottom: 0.5rem;
            color: #2d3748;
          }
          .orders-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 1.5rem;
          }
          .order-card {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s ease;
            border: 1px solid #edf2f7;
          }
          .order-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          }
          .order-header {
            padding: 1.25rem;
            border-bottom: 1px solid #edf2f7;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .order-header h3 {
            font-size: 1.1rem;
            font-weight: 600;
            color: #2d3748;
            margin: 0;
          }
          .status-badge {
            font-size: 0.75rem;
            font-weight: 600;
            padding: 4px 8px;
            border-radius: 9999px;
          }
          .status-badge.completed,
          .status-badge.delivered {
            background-color: #f0fff4;
            color: #38a169;
          }
          .status-badge.pending,
          .status-badge.processing {
            background-color: #fffaf0;
            color: #dd6b20;
          }
          .status-badge.cancelled {
            background-color: #fff5f5;
            color: #e53e3e;
          }
          .status-badge.shipped {
            background-color: #ebf8ff;
            color: #3182ce;
          }
          .payment-status {
            font-size: 0.75rem;
            font-weight: 600;
            padding: 4px 8px;
            border-radius: 9999px;
          }
          .payment-status.completed {
            background-color: #f0fff4;
            color: #38a169;
          }
          .payment-status.pending {
            background-color: #fffaf0;
            color: #dd6b20;
          }
          .payment-status.failed {
            background-color: #fff5f5;
            color: #e53e3e;
          }
          .payment-status.refunded {
            background-color: #ebf8ff;
            color: #3182ce;
          }
          .order-details {
            padding: 1.25rem;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
          }
          .detail-row span:first-child {
            color: #718096;
            font-weight: 500;
          }
          .detail-row span:last-child {
            color: #2d3748;
          }
          .order-total {
            font-weight: 700;
            color: #2b6cb0;
          }
          .order-products-preview {
            padding: 0 1.25rem;
            margin-bottom: 1.25rem;
          }
          .more-items {
            font-size: 0.8rem;
            color: #718096;
            text-align: center;
            margin-top: 8px;
          }
          .view-details-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            padding: 12px;
            background-color: #ebf8ff;
            color: #3182ce;
            font-weight: 600;
            border: none;
            border-top: 1px solid #ebf8ff;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .view-details-btn:hover {
            background-color: #bee3f8;
          }
          @media (max-width: 768px) {
            .form-group {
              flex-direction: column;
            }
            .orders-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </div>
    </Layout>
  );
};

export default OrderHistory;
