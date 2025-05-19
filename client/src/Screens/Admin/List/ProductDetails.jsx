import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import LayoutAdmin from "../../../Layouts/LayoutAdmin";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [productResponse, ordersResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/products/${id}`, { 
            headers: { "Cache-Control": "no-cache" } 
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/orders`, { 
            headers: { "Cache-Control": "no-cache" } 
          })
        ]);

        setProduct(productResponse.data.data);
        
        const filteredOrders = ordersResponse.data.filter(order =>
          order.products.some(prod => prod.productId === parseInt(id))
        );
        setOrders(filteredOrders || []);
        
      } catch (err) {
        setError(`Failed to fetch data: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/orders/${orderId}`);
      setOrders(orders.filter(order => order.id !== orderId));
    } catch (err) {
      alert(`Failed to delete order: ${err.response?.data?.message || err.message}`);
    }
  };

  // Export functionality
  const handleExport = () => {
    if (!product && !orders.length) return;

    // Prepare CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Product Details Section
    csvContent += "Product Details\n";
    csvContent += "Name,Brand,Category,Color\n";
    if (product) {
      const category = product.category
        ? Array.isArray(product.category)
          ? product.category.join(";")
          : JSON.parse(product.category).join(";")
        : "N/A";
      const color = product.color
        ? Array.isArray(product.color)
          ? product.color.join(";")
          : JSON.parse(product.color).join(";")
        : "N/A";
      csvContent += `"${product.name || 'N/A'}","${product.brand || 'N/A'}","${category}","${color}"\n`;
    }
    
    // Orders Section
    csvContent += "\nOrders\n";
    csvContent += "Order ID,Customer Name,Email,Order Date,Quantity,Total,Payment Status,Order Status,Shipping Address\n";
    
    orders.forEach(order => {
      const productInOrder = order.products.find(prod => prod.productId === parseInt(id));
      const address = [
        order.customer_address,
        order.customer_city,
        order.customer_postal_code,
        order.customer_country
      ].filter(Boolean).join(", ");
      
      csvContent += `"${order.id}","${order.customerName || 'N/A'}","${order.customer_email || 'N/A'}",` +
        `"${order.orderDate || 'N/A'}","${productInOrder?.quantity || 'N/A'}",` +
        `"$${Number(order.total || 0).toFixed(2)}","${order.paymentStatus || 'N/A'}",` +
        `"${order.orderStatus || 'N/A'}","${address}"\n`;
    });

    // Create and trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `product_${id}_details.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ======================
  // Reusable Components
  // ======================

  const StatusBadge = ({ status, type = "payment" }) => {
    const statusConfig = {
      payment: {
        Completed: "bg-emerald-100 text-emerald-800",
        Pending: "bg-amber-100 text-amber-800",
        Failed: "bg-rose-100 text-rose-800",
        default: "bg-gray-100 text-gray-800"
      },
      order: {
        Delivered: "bg-blue-100 text-blue-800",
        Shipped: "bg-indigo-100 text-indigo-800",
        Processing: "bg-purple-100 text-purple-800",
        Cancelled: "bg-rose-100 text-rose-800",
        default: "bg-gray-100 text-gray-800"
      }
    };

    const config = statusConfig[type] || statusConfig.payment;
    const colorClass = config[status] || config.default;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        {status || "Unknown"}
      </span>
    );
  };

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-16">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  const ErrorAlert = ({ error, onRetry }) => (
    <div className="rounded-md bg-red-50 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Error loading data</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{error}</p>
          </div>
          <div className="mt-4">
            <button
              onClick={onRetry}
              className="inline-flex items-center text-sm font-medium text-red-700 hover:text-red-600"
            >
              Retry
              <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const DetailCard = ({ title, children, className = "" }) => (
    <div className={`bg-white overflow-hidden shadow rounded-lg ${className}`}>
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
      </div>
      <div className="px-4 py-5 sm:p-6">
        {children}
      </div>
    </div>
  );

  const DetailField = ({ label, value, children, className = "" }) => (
    <div className={`py-2 ${className}`}>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900">
        {children || (value !== undefined ? value : "N/A")}
      </dd>
    </div>
  );

  const TabButton = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
        active 
          ? "bg-blue-100 text-blue-700 border border-blue-200" 
          : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );

  // ======================
  // Main Render Sections
  // ======================

  const renderProductDetails = () => (
    <DetailCard title="Product Information">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <DetailField label="Name" value={product.name} />
          <DetailField label="Brand" value={product.brand} />
          <DetailField 
            label="Category" 
            value={
              product.category
                ? Array.isArray(product.category)
                  ? product.category.join(", ")
                  : JSON.parse(product.category).join(", ")
                : "N/A"
            }
          />
          <DetailField 
            label="Color" 
            value={
              product.color
                ? Array.isArray(product.color)
                  ? product.color.join(", ")
                  : JSON.parse(product.color).join(", ")
                : "N/A"
            }
          />
        </div>
        <div>
          <DetailField label="Image">
            {product.image ? (
              <div className="mt-2">
                <img
                  src={`${import.meta.env.VITE_BASE_URL}/storage/${product.image}`}
                  alt={product.name}
                  className="h-48 w-48 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/200?text=No+Image";
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 w-48 bg-gray-100 rounded-lg border border-gray-200 text-gray-500">
                No image
              </div>
            )}
          </DetailField>
        </div>
      </div>
    </DetailCard>
  );

  const renderOrdersList = () => {
    if (orders.length === 0) {
      return (
        <DetailCard title="Orders">
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-sm text-gray-500">This product hasn't been ordered yet.</p>
          </div>
        </DetailCard>
      );
    }

    return (
      <DetailCard title={`Orders (${orders.length})`}>
        <div className="overflow-hidden">
          <div className="grid grid-cols-1 gap-6">
            {orders.map(order => {
              const productInOrder = order.products.find(
                prod => prod.productId === parseInt(id)
              );
              
              return (
                <div key={order.id} className="border rounded-lg overflow-hidden hover:shadow-sm transition-shadow duration-150">
                  <div className="px-4 py-3 bg-gray-50 border-b flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">Order #{order.id}</span>
                      <StatusBadge status={order.orderStatus} type="order" />
                    </div>
                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      className="text-red-600 hover:text-red-900 text-sm font-medium flex items-center"
                    >
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <DetailField label="Customer" value={order.customerName} />
                        <DetailField label="Email" value={order.customer_email} />
                        <DetailField label="Order Date" value={order.orderDate} />
                      </div>
                      <div className="space-y-3">
                        <DetailField label="Quantity" value={productInOrder?.quantity} />
                        <DetailField label="Total" value={`$${Number(order.total || 0).toFixed(2)}`} />
                        <DetailField label="Payment Status">
                          <StatusBadge status={order.paymentStatus} type="payment" />
                        </DetailField>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <DetailField label="Shipping Address">
                        <p className="text-sm text-gray-900">
                          {[order.customer_address, order.customer_city, order.customer_postal_code, order.customer_country]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      </DetailField>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DetailCard>
    );
  };

  // ======================
  // Main Component Render
  // ======================

  return (
    <LayoutAdmin>
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Product Details</h1>
                <p className="mt-1 text-sm text-gray-500">
                  View and manage product information and related orders
                </p>
              </div>
              <div className="flex space-x-3">
                <Link
                  to="/order"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back to Orders
                </Link>
                <button
                  onClick={handleExport}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Export Data
                </button>
                <Link
                  to={`/products/edit/${id}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Edit Product
                </Link>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="mt-6 border-b border-gray-200">
              <nav className="-mb-px flex space-x-4">
                <TabButton 
                  active={activeTab === "details"} 
                  onClick={() => setActiveTab("details")}
                >
                  Product Details
                </TabButton>
                <TabButton 
                  active={activeTab === "orders"} 
                  onClick={() => setActiveTab("orders")}
                >
                  Orders ({orders.length})
                </TabButton>
              </nav>
            </div>
          </div>

          {/* Content Area */}
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorAlert error={error} onRetry={() => window.location.reload()} />
          ) : product ? (
            <div className="space-y-6">
              {activeTab === "details" ? renderProductDetails() : renderOrdersList()}
            </div>
          ) : (
            <DetailCard title="Product Not Found">
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Product not available</h3>
                <p className="mt-1 text-sm text-gray-500">The requested product could not be found.</p>
              </div>
            </DetailCard>
          )}
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default ProductDetails;