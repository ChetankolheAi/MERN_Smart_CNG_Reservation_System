import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import api from "../api/api";
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
const [loginData, setLoginData] = useState({
    email:"",
    password:""
});
const handleChange=(e)=>{

setLoginData({
...loginData,
[e.target.name]:e.target.value
});

}
const handleLogin = async (e) => {
  e.preventDefault();

  try {

    const res = await api.post("/auth/login", loginData);

    localStorage.setItem("token", res.data.token);

    localStorage.setItem(
      "user",
      JSON.stringify(res.data.user)
    );

    navigate("/");

  } catch (err) {

    alert(
      err.response?.data?.message ||
      err.message
    );

  }


};
  return (
    <div className="min-h-screen flex bg-green-50 dark:bg-slate-950 items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-md">
      
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl dark:shadow-2xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Login</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Login to your account</p>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleLogin}>
            {/* Email Field */}
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Email Address</label>
              <div className="mt-1.5 flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg px-3">
                <Mail size={16} className="text-slate-500 dark:text-slate-400" />
                <input
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                  className="bg-transparent w-full py-2.5 px-3 outline-none text-slate-900 dark:text-white text-sm placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Password</label>
              <div className="mt-1.5 flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg px-3">
                <Lock size={16} className="text-slate-500 dark:text-slate-400" />
                <input
                   type={showPassword ? "text" : "password"}
                    name="password"
                    value={loginData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                  className="bg-transparent w-full py-2.5 px-3 outline-none text-slate-900 dark:text-white text-sm placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-slate-900 dark:hover:text-white text-slate-500 dark:text-slate-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" className="accent-green-600 w-4 h-4 rounded cursor-pointer" />
                <span className="text-slate-600 dark:text-slate-400">Remember Me</span>
              </label>
              <button type="button" className="text-green-600 dark:text-green-400 font-medium hover:underline">
                Forgot Password?
              </button>
            </div>

            <button type="submit" className="w-full mt-2 py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors">
              Login
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-5">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
            <span className="text-slate-400 text-xs font-medium">OR</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
          </div>

          {/* Google Button */}
          <button type="button" className="w-full border border-slate-300 dark:border-slate-800 rounded-lg py-2.5 text-slate-700 dark:text-white text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2.5 font-medium">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
            Continue with Google
          </button>

          {/* Signup Navigation */}
          <div className="mt-6 text-center text-sm">
            <span className="text-slate-600 dark:text-slate-400">Don't have an account?</span>
            <button onClick={() => navigate("/signup")} className="ml-2 text-green-600 dark:text-green-400 font-medium hover:underline">
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}