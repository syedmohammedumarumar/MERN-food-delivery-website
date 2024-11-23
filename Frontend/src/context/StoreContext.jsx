import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItem, setCartItem] = useState({});
  const [food_list, setFoodList] = useState([]);
  const [token, setToken] = useState("");
  const url = "http://localhost:4000";

  // Add item to the cart
  const addToCart = async (itemId) => {
    try {
      if (!cartItem[itemId]) {
        setCartItem((prev) => ({ ...prev, [itemId]: 1 }));
      } else {
        setCartItem((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
      }
      if (token) {
        await axios.post(`${url}/api/cart/add`, { itemId }, { headers: { token } });
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  // Remove item from the cart
  const removeFromCart = async (itemId) => {
    try {
      if (cartItem[itemId] > 1) {
        setCartItem((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
      } else {
        setCartItem((prev) => {
          const updatedCart = { ...prev };
          delete updatedCart[itemId];
          return updatedCart;
        });
      }
      if (token) {
        await axios.post(`${url}/api/cart/remove`, { itemId }, { headers: { token } });
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  // Get total cart amount
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItem) {
      if (cartItem[item] > 0) {
        const itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItem[item];
        }
      }
    }
    return totalAmount;
  };

  // Fetch food list
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      setFoodList(response.data.data);
    } catch (error) {
      console.error("Error fetching food list:", error);
    }
  };

  // Load cart data
  const loadCartData = async (token) => {
    try {
      const response = await axios.post(
        `${url}/api/cart/get`,
        {},
        { headers: { token } }
      );
      setCartItem(response.data.cartData || {});
    } catch (error) {
      console.error("Error loading cart data:", error);
    }
  };

  // useEffect for initial data loading
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchFoodList();
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
          await loadCartData(storedToken);
        }
      } catch (error) {
        console.error("Error during initial data loading:", error);
      }
    };
    loadData();
  }, []);

  // Context value to share across components
  const contextValue = {
    food_list,
    cartItem,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    token,
    setToken,
    url,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
