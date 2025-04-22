import React, { useState, useEffect } from "react";
import LayoutAdmin from "../../../Layouts/LayoutAdmin";
import { CiEdit, CiExport, CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";
import { IoAddSharp } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import axios from "axios";

const Logo = () => {
  const [listProduct, setListProduct] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const productsPerPage = 10;

  // API configuration
  const API_URL = `${import.meta.env.VITE_API_URL}/logos`;
  const API_KEY = "6m4xzdzaslini9VEaU1JNhyQvMs";
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

  // Fetch logos from API
  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: { "X-API-KEY": API_KEY },
        });
        setListProduct(
          response.data.logos.map((logo) => ({
            id: logo.id,
            image: logo.image
              ? logo.image.startsWith("http")
                ? logo.image
                : `${STORAGE_URL}/${logo.image}`
              : "https://picsum.photos/200?random=1",
            category: logo.category || "Uncategorized",
            status: logo.status ? 1 : 0,
            publishedOn: logo.created_at
              ? new Date(logo.created_at).toLocaleString()
              : new Date().toLocaleString(),
          }))
        );
      } catch (error) {
        console.error("Failed to fetch logos:", error);
        setListProduct([
          {
            id: "1",
            image: "https://picsum.photos/200?random=1",
            category: "Sample",
            status: 1,
            publishedOn: new Date().toLocaleString(),
          },
        ]);
      }
    };
    fetchLogos();
  }, []);

  // Delete logo
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this logo?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { "X-API-KEY": API_KEY },
      });
      setListProduct((prev) => prev.filter((logo) => logo.id !== id));
      setSelectedProducts((prev) =>
        prev.filter((selectedId) => selectedId !== id)
      );
      alert("Logo deleted successfully");
    } catch (error) {
      console.error("Failed to delete logo:", error);
      alert(
        "Failed to delete logo: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // Handle image loading error
  const handleImageError = (e) => {
    console.warn("Image failed to load:", e.target.src);
    e.target.src = "https://picsum.photos/200?random=1"; // Fallback image
  };

  // Filter logos
  const filteredProducts = listProduct.filter((product) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      product.category.toLowerCase().includes(searchLower) ||
      product.id.toString().includes(searchLower) ||
      product.publishedOn.toLowerCase().includes(searchLower);

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "published" && product.status === 1) ||
      (filterStatus === "drafts" && product.status === 0);

    return matchesSearch && matchesStatus;
  });

  // Sort logos
  const sortProducts = (products, key, direction) => {
    return [...products].sort((a, b) => {
      const valueA = a[key]?.toString().toLowerCase() || "";
      const valueB = b[key]?.toString().toLowerCase() || "";
      return direction === "ascending"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  };

  const sortedProducts = sortConfig.key
    ? sortProducts(filteredProducts, sortConfig.key, sortConfig.direction)
    : filteredProducts;

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts =
    showAllProducts && filterStatus === "all"
      ? sortedProducts
      : sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Handlers
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
    setSelectedProducts([]);
  };

  const handleFilterStatus = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
    setShowAllProducts(status === "all");
    setSelectedProducts([]);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const currentProductIds = currentProducts.map((product) => product.id);
      setSelectedProducts(currentProductIds);
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleExport = () => {
    if (selectedProducts.length === 0) {
      alert("Please select at least one logo to export.");
      return;
    }
    const productsToExport = listProduct.filter((product) =>
      selectedProducts.includes(product.id)
    );
    const csvData = [
      ["ID", "Category", "Status", "Published On"],
      ...productsToExport.map((product) => [
        product.id,
        product.category,
        product.status ? "Active" : "Inactive",
        product.publishedOn,
      ]),
    ];
    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "logos_export.csv");
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
    setSelectedProducts([]);
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
      setSelectedProducts([]);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setSelectedProducts([]);
    }
  };

  return (
    <LayoutAdmin>
      <div className="m-[0_0_50px_0] border-b-1 border-gray-200">
        <div className="px-6 py-2 bg-gray-100 text-gray-800">
          <h2 className="text-2xl font-bold mb-4">Management Logo</h2>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <button
              onClick={() => handleFilterStatus("all")}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filterStatus === "all"
                  ? "bg-blue-100 text-blue-800"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              All ({listProduct.length})
            </button>
            <button
              onClick={() => handleFilterStatus("published")}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filterStatus === "published"
                  ? "bg-blue-100 text-blue-800"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              Published ({listProduct.filter((p) => p.status === 1).length})
            </button>
            <button
              onClick={() => handleFilterStatus("drafts")}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filterStatus === "drafts"
                  ? "bg-blue-100 text-blue-800"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              Drafts ({listProduct.filter((p) => p.status === 0).length})
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <CiSearch className="text-gray-500 mr-2" size={20} />
              <input
                className="border-none outline-none w-64 sm:w-80 text-sm"
                type="text"
                placeholder="Search logos"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={handleExport}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 flex items-center gap-1"
              >
                <CiExport size={16} /> Export
              </button>
              <Link
                to="/logo/create"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 py-2 text-sm flex items-center gap-1"
              >
                <IoAddSharp size={16} /> Add Logo
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
                        currentProducts.length > 0 &&
                        currentProducts.every((product) =>
                          selectedProducts.includes(product.id)
                        )
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                    onClick={() => sortData("category")}
                  >
                    Category {getSortIndicator("category")}
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                    onClick={() => sortData("publishedOn")}
                  >
                    Published On {getSortIndicator("publishedOn")}
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.length > 0 ? (
                  currentProducts.map((e) => (
                    <tr
                      key={e.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 rounded border-gray-300"
                          checked={selectedProducts.includes(e.id)}
                          onChange={() => handleSelectProduct(e.id)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            className="w-10 h-10 object-cover rounded"
                            src={e.image}
                            alt={e.category}
                            onError={handleImageError}
                          />
                          <span>{e.category}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {e.publishedOn}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-2">
                          <Link
                            to={`/logo/${e.id}`}
                            className="p-2 rounded-full hover:bg-blue-100 transition"
                            title="View Logo"
                          >
                            <FaRegEye className="text-blue-600" size={16} />
                          </Link>
                          <Link
                            to={`/logo/edit/${e.id}`}
                            className="p-2 rounded-full hover:bg-yellow-100 transition"
                            title="Edit Logo"
                          >
                            <CiEdit className="text-yellow-600" size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(e.id)}
                            className="p-2 rounded-full hover:bg-red-100 transition"
                            title="Delete Logo"
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
                    <td colSpan="4" className="text-center py-4 text-gray-500">
                      No logos found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {!showAllProducts && (
              <div className="flex justify-between items-center p-4">
                <div className="text-sm text-gray-600">
                  {filteredProducts.length > 0
                    ? `Showing ${indexOfFirstProduct + 1} to ${Math.min(
                        indexOfLastProduct,
                        filteredProducts.length
                      )} of ${filteredProducts.length}`
                    : "No logos found"}
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

export default Logo;
