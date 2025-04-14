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
    const [product, setProduct] = useState(null); // Initialize as null
    const [error, setError] = useState(null); // State for error handling
    const [expandedFaq, setExpandedFaq] = useState(null)


    const { id } = useParams(); // Get the product ID from the URL

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const response = await fetch(`https://ecom-kl8f.onrender.com/api/v1/product/${id}`);
                const data = await response.json();
                console.log(data.product)
                setProduct(data.product); // Assuming the API returns a `product` object
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

    if (error) {
        return <div className="text-center text-red-500 py-28">{error}</div>;
    }

    if (!product) {
        return <div className="text-center py-28">Loading...</div>;
    }

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
                        <button className="bg-purple-800 text-white w-full lg:w-auto py-3 px-6 rounded-full">
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
                        <p>
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
                        </p>
                    </div>
                </div>

                <div className="font-poppins">
                    <div className="my-10 text-xl">
                        <p>
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
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProductPage;