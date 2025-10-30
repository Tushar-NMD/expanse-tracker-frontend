import { motion } from "framer-motion";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import useAuth from "../../hook/auth/useAuth";

const UserLogin = () => {
    const { loginUser, loading, error } = useAuth();
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Invalid email address")
                .required("Email is required"),
            password: Yup.string()
                .min(6, "Password must be at least 6 characters")
                .required("Password is required"),
        }),
        onSubmit: async (values) => {
            try {
                const response = await loginUser(values);

                if (response.data.token) {
                    localStorage.setItem('token', response.data.token);
                }

                toast.success("Login successful! Redirecting...");
                setSuccess(true);
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500);
            } catch (error) {
                toast.error(error.message || "Login failed");
                console.error("Login failed:", error);
            }
        },
    });

    const inputClass = (fieldName) =>
        `border ${formik.touched[fieldName] && formik.errors[fieldName]
            ? "border-red-500"
            : "border-[#007E74]"
        } rounded-md py-2 px-3 text-sm bg-[#F5FFFF] focus:outline-none text-[#0D2E28] placeholder:text-[#0D2E28] placeholder:opacity-70 w-full`;

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#007E74] px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="bg-gray-50 rounded-2xl shadow-xl p-8 text-center h-[450px] w-[450px] flex flex-col justify-center"
            >
                <h1 className="text-2xl font-bold text-[#007E74] myfont mb-2">
                    Expense Tracker
                </h1>
                <h2 className="text-lg font-bold text-[#0D2E28] font-myfont">USER LOGIN</h2>
                <p className="text-sm text-gray-500 mt-1 mb-6 font-myfont">Welcome Back</p>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm">
                        Login successful! Redirecting...
                    </div>
                )}

                <form onSubmit={formik.handleSubmit} className="space-y-4 flex flex-col items-center font-myfont">
                    <div className="w-[300px] sm:w-[80%]">
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter Email"
                            className={inputClass("email")}
                            {...formik.getFieldProps("email")}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
                        )}
                    </div>

                    <div className="w-[300px] sm:w-[80%]">
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter Password"
                            className={inputClass("password")}
                            {...formik.getFieldProps("password")}
                        />
                        {formik.touched.password && formik.errors.password && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
                        )}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={loading}
                        className="bg-[#007E74] font-myfont text-white py-2 rounded-lg shadow-md hover:bg-[#0D2E28] transition w-[300px] sm:w-[80%] mt-2 disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </motion.button>
                </form>

                <p className="text-sm text-gray-600 mt-4 font-myfont">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-[#007E74] hover:underline font-semibold">
                        Register here
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default UserLogin;