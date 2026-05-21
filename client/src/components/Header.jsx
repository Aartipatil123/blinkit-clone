import React, { useState, useEffect, useRef } from 'react';
import logo from '../assets/logo.png';
import Search from './Search';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegCircleUser } from "react-icons/fa6";
import useMobile from '../hooks/useMobile';
import { TiShoppingCart } from "react-icons/ti";
import { useSelector } from 'react-redux';
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import UserMenu from './UserMenu';

const Header = () => {
  const [isMobile] = useMobile();
  const navigate = useNavigate();

  const user = useSelector((state) => state?.user);

  // Desktop dropdown only
  const [openUserMenu, setOpenUserMenu] = useState(false);

  const menuRef = useRef();

  useEffect(() => {
    console.log("Redux User Data :", user);
  }, [user]);

  // Outside click → close desktop dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpenUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const redirectToLoginPage = () => {
    navigate("/login");
  };

  // ✅ Mobile user handling
  const handleMobileUser = () => {
    if (!user?._id) {
      navigate("/login");
    } else {
      // Mobile me dropdown nahi, alag page open hoga
      navigate("/user-menu");
    }
  };

  return (
    <header className='shadow-md sticky top-0 bg-white z-50'>
      <div className='container mx-auto px-4 py-3 flex items-center justify-between gap-4'>

        {/* Logo */}
        <Link to="/" className='flex items-center'>
          <img
            src={logo}
            alt='logo'
            className='h-10 lg:h-12 object-contain'
          />
        </Link>

        {/* Desktop Search */}
        {!isMobile && (
          <div className='flex-1 max-w-xl'>
            <Search />
          </div>
        )}

        <div className='flex items-center gap-4'>

          {/* ✅ Mobile User Icon */}
          <div className='lg:hidden'>
            <button
              onClick={handleMobileUser}
              className='text-neutral-700'
            >
              <FaRegCircleUser size={26} />
            </button>
          </div>

          {/* Desktop Section */}
          <div className='hidden lg:flex items-center text-sm font-medium gap-10'>

            {
              user?._id ? (
                <div className='relative' ref={menuRef}>

                  {/* Account Button */}
                  <div
                    onClick={() => setOpenUserMenu(!openUserMenu)}
                    className='flex items-center gap-2 cursor-pointer'
                  >
                    <p>Account</p>

                    {
                      openUserMenu ? (
                        <GoTriangleUp size={20} />
                      ) : (
                        <GoTriangleDown size={20} />
                      )
                    }
                  </div>

                  {/* Desktop Dropdown */}
                  {
                    openUserMenu && (
                      <div className='absolute right-0 top-12 z-50'>
                        <div className='bg-white rounded-lg p-4 min-w-52 shadow-lg border'>
                          <UserMenu />
                        </div>
                      </div>
                    )
                  }

                </div>
              ) : (
                <button
                  onClick={redirectToLoginPage}
                  className='text-lg px-2 font-semibold'
                >
                  Login
                </button>
              )
            }

            {/* Cart Button */}
            <button className='flex items-center gap-2 bg-green-800 hover:bg-green-700 px-4 py-3 rounded text-white'>
              <div className='animate-bounce'>
                <TiShoppingCart size={26} />
              </div>

              <div>
                <p>My Cart</p>
              </div>
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Search */}
      {isMobile && (
        <div className='px-4 pb-3'>
          <Search />
        </div>
      )}
    </header>
  );
};

export default Header;