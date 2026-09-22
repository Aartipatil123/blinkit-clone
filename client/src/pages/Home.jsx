import React from "react";
import banner from "../assets/Banner.png";
import bannerMobile from "../assets/Banner-mobile.png";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { valideURLConvert } from "../utils/valideURLConvert";
import CategoryWiseProductDisplay from "../components/CategoryWiseProductDisplay";

const Home = () => {
  const loadingCategory = useSelector(
    (state) => state.product.loadingCategory
  );

  const categoryData = useSelector(
    (state) => state.product.allCategory
  );

  const subCategoryData = useSelector(
    (state) => state.product.allSubCategory
  );

  const navigate = useNavigate();

  const handleRedirectProductListpage = (id, cat) => {
    const subcategory = subCategoryData.find((sub) =>
      sub.category.some((c) => c._id === id)
    );

    // Prevent error if no subcategory exists
    if (!subcategory) return;

    const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(
      subcategory.name
    )}-${subcategory._id}`;

    navigate(url);
  };

  return (
    <section className="bg-gray-50 min-h-screen">
      {/* Banner */}
      <div className="container mx-auto px-2 lg:px-4 py-3">
        <div
          className={`overflow-hidden rounded-2xl shadow-lg ${
            !banner ? "animate-pulse bg-blue-100" : ""
          }`}
        >
          <img
            src={banner}
            alt="Banner"
            className="hidden lg:block w-full object-cover"
          />

          <img
            src={bannerMobile}
            alt="Banner"
            className="block lg:hidden w-full object-cover"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-xl lg:text-2xl font-bold mb-5 text-gray-800">
          Shop by Category
        </h2>

        <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-4">
          {loadingCategory
            ? new Array(10).fill(null).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-3 shadow animate-pulse"
                >
                  <div className="bg-gray-200 h-20 rounded-lg mb-3"></div>
                  <div className="bg-gray-200 h-4 rounded"></div>
                </div>
              ))
            : categoryData.map((cat) => (
                <div
                  key={cat._id}
                  onClick={() =>
                    handleRedirectProductListpage(cat._id, cat.name)
                  }
                  className="bg-white rounded-xl shadow hover:shadow-xl transition-all duration-300 cursor-pointer p-3 flex flex-col items-center hover:-translate-y-1"
                >
                  <div className="w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <p className="mt-2 text-xs lg:text-sm font-medium text-center text-gray-700">
                    {cat.name}
                  </p>
                </div>
              ))}
        </div>
      </div>

      {/* Category Wise Products */}
      <div className="space-y-8 pb-8">
        {categoryData.map((category) => (
          <CategoryWiseProductDisplay
            key={category._id}
            id={category._id}
            name={category.name}
          />
        ))}
      </div>
    </section>
  );
};

export default Home;