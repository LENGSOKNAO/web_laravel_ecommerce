// src/components/ProductDetail.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import Layout from "../Layouts/Layout";
import { CartContext } from "../Contexts/CartContext";
import { WishlistContext } from "../Contexts/WishlistContext";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/scrollbar";
import { Scrollbar } from "swiper/modules";
import { CiHeart } from "react-icons/ci";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cart = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, isItemInWishlist } = useContext(WishlistContext);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedError, setRelatedError] = useState(null);

  const btnStyle = `w-full text-center py-5 rounded-4xl transition duration-300`;
  const imageBaseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:1629";

  // Fetch current product
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/products/${id}`
        );
        const productData = response.data.data || response.data;

        if (!productData.id) {
          throw new Error("Invalid product data: Missing ID");
        }

        let galleryImage = [];
        if (productData.gallery_image) {
          try {
            galleryImage =
              typeof productData.gallery_image === "string"
                ? JSON.parse(productData.gallery_image)
                : productData.gallery_image;
            if (!Array.isArray(galleryImage)) galleryImage = [];
          } catch (e) {
            console.warn(
              "Invalid gallery_image JSON:",
              productData.gallery_image
            );
            galleryImage = [];
          }
        }

        const normalizedData = {
          id: productData.id,
          name: productData.name || "Unnamed Product",
          category: Array.isArray(productData.category)
            ? productData.category.map((cat) => cat.toLowerCase())
            : typeof productData.category === "string"
            ? JSON.parse(productData.category).map((cat) => cat.toLowerCase())
            : ["uncategorized"],
          sale_price: parseFloat(productData.sale_price) || 0,
          regular_price: parseFloat(productData.regular_price) || 0,
          discount: parseFloat(productData.discount) || 0,
          image: productData.image || "",
          gallery_image: galleryImage,
          size: Array.isArray(productData.size)
            ? productData.size.map((s) => s.toString().toLowerCase())
            : typeof productData.size === "string"
            ? JSON.parse(productData.size).map((s) =>
                s.toString().toLowerCase()
              )
            : [],
        };

        setProduct(normalizedData);
        setSelectedImage(
          normalizedData.image || normalizedData.gallery_image[0]
        );
      } catch (error) {
        console.error("Error fetching product:", error);
        setError(
          error.response?.status === 404
            ? "Product not found"
            : "Failed to load product."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    } else {
      setError("Invalid product ID");
      setLoading(false);
    }
  }, [id]);

  // Fetch related products
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product?.name) return;
      setRelatedLoading(true);
      setRelatedError(null);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/products?name=${encodeURIComponent(
            product.name
          )}`
        );
        const productsData = response.data.data || response.data;

        const filteredProducts = productsData
          .filter((p) => p.id !== product.id)
          .map((p) => ({
            id: p.id,
            name: p.name || "Unnamed Product",
            category: Array.isArray(p.category)
              ? p.category.map((cat) => cat.toLowerCase())
              : typeof p.category === "string"
              ? JSON.parse(p.category).map((cat) => cat.toLowerCase())
              : ["uncategorized"],
            product_price: parseFloat(p.sale_price) || 0,
            image: p.image || "/placeholder-image.jpg",
          }));

        setRelatedProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching related products:", error);
        setRelatedError("Failed to load related products.");
      } finally {
        setRelatedLoading(false);
      }
    };

    if (product) {
      fetchRelatedProducts();
    }
  }, [product]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleSizeClick = (size) => {
    setSelectedSize((prevSize) => (prevSize === size ? null : size));
  };

  const handleAddToCart = () => {
    console.log("Product before adding to cart:", product);
    if (!addToCart) {
      toast.error("Cart functionality is not available.");
      console.error("CartContext is not properly set up.");
      return;
    }
    if (!selectedSize && product.size.length > 0) {
      toast.error("Please select a size.");
      return;
    }
    try {
      const cartProduct = {
        ...product,
        product_price: product.sale_price,
      };
      console.log("Normalized product for cart:", cartProduct);
      addToCart(cartProduct, selectedSize);
      toast.success("Added to Cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart.");
    }
  };

  const handleFavorite = () => {
    if (!addToWishlist) {
      toast.error("Wishlist functionality is not available.");
      return;
    }
    if (!selectedSize && product.size.length > 0) {
      toast.error("Please select a size.");
      return;
    }
    try {
      const wishlistProduct = {
        ...product,
        product_price: product.sale_price,
      };
      addToWishlist(wishlistProduct, selectedSize);
      toast.success(
        isItemInWishlist(product.id, selectedSize)
          ? "Removed from Wishlist!"
          : "Added to Wishlist!"
      );
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Failed to add to wishlist.");
    }
  };

  const mainImage =
    selectedImage ||
    product?.image ||
    product?.gallery_image?.[0] ||
    "/placeholder-image.jpg";

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center w-full h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="flex justify-center items-center w-full h-screen">
          <div className="text-red-500 text-xl">
            {error || "Product not found"}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-10 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Product Details */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex gap-3">
              <div
                className={`grid ${
                  product.gallery_image?.length <= 8
                    ? "grid-cols-1"
                    : "grid-cols-2"
                } gap-1 max-h-[700px] overflow-y-auto`}
              >
                {product.gallery_image?.length > 0 ? (
                  product.gallery_image.map((image, index) => (
                    <img
                      className={`w-[70px] h-[70px] object-cover rounded-sm cursor-pointer hover:opacity-80 ${
                        selectedImage === image
                          ? "border-2 border-blue-500"
                          : ""
                      }`}
                      key={index}
                      src={`${imageBaseUrl}/storage/${image}`}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      onClick={() => handleImageClick(image)}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleImageClick(image);
                        }
                      }}
                      onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                    />
                  ))
                ) : (
                  <p className="text-gray-500">No gallery images</p>
                )}
              </div>
              <img
                className="w-full md:w-[600px] h-[400px] md:h-[700px] object-cover rounded-lg"
                src={`${imageBaseUrl}/storage/${mainImage}`}
                alt={product.name}
                onError={(e) => (e.target.src = "/placeholder-image.jpg")}
              />
            </div>
            <div className="w-full md:w-[20vw] flex flex-col">
              <h2 className="text-2xl font-[400]">{product.name}</h2>
              <h3 className="text-lg font-light text-gray-600">
                {product.category?.[0] || "N/A"}
              </h3>
              <div className="flex gap-5 py-5">
                <p className="text-[16px] text-gray-900">
                  ${Number(product.sale_price || 0).toFixed(2)}
                </p>
                <p className="text-[16px] line-through text-[#707072]">
                  ${Number(product.regular_price || 0).toFixed(2)}
                </p>
                <p className="text-[16px] text-[#007D48]">
                  {Number(product.discount || 0).toFixed(2)}% off
                </p>
              </div>

              {product.size.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-[16px] text-gray-700">Select Size</h4>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {product.size.map((size, index) => (
                      <button
                        key={index}
                        onClick={() => handleSizeClick(size)}
                        className={`border rounded-md py-2 text-center text-sm transition ${
                          selectedSize === size
                            ? "border-blue-500 text-blue-500 bg-blue-50"
                            : "border-gray-300 text-gray-600 hover:border-gray-500 hover:text-gray-900"
                        }`}
                        aria-label={`Select size ${size}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-3 mt-6">
                <button
                  className={`text-white bg-black hover:bg-gray-800 ${btnStyle}`}
                  onClick={handleAddToCart}
                  aria-label="Add to cart"
                >
                  Add to Bag
                </button>
                <button
                  className={`border flex justify-center items-center ${btnStyle} ${
                    isItemInWishlist?.(product.id, selectedSize)
                      ? "bg-blue-100 text-blue-600"
                      : ""
                  }`}
                  onClick={handleFavorite}
                  aria-label={
                    isItemInWishlist?.(product.id, selectedSize)
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                >
                  {isItemInWishlist?.(product.id, selectedSize)
                    ? "In Wishlist"
                    : "Favorite"}
                  <CiHeart className="text-2xl ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Related Products Section */}
        <section className="py-20">
          <h2 className="text-4xl font-[400] mb-6">You Might Also Like</h2>
          <div className="">
            <Swiper
              scrollbar={{
                draggable: true,
              }}
              modules={[Scrollbar]}
              className="mySwiper"
              breakpoints={{
                0: { slidesPerView: 1 },
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 },
              }}
            >
              {relatedLoading ? (
                <SwiperSlide>
                  <div className="flex justify-center items-center h-[507.98px]">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                  </div>
                </SwiperSlide>
              ) : relatedError ? (
                <SwiperSlide>
                  <div className="text-red-500 text-center">{relatedError}</div>
                </SwiperSlide>
              ) : relatedProducts.length === 0 ? (
                <SwiperSlide>
                  <div className="text-gray-500 text-center">
                    No related products found
                  </div>
                </SwiperSlide>
              ) : (
                relatedProducts.map((relatedProduct) => (
                  <SwiperSlide className="mx-[10px]" key={relatedProduct.id}>
                    <Link to={`/${relatedProduct.id}`} className="">
                      <img
                        className="w-[507.98px] h-[507.98px] object-cover"
                        src={`${imageBaseUrl}/storage/${relatedProduct.image}`}
                        alt={relatedProduct.name}
                        onError={(e) =>
                          (e.target.src = "/placeholder-image.jpg")
                        }
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-lg">
                          {relatedProduct.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {relatedProduct.category?.[0] || "N/A"}
                        </p>
                        <p className="text-xl font-semibold mt-2">
                          ${relatedProduct.product_price.toFixed(2)}
                        </p>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))
              )}
            </Swiper>
          </div>
        </section>
      </section>
    </Layout>
  );
};

export default Cart;
