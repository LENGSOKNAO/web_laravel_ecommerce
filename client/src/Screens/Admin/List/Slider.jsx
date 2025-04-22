import LayoutAdmin from "../../../Layouts/LayoutAdmin";
import { CiEdit, CiExport, CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";
import { IoAddSharp } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";

const Slider = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedSliders, setSelectedSliders] = useState([]);
  const slidersPerPage = 10;

  // Log VITE_STORAGE_URL for debugging
  console.log("Storage URL:", import.meta.env.VITE_STORAGE_URL);

  // Fetch sliders on mount
  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/sliders`,
          {
            headers: { "X-API-KEY": import.meta.env.VITE_API_KEY },
          }
        );
        console.log("API Response:", response.data); // Debug API response
        setSliders(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch sliders.");
        setLoading(false);
        console.error("Error fetching sliders:", err);
      }
    };
    fetchSliders();
  }, []);

  // Filter sliders
  const filteredSliders = sliders.filter((slider) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      slider.name?.toLowerCase().includes(searchLower) ||
      false ||
      slider.description?.toLowerCase().includes(searchLower) ||
      false ||
      slider.category?.toLowerCase().includes(searchLower) ||
      false ||
      slider.brand?.toLowerCase().includes(searchLower) ||
      false ||
      (slider.date &&
        format(new Date(slider.date), "MMM dd, yyyy")
          .toLowerCase()
          .includes(searchLower));

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "published" && slider.status === 1) ||
      (filterStatus === "drafts" && slider.status === 0);

    return matchesSearch && matchesStatus;
  });

  // Sort sliders
  const sortSliders = (sliders, key, direction) => {
    return [...sliders].sort((a, b) => {
      if (key === "date") {
        const dateA = a[key] ? new Date(a[key]) : new Date(0);
        const dateB = b[key] ? new Date(b[key]) : new Date(0);
        return direction === "ascending" ? dateA - dateB : dateB - dateA;
      }
      const valueA = a[key] ? a[key].toString().toLowerCase() : "";
      const valueB = b[key] ? b[key].toString().toLowerCase() : "";
      return direction === "ascending"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  };

  const sortedSliders = sortConfig.key
    ? sortSliders(filteredSliders, sortConfig.key, sortConfig.direction)
    : filteredSliders;

  // Pagination
  const indexOfLastSlider = currentPage * slidersPerPage;
  const indexOfFirstSlider = indexOfLastSlider - slidersPerPage;
  const currentSliders = sortedSliders.slice(
    indexOfFirstSlider,
    indexOfLastSlider
  );
  const totalPages = Math.ceil(filteredSliders.length / slidersPerPage);

  // Handlers
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
    setSelectedSliders([]);
  };

  const handleFilterStatus = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
    setSelectedSliders([]);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const currentSliderIds = currentSliders.map((slider) => slider.id);
      setSelectedSliders(currentSliderIds);
    } else {
      setSelectedSliders([]);
    }
  };

  const handleSelectSlider = (sliderId) => {
    setSelectedSliders((prev) =>
      prev.includes(sliderId)
        ? prev.filter((id) => id !== sliderId)
        : [...prev, sliderId]
    );
  };

  const handleExport = () => {
    if (selectedSliders.length === 0) {
      alert("Please select at least one slider to export.");
      return;
    }

    const slidersToExport = sliders.filter((slider) =>
      selectedSliders.includes(slider.id)
    );

    const csvData = [
      ["ID", "Name", "Category", "Brand", "Date", "Status"],
      ...slidersToExport.map((slider) => [
        slider.id,
        slider.name || "-",
        slider.category || "-",
        slider.brand || "-",
        slider.date ? format(new Date(slider.date), "MMM dd, yyyy") : "-",
        slider.status ? "Active" : "Inactive",
      ]),
    ];

    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "selected_sliders_export.csv");
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
    setSelectedSliders([]);
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
      setSelectedSliders([]);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setSelectedSliders([]);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this slider?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/sliders/${id}`, {
          headers: { "X-API-KEY": import.meta.env.VITE_API_KEY },
        });
        setSliders(sliders.filter((slider) => slider.id !== id));
        alert("Slider deleted successfully!");
      } catch (err) {
        console.error("Error deleting slider:", err);
        alert("Failed to delete slider. Please try again.");
      }
    }
  };

  return (
    <LayoutAdmin>
      <div className="m-[0_0_50px_0] border-b border-gray-200">
        <div className="px-6 py-2 bg-gray-100 text-gray-800">
          <h2 className="text-2xl font-bold mb-4">Slider Management</h2>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <button
              onClick={() => handleFilterStatus("all")}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filterStatus === "all"
                  ? "bg-blue-100 text-blue-800"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              All ({sliders.length})
            </button>
            <button
              onClick={() => handleFilterStatus("published")}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filterStatus === "published"
                  ? "bg-blue-100 text-blue-800"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              Published ({sliders.filter((s) => s.status === 1).length})
            </button>
            <button
              onClick={() => handleFilterStatus("drafts")}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filterStatus === "drafts"
                  ? "bg-blue-100 text-blue-800"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              Drafts ({sliders.filter((s) => s.status === 0).length})
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <CiSearch className="text-gray-500 mr-2" size={20} />
              <input
                className="border-none outline-none w-64 sm:w-80 text-sm"
                type="text"
                placeholder="Search sliders"
                value={searchTerm}
                onChange={handleSearch}
                disabled={loading}
              />
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={handleExport}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 flex items-center gap-1"
                disabled={loading}
              >
                <CiExport size={16} /> Export
              </button>
              <Link
                to="/slider/create"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 py-2 text-sm flex items-center gap-1"
              >
                <IoAddSharp size={16} /> Add Slider
              </Link>
            </div>
          </div>
        </div>
        <div className="flex justify-center bg-white border-t border-gray-200">
          <div className="w-[98%] overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                Loading sliders...
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">{error}</div>
            ) : (
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 rounded border-gray-300"
                        checked={
                          currentSliders.length > 0 &&
                          currentSliders.every((slider) =>
                            selectedSliders.includes(slider.id)
                          )
                        }
                        onChange={handleSelectAll}
                        disabled={loading}
                      />
                    </th>
                    <th
                      className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => sortData("name")}
                    >
                      Slider Name {getSortIndicator("name")}
                    </th>
                    <th
                      className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => sortData("category")}
                    >
                      Category {getSortIndicator("category")}
                    </th>
                    <th
                      className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => sortData("brand")}
                    >
                      Brand {getSortIndicator("brand")}
                    </th>
                    <th
                      className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => sortData("date")}
                    >
                      Date {getSortIndicator("date")}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentSliders.length > 0 ? (
                    currentSliders.map((slider) => (
                      <tr
                        key={slider.id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 rounded border-gray-300"
                            checked={selectedSliders.includes(slider.id)}
                            onChange={() => handleSelectSlider(slider.id)}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {slider.image &&
                            import.meta.env.VITE_STORAGE_URL ? (
                              <img
                                className="w-10 h-10 object-cover rounded"
                                src={`${import.meta.env.VITE_STORAGE_URL}/${
                                  slider.image
                                }`}
                                alt={slider.name || "Slider"}
                                onError={(e) => {
                                  console.error(
                                    `Failed to load image: ${e.target.src}`
                                  );
                                  e.target.src =
                                    "https://via.placeholder.com/40";
                                }}
                                onLoad={() =>
                                  console.log(`Loaded image: ${slider.image}`)
                                }
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                                <span className="text-gray-500 text-xs">
                                  {slider.image
                                    ? "Storage URL Missing"
                                    : "No Image"}
                                </span>
                              </div>
                            )}
                            <span className="text-sm text-gray-800">
                              {slider.name || "-"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          {slider.category || "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          {slider.brand || "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          {slider.date
                            ? format(new Date(slider.date), "MMM dd, yyyy")
                            : "-"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              slider.status
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {slider.status ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center gap-2">
                            <Link
                              to={`/slider/view/${slider.id}`}
                              className="p-2 rounded-full hover:bg-blue-100 transition"
                              title="View Slider"
                            >
                              <FaRegEye className="text-blue-600" size={16} />
                            </Link>
                            <Link
                              to={`/slider/edit/${slider.id}`}
                              className="p-2 rounded-full hover:bg-yellow-100 transition"
                              title="Edit Slider"
                            >
                              <CiEdit className="text-yellow-600" size={16} />
                            </Link>
                            <button
                              onClick={() => handleDelete(slider.id)}
                              className="p-2 rounded-full hover:bg-red-100 transition"
                              title="Delete Slider"
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
                        colSpan="7"
                        className="text-center py-4 text-gray-500"
                      >
                        No sliders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
            {!loading && (
              <div className="flex justify-between items-center p-4">
                <div className="text-sm text-gray-600">
                  {filteredSliders.length > 0
                    ? `Showing ${indexOfFirstSlider + 1} to ${Math.min(
                        indexOfLastSlider,
                        filteredSliders.length
                      )} of ${filteredSliders.length}`
                    : "No sliders found"}
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

export default Slider;
