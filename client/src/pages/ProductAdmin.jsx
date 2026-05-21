import { useEffect, useState } from "react";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import Loading from "../components/Loading";
import ProductCardAdmin from "../components/ProductCardAdmin";
import { IoSearchOutline } from "react-icons/io5";
import { FiPackage } from "react-icons/fi";

const ProductAdmin = () => {

  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // ================= FETCH PRODUCT =================
  const fetchProductData = async () => {

    try {

      setLoading(true);

      const response = await Axios({
        ...SummaryApi.getProduct,
        data: {
          page: page,
          limit: 12
        }
      });

      const { data: responseData } = response;

      if (responseData.success) {

        setProductData(responseData.data);
        setTotalPageCount(responseData.totalNoPage);
      }

    } catch (error) {

      AxiosToastError(error);

    } finally {

      setLoading(false);
    }
  };

  // ================= LOAD DATA =================
  useEffect(() => {

    fetchProductData();

  }, [page]);

  // ================= SEARCH FILTER =================
  const filteredProducts = productData.filter((product) =>
    product?.name?.toLowerCase().includes(search.toLowerCase())
  );

  // ================= NEXT PAGE =================
  const handleNext = () => {

    if (page < totalPageCount) {
      setPage((prev) => prev + 1);
    }
  };

  // ================= PREVIOUS PAGE =================
  const handlePrevious = () => {

    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 p-4 md:p-6">

      {/* HEADER */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-5 mb-6">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          {/* LEFT */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              
              <div className="bg-blue-100 p-3 rounded-2xl">
                <FiPackage className="text-blue-600 text-2xl" />
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800">
                  Products
                </h2>

                <p className="text-gray-500 text-sm">
                  Manage and monitor all products easily
                </p>
              </div>

            </div>
          </div>

          {/* SEARCH */}
          <div className="w-full lg:w-[420px]">

            <div className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 flex items-center gap-3 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all duration-300">

              <IoSearchOutline
                size={22}
                className="text-gray-400"
              />

              <input
                type="text"
                placeholder="Search products here..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
              />

            </div>

          </div>

        </div>

      </div>

      {/* LOADING */}
      {
        loading && (
          <Loading />
        )
      }

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">

        {
          filteredProducts.map((p) => {

            return (
              <div
                key={p._id}
                className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <ProductCardAdmin data={p} />
              </div>
            );
          })
        }

      </div>

      {/* EMPTY STATE */}
      {
        filteredProducts.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20">

            <div className="bg-gray-100 p-5 rounded-full mb-4">
              <FiPackage className="text-5xl text-gray-400" />
            </div>

            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              No Products Found
            </h2>

            <p className="text-gray-500">
              Try searching with another keyword
            </p>

          </div>
        )
      }

      {/* PAGINATION */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-10 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">

        {/* PREVIOUS */}
        <button
          onClick={handlePrevious}
          disabled={page === 1}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300
            ${
              page === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-50 text-blue-600 hover:bg-blue-100"
            }`}
        >
          Previous
        </button>

        {/* PAGE */}
        <div className="bg-gray-100 px-6 py-3 rounded-xl font-bold text-gray-700">
          Page {page} of {totalPageCount}
        </div>

        {/* NEXT */}
        <button
          onClick={handleNext}
          disabled={page === totalPageCount}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300
            ${
              page === totalPageCount
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
            }`}
        >
          Next
        </button>

      </div>

    </section>
  );
};

export default ProductAdmin;