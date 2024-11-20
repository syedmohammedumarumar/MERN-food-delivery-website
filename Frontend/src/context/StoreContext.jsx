import { createContext, useState, useEffect } from "react";
import { food_list } from "../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItem, setCartItem] = useState({});
  const url='http://localhost:4000'

  const addToCart = (itemId) => {
    setCartItem((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const removeFromCart = (itemId) => {
    setCartItem((prev) => {
      if (prev[itemId] <= 1) {
        const newCart = { ...prev };
        delete newCart[itemId];
        return newCart;
      }
      return { ...prev, [itemId]: prev[itemId] - 1 };
    });
  };

  const getTotalCartAmount=()=>{
    let totalAmount=0;
    for(const item in cartItem){
     if (cartItem[item]>0) {
      let itemInfo=food_list.find((product)=>product._id===item);
      totalAmount+=itemInfo.price*cartItem[item];
     }
    }
    return totalAmount;
  }

  const contextValue = {
    food_list,
    cartItem,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
