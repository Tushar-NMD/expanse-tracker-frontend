import { useState, useEffect } from "react";
import { Eye, Trash2, Plus } from "lucide-react";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../ui/Pagination";
import conf from "../../../config/index";

const ExpenseList = () => {
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeFilters, setActiveFilters] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [totalRecords, setTotalRecords] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const recordsPerPage = 10;

    const expertiseList = ["Transportation", "Entertainment", "Healthcare", "Shopping", "Education", "Bills", "Food", "Travel", "Other"];

    // Fetch expenses from API with filters
    const fetchExpenses = async (filters = {}) => {
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            // Build query parameters
            const queryParams = new URLSearchParams();

            // Add category filters
            if (filters.categories && filters.categories.length > 0) {
                filters.categories.forEach(category => {
                    queryParams.append('category', category);
                });
            }

            // Add search term
            if (filters.search && filters.search.trim()) {
                queryParams.append('search', filters.search.trim());
            }

            const queryString = queryParams.toString();
            const url = `${conf.apiBaseUrl}/api/expenses${queryString ? `?${queryString}` : ''}`;

            const response = await fetch(url, {
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
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch expenses');
            }

            const data = await response.json();

            if (data.success) {
                setExpenses(data.data || []);
                setTotalRecords((data.data && data.data.length) || 0);


            } else {
                throw new Error(data.message || 'Failed to fetch expenses');
            }
        } catch (error) {
            console.error('Error fetching expenses:', error);
            setError(error.message || 'Failed to fetch expenses');
        } finally {
            setLoading(false);
        }
    };

    // Load expenses on component mount
    useEffect(() => {
        fetchExpenses();
    }, []);

    // Handle filter changes
    useEffect(() => {
        const filters = {
            categories: activeFilters,
            search: searchTerm
        };
        fetchExpenses(filters);
    }, [activeFilters]);

    // Debounced search effect
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const filters = {
                categories: activeFilters,
                search: searchTerm
            };
            fetchExpenses(filters);
        }, 500); // 500ms delay

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    // Format amount for display
    const formatAmount = (amount) => {
        return `$${parseFloat(amount).toFixed(2)}`;
    };

    const goToPage = (page) => {
        setCurrentPage(page);
    };

    const toggleFilter = (expertise) => {
        setActiveFilters(prev => {
            const newFilters = prev.includes(expertise)
                ? prev.filter(item => item !== expertise)
                : [...prev, expertise];
            return newFilters;
        });
    };

    const removeFilter = (expertise) => {
        setActiveFilters(prev => prev.filter(item => item !== expertise));
    };

    const resetFilters = () => {
        setActiveFilters([]);
        setShowFilterPanel(false);
    };

    // Delete expense function
    const deleteExpense = async (expenseId) => {
        setDeleting(true);

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(`${conf.apiBaseUrl}/api/expenses/${expenseId}`, {
                method: 'DELETE',
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
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete expense');
            }

            const data = await response.json();

            if (data.success) {
                console.log('Expense deleted successfully:', data);
                // Refresh the expenses list
                const filters = {
                    categories: activeFilters,
                    search: searchTerm
                };
                fetchExpenses(filters);
                setDeleteModalOpen(false);
                setExpenseToDelete(null);
            } else {
                throw new Error(data.message || 'Failed to delete expense');
            }
        } catch (error) {
            console.error('Error deleting expense:', error);
            setError(error.message || 'Failed to delete expense');
        } finally {
            setDeleting(false);
        }
    };

    // Handle delete button click
    const handleDeleteClick = (expense) => {
        setExpenseToDelete(expense);
        setDeleteModalOpen(true);
    };

    return (
        <div className="bg-[#E0E9E9] w-full min-h-screen overflow-auto relative">
            {/* Header */}
            <div className="bg-white p-3 sm:p-4 shadow-md mb-4 rounded-md flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 relative">
                {/* Title */}
                <h1 className="text-lg sm:text-xl font-semibold sm:ml-2 text-[#0D2E28]">Expense List</h1>

                {/* Search Bar */}
                <div className="w-full sm:w-[350px] md:w-[400px] mx-auto sm:mx-0 sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2">
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">

                        </div>

                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#0D2E28] hover:text-[#007E74]"
                            >
                                <IoClose size={18} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Add Expense Button */}
                <div className="sm:ml-auto sm:mr-2 flex justify-center sm:justify-end">
                    <button
                        onClick={() => navigate('/expenses/add')}
                        className="flex items-center gap-2 bg-[#19A699] text-white px-3 sm:px-4 py-2 rounded-md hover:bg-[#19A699]/90 transition-colors w-full sm:w-auto justify-center text-sm sm:text-base"
                    >
                        <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
                        <span className="hidden sm:inline">Add New Expense</span>
                        <span className="sm:hidden">Add Expense</span>
                    </button>
                </div>
            </div>

            {/* Workers Table Section */}
            <div className="bg-white p-2 sm:p-4 shadow rounded-md relative">
                {/* Filters */}
                {/* Filter Section */}
                <div className="relative flex flex-wrap gap-2 pb-4">
                    {/* Filter Icon */}
                    <svg
                        onClick={() => setShowFilterPanel(!showFilterPanel)}
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        viewBox="0 0 40 40"
                        fill="none"
                        className="cursor-pointer"
                    >
                        <path
                            d="M0 10C0 4.47715 4.47715 0 10 0H30C35.5228 0 40 4.47715 40 10V30C40 35.5228 35.5228 40 30 40H10C4.47715 40 0 35.5228 0 30V10Z"
                            fill="#E0E9E9"
                        />
                        <path
                            d="M16.8571 20.506C14.3701 18.646 12.5961 16.6 11.6271 15.45C11.3271 15.094 11.2291 14.833 11.1701 14.374C10.9681 12.802 10.8671 12.016 11.3281 11.508C11.7891 11 12.6041 11 14.2341 11H25.7661C27.3961 11 28.2111 11 28.6721 11.507C29.1331 12.015 29.0321 12.801 28.8301 14.373C28.7701 14.832 28.6721 15.093 28.3731 15.449C27.4031 16.601 25.6261 18.651 23.1331 20.514C23.0178 20.6037 22.9225 20.7165 22.8533 20.8451C22.7841 20.9737 22.7425 21.1154 22.7311 21.261C22.4841 23.992 22.2561 25.488 22.1141 26.244C21.8851 27.466 20.1541 28.201 19.2261 28.856C18.6741 29.246 18.0041 28.782 17.9331 28.178C17.6676 25.8765 17.4429 23.5705 17.2591 21.261C17.2488 21.114 17.2077 20.9708 17.1385 20.8407C17.0692 20.7106 16.9733 20.5966 16.8571 20.506Z"
                            stroke="#0D2E28"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>

                    {/* Filter section started from here */}
                    {showFilterPanel && (
                        <div className="absolute left-0 top-14 bg-[#E0E9E9] rounded-lg shadow-lg px-4 py-2 w-70 border border-gray-300 z-50">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-[#0D2E28]">Categories</h3>
                                <button
                                    onClick={() => setShowFilterPanel(false)}
                                    className="text-[#0D2E28] hover:text-[#0D2E28] text-2xl"
                                >
                                    <IoClose />
                                </button>
                            </div>
                            <div className="space-y-3">
                                {expertiseList.map((item) => (
                                    <label
                                        key={item}
                                        className="flex items-center space-x-2 cursor-pointer text-[#0D2E28]"
                                    >
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-[#0D2E28] border-gray-300 rounded"
                                            checked={activeFilters.includes(item)}
                                            onChange={() => toggleFilter(item)}
                                        />
                                        <span>{item}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Active Filters */}
                    {activeFilters.map((filter) => (
                        <span
                            key={filter}
                            className="px-3 py-1 bg-[#E0E9E9] text-[#0D2E28] font-medium rounded-full flex items-center gap-1"
                        >
                            {filter}
                            <button
                                onClick={() => removeFilter(filter)}
                                className="text-[#0D2E28] font-semibold ml-1"
                            >
                                <IoClose />
                            </button>
                        </span>
                    ))}

                    {activeFilters.length > 0 && (
                        <button
                            onClick={resetFilters}
                            className="w-[200px] ml-auto border border-[#007E74] bg-[#D9F1EB] text-[#007E74] font-medium px-6 py-2 rounded-lg"
                        >
                            Reset Filter
                        </button>
                    )}
                </div>


                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {/* Table */}
                <div className="overflow-x-auto bg-white shadow-md rounded-lg min-h-[400px] sm:min-h-[600px] border border-gray-400">
                    <table className="w-full text-xs sm:text-sm text-left text-[#0D2E28] min-w-[800px]">
                        <thead className="bg-[#E0E9E9]">
                            <tr className="h-12 sm:h-14">
                                <th className="text-center font-medium text-sm sm:text-[16px] px-2">Sr.No.</th>
                                <th className="text-center font-medium text-sm sm:text-[16px] px-2">Title</th>
                                <th className="text-center font-medium text-sm sm:text-[16px] px-2">Amount</th>
                                <th className="text-center font-medium text-sm sm:text-[16px] px-2">Category</th>
                                <th className="text-center font-medium text-sm sm:text-[16px] px-2">Date</th>
                                <th className="text-center font-medium text-sm sm:text-[16px] px-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8">
                                        <div className="flex justify-center items-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007E74]"></div>
                                            <span className="ml-2">Loading expenses...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : expenses.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-gray-500">
                                        No expenses found. <button
                                            onClick={() => navigate('/expenses/add')}
                                            className="text-[#007E74] underline hover:no-underline"
                                        >
                                            Add your first expense
                                        </button>
                                    </td>
                                </tr>
                            ) : (
                                expenses.map((expense, index) => (
                                    <tr key={expense._id} className="bg-white border-b border-gray-100">
                                        <td className="text-center py-2 sm:py-3 px-2">{String(index + 1).padStart(2, '0')}</td>
                                        <td className="text-center py-2 sm:py-3 px-2">{expense.title}</td>
                                        <td className="text-center py-2 sm:py-3 px-2">{formatAmount(expense.amount)}</td>
                                        <td className="text-center py-2 sm:py-3 px-2">{expense.category}</td>
                                        <td className="text-center py-2 sm:py-3 px-2">{formatDate(expense.date)}</td>
                                        <td className="px-2 sm:px-6 py-2 sm:py-4">
                                            <div className="flex justify-center space-x-2 sm:space-x-4">
                                                <button
                                                    onClick={() => navigate(`/expenses/view/${expense._id}`)}
                                                    className="text-[#19A699] hover:text-[#007E74]"
                                                >
                                                    <Eye size={16} className="sm:w-5 sm:h-5" />
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/expenses/edit/${expense._id}`)}
                                                    className="text-[#19A699] hover:text-[#007E74]"
                                                >
                                                    <svg
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="sm:w-5 sm:h-5"
                                                    >
                                                        <path
                                                            d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                                                            stroke="#007E74"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                        <path
                                                            d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z"
                                                            stroke="#007E74"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(expense)}
                                                    className="text-[#19A699] hover:text-[#007E74]"
                                                >
                                                    <Trash2 size={16} className="sm:w-5 sm:h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination - Only show if there are expenses */}
                {!loading && expenses.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalRecords={totalRecords}
                        recordsPerPage={recordsPerPage}
                        goToPage={goToPage}
                        label="entries"
                    />
                )}
            </div>

            {/* Delete Modal */}
            {deleteModalOpen && expenseToDelete && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-50">
                    <div className="bg-white rounded-lg shadow-2xl w-[90%] max-w-md p-6 border border-gray-300">
                        <h2 className="text-xl font-bold text-center text-[#0D2E28] mb-3">
                            Delete Expense
                        </h2>
                       
                        <p className="text-[#0D2E28] text-center mb-6 leading-relaxed">
                            Are you sure you want to delete this expense? This action cannot be undone.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => {
                                    setDeleteModalOpen(false);
                                    setExpenseToDelete(null);
                                }}
                                disabled={deleting}
                                className="px-8 py-2 rounded-md border border-[#19A699] bg-[#E0E9E9] text-[#19A699] font-medium hover:opacity-90 transition disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => deleteExpense(expenseToDelete._id)}
                                disabled={deleting}
                                className="px-8 py-2 rounded-md border border-[#19A699] bg-[#19A699] text-white font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}



        </div>
    );
};

export default ExpenseList;
