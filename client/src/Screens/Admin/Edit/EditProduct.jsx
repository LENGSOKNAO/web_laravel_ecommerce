import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LayoutAdmin from "../../../Layouts/LayoutAdmin";
import Select from "react-select";
import axios from "axios";
import { CiImageOn } from "react-icons/ci";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [displayImage, setDisplayImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [isActive, setIsActive] = useState(false);
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
  const [existingImage, setExistingImage] = useState(null);
  const [existingGalleryImages, setExistingGalleryImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [productError, setProductError] = useState("");
  const [dataWarnings, setDataWarnings] = useState([]);

  const categoryOptions = [
    { value: "shoes", label: "Shoes" },
    { value: "new-featured", label: "New & Featured" },
    { value: "men", label: "Men" },
    { value: "women", label: "Women" },
    { value: "kids", label: "Kids" },
    { value: "sport", label: "Sport" },
    { value: "basketball", label: "Basketball" },
    { value: "running", label: "Running" },
    { value: "training", label: "Training" },
    { value: "soccer", label: "Soccer" },
    { value: "golf", label: "Golf" },
    { value: "lifestyle", label: "Lifestyle" },
    { value: "jordan", label: "Jordan" },
    { value: "retro-running", label: "Retro Running" },
    { value: "sandals-slides", label: "Sandals & Slides" },
    { value: "equipment", label: "Equipment" },
    { value: "jackets-vests", label: "Jackets & Vests" },
    { value: "hoodies-sweatshirts", label: "Hoodies & Sweatshirts" },
    { value: "pants", label: "Pants" },
    { value: "shorts", label: "Shorts" },
    { value: "tops-tees", label: "Tops & Tees" },
    { value: "matching-sets", label: "Matching Sets" },
    { value: "bags-backpacks", label: "Bags & Backpacks" },
    { value: "hats-headwear", label: "Hats & Headwear" },
    { value: "socks", label: "Socks" },
    { value: "sunglasses", label: "Sunglasses" },
    { value: "belts", label: "Belts" },
    { value: "skirts-dresses", label: "Skirts & Dresses" },
    { value: "bras", label: "Bras" },
    { value: "leggings", label: "Leggings" },
    { value: "teen", label: "Teen" },
    { value: "big-kids", label: "Big Kids (7-15 yrs)" },
    { value: "little-kids", label: "Little Kids (3-7 yrs)" },
    { value: "baby-toddler", label: "Baby & Toddler (0-3 yrs)" },
    { value: "fan-gear", label: "Fan Gear" },
  ];

  const colorOptions = [
    { value: "red", label: "Red" },
    { value: "blue", label: "Blue" },
    { value: "green", label: "Green" },
    { value: "black", label: "Black" },
  ];

  const sizeOptions = [
    // Clothing Sizes
    { value: "small", label: "SM" },
    { value: "medium", label: "M" },
    { value: "large", label: "L" },
    { value: "xl", label: "XL" },
    { value: "xxl", label: "XXL" },
    { value: "xxxl", label: "XXXL" },

    // Shoe Sizes (For men, women, and kids)
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "10", label: "10" },
    { value: "11", label: "11" },
    { value: "12", label: "12" },
    { value: "13", label: "13" },
    { value: "14", label: "14" },
    { value: "15", label: "15" },
    { value: "16", label: "16" }, // Optional, in case you want to include larger sizes
  ];

  const sizeMapping = {
    s: "small",
    m: "medium",
    l: "large",
    sm: "small",
    md: "medium",
    lg: "large",
    sml: "small",
    med: "medium",
    small: "small",
    medium: "medium",
    large: "large",
    S: "small",
    M: "medium",
    L: "large",
    xl: "xl",
    XL: "xl",
    xxl: "xxl",
    XXL: "xxl",
    xxxl: "xxxl",
    XXXL: "xxxl",
    "extra large": "xl",
    "extra-large": "xl",
    "xx-large": "xxl",
    "xxx-large": "xxxl",
  };

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

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setProductError(
          "No product ID provided. Please select a product to edit."
        );
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/products/${id}`
        );
        console.log("API Response:", response.data);
        const product = response.data.data || {};
        const warnings = [];

        // Set product data
        setProductData({
          name: product.name || "",
          description: product.description || "",
          regular_price: product.regular_price || "",
          sale_price: product.sale_price || "",
          discount: product.discount || "",
          tax: product.tax || "",
          qty: product.qty || "",
          date: product.date ? product.date.split("T")[0] : "",
        });

        // Handle product status
        console.log("Raw status:", product.status);
        let statusValue = product.status;
        if (statusValue === undefined || statusValue === null) {
          warnings.push("Product status is missing, defaulting to inactive.");
          statusValue = false;
        }
        const isActiveStatus =
          statusValue === 1 ||
          statusValue === "1" ||
          statusValue === true ||
          statusValue === "active" ||
          statusValue === "true" ||
          statusValue === "enabled";
        setIsActive(isActiveStatus);
        console.log("Processed isActive:", isActiveStatus);
        if (
          !isActiveStatus &&
          statusValue !== 0 &&
          statusValue !== "0" &&
          statusValue !== false &&
          statusValue !== "inactive" &&
          statusValue !== "disabled"
        ) {
          warnings.push(
            `Unrecognized status value "${statusValue}", defaulting to inactive.`
          );
        }

        // Set brand
        setSelectedBrand(
          brandOptions.find((option) => option.value === product.brand) || null
        );

        // Handle categories
        const categories = Array.isArray(product.category)
          ? product.category
          : typeof product.category === "string"
          ? product.category.split(",")
          : [];
        setSelectedCategories(
          categories
            .map((cat) =>
              categoryOptions.find((option) => option.value === cat.trim())
            )
            .filter(Boolean) || []
        );

        // Handle colors
        const parseColors = (color) => {
          if (Array.isArray(color)) return color;
          if (typeof color === "string")
            return color.split(",").map((c) => c.trim());
          return [];
        };

        const parsedColors = parseColors(product.color);
        setSelectedColors(
          parsedColors
            .map((color) =>
              colorOptions.find((option) => option.value === color)
            )
            .filter(Boolean)
        );

        // Handle sizes
        const parseSizes = (size) => {
          if (Array.isArray(size)) return size;
          if (typeof size === "string")
            return size.split(",").map((s) => s.trim());
          return [];
        };

        const parsedSizes = parseSizes(product.size);
        const matchedSizes = parsedSizes
          .map((size) => {
            if (!size) return null;
            const lower = size.toLowerCase();
            const mapped = sizeMapping[lower] || lower;
            const match = sizeOptions.find((option) => option.value === mapped);
            if (!match) {
              console.warn(
                `Size "${size}" (mapped to "${mapped}") not found in sizeOptions`
              );
              warnings.push(
                `Size "${size}" is not a valid option and will not be displayed.`
              );
            }
            return match;
          })
          .filter(Boolean);

        setSelectedSizes(matchedSizes);

        // Handle display image
        if (product.image) {
          const imageUrl = `${import.meta.env.VITE_BASE_URL}/storage/${
            product.image
          }`;
          setDisplayImage({ file: null, preview: imageUrl });
          setExistingImage(imageUrl);
        } else {
          setDisplayImage(null);
          setExistingImage(null);
        }

        // Handle gallery images
        if (product.gallery_image) {
          const galleryUrls = Array.isArray(product.gallery_image)
            ? product.gallery_image.map(
                (img) => `${import.meta.env.VITE_BASE_URL}/storage/${img}`
              )
            : typeof product.gallery_image === "string"
            ? product.gallery_image
                .split(",")
                .map(
                  (img) =>
                    `${import.meta.env.VITE_BASE_URL}/storage/${img.trim()}`
                )
            : [];
          setGalleryImages(
            galleryUrls.map((url) => ({ file: null, preview: url }))
          );
          setExistingGalleryImages(galleryUrls);
        } else {
          setGalleryImages([]);
          setExistingGalleryImages([]);
        }

        setDataWarnings(warnings);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        const errorMessage = error.response?.data?.message || error.message;
        setProductError(`Failed to load product data: ${errorMessage}`);
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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
      setErrors((prev) => ({ ...prev, image: "" }));
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
      setErrors((prev) => ({ ...prev, image: "" }));
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
    setSelectedCategories(selected || []);
    setErrors((prev) => ({ ...prev, category: "" }));
  };

  const handleColorChange = (selected) => {
    setSelectedColors(selected || []);
    setErrors((prev) => ({ ...prev, color: "" }));
  };

  const handleSizeChange = (selected) => {
    setSelectedSizes(selected || []);
    setErrors((prev) => ({ ...prev, sizes: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setErrors({});
    if (!validateForm()) {
      setSubmitError("Please correct the form errors.");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("_method", "PUT");
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
      } else {
        formData.append("category", "");
      }
      if (selectedColors.length > 0) {
        selectedColors.forEach((color, index) => {
          formData.append(`color[${index}]`, color.value);
        });
      } else {
        formData.append("color", "");
      }
      if (selectedSizes.length > 0) {
        selectedSizes.forEach((size, index) => {
          formData.append(`size[${index}]`, size.value);
        });
      } else {
        formData.append("size", "");
      }
      formData.append("status", isActive ? 1 : 0);

      if (displayImage?.file) {
        formData.append("image", displayImage.file);
      } else if (existingImage) {
        formData.append("existing_image", existingImage);
      }

      galleryImages.forEach((image, index) => {
        if (image.file) {
          formData.append(`gallery_image[${index}]`, image.file);
        }
      });
      if (existingGalleryImages.length > 0) {
        existingGalleryImages.forEach((url, index) => {
          formData.append(`existing_gallery_image[${index}]`, url);
        });
      }

      console.log("Submitting FormData:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/products/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Product updated:", response.data);
      alert("Product updated successfully!");
      navigate("/product/list");
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
      if (error.response) {
        if (error.response.status === 422) {
          setErrors(error.response.data.errors);
          setSubmitError("Validation failed. Please check the form fields.");
        } else if (error.response.status === 401) {
          setSubmitError("Unauthorized access. Please log in.");
        } else {
          setSubmitError(
            `Failed to update product: ${
              error.response.data.message || "Unknown error"
            }`
          );
        }
      } else {
        setSubmitError("Network error. Please check your connection.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <LayoutAdmin>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-lg text-gray-600">Loading product data...</p>
        </div>
      </LayoutAdmin>
    );
  }

  if (productError) {
    return (
      <LayoutAdmin>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-red-100 p-6 rounded-lg text-red-700">
            <p>{productError}</p>
            <button
              onClick={() => navigate("/product/list")}
              className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg"
            >
              Back to Product List
            </button>
          </div>
        </div>
      </LayoutAdmin>
    );
  }

  return (
    <LayoutAdmin>
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
            <p className="mt-2 text-base text-gray-600">
              Update the details to modify the product listing
            </p>
          </div>
          {submitError && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
              {submitError}
            </div>
          )}
          {dataWarnings.length > 0 && (
            <div className="mb-6 p-4 bg-yellow-100 text-yellow-700 rounded-lg">
              <p className="font-semibold">Data Warnings:</p>
              <ul className="list-disc pl-5">
                {dataWarnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
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
                      value={productData.name || ""}
                      onChange={handleInputChange}
                      placeholder="Premium T-Shirt"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={isSubmitting}
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.name[0]}
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
                      value={productData.qty || ""}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                        errors.qty ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={isSubmitting}
                    />
                    {errors.qty && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.qty[0]}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={productData.description || ""}
                      onChange={handleInputChange}
                      rows={5}
                      placeholder="Detailed product description..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                      disabled={isSubmitting}
                    />
                    {errors.description && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.description[0]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-8 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Categories, Colors, Sizes & Brand
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categories
                    </label>
                    <Select
                      isMulti
                      options={categoryOptions}
                      value={selectedCategories || []}
                      onChange={handleCategoryChange}
                      placeholder="Select categories..."
                      styles={customSelectStyles}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      isDisabled={isSubmitting}
                    />
                    {errors.category && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.category[0]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Colors
                    </label>
                    <Select
                      isMulti
                      options={colorOptions}
                      value={selectedColors || []}
                      onChange={handleColorChange}
                      placeholder="Select colors..."
                      styles={customSelectStyles}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      isDisabled={isSubmitting}
                    />
                    {errors.color && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.color[0]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand
                    </label>
                    <Select
                      options={brandOptions}
                      value={selectedBrand || null}
                      onChange={setSelectedBrand}
                      formatOptionLabel={formatOptionLabel}
                      placeholder="Select brand..."
                      styles={customSelectStyles}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      isDisabled={isSubmitting}
                    />
                    {errors.brand && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.brand[0]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sizes
                    </label>
                    <Select
                      isMulti
                      options={sizeOptions}
                      value={selectedSizes || []}
                      onChange={handleSizeChange}
                      placeholder="Select sizes..."
                      styles={customSelectStyles}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      isDisabled={isSubmitting}
                    />
                    {errors.size && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.size[0]}
                      </p>
                    )}
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
                        value={productData.regular_price || ""}
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
                          {errors.regular_price[0]}
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
                        value={productData.sale_price || ""}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                        disabled={isSubmitting}
                      />
                      {errors.sale_price && (
                        <p className="mt-2 text-sm text-red-500">
                          {errors.sale_price[0]}
                        </p>
                      )}
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
                        value={productData.tax || ""}
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
                    {errors.tax && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.tax[0]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="discount"
                        value={productData.discount || ""}
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
                    {errors.discount && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.discount[0]}
                      </p>
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
                    {errors.status && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.status[0]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-8 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Publish Date & Time
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Release Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={productData.date || ""}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                        errors.date ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={isSubmitting}
                    />
                    {errors.date && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.date[0]}
                      </p>
                    )}
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
                            onError={(e) =>
                              (e.target.src = "https://via.placeholder.com/200")
                            }
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
                          {displayImage.file && (
                            <div className="mt-2 text-sm text-gray-500 text-center">
                              {displayImage.file.name} (
                              {formatFileSize(displayImage.file.size)})
                            </div>
                          )}
                        </div>
                      ) : (
                        <>
                          <CiImageOn className="mx-auto h-12 w-12 text-gray-400" />
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
                    {errors.image && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.image[0]}
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
                          : errors.gallery_image
                          ? "border-red-500"
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
                                  onError={(e) =>
                                    (e.target.src =
                                      "https://via.placeholder.com/200")
                                  }
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
                          <CiImageOn className="mx-auto h-12 w-12 text-gray-400" />
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
                    {errors.gallery_image && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.gallery_image[0]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-8 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/product/list")}
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
                  {isSubmitting ? "Updating..." : "Update Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default EditProduct;
