import React, { useContext, useEffect } from 'react';
import CartContext from '../Context/context';
import wishImage from '/public/wish-image.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function Wishlist() {

    const { favItems = [], setFavItems = () => { }, cartItems = [], setcartItems = () => { }, itemNum, setitemNum } = useContext(CartContext);

    const generateStars = (rating) => {
        const stars = [];
        for (let i = 0; i < Math.floor(rating); i++) {
            stars.push(
                <FontAwesomeIcon icon={faStar} className='text-yellow-400' mx-2 />
            )
        }
        return stars;
    }

    const removeItem = (id) => {
        setFavItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    useEffect(() => {
        const totalItems = favItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
        setitemNum(totalItems);
    }, [favItems, setitemNum]);

    const moveToCart = (item) => {
        setcartItems((prevCart) => {
            const isAlreadyInCart = prevCart.find(cartItem => cartItem.id === item.id);
            if (!isAlreadyInCart) {
                return [...prevCart, { ...item, quantity: 1 }];
            }
            return prevCart;
        });

        setFavItems((prevItems) => prevItems.filter(favItem => favItem.id !== item.id));
    };

    return (
        <div className="py-32 xl:mx-44 font-poppins">
            {/* Empty Cart */}
            {favItems.length === 0 ? (
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
                        {favItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex flex-wrap md:flex-nowrap justify-center items-center product-card bg-white border border-purple-100 mx-6 my-6 p-6 md:p-8 rounded-xl gap-6"
                            >
                                {/* Product Image */}
                                <img
                                    src={item.img}
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
                                            {generateStars(item.rating?.rate || 0)}
                                        </div>
                                        <div className="flex gap-4 items-end">
                                            <button
                                                onClick={() => moveToCart(item)}
                                                className="bg-purple-800 text-white py-2 px-4 text-sm md:text-base rounded-lg"
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