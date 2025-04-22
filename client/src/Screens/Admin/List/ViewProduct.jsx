import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import LayoutAdmin from "../../../Layouts/LayoutAdmin";
import {
  FiArrowLeft,
  FiDollarSign,
  FiTag,
  FiBox,
  FiLayers,
  FiStar,
  FiCalendar,
} from "react-icons/fi";

const ViewProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/products/${id}`
        );
        setProduct(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch product. Please try again.");
        setLoading(false);
        console.error("Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  const formatCurrency = (value) =>
    value ? `$${parseFloat(value).toFixed(2)}` : "-";

  const renderLoading = () => (
    <LayoutAdmin>
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="space-y-4 text-center">
          <div className="animate-pulse flex space-x-4 justify-center">
            <div className="rounded-full h-12 w-12 bg-blue-100"></div>
          </div>
          <p className="text-gray-500">Loading product details...</p>
        </div>
      </div>
    </LayoutAdmin>
  );

  const renderError = () => (
    <LayoutAdmin>
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 rounded-xl p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
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
          </div>
          <h3 className="mt-3 text-lg font-medium text-red-800">Error</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{error || "Product not found"}</p>
          </div>
          <div className="mt-5">
            <Link
              to="/product/list"
              className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              <FiArrowLeft className="mr-2" />
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );

  if (loading) return renderLoading();
  if (error || !product) return renderError();

  const images = [product.image, ...(product.gallery_image || [])].filter(
    Boolean
  );

  return (
    <LayoutAdmin>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            to="/product/list"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to products
          </Link>
          <div className="mt-2 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              {product.name || "Unnamed Product"}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                product.status
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {product.status ? "Published" : "Draft"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="aspect-w-1 aspect-h-1 bg-gray-50">
              <img
                src={
                  images[activeImage]
                    ? `${import.meta.env.VITE_BASE_URL}/storage/${
                        images[activeImage]
                      }`
                    : "https://placehold.co/800x800?text=No+Image"
                }
                alt={product.name || "Product"}
                className="w-full h-full object-contain transition-opacity duration-300"
                onError={(e) => {
                  e.target.src =
                    "https://placehold.co/800x800?text=Image+Error";
                }}
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 p-4 border-t">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`aspect-square overflow-hidden rounded-md border-2 transition-all ${
                      activeImage === index
                        ? "border-blue-500"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={`${import.meta.env.VITE_BASE_URL}/storage/${img}`}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Pricing
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500">
                    <FiDollarSign className="mr-2" />
                    <span>Regular Price</span>
                  </div>
                  <span className="font-medium">
                    {formatCurrency(product.regular_price)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500">
                    <FiTag className="mr-2" />
                    <span>Sale Price</span>
                  </div>
                  <span className="font-medium text-blue-600">
                    {formatCurrency(product.sale_price)}
                  </span>
                </div>
                {product.discount && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-500">
                      <FiStar className="mr-2" />
                      <span>Discount</span>
                    </div>
                    <span className="font-medium text-green-600">
                      {product.discount}% off
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Inventory Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Inventory
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center text-gray-500 mb-1">
                    <FiBox className="mr-2" />
                    <span>Quantity</span>
                  </div>
                  <p className="font-medium">{product.qty ?? 0}</p>
                </div>
                <div>
                  <div className="flex items-center text-gray-500 mb-1">
                    <FiLayers className="mr-2" />
                    <span>Tax Rate</span>
                  </div>
                  <p className="font-medium">
                    {product.tax ? `${product.tax}%` : "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Description Card */}
            {product.description && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Description
                </h2>
                <p className="text-gray-600 whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Attributes Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Attributes
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Brand
                  </h3>
                  <p className="font-medium">{product.brand || "-"}</p>
                </div>

                {(product.category || []).length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Categories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.category.map((cat, index) => (
                        <span
                          key={index}
                          className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {(product.size || []).length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Sizes
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.size.map((size, index) => (
                        <span
                          key={index}
                          className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-700"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {(product.color || []).length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Colors
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.color.map((color, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full text-xs font-medium flex items-center"
                          style={{
                            backgroundColor: color,
                            color: getContrastColor(color),
                          }}
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Metadata Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center text-gray-500 mb-2">
                <FiCalendar className="mr-2" />
                <span className="text-sm font-medium">Created at</span>
              </div>
              <p className="font-medium">
                {product.created_at
                  ? new Date(product.created_at).toLocaleString()
                  : "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
};

// Helper function to determine text color based on background color
function getContrastColor(hexColor) {
  // Simple check for color format
  if (!hexColor || typeof hexColor !== "string") return "#000000";

  // If color is named or in another format, default to black
  if (!hexColor.startsWith("#")) return "#000000";

  try {
    // Convert hex to RGB
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return dark or light color based on luminance
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
  } catch (e) {
    return "#000000";
  }
}

export default ViewProduct;
