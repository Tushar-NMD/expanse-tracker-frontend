import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import conf from "../../../config/index";

const ExpenseEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [expenseData, setExpenseData] = useState({
        title: "",
        amount: "",
        category: "",
        date: ""
    });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");

    // Fetch existing expense data
    const fetchExpense = async () => {
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(`${conf.apiBaseUrl}/api/expenses/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }
                if (response.status === 404) {
                    setError('Expense not found');
                    return;
                }
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch expense');
            }

            const data = await response.json();

            if (data.success) {
                const expense = data.data;
                setExpenseData({
                    title: expense.title || "",
                    amount: expense.amount ? expense.amount.toString() : "",
                    category: expense.category || "",
                    date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : ""
                });
            } else {
                throw new Error(data.message || 'Failed to fetch expense');
            }
        } catch (error) {
            console.error('Error fetching expense:', error);
            setError(error.message || 'Failed to fetch expense');
        } finally {
            setLoading(false);
        }
    };

    // Load expense on component mount
    useEffect(() => {
        if (id) {
            fetchExpense();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExpenseData({ ...expenseData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setError("");

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(`${conf.apiBaseUrl}/api/expenses/${id}`, {
                method: 'PUT',
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
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update expense');
            }

            const data = await response.json();

            if (data.success) {
                console.log('Expense updated successfully:', data);
                navigate('/expenses');
            } else {
                throw new Error(data.message || 'Failed to update expense');
            }
        } catch (error) {
            console.error('Error updating expense:', error);
            setError(error.message || 'Failed to update expense. Please try again.');
        } finally {
            setUpdating(false);
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
                        Edit Expense
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

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007E74]"></div>
                        <span className="ml-2">Loading expense data...</span>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">Unable to load expense data</p>
                        <button
                            onClick={() => navigate('/expenses')}
                            className="px-6 py-2 bg-[#007E74] text-white rounded-md hover:bg-[#007E74]/90"
                        >
                            Back to List
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="border border-[#616666] rounded-md p-4 sm:p-8 mb-6">
                            <div className="space-y-4 sm:space-y-6">
                                {/* Title */}
                                <div className="flex flex-col md:flex-row items-start md:items-center">
                                    <label className="w-full md:w-1/4 font-medium text-[#0D2E28] mb-2 md:mb-0 text-sm sm:text-base">
                                        Title:
                                    </label>
                                    <div className="w-full md:w-3/4">
                                        <input
                                            type="text"
                                            name="title"
                                            placeholder="Enter expense title"
                                            value={expenseData.title}
                                            onChange={handleChange}
                                            required
                                            className="w-full border border-[#007E74] rounded-md px-4 sm:px-8 py-2 focus:outline-none bg-[#F5FFFF] placeholder-[#0D2E28] text-[#0D2E28] text-sm sm:text-base"
                                        />
                                    </div>
                                </div>

                                {/* Amount */}
                                <div className="flex flex-col md:flex-row items-start md:items-center">
                                    <label className="w-full md:w-1/4 font-medium text-[#0D2E28] mb-2 md:mb-0 text-sm sm:text-base">
                                        Amount:
                                    </label>
                                    <div className="w-full md:w-3/4">
                                        <input
                                            type="number"
                                            name="amount"
                                            placeholder="Enter amount"
                                            value={expenseData.amount}
                                            onChange={handleChange}
                                            min="0.01"
                                            step="0.01"
                                            required
                                            className="w-full border border-[#007E74] rounded-md px-4 sm:px-8 py-2 focus:outline-none bg-[#F5FFFF] placeholder-[#0D2E28] text-[#0D2E28] text-sm sm:text-base"
                                        />
                                    </div>
                                </div>

                                {/* Category */}
                                <div className="flex flex-col md:flex-row items-start md:items-center">
                                    <label className="w-full md:w-1/4 font-medium text-[#0D2E28] mb-2 md:mb-0 text-sm sm:text-base">
                                        Category:
                                    </label>
                                    <div className="w-full md:w-3/4">
                                        <select
                                            name="category"
                                            value={expenseData.category}
                                            onChange={handleChange}
                                            required
                                            className="w-full border border-[#007E74] rounded-md px-4 sm:px-8 py-2 focus:outline-none bg-[#F5FFFF] text-[#0D2E28] text-sm sm:text-base"
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
                                <div className="flex flex-col md:flex-row items-start md:items-center">
                                    <label className="w-full md:w-1/4 font-medium text-[#0D2E28] mb-2 md:mb-0 text-sm sm:text-base">
                                        Date:
                                    </label>
                                    <div className="w-full md:w-3/4">
                                        <input
                                            type="date"
                                            name="date"
                                            value={expenseData.date}
                                            onChange={handleChange}
                                            required
                                            className="w-full border border-[#007E74] rounded-md px-4 sm:px-8 py-2 focus:outline-none bg-[#F5FFFF] text-[#0D2E28] text-sm sm:text-base"
                                        />
                                    </div>
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
                                disabled={updating}
                                className="w-full sm:w-[200px] h-[40px] text-white rounded-md text-sm bg-[#007E74] hover:bg-[#D9F1EB]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {updating ? 'Updating...' : 'Update Expense'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ExpenseEdit;
