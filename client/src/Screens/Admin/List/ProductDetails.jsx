import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import {
  FiSun,
  FiMoon,
  FiPrinter,
  FiTrash2,
  FiDownload,
  FiFileText,
  FiArrowLeft,
  FiAlertCircle,
  FiEdit,
} from "react-icons/fi";

// Configure axios to include credentials
axios.defaults.withCredentials = true;

// Utility functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount || 0);
};

const escapeCsvValue = (value) => {
  if (value == null) return "N/A";
  const stringValue = String(value);
  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "N/A";
  }
};

const calculateDueDate = (orderDate) => {
  if (!orderDate) return "N/A";
  try {
    const date = new Date(orderDate);
    date.setDate(date.getDate() + 30);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "N/A";
  }
};

// StatusBadge Component
const StatusBadge = ({ status, type = "payment", onClick }) => {
  const statusConfig = {
    payment: {
      completed: "text-emerald-600",
      pending: "text-amber-600",
      failed: "text-rose-600",
      refunded: "text-orange-600",
      default: "text-gray-600",
    },
    invoice: {
      delivered: "text-blue-600",
      shipped: "text-indigo-600",
      processing: "text-purple-600",
      cancelled: "text-rose-600",
      pending: "text-amber-600",
      completed: "text-emerald-600",
      default: "text-gray-600",
    },
  };

  const config = statusConfig[type] || statusConfig.payment;
  const statusKey = status?.toLowerCase() || "default";
  const colorClass = config[statusKey] || config.default;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-sm font-medium ${colorClass} ${
        onClick ? "cursor-pointer hover:underline" : ""
      }`}
      onClick={onClick}
    >
      {status || "Unknown"}
    </span>
  );
};

// ErrorAlert Component
const ErrorAlert = ({ error }) => (
  <div className="p-4 mx-auto flex items-start max-w-2xl">
    <FiAlertCircle className="h-5 w-5 text-rose-500 mr-2 mt-0.5 flex-shrink-0" />
    <div>
      <h3 className="text-sm font-medium text-rose-800">
        Error Loading Invoice
      </h3>
      <p className="text-sm text-rose-600 mt-1">{error}</p>
    </div>
  </div>
);

// StatusModal Component
const StatusModal = ({ isOpen, onClose, currentStatus, onUpdate }) => {
  const [newStatus, setNewStatus] = useState(currentStatus);

  useEffect(() => {
    setNewStatus(currentStatus);
  }, [currentStatus]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-lg">
        <div className="p-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Update Invoice Status
          </h3>
        </div>
        <div className="p-5">
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="p-5 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            onClick={() => onUpdate(newStatus)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!newStatus}
          >
            Update Status
          </button>
        </div>
      </div>
    </div>
  );
};

// InvoiceHeader Component
const InvoiceHeader = ({
  invoiceNumber,
  orderDate,
  dueDate,
  status,
  isDarkMode,
  toggleDarkMode,
  onStatusClick,
  customerCompany,
  city,
  state,
  country,
  logo,
}) => (
  <div className="mb-8">
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <StatusBadge status={status} type="invoice" onClick={onStatusClick} />
        <button
          onClick={onStatusClick}
          className="p-1 text-gray-500 hover:text-gray-700"
          aria-label="Edit status"
        >
          <FiEdit className="h-4 w-4" />
        </button>
      </div>
    </div>
    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mt-4">
      <div>
        {logo ? (
          <img
            className="object-cover"
            src={logo.image}
            alt={logo.category}
            onError={(e) =>
              (e.target.src = "https://via.placeholder.com/50?text=No+Image")
            }
          />
        ) : (
          <img
            className="object-cover"
            src="https://via.placeholder.com/50?text=No+Logo"
            alt="No Logo"
          />
        )}
      </div>
      <div className="text-left md:text-right">
        <h2 className="text-3xl font-medium text-gray-900">Invoice</h2>
        <p className="text-xl font-normal text-gray-800 mt-1">
          {customerCompany || "N/A"}
        </p>
        <p className="text-sm text-gray-500">
          {city || "N/A"}, {state || "N/A"}, {country || "N/A"}
        </p>
      </div>
    </div>
    <div className="border-b border-gray-200 py-5"></div>
  </div>
);

// CustomerInfo Component
const CustomerInfo = ({ customer }) => (
  <div className="mb-6 space-y-2">
    <h3 className="text-sm text-gray-500 font-light mb-2">Invoice to</h3>
    <div className="text-sm">
      <p className="font-normal text-lg text-gray-900">
        {customer.name || "N/A"}
      </p>
      <div className="mt-2 text-xs text-gray-600">
        <p>{customer.address || "N/A"}</p>
        {customer.address2 && <p>{customer.address2}</p>}
        <p>
          {customer.city || "N/A"}, {customer.state || "N/A"}{" "}
          {customer.postalCode || "N/A"}
        </p>
        <p>{customer.country || "N/A"}</p>
      </div>
      <div className="mt-2 space-y-1">
        <p className="text-xs text-blue-600 hover:underline cursor-pointer">
          {customer.email || "N/A"}
        </p>
        <p className="text-xs text-blue-600 hover:underline cursor-pointer">
          {customer.phone || "N/A"}
        </p>
      </div>
    </div>
  </div>
);

// InvoiceItemsTable Component
const InvoiceItemsTable = ({ items }) => (
  <div className="mb-6">
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-blue-500 text-sm text-white">
          <th className="py-4 px-4 font-medium text-left">Products</th>
          <th className="py-4 px-4 font-medium text-center">Size</th>
          <th className="py-4 px-4 font-medium text-center">Quantity</th>
          <th className="py-4 px-4 font-medium text-center">Rate</th>
          <th className="py-4 px-4 font-medium text-center">Amount</th>
        </tr>
      </thead>
      <tbody>
        {items && items.length > 0 ? (
          items.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-50"
            >
              <td className="py-6 px-4 text-xs">
                <div>
                  {item.name || "N/A"}
                  {item.description && (
                    <small className="text-gray-500 block mt-1 text-[10px]">
                      {item.description}
                    </small>
                  )}
                </div>
              </td>
              <td className="py-3 px-4 text-center text-xs">
                {item.size || "N/A"}
              </td>
              <td className="py-3 px-4 text-center text-xs">
                {item.quantity || "N/A"}
              </td>
              <td className="py-3 px-4 text-center text-xs">
                {formatCurrency(item.unitPrice)}
              </td>
              <td className="py-3 px-4 text-center text-xs">
                {formatCurrency(item.subtotal)}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="py-3 text-center text-sm text-gray-500">
              No items found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

// SummarySection Component
const SummarySection = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-base font-medium text-gray-900 mb-2">{title}</h3>
    {children}
  </div>
);

// ActionButton Component
const ActionButton = ({ onClick, icon, label, variant = "primary" }) => {
  const variants = {
    primary: "text-blue-600 hover:text-blue-800",
    danger: "text-rose-600 hover:text-rose-800",
    secondary: "text-gray-600 hover:text-gray-800",
    success: "text-emerald-600 hover:text-emerald-800",
  };

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-3 py-1 text-sm font-medium ${variants[variant]} focus:outline-none rounded-md transition-transform hover:scale-105`}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {label}
    </button>
  );
};

