import React, { useState, useEffect } from "react";
import LayoutAdmin from "../../../Layouts/LayoutAdmin";
import { CiEdit, CiExport, CiSearch } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { IoAddSharp } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import axios from "axios";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAllBanners, setShowAllBanners] = useState(false);
  const [selectedBanners, setSelectedBanners] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const bannersPerPage = 10;
  const navigate = useNavigate();

  // Fetch banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/banners`,
          {
            headers: {
              "X-API-KEY": import.meta.env.VITE_API_KEY,
            },
          }
        );
        setBanners(response.data.banners || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch banners. Please try again.");
        setLoading(false);
        console.error(err);
      }
    };
    fetchBanners();
  }, []);

  // Get unique categories and brands
  const uniqueCategories = [
    ...new Set(banners.map((banner) => banner.category).filter(Boolean)),
  ].sort();
  const uniqueBrands = [
    ...new Set(banners.map((banner) => banner.brand).filter(Boolean)),
  ].sort();

  // Filter banners
  const filteredBanners = banners.filter((banner) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (banner.name || "").toLowerCase().includes(searchLower) ||
      (banner.id || "").toString().includes(searchLower) ||
      (banner.category || "").toLowerCase().includes(searchLower) ||
      (banner.brand || "").toLowerCase().includes(searchLower) ||
      (banner.created_at || "").toLowerCase().includes(searchLower);

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "published" && banner.status === 1) ||
      (filterStatus === "drafts" && banner.status === 0);

    const matchesCategory =
      !selectedCategory || banner.category === selectedCategory;
    const matchesBrand = !selectedBrand || banner.brand === selectedBrand;

    return matchesSearch && matchesStatus && matchesCategory && matchesBrand;
  });

  // Sort banners
  const sortBanners = (banners, key, direction) => {
    return [...banners].sort((a, b) => {
      if (key === "qty") {
        const valueA = a[key] || 0;
        const valueB = b[key] || 0;
        return direction === "ascending" ? valueA - valueB : valueB - valueA;
      } else {
        const valueA = a[key] ? a[key].toString().toLowerCase() : "";
        const valueB = b[key] ? b[key].toString().toLowerCase() : "";
        return direction === "ascending"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
    });
  };

  const sortedBanners = sortConfig.key
    ? sortBanners(filteredBanners, sortConfig.key, sortConfig.direction)
    : filteredBanners;

  // Pagination
  const indexOfLastBanner = currentPage * bannersPerPage;
  const indexOfFirstBanner = indexOfLastBanner - bannersPerPage;
  const currentBanners =
    showAllBanners && filterStatus === "all"
      ? sortedBanners
      : sortedBanners.slice(indexOfFirstBanner, indexOfLastBanner);
  const totalPages = Math.ceil(filteredBanners.length / bannersPerPage);

  // Handlers
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
    setSelectedBanners([]);
  };

  const handleFilterStatus = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
    setShowAllBanners(status === "all");
    setSelectedBanners([]);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const currentBannerIds = currentBanners.map((banner) => banner.id);
      setSelectedBanners(currentBannerIds);
    } else {
      setSelectedBanners([]);
    }
  };

  const handleSelectBanner = (bannerId) => {
    setSelectedBanners((prev) =>
      prev.includes(bannerId)
        ? prev.filter((id) => id !== bannerId)
        : [...prev, bannerId]
    );
  };

  const handleExport = () => {
    if (selectedBanners.length === 0) {
      alert("Please select at least one banner to export.");
      return;
    }

    const bannersToExport = banners.filter((banner) =>
      selectedBanners.includes(banner.id)
    );
    const csvData = [
      ["ID", "Name", "Brand", "Category", "Qty", "Status", "Published On"],
      ...bannersToExport.map((banner) => [
        banner.id,
        banner.name || "N/A",
        banner.brand || "N/A",
        banner.category || "N/A",
        banner.qty || "0",
        banner.status === null ? "N/A" : banner.status ? "Published" : "Draft",
        banner.created_at || "N/A",
      ]),
    ];

    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "selected_banners_export.csv");
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
    setSelectedBanners([]);
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
      setSelectedBanners([]);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setSelectedBanners([]);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
    setSelectedBanners([]);
  };

  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
    setCurrentPage(1);
    setSelectedBanners([]);
  };

  const handleViewBanner = (id) => {
    navigate(`/banner/${id}`);
  };

  const handleEditBanner = (id) => {
    navigate(`/banner/edit/${id}`);
  };

  const handleDeleteBanner = async (id) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/banners/${id}`, {
        headers: {
          "X-API-KEY": import.meta.env.VITE_API_KEY,
        },
      });
      setBanners((prev) => prev.filter((banner) => banner.id !== id));
      setSelectedBanners((prev) => prev.filter((bannerId) => bannerId !== id));
      alert("Banner deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete banner. Please try again.");
    }
  };

  if (loading) {
    return (
      <LayoutAdmin>
        <div className="p-6 text-center">Loading banners...</div>
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
          <h2 className="text-2xl font-bold mb-4">Management Banner</h2>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <button
              onClick={() => handleFilterStatus("all")}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filterStatus === "all"
                  ? "bg-blue-100 text-blue-800"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              All ({banners.length})
            </button>
            <button
              onClick={() => handleFilterStatus("published")}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filterStatus === "published"
                  ? "bg-blue-100 text-blue-800"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              Published ({banners.filter((b) => b.status === 1).length})
            </button>
            <button
              onClick={() => handleFilterStatus("drafts")}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filterStatus === "drafts"
                  ? "bg-blue-100 text-blue-800"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              Drafts ({banners.filter((b) => b.status === 0).length})
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <CiSearch className="text-gray-500 mr-2" size={20} />
              <input
                className="border-none outline-none w-64 sm:w-80 text-sm"
                type="text"
                placeholder="Search banners"
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
              value={selectedBrand}
              onChange={handleBrandChange}
            >
              <option value="">All Brands</option>
              {uniqueBrands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
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
                to="/banner/create"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 py-2 text-sm flex items-center gap-1"
              >
                <IoAddSharp size={16} /> Add banner
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
                        currentBanners.length > 0 &&
                        currentBanners.every((banner) =>
                          selectedBanners.includes(banner.id)
                        )
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                    onClick={() => sortData("name")}
                  >
                    Banner Name {getSortIndicator("name")}
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
                    onClick={() => sortData("created_at")}
                  >
                    Published On {getSortIndicator("created_at")}
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentBanners.length > 0 ? (
                  currentBanners.map((banner) => (
                    <tr
                      key={banner.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 rounded border-gray-300"
                          checked={selectedBanners.includes(banner.id)}
                          onChange={() => handleSelectBanner(banner.id)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            className="w-10 h-10 object-cover rounded"
                            src={
                              banner.image
                                ? `${import.meta.env.VITE_BASE_URL}/storage/${
                                    banner.image
                                  }`
                                : "https://via.placeholder.com/40"
                            }
                            alt={banner.name || "Banner"}
                          />
                          <span className="text-sm text-gray-800">
                            {banner.name || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {banner.category || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {banner.brand || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {banner.created_at
                          ? new Date(banner.created_at).toLocaleString()
                          : "N/A"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleViewBanner(banner.id)}
                            className="p-2 rounded-full hover:bg-blue-100 transition"
                            title="View Banner"
                          >
                            <FaRegEye className="text-blue-600" size={16} />
                          </button>
                          <button
                            onClick={() => handleEditBanner(banner.id)}
                            className="p-2 rounded-full hover:bg-yellow-100 transition"
                            title="Edit Banner"
                          >
                            <CiEdit className="text-yellow-600" size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteBanner(banner.id)}
                            className="p-2 rounded-full hover:bg-red-100 transition"
                            title="Delete Banner"
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
                    <td colSpan="6" className="text-center py-4 text-gray-500">
                      No banners found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {!showAllBanners && (
              <div className="flex justify-between items-center p-4">
                <div className="text-sm text-gray-600">
                  {filteredBanners.length > 0
                    ? `1 to ${Math.min(10, filteredBanners.length)} of ${
                        filteredBanners.length
                      }`
                    : "No banners found"}
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

export default Banner;
