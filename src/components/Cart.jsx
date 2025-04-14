import React, { useEffect, useState } from 'react';
import cartImage from '/public/empty-cart.png';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

function Cart() {
    const [cartItems, setCartItems] = useState([]); // State to store cart items
    const [error, setError] = useState('');
    const [summary, setSummary] = useState()
    const [loading, setLoading] = useState(true); // State to handle loading
    const [itemNum, setItemNum] = useState(0); // State to track total items

    // Fetch cart items from the API
    useEffect(() => {
        const loadCartItems = async () => {
            try {
                const token = localStorage.getItem('authToken'); // Retrieve token for authentication
                const response = await fetch('https://ecom-kl8f.onrender.com/api/v1/cart', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Add Authorization header
                    },
                });
                const data = await response.json();
                setSummary(data.cart)
                setCartItems(data.cart.items || [] ); // Set cart items from API response
                setLoading(false);
            } catch (error) {
                console.error('Error fetching cart items:', error);
                setError('Failed to load cart items. Please try again later.');
                setLoading(false);
            }
        };

        loadCartItems();
    }, []);

    // Update quantity of a cart item
    const updateQuantity = async (id, quantity) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`https://ecom-kl8f.onrender.com/api/v1/cart/update`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ quantity: Math.max(1, quantity) }), // Ensure quantity is at least 1
            });

            if (response.ok) {
                const updatedCart = cartItems.map((item) =>
                    item._id === id ? { ...item, quantity: Math.max(1, quantity) } : item
                );
                setCartItems(updatedCart);
            } else {
                console.error('Failed to update quantity');
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    // Remove an item from the cart
    const removeItem = async (productId) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`https://ecom-kl8f.onrender.com/api/v1/cart/remove/${productId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const updatedItems = cartItems.filter((item) => item._id !== productId);
                setCartItems(updatedItems);
            } else {
                console.error('Failed to remove item');
            }
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    return (
        <div className="py-32 xl:mx-44 font-poppins">
            {/* Loading State */}
            {loading ? (
                <div className="text-center py-10 px-6">
                    <h1 className="text-lg md:text-xl text-gray-700 mt-4">Loading cart items...</h1>
                </div>
            ) : error ? (
                // Error State
                <div className="text-center py-10 px-6">
                    <h1 className="text-lg md:text-xl text-red-500 mt-4">{error}</h1>
                </div>
            ) : cartItems.length === 0 ? (
                // Empty Cart
                <div className="text-center py-10 px-6">
                    <img src={cartImage} alt="Empty Cart" className="w-32 md:w-48 mx-auto" />
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
                <div className="lg:flex items-start">
                    <div className="cart-products lg:flex-2 overflow-visible lg:overflow-scroll lg:overflow-x-hidden lg:h-[50rem]">
                        {cartItems.map((item) => (
                            <div
                                key={item._id}
                                className="flex flex-wrap md:flex-nowrap justify-center items-center product-card bg-white border border-purple-100 mx-6 my-6 p-6 md:p-8 rounded-xl gap-6"
                            >
                                {/* Product Image */}
                                <img
                                    src={item.product.productImages[0]?.url}
                                    alt={item.name}
                                    className="w-28 md:w-32 lg:w-40 rounded-xl aspect-square"
                                />

                                {/* Product Details */}
                                <div className="flex-1 text-center md:text-left">
                                    <h2 className="text-lg md:text-2xl lg:text-3xl my-2 font-semibold line-clamp-2">
                                        {item.product.name}
                                    </h2>
                                    <p className="text-md md:text-xl my-2 text-gray-600">
                                        Price:{" "}
                                        <span className="text-black font-medium ml-4">
                                            ₹{item.product.price}
                                        </span>
                                    </p>
                                    <div className="my-4 flex justify-between">
                                        <div className="flex items-center">
                                            <label
                                                htmlFor="input"
                                                className="text-sm md:text-lg font-medium"
                                            >
                                                Quantity:{" "}
                                            </label>
                                            <div className="flex ms-2">
                                                <div
                                                    className="bg-purple-200 text-purple-800 py-2 px-3 text-sm md:text-base rounded-full cursor-pointer"
                                                    onClick={() =>
                                                        updateQuantity(item._id, item.quantity - 1)
                                                    }
                                                >
                                                    -
                                                </div>
                                                <div className="p-2 px-4">{item.quantity}</div>
                                                <div
                                                    className="bg-purple-200 text-purple-800 py-2 px-3 text-sm md:text-base rounded-full cursor-pointer"
                                                    onClick={() =>
                                                        updateQuantity(item._id, item.quantity + 1)
                                                    }
                                                >
                                                    +
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-4 items-end">
                                            <div
                                                onClick={() => removeItem(item._id)}
                                                className="bg-purple-200 text-purple-800 py-2 px-4 text-sm md:text-base rounded-lg cursor-pointer"
                                            >
                                                <FontAwesomeIcon icon={faTrash} size="lg" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="my-6 mx-6 lg:flex-1 border border-purple-100 rounded-xl">
                        {cartItems.length > 0 && (
                            <div className="p-6 py-10 text-center">
                                <h2 className="text-2xl mb-10 md:text-3xl font-semibold">
                                    Order Summary
                                </h2>
                                <div className="flex justify-between my-4 text-xl md:text-2xl font-semibold">
                                    <span>Products:</span>{" "}
                                    <span className="text-gray-600">{summary.__v}</span>
                                </div>
                                <hr className="text-purple-100 w-[80%] mx-auto" />
                                <div className="flex justify-between my-4 text-xl md:text-2xl font-semibold">
                                    <span>Total:</span>{" "}
                                    <span className="text-gray-600">₹{summary.total}</span>
                                </div>

                                <div className="bg-purple-900 p-2 rounded-full text-white font-semibold cursor-pointer">
                                    Checkout
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;