import React, { useState } from "react";
import LayoutAdmin from "../../../Layouts/LayoutAdmin";
import { CiEdit, CiExport, CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";
import { IoAddSharp } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";

const Customer = () => {
  const [listCustomers] = useState([
    {
      id: "C001",
      customerName: "Emily Davis",
      customerImage: "https://picsum.photos/200?random=1",
      invoice: "INV-103452",
      status: "Active",
      total: 532.75,
      amountDue: 123.45,
      shopRate: 75,
      dueDate: "19 January 2024",
    },
    {
      id: "C002",
      customerName: "Michael Johnson",
      customerImage: "https://picsum.photos/200?random=2",
      invoice: "INV-984321",
      status: "Block",
      total: 689.50,
      amountDue: 234.56,
      shopRate: 90,
      dueDate: "10 February 2024",
    },
    {
      id: "C003",
      customerName: "Robert Smith",
      customerImage: "https://picsum.photos/200?random=3",
      invoice: "INV-567890",
      status: "Active",
      total: 745.60,
      amountDue: 498.76,
      shopRate: 60,
      dueDate: "04 Jun 2024",
    },
    {
      id: "C004",
      customerName: "David Williams",
      customerImage: "https://picsum.photos/200?random=4",
      invoice: "INV-876543",
      status: "Active",
      total: 812.40,
      amountDue: 345.67,
      shopRate: 70,
      dueDate: "01 April 2024",
    },
    {
      id: "C005",
      customerName: "James Miller",
      customerImage: "https://picsum.photos/200?random=5",
      invoice: "INV-192837",
      status: "Block",
      total: 970.25,
      amountDue: 210.98,
      shopRate: 80,
      dueDate: "01 May 2024",
    },
    {
      id: "C006",
      customerName: "Richard Taylor",
      customerImage: "https://picsum.photos/200?random=6",
      invoice: "INV-283746",
      status: "Block",
      total: 524.80,
      amountDue: 432.10,
      shopRate: 50,
      dueDate: "17 January 2024",
    },
    {
      id: "C007",
      customerName: "Thomas Anderson",
      customerImage: "https://picsum.photos/200?random=7",
      invoice: "INV-465728",
      status: "Active",
      total: 799.90,
      amountDue: 187.65,
      shopRate: 85,
      dueDate: "09 July 2024",
    },
    {
      id: "C008",
      customerName: "Charles Thomas",
      customerImage: "https://picsum.photos/200?random=8",
      invoice: "INV-372819",
      status: "Active",
      total: 632.55,
      amountDue: 321.09,
      shopRate: 65,
      dueDate: "14 Nov 2024",
    },
    {
      id: "C009",
      customerName: "Daniel Harris",
      customerImage: "https://picsum.photos/200?random=9",
      invoice: "INV-948576",
      status: "Block",
      total: 915.30,
      amountDue: 545.21,
      shopRate: 55,
      dueDate: "23 August 2024",
    },
    {
      id: "C010",
      customerName: "Sarah Brown",
      customerImage: "https://picsum.photos/200?random=10",
      invoice: "INV-562738",
      status: "Active",
      total: 750.75,
      amountDue: 321.09,
      shopRate: 70,
      dueDate: "15 July 2024",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAllCustomers, setShowAllCustomers] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const customersPerPage = 10;

  // Extract unique statuses for filtering
  const uniqueStatuses = [
    ...new Set(listCustomers.map((customer) => customer.status)),
  ].sort();

  // Filter customers based on search term and status
  const filteredCustomers = listCustomers.filter((customer) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      customer.customerName.toLowerCase().includes(searchLower) ||
      customer.invoice.toLowerCase().includes(searchLower) ||
      customer.status.toLowerCase().includes(searchLower) ||
      customer.total.toString().includes(searchLower) ||
      customer.amountDue.toString().includes(searchLower) ||
      customer.dueDate.toLowerCase().includes(searchLower);

    const matchesStatus =
      filterStatus === "all" || customer.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Sort filtered customers
  const sortCustomers = (customers, key, direction) => {
    return [...customers].sort((a, b) => {
      if (key === "total" || key === "amountDue") {
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

  const sortedCustomers = sortConfig.key
    ? sortCustomers(filteredCustomers, sortConfig.key, sortConfig.direction)
    : filteredCustomers;

  // Pagination logic
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers =
    showAllCustomers && filterStatus === "all"
      ? sortedCustomers
      : sortedCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  // Handlers
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
    setSelectedCustomers([]);
  };

  const handleFilterStatus = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
    setShowAllCustomers(status === "all");
    setSelectedCustomers([]);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const currentCustomerIds = currentCustomers.map((customer) => customer.id);
      setSelectedCustomers(currentCustomerIds);
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (customerId) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId]
    );
  };

  const handleExport = () => {
    if (selectedCustomers.length === 0) {
      alert("Please select at least one customer to export.");
      return;
    }

    const customersToExport = listCustomers.filter((customer) =>
      selectedCustomers.includes(customer.id)
    );

    const csvData = [
      [
        "Customer Name",
        "Invoice",
        "Status",
        "Total",
        "Amount Due",
        "Shop Rate",
        "Due Date",
      ],
      ...customersToExport.map((customer) => [
        customer.customerName,
        customer.invoice,
        customer.status,
        `$${customer.total.toFixed(2)}`,
        `$${customer.amountDue.toFixed(2)}`,
        `${customer.shopRate}%`,
        customer.dueDate,
      ]),
    ];

    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "selected_customers_export.csv");
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
    setSelectedCustomers([]);
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
      setSelectedCustomers([]);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setSelectedCustomers([]);
    }
  };

  return (
    <LayoutAdmin>
      <div className="m-[0_0_50px_0] border-b-1 border-gray-200">
        <div className="px-6 py-2 bg-gray-100 text-gray-800">
          <h2 className="text-2xl font-bold mb-4">Manage Customers</h2>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <CiSearch className="text-gray-500 mr-2" size={20} />
              <input
                className="border-none outline-none w-64 sm:w-80 text-sm"
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <select
              className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600"
              value={filterStatus}
              onChange={(e) => handleFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              {uniqueStatuses.map((status) => (
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
                to="/customer/create"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 py-2 text-sm flex items-center gap-1"
              >
                <IoAddSharp size={16} /> Add Customer
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
                        currentCustomers.length > 0 &&
                        currentCustomers.every((customer) =>
                          selectedCustomers.includes(customer.id)
                        )
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                    onClick={() => sortData("customerName")}
                  >
                    Customer {getSortIndicator("customerName")}
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                    onClick={() => sortData("invoice")}
                  >
                    Invoice {getSortIndicator("invoice")}
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                    onClick={() => sortData("status")}
                  >
                    Status {getSortIndicator("status")}
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                    onClick={() => sortData("total")}
                  >
                    Total {getSortIndicator("total")}
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                    onClick={() => sortData("amountDue")}
                  >
                    Amount Due {getSortIndicator("amountDue")}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase">
                    Shop Rate
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                    onClick={() => sortData("dueDate")}
                  >
                    Due Date {getSortIndicator("dueDate")}
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentCustomers.length > 0 ? (
                  currentCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 rounded border-gray-300"
                          checked={selectedCustomers.includes(customer.id)}
                          onChange={() => handleSelectCustomer(customer.id)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            className="w-8 h-8 object-cover rounded-full"
                            src={customer.customerImage}
                            alt={customer.customerName}
                          />
                          <span className="text-sm text-gray-800">
                            {customer.customerName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {customer.invoice}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            customer.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        ${customer.total.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        ${customer.amountDue.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        <div className="w-24 bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-yellow-500 h-2.5 rounded-full"
                            style={{ width: `${customer.shopRate}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {customer.dueDate}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            className="p-2 rounded-full hover:bg-blue-100 transition"
                            title="View Customer"
                          >
                            <FaRegEye className="text-gray-600" size={16} />
                          </button>
                          <button
                            className="p-2 rounded-full hover:bg-red-100 transition"
                            title="Delete Customer"
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
                    <td colSpan="9" className="text-center py-4 text-gray-500">
                      No customers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {!showAllCustomers && (
              <div className="flex justify-between items-center p-4">
                <div className="text-sm text-gray-600">
                  {filteredCustomers.length > 0
                    ? `1 to ${Math.min(10, filteredCustomers.length)} of ${
                        filteredCustomers.length
                      }`
                    : "No customers found"}
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

export default Customer;