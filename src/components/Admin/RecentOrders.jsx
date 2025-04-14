import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

function RecentOrders() {

    const [isOpen, setIsOpen] = useState(false)
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handlePanle = () => {
        setIsOpen(!isOpen)
    }

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://api.example.com/orders'); // Replace with your API endpoint
                const data = await response.json();
                setOrders(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch orders. Please try again later.');
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

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
            <div className="flex h-full bg-purple-800 font-poppins">
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
                    <h1 className="text-3xl font-bold mb-6">Recent Orders</h1>

                    {/* Orders Table */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-gray-300 p-2 text-left">Product Name</th>
                                    <th className="border border-gray-300 p-2 text-left">Price</th>
                                    <th className="border border-gray-300 p-2 text-left">Quantity</th>
                                    <th className="border border-gray-300 p-2 text-left">Ordered By</th>
                                    <th className="border border-gray-300 p-2 text-left">Order Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-100">
                                        <td className="border border-gray-300 p-2">{order.productName}</td>
                                        <td className="border border-gray-300 p-2">₹{order.price}</td>
                                        <td className="border border-gray-300 p-2">{order.quantity}</td>
                                        <td className="border border-gray-300 p-2">{order.orderedBy}</td>
                                        <td className="border border-gray-300 p-2">{new Date(order.orderDate).toLocaleDateString()}</td>
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

export default RecentOrders