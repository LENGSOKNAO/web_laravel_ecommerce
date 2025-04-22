import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LayoutAdmin from "../../../Layouts/LayoutAdmin";
import Select from "react-select";
import axios from "axios";

const EditLogo = () => {
  const [displayImage, setDisplayImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  const categoryOptions = [
    { value: "electronics", label: "Electronics" },
    { value: "clothing", label: "Clothing" },
    { value: "accessories", label: "Accessories" },
    { value: "furniture", label: "Furniture" },
  ];

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "46px",
      borderRadius: "8px",
      borderColor: state.isFocused ? "#0d9488" : errors.category ? "#ef4444" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(13, 148, 136, 0.2)" : "none",
      "&:hover": { borderColor: errors.category ? "#ef4444" : "#0d9488" },
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
    menu: (provided) => ({
      ...provided,
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    }),
  };

  useEffect(() => {
    const fetchLogo = async () => {
      if (!id) {
        setErrors({ general: "Invalid logo ID" });
        setIsLoading(false);
        return;
      }
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/logos/${id}`);
        const logo = response.data.logo;
        setSelectedCategory(
          categoryOptions.find((option) => option.value === logo.category) || null
        );
        setIsActive(!!logo.status); // Normalize to boolean
        if (logo.image) {
          setDisplayImage({ url: `${import.meta.env.VITE_STORAGE_URL}/storage/${logo.image}` });
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching logo:", error);
        setErrors({ general: "Failed to load logo data" });
        setIsLoading(false);
      }
    };
    fetchLogo();
  }, [id]);

  useEffect(() => {
    return () => {
      if (displayImage?.preview) {
        URL.revokeObjectURL(displayImage.preview);
      }
    };
  }, [displayImage]);

  const validateForm = () => {
    const newErrors = {};
    if (!selectedCategory) {
      newErrors.category = "Please select a category";
    }
    if (displayImage?.file) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
      if (!validTypes.includes(displayImage.file.type)) {
        newErrors.image = "Image must be JPEG, PNG, JPG, or GIF";
      }
      if (displayImage.file.size > 2 * 1024 * 1024) {
        newErrors.image = "Image must be under 2MB";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDisplayImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({ ...prev, image: "Image must be JPEG, PNG, JPG, or GIF" }));
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: "Image must be under 2MB" }));
        return;
      }
      if (displayImage?.preview) {
        URL.revokeObjectURL(displayImage.preview); // Clean up previous preview
      }
      setDisplayImage({ file, preview: URL.createObjectURL(file) });
      setErrors((prev) => ({ ...prev, image: "" }));
    }
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
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({ ...prev, image: "Image must be JPEG, PNG, JPG, or GIF" }));
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: "Image must be under 2MB" }));
        return;
      }
      if (displayImage?.preview) {
        URL.revokeObjectURL(displayImage.preview); // Clean up previous preview
      }
      setDisplayImage({ file, preview: URL.createObjectURL(file) });
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const removeDisplayImage = () => {
    if (displayImage) {
      if (displayImage.preview) {
        URL.revokeObjectURL(displayImage.preview);
      }
      setDisplayImage(null);
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      console.log("Validation failed:", errors);
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("category", selectedCategory.value); // Always send category
    formData.append("status", isActive ? "1" : "0");
    if (displayImage?.file) {
      formData.append("image", displayImage.file);
    }

    // Log FormData for debugging
    console.log("Sending FormData:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value instanceof File ? value.name : value}`);
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/logos/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Update response:", response.data);
      setErrors({});
      navigate("/admin/logos", { state: { success: "Logo updated successfully!" } });
    } catch (error) {
      console.error("Error updating logo:", error.response?.data || error.message);
      if (error.response?.status === 422) {
        const backendErrors = error.response.data.errors;
        setErrors({
          image: backendErrors.image?.[0],
          category: backendErrors.category?.[0],
          status: backendErrors.status?.[0],
          general: backendErrors.general?.[0] || "Validation failed",
        });
      } else if (error.response?.status === 404) {
        setErrors({ general: "Logo not found" });
      } else {
        setErrors({ general: `Failed to update logo: ${error.message}` });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <LayoutAdmin>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </LayoutAdmin>
    );
  }

  return (
    <LayoutAdmin>
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900">Edit Logo</h1>
            <p className="mt-2 text-base text-gray-600">
              Update the details to modify the logo
            </p>
          </div>
          {errors.general && (
            <p className="mb-4 text-sm text-red-500">{errors.general}</p>
          )}
          <div className="bg-white rounded-xl border border-gray-200">
            <form onSubmit={handleSubmit}>
              <div className="p-8 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Category & Status
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
                      placeholder="Select Category..."
                      styles={customSelectStyles}
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                    {errors.category && (
                      <p className="mt-2 text-sm text-red-500">{errors.category}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo Status
                      </label>
                      <p className="text-sm text-gray-500">
                        Enable to make logo visible
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
              <div className="p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Logo Image
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo Image
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
                          src={displayImage.preview || displayImage.url}
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
                              accept="image/jpeg,image/png,image/jpg,image/gif"
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
              </div>
              <div className="p-8 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/admin/logos")}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update Logo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default EditLogo;