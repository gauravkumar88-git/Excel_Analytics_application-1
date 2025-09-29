import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";  


const AuthSlider = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  const navigate = useNavigate();

  const checkPasswordStrength = (pass) => {
    if (pass.length < 6) setPasswordStrength("Weak");
    else if (/[A-Z]/.test(pass) && /\d/.test(pass) && /[!@#$%^&*]/.test(pass))
      setPasswordStrength("Strong");
    else setPasswordStrength("Medium");
  };

  const handleSignupChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === "checkbox" ? checked : value;
    setSignupData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    if (name === "password") checkPasswordStrength(value);
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, termsAccepted } = signupData;

     if (!name || !email || !password || !confirmPassword)
      return toast.error("Please fill all fields.");
    if (password !== confirmPassword)
      return toast.error("Passwords do not match.");
    if (!termsAccepted)
      return toast.error("You must accept the terms and conditions.");
    if (passwordStrength === "Weak")
      return toast.error("Password is too weak.");

    try {
      setSignupError("");
      await axios.post("http://localhost:3000/api/auth/signup", {
        name,
        email,
        password,
      });

      toast.success("Signup Successfully!");
      setSignupData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        termsAccepted: false,
      });
      setIsLogin(true);
    } catch (error) {
      console.error("Signup error:", error);
      setSignupError(error.response?.data?.message || "Signup failed");
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = loginData;
    if (!email || !password) {
      return  toast.error("Please fill all fields.") ;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      toast.success("Login successful ✅");
      navigate("/dashboard"); // or your home route
    } catch (err) {
      console.error("Login error:", err);
      setLoginError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a2696] via-[#0f39c4] to-[#fdbb2d] relative overflow-hidden">
      <div className="relative z-10 w-full max-w-4xl h-[550px] flex rounded-3xl shadow-2xl bg-white/10 backdrop-blur-xl overflow-hidden transition-all duration-700">
        {/* Left Panel */}
        <div className={`w-1/2 p-10 flex flex-col justify-center items-center text-white transition-transform duration-700 ${isLogin ? "translate-x-0" : "-translate-x-full"}`}>
          <h1 className="text-4xl font-extrabold mb-4">Welcome Back 👋</h1>
          <p className="text-center mb-6 text-lg">Login to continue exploring your notes and tasks.</p>
          <button onClick={() => setIsLogin(false)} className="bg-white text-sky-600 font-bold px-8 py-2 rounded-full hover:bg-gray-100 transition">
            Sign Up
          </button>
        </div>

        {/* Right Panel */}
        <div className={`w-1/2 p-10 flex flex-col justify-center items-center text-white transition-transform duration-700 ${isLogin ? "translate-x-full" : "translate-x-0"}`}>
          <h1 className="text-4xl font-extrabold mb-4">Hello, Friend 🌟</h1>
          <p className="text-center mb-6 text-lg">Create an account and get started now!</p>
          <button onClick={() => setIsLogin(true)} className="bg-white text-rose-600 font-bold px-8 py-2 rounded-full hover:bg-gray-100 transition">
            Login
          </button>
        </div>

        {/* Sliding Panel */}
        <div className="absolute w-1/2 h-full bg-white rounded-3xl p-10 z-10 transition-transform duration-700 ease-in-out shadow-xl" style={{ transform: isLogin ? "translateX(100%)" : "translateX(0%)" }}>
          {!isLogin ? (
            <div>
              <h2 className="text-3xl font-bold text-rose-600 mb-4 text-center">Sign Up</h2>
              <form onSubmit={handleSignupSubmit} className="space-y-4 text-sm">
                <input type="text" name="name" placeholder="Full Name" onChange={handleSignupChange} className="w-full p-3 border rounded-xl" />
                <input type="email" name="email" placeholder="Email" onChange={handleSignupChange} className="w-full p-3 border rounded-xl" />
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" onChange={handleSignupChange} className="w-full p-3 border rounded-xl" />
                  <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 cursor-pointer text-gray-500 text-sm">{showPassword ? "🙈" : "👁️"}</span>
                </div>
                <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleSignupChange} className="w-full p-3 border rounded-xl" />
                {passwordStrength && (
                  <div className={`text-xs ${passwordStrength === "Weak" ? "text-red-500" : passwordStrength === "Medium" ? "text-yellow-500" : "text-green-600"}`}>
                    Password Strength: {passwordStrength}
                  </div>
                )}
                <label className="flex items-center space-x-2 text-xs">
                  <input type="checkbox" name="termsAccepted" onChange={handleSignupChange} />
                  <span>I accept the <a href="#" className="underline text-blue-600">terms & conditions</a></span>
                </label>
                {signupError && <div className="text-red-500 text-xs">{signupError}</div>}
                <button type="submit" className="w-full bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 text-white p-3 rounded-xl">Create Account</button>
              </form>
            </div>
          ) : (
            <div>
              <h2 className="text-3xl font-bold text-indigo-800 mb-6 text-center">Login</h2>
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <input type="email" name="email" placeholder="Email" onChange={handleLoginChange} className="w-full p-3 border rounded-xl" />
                <input type="password" name="password" placeholder="Password" onChange={handleLoginChange} className="w-full p-3 border rounded-xl" />
                {loginError && <div className="text-red-500 text-xs">{loginError}</div>}
                <button type="submit" className="w-full bg-gradient-to-r from-indigo-900 via-blue-700 to-purple-400 text-white p-3 rounded-xl">Login</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthSlider;
