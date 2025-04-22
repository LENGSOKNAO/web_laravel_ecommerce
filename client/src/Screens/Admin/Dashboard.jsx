 
import React, { useState } from "react";
import LayoutAdmin from "../../Layouts/LayoutAdmin";
import { IoAddSharp } from "react-icons/io5";
import { CiExport, CiImport } from "react-icons/ci";
import { FaRegEye, FaUsers, FaDollarSign, FaExclamationTriangle, FaEdit, FaTrash, FaExclamationCircle } from "react-icons/fa";
import { Doughnut, Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, BarElement, CategoryScale, LinearScale, PointElement } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, LineElement, BarElement, CategoryScale, LinearScale, PointElement);

const Dashboard = () => {
  // Mock dashboard data (unchanged)
  const dashboardData = {
    totalCustomers: 150,
    activeCustomers: 120,
    blockedCustomers: 30,
    totalRevenue: 125000.50,
    pendingPayments: 15000.75,
    percentageChanges: {
      totalCustomers: -9.19,
      totalRevenue: 26.87,
      pendingPayments: 3.51,
      activeCustomers: -1.05,
    },
    trafficSources: {
      labels: ["Direct", "Marketing", "Social", "Affiliates"],
      data: [965, 102, 75, 96],
      colors: ["#1F2A44", "#2ECC71", "#3498DB", "#E74C3C"],
    },
    overview: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      totalRevenue: [50, 75, 25, 100, 60, 80, 40, 90, 30, 70, 20, 110],
      totalExpenses: [30, 40, 20, 60, 50, 30, 20, 50, 40, 30, 10, 60],
      investment: [20, 30, 40, 50, 60, 40, 30, 20, 10, 50, 70, 90],
      savings: [10, 20, 10, 30, 20, 10, 5, 15, 20, 10, 5, 30],
    },
    recentCustomers: [
      {
        id: "C001",
        customerName: "Emily Davis",
        customerImage: "https://picsum.photos/200?random=1",
        invoice: "INV-103452",
        status: "Active",
        total: 532.75,
        dueDate: "19 January 2024",
      },
      {
        id: "C002",
        customerName: "Michael Johnson",
        customerImage: "https://picsum.photos/200?random=2",
        invoice: "INV-984321",
        status: "Block",
        total: 689.50,
        dueDate: "10 February 2024",
      },
      {
        id: "C003",
        customerName: "Robert Smith",
        customerImage: "https://picsum.photos/200?random=3",
        invoice: "INV-567890",
        status: "Active",
        total: 745.60,
        dueDate: "04 Jun 2024",
      },
    ],
    recentActivity: [
      { message: "You sold an item", subMessage: "Paul Burgess just purchased 'My - Admin Dashboard!'", time: "5 minutes ago" },
      { message: "Product on the Theme Market", time: "10 minutes ago" },
      { message: "Reviewer added Admin Dashboard", time: "30 minutes ago" },
    ],
  };

  // Product management state
  const [products, setProducts] = useState([
    { id: "P001", name: "Wireless Headphones", category: "Electronics", price: 99.99, stock: 50 },
    { id: "P002", name: "Running Shoes", category: "Fashion", price: 79.99, stock: 5 },
    { id: "P003", name: "Smart Watch", category: "Electronics", price: 199.99, stock: 8 },
  ]);
  const [newProduct, setNewProduct] = useState({ name: "", category: "", price: "", stock: "" });
  const [editProduct, setEditProduct] = useState(null);
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [productPage, setProductPage] = useState(1);
  const productsPerPage = 5;

  // Order management state
  const [orders, setOrders] = useState([
    { id: "O001", customer: "Emily Davis", date: "2025-04-15", total: 532.75, status: "Pending" },
    { id: "O002", customer: "Michael Johnson", date: "2025-04-14", total: 689.50, status: "Shipped" },
    { id: "O003", customer: "Robert Smith", date: "2025-04-13", total: 745.60, status: "Delivered" },
  ]);
  const [orderSearchTerm, setOrderSearchTerm] = useState("");
  const [orderPage, setOrderPage] = useState(1);
  const ordersPerPage = 5;

  // Handle customer export
  const handleExportCustomers = () => {
    const csvData = [
      ["Customer Name", "Invoice", "Status", "Total", "Due Date"],
      ...dashboardData.recentCustomers.map((customer) => [
        customer.customerName,
        customer.invoice,
        customer.status,
        `$${customer.total.toFixed(2)}`,
        customer.dueDate,
      ]),
    ];
    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "recent_customers_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle product export
  const handleExportProducts = () => {
    const csvData = [
      ["Product ID", "Name", "Category", "Price", "Stock"],
      ...products.map((product) => [
        product.id,
        product.name,
        product.category,
        `$${product.price.toFixed(2)}`,
        product.stock,
      ]),
    ];
    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "products_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle order export
  const handleExportOrders = () => {
    const csvData = [
      ["Order ID", "Customer", "Date", "Total", "Status"],
      ...orders.map((order) => [
        order.id,
        order.customer,
        order.date,
        `$${order.total.toFixed(2)}`,
        order.status,
      ]),
    ];
    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "orders_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Product management functions
  const handleAddProduct = (e) => {
    e.preventDefault();
    const product = {
      id: `P${(products.length + 1).toString().padStart(3, "0")}`,
      name: newProduct.name,
      category: newProduct.category,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
    };
    setProducts([...products, product]);
    setNewProduct({ name: "", category: "", price: "", stock: "" });
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    setProducts(
      products.map((p) => (p.id === editProduct.id ? { ...editProduct } : p))
    );
    setEditProduct(null);
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  // Order management functions
  const handleUpdateOrderStatus = (id, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  // Search and filter products
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) &&
      (filterCategory ? product.category === filterCategory : true)
  );

  // Search orders
  const filteredOrders = orders.filter((order) =>
    order.customer.toLowerCase().includes(orderSearchTerm.toLowerCase())
  );

  // Product pagination
  const indexOfLastProduct = productPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalProductPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Order pagination
  const indexOfLastOrder = orderPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalOrderPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Low stock products
  const lowStockProducts = products.filter((product) => product.stock < 10);

  // Chart data (unchanged)
  const trafficChartData = {
    labels: dashboardData.trafficSources.labels,
    datasets: [
      {
        data: dashboardData.trafficSources.data,
        backgroundColor: dashboardData.trafficSources.colors,
        borderWidth: 0,
      },
    ],
  };

  const overviewChartData = {
    labels: dashboardData.overview.labels,
    datasets: [
      {
        label: "Total Revenue",
        data: dashboardData.overview.totalRevenue,
        type: "bar",
        backgroundColor: "rgba(46, 204, 113, 0.5)",
        borderColor: "rgba(46, 204, 113, 1)",
        borderWidth: 1,
      },
      {
        label: "Total Expenses",
        data: dashboardData.overview.totalExpenses,
        type: "bar",
        backgroundColor: "rgba(31, 42, 68, 0.5)",
        borderColor: "rgba(31, 42, 68, 1)",
        borderWidth: 1,
      },
      {
        label: "Investment",
        data: dashboardData.overview.investment,
        type: "line",
        borderColor: "rgba(231, 76, 60, 1)",
        backgroundColor: "rgba(231, 76, 60, 0.2)",
        fill: false,
        tension: 0.3,
      },
      {
        label: "Savings",
        data: dashboardData.overview.savings,
        type: "line",
        borderColor: "rgba(52, 152, 219, 1)",
        backgroundColor: "rgba(52, 152, 219, 0.2)",
        fill: false,
        tension: 0.3,
      },
    ],
  };

  return (
    <LayoutAdmin>
      <div className="min-h-screen bg-gray-100 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort By</span>
              <select className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-600">
                <option>01 May to 31 May</option>
              </select>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-4">
              <div className="bg-gray-100 p-3 rounded-full">
                <FaUsers className="text-gray-600" size={24} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-600">Total Customers</h3>
                <p className="text-xl font-bold text-gray-800">{dashboardData.totalCustomers}</p>
                <p className="text-xs text-red-600">
                  {dashboardData.percentageChanges.totalCustomers}%{" "}
                  <span className="text-gray-500">Since last month</span>
                </p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-4">
              <div className="bg-gray-100 p-3 rounded-full">
                <FaDollarSign className="text-gray-600" size={24} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-600">Total Revenue</h3>
                <p className="text-xl font-bold text-gray-800">${dashboardData.totalRevenue.toFixed(2)}</p>
                <p className="text-xs text-green-600">
                  {dashboardData.percentageChanges.totalRevenue}%{" "}
                  <span className="text-gray-500">Since last month</span>
                </p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-4">
              <div className="bg-gray-100 p-3 rounded-full">
                <FaExclamationTriangle className="text-gray-600" size={24} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-600">Pending Payments</h3>
                <p className="text-xl font-bold text-gray-800">${dashboardData.pendingPayments.toFixed(2)}</p>
                <p className="text-xs text-green-600">
                  {dashboardData.percentageChanges.pendingPayments}%{" "}
                  <span className="text-gray-500">Since last month</span>
                </p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-4">
              <div className="bg-gray-100 p-3 rounded-full">
                <FaUsers className="text-gray-600" size={24} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-600">Active Customers</h3>
                <p className="text-xl font-bold text-gray-800">{dashboardData.activeCustomers}</p>
                <p className="text-xs text-red-600">
                  {dashboardData.percentageChanges.activeCustomers}%{" "}
                  <span className="text-gray-500">Since last month</span>
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Section */}
            <div className="lg:col-span-3 space-y-6">
              {/* Traffic Sources Chart */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Traffic by Source</h3>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-40 h-40">
                    <Doughnut
                      data={trafficChartData}
                      options={{
                        cutout: "70%",
                        plugins: { legend: { position: "right" } },
                      }}
                    />
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    {dashboardData.trafficSources.labels.map((label, index) => (
                      <div key={label} className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: dashboardData.trafficSources.colors[index] }}
                        ></div>
                        <span className="text-sm text-gray-600">
                          {label} <span className="font-semibold">{dashboardData.trafficSources.data[index]}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Overview Chart */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Overview</h3>
                  <div className="flex gap-2">
                    <span className="text-sm text-gray-600">Revenue: ${dashboardData.totalRevenue.toFixed(2)}</span>
                    <span className="text-sm text-gray-600">Expenses: ${(dashboardData.totalRevenue * 0.12).toFixed(2)}</span>
                    <span className="text-sm text-gray-600">Investment: ${(dashboardData.totalRevenue * 0.27).toFixed(2)}</span>
                    <span className="text-sm text-gray-600">Savings: ${(dashboardData.totalRevenue * 0.05).toFixed(2)}</span>
                  </div>
                </div>
                <div className="h-80">
                  <Line
                    data={overviewChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: { beginAtZero: true, max: 125 },
                      },
                    }}
                  />
                </div>
              </div>

              {/* Product Management */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Product Management</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={handleExportProducts}
                      className="border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-600 flex items-center gap-1"
                    >
                      <CiExport size={16} /> Export
                    </button>
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center gap-2"
                      onClick={() => document.getElementById("add-product-form").scrollIntoView()}
                    >
                      <IoAddSharp size={16} /> Add Product
                    </button>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={productSearchTerm}
                    onChange={(e) => setProductSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full sm:w-1/2"
                  />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full sm:w-1/4"
                  >
                    <option value="">All Categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                  </select>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-2 text-sm font-semibold text-gray-600">Product ID</th>
                        <th className="px-4 py-2 text-sm font-semibold text-gray-600">Name</th>
                        <th className="px-4 py-2 text-sm font-semibold text-gray-600">Category</th>
                        <th className="px-4 py-2 text-sm font-semibold text-gray-600">Price</th>
                        <th className="px-4 py-2 text-sm font-semibold text-gray-600">Stock</th>
                        <th className="px-4 py-2 text-sm font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentProducts.map((product) => (
                        <tr key={product.id} className="border-b border-gray-100">
                          <td className="px-4 py-2 text-sm text-gray-800">{product.id}</td>
                          <td className="px-4 py-2 text-sm text-gray-800">{product.name}</td>
                          <td className="px-4 py-2 text-sm text-gray-600">{product.category}</td>
                          <td className="px-4 py-2 text-sm text-gray-600">${product.price.toFixed(2)}</td>
                          <td className="px-4 py-2 text-sm text-gray-600">{product.stock}</td>
                          <td className="px-4 py-2 flex gap-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="p-2 rounded-full hover:bg-gray-100"
                            >
                              <FaEdit className="text-blue-600" size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 rounded-full hover:bg-gray-100"
                            >
                              <FaTrash className="text-red-600" size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Showing {indexOfFirstProduct + 1} to {Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} Products
                  </span>
                  <div className="flex gap-2">
                    {Array.from({ length: totalProductPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setProductPage(page)}
                        className={`px-2 py-1 border rounded-md ${productPage === page ? "bg-blue-500 text-white" : ""}`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                </div>
                <div id="add-product-form" className="mt-6">
                  <h4 className="text-md font-semibold text-gray-800 mb-4">Add New Product</h4>
                  <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">Product Name</label>
                      <input
                        type="text"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Category</label>
                      <input
                        type="text"
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Price ($)</label>
                      <input
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Stock</label>
                      <input
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        required
                        min="0"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                      >
                        Add Product
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Order Management */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Order Management</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={handleExportOrders}
                      className="border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-600 flex items-center gap-1"
                    >
                      <CiExport size={16} /> Export
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search orders by customer..."
                    value={orderSearchTerm}
                    onChange={(e) => setOrderSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full sm:w-1/2"
                  />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-2 text-sm font-semibold text-gray-600">Order ID</th>
                        <th className="px-4 py-2 text-sm font-semibold text-gray-600">Customer</th>
                        <th className="px-4 py-2 text-sm font-semibold text-gray-600">Date</th>
                        <th className="px-4 py-2 text-sm font-semibold text-gray-600">Total</th>
                        <th className="px-4 py-2 text-sm font-semibold text-gray-600">Status</th>
                        <th className="px-4 py-2 text-sm font-semibold text-gray-600">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentOrders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-100">
                          <td className="px-4 py-2 text-sm text-gray-800">{order.id}</td>
                          <td className="px-4 py-2 text-sm text-gray-800">{order.customer}</td>
                          <td className="px-4 py-2 text-sm text-gray-600">{order.date}</td>
                          <td className="px-4 py-2 text-sm text-gray-600">${order.total.toFixed(2)}</td>
                          <td className="px-4 py-2 text-sm">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </td>
                          <td className="px-4 py-2 text-center">
                            <button className="p-2 rounded-full hover:bg-gray-100">
                              <FaRegEye className="text-gray-600" size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} Orders
                  </span>
                  <div className="flex gap-2">
                    {Array.from({ length: totalOrderPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setOrderPage(page)}
                        className={`px-2 py-1 border rounded-md ${orderPage === page ? "bg-blue-500 text-white" : ""}`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Brands Listing and Top Customers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Brands Listing</h3>
                    <button className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center gap-2">
                      <IoAddSharp size={16} /> Add Brand
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="px-4 py-2 text-sm font-semibold text-gray-600">Name</th>
                          <th className="px-4 py-2 text-sm font-semibold text-gray-600">Established</th>
                          <th className="px-4 py-2 text-sm font-semibold text-gray-600">Stores</th>
                          <th className="px-4 py-2 text-sm font-semibold text-gray-600">Products</th>
                          <th className="px-4 py-2 text-sm font-semibold text-gray-600">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: "Zaroon - Brazil", established: "Since 2020", stores: "1.5K", products: "8,950", status: "Active" },
                          { name: "Jocky-Johns - USA", established: "Since 1985", stores: "205", products: "1,258", status: "Active" },
                          { name: "Ginne - India", established: "Since 2001", stores: "89", products: "338", status: "Active" },
                        ].map((brand) => (
                          <tr key={brand.name} className="border-b border-gray-100">
                            <td className="px-4 py-2 text-sm text-gray-800">{brand.name}</td>
                            <td className="px-4 py-2 text-sm text-gray-600">{brand.established}</td>
                            <td className="px-4 py-2 text-sm text-gray-600">{brand.stores}</td>
                            <td className="px-4 py-2 text-sm text-gray-600">{brand.products}</td>
                            <td className="px-4 py-2 text-sm text-green-600">{brand.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-600">Showing 3 of 15 Results</span>
                    <div className="flex gap-2">
                      <button className="px-2 py-1 border rounded-md">1</button>
                      <button className="px-2 py-1 border rounded-md">2</button>
                      <button className="px-2 py-1 border rounded-md">3</button>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Top Customers</h3>
                    <div className="flex gap-2">
                      <button className="border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-600 flex items-center gap-1">
                        <CiImport size={16} /> Import
                      </button>
                      <button
                        onClick={handleExportCustomers}
                        className="border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-600 flex items-center gap-1"
                      >
                        <CiExport size={16} /> Export
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="px-4 py-2 text-sm font-semibold text-gray-600">Customer</th>
                          <th className="px-4 py-2 text-sm font-semibold text-gray-600">Invoice</th>
                          <th className="px-4 py-2 text-sm font-semibold text-gray-600">Total</th>
                          <th className="px-4 py-2 text-sm font-semibold text-gray-600">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData.recentCustomers.map((customer) => (
                          <tr key={customer.id} className="border-b border-gray-100">
                            <td className="px-4 py-2">
                              <div className="flex items-center gap-3">
                                <img
                                  className="w-8 h-8 object-cover rounded-full"
                                  src={customer.customerImage}
                                  alt={customer.customerName}
                                />
                                <span className="text-sm text-gray-800">{customer.customerName}</span>
                              </div>
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600">{customer.invoice}</td>
                            <td className="px-4 py-2 text-sm text-gray-600">${customer.total.toFixed(2)}</td>
                            <td className="px-4 py-2 text-center">
                              <button className="p-2 rounded-full hover:bg-gray-100">
                                <FaRegEye className="text-gray-600" size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-600">Showing 3 of 10 Results</span>
                    <div className="flex gap-2">
                      <button className="px-2 py-1 border rounded-md">1</button>
                      <button className="px-2 py-1 border rounded-md">2</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Low Stock Alerts */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Low Stock Alerts</h3>
                {lowStockProducts.length > 0 ? (
                  <div className="space-y-4">
                    {lowStockProducts.map((product) => (
                      <div key={product.id} className="flex items-center gap-3">
                        <FaExclamationCircle className="text-red-600" size={20} />
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{product.name}</p>
                          <p className="text-xs text-gray-600">Stock: {product.stock} units</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">No low stock products.</p>
                )}
              </div>

              {/* Recent Activity */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {dashboardData.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <span className="text-blue-600">📢</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{activity.message}</p>
                        {activity.subMessage && <p className="text-xs text-gray-600">{activity.subMessage}</p>}
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Estimated Tax */}
              <div className="bg-yellow-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Estimated Tax for This Year</h3>
                <p className="text-sm text-gray-600 mb-4">We kindly encourage you to review your recent transactions.</p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Active Now</button>
              </div>
            </div>
          </div>

          {/* Edit Product Modal */}
          {editProduct && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Product</h3>
                <form onSubmit={handleUpdateProduct}>
                  <div className="mb-4">
                    <label className="text-sm text-gray-600">Product Name</label>
                    <input
                      type="text"
                      value={editProduct.name}
                      onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="text-sm text-gray-600">Category</label>
                    <input
                      type="text"
                      value={editProduct.category}
                      onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="text-sm text-gray-600">Price ($)</label>
                    <input
                      type="number"
                      value={editProduct.price}
                      onChange={(e) => setEditProduct({ ...editProduct, price: parseFloat(e.target.value) })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="mb-6">
                    <label className="text-sm text-gray-600">Stock</label>
                    <input
                      type="number"
                      value={editProduct.stock}
                      onChange={(e) => setEditProduct({ ...editProduct, stock: parseInt(e.target.value) })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      required
                      min="0"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditProduct(null)}
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default Dashboard;
 