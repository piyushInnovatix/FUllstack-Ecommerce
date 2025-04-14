import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

function ProductList() {

    const [isOpen, setIsOpen] = useState(false);
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handlePanle = () => {
        setIsOpen(!isOpen)
    }

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);

                const token = localStorage.getItem('authToken')

                const response = await fetch('https://ecom-kl8f.onrender.com/api/v1/product',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();
                setProduct(data.products);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch users. Please try again later.');
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (productId) => {
        try {
            setLoading(true)

            const token = localStorage.getItem('authToken')

            await fetch(`https://ecom-kl8f.onrender.com/api/v1/product/${productId}`, { // Replace with your API endpoint
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProduct(product.filter((product) => product._id !== productId));
            alert('User deleted successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to delete user. Please try again.');
        }
    };

    if (loading) {
        return <div className="text-center py-28">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 py-28">{error}</div>;
    }

    return (
        <div className='pt-20'>
            <div className='block md:hidden bg-purple-800 text-white text-center rounded-full m-4 w-28 p-2 right-2' onClick={handlePanle}>
                <p>{isOpen ? ("Close Panel") : ("Open Panel")}</p>
            </div>
            <div className="flex flex-col md:flex-row h-full bg-purple-800 font-poppins">
                {/* Sidebar */}
                <div className={`absolute h-screen md:relative md:translate-x-0 w-64 bg-purple-800 text-white flex flex-col ${isOpen ? ("translate-x-0") : ("-translate-x-full")} transition-all duration-100`}>
                    <div className="p-6 text-2xl font-bold border-b border-purple-700">
                        Admin Panel
                    </div>
                    <nav className="flex-1 p-4">
                        <ul className="space-y-4">
                            <li className="hover:bg-purple-700 p-2 rounded">
                                <Link to={"/userList"} className="block">Registered Users</Link>
                            </li>
                            <li className="hover:bg-purple-700 p-2 rounded">
                                <Link to={"/orderList"} className="block">Recent Orders</Link>
                            </li>
                            <li className="hover:bg-purple-700 p-2 rounded">
                                <Link to={"/productList"} className="block">Product List</Link>
                            </li>
                            <li className="hover:bg-purple-700 p-2 rounded">
                                <Link to={"/addProduct"} className="block">Add Product</Link>
                            </li>
                        </ul>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
                    <h1 className="text-3xl font-bold mb-6">Product List</h1>

                    {/* Users Table */}
                    <div className="bg-white shadow rounded-lg p-6 overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300 text-sm md:text-base">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-gray-300 p-2 text-left">Name</th>
                                    <th className="border border-gray-300 p-2 text-left">Price</th>
                                    <th className="border border-gray-300 p-2 text-left">Brand</th>
                                    <th className="border border-gray-300 p-2 text-left">Category</th>
                                    <th className="border border-gray-300 p-2 text-left">Stock</th>
                                    <th className="border border-gray-300 p-2 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {product.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-100">
                                        <td className="border border-gray-300 p-2"> {product.name}</td>
                                        <td className="border border-gray-300 p-2">{product.price}</td>
                                        <td className="border border-gray-300 p-2">{product.brand}</td>
                                        <td className="border border-gray-300 p-2">{product.category}</td>
                                        <td className="border border-gray-300 p-2">{product.stock}</td>
                                        <td className="border border-gray-300 p-2">
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="bg-red-500 text-white px-4 py-2 rounded-lg text-xs md:text-sm"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductList