import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Layout from "../Layouts/Layout";
import { WishlistContext } from "../Contexts/WishlistContext";
import { CartContext } from "../Contexts/CartContext";

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist, getWishlistCount, clearWishlist } =
    useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const imageBaseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:8000";

  const handleAddToCart = (product) => {
    addToCart(product, null);
  };

  return (
    <Layout>
      <section className="py-20 px-5 bg-white">
        <div className="max-w-3xl mx-auto">
          <header className="mb-16">
            <h1 className="text-3xl font-normal tracking-tight mb-1">
              Wishlist
            </h1>
            <div className="text-xs">{getWishlistCount()} items</div>
          </header>

          {wishlistItems.length === 0 ? (
            <div className="text-center py-24">
              <p className="mb-8">No items in wishlist</p>
              <Link
                to="/"
                className="inline-block px-6 py-2 text-sm font-medium text-black border border-black rounded-4xl hover:bg-black hover:text-white transition-colors duration-300"
              >
                Return to shop
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-12 text-right  ">
                <button
                  onClick={clearWishlist}
                  className="px-4 py-2 text-sm font-medium text-red-600   border-red-600 rounded-4xl hover:underline  transition-colors duration-300"
                >
                  Clear all items
                </button>
              </div>

              <ul className="space-y-16">
                {wishlistItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-col sm:flex-row  "
                  >
                    <div className="flex w-full gap-10   bg-gray-50">
                      <img
                        src={`${imageBaseUrl}/storage/${item.image}`}
                        alt={item.name}
                        className="w-[200px] h-[200px]  object-cover"
                        onError={(e) =>
                          (e.target.src = "/placeholder-image.jpg")
                        }
                      />
                      <div>
                        <h2 className="text-lg mb-2">{item.name}</h2>
                        <div className="text-sm">
                          ${item.product_price.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="mt-6 flex gap-3">
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="flex-1 sm:flex-none px-6 py-3 text-sm font-medium text-white bg-black rounded-4xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-300"
                        >
                          Add to cart
                        </button>
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="flex-1 sm:flex-none px-6 py-3 text-sm font-medium text-black bg-white border border-black rounded-4xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-300"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-20 pt-8 border-t border-black">
                <Link
                  to="/"
                  className="inline-block px-6 py-2 text-sm font-medium text-black border border-black rounded-4xl hover:bg-black hover:text-white transition-colors duration-300"
                >
                  Continue shopping
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default WishlistPage;
