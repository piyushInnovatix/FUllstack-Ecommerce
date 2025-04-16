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
    const [ProfiileDetails, setProfiileDetails] = useState({});
    const [loading, setLoading] = useState(false);
    const [logIn, setLogIn] = useState(false)

    const token = localStorage.getItem('authToken')

    const handleLogout = async () => {
        try {
            const response = await fetch("https://ecom-kl8f.onrender.com/api/auth/user/logout", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });

            if (response.ok) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('userRole');
                logout(); // Update the authentication state
                alert('User Logged Out Successfully!');
                navigate('/'); // Redirect to the home page
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to log out.');
            }
        } catch (error) {
            console.error('Error during logout:', error);
            setError(error.message || 'An error occurred during logout.');
        }
    };

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

            const response = await fetch(`https://ecom-kl8f.onrender.com/api/auth${endpoint}`, {
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

                    await handleProfile();
                    alert('Login Successfull!');

                    setTimeout(() => {
                        setLogIn(true)
                    }, 1000);
                }
            }
            else {
                setError(data.message || 'Something went wrong.')
            }
        } catch (error) {
            setError(error.message || "An error occurred");
        }
    };

    const handleProfile = async () => {
        setLoading(true)

        const token = localStorage.getItem('authToken')

        try {
            const response = await fetch('https://ecom-kl8f.onrender.com/api/auth/user/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });
            const details = await response.json();
            console.log("token", token);
            console.log("response", details)
            setProfiileDetails(details.data);
            setLoading()
        }
        catch (error) {
            console.log("Error Occurred", error)
        }
    }

    return (
        <>
            {!token ? (<form className="py-44 font-poppins" onSubmit={handleSubmit}>
                <div className="bg-white border border-teal-200 w-2/3 lg:w-1/2 mx-auto p-6 rounded-3xl text-center">
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
                <div className="pt-48 pb-16 px-4 sm:px-8 lg:px-36 font-poppins bg-gray-50">
                    <div className="bg-white border border-teal-200 rounded-2xl p-6 md:p-10 flex flex-col md:flex-row gap-10 items-center md:items-start justify-between">
                        {/* Left Section: Profile Info */}
                        <div className="flex flex-col items-center md:items-start gap-6 w-full md:w-2/3">
                            <h1 className="text-4xl sm:text-5xl font-semibold text-teal-900 text-center md:text-left">
                                Hello, {ProfiileDetails?.name || 'User'}!
                            </h1>
                            <div className="text-center md:text-left space-y-1">
                                <p className="text-gray-700 text-lg">
                                    <span className="font-semibold">Email:</span> {ProfiileDetails?.email || 'user@example.com'}
                                </p>
                                <p className="text-gray-700 text-lg">
                                    <span className="font-semibold">Phone:</span> {ProfiileDetails?.phone || '+91 1234567890'}
                                </p>
                            </div>
                        </div>

                        {/* Right Section: Navigation + Logout */}
                        <div className="flex flex-col items-center md:items-end gap-4 w-full md:w-1/3">
                            <button
                                onClick={() => navigate('/')}
                                className="bg-teal-900 w-full md:w-32 text-white py-3 px-6 rounded-lg text-sm md:text-base"
                            >
                                Home
                            </button>
                            <button
                                onClick={() => navigate('/cart')}
                                className="bg-teal-900 w-full md:w-32 text-white py-3 px-6 rounded-lg text-sm md:text-base"
                            >
                                Cart
                            </button>
                            <button
                                onClick={() => navigate('/wishlist')}
                                className="bg-teal-900 w-full md:w-32 text-white py-3 px-6 rounded-lg text-sm md:text-base"
                            >
                                Wishlist
                            </button>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 w-full md:w-32 text-white py-3 px-6 rounded-lg text-sm md:text-base"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Profile