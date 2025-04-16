import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import "/src/index.css";
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';

function ProductPage() {
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [success, setSuccess] = useState('');
    const [showCheckoutForm, setCheckoutFrom] = useState(false);
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    const [phone, setPhone] = useState('');
    const [showOrderConfirmation, setshowOrderConfirmation] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);

    const { id } = useParams(); // Get the product ID from the URL

    useEffect(() => {
        const loadProduct = async () => {
            try {
                // Fetch product
                const productResponse = await fetch(`https://ecom-kl8f.onrender.com/api/product/${id}`);
                if (!productResponse.ok) {
                    throw new Error('Failed to fetch product');
                }
                const productData = await productResponse.json();
                setProduct(productData.product);

                // Fetch reviews (wrapped in try-catch block)
                try {
                    const reviewResponse = await fetch(`https://ecom-kl8f.onrender.com/api/product/${id}/reviews`);
                    if (reviewResponse.ok) {
                        const reviewData = await reviewResponse.json();
                        setReviews(reviewData.reviews || []);
                    } else {
                        // If there's no review, set to empty (but don't crash)
                        setReviews([]);
                    }
                } catch (reviewError) {
                    console.warn('No reviews available:', reviewError.message);
                    setReviews([]); // Default to empty if fetch fails
                }

            } catch (error) {
                console.error(error);
                setError("Failed to load product. Please try again later.");
            }
        };

        loadProduct();
    }, [id]);


    const generateStar = (rating) => {
        const numOfStars = [];
        for (let i = 0; i < Math.floor(rating); i++) {
            numOfStars.push(
                <FontAwesomeIcon icon={faStar} className="text-yellow-400" key={i} />
            );
        }
        return numOfStars;
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('You need to log in to submit a review.');
            return;
        }

        try {
            const response = await fetch(
                `https://ecom-kl8f.onrender.com/api/product/${id}/review`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ comment, rating }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                window.location.reload();

                // Add the new review to the reviews state
                setReviews([...reviews, data.review]);
                setComment('');
                setRating(5);
                setSuccess('Review submitted successfully!');
            } else {
                const errorData = await response.json();
                console.error(errorData);
                setError('Failed to submit review. Please try again.');
            }
        } catch (error) {
            console.error(error);
            setError('Failed to submit review. Please try again.');
        }
    };

    if (error) {
        return <div className="text-center text-red-500 py-28">{error}</div>;
    }

    if (!product) {
        return (
            <div className="pt-20 flex items-center justify-center h-screen bg-gray-100">
                <div className="text-center py-8 px-6 bg-white rounded-lg shadow-md">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-800 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-700">Loading Product...</p>
                </div>
            </div>);
    }

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
            items: [
                {
                    product: product._id,
                    quantity: 1,
                },
            ],
            shippingAddress: {
                street: street,
                city: city,
                state: state,
                pinCode: pincode,
                phone: phone,
            },
            paymentInfo: {
                id: "mock-payment-id",
                status: "success",
                type: "card"
            }
        };

        try {
            const response = await fetch(
                'https://ecom-kl8f.onrender.com/api/order/create',
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData),
                }
            );

            if (response.ok) {
                const data = await response.json();
                const order = data.order;

                setOrderDetails(order);
                setshowOrderConfirmation(true);

                const productLink = product?.download_url; // Assuming each product has a `link` property
                if (productLink) {
                    setTimeout(() => {
                        window.location.href = productLink; // Redirect to the product link
                    }, 2000); // Delay for 2 seconds to show the confirmation modal
                }

                setStreet('');
                setCity('');
                setState('');
                setPincode('');
                setPhone('');
                setCheckoutFrom(false);
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


    return (
        <>
            <div className="py-28 flex flex-col lg:flex-row items-start lg:items-start gap-8 lg:gap-16 px-6 lg:px-40 xl:px-60 font-poppins">
                {/* Swiper for Product Images */}
                <div className="w-full lg:w-1/2">
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={20}
                        loop={true}
                        pagination={{
                            clickable: true,
                        }}
                        navigation={true}
                        modules={[Pagination, Navigation]}
                        className="mySwiper"
                    >
                        {product.productImages.map((imageObj, index) => (
                            <SwiperSlide key={index}>
                                <img
                                    src={imageObj.url} // Use the URL from the productImages array
                                    alt={`${product.name} - ${index + 1}`}
                                    className="carousel-image object-cover w-full h-96"
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Product Details */}
                <div className="flex-1 space-y-5  lg:text-left">
                    <h1 className="text-5xl font-semibold my-10">{product.name}</h1>
                    <h1 className="text-4xl font-semibold">
                        Price: <span className="text-gray-700">₹{product.price}</span>
                    </h1>
                    <h1 className="text-4xl font-semibold">
                        Brand: <span className="text-gray-700">{product.brand}</span>
                    </h1>
                    <h1 className="text-4xl font-semibold">
                        Category: <span className="text-gray-700">{product.category}</span>
                    </h1>

                    <h1 className="text-4xl font-semibold">
                        Stock: <span className="text-gray-700">{product.stock}</span>
                    </h1>

                    <div className="flex justify-center lg:justify-start text-2xl my-6">
                        <p>{generateStar(product.ratings)}</p>
                        <p className="ms-2">({product.numReviews} Reviews)</p>
                    </div>

                    <div className="flex flex-col lg:flex-row justify-center lg:justify-start my-6 gap-4">
                        <button onClick={() => setCheckoutFrom(true)} className="bg-purple-800 text-white w-full lg:w-auto py-3 px-6 rounded-full">
                            Buy Now
                        </button>
                        <button className="bg-purple-200 text-purple-800 w-full lg:w-auto py-3 px-6 rounded-full">
                            Add to Wishlist
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col xl:flex-row justify-around px-6 lg:px-40 xl:px-60">
                <div className="font-poppins">
                    <div className="my-10 text-xl">
                        <div>
                            <span className="font-bold text-3xl">Product Description:</span>
                            <br />
                            {product.description.map((descriptionObj, index) => (
                                <div className="mt-5" key={index}>
                                    <span className="font-semibold text-2xl">{descriptionObj.title}</span>
                                    <br />
                                    {descriptionObj.points && descriptionObj.points.length > 0 ? (
                                        <ul className="list-disc ml-6">
                                            {descriptionObj.points.map((point, pointIndex) => (
                                                <li key={pointIndex}>{point}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500">No points available for this section.</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="font-poppins">
                    <div className="my-10 text-xl">
                        <div>
                            <span className="font-bold text-3xl">Frequently Asked Questions:</span>
                            <br />
                            {product.faqs.map((faq, index) => (
                                <div key={index} className="mt-5 border-b border-gray-300">
                                    <button
                                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                        className="w-full text-left font-semibold text-2xl py-3 flex justify-between items-center"
                                    >
                                        {faq.question}
                                        <span className="text-gray-500">
                                            {expandedFaq === index ? '-' : '+'}
                                        </span>
                                    </button>
                                    {expandedFaq === index && (
                                        <div className="pl-4 pb-3">
                                            {faq.answer.map((answer, answerIndex) => (
                                                <div key={answerIndex} className="mt-2">
                                                    <h3 className="font-semibold text-xl">{answer.title}</h3>
                                                    <ul className="list-disc ml-6">
                                                        {answer.points.map((point, pointIndex) => (
                                                            <li key={pointIndex}>{point}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Review Section */}
            <div className="review-section mt-12 px-6 lg:px-40 xl:px-60 font-poppins pb-24">
                <h2 className="text-2xl font-semibold">Reviews</h2>
                {/* Display Existing Reviews */}
                {reviews.length > 0 ? (
                    <div className="reviews mt-4">
                        {reviews.map((review, index) => (
                            <div key={index} className="review border border-purple-200 p-4 rounded-lg mb-4">
                                {/* User Information */}
                                <div className="flex items-center mb-2">
                                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                                        <span className="text-white font-bold">
                                            {review.user && review.user.name ? review.user.name.charAt(0).toUpperCase() : 'A'}
                                        </span>
                                    </div>
                                    <p className="font-semibold">{review.user && review.user.name ? review.user.name : 'Anonymous'}</p>
                                </div>

                                {/* Review Content */}
                                <p className="font-semibold">
                                    {review.rating ? generateStar(review.rating) : <p>No rating</p>}
                                    <span className="ml-2 text-gray-500">({review.rating}/5)</span>
                                </p>
                                <p>{review.comment}</p>
                                <p className="text-gray-500 text-sm mt-2">
                                    {review.createdAt && new Date(review.createdAt).toLocaleDateString()} {review.createdAt && new Date(review.createdAt).toLocaleTimeString()}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 mt-4">No reviews yet. Be the first to review this product!</p>
                )}

                {/* Add Review Form */}
                <form onSubmit={handleReviewSubmit} className="mt-6">
                    <h3 className="text-xl font-semibold mb-2">Add Your Review</h3>
                    {error && <p className="text-red-500">{error}</p>}
                    {success && <p className="text-green-500">{success}</p>}
                    <textarea
                        className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                        rows="4"
                        placeholder="Write your review here..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                    ></textarea>
                    <div className="rating mb-4">
                        <label className="font-semibold mr-2">Rating:</label>
                        <select
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                            className="p-2 border border-gray-300 rounded-lg"
                        >
                            {[1, 2, 3, 4, 5].map((star) => (
                                <option key={star} value={star}>
                                    {star}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="bg-purple-800 text-white px-4 py-2 rounded-lg"
                    >
                        Submit Review
                    </button>
                </form>
            </div>

            {showCheckoutForm && (
                <div className="fixed inset-0 bg-gray-50 bg-opacity- flex justify-center items-center z-50">
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
                                className="bg-purple-800 text-white px-4 py-2 rounded-lg w-full"
                            >
                                Place Order
                            </button>
                        </form>
                        <button
                            onClick={() => setCheckoutFrom(false)}
                            className="text-red-500 mt-4 block text-center"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {showOrderConfirmation && (
                <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-2xl font-semibold mb-4">Order Confirmation</h2>
                        <p className="mb-2"><strong>Order ID:</strong> {orderDetails._id}</p>
                        <p className="mb-2"><strong>Total Amount:</strong> ₹{orderDetails.totalAmount}</p>
                        <p className="mb-2"><strong>Status:</strong> {orderDetails.status}</p>
                        <p className="mb-2"><strong>Paid At:</strong> {new Date(orderDetails.paidAt).toLocaleString()}</p>
                        <button
                            onClick={() => setshowOrderConfirmation(false)}
                            className="bg-purple-800 text-white px-4 py-2 rounded-lg w-full mt-4"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default ProductPage;