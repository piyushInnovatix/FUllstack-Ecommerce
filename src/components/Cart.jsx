import React, { useEffect, useState } from 'react';
import cartImage from '/public/empty-cart.png';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [showCheckoutForm, setShowCheckoutForm] = useState(false);
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    const [phone, setPhone] = useState('');
    const [orderDetails, setOrderDetails] = useState(null);
    const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);


    // Fetch cart items from the API
    useEffect(() => {
        const loadCartItems = async () => {
            try {
                const token = localStorage.getItem('authToken'); // Retrieve token for authentication
                const response = await fetch('https://ecom-kl8f.onrender.com/api/cart', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Add Authorization header
                    },
                });
                const data = await response.json();
                setCartItems(data.cart.items || []); // Set cart items from API response
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
    const updateQuantity = async (productId, quantity) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`https://ecom-kl8f.onrender.com/api/cart/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    productId,
                    quantity: Math.max(1, quantity)
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Quantity Updated Successfully', data);

                const updatedCart = cartItems.map((item) =>
                    item.product._id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
                );
                setCartItems(updatedCart);
            } else {
                const errorData = await response.json();
                console.error('Failed to update quantity', errorData);
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    // Remove an item from the cart
    const removeItem = async (productId) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`https://ecom-kl8f.onrender.com/api/cart/remove/${productId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const updatedItems = cartItems.filter((item) => item.product._id !== productId);
                setCartItems(updatedItems);
            } else {
                console.error('Failed to remove item');
            }
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const emptyCart = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`https://ecom-kl8f.onrender.com/api/cart/clear`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                alert("Cart Cleared Successfully!")
                setCartItems([]);
            } else {
                console.error('Failed to Clear Cart');
            }
        } catch (error) {
            console.error('Error Clearing Cart:', error);
        }
    };

    const handleCheckout = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('You need to log in to place an order.');
            return;
        }

        if (!street || !city || !state || !pincode || !phone) {
            alert('Please fill in all the fields.');
            return;
        }

        const orderData = {
            items: cartItems.map((item) => ({
                product: item.product._id,
                quantity: item.quantity,
            })),
            shippingAddress: {
                street,
                city,
                state,
                pinCode: pincode,
                phone,
            },
            paymentInfo: {
                id: "mock-payment-id",
                status: "success",
                type: "card",
            },
        };

        try {
            const response = await fetch('https://ecom-kl8f.onrender.com/api/order/create', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                const data = await response.json();
                const order = data.order;
                console.log('Order Response:', order);

                setOrderDetails(order);
                setShowOrderConfirmation(true);

                const productLink = cartItems[0]?.product?.download_url; 
                if (productLink) {
                    setTimeout(() => {
                        window.location.href = productLink;
                    }, 2000); 
                }

                // Clear the cart after successful order
                setCartItems([]);
                setShowCheckoutForm(false);
            } else {
                const errorData = await response.json();
                console.error('Error placing order:', errorData);
                alert('Failed to place order. Please try again.');
            }
        } catch (error) {
            console.error('Error placing order:', error.message);
            alert('Failed to place order. Please try again.');
        }
    };

    const totalProducts = cartItems.reduce((total, item) => total + item.quantity, 0)
    const totalPrice = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

    return (
        <div className="py-32 xl:mx-44 font-poppins">
            {/* Loading State */}
            {loading ? (
                <div className="pt-20 flex items-center justify-center h-screen">
                    <div className="text-center py-8 px-6 bg-white rounded-lg shadow-md">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                        <p className="text-lg text-gray-700">Loading Cart Items...</p>
                    </div>
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
                                                    className="bg-teal-200 text-teal-600 py-2 px-3 text-sm md:text-base rounded-full cursor-pointer"
                                                    onClick={() =>
                                                        updateQuantity(item.product._id, item.quantity - 1)
                                                    }
                                                >
                                                    -
                                                </div>
                                                <div className="p-2 px-4">{item.quantity}</div>
                                                <div
                                                    className="bg-teal-200 text-teal-600 py-2 px-3 text-sm md:text-base rounded-full cursor-pointer"
                                                    onClick={() =>
                                                        updateQuantity(item.product._id, item.quantity + 1)
                                                    }
                                                >
                                                    +
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-4 items-end">
                                            <div
                                                onClick={() => removeItem(item.product._id)}
                                                className="bg-teal-200 text-teal-600 py-2 px-4 text-sm md:text-base rounded-lg cursor-pointer"
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
                                    <span className="text-gray-600">{totalProducts}</span>
                                </div>
                                <hr className="text-purple-100 w-[80%] mx-auto" />
                                <div className="flex justify-between my-4 text-xl md:text-2xl font-semibold">
                                    <span>Total:</span>{" "}
                                    <span className="text-gray-600">₹{totalPrice}</span>
                                </div>

                                <div onClick={() => setShowCheckoutForm(true)} className="bg-purple-900 p-2 my-2 rounded-full text-white font-semibold cursor-pointer">
                                    Checkout
                                </div>
                                <div onClick={emptyCart} className="bg-teal-200 p-2 my-2 rounded-full text-teal-600 font-semibold cursor-pointer">
                                    Empty Cart
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showCheckoutForm && (
                <div className="fixed inset-0 bg-gray-50 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-2xl font-semibold mb-4">Enter Address Details</h2>
                        <form onSubmit={handleCheckout}>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Street</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    value={street}
                                    onChange={(e) => setStreet(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">City</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">State</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Pincode</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    value={pincode}
                                    onChange={(e) => setPincode(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-teal-600 text-white px-4 py-2 rounded-lg w-full"
                            >
                                Place Order
                            </button>
                        </form>
                        <button
                            onClick={() => setShowCheckoutForm(false)}
                            className="text-red-500 mt-4 block text-center"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {showOrderConfirmation && (
                <div className="fixed inset-0 bg-gray-50 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-2xl font-semibold mb-4">Order Confirmation</h2>
                        <p className="mb-2"><strong>Order ID:</strong> {orderDetails._id}</p>
                        <p className="mb-2"><strong>Total Amount:</strong> ₹{orderDetails.totalAmount}</p>
                        <p className="mb-2"><strong>Status:</strong> {orderDetails.status}</p>
                        <p className="mb-2"><strong>Paid At:</strong> {new Date(orderDetails.paidAt).toLocaleString()}</p>
                        <button
                            onClick={() => setShowOrderConfirmation(false)}
                            className="bg-teal-600 text-white px-4 py-2 rounded-lg w-full mt-4"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;