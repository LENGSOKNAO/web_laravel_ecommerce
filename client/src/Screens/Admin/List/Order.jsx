import React, { useState, useEffect, useCallback } from "react";
import LayoutAdmin from "../../../Layouts/LayoutAdmin";
import { CiEdit, CiExport, CiSearch } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { IoAddSharp } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import axios from "axios";
import debounce from "lodash/debounce";

const Order = () => {
  const [listOrders, setListOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("");
  const [selectedOrderStatus, setSelectedOrderStatus] = useState("");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const ordersPerPage = 10;
  const navigate = useNavigate();

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/orders`,
        {
          headers: { "Cache-Control": "no-cache" },
        }
      );
      const orders = Array.isArray(response.data) ? response.data : [];
      console.log("Fetched orders:", orders);
      setListOrders(orders);
      setError(null);
    } catch (err) {
      console.error("API Error:", err.response || err.message);
      setError(
        `Failed to fetch orders: ${err.response?.status || err.message}`
      );
      setListOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Reset page and selected orders when filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedOrders([]);
  }, [searchTerm, selectedPaymentStatus, selectedOrderStatus]);

  // Delete order
  const handleDeleteOrder = async (orderId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/orders/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setListOrders((prev) => prev.filter((order) => order.id !== orderId));
    setSelectedOrders((prev) => prev.filter((id) => id !== orderId));
    
  } catch (err) {
    console.error("Delete Error:", err.response || err.message);
    const message =
      err.response?.data?.message || err.message || "Failed to delete order";

    if (err.response?.status === 401) {
      alert("Session expired. Please log in again.");
      navigate("/login");
    } else if (err.response?.status === 403) {
      alert(
        "You do not have permission to delete this order. Please contact an admin."
      );
    } else {
      alert(message);
    }
  }
};

  // Extract unique payment and order statuses
  const uniquePaymentStatuses = [
    ...new Set(listOrders.map((order) => order.paymentStatus)),
  ].sort();
  const uniqueOrderStatuses = [
    ...new Set(listOrders.map((order) => order.orderStatus)),
  ].sort();

  // Filter orders
  const filteredOrders = listOrders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (order.id?.toString().toLowerCase() || "").includes(searchLower) ||
      (order.customerName?.toLowerCase() || "").includes(searchLower) ||
      (Array.isArray(order.products)
        ? order.products.some((prod) =>
            (prod.name?.toLowerCase() || "").includes(searchLower)
          )
        : false) ||
      (order.total?.toString() || "").includes(searchLower) ||
      (order.orderDate?.toLowerCase() || "").includes(searchLower) ||
      (order.paymentStatus?.toLowerCase() || "").includes(searchLower) ||
      (order.orderStatus?.toLowerCase() || "").includes(searchLower);

    const matchesPaymentStatus =
      !selectedPaymentStatus || order.paymentStatus === selectedPaymentStatus;
    const matchesOrderStatus =
      !selectedOrderStatus || order.orderStatus === selectedOrderStatus;

    return matchesSearch && matchesPaymentStatus && matchesOrderStatus;
  });

  // Sort orders
  const sortOrders = (orders, key, direction) => {
    return [...orders].sort((a, b) => {
      if (key === "total") {
        return direction === "ascending" ? a[key] - b[key] : b[key] - a[key];
      } else {
        const valueA = a[key] ? a[key].toString().toLowerCase() : "";
        const valueB = b[key] ? b[key].toString().toLowerCase() : "";
        return direction === "ascending"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
    });
  };

  const sortedOrders = sortConfig.key
    ? sortOrders(filteredOrders, sortConfig.key, sortConfig.direction)
    : filteredOrders;

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Handlers
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
      setCurrentPage(1);
      setSelectedOrders([]);
    }, 300),
    []
  );

  const handleSearch = (e) => {
    debouncedSearch(e.target.value.trim());
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const currentOrderIds = currentOrders.map((order) => order.id);
      setSelectedOrders(currentOrderIds);
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleExport = () => {
    if (selectedOrders.length === 0) {
      alert("Please select at least one order to export.");
      return;
    }
    const ordersToExport = listOrders.filter((order) =>
      selectedOrders.includes(order.id)
    );
    const csvData = [
      [
        "Order ID",
        "Customer Name",
        "Products",
        "Total",
        "Order Date",
        "Payment Status",
        "Order Status",
      ],
      ...ordersToExport.map((order) => [
        order.id,
        order.customerName,
        order.products.map((p) => `${p.name} (${p.quantity})`).join("; "),
        `$${order.total.toFixed(2)}`,
        order.orderDate,
        order.paymentStatus,
        order.orderStatus,
      ]),
    ];
    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "selected_orders_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const sortData = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
    setSelectedOrders([]);
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? " ↑" : " ↓";
    }
    return "";
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setSelectedOrders([]);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setSelectedOrders([]);
    }
  };

  const handlePaymentStatusChange = (e) => {
    setSelectedPaymentStatus(e.target.value);
    setCurrentPage(1);
    setSelectedOrders([]);
  };

  const handleOrderStatusChange = (e) => {
    setSelectedOrderStatus(e.target.value);
    setCurrentPage(1);
    setSelectedOrders([]);
  };

  const handleViewOrder = (order) => {
    if (order.products && order.products.length > 0) {
      const firstProduct = order.products[0];
      const productId = firstProduct.id || firstProduct.productId;
      if (productId) {
        navigate(`/product/${productId}`);
      } else {
        alert("Product ID not found for this order.");
      }
    } else {
      alert("No products found in this order.");
    }
  };

  return (
    <LayoutAdmin>
      <div className="m-[0_0_50px_0] border-b-1 border-gray-200">
        <div className="px-6 py-2 bg-gray-100 text-gray-800">
          <h2 className="text-2xl font-bold mb-4">Orders</h2>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <CiSearch className="text-gray-500 mr-2" size={20} />
              <input
                className="border-none outline-none w-64 sm:w-80 text-sm"
                type="text"
                placeholder="Search orders"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <select
              className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600"
              value={selectedPaymentStatus}
              onChange={handlePaymentStatusChange}
            >
              <option value="">All Payment Statuses</option>
              {uniquePaymentStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <select
              className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600"
              value={selectedOrderStatus}
              onChange={handleOrderStatusChange}
            >
              <option value="">All Order Statuses</option>
              {uniqueOrderStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={handleExport}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 flex items-center gap-1"
              >
                <CiExport size={16} /> Export
              </button>
              <Link
                to="/order/create"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 py-2 text-sm flex items-center gap-1"
              >
                <IoAddSharp size={16} /> Add Order
              </Link>
            </div>
          </div>
        </div>
        <div className="flex justify-center bg-white border-t-1 border-gray-200">
          <div className="w-[98%] overflow-x-auto">
            {loading ? (
              <div className="text-center py-4">
                <svg
                  className="animate-spin h-5 w-5 mx-auto text-gray-600"
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
              </div>
            ) : error ? (
              <div className="text-center py-4 text-red-600">
                {error}
                <button
                  onClick={fetchOrders}
                  className="ml-2 text-blue-600 hover:underline"
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-b-1 border-gray-200">
                      <th className="px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 rounded border-gray-300"
                          checked={
                            currentOrders.length > 0 &&
                            currentOrders.every((order) =>
                              selectedOrders.includes(order.id)
                            )
                          }
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th
                        className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                        onClick={() => sortData("id")}
                      >
                        Order ID {getSortIndicator("id")}
                      </th>
                      <th
                        className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                        onClick={() => sortData("customerName")}
                      >
                        Customer Name {getSortIndicator("customerName")}
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase">
                        Quantity
                      </th>
                      <th
                        className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                        onClick={() => sortData("total")}
                      >
                        Total {getSortIndicator("total")}
                      </th>
                      <th
                        className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                        onClick={() => sortData("orderDate")}
                      >
                        Order Date {getSortIndicator("orderDate")}
                      </th>
                      <th
                        className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                        onClick={() => sortData("paymentStatus")}
                      >
                        Payment Status {getSortIndicator("paymentStatus")}
                      </th>
                      <th
                        className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                        onClick={() => sortData("orderStatus")}
                      >
                        Order Status {getSortIndicator("orderStatus")}
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-600 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentOrders.length > 0 ? (
                      currentOrders.map((order) => (
                        <tr
                          key={order.id}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-blue-600 rounded border-gray-300"
                              checked={selectedOrders.includes(order.id)}
                              onChange={() => handleSelectOrder(order.id)}
                            />
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800">
                            #{order.id}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img
                                className="w-8 h-8 object-cover rounded-full"
                                src={order.customerImage}
                                alt={order.customerName}
                                onError={(e) => {
                                  e.target.src = "https://picsum.photos/200";
                                }}
                              />
                              <span className="text-sm text-gray-800">
                                {order.customerName}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800">
                            {order.products.map((prod, i) => (
                              <div key={i}>
                                P{i + 1} - {prod.name}
                              </div>
                            ))}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800">
                            {order.products.map((prod, i) => (
                              <div key={i}>{prod.quantity}</div>
                            ))}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800">
                            ${Number(order.total || 0).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800">
                            {order.orderDate}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                order.paymentStatus === "Completed"
                                  ? "bg-green-100 text-green-800"
                                  : order.paymentStatus === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                order.orderStatus === "Delivered"
                                  ? "bg-blue-100 text-blue-800"
                                  : order.orderStatus === "Ready To Pick"
                                  ? "bg-gray-100 text-gray-800"
                                  : order.orderStatus === "Dispatched"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {order.orderStatus}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                className="p-2 rounded-full hover:bg-blue-100 transition"
                                title="View Order"
                                onClick={() => handleViewOrder(order)}
                              >
                                <FaRegEye className="text-blue-600" size={16} />
                              </button>
                              <button
                                className="p-2 rounded-full hover:bg-yellow-100 transition"
                                title="Edit Order"
                              >
                                <CiEdit className="text-yellow-600" size={16} />
                              </button>
                              <button
                                className="p-2 rounded-full hover:bg-red-100 transition"
                                title="Delete Order"
                                onClick={() => handleDeleteOrder(order.id)}
                              >
                                <RiDeleteBin6Line
                                  className="text-red-600"
                                  size={16}
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="10"
                          className="text-center py-4 text-gray-500"
                        >
                          No orders found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="flex justify-between items-center p-4">
                  <div className="text-sm text-gray-600">
                    {filteredOrders.length > 0
                      ? `1 to ${Math.min(10, filteredOrders.length)} of ${
                          filteredOrders.length
                        }`
                      : "No orders found"}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className={`p-1 ${
                        currentPage === 1
                          ? "opacity-50 cursor-not-allowed"
                          : "text-gray-600"
                      }`}
                    >
                      <GoChevronLeft size={16} />
                    </button>
                    <span className="text-sm text-gray-600">
                      {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className={`p-1 ${
                        currentPage === totalPages || totalPages === 0
                          ? "opacity-50 cursor-not-allowed"
                          : "text-gray-600"
                      }`}
                    >
                      <GoChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default Order;
