import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import conf from "../../../config/index";

const ExpenseView = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [expense, setExpense] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch expense details from API
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
                setExpense(data.data);
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

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    // Format amount for display
    const formatAmount = (amount) => {
        if (!amount) return "";
        return `$${parseFloat(amount).toFixed(2)}`;
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
                        View Expense
                    </h2>
                </div>
            </div>

            {/* Expense Details */}
            <div className="bg-white border rounded-md shadow p-4 sm:p-8 mt-4 mb-4">
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007E74]"></div>
                        <span className="ml-2">Loading expense details...</span>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">Unable to load expense details</p>
                        <button
                            onClick={() => navigate('/expenses')}
                            className="px-6 py-2 bg-[#007E74] text-white rounded-md hover:bg-[#007E74]/90"
                        >
                            Back to List
                        </button>
                    </div>
                ) : expense ? (
                    <>
                        <div className="border border-[#616666] rounded-md p-4 sm:p-8 mb-6">
                            <div className="space-y-4 sm:space-y-6">
                                <Field label="Title" value={expense.title} />
                                <Field label="Amount" value={formatAmount(expense.amount)} />
                                <Field label="Category" value={expense.category} />
                                <Field label="Date" value={formatDate(expense.date)} />
                              
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                            <button
                                onClick={() => navigate('/expenses')}
                                className="w-full sm:w-[200px] h-[40px] border border-[#007E74] text-[#007E74] rounded-md hover:bg-teal-50 text-sm bg-[#D9F1EB]"
                            >
                                Back to List
                            </button>
                            <button
                                onClick={() => navigate(`/expenses/edit/${id}`)}
                                className="w-full sm:w-[200px] h-[40px] text-white rounded-md text-sm bg-[#007E74] hover:bg-[#D9F1EB]/90"
                            >
                                Edit
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">Expense not found</p>
                        <button
                            onClick={() => navigate('/expenses')}
                            className="px-6 py-2 bg-[#007E74] text-white rounded-md hover:bg-[#007E74]/90"
                        >
                            Back to List
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// Reusable field component
const Field = ({ label, value }) => (
    <div className="flex flex-col md:flex-row items-start md:items-center">
        <label className="w-full md:w-1/4 font-medium text-[#0D2E28] mb-2 md:mb-0 text-sm sm:text-base">
            {label}:
        </label>
        <div className="w-full md:w-3/4">
            <input
                type="text"
                value={value || ""}
                readOnly
                className="w-full border border-[#007E74] rounded-md px-4 sm:px-8 py-2 bg-[#F5FFFF] text-[#0D2E28] text-sm sm:text-base"
            />
        </div>
    </div>
);

export default ExpenseView;