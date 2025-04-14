import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { InputAdornment } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AuthContext } from '../Context/AuthContext';
import CartContext from '../Context/context';
function Profile() {

    const [signedUp, setSigneIn] = useState(true);
    const { user, logout, login } = useContext(AuthContext);
    const { itemNum } = useContext(CartContext)

    const handleLogout = () => {
        logout(); // Call the logout function
        navigate('/'); // Redirect to home page after logout
    };

    const { isAuthenticated } = useContext(AuthContext)

    const [showPassword, setShowPassword] = useState(false);
    const [signupData, setSignupData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
    });
    const [loginData, setloginData] = useState({
        password: "",
        login: ""
    });

    const navigate = useNavigate()

    const [error, setError] = useState("");

    const handleSignupChange = (e) => {
        const { name, value } = e.target;
        setSignupData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setloginData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (signedUp && signupData.phone.length !== 10) {
            setError("Phone number must be 10 digits.");
            return;
        }
        try {
            const endpoint = signedUp ? '/user/register' : '/user/login';
            const userData = signedUp ? signupData : loginData

            const response = await fetch(`https://ecom-kl8f.onrender.com/api/v1${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (response.ok) {
                if (signedUp) {
                    alert('Sign Up Successfull! Please log in.');
                    setSigneIn(false)
                }
                else {
                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('userRole', data.data.role);

                    login(data.user);
                    alert('Login Successfull!');
                    // navigate('/');
                }
            }
            else {
                setError(data.message || 'Something went wrong.')
            }
        } catch (error) {
            setError(error.message || "An error occurred");
        }
    };

    return (
        (!isAuthenticated ? (
            <form className="py-44 font-poppins" onSubmit={handleSubmit}>
                <div className="bg-white border border-purple-200 w-2/3 lg:w-1/2 mx-auto p-6 rounded-3xl text-center">
                    <div className="my-8">
                        <h1 className="text-2xl lg:text-4xl ">
                            {signedUp ? 'Hi There!' : 'Welcome Back!'}
                        </h1>
                        <p className="text-sm lg:text-lg text-gray-600">
                            {signedUp ? (
                                <>
                                    Already have an account?{' '}
                                    <span
                                        className="text-[#7e1af0] cursor-pointer"
                                        onClick={() => setSigneIn(false)}
                                    >
                                        Log in
                                    </span>
                                </>
                            ) : (
                                <>
                                    First time here?{' '}
                                    <span
                                        className="text-[#7e1af0] cursor-pointer"
                                        onClick={() => setSigneIn(true)}
                                    >
                                        Create an Account
                                    </span>
                                </>
                            )}
                        </p>
                    </div>

                    {/* error message */}
                    {error && <p className="text-red-600">{error}</p>}


                    {signedUp && (<div className="my-2">
                        <TextField
                            id="outlined-multiline-flexible1"
                            variant="outlined"
                            name="name"
                            value={signupData.name}
                            onChange={handleSignupChange}
                            label="Username"
                            type="text"
                            autoComplete="off"
                            required
                            className="w-full lg:w-[49%] border border-gray-400 p-2 rounded block"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "rgb(156 163 175)",
                                        margin: "4px",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "rgb(156 163 175)",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#7e1af0",
                                    },
                                },
                                "& .MuiInputLabel-root": {
                                    color: "#888888",
                                },
                                "& .MuiInputLabel-root.Mui-focused": {
                                    color: "#7e1af0",
                                },
                                input: {
                                    color: "black",
                                },
                            }}
                        />
                    </div>)}

                    {signedUp && (<div className="my-2">
                        <TextField
                            id="outlined-multiline-flexible2"
                            variant="outlined"
                            name="email"
                            value={signupData.email}
                            onChange={handleSignupChange}
                            label="Email"
                            type="email"
                            autoComplete="off"
                            required
                            className="w-full lg:w-[49%] border border-gray-400 p-2 rounded block"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "rgb(156 163 175)",
                                        margin: "4px",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "rgb(156 163 175)",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#7e1af0",
                                    },
                                },
                                "& .MuiInputLabel-root": {
                                    color: "#888888",
                                },
                                "& .MuiInputLabel-root.Mui-focused": {
                                    color: "#7e1af0",
                                },
                                input: {
                                    color: "black",
                                },
                            }}
                        />
                    </div>)}

                    {!signedUp && (<div className="my-2">
                        <TextField
                            id="outlined-multiline-flexible2"
                            variant="outlined"
                            name="login"
                            value={loginData.login}
                            onChange={handleLoginChange}
                            label="Email Or Phone"
                            type="text"
                            autoComplete="off"
                            required
                            className="w-full lg:w-[49%] border border-gray-400 p-2 rounded block"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "rgb(156 163 175)",
                                        margin: "4px",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "rgb(156 163 175)",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#7e1af0",
                                    },
                                },
                                "& .MuiInputLabel-root": {
                                    color: "#888888",
                                },
                                "& .MuiInputLabel-root.Mui-focused": {
                                    color: "#7e1af0",
                                },
                                input: {
                                    color: "black",
                                },
                            }}
                        />
                    </div>)}

                    {signedUp && (<div className="my-2">
                        <TextField
                            id="outlined-multiline-flexible2"
                            variant="outlined"
                            name="phone"
                            value={signupData.phone}
                            onChange={handleSignupChange}
                            label="Phone"
                            type="number"
                            autoComplete="off"
                            required
                            className="w-full lg:w-[49%] border border-gray-400 p-2 rounded block"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "rgb(156 163 175)",
                                        margin: "4px",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "rgb(156 163 175)",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#7e1af0",
                                    },
                                },
                                "& .MuiInputLabel-root": {
                                    color: "#888888",
                                },
                                "& .MuiInputLabel-root.Mui-focused": {
                                    color: "#7e1af0",
                                },
                                input: {
                                    color: "black",
                                },
                            }}
                        />
                    </div>)}

                    <div className="my-2">
                        <TextField
                            id="outlined-multiline-flexible3"
                            variant="outlined"
                            name="password"
                            value={signedUp ? (signupData.password) : (loginData.password)}
                            onChange={signedUp ? (handleSignupChange) : (handleLoginChange)}
                            autoComplete="off"
                            label="Password"
                            required
                            className="w-full lg:w-[49%] border border-gray-400 p-2"
                            type={showPassword ? "text" : "password"}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "rgb(156 163 175)",
                                        margin: "4px",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "rgb(156 163 175)",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#7e1af0",
                                    },
                                },
                                "& .MuiInputLabel-root": {
                                    color: "#888888",
                                },
                                "& .MuiInputLabel-root.Mui-focused": {
                                    color: "#7e1af0",
                                },
                                input: {
                                    color: "black",
                                },
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <FontAwesomeIcon
                                            icon={showPassword ? faEyeSlash : faEye}
                                            edge="end"
                                            onClick={handlePassword}
                                        />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        className="rounded-full px-7 py-3 text-base font-medium text-white bg-[#7e1af0] mt-4"
                    >
                        {signedUp ? "Sign Up" : "Log In"}
                    </button>
                </div>
            </form>
        ) : (
            <div className="py-32 lg:pt-44 pb-24 xl:px-36 font-poppins">
                <div className="flex flex-col md:flex-row gap-8 md:gap-16 lg:gap-24 justify-between md:items-end mx-6 py-10 md:mx-16 lg:mx-28 px-6 md:px-16 lg:px-32 border border-purple-200 rounded-2xl bg-white shadow-lg">
                    {/* Left Section: User Info and Navigation */}
                    <div className="xl:w-2/3 flex flex-col gap-6">
                        <h1 className="lg:w-2/3 text-4xl md:text-5xl font-semibold text-purple-900">
                            Hello, {user?.name || "User"}!
                        </h1>
                        <p className="text-gray-700 text-xl lg:text-2xl md:text-base">
                            You have <span className="font-bold">{itemNum || 0}</span> items in your cart.
                        </p>
                        <div className="flex flex-col md:flex-row gap-4">
                            <button
                                onClick={() => navigate('/')}
                                className="bg-purple-900 text-white py-3 px-6 rounded-lg text-center text-sm md:text-base w-full md:w-auto"
                            >
                                Home
                            </button>
                            <button
                                onClick={() => navigate('/cart')}
                                className="bg-purple-900 text-white py-3 px-6 rounded-lg text-center text-sm md:text-base w-full md:w-auto"
                            >
                                Cart
                            </button>
                            <button
                                onClick={() => navigate('/wishlist')}
                                className="bg-purple-900 text-white py-3 px-6 rounded-lg text-center text-sm md:text-base w-full md:w-auto"
                            >
                                Wishlist
                            </button>
                        </div>
                    </div>

                    {/* Right Section: Logout Button */}
                    <div className="lg:w-1/3 flex justify-center lg:justify-end">
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 text-white py-3 px-6 rounded-lg text-center text-sm md:text-base w-full lg:w-auto"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>)
        )
    )
}

export default Profile