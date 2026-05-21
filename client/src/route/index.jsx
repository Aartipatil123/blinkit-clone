import { createBrowserRouter } from "react-router-dom"

import App from "../App"
import Home from "../pages/Home"
import SearchPage from "../pages/SearchPage"
import Login from "../pages/Login"
import Register from "../pages/Register"
import ForgotPassword from "../pages/ForgotPassword"
import OtpVerification from "../pages/OtpVerification"
import ResetPassword from "../pages/ResetPassword"
import UserMenuMobile from "../pages/UserMenuMobile"

import Dashboard from "../layouts/Dashboard"
import Profile from "../pages/Profile"
import MyOrders from "../pages/MyOrders"
import Address from "../pages/Address"

import CategoryPage from "../pages/CategoryPage"
import SubCategoryPage from "../pages/SubCategoryPage"
import UploadProduct from "../pages/UploadProduct"
import ProductAdmin from "../pages/ProductAdmin"
import AdminPermision from "../layouts/AdminPermision"
import ProductListPage from "../pages/ProductListPage"
import ProductDisplayPage from "../pages/ProductDisplayPage"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      /* Home Page */
      {
        path: "",
        element: <Home />
      },

      /* Search Page */
      {
        path: "search",
        element: <SearchPage />
      },

      /* Authentication Routes */
      {
        path: "login",
        element: <Login />
      },
      {
        path: "register",
        element: <Register />
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />
      },
      {
        path: "verification-otp",
        element: <OtpVerification />
      },
      {
        path: "reset-password",
        element: <ResetPassword />
      },

      /* Mobile User Menu */
      {
        path: "user-menu",
        element: <UserMenuMobile />
      },

      /* Dashboard Routes */
      {
        path: "dashboard",
        element: <Dashboard />,
        children: [
          {
            path: "profile",
            element: <Profile />
          },
          {
            path: "myorders",
            element: <MyOrders />
          },
          {
            path: "address",
            element: <Address />
          },

          /* Category Management */
          {
            path: "category",
            element: (
            <AdminPermision>
              <CategoryPage />
              </AdminPermision>
              )
            },
          {
            path: "subcategory",
            element: (
              <AdminPermision>
                <SubCategoryPage />
              </AdminPermision>
            )
          },

          /* Product Management */
          {
            path: "upload-product",
            element: (
              <AdminPermision>
                <UploadProduct />
              </AdminPermision>
            )
          },
          {
            path: "product",
            element: (
              <AdminPermision>
                <ProductAdmin />
              </AdminPermision>
            )
          }
        ]
      },
      {
        path : ":category/:subCategory",
        element : <ProductListPage/>
      },
      {
        path : "product/:product",
        element : <ProductDisplayPage/>
      }
    ]
  }
])

export default router