import React, { useEffect, useState } from 'react';
import { IoSearch } from "react-icons/io5";
import { useLocation, useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';

const Search = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const [isSearchPage, setIsSearchPage] = useState(false);
    const [query, setQuery] = useState("");

    useEffect(() => {
        setIsSearchPage(location.pathname === "/search");
    }, [location]);

    const redirectToSearchPage = () => {
        navigate("/search");
    };

    const handleSearch = (e) => {
        if (e.key === "Enter" && query.trim()) {
            console.log("Search:", query);
            // 👉 yaha API call / navigation kar sakte ho
        }
    };

    return (
        <div className='w-full min-w-[300px] lg:min-w-[420px] h-11 lg:h-12 rounded-lg border overflow-hidden flex items-center text-neutral-500 bg-slate-50 group focus-within:border-primary-200 transition'>
            
            {/* Search Icon */}
            <button className='flex justify-center items-center h-full px-3 group-focus-within:text-primary-200'>
                <IoSearch size={20} />
            </button>

            {/* Input / Animation */}
            <div className='w-full h-full'>
                {
                    !isSearchPage ? (
                        <div 
                            onClick={redirectToSearchPage} 
                            className='w-full h-full flex items-center cursor-pointer px-2'
                        >
                            <TypeAnimation
                                sequence={[
                                    'Search "milk"', 1000,
                                    'Search "bread"', 1000,
                                    'Search "sugar"', 1000,
                                    'Search "egg"', 1000,
                                    'Search "chocolate"', 1000,
                                    'Search "curd"', 1000,
                                    'Search "rice"', 1000,
                                    'Search "chips"', 1000,
                                    'Search "vegetables"', 1000,
                                ]}
                                wrapper="span"
                                speed={50}
                                repeat={Infinity}
                            />
                        </div>
                    ) : (
                        <input
                            type='text'
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleSearch}
                            placeholder='Search for atta, dal and more...'
                            autoFocus
                            className='bg-transparent w-full h-full outline-none px-2 text-black'
                        />
                    )
                }
            </div>
        </div>
    );
};

export default Search;