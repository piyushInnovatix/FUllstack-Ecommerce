import { faFacebook, faInstagram, faPinterest } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

function Footer() {
    return (
        <div id="contact" className="bg-[#f2edf7] py-10 font-poppins">
            <div className="m-4 flex flex-col items-center text-center">
                <a href="#">
                    <img src="/public/logo.png" alt="" className="w-48 py-4" />
                </a>
                <h1 className='text-xl'>Shop confidently with clickSHOP.com</h1>
                <div className="ms-5 mt-2 flex justify-center">
                    <a
                        className="text-gray-500 hover:text-[#49118a] rounded-full transition-all duration-100 text-2xl"
                        href="https://www.instagram.com/"
                        target="_blank"
                    >
                        <FontAwesomeIcon className="m-3" icon={faFacebook} />
                    </a>
                    <a
                        className="text-gray-500 hover:text-[#49118a] rounded-full transition-all duration-100 text-2xl"
                        href="https://www.instagram.com/"
                        target="_blank"
                    >
                        <FontAwesomeIcon className="m-3" icon={faInstagram} />
                    </a>
                    <a
                        className="text-gray-500 hover:text-[#49118a] rounded-full transition-all duration-100 text-2xl"
                        href="https://www.instagram.com/"
                        target="_blank"
                    >
                        <FontAwesomeIcon className="m-3" icon={faPinterest} />
                    </a>
                </div>
            </div>
            <div className="text-center flex justify-center font-semibold text-lg lg:text-xl mx-5 space-y-5">
                <h1 className='mx-4'>About Us</h1>
                <h1 className='mx-4'>Shop</h1>
                <h1 className='mx-4'>FAQs</h1>
                <h1 className='mx-4'>Contact</h1>
            </div>

            <div className='flex justify-around flex-col lg:flex-row items-center'>
                <div className="text-center flex text-sm lg:text-xl mx-5 space-y-4 text-gray-700">
                    <h1 className='mx-2'>Terms & Conditions</h1>
                    <h1 className='mx-2'>Privacy Policy</h1>
                    <h1 className='mx-2'>Refund & Return</h1>
                </div>
                <div className="text-center flex text-sm lg:text-xl mx-5 space-y-4 text-gray-700">
                    Copyright 2025 Innovatix. All rights reserved.
                </div>
            </div>

        </div>
    )
}

export default Footer