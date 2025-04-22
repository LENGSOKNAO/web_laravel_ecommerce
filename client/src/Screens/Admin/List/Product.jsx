import React, { useState, useEffect } from "react";
import LayoutAdmin from "../../../Layouts/LayoutAdmin";
import { CiEdit, CiExport, CiSearch } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { IoAddSharp } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import axios from "axios";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");
  const productsPerPage = 10;
  const navigate = useNavigate();

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/products`
        );
        const mappedProducts = response.data.data.map((product) => ({
          id: product.id,
          name: product.name || "Unnamed Product",
          image: product.image
            ? `${import.meta.env.VITE_BASE_URL}/storage/${product.image}`
            : "https://picsum.photos/200",
          brand: product.brand || "-",
          category: product.category || [],
          price: product.regular_price || 0,
          size: product.color || [],
          qty: product.qty || 0,
          active: product.status ? 1 : 0,
          tags: [...(product.category || []), ...(product.color || [])],
          publishedOn: product.created_at
            ? new Date(product.created_at).toLocaleString()
            : "-",
        }));
        setProducts(mappedProducts);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch products. Please try again.");
        setLoading(false);
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  // Extract unique categories and vendors
  const uniqueCategories = [
    ...new Set(products.flatMap((product) => product.category)),
  ].sort();
  const uniqueVendors = [
    ...new Set(products.map((product) => product.brand).filter(Boolean)),
  ].sort();

  // Filter products
  const filteredProducts = products.filter((product) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(searchLower) ||
      product.id.toString().includes(searchLower) ||
      product.category.some((cat) => cat.toLowerCase().includes(searchLower)) ||
      product.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
      product.brand.toLowerCase().includes(searchLower) ||
      product.price.toString().includes(searchLower) ||
      product.publishedOn.toLowerCase().includes(searchLower);

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "published" && product.active === 1) ||
      (filterStatus === "drafts" && product.active === 0) ||
      (filterStatus === "onDiscount" && product.price < 50);

    const matchesCategory =
      !selectedCategory || product.category.includes(selectedCategory);

    const matchesVendor = !selectedVendor || product.brand === selectedVendor;

    return matchesSearch && matchesStatus && matchesCategory && matchesVendor;
  });

  // Sort products
  const sortProducts = (products, key, direction) => {
    return [...products].sort((a, b) => {
      if (key === "price" || key === "qty") {
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

  const sortedProducts = sortConfig.key
    ? sortProducts(filteredProducts, sortConfig.key, sortConfig.direction)
    : filteredProducts;

  // Pagination
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
      alert("Please select at least one product to export.");
      return;
    }

    const productsToExport = products.filter((product) =>
      selectedProducts.includes(product.id)
    );

    const csvData = [
      [
        "Product ID",
        "Name",
        "Brand",
        "Category",
        "Price",
        "Tags",
        "Published On",
      ],
      ...productsToExport.map((product) => [
        product.id,
        product.name,
        product.brand,
        product.category.join(", "),
        `$${product.price.toFixed(2)}`,
        product.tags.join(", "),
        product.publishedOn,
      ]),
    ];

    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "selected_products_export.csv");
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

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
    setSelectedProducts([]);
  };

  const handleVendorChange = (e) => {
    setSelectedVendor(e.target.value);
    setCurrentPage(1);
    setSelectedProducts([]);
  };

  const handleView = (id) => {
    navigate(`/product/view/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/product/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/products/${id}`);
      setProducts(products.filter((product) => product.id !== id));
      setSelectedProducts(selectedProducts.filter((pid) => pid !== id));
      alert("Product deleted successfully!");
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product. Please try again.");
    }
  };

  if (loading) {
    return (
      <LayoutAdmin>
        <div className="p-6 text-center">Loading products...</div>
      </LayoutAdmin>
    );
  }

  if (error) {
    return (
      <LayoutAdmin>
        <div className="p-6 text-center text-red-500">{error}</div>
      </LayoutAdmin>
    );
  }

  return (
    <LayoutAdmin>
      <div className="m-[0_0_50px_0] border-b-1 border-gray-200">
        <div className="px-6 py-2 bg-gray-100 text-gray-800">
          <h2 className="text-2xl font-bold mb-4">Products</h2>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <button
              onClick={() => handleFilterStatus("all")}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filterStatus === "all"
                  ? "bg-blue-100 text-blue-800"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              All ({products.length})
            </button>
            <button
              onClick={() => handleFilterStatus("published")}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filterStatus === "published"
                  ? "bg-blue-100 text-blue-800"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              Published ({products.filter((p) => p.active === 1).length})
            </button>
            <button
              onClick={() => handleFilterStatus("drafts")}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filterStatus === "drafts"
                  ? "bg-blue-100 text-blue-800"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              Drafts ({products.filter((p) => p.active === 0).length})
            </button>
            <button
              onClick={() => handleFilterStatus("onDiscount")}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filterStatus === "onDiscount"
                  ? "bg-blue-100 text-blue-800"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              On discount ({products.filter((p) => p.price < 50).length})
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <CiSearch className="text-gray-500 mr-2" size={20} />
              <input
                className="border-none outline-none w-64 sm:w-80 text-sm"
                type="text"
                placeholder="Search products"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <select
              className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">All Categories</option>
              {uniqueCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select
              className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600"
              value={selectedVendor}
              onChange={handleVendorChange}
            >
              <option value="">All Vendors</option>
              {uniqueVendors.map((vendor) => (
                <option key={vendor} value={vendor}>
                  {vendor}
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
                to="/product/create"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 py-2 text-sm flex items-center gap-1"
              >
                <IoAddSharp size={16} /> Add product
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
                    onClick={() => sortData("name")}
                  >
                    Product Name {getSortIndicator("name")}
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                    onClick={() => sortData("price")}
                  >
                    Price {getSortIndicator("price")}
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                    onClick={() => sortData("qty")}
                  >
                    Quantity {getSortIndicator("qty")}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase">
                    Category
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                    onClick={() => sortData("brand")}
                  >
                    Brand {getSortIndicator("brand")}
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
                  currentProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 rounded border-gray-300"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleSelectProduct(product.id)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            className="w-10 h-10 object-cover rounded"
                            src={product.image}
                            alt={product.name}
                            onError={(e) => (e.target.src = "https://picsum.photos/200")}
                          />
                          <span className="text-sm text-gray-800">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                      ${parseFloat(product.price || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {product.qty}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {product.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {product.brand}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {product.publishedOn}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleView(product.id)}
                            className="p-2 rounded-full hover:bg-blue-100 transition"
                            title="View Product"
                          >
                            <FaRegEye className="text-blue-600" size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(product.id)}
                            className="p-2 rounded-full hover:bg-yellow-100 transition"
                            title="Edit Product"
                          >
                            <CiEdit className="text-yellow-600" size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 rounded-full hover:bg-red-100 transition"
                            title="Delete Product"
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
                    <td colSpan="8" className="text-center py-4 text-gray-500">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {!showAllProducts && (
              <div className="flex justify-between items-center p-4">
                <div className="text-sm text-gray-600">
                  {filteredProducts.length > 0
                    ? `Showing ${
                        indexOfFirstProduct + 1
                      } to ${Math.min(
                        indexOfLastProduct,
                        filteredProducts.length
                      )} of ${filteredProducts.length}`
                    : "No products found"}
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

export default Product;