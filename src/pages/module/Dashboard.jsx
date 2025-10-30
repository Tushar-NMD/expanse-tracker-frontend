import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, DollarSign } from "lucide-react";
import conf from "../../config/index";

const Dashboard = () => {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState({
        totalExpenses: 0,
        totalAmount: 0,
        categoryData: [],
        recentExpenses: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Color palette for categories
    const categoryColors = {
        "Transportation": "#4ECDC4",
        "Entertainment": "#45B7D1",
        "Healthcare": "#96CEB4",
        "Shopping": "#FFEAA7",
        "Education": "#98D8C8",
        "Bills": "#DDA0DD",
        "Food": "#FF6B6B",
        "Travel": "#19A699",
        "Other": "#A0AEC0"
    };

    // Fetch dashboard summary from API
    const fetchDashboardSummary = async () => {
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(`${conf.apiBaseUrl}/api/expenses/summary`, {
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
                throw new Error(errorData.message || 'Failed to fetch dashboard data');
            }

            const data = await response.json();

            if (data.success) {
                const summary = data.data;

                // Transform category breakdown data
                const categoryData = summary.categoryBreakdown.map(item => ({
                    category: item.category,
                    amount: item.totalAmount,
                    percentage: item.percentage,
                    color: categoryColors[item.category] || "#A0AEC0"
                }));

                setDashboardData({
                    totalExpenses: summary.totalExpenses || 0,
                    totalAmount: summary.totalAmount || 0,
                    categoryData: categoryData,
                    recentExpenses: summary.expenses || []
                });
            } else {
                throw new Error(data.message || 'Failed to fetch dashboard data');
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError(error.message || 'Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    // Load dashboard data on component mount
    useEffect(() => {
        fetchDashboardSummary();
    }, []);

    const StatCard = ({ title, value, icon: Icon, subtitle, bgColor = "bg-white" }) => (
        <div className={`${bgColor} p-4 sm:p-6 rounded-lg shadow-md border border-gray-200`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-[#0D2E28] opacity-70">{title}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-[#0D2E28] mt-1">{value}</p>
                    {subtitle && <p className="text-xs text-[#0D2E28] opacity-60 mt-1">{subtitle}</p>}
                </div>
                <div className="bg-[#19A699] p-3 rounded-full">
                    <Icon size={24} className="text-white" />
                </div>
            </div>
        </div>
    );

    const CategoryCard = ({ category, amount, percentage, color }) => (
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
                <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: color }}
                ></div>
                <h3 className="font-semibold text-[#0D2E28]">{category}</h3>
            </div>
            <p className="text-xl font-bold text-[#0D2E28]">${parseFloat(amount).toFixed(2)}</p>
            <p className="text-sm text-gray-600 mb-2">{percentage}% of total</p>
            <div className="mt-2 bg-[#E0E9E9] rounded-full h-2">
                <div
                    className="h-2 rounded-full"
                    style={{
                        backgroundColor: color,
                        width: `${percentage}%`
                    }}
                ></div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="bg-[#E0E9E9] w-full min-h-screen overflow-auto flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007E74]"></div>
                    <span className="mt-4 text-[#0D2E28]">Loading dashboard...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#E0E9E9] w-full min-h-screen overflow-auto">
            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
                <StatCard
                    title="Total Amount"
                    value={`$${parseFloat(dashboardData.totalAmount).toFixed(2)}`}
                    icon={DollarSign}
                    subtitle="Total spent"
                />
                <StatCard
                    title="Total Expenses"
                    value={dashboardData.totalExpenses}
                    icon={Eye}
                    subtitle="Number of expenses"
                />
            </div>

            {/* Category Summary */}
            <div className="bg-white p-4 sm:p-6 shadow-md rounded-md mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-[#0D2E28]">Category-wise Summary</h2>
                    <button
                        onClick={() => navigate('/expenses')}
                        className="text-[#19A699] hover:text-[#007E74] text-sm font-medium"
                    >
                        View All
                    </button>
                </div>

                {dashboardData.categoryData.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">No expenses found</p>
                        <button
                            onClick={() => navigate('/expenses/add')}
                            className="px-6 py-2 bg-[#19A699] text-white rounded-md hover:bg-[#19A699]/90"
                        >
                            Add Your First Expense
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {dashboardData.categoryData.map((item, index) => (
                            <CategoryCard
                                key={index}
                                category={item.category}
                                amount={item.amount}
                                percentage={item.percentage}
                                color={item.color}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Recent Expenses */}
            {dashboardData.recentExpenses.length > 0 && (
                <div className="bg-white p-4 sm:p-6 shadow-md rounded-md mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-[#0D2E28]">Recent Expenses</h2>
                        <button
                            onClick={() => navigate('/expenses')}
                            className="text-[#19A699] hover:text-[#007E74] text-sm font-medium"
                        >
                            View All
                        </button>
                    </div>
                    <div className="space-y-3">
                        {dashboardData.recentExpenses.slice(0, 5).map((expense) => (
                            <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <h3 className="font-medium text-[#0D2E28]">{expense.title}</h3>
                                    <p className="text-sm text-gray-600">{expense.category}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-[#0D2E28]">${parseFloat(expense.amount).toFixed(2)}</p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(expense.date).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;