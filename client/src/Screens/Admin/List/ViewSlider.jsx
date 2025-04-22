import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import LayoutAdmin from "../../../Layouts/LayoutAdmin";
import { FiArrowLeft, FiCalendar, FiTag, FiImage } from "react-icons/fi";
import { format } from "date-fns";

const ViewSlider = () => {
  const { id } = useParams();
  const [slider, setSlider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchSlider = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/sliders/${id}`,
          {
            headers: {
              "X-API-KEY": import.meta.env.VITE_API_KEY,
            },
          }
        );
        console.log("Fetched slider:", response.data); // Debug
        setSlider(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch slider. Please try again.");
        setLoading(false);
        console.error("Error fetching slider:", err);
      }
    };
    fetchSlider();
  }, [id]);

  const renderLoading = () => (
    <LayoutAdmin>
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="space-y-4 text-center">
          <div className="animate-pulse flex space-x-4 justify-center">
            <div className="rounded-full h-12 w-12 bg-blue-100"></div>
          </div>
          <p className="text-gray-500">Loading slider details...</p>
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
            <p>{error || "Slider not found"}</p>
          </div>
          <div className="mt-5">
            <Link
              to="/slider/list"
              className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              <FiArrowLeft className="mr-2" />
              Back to Sliders
            </Link>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );

  if (loading) return renderLoading();
  if (error || !slider) return renderError();

  const images = [slider.image, slider.small_image]
    .filter(Boolean)
    .map((img) => `${import.meta.env.VITE_STORAGE_URL}/${img}`);

  return (
    <LayoutAdmin>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            to="/slider"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to sliders
          </Link>
          <div className="mt-2 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              {slider.name || "Unnamed Slider"}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                slider.status
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {slider.status ? "Published" : "Draft"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="aspect-w-1 aspect-h-1 bg-gray-50">
              <img
                src={
                  images[activeImage] ||
                  "https://placehold.co/800x800?text=No+Image"
                }
                alt={slider.name || "Slider"}
                className="w-full h-full object-contain transition-opacity duration-300"
                onError={(e) => {
                  console.error(`Failed to load image: ${e.target.src}`);
                  e.target.src =
                    "https://placehold.co/800x800?text=Image+Error";
                }}
                onLoad={() =>
                  console.log(`Loaded image: ${images[activeImage]}`)
                }
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
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error(
                          `Failed to load thumbnail: ${e.target.src}`
                        );
                        e.target.src =
                          "https://placehold.co/100x100?text=Error";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Slider Details */}
          <div className="space-y-6">
            {/* Description Card */}
            {slider.description && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Description
                </h2>
                <p className="text-gray-600 whitespace-pre-line">
                  {slider.description}
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
                  <p className="font-medium">{slider.brand || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Category
                  </h3>
                  <div className="flex items-center text-gray-500 mb-1">
                    <FiTag className="mr-2" />
                    <p className="font-medium">{slider.category || "N/A"}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Date
                  </h3>
                  <div className="flex items-center text-gray-500 mb-1">
                    <FiCalendar className="mr-2" />
                    <p className="font-medium">
                      {slider.date
                        ? format(new Date(slider.date), "MMM dd, yyyy")
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Images Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Images
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Main Image
                  </h3>
                  <div className="flex items-center text-gray-500 mb-1">
                    <FiImage className="mr-2" />
                    <p className="font-medium">
                      {slider.image ? "Uploaded" : "N/A"}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Small Image
                  </h3>
                  <div className="flex items-center text-gray-500 mb-1">
                    <FiImage className="mr-2" />
                    <p className="font-medium">
                      {slider.small_image ? "Uploaded" : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Metadata Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center text-gray-500 mb-2">
                <FiCalendar className="mr-2" />
                <span className="text-sm font-medium">Created at</span>
              </div>
              <p className="font-medium">
                {slider.created_at
                  ? format(new Date(slider.created_at), "MMM dd, yyyy HH:mm")
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default ViewSlider;
