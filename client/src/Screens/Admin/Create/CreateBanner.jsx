
import React, { useState } from "react";
import LayoutAdmin from "../../../Layouts/LayoutAdmin";
import Select from "react-select";
import axios from "axios";

const CreateBanner = () => {
  // State management
  const [displayImage, setDisplayImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [bannerData, setBannerData] = useState({
    name: "",
    description: "",
    date: "",
    qty: "",
  });
  const [errors, setErrors] = useState({});

  // Options data
  const categoryOptions = [
    { value: "electronics", label: "Electronics" },
    { value: "clothing", label: "Clothing" },
    { value: "accessories", label: "Accessories" },
    { value: "furniture", label: "Furniture" },
  ];

  const brandOptions = [
    { value: "nike", label: "Nike", icon: "👟" },
    { value: "adidas", label: "Adidas", icon: "🧢" },
    { value: "puma", label: "Puma", icon: "🐆" },
    { value: "under_armour", label: "Under Armour", icon: "🦾" },
  ];

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

  const validateForm = () => {
    const newErrors = {};
    if (!bannerData.name) newErrors.name = "Banner name is required";
    if (!displayImage) newErrors.image = "Display image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDisplayImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDisplayImage({ file, preview: URL.createObjectURL(file) });
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
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
      setDisplayImage({ file, preview: URL.createObjectURL(file) });
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleGalleryImagesDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({ file, preview: URL.createObjectURL(file) }));
    setGalleryImages((prev) => [...prev, ...files].slice(0, 1)); // Limit to one small image
  };

  const removeDisplayImage = () => {
    if (displayImage) {
      URL.revokeObjectURL(displayImage.preview);
      setDisplayImage(null);
    }
  };

  const removeGalleryImage = (index) => {
    setGalleryImages((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
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
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("name", bannerData.name);
    formData.append("description", bannerData.description);
    if (displayImage) formData.append("image", displayImage.file);
    if (galleryImages.length > 0) {
      formData.append("small_image", galleryImages[0].file);
    }
    formData.append("category", selectedCategory ? selectedCategory.value : "");
    formData.append("brand", selectedBrand ? selectedBrand.value : "");
    formData.append("date", bannerData.date);
    formData.append("qty", bannerData.qty);
    formData.append("status", isActive ? 1 : 0);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/banners`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-API-KEY": import.meta.env.VITE_API_KEY,
          },
        }
      );
      console.log("Banner created:", response.data);
      alert("Banner created successfully!");
      // Reset form
      setBannerData({ name: "", description: "", date: "", qty: "" });
      setDisplayImage(null);
      setGalleryImages([]);
      setSelectedBrand(null);
      setSelectedCategory(null);
      setIsActive(true);
      setErrors({});
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Error creating banner:", error);
        alert("Failed to create banner. Please try again.");
      }
    }
  };

  return (
    <LayoutAdmin>
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Form Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900">Add New Banner</h1>
            <p className="mt-2 text-base text-gray-600">
              Fill out the details to create a new banner listing
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
                      Banner Name <span className="text-teal-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={bannerData.name}
                      onChange={handleInputChange}
                      required
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
                      <p className="mt-2 text-sm text-red-500">{errors.description}</p>
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
                      <p className="mt-2 text-sm text-red-500">{errors.category}</p>
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
                      class стендPrefix="react-select"
                    />
                    {errors.brand && (
                      <p className="mt-2 text-sm text-red-500">{errors.brand}</p>
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
                      onClick={() => setIsActive(!isActive)}
                      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                        isActive ? "bg-teal-600" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 rounded-full bg-white transform transition-transform ${
                          isActive ? "translate-x-6" : "translate-x-1"
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
                      Display Image <span className="text-teal-600">*</span>
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
                          <div className="mt-2 text-sm text-gray-500 text-center">
                            {displayImage.file.name} (
                            {formatFileSize(displayImage.file.size)})
                          </div>
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
                      <p className="mt-2 text-sm text-red-500">{errors.image}</p>
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
                          <p className="mt-2 text-sm text-gray-500 text-center">
                            {galleryImages.length} image selected
                          </p>
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
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 111WANNA6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
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
                      <p className="mt-2 text-sm text-red-500">{errors.small_image}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="p-8 flex justify-end gap-4">
                <button
                  type="button"
                  className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
                >
                  Create Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default CreateBanner;
