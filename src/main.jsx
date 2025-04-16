import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Home from './components/Home.jsx'
import Cart from './components/Cart.jsx'
import Profile from './components/Profile.jsx'
import ProductPage from './components/ProductPage.jsx'
import Wishlist from './components/Wishlist.jsx'
import { AuthProvider } from './Context/AuthContext.jsx'
import Dashboard from './components/Admin/Dashboard.jsx'
import AddProduct from './components/Admin/AddProduct.jsx'
import UserList from './components/Admin/UserList.jsx'
import RecentOrders from './components/Admin/RecentOrders.jsx'
import ProductList from './components/Admin/ProductList.jsx'
import SingleUser from './components/Admin/SingleUser.jsx'

const route = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path='' element={<Home />} />
      <Route path='/cart' element={<Cart />} />
      <Route path='/wishlist' element={<Wishlist />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/product/:id' element={<ProductPage />} />
      <Route path='/admin' element={<Dashboard />} />
      <Route path='/addProduct' element={<AddProduct />} />
      <Route path='/userList' element={<UserList />} />
      <Route path='/orderList' element={<RecentOrders />} />
      <Route path='/productList' element={<ProductList />} />
      <Route path='/singleUser/:id' element={<SingleUser />} />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={route}>
      <App />
    </RouterProvider>
  </AuthProvider>
)
