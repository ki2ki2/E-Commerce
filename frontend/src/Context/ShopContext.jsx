import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
  let cart = {};
  for (let index = 0; index <= 300; index++) {
    cart[index] = 0;
  }
  return cart;
};

const ShopContextProvider = (props) => {
  const [all_product, setAll_Product] = useState([]);
  const [cartItems, setCartItems] = useState(getDefaultCart());

  useEffect(() => {
    // Fetch all products
    fetch('https://e-commerce-backend-c6zo.onrender.com/allproducts')
      .then((response) => response.json())
      .then((data) => setAll_Product(data))
      .catch((error) => console.error('Error fetching products:', error));

    // Fetch cart data if the user is authenticated
    if (localStorage.getItem('auth-token')) {
      fetch('https://e-commerce-backend-c6zo.onrender.com/getcart', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'auth-token': `${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json',
        },
        body: "", // No body needed
      })
        .then((response) => response.json())
        .then((data) => setCartItems(data))
        .catch((error) => console.error('Error fetching cart:', error));
    }
  }, []);

  const addToCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] + 1 || 1, // Ensure first-time add works
    }));

    if (localStorage.getItem('auth-token')) {
      fetch('https://e-commerce-backend-c6zo.onrender.com/addtocart', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'auth-token': `${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId }),
      })
        .then((response) => response.json())
        .then((data) => console.log('Add to Cart:', data))
        .catch((error) => console.error('Error adding to cart:', error));
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: Math.max(prev[itemId] - 1, 0), // Ensure cart can't go negative
    }));

    if (localStorage.getItem('auth-token')) {
      fetch('https://e-commerce-backend-c6zo.onrender.com/removefromcart', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'auth-token': `${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId }),
      })
        .then((response) => response.json())
        .then((data) => console.log('Remove from Cart:', data))
        .catch((error) => console.error('Error removing from cart:', error));
    }
  };

  const clearCart = () => {
    if (localStorage.getItem('auth-token')) {
      fetch('https://e-commerce-backend-c6zo.onrender.com/clearcart', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'auth-token': `${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Cart cleared:', data);
          setCartItems(getDefaultCart()); // Reset the cart in the frontend
        })
        .catch((error) => console.error('Error clearing cart:', error));
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = all_product.find((product) => product.id === Number(item));
        if (itemInfo) {
          totalAmount += cartItems[item] * itemInfo.new_price;
        }
      }
    }
    return totalAmount;
  };

  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item];
      }
    }
    return totalItem;
  };

  const contextValue = {
    all_product,
    cartItems,
    getTotalCartItems,
    getTotalCartAmount,
    addToCart,
    removeFromCart,
    clearCart, // Provide clearCart to the context
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
