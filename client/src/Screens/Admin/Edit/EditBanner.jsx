import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import LayoutAdmin from "../../../Layouts/LayoutAdmin";
import Select from "react-select";
import axios from "axios";

const EditBanner = () => {
  const { id } = useParams();
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayImage, setDisplayImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isActive, setIsActive] = useState(null);
  const nav = useNavigate();
  const [bannerData, setBannerData] = useState({
    name: "",
    description: "",
    date: "",
    qty: "",
  });
  const [errors, setErrors] = useState({});

  const categoryOptions = [
    { value: "new-arrivals", label: "New Arrivals" },
    { value: "iphone", label: "iPhone" },
    { value: "ipad", label: "iPad" },
    { value: "watch", label: "Watch" },
    { value: "airpods", label: "AirPods" },
    { value: "tv-home", label: "TV & Home" },
    { value: "all-shop", label: "All Shop" },
    { value: "galaxy-phones", label: "Galaxy Phones" },
    { value: "galaxy-tablets", label: "Galaxy Tablets" },
    { value: "galaxy-watch", label: "Galaxy Watch" },
    { value: "galaxy-buds", label: "Galaxy Buds" },
    { value: "tv-audio", label: "TV & Audio" },
    { value: "mi-phones", label: "Mi Phones" },
    { value: "redmi-phones", label: "Redmi Phones" },
    { value: "smartwatches", label: "Smartwatches" },
    { value: "earbuds", label: "Earbuds" },
    { value: "tablets", label: "Tablets" },
    { value: "find-series", label: "Find Series" },
    { value: "reno-series", label: "Reno Series" },
    { value: "number-series", label: "Number Series" },
    { value: "nord-series", label: "Nord Series" },
    { value: "apparel", label: "Apparel" },
    { value: "accessories", label: "Accessories" },
    { value: "sale", label: "Sale" },
    { value: "basketball", label: "Basketball" },
    { value: "running-shoes", label: "Running Shoes" },
    { value: "golf", label: "Golf" },
    { value: "trending", label: "Trending" },
    { value: "training", label: "Training" },
    { value: "more-sport", label: "More Sport" },
    { value: "motorsport", label: "Motorsport" },
    { value: "soccer", label: "Soccer" },
    { value: "electric-vehicles", label: "Electric Vehicles" },
    { value: "charging-solutions", label: "Charging Solutions" },
    { value: "vehicles", label: "Vehicles" },
    { value: "performance-parts", label: "Performance Parts" },
    { value: "luxury-accessories", label: "Luxury Accessories" },
    { value: "parts", label: "Parts" },
    { value: "hybrid-models", label: "Hybrid Models" },
    { value: "trucks", label: "Trucks" },
    { value: "watches", label: "Watches" },
    { value: "jewelry", label: "Jewelry" },
    { value: "luxury-collections", label: "Luxury Collections" },
    { value: "love-collection", label: "Love Collection" },
    { value: "engagement", label: "Engagement" },
    { value: "complications", label: "Complications" },
    { value: "charms", label: "Charms" },
    { value: "bracelets", label: "Bracelets" },
    { value: "dog-gear", label: "Dog Gear" },
    { value: "grooming", label: "Grooming" },
    { value: "harnesses", label: "Harnesses" },
    { value: "health-wellness", label: "Health & Wellness" },
    { value: "jordan", label: "Jordan" },
    { value: "kids", label: "Kids" },
    { value: "leashes", label: "Leashes" },
    { value: "men", label: "Men" },
    { value: "pet-food", label: "Pet Food" },
    { value: "pharmacy", label: "Pharmacy" },
    { value: "running", label: "Running" },
    { value: "shoes", label: "Shoes" },
    { value: "trail", label: "Trail" },
    { value: "travel-gear", label: "Travel Gear" },
    { value: "women", label: "Women" },
  ];

  const brandOptions = [
    { value: "nike", label: "Nike" },
    { value: "adidas", label: "Adidas" },
    { value: "puma", label: "Puma" },
    { value: "under_armour", label: "Under Armour" },
    { value: "apple", label: "Apple" },
    { value: "samsung", label: "Samsung" },
    { value: "xiaomi", label: "Xiaomi" },
    { value: "oppo", label: "Oppo" },
    { value: "oneplus", label: "OnePlus" },
    { value: "anta", label: "Anta" },
    { value: "newbalance", label: "NewBalance" },
    { value: "salomon", label: "Salomon" },
    { value: "tesla", label: "Tesla" },
    { value: "bmw", label: "BMW" },
    { value: "mercedes_benz", label: "Mercedes-Benz" },
    { value: "toyota", label: "Toyota" },
    { value: "ford", label: "Ford" },
    { value: "petsmart", label: "PetSmart" },
    { value: "petco", label: "Petco" },
    { value: "chewy", label: "Chewy" },
    { value: "ruffwear", label: "Ruffwear" },
    { value: "kurgo", label: "Kurgo" },
    { value: "rolex", label: "Rolex" },
    { value: "cartier", label: "Cartier" },
    { value: "tiffany_and_co", label: "Tiffany & Co." },
    { value: "patek_philippe", label: "Patek Philippe" },
    { value: "pandora", label: "Pandora" },
  ];

  // Fetch banner data
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/banners/${id}`,
          {
            headers: {
              "X-API-KEY": import.meta.env.VITE_API_KEY,
            },
          }
        );
        const banner = response.data.banner;
        setBanner(banner);
        setBannerData({
          name: banner.name || "",
          description: banner.description || "",
          date: banner.date
            ? new Date(banner.date).toISOString().split("T")[0]
            : "",
          qty: banner.qty || "",
        });
        setSelectedCategory(
          banner.category
            ? categoryOptions.find((opt) => opt.value === banner.category) ||
                null
            : null
        );
        setSelectedBrand(
          banner.brand
            ? brandOptions.find((opt) => opt.value === banner.brand) || null
            : null
        );
        setIsActive(banner.status);
        if (banner.image) {
          setDisplayImage({
            preview: `${import.meta.env.VITE_BASE_URL}/storage/${banner.image}`,
            existing: true,
          });
        }
        if (banner.small_image) {
          setGalleryImages([
            {
              preview: `${import.meta.env.VITE_BASE_URL}/storage/${
                banner.small_image
              }`,
              existing: true,
            },
          ]);
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch banner. Please try again.");
        setLoading(false);
        console.error("Error fetching banner:", err);
      }
    };
    fetchBanner();
  }, [id]);

  // Custom select components
  const formatOptionLabel = ({ label, icon }) => (
    <div className="flex items-center">
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </div>
  );

  // Custom select styles
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "46px",
      borderRadius: "8px",
      borderColor: state.isFocused ? "#0d9488" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(13, 148, 136, 0.2)" : "none",
      "&:hover": { borderColor: "#0d9488" },
      backgroundColor: "white",
      fontSize: "14px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#0d9488"
        : state.isFocused
        ? "#ccfbf1"
        : "white",
      color: state.isSelected ? "white" : "#111827",
      fontSize: "14px",
      "&:active": { backgroundColor: "#0d9488", color: "white" },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#ccfbf1",
      borderRadius: "6px",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#0d9488",
      fontWeight: "600",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#0d9488",
      "&:hover": { backgroundColor: "#99f6e4", color: "#0a7468" },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    }),
  };

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBannerData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDisplayImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDisplayImage({
        file,
        preview: URL.createObjectURL(file),
        existing: false,
      });
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      existing: false,
    }));
    setGalleryImages((prev) => [...prev, ...files].slice(0, 1)); // Limit to one small image
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDisplayImageDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) {
      setDisplayImage({
        file,
        preview: URL.createObjectURL(file),
        existing: false,
      });
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleGalleryImagesDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        existing: false,
      }));
    setGalleryImages((prev) => [...prev, ...files].slice(0, 1));
  };

  const removeDisplayImage = () => {
    if (displayImage) {
      if (!displayImage.existing) {
        URL.revokeObjectURL(displayImage.preview);
      }
      setDisplayImage(null);
    }
  };

  const removeGalleryImage = (index) => {
    setGalleryImages((prev) => {
      const updated = [...prev];
      if (!updated[index].existing) {
        URL.revokeObjectURL(updated[index].preview);
      }
      updated.splice(index, 1);
      return updated;
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData();
    if (bannerData.name) formData.append("name", bannerData.name);
    if (bannerData.description)
      formData.append("description", bannerData.description);
    if (displayImage && !displayImage.existing) {
      formData.append("image", displayImage.file);
    }
    if (galleryImages.length > 0 && !galleryImages[0].existing) {
      formData.append("small_image", galleryImages[0].file);
    }
    if (selectedCategory) formData.append("category", selectedCategory.value);
    if (selectedBrand) formData.append("brand", selectedBrand.value);
    if (bannerData.date) formData.append("date", bannerData.date);
    if (bannerData.qty) formData.append("qty", bannerData.qty);
    if (isActive !== null) formData.append("status", isActive ? 1 : 0);
    formData.append("_method", "PUT"); // Laravel expects _method for PUT requests

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/banners/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-API-KEY": import.meta.env.VITE_API_KEY,
          },
        }
      );
      console.log("Banner updated:", response.data);

      nav("/banner/list");
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Error updating banner:", error);
        alert("Failed to update banner. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <LayoutAdmin>
        <div className="p-6 text-center">Loading banner...</div>
      </LayoutAdmin>
    );
  }

  if (error || !banner) {
    return (
      <LayoutAdmin>
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-red-50 rounded-xl p-6 text-center">
            <h3 className="mt-3 text-lg font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error || "Banner not found"}</p>
            </div>
            <div className="mt-5">
              <Link
                to="/admin/banners"
                className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500"
              >
                Back to Banners
              </Link>
            </div>
          </div>
        </div>
      </LayoutAdmin>
    );
  }

  return (
    <LayoutAdmin>
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Form Header */}
          <div className="mb-10">
            <Link
              to="/admin/banners"
              className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              Back to banners
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">
              Edit Banner
            </h1>
            <p className="mt-2 text-base text-gray-600">
              Update the details for the banner
            </p>
          </div>

          {/* Main Form */}
          <div className="bg-white rounded-xl border border-gray-200">
            <form onSubmit={handleSubmit}>
              {/* Basic Information Section */}
              <div className="p-8 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Banner Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={bannerData.name}
                      onChange={handleInputChange}
                      placeholder="Banner Title"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={bannerData.date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                    />
                    {errors.date && (
                      <p className="mt-2 text-sm text-red-500">{errors.date}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={bannerData.description}
                      onChange={handleInputChange}
                      rows={5}
                      placeholder="Banner description..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                    />
                    {errors.description && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Categories Brand & Status Section */}
              <div className="p-8 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Category, Brand & Status
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <Select
                      options={categoryOptions}
                      value={selectedCategory}
                      onChange={setSelectedCategory}
                      formatOptionLabel={formatOptionLabel}
                      placeholder="Select Category..."
                      styles={customSelectStyles}
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                    {errors.category && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.category}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand
                    </label>
                    <Select
                      options={brandOptions}
                      value={selectedBrand}
                      onChange={setSelectedBrand}
                      formatOptionLabel={formatOptionLabel}
                      placeholder="Select brand..."
                      styles={customSelectStyles}
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                    {errors.brand && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.brand}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="qty"
                      value={bannerData.qty}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                    />
                    {errors.qty && (
                      <p className="mt-2 text-sm text-red-500">{errors.qty}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Banner Status
                      </label>
                      <p className="text-sm text-gray-500">
                        Enable to make banner visible
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setIsActive(
                          isActive === null ? true : isActive ? false : null
                        )
                      }
                      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                        isActive === null
                          ? "bg-gray-200"
                          : isActive
                          ? "bg-teal-600"
                          : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 rounded-full bg-white transform transition-transform ${
                          isActive === null
                            ? "translate-x-3"
                            : isActive
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Images Section */}
              <div className="p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Banner Images
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Display Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Image
                    </label>
                    <div
                      className={`mt-2 flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-colors ${
                        isDragging
                          ? "border-teal-500 bg-teal-50"
                          : errors.image
                          ? "border-red-500"
                          : "border-gray-300"
                      } ${displayImage ? "p-3" : "p-6"}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDisplayImageDrop}
                    >
                      {displayImage ? (
                        <div className="relative w-full">
                          <img
                            src={displayImage.preview}
                            alt="Preview"
                            className="w-full h-48 object-contain rounded-md"
                          />
                          <button
                            type="button"
                            onClick={removeDisplayImage}
                            className="absolute top-2 right-2 p-1.5 bg-white rounded-full border border-gray-300 text-gray-600 hover:text-red-500 hover:border-red-500 transition-colors"
                          >
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                          {displayImage.file && (
                            <div className="mt-2 text-sm text-gray-500 text-center">
                              {displayImage.file.name} (
                              {formatFileSize(displayImage.file.size)})
                            </div>
                          )}
                        </div>
                      ) : (
                        <>
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          <div className="mt-2 flex text-sm text-gray-600">
                            <label className="relative cursor-pointer font-medium text-teal-600 hover:text-teal-500 transition-colors">
                              <span>Upload a file</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleDisplayImageChange}
                                className="sr-only"
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="mt-2 text-sm text-gray-500">
                            PNG, JPG, GIF up to 2MB
                          </p>
                        </>
                      )}
                    </div>
                    {errors.image && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.image}
                      </p>
                    )}
                  </div>

                  {/* Small Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Small Image
                    </label>
                    <div
                      className={`mt-2 flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-colors ${
                        isDragging
                          ? "border-teal-500 bg-teal-50"
                          : errors.small_image
                          ? "border-red-500"
                          : "border-gray-300"
                      } ${galleryImages.length > 0 ? "p-3" : "p-6"}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleGalleryImagesDrop}
                    >
                      {galleryImages.length > 0 ? (
                        <div className="w-full">
                          <div className="grid grid-cols-1 gap-3">
                            {galleryImages.map((image, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={image.preview}
                                  alt="Preview"
                                  className="h-24 w-full object-cover rounded-md"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeGalleryImage(index)}
                                  className="absolute top-1 right-1 p-1 bg-white rounded-full border border-gray-300 text-gray-600 hover:text-red-500 hover:border-red-500 transition-colors"
                                >
                                  <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                          {galleryImages[0].file && (
                            <p className="mt-2 text-sm text-gray-500 text-center">
                              {galleryImages[0].file.name} (
                              {formatFileSize(galleryImages[0].file.size)})
                            </p>
                          )}
                        </div>
                      ) : (
                        <>
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          <div className="mt-2 flex text-sm text-gray-600">
                            <label className="relative cursor-pointer font-medium text-teal-600 hover:text-teal-500 transition-colors">
                              <span>Upload a file</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleGalleryImagesChange}
                                className="sr-only"
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="mt-2 text-sm text-gray-500">
                            PNG, JPG, GIF up to 2MB
                          </p>
                        </>
                      )}
                    </div>
                    {errors.small_image && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.small_image}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="p-8 flex justify-end gap-4">
                <Link
                  to="/admin/banners"
                  className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="px-6 py-3 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
                >
                  Update Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default EditBanner;
