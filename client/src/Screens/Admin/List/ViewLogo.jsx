import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import LayoutAdmin from "../../../Layouts/LayoutAdmin";
import { FiArrowLeft, FiTag, FiCalendar, FiEdit } from "react-icons/fi";

// Utility function to format dates
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return isNaN(date.getTime())
    ? "N/A"
    : date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
};

// Reusable Card component to reduce Tailwind class duplication
const Card = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    {title && (
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
    )}
    {children}
  </div>
);

// Environment variable fallbacks
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const STORAGE_URL =
  import.meta.env.VITE_STORAGE_URL || "https://storage.example.com";

const ViewLogo = () => {
  const { id } = useParams();
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch logo data from backend
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        // Call backend endpoint instead of direct API
        const response = await axios.get(`${API_URL}/logos/${id}`);

        if (!response.data.logo) {
          throw new Error("Logo not found in response");
        }

        setLogo(response.data.logo);
        setLoading(false);
      } catch (err) {
        let errorMessage = "Failed to fetch logo. Please try again.";
        if (err.response) {
          if (err.response.status === 404) {
            errorMessage = "Logo not found.";
          } else if (err.response.status === 403) {
            errorMessage = "You are not authorized to view this logo.";
          } else {
            errorMessage = err.response.data?.message || errorMessage;
          }
        }
        setError(errorMessage);
        setLoading(false);
        console.error("Error fetching logo:", err);
      }
    };

    fetchLogo();
  }, [id]);

  // Consistent image URL with fallback
  const imageUrl = logo?.image
    ? `${STORAGE_URL}/${logo.image}`
    : "https://placehold.co/800x800?text=No+Image";

  // Render loading state
  const renderLoading = () => (
    <LayoutAdmin>
      <div
        className="flex justify-center items-center min-h-[400px]"
        aria-live="polite"
      >
        <div className="space-y-4 text-center">
          <div className="animate-pulse flex space-x-4 justify-center">
            <div className="rounded-full h-12 w-12 bg-blue-100"></div>
          </div>
          <p className="text-gray-500">Loading logo details...</p>
        </div>
      </div>
    </LayoutAdmin>
  );

  // Render error state
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
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h3 className="mt-3 text-lg font-medium text-red-800">Error</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>
              {error ||
                "Logo not found. Please check the ID or try again later."}
            </p>
          </div>
          <div className="mt-5">
            <Link
              to="/admin/logos"
              className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              aria-label="Back to logos list"
            >
              <FiArrowLeft className="mr-2" aria-hidden="true" />
              Back to Logos
            </Link>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );

  // Handle loading and error states
  if (loading) return renderLoading();
  if (error || !logo) return renderError();

  return (
    <LayoutAdmin>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            to="/logo/list"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Back to logos list"
          >
            <FiArrowLeft className="mr-2" aria-hidden="true" />
            Back to Logos
          </Link>

          <div className="mt-2 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Logo #{logo.id}
            </h1>

            <div className="flex space-x-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  logo.status
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {logo.status ? "Active" : "Inactive"}
              </span>

              <Link
                to={`/logo/edit/${logo.id}`}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200"
                aria-label={`Edit logo ${logo.id}`}
              >
                <FiEdit className="mr-1" aria-hidden="true" />
                Edit
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <Card>
            <div className="aspect-w-1 aspect-h-1 bg-gray-50">
              <img
                src={imageUrl}
                alt={logo.category ? `${logo.category} logo` : "Logo image"}
                className="w-full h-full object-contain"
              />
            </div>
          </Card>

          {/* Logo Details */}
          <div className="space-y-6">
            {/* Attributes Card */}
            <Card title="Attributes">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Category
                  </h3>
                  <div className="flex items-center text-gray-500 mb-1">
                    <FiTag className="mr-2" aria-hidden="true" />
                    <p className="font-medium">{logo.category || "N/A"}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Status
                  </h3>
                  <p className="font-medium">
                    {logo.status ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
            </Card>

            {/* Image Card */}
            <Card title="Image Details">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Image
                  </h3>
                  {logo.image ? (
                    <img
                      className="w-full max-w-[100px] h-auto object-contain"
                      src={imageUrl}
                      alt={
                        logo.category
                          ? `${logo.category} logo preview`
                          : "Logo preview"
                      }
                    />
                  ) : (
                    <p className="text-sm text-gray-500">N/A</p>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Image Path
                  </h3>
                  <p className="font-mono text-sm break-all">
                    {logo.image ? `${STORAGE_URL}/${logo.image}` : "N/A"}
                  </p>
                </div>
              </div>
            </Card>

            {/* Metadata Card */}
            <Card>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center text-gray-500 mb-2">
                    <FiCalendar className="mr-2" aria-hidden="true" />
                    <span className="text-sm font-medium">Created at</span>
                  </div>
                  <p className="font-medium">{formatDate(logo.created_at)}</p>
                </div>

                <div>
                  <div className="flex items-center text-gray-500 mb-2">
                    <FiCalendar className="mr-2" aria-hidden="true" />
                    <span className="text-sm font-medium">Updated at</span>
                  </div>
                  <p className="font-medium">{formatDate(logo.updated_at)}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default ViewLogo;