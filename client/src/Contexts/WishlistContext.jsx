import React, { createContext, useState, useEffect } from "react";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const savedWishlist = localStorage.getItem("wishlist");
      console.log("Loaded wishlist from localStorage:", savedWishlist);
      if (!savedWishlist) return [];
      const parsedWishlist = JSON.parse(savedWishlist);
      const validWishlist = parsedWishlist.filter(
        (item) =>
          item.id &&
          typeof item.product_price === "number" &&
          !isNaN(item.product_price) &&
          item.name
      );
      console.log("Validated wishlist items:", validWishlist);
      return validWishlist;
    } catch (error) {
      console.error("Failed to parse wishlist from localStorage:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
      console.log("Saved wishlist to localStorage:", wishlistItems);
    } catch (error) {
      console.error("Failed to save wishlist to localStorage:", error);
    }
  }, [wishlistItems]);

  const addToWishlist = (product, size = null) => {
    console.log("Adding to wishlist:", { product, size });
    if (
      !product.id ||
      typeof product.product_price !== "number" ||
      isNaN(product.product_price) ||
      !product.name
    ) {
      console.warn("Invalid product data, skipping add to wishlist:", product);
      return;
    }
    setWishlistItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === product.id && item.size === size
      );
      if (existingItem) {
        console.log("Item already in wishlist:", { product, size });
        return prevItems; // Prevent duplicates
      }
      return [...prevItems, { ...product, size }];
    });
  };

  const removeFromWishlist = (productId) => {
    console.log("Removing from wishlist:", { productId });
    setWishlistItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  const getWishlistCount = () => {
    console.log("wishlistItems in getWishlistCount:", wishlistItems);
    return Array.isArray(wishlistItems) ? wishlistItems.length : 0;
  };

  const clearWishlist = () => {
    console.log("Clearing wishlist");
    setWishlistItems([]);
    localStorage.removeItem("wishlist");
  };

  console.log("WishlistProvider rendering with wishlistItems:", wishlistItems);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        getWishlistCount,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};