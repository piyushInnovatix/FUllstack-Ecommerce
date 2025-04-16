import React, { useContext, useEffect, useState } from 'react';
import CartContext from '../Context/context';
import wishImage from '/public/wish-image.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Wishlist() {

    const { favItems = [], setFavItems = () => { }, cartItems = [], setcartItems = () => { }, itemNum, setitemNum } = useContext(CartContext);

    const [wishList, setWishlist] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const loadWishlist = async () => {
            try {
                const token = localStorage.getItem('authToken'); // Retrieve token for authentication
                const response = await fetch('https://ecom-kl8f.onrender.com/api/auth/user/watchlist', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`, // Add Authorization header
                    },
                });
                const data = await response.json();
                setWishlist(data.data.products || []); // Set cart items from API response
                setLoading(false);
            } catch (error) {
                console.error('Error fetching cart items:', error);
                setError('Failed to load cart items. Please try again later.');
                setLoading(false);
            }
        };

        loadWishlist();
    }, [])

    const generateStars = (rating) => {
        const stars = [];
        for (let i = 0; i < Math.floor(rating); i++) {
            stars.push(
                <FontAwesomeIcon icon={faStar} className='text-yellow-400' mx-2 />
            )
        }
        return stars;
    }

    useEffect(() => {
        const totalItems = favItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
        setitemNum(totalItems);
    }, [favItems, setitemNum]);

    const handleCart = async (productId) => {
        try {

            const token = localStorage.getItem("authToken")
            if (!token) {
                alert("You need to log in to add products to cart!");
                return;
            }
            else {
                const selectedProduct = wishList.find((item) => item._id === productId);
                const response = await axios.post(`https://ecom-kl8f.onrender.com/api/cart/${productId}`, {
                    productId: selectedProduct._id,
                    quantity: 1,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log('Product added to cart:', response.data);
                alert("Products Moved to Cart")
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    };

    const removeItem = async (productId) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`https://ecom-kl8f.onrender.com/api/auth/user/watchlist/${productId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const updatedItems = cartItems.filter((item) => item.product._id !== productId);
                setWishlist(updatedItems);
                alert("Removed item from the wishlist")
            } else {
                console.error('Failed to remove item');
            }
        } catch (error) {
            console.error('Error removing item:', error);
        }

        window.location.reload()
    };

    return (
        <div className="py-32 xl:mx-44 font-poppins">
            {/* Empty Cart */}
            {loading && (
                <div className="pt-20 flex items-center justify-center h-screen">
                <div className="text-center py-8 px-6 bg-white rounded-lg shadow-md">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                  <p className="text-lg text-gray-700">Loading Wishlist Items...</p>
                </div>
              </div>
            )}
            {error && (
                // Error State
                <div className="text-center py-10 px-6">
                    <h1 className="text-lg md:text-xl text-red-500 mt-4">{error}</h1>
                </div>
            )}
            {wishList.length === 0 ? (
                <div className="text-center py-10 px-6">
                    <img src={wishImage} alt="Empty Cart" className="w-32 md:w-48 mx-auto" />
                    <h1 className="text-lg md:text-xl text-gray-700 mt-4">
                        Your cart looks empty! Start adding some items to brighten it up. 🎉
                    </h1>
                    <Link
                        to="/"
                        className="bg-purple-900 text-white py-2 px-4 mt-4 inline-block rounded text-sm md:text-base"
                    >
                        Browse Products
                    </Link>
                </div>
            ) : (
                // Cart Items List
                <div className='lg:flex items-start'>
                    <div className='cart-products flex-1'>
                        {wishList.map((item) => (
                            <div
                                key={item.id}
                                className="flex flex-wrap md:flex-nowrap justify-center items-center product-card bg-white border border-purple-100 mx-6 my-6 p-6 md:p-8 rounded-xl gap-6"
                            >
                                {/* Product Image */}
                                <img
                                    src={item.productImages[0]?.url}
                                    alt={item.name}
                                    className="w-28 md:w-32 lg:w-40 rounded-xl aspect-square"
                                />

                                {/* Product Details */}
                                <div className="flex-1 text-center md:text-left">
                                    <h2 className="text-lg md:text-2xl lg:text-3xl my-2 font-semibold line-clamp-2">
                                        {item.name}
                                    </h2>
                                    <p className="text-md md:text-xl my-2 text-gray-600">
                                        Price:{" "}
                                        <span className="text-black font-medium ml-4">
                                            ₹{item.price}
                                        </span>
                                    </p>
                                    <div className="my-4 flex justify-between">
                                        <div>
                                            {generateStars(item.ratings || 0)}
                                        </div>
                                        <div className="flex gap-4 items-end">
                                            <button
                                                onClick={() => handleCart(item._id)}
                                                className="bg-teal-600 text-white py-2 px-4 text-sm md:text-base rounded-lg"
                                            >
                                                Add to Cart
                                            </button>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="bg-red-500 text-white py-2 px-4 text-sm md:text-base rounded-lg"
                                            >
                                                Delete from Wishlist
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div >
    )
}

export default Wishlist