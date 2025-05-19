// src/components/CartPage.jsx
import React, { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import Layout from "../Layouts/Layout";
import { CartContext } from "../Contexts/CartContext";
import { WishlistContext } from "../Contexts/WishlistContext";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoAddSharp } from "react-icons/io5";
import { HiOutlineXMark } from "react-icons/hi2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CiHeart } from "react-icons/ci";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);

  const imageBaseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:8000";

  // Debug context
  console.log("WishlistContext in CartPage:", { addToWishlist });

  const handleIncreaseQuantity = (item) => {
    updateQuantity(item.id, item.selectedSize, item.quantity + 1);
  };

  const handleDecreaseQuantity = (item) => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.selectedSize, item.quantity - 1);
    }
  };

  const handleDeleteItem = (item) => {
    removeFromCart(item.id, item.selectedSize);
  };

  const handleMoveToWishlist = (item) => {
    if (!addToWishlist) {
      console.error("WishlistContext is not properly set up:", {
        addToWishlist,
      });
      toast.error("Wishlist functionality is not available.");
      return;
    }
    try {
      const wishlistProduct = {
        ...item,
        product_price: item.product_price,
        name: item.name || "Unknown Product", // Ensure name is provided
      };
      console.log("Adding to wishlist:", wishlistProduct, item.selectedSize);
      addToWishlist(wishlistProduct, item.selectedSize);
      toast.success("Added to Wishlist!");
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Failed to add to wishlist.");
    }
  };

  const calculateSubtotal = useMemo(() => {
    return cartItems
      .reduce((total, item) => {
        const price =
          typeof item.product_price === "number" && !isNaN(item.product_price)
            ? item.product_price
            : 0;
        return total + price * item.quantity;
      }, 0)
      .toFixed(2);
  }, [cartItems]);

  return (
    <Layout>
      <section className="py-10 px-4">
        <div className="flex justify-center gap-[100px]">
          <div className="w-[40%]">
            <h1 className="text-3xl font-medium mb-6">Bag</h1>
            {cartItems.length === 0 ? (
              <p className="text-gray-500">
                Your cart is empty.{" "}
                <Link to="/" className="text-blue-500 hover:underline">
                  Continue shopping
                </Link>
                .
              </p>
            ) : (
              <div className="flex flex-col gap-6">
                {cartItems.map((item, index) => {
                  if (
                    !item.id ||
                    typeof item.product_price !== "number" ||
                    isNaN(item.product_price)
                  ) {
                    console.warn("Invalid cart item:", item);
                    return null; // Skip invalid items
                  }
                  // Calculate item total (subtotal - discount + tax)
                  const itemTotal =
                    item.product_price * item.quantity -
                      (item.discount || 0) +
                      (item.tax || 0) || 0;

                  return (
                    <div
                      key={`${item.id}-${item.selectedSize}-${index}`}
                      className="flex flex-col gap-4"
                    >
                      <div className="flex gap-3 ">
                        <div className="w-[250px] h-[200px]">
                          <img
                            src={`${imageBaseUrl}/storage/${
                              item.image || "placeholder-image.jpg"
                            }`}
                            alt={item.name || "Product Image"}
                            className=" w-full h-full object-cover rounded"
                            onError={(e) =>
                              (e.target.src = "/assets/placeholder-image.jpg")
                            }
                          />
                        </div>
                        <div className="flex justify-between w-full">
                          <div className="flex flex-col gap-1">
                            <h2 className="text-sm text-gray-600 capitalize">
                              {item.name || "Unknown Product"}
                            </h2>
                            <p className="text-sm text-gray-600 capitalize">
                              {item.color || "N/A"}
                            </p>
                            <p className="text-sm text-gray-600 capitalize">
                              {item.category || "N/A"}
                            </p>
                            <p className="text-sm text-gray-600">
                              Size: {item.selectedSize || "N/A"}
                            </p>
                          </div>
                          <div className="flex gap-5">
                            <p className="text-[16px] font-[600] line-through text-gray-600">
                              ${(item.product_price * item.quantity).toFixed(2)}
                            </p>
                            <div className="">
                              <p className="text-[16px] font-[600] text-gray-900">
                                ${itemTotal.toFixed(2)}
                              </p>
                              <Link
                                onClick={() => handleDeleteItem(item)}
                                className="p-1"
                                aria-label="Delete product"
                              >
                                <HiOutlineXMark className="text-4xl" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center gap-2 border border-gray-200 my-4 w-[130px] rounded-full py-2">
                          <button
                            onClick={() => handleDecreaseQuantity(item)}
                            className="px-2 py-1"
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <RiDeleteBin6Line className="text-2xl text-gray-400" />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => handleIncreaseQuantity(item)}
                            className="px-2 py-1"
                            aria-label="Increase quantity"
                          >
                            <IoAddSharp className="text-2xl text-gray-400" />
                          </button>
                        </div>
                        <button
                          className="p-1 border border-gray-200 rounded-full text-gray-400 text-sm"
                          onClick={() => handleMoveToWishlist(item)}
                          aria-label="Add to wishlist"
                        >
                          <CiHeart className="text-4xl text-gray-400" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="w-[400px]">
            <p className="text-[32px] font-[400]">Summary</p>
            <p className="text-[16px] font-[500] py-3 flex justify-between">
              Subtotal: <span>${calculateSubtotal}</span>
            </p>
            <div className="text-[16px] font-[500] border-t-1 py-3 flex justify-between">
              Total: <span>${calculateSubtotal}</span>
            </div>
            <Link
              to="/checkout"
              className="inline-block mt-4 bg-black text-white py-5 px-[169px] rounded-4xl hover:bg-gray-800"
            >
              Checkout
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CartPage;
