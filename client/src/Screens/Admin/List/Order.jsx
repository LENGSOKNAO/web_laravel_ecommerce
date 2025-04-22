import React, { useState } from "react";
import LayoutAdmin from "../../../Layouts/LayoutAdmin";
import { CiEdit, CiExport, CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";
import { IoAddSharp } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";

const Order = () => {
  const [listOrders] = useState([
    {
      id: "BM9708",
      customerName: "Federico Hand",
      customerImage: "https://picsum.photos/200?random=1",
      products: [
        { name: "Men White Slim Fit T-shirt", quantity: "2 Piece" },
        { name: "HyperX Cloud Gaming Headphone", quantity: "1 Piece" },
      ],
      total: 176.41,
      orderDate: "August 05 2023",
      paymentStatus: "Completed",
      orderStatus: "Delivered",
    },
    {
      id: "BM2484",
      customerName: "Raci Lopez",
      customerImage: "https://picsum.photos/200?random=2",
      products: [
        { name: "Minetta Rattan 5 Swivel Premium Chair", quantity: "3 Piece" },
        { name: "Sleepify Luno 4 Seater Fabric Sofa", quantity: "1 Piece" },
      ],
      total: 3212.00,
      orderDate: "November 05 2023",
      paymentStatus: "Failed",
      orderStatus: "Cancel",
    },
    {
      id: "BM2543",
      customerName: "James Cantrell",
      customerImage: "https://picsum.photos/200?random=3",
      products: [
        { name: "55 L Laptop Backpack fits upto 16 In.", quantity: "4 Piece" },
        { name: "Men White Slim Fit T-shirt", quantity: "2 Piece" },
      ],
      total: 677.09,
      orderDate: "March 15 2023",
      paymentStatus: "Pending",
      orderStatus: "Ready To Pick",
    },
    {
      id: "BM6754",
      customerName: "Reginald Brown",
      customerImage: "https://picsum.photos/200?random=4",
      products: [
        { name: "Sleepify Luno 4 Seater Fabric Sofa", quantity: "2 Piece" },
        { name: "HyperX Cloud Gaming Headphone", quantity: "1 Piece" },
      ],
      total: 552.98,
      orderDate: "December 23 2023",
      paymentStatus: "Failed",
      orderStatus: "Cancel",
    },
    {
      id: "BM0863",
      customerName: "Stacey Smith",
      customerImage: "https://picsum.photos/200?random=5",
      products: [
        { name: "55 L Laptop Backpack fits upto 16 In..", quantity: "1 Piece" },
      ],
      total: 233.15,
      orderDate: "August 23 2020",
      paymentStatus: "Completed",
      orderStatus: "Cancel",
    },
    {
      id: "BM6830",
      customerName: "Alan Green",
      customerImage: "https://picsum.photos/200?random=6",
      products: [
        { name: "Navy Blue Over Size T-shirt For Men", quantity: "5 Piece" },
        { name: "Men White Slim Fit T-shirt", quantity: "6 Piece" },
      ],
      total: 772.44,
      orderDate: "January 07 2024",
      paymentStatus: "Pending",
      orderStatus: "Ready To Pick",
    },
    {
      id: "BM2584",
      customerName: "Linda Nelson",
      customerImage: "https://picsum.photos/200?random=7",
      products: [
        { name: "Sleepify Luno 4 Seater Fabric Sofa", quantity: "2 Piece" },
      ],
      total: 425.56,
      orderDate: "October 19 2023",
      paymentStatus: "Completed",
      orderStatus: "Delivered",
    },
    {
      id: "BM7466",
      customerName: "Pauline Pfaffe",
      customerImage: "https://picsum.photos/200?random=8",
      products: [
        { name: "Jordan Jumpman MVP Men’s Shoes Size", quantity: "1 Piece" },
        { name: "Men White Slim Fit T-shirt", quantity: "2 Piece" },
      ],
      total: 754.32,
      orderDate: "April 15 2024",
      paymentStatus: "Failed",
      orderStatus: "Dispatched",
    },
    {
      id: "BM2565",
      customerName: "Ethan Wilder",
      customerImage: "https://picsum.photos/200?random=9",
      products: [
        { name: "55 L Laptop Backpack fits upto 16 In", quantity: "3 Piece" },
        { name: "HyperX Cloud Gaming Headphone", quantity: "1 Piece" },
      ],
      total: 533.76,
      orderDate: "May 21 2023",
      paymentStatus: "Completed",
      orderStatus: "Delivered",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("");
  const [selectedOrderStatus, setSelectedOrderStatus] = useState("");
  const ordersPerPage = 10;

  // Extract unique payment and order statuses for dropdowns
  const uniquePaymentStatuses = [
    ...new Set(listOrders.map((order) => order.paymentStatus)),
  ].sort();
  const uniqueOrderStatuses = [
    ...new Set(listOrders.map((order) => order.orderStatus)),
  ].sort();

  // Filter orders based on search term, payment status, and order status
  const filteredOrders = listOrders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      order.id.toLowerCase().includes(searchLower) ||
      order.customerName.toLowerCase().includes(searchLower) ||
      order.products.some((prod) =>
        prod.name.toLowerCase().includes(searchLower)
      ) ||
      order.total.toString().includes(searchLower) ||
      order.orderDate.toLowerCase().includes(searchLower) ||
      order.paymentStatus.toLowerCase().includes(searchLower) ||
      order.orderStatus.toLowerCase().includes(searchLower);

    const matchesPaymentStatus =
      !selectedPaymentStatus || order.paymentStatus === selectedPaymentStatus;

    const matchesOrderStatus =
      !selectedOrderStatus || order.orderStatus === selectedOrderStatus;

    return matchesSearch && matchesPaymentStatus && matchesOrderStatus;
  });

  // Sort filtered orders
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

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders =
    showAllOrders && filterStatus === "all"
      ? sortedOrders
      : sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Handlers
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
    setSelectedOrders([]);
  };

  const handleFilterStatus = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
    setShowAllOrders(status === "all");
    setSelectedOrders([]);
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
                          />
                          <span className="text-sm text-gray-800">
                            {order.customerName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {order.products.map((prod, i) => (
                          <div key={i}>P{i + 1} - {prod.name}</div>
                        ))}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {order.products.map((prod, i) => (
                          <div key={i}>{prod.quantity}</div>
                        ))}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        ${order.total.toFixed(2)}
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
                    <td colSpan="10" className="text-center py-4 text-gray-500">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {!showAllOrders && (
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
            )}
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default Order;