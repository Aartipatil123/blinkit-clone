import React from "react";

const ProductCardAdmin = ({ data }) => {

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-3">

      {/* IMAGE */}
      <div className="w-full h-44 bg-gray-100 rounded-lg overflow-hidden">

        <img
          src={data?.image?.[0]}
          alt={data?.name}
          className="w-full h-full object-contain"
        />

      </div>

      {/* CONTENT */}
      <div className="mt-3 space-y-1">

        {/* PRODUCT NAME */}
        <h2 className="font-semibold text-lg line-clamp-1">
          {data?.name}
        </h2>

        {/* UNIT */}
        <p className="text-sm text-gray-500">
          {data?.unit}
        </p>

        {/* PRICE */}
        <div className="flex items-center gap-2">

          <p className="text-lg font-bold text-green-600">
            ₹ {data?.price}
          </p>

          {
            data?.discount > 0 && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                {data?.discount}% OFF
              </span>
            )
          }

        </div>

        {/* STOCK */}
        <p className="text-sm text-gray-600">
          Stock : {data?.stock}
        </p>

      </div>

    </div>
  );
};

export default ProductCardAdmin;