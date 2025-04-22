import React, { useState } from "react";
import LayoutAdmin from "../../../Layouts/LayoutAdmin";
import Select from "react-select";
import axios from "axios";

const CreateProduct = () => {
  const [displayImage, setDisplayImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    regular_price: "",
    sale_price: "",
    discount: "",
    tax: "",
    qty: "",
    date: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const categoryOptions = [
    { value: "electronics", label: "Electronics" },
    { value: "clothing", label: "Clothing" },
    { value: "accessories", label: "Accessories" },
    { value: "furniture", label: "Furniture" },
  ];

  const colorOptions = [
    { value: "red", label: "Red" },
    { value: "blue", label: "Blue" },
    { value: "green", label: "Green" },
    { value: "black", label: "Black" },
  ];

  const sizeOptions = [
    { value: "small", label: "Small" },
    { value: "medium", label: "Medium" },
    { value: "large", label: "Large" },
    { value: "xl", label: "XL" },
    { value: "xxl", label: "XXL" },
    { value: "xxxl", label: "XXXL" },
  ];

  const brandOptions = [
    { value: "nike", label: "Nike", icon: "👟" },
    { value: "adidas", label: "Adidas", icon: "🧢" },
    { value: "puma", label: "Puma", icon: "🐆" },
    { value: "under_armour", label: "Under Armour", icon: "🦾" },
  ];

  const formatOptionLabel = ({ label, icon }) => (
    <div className="flex items-center">
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </div>
  );

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "46px",
      borderRadius: "8px",
      borderColor: state.isFocused ? "#0d9488" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(13, 148, 136, 0.2)" : "none",
      "&:hover": {
        borderColor: "#0d9488",
      },
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
      "&:active": {
        backgroundColor: "#0d9488",
        color: "white",
      },
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
      "&:hover": {
        backgroundColor: "#99f6e4",
        color: "#0a7468",
      },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    }),
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (productData.regular_price && isNaN(productData.regular_price))
      newErrors.regular_price = "Regular price must be a number";
    if (productData.sale_price && isNaN(productData.sale_price))
      newErrors.sale_price = "Sale price must be a number";
    if (productData.qty && isNaN(productData.qty))
      newErrors.qty = "Quantity must be a number";
    if (productData.tax && isNaN(productData.tax))
      newErrors.tax = "Tax must be a number";
    if (productData.discount && isNaN(productData.discount))
      newErrors.discount = "Discount must be a number";
    if (productData.date && !/^\d{4}-\d{2}-\d{2}$/.test(productData.date))
      newErrors.date = "Invalid date format";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDisplayImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDisplayImage({ file, preview: URL.createObjectURL(file) });
      setErrors((prev) => ({ ...prev, displayImage: "" }));
    }
  };

  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setGalleryImages((prev) => [...prev, ...files]);
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
      setErrors((prev) => ({ ...prev, displayImage: "" }));
    }
  };

  const handleGalleryImagesDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({ file, preview: URL.createObjectURL(file) }));
    setGalleryImages((prev) => [...prev, ...files]);
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

  const handleCategoryChange = (selected) => {
    setSelectedCategories(selected);
  };

  const handleColorChange = (selected) => {
    setSelectedColors(selected);
  };

  const handleSizeChange = (selected) => {
    setSelectedSizes(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      if (productData.name) formData.append("name", productData.name);
      if (productData.description)
        formData.append("description", productData.description);
      if (productData.regular_price)
        formData.append("regular_price", productData.regular_price);
      if (productData.sale_price)
        formData.append("sale_price", productData.sale_price);
      if (productData.tax) formData.append("tax", productData.tax);
      if (productData.discount)
        formData.append("discount", productData.discount);
      if (productData.qty) formData.append("qty", productData.qty);
      if (productData.date) formData.append("date", productData.date);
      if (selectedBrand) formData.append("brand", selectedBrand.value);
      if (selectedCategories.length > 0) {
        selectedCategories.forEach((category, index) => {
          formData.append(`category[${index}]`, category.value);
        });
      }
      if (selectedColors.length > 0) {
        selectedColors.forEach((color, index) => {
          formData.append(`color[${index}]`, color.value);
        });
      }
      if (selectedSizes.length > 0) {
        selectedSizes.forEach((size, index) => {
          formData.append(`size[${index}]`, size.value);
        });
      }
      formData.append("status", isActive ? 1 : 0);
      if (displayImage) formData.append("image", displayImage.file);
      galleryImages.forEach((image, index) => {
        formData.append(`gallery_image[${index}]`, image.file);
      });

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/products`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Product created:", response.data);
      setProductData({
        name: "",
        description: "",
        regular_price: "",
        sale_price: "",
        discount: "",
        tax: "",
        qty: "",
        date: "",
      });
      setDisplayImage(null);
      setGalleryImages([]);
      setSelectedBrand(null);
      setSelectedCategories([]);
      setSelectedColors([]);
      setSelectedSizes([]);
      setIsActive(true);
      alert("Product created successfully!");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 422) {
          setErrors(error.response.data.errors);
          setSubmitError("Please correct the form errors.");
        } else if (error.response.status === 401) {
          setSubmitError("Unauthorized access. Please log in.");
        } else {
          setSubmitError("An error occurred while creating the product.");
        }
      } else {
        setSubmitError("Network error. Please check your connection.");
      }
      console.error("Error creating product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LayoutAdmin>
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900">
              Add New Product
            </h1>
            <p className="mt-2 text-base text-gray-600">
              Fill out the details to create a new product listing
            </p>
          </div>
          {submitError && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
              {submitError}
            </div>
          )}
          <div className="bg-white rounded-xl border border-gray-200">
            <form onSubmit={handleSubmit}>
              <div className="p-8 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={productData.name}
                      onChange={handleInputChange}
                      placeholder="Premium T-Shirt"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={isSubmitting}
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="qty"
                      value={productData.qty}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                        errors.qty ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={isSubmitting}
                    />
                    {errors.qty && (
                      <p className="mt-2 text-sm text-red-500">{errors.qty}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={productData.description}
                      onChange={handleInputChange}
                      rows={5}
                      placeholder="Detailed product description..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>
              <div className="p-8 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Categories Colors  Sizes & Brand
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categories
                    </label>
                    <Select
                      isMulti
                      options={categoryOptions}
                      value={selectedCategories}
                      onChange={handleCategoryChange}
                      placeholder="Select categories..."
                      styles={customSelectStyles}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      isDisabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Colors
                    </label>
                    <Select
                      isMulti
                      options={colorOptions}
                      value={selectedColors}
                      onChange={handleColorChange}
                      placeholder="Select colors..."
                      styles={customSelectStyles}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      isDisabled={isSubmitting}
                    />
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
                      isDisabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sizes
                    </label>
                    <Select
                      isMulti
                      options={sizeOptions}
                      value={selectedSizes}
                      onChange={handleSizeChange}
                      placeholder="Select sizes..."
                      styles={customSelectStyles}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      isDisabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>
              <div className="p-8 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Pricing & Price
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Regular Price
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <input
                        type="number"
                        name="regular_price"
                        value={productData.regular_price}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                          errors.regular_price
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        disabled={isSubmitting}
                      />
                      {errors.regular_price && (
                        <p className="mt-2 text-sm text-red-500">
                          {errors.regular_price}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sale Price
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <input
                        type="number"
                        name="sale_price"
                        value={productData.sale_price}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax Rate
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="tax"
                        value={productData.tax}
                        onChange={handleInputChange}
                        placeholder="0"
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                        disabled={isSubmitting}
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <span className="text-gray-500">%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="discount"
                        value={productData.discount}
                        onChange={handleInputChange}
                        placeholder="0"
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                        disabled={isSubmitting}
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <span className="text-gray-500">%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Status
                      </label>
                      <p className="text-sm text-gray-500">
                        Enable to make product visible to customers
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsActive(!isActive)}
                      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                        isActive ? "bg-teal-600" : "bg-gray-300"
                      }`}
                      disabled={isSubmitting}
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
              <div className="p-8 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Publish Date & Time & Status
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Release Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={productData.date}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                        errors.date ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={isSubmitting}
                    />
                    {errors.date && (
                      <p className="mt-2 text-sm text-red-500">{errors.date}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Status
                      </label>
                      <p className="text-sm text-gray-500">
                        Enable to make product visible to customers
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsActive(!isActive)}
                      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                        isActive ? "bg-teal-600" : "bg-gray-300"
                      }`}
                      disabled={isSubmitting}
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
              <div className="p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Product Images
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Image
                    </label>
                    <div
                      className={`mt-2 flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-colors ${
                        isDragging
                          ? "border-teal-500 bg-teal-50"
                          : errors.displayImage
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
                            disabled={isSubmitting}
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
                                disabled={isSubmitting}
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
                    {errors.displayImage && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.displayImage}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gallery Images
                    </label>
                    <div
                      className={`mt-2 flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-colors ${
                        isDragging
                          ? "border-teal-500 bg-teal-50"
                          : "border-gray-300"
                      } ${galleryImages.length > 0 ? "p-3" : "p-6"}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleGalleryImagesDrop}
                    >
                      {galleryImages.length > 0 ? (
                        <div className="w-full">
                          <div className="grid grid-cols-3 gap-3">
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
                                  disabled={isSubmitting}
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
                            <label className="flex items-center justify-center h-24 border border-gray-300 rounded-md cursor-pointer hover:border-teal-500 transition-colors">
                              <svg
                                className="h-6 w-6 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                              </svg>
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleGalleryImagesChange}
                                className="sr-only"
                                disabled={isSubmitting}
                              />
                            </label>
                          </div>
                          <p className="mt-2 text-sm text-gray-500 text-center">
                            {galleryImages.length} image(s) selected
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
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          <div className="mt-2 flex text-sm text-gray-600">
                            <label className="relative cursor-pointer font-medium text-teal-600 hover:text-teal-500 transition-colors">
                              <span>Upload files</span>
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleGalleryImagesChange}
                                className="sr-only"
                                disabled={isSubmitting}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="mt-2 text-sm text-gray-500">
                            PNG, JPG, GIF up to 2MB each
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-8 flex justify-end gap-4">
                <button
                  type="button"
                  className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-6 py-3 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default CreateProduct;
