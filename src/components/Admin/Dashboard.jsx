import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {

    const [isOpen, setIsOpen] = useState(false)

    const handlePanle = () => {
        setIsOpen(!isOpen)
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
                    <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

                    {/* Registered Users */}
                    <section id="users" className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Registered Users</h2>
                        <div className="bg-white shadow rounded-lg p-6">
                            <p className="text-lg">Total Users: <span className="font-bold">1,234</span></p>
                            <p className="text-sm text-gray-600 mt-2">Last registered user: John Doe (2 hours ago)</p>
                        </div>
                    </section>

                    {/* Recent Orders */}
                    <section id="orders" className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Recent Orders</h2>
                        <div className="bg-white shadow rounded-lg p-6">
                            <ul className="space-y-4">
                                <li className="flex justify-between">
                                    <span>Order #12345</span>
                                    <span className="text-green-600">Completed</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Order #12346</span>
                                    <span className="text-yellow-600">Pending</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Order #12347</span>
                                    <span className="text-red-600">Cancelled</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Product List */}
                    <section id="products">
                        <h2 className="text-2xl font-semibold mb-4">Product List</h2>
                        <div className="bg-white shadow rounded-lg p-6">
                            <ul className="space-y-4">
                                <li className="flex justify-between">
                                    <span>Product A</span>
                                    <span className="text-gray-600">Stock: 120</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Product B</span>
                                    <span className="text-gray-600">Stock: 80</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Product C</span>
                                    <span className="text-gray-600">Stock: 50</span>
                                </li>
                            </ul>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;