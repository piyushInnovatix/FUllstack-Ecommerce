import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function SingleUser() {
    const { id } = useParams(); // Get the user ID from the URL
    const [userDetails, setUserDetails] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);



    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const token = localStorage.getItem('authToken');

                const response = await fetch(`https://ecom-kl8f.onrender.com/api/auth/admin/user/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user details');
                }

                const data = await response.json();
                console.log("response", data);

                setUserDetails(data.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch user details. Please try again later.');
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [id]);

    const fetchCartItems = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`https://ecom-kl8f.onrender.com/api/cart/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch cart items');
            }

            const data = await response.json();
            setCartItems(data.cart.items || []);
        } catch (err) {
            console.error(err);
            alert('Failed to fetch cart items. Please try again.');
        }
    };

    const fetchWishlistItems = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`https://ecom-kl8f.onrender.com/api/auth/user/watchlist/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch wishlist items');
            }

            const data = await response.json();
            setWishlistItems(data.data.products || []);
        } catch (err) {
            console.error(err);
            alert('Failed to fetch wishlist items. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="pt-20 flex items-center justify-center h-screen bg-gray-100">
                <div className="text-center py-8 px-6 bg-white rounded-lg shadow-md">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-700">Loading User Details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-500 py-28">{error}</div>;
    }

    return (
        <div className="py-32 px-6 lg:px-40 xl:px-60 font-poppins">
            <div className="bg-white border border-teal-200 rounded-lg p-6">
                <h1 className="text-3xl font-bold mb-6">User Details</h1>
                <div className="space-y-4">
                    <p className="text-lg">
                        <strong>Name:</strong> {userDetails?.name || 'N/A'}
                    </p>
                    <p className="text-lg">
                        <strong>Email:</strong> {userDetails?.email || 'N/A'}
                    </p>
                    <p className="text-lg">
                        <strong>Phone:</strong> {userDetails?.phone || 'N/A'}
                    </p>
                    <p className="text-lg">
                        <strong>Role:</strong> {userDetails?.role || 'N/A'}
                    </p>
                </div>
                <div className="mt-6 flex gap-4">
                    <button
                        onClick={fetchCartItems}
                        className="bg-teal-600 text-white px-4 py-2 rounded-lg"
                    >
                        Show Cart Items
                    </button>
                    <button
                        onClick={fetchWishlistItems}
                        className="bg-teal-600 text-white px-4 py-2 rounded-lg"
                    >
                        Show Wishlist Items
                    </button>
                </div>
            </div>

            {/* Cart Items */}
            {cartItems.length > 0 && (
                <div className="mt-10 bg-white shadow rounded-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">Cart Items</h2>
                    <ul className="space-y-4">
                        {cartItems.map((item) => (
                            <li key={item.product._id} className="border-b pb-4">
                                <p>
                                    <strong>Product:</strong> {item.product.name}
                                </p>
                                <p>
                                    <strong>Quantity:</strong> {item.quantity}
                                </p>
                                <p>
                                    <strong>Price:</strong> ₹{item.product.price}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Wishlist Items */}
            {wishlistItems.length > 0 && (
                <div className="mt-10 bg-white shadow rounded-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">Wishlist Items</h2>
                    <ul className="space-y-4">
                        {wishlistItems.map((item) => (
                            <li key={item._id} className="border-b pb-4">
                                <p>
                                    <strong>Product:</strong> {item.name}
                                </p>
                                <p>
                                    <strong>Price:</strong> ₹{item.price}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default SingleUser;