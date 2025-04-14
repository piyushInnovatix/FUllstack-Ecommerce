import { faBookmark, faCartShopping, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { use, useContext, useEffect, useState } from 'react'
import axios from 'axios';
import '/src/index.css'
import { Link } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';

function Home() {

    const [product, setProduct] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const response = await fetch('https://ecom-kl8f.onrender.com/api/v1/product');
                const data = await response.json();
                setProduct(data.products);
            }
            catch (error) {
                console.log(error);
                setError(error);
            }
        }

        loadProducts()
    }, [])

    const generateStars = (rating) => {
        const stars = [];

        for (let i = 0; i < Math.floor(rating); i++) {
            stars.push(
                <FontAwesomeIcon icon={faStar} className='text-yellow-400 text-sm' key={i} size='lg' />
            )
        }
        return stars;
    }

    const handleCart = async (productId) => {
        try {

            const token = localStorage.getItem("authToken")

            const selectedProduct = product.find((item) => item._id === productId);
            const response = await axios.post(`https://ecom-kl8f.onrender.com/api/v1/cart/${productId}`, {
                productId: selectedProduct._id,
                quantity: 1, 
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Product added to cart:', response.data);
            alert("Product Added to Cart")
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    };

    // const handleRemoveFromCart = async (productId) => {
    //     try {
    //         const response = await axios.delete(`https://ecom-kl8f.onrender.com/api/v1/cart/${productId}`);
    //         console.log('Product removed from cart:', response.data);
    //     } catch (error) {
    //         console.error('Error removing product from cart:', error);
    //     }
    // };

    const handleFavs = async (productId) => {
        try {
            const selectedProduct = product.find((item) => item._id === productId);
            const response = await axios.post('https://ecom-kl8f.onrender.com/api/v1/favorites', {
                productId: selectedProduct._id,
            });
            console.log('Product added to favorites:', response.data);
        } catch (error) {
            console.error('Error adding product to favorites:', error);
        }
    };

    return (
        <div className='pt-28 pb-10'>

            {error && <div className="text-center">{error}</div>}

            <div className="grid grid-cols-2 lg:gap-4 lg:grid-cols-3 xl:mx-52 font-poppins" id="#offers">
                {product.map((product) => (
                    <div
                        key={product._id}
                        className="product-card text-center relative lg:py-6 bg-white m-2 p-3 rounded-xl text-lg border border-purple-100  transition-shadow duration-300"
                    >
                        <div className='btn-container opacity-0 pointer-events-none flex-col absolute top-2 right-3'>
                            <FontAwesomeIcon
                                onClick={() => handleCart(product._id)}
                                className="text-purple-800 bg-purple-200 w-[45%] m-2 p-2 rounded-full text-xs hover:scale-105 transform-transition duration-300"
                                icon={faCartShopping} size='lg'
                            />
                            <FontAwesomeIcon
                                onClick={() => handleFavs(product._id)}
                                className="text-purple-800 bg-purple-200 w-[45%] m-2 p-2 rounded-full text-xs hover:scale-105 transform-transition duration-300"
                                icon={faBookmark} size='lg'
                            />
                        </div>

                        <img
                            src={product.productImages[0]?.url}
                            alt={product.name}
                            className="h-48 mx-auto p-8 md:p-4 rounded-lg object-fill mb-4"
                        />
                        <Link to={`/product/${product._id}`}
                            state={{
                                name: product.name,
                                image: product.productImages[0]?.url,
                                price: product.price,
                                description: product.description,
                                stars: product.ratings,
                                reviews: product.numReviews
                            }} >
                            <h3 className="font-semibold text-gray-800 text-lg md:text-2xl line-clamp-1 my-2">
                                {product.name}
                            </h3>
                        </Link>
                        <p className="text-gray-800 font-semibold text-lg lg:text-xl">Price: <span className='text-gray-500'>₹{product.price}</span></p>
                        <div className='flex justify-center items-center my-3'>
                            <div className='flex justify-center my-2'>{generateStars(product.ratings)}</div>
                            <p className='ms-2 text-gray-700'>({product.ratings}<span className='hidden lg:blocj'>Reviews</span>)</p>
                        </div>

                        <div className="flex justify-between mt-2 lg:hidden">
                            <FontAwesomeIcon
                                onClick={() => handleCart(product._id)}
                                className="text-white bg-purple-800 w-[45%] mx-2 p-2 rounded-xl text-xs hover:scale-105 transform-transition duration-300"
                                icon={faCartShopping} size='sm'
                            />
                            <FontAwesomeIcon
                                onClick={() => handleFavs(product._id)}
                                className="text-white bg-purple-800 w-[45%] mx-2 p-2 rounded-xl text-xs hover:scale-105 transform-transition duration-300"
                                icon={faBookmark} size='sm'
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Home