// Main InvoiceDetails Component
const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [logo, setLogo] = useState(null);

  const token = localStorage.getItem("auth_token");

  const axiosConfig = {
    headers: {
      "Cache-Control": "no-cache",
      Authorization: token ? `Bearer ${token}` : "",
    },
    withCredentials: true,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch CSRF token
        await axios.get(`${import.meta.env.VITE_API_URL}/sanctum/csrf-cookie`, {
          withCredentials: true,
        });

        setLoading(true);
        setError(null);

        // Fetch orders and logos
        const [ordersResponse, logoResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/orders`, axiosConfig),
          axios.get(`${import.meta.env.VITE_API_URL}/logos`, {
            ...axiosConfig,
            headers: {
              ...axiosConfig.headers,
              "X-API-KEY": import.meta.env.VITE_API_KEY,
            },
          }),
        ]);

        // Find order containing the product ID
        const filteredOrders = ordersResponse.data.filter((order) =>
          order.products?.some((prod) => prod.productId === parseInt(id, 10))
        );

        if (filteredOrders.length > 0) {
          const sortedOrders = filteredOrders.sort(
            (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
          );
          console.log("Selected Order:", sortedOrders[0]);
          console.log("Products:", sortedOrders[0].products);
          setOrder(sortedOrders[0]);
        } else {
          setError("No invoice found for this product.");
        }

        // Set a single logo
        setLogo(
          logoResponse.data.logos?.length > 0
            ? {
                id: logoResponse.data.logos[0].id,
                image: logoResponse.data.logos[0].image
                  ? logoResponse.data.logos[0].image.startsWith("http")
                    ? logoResponse.data.logos[0].image
                    : `${import.meta.env.VITE_STORAGE_URL}/${
                        logoResponse.data.logos[0].image
                      }`
                  : "https://via.placeholder.com/50?text=No+Image",
                category:
                  logoResponse.data.logos[0].category || "Uncategorized",
                status: logoResponse.data.logos[0].status ? 1 : 0,
                publishedOn: logoResponse.data.logos[0].created_at
                  ? new Date(
                      logoResponse.data.logos[0].created_at
                    ).toLocaleString()
                  : new Date().toLocaleString(),
              }
            : null
        );
      } catch (err) {
        setError(
          `Failed to fetch invoice data: ${
            err.response?.data?.message || err.message || "Unknown error"
          }`
        );
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDeleteInvoice = async (orderId) => {
    if (!orderId) return;
    if (!window.confirm("Are you sure you want to delete this invoice?"))
      return;
    try {
      await axios.get(`${import.meta.env.VITE_API_URL}/sanctum/csrf-cookie`, {
        withCredentials: true,
      });
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/orders/${orderId}`,
        axiosConfig
      );
      navigate("/orders");
    } catch (err) {
      alert(
        `Failed to delete invoice: ${
          err.response?.data?.message || err.message || "Unknown error"
        }`
      );
      console.error("Delete Error:", err);
    }
  };

  const handleExportCSV = () => {
    if (!order) return;

    const invoiceNumber = order.id ? `INV-${order.id}` : "N/A";
    const customerName = order.customerName || "N/A";
    const customerEmail = order.customer_email || "N/A";
    const customerPhone = order.customer_phone || "N/A";
    const customerCompany = order.customer_company || "N/A";
    const country = order.customer_country || "N/A";
    const taxAmount = order.tax_amount || 0;
    const dueDate = order.due_date
      ? formatDate(order.due_date)
      : calculateDueDate(order.orderDate);

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent +=
      "Invoice Number,Customer Name,Email,Phone,Company,Address,City,State,Postal Code,Country,Invoice Date,Payment Due,Product Image,Product Name,Size,Quantity,Unit Price,Subtotal,Tax Amount,Total Amount,Payment Method,Transaction ID,Payment Status,Invoice Status\n";

    const tableData = order.products.map((prod) => [
      escapeCsvValue(invoiceNumber),
      escapeCsvValue(customerName),
      escapeCsvValue(customerEmail),
      escapeCsvValue(customerPhone),
      escapeCsvValue(customerCompany),
      escapeCsvValue(order.customer_address),
      escapeCsvValue(order.customer_city),
      escapeCsvValue(order.customer_state),
      escapeCsvValue(order.customer_postal_code),
      escapeCsvValue(country),
      escapeCsvValue(order.orderDate || "N/A"),
      escapeCsvValue(dueDate),
      escapeCsvValue(prod.image || "N/A"),
      escapeCsvValue(prod.name || "N/A"),
      escapeCsvValue(prod.size || "N/A"),
      escapeCsvValue(prod.quantity || "N/A"),
      escapeCsvValue(formatCurrency(prod.price || 0)),
      escapeCsvValue(formatCurrency((prod.price || 0) * (prod.quantity || 0))),
      escapeCsvValue(formatCurrency(taxAmount)),
      escapeCsvValue(formatCurrency(order.total_amount || 0)),
      escapeCsvValue(order.payment_method || "N/A"),
      escapeCsvValue(order.payment_transaction_id || "N/A"),
      escapeCsvValue(order.paymentStatus || "Pending"),
      escapeCsvValue(order.status || "Pending"),
    ]);

    tableData.forEach((row) => {
      csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `invoice_${invoiceNumber}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    try {
      if (!order) {
        throw new Error("No invoice data available to export.");
      }

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const invoiceNumber = order.id ? `INV-${order.id}` : "N/A";
      const customerName = order.customerName || "N/A";
      const customerCompany = order.customer_company || "N/A";
      const city = order.customer_city || "N/A";
      const state = order.customer_state || "N/A";
      const country = order.customer_country || "N/A";
      const dueDate = order.due_date
        ? formatDate(order.due_date)
        : calculateDueDate(order.orderDate);

      // Header
      doc.setFontSize(20);
      doc.text("Invoice", 10, 20);
      doc.setFontSize(12);
      doc.text(`Invoice #: ${invoiceNumber}`, 10, 30);
      doc.text(
        `Date: ${order.orderDate ? formatDate(order.orderDate) : "N/A"}`,
        10,
        40
      );
      doc.text(`Payment Due: ${dueDate}`, 10, 50);

      // Customer Info
      doc.setFontSize(12);
      doc.text("Bill To:", 10, 60);
      doc.text(customerName, 10, 70);
      doc.text(customerCompany, 10, 80);
      doc.text(
        `${city}, ${state} ${order.customer_postal_code || "N/A"}`,
        10,
        90
      );
      doc.text(country, 10, 100);

      // Products Table
      const items = order.products.map((prod) => [
        prod.image ? "Image" : "N/A",
        prod.name || "N/A",
        prod.size || "N/A",
        prod.quantity || "N/A",
        formatCurrency(prod.price || 0),
        formatCurrency((prod.price || 0) * (prod.quantity || 0)),
      ]);

      doc.autoTable({
        startY: 110,
        head: [["Image", "Products", "Size", "Quantity", "Rate", "Amount"]],
        body: items,
        theme: "grid",
        styles: { fontSize: 10 },
        headStyles: { fillColor: [0, 123, 255], textColor: [255, 255, 255] },
      });

      // Totals
      const taxAmount = order.tax_amount || 0;
      const subtotal = order.products.reduce(
        (sum, prod) => sum + (prod.price || 0) * (prod.quantity || 0),
        0
      );
      const total = Number(order.total_amount || 0);
      const finalY = doc.lastAutoTable.finalY || 110;

      doc.setFontSize(12);
      doc.text(`Subtotal: ${formatCurrency(subtotal)}`, 150, finalY + 10);
      doc.text(`Tax: ${formatCurrency(taxAmount)}`, 150, finalY + 20);
      doc.text(`Total: ${formatCurrency(total)}`, 150, finalY + 30);

      // Payment Details
      doc.text(
        `Payment Method: ${order.payment_method || "N/A"}`,
        10,
        finalY + 10
      );
      doc.text(
        `Transaction ID: ${order.payment_transaction_id || "N/A"}`,
        10,
        finalY + 20
      );
      doc.text(
        `Payment Status: ${order.paymentStatus || "Pending"}`,
        10,
        finalY + 30
      );

      doc.save(`invoice_${invoiceNumber}.pdf`);
    } catch (error) {
      console.error("PDF Export Error:", error.message, error.stack);
      alert(
        `Failed to export PDF: ${error.message}. Please check the console for more details.`
      );
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById("invoice-content").innerHTML;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Invoice</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; border: 1px solid #ddd; }
            th { background-color: #007bff; color: white; }
            .text-right { text-align: right; }
            .mb-6 { margin-bottom: 1.5rem; }
            .text-sm { font-size: 0.875rem; }
            .text-gray-500 { color: #6b7280; }
            .text-gray-600 { color: #4b5563; }
            .text-gray-900 { color: #111827; }
            .font-medium { font-weight: 500; }
            .bg-green-100 { background-color: #d4edda; }
            .text-green-800 { color: #155724; }
            .no-print { display: none; }
            img { max-width: 50px; max-height: 50px; object-fit: cover; }
          </style>
        </head>
        <body>
          ${printContent}
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleUpdateStatus = async (status) => {
    if (!status || !order) return;
    try {
      await axios.get(`${import.meta.env.VITE_API_URL}/sanctum/csrf-cookie`, {
        withCredentials: true,
      });
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/orders/${order.id}`,
        { status },
        axiosConfig
      );
      setOrder({ ...order, status });
      setIsStatusModalOpen(false);
    } catch (err) {
      alert(
        `Failed to update status: ${
          err.response?.data?.message || err.message || "Unknown error"
        }`
      );
      console.error("Update Status Error:", err);
    }
  };

  const renderInvoice = () => {
    if (!order) {
      return (
        <div className="p-6 mx-auto text-center max-w-2xl">
          <div className="mx-auto flex items-center justify-center h-12 w-12">
            <FiAlertCircle className="h-6 w-6 text-amber-600" />
          </div>
          <h3 className="mt-3 text-lg font-medium text-gray-900">
            No Invoice Found
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            No invoice exists for this product.
          </p>
          <div className="mt-4">
            <Link
              to="/orders"
              className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none"
            >
              <FiArrowLeft className="mr-1 h-4 w-4" />
              Back to Orders
            </Link>
          </div>
        </div>
      );
    }

    const customerData = {
      name: order.customerName || "N/A",
      company: order.customer_company || "N/A",
      email: order.customer_email || "N/A",
      phone: order.customer_phone || "N/A",
      address: order.customer_address || "N/A",
      address2: order.customer_address2,
      city: order.customer_city || "N/A",
      state: order.customer_state || "N/A",
      postalCode: order.customer_postal_code || "N/A",
      country: order.customer_country || "N/A",
    };

    const paymentData = {
      method: order.payment_method || "N/A",
      transactionId: order.payment_transaction_id || "N/A",
      status: order.paymentStatus || "Pending",
    };

    const totalsData = {
      subtotal: order.products.reduce(
        (sum, prod) => sum + (prod.price || 0) * (prod.quantity || 0),
        0
      ),
      tax: order.tax_amount || 0,
      total: Number(order.total_amount || 0),
    };

    const invoiceItems = order.products.map((prod) => {
      console.log(`Product ${prod.productId}:`, {
        image: prod.image,
        size: prod.size,
        description: prod.description,
      });
      const imageUrl = prod.image
        ? prod.image.startsWith("http")
          ? prod.image
          : `${import.meta.env.VITE_STORAGE_URL}/${prod.image}`
        : "https://via.placeholder.com/50?text=No+Image";
      return {
        image: imageUrl,
        name: prod.name || "N/A",
        description: prod.description || "",
        size: prod.size || "N/A",
        quantity: prod.quantity || 0,
        unitPrice: prod.price || 0,
        subtotal: (prod.price || 0) * (prod.quantity || 0),
      };
    });

    if (
      invoiceItems.some(
        (item) =>
          item.image === "https://via.placeholder.com/50?text=No+Image" ||
          item.size === "N/A"
      )
    ) {
      console.warn(
        "Some products are missing image or size data. Check API response."
      );
    }

    return (
      <div>
        <div className="flex flex-wrap justify-end gap-3 no-print p-2 bg-gray-50 rounded-lg border border-gray-200 shadow-sm my-5">
          <Link
            to="/order"
            className="flex items-center justify-center p-2 transition-transform hover:scale-105 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-md h-10 w-10"
            title="Back"
          >
            <FiArrowLeft className="h-4 w-4" />
          </Link>
          <ActionButton
            onClick={handlePrint}
            icon={<FiPrinter className="h-4 w-4" />}
            label="Print"
            variant="secondary"
            className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-300"
          />
          <ActionButton
            onClick={() => handleDeleteInvoice(order.id)}
            icon={<FiTrash2 className="h-4 w-4" />}
            label="Delete"
            variant="danger"
            className="bg-red-500 hover:bg-red-600 text-white border border-red-600"
          />
          <ActionButton
            onClick={handleExportCSV}
            icon={<FiDownload className="h-4 w-4" />}
            label="Export CSV"
            variant="secondary"
            className="bg-white hover:bg-blue-50 text-blue-600 border border-blue-200"
          />
        </div>
        <div
          id="invoice-content"
          className="p-6 max-w-5xl mx-auto border border-gray-200 rounded-xl"
        >
          <InvoiceHeader
            invoiceNumber={order.id ? `INV-${order.id}` : "N/A"}
            orderDate={order.orderDate}
            dueDate={
              order.due_date
                ? formatDate(order.due_date)
                : calculateDueDate(order.orderDate)
            }
            status={order.status}
            isDarkMode={isDarkMode}
            toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            onStatusClick={() => setIsStatusModalOpen(true)}
            customerCompany={order.customer_company}
            city={order.customer_city}
            state={order.customer_state}
            country={order.customer_country}
            logo={logo}
          />
          <div className="mb-6 flex justify-between items-center font-light">
            <CustomerInfo customer={customerData} />
            <div className="text-center space-y-2">
              <p className="text-xs">
                Invoice No.: {order.id ? `INV-${order.id}` : "N/A"}
              </p>
              <p className="text-xs">Order Number: {order.id || "N/A"}</p>
              <p className="text-xs">
                Invoice Date:{" "}
                {order.orderDate ? formatDate(order.orderDate) : "N/A"}
              </p>
              <p className="text-xs">
                Payment Due:{" "}
                {order.due_date
                  ? formatDate(order.due_date)
                  : calculateDueDate(order.orderDate)}
              </p>
              <p className="text-xs">Status: {paymentData.status}</p>
              <p className="text-xs bg-green-100 text-green-800 px-2 py-1 inline-block rounded">
                Amount Due: {formatCurrency(totalsData.total)}
              </p>
            </div>
          </div>
          <div className="mb-6">
            <InvoiceItemsTable items={invoiceItems} />
          </div>
          <div className="flex justify-end">
            <SummarySection>
              <div className="space-y-2 text-end w-[200px]">
                <div>
                  <span className="text-sm font-medium text-gray-600 mx-3">
                    Subtotal:
                  </span>
                  <span className="text-sm text-gray-900">
                    {formatCurrency(totalsData.subtotal)}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600 mx-3">Tax:</span>
                  <span className="text-sm text-gray-900">
                    {formatCurrency(totalsData.tax)}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <span className="text-sm text-gray-600 mx-3">Total:</span>
                  <span className="text-sm text-gray-900">
                    {formatCurrency(totalsData.total)}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <span className="text-sm text-gray-600 mx-3">
                    Amount Due:
                  </span>
                  <span className="text-base font-semibold text-gray-900">
                    {formatCurrency(totalsData.total)}
                  </span>
                </div>
              </div>
            </SummarySection>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <ErrorAlert error={error} />
        ) : (
          <>
            {renderInvoice()}
            <StatusModal
              isOpen={isStatusModalOpen}
              onClose={() => setIsStatusModalOpen(false)}
              currentStatus={order?.status || ""}
              onUpdate={handleUpdateStatus}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default InvoiceDetails;
