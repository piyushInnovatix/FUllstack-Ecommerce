import React, { useState } from 'react'
import logo from '/public/logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBookmark, faCartShopping, faUserLarge, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faInstagram, faPinterest } from "@fortawesome/free-brands-svg-icons";
import { Link } from 'react-router-dom';

function Navbar() {

    const [isOpen, SetisOpen] = useState(false)

    const handleClick = () => {
        SetisOpen(!isOpen)
    }

    return (
        <div>
            <div className="fixed w-full flex z-10 justify-between md:justify-around items-center p-2 bg-white shadow-xl font-poppins">
                <Link to="/">
                    <img src={logo} alt="" className='w-44' />
                </Link>

                <div className="flex items-center">
                    <Link to='/' className="home p-4 hidden md:block">
                        Shop
                    </Link>
                    <a href="#" className="categories p-4 hidden md:block">
                        About Us
                    </a>
                    <a href="#" className="categories p-4 hidden md:block">
                        FAQs
                    </a>
                    <a href="#" className="categories p-4 hidden md:block">
                        Contact Us
                    </a>
                </div>

                <div className="flex items-center">
                    <Link to="/wishlist">
                        <FontAwesomeIcon
                            className="navIcons mx-3 text-gray-400 hover:text-purple-900 transition-all duration-100"
                            icon={faBookmark} size='lg'
                        />
                    </Link>
                    <Link to="/cart">
                        <FontAwesomeIcon
                            className="navIcons mx-3 text-gray-400 hover:text-purple-900 transition-all duration-100"
                            icon={faCartShopping} size='lg'
                        />
                    </Link>
                    <Link to="/profile">
                        <FontAwesomeIcon
                            className="navIcons mx-3 text-gray-400 hover:text-purple-900 transition-all duration-100"
                            icon={faUserLarge} size='lg'
                        />
                    </Link>
                    <div className='block md:hidden' onClick={handleClick}>
                        <FontAwesomeIcon
                            className="barIcons mx-3 text-purple-900"
                            icon={faBars} size='lg'
                        />
                    </div>
                </div>
            </div>

            <div className={`font-poppins fixed top-0 right-0 h-screen w-[80%] bg-white z-40 shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className='float-right' onClick={handleClick}>
                    <FontAwesomeIcon icon={faXmark} size='2x' className='p-4 text-purple-900' />
                </div>

                <div className='text-2xl p-4 pt-28'>
                    <ul className='flex flex-col gap-4 font-semibold'>
                        <li className='border-b border-purple-100 pb-4'>Shop</li>
                        <li className='border-b border-purple-100 pb-4'>About Us</li>
                        <li className='border-b border-purple-100 pb-4'>FAQs</li>
                        <li>Contact Us</li>
                    </ul>
                </div>
                <div className='flex jusitfy-between pt-10'>
                    <div className='block'>
                        <FontAwesomeIcon
                            className="navIcons mx-3 text-purple-900"
                            icon={faFacebook} size='xl'
                        />
                    </div>

                    <div className='block'>
                        <FontAwesomeIcon
                            className="navIcons mx-3 text-purple-900"
                            icon={faPinterest} size='xl'
                        />
                    </div>

                    <div className='block'>
                        <FontAwesomeIcon
                            className="navIcons mx-3 text-purple-900"
                            icon={faInstagram} size='xl'
                        />
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Navbar