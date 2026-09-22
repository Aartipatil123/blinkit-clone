import React, { useState } from "react";
import { FaCartShopping } from "react-icons/fa6";
import DisplayCartItem from "./DisplayCartItem";

const CartMobile = () => {
  const [openCart, setOpenCart] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpenCart(true)}
        className="fixed bottom-5 right-5 bg-green-600 text-white p-4 rounded-full shadow-lg z-40"
      >
        <FaCartShopping size={22} />
      </button>

      {openCart && (
        <DisplayCartItem close={() => setOpenCart(false)} />
      )}
    </>
  );
};

export default CartMobile;