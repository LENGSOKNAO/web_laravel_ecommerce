import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Layout from "../Layouts/Layout";
import { WishlistContext } from "../Contexts/WishlistContext"; // Fixed path
import { CartContext } from "../Contexts/CartContext"; // Fixed path

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist, getWishlistCount, clearWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  console.log('WishlistContext in WishlistPage:', { wishlistItems, count: getWishlistCount() });

  const imageBaseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:8000";

  const handleAddToCart = (product) => {
    console.log('Adding to cart from wishlist:', { product });
    addToCart(product, null); // No size for wishlist items
  };

  return (
    <Layout>
      <section className="py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-semibold mb-6">Your Wishlist ({getWishlistCount()} items)</h1>
          {wishlistItems.length === 0 ? (
            <p className="text-gray-500">
              Your wishlist is empty. <Link to="/" className="text-blue-500 hover:underline">Continue shopping</Link>.
            </p>
          ) : (
            <div className="flex flex-col gap-6">
              {wishlistItems.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 border-b py-4"
                >
                  <img
                    src={`${imageBaseUrl}/storage/${item.image || 'placeholder-image.jpg'}`}
                    alt={item.name || 'Unknown Product'}
                    className="w-20 h-20 object-cover rounded"
                    onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                  />
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">{item.name || 'Unknown Product'}</h2>
                    <p className="text-gray-600">${item.product_price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <div className="mt-6">
                <button
                  onClick={clearWishlist}
                  className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                >
                  Clear Wishlist
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default WishlistPage;