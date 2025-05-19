import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../Layouts/Layout";
import PropTypes from "prop-types";

const imageBaseUrl = import.meta.env.VITE_STORAGE_URL || "https://fallback.example.com/storage";

const Button = ({ children, onClick, className, ariaLabel }) => (
  <button
    onClick={onClick}
    aria-label={ariaLabel}
    className={`text-white bg-blue-600 hover:bg-blue-700 py-3 px-6 rounded-lg transition duration-300 ${className}`}
  >
    {children}
  </button>
);

const OrderConfirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state || {};

  if (!state || !Object.keys(order).length) {
    return (
      <Layout>
        <div className="container mx-auto py-10 px-4">
          <h2 className="text-2xl font-semibold mb-6">Order Not Found</h2>
          <p className="text-gray-600">
            No order details available.{" "}
            <Button
              onClick={() => navigate("/")}
              ariaLabel="Return to home"
              className="text-blue-600 hover:underline"
            >
              Return to Home
            </Button>
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <h2 className="text-2xl font-semibold mb-6">Order Confirmation</h2>
        <div className="border p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Thank you for your order!</h3>
          <p><strong>Order ID:</strong> {order.id || "N/A"}</p>
          <p><strong>Customer Name:</strong> {order.customer_name || "N/A"}</p>
          <p><strong>Email:</strong> {order.customer_email || "N/A"}</p>
          <p>
            <strong>Address:</strong>{" "}
            {order.customer_address
              ? `${order.customer_address}, ${order.customer_city || ""}, ${
                  order.customer_postal_code || ""
                }, ${order.customer_country || ""}`
              : "N/A"}
          </p>
          <p><strong>Total Amount:</strong> ${order.total_amount || "0.00"}</p>
          <p><strong>Payment Method:</strong> {order.payment_method || "N/A"}</p>
          <p><strong>Payment Status:</strong> {order.payment_status || "Pending"}</p>
          <p><strong>Order Status:</strong> {order.status || "N/A"}</p>

          <h4 className="text-lg font-semibold mt-6 mb-2">Order Items</h4>
          {order.items && order.items.length > 0 ? (
            order.items.map((item) => (
              <div key={`${item.product_id}-${item.size || "default"}`} className="flex gap-4 mb-4">
                <img
                  className="w-16 h-16 object-cover rounded-lg"
                  src={`${imageBaseUrl}/${item.image || "placeholder-image.jpg"}`}
                  alt={item.name || "Product image"}
                  onError={(e) =>
                    (e.target.src = `${imageBaseUrl}/placeholder-image.jpg`)
                  }
                />
                <div>
                  <p className="font-semibold">Product ID: {item.product_id || "N/A"}</p>
                  <p>Size: {item.size || "N/A"}</p>
                  <p>Quantity: {item.quantity || 0}</p>
                  <p>Price: ${item.price || "0.00"}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No items found in this order.</p>
          )}

          <Button
            onClick={() => navigate("/")}
            ariaLabel="Continue shopping"
            className="mt-6"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </Layout>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  ariaLabel: PropTypes.string.isRequired,
};

OrderConfirmation.propTypes = {
  state: PropTypes.shape({
    id: PropTypes.string,
    customer_name: PropTypes.string,
    customer_email: PropTypes.string,
    customer_address: PropTypes.string,
    customer_city: PropTypes.string,
    customer_postal_code: PropTypes.string,
    customer_country: PropTypes.string,
    total_amount: PropTypes.number,
    payment_method: PropTypes.string,
    payment_status: PropTypes.string,
    status: PropTypes.string,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        product_id: PropTypes.string,
        size: PropTypes.string,
        quantity: PropTypes.number,
        price: PropTypes.number,
        image: PropTypes.string,
        name: PropTypes.string,
      })
    ),
  }),
};

export default OrderConfirmation;