import { useState } from "react";
import { useNavigate } from "react-router-dom";
import conf from "../../../config/index";

const ExpenseAdd = () => {
    const navigate = useNavigate();
    const [expenseData, setExpenseData] = useState({
        title: "",
        amount: "",
        category: "",
        date: new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExpenseData({ ...expenseData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('No authentication token found. Please login again.');
            }

            const response = await fetch(`${conf.apiBaseUrl}/api/expenses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: expenseData.title,
                    amount: parseFloat(expenseData.amount),
                    category: expenseData.category,
                    date: expenseData.date
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();

                // If unauthorized, redirect to login
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }

                throw new Error(errorData.message || 'Failed to add expense');
            }

            const data = await response.json();
            console.log('Expense added successfully:', data);

            // Reset form
            setExpenseData({
                title: "",
                amount: "",
                category: "",
                date: new Date().toISOString().split('T')[0]
            });

            // Navigate to expenses list
            navigate('/expenses');
        } catch (error) {
            console.error('Error adding expense:', error);
            setError(error.message || 'Failed to add expense. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#E0E9E9] w-full min-h-screen overflow-auto">
            {/* Header */}
            <div className="bg-white border rounded-md shadow mb-2">
                <div className="flex items-center gap-2 p-3 sm:p-4">
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 40 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="cursor-pointer sm:w-7 sm:h-7"
                        onClick={() => navigate('/expenses')}
                    >
                        <path
                            d="M20.0007 36.6663C29.2054 36.6663 36.6673 29.2044 36.6673 19.9997C36.6673 10.7949 29.2054 3.33301 20.0007 3.33301C10.7959 3.33301 3.33398 10.7949 3.33398 19.9997C3.33398 29.2044 10.7959 36.6663 20.0007 36.6663Z"
                            stroke="#0D2E28"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M20.0007 13.333L13.334 19.9997L20.0007 26.6663"
                            stroke="#0D2E28"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M26.6673 20H13.334"
                            stroke="#0D2E28"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>

                    <h2 className="text-base sm:text-lg font-semibold text-[#0D2E28]">
                        Add New Expense
                    </h2>
                </div>
            </div>

            {/* Form Section */}
            <div className="bg-white border rounded-md shadow p-4 sm:p-8 mt-4 mb-4">
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="border border-[#616666] rounded-md p-4 sm:p-8">
                        {/* Title */}
                        <div className="flex flex-col md:flex-row items-start md:items-center mb-6 sm:mb-8">
                            <label className="w-full md:w-1/4 font-medium text-[#0D2E28] mb-2 md:mb-0 text-sm sm:text-base">
                                Title:
                            </label>
                            <div className="w-full md:w-3/4">
                                <input
                                    type="text"
                                    name="title"
                                    value={expenseData.title}
                                    onChange={handleChange}
                                    placeholder="Enter expense title"
                                    required
                                    className="w-full border border-[#007E74] rounded-md px-4 sm:px-8 py-2 focus:outline-none bg-[#F5FFFF] placeholder-[#0D2E28] text-sm sm:text-base"
                                />
                            </div>
                        </div>

                        {/* Amount */}
                        <div className="flex flex-col md:flex-row items-start md:items-center mb-8">
                            <label className="w-full md:w-1/4 font-medium text-[#0D2E28] mb-2 md:mb-0">
                                Amount:
                            </label>
                            <div className="w-full md:w-3/4">
                                <input
                                    type="number"
                                    name="amount"
                                    value={expenseData.amount}
                                    onChange={handleChange}
                                    placeholder="Enter amount"
                                    min="0.01"
                                    step="0.01"
                                    required
                                    className="w-full border border-[#007E74] rounded-md px-4 sm:px-8 py-2 focus:outline-none bg-[#F5FFFF] placeholder-[#0D2E28] text-sm sm:text-base"
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div className="flex flex-col md:flex-row items-start md:items-center mb-8">
                            <label className="w-full md:w-1/4 font-medium text-[#0D2E28] mb-2 md:mb-0">
                                Category:
                            </label>
                            <div className="w-full md:w-3/4">
                                <select
                                    name="category"
                                    value={expenseData.category}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-[#007E74] rounded-md px-4 sm:px-8 py-2 focus:outline-none bg-[#F5FFFF] text-[#0D2E28]"
                                >
                                    <option value="">Select Category</option>
                                    <option value="Food">Food</option>
                                    <option value="Transportation">Transportation</option>
                                    <option value="Entertainment">Entertainment</option>
                                    <option value="Healthcare">Healthcare</option>
                                    <option value="Shopping">Shopping</option>
                                    <option value="Bills">Bills</option>
                                    <option value="Education">Education</option>
                                    <option value="Travel">Travel</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        {/* Date */}
                        <div className="flex flex-col md:flex-row items-start md:items-center mb-8">
                            <label className="w-full md:w-1/4 font-medium text-[#0D2E28] mb-2 md:mb-0">
                                Date:
                            </label>
                            <div className="w-full md:w-3/4">
                                <input
                                    type="date"
                                    name="date"
                                    value={expenseData.date}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-[#007E74] rounded-md px-4 sm:px-8 py-2 focus:outline-none bg-[#F5FFFF] text-[#0D2E28]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-6 sm:mt-8 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/expenses')}
                            className="w-full sm:w-[200px] h-[40px] border border-[#007E74] text-[#007E74] rounded-md hover:bg-teal-50 text-sm bg-[#D9F1EB]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-[200px] h-[40px] text-white rounded-md text-sm bg-[#007E74] hover:bg-[#D9F1EB]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Adding...' : 'Add Expense'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExpenseAdd;
