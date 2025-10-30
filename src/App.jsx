import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserRegister from "./pages/auth/userRegister";
import UserLogin from "./pages/auth/userLogin";
import Dashboard from "./pages/module/Dashboard";
import ExpenseList from "./pages/module/Expense/ExpenseList";
import ExpenseAdd from "./pages/module/Expense/ExpenseAdd";
import ExpenseView from "./pages/module/Expense/ExpenseView";
import ExpenseEdit from "./pages/module/Expense/ExpenseEdit";
import { useState } from "react";
import NavbarUI from "./Layout/navbar";
import SidebarUI from "./Layout/sidebar";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/register" replace />} />
          <Route path="/register" element={<UserRegister />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/dashboard" element={
            <div className="min-h-screen bg-gray-100">
              <NavbarUI onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
              <div className="flex pt-16">
                <SidebarUI isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <div className="flex-1 overflow-y-auto lg:ml-[270px]">
                  <Dashboard />
                </div>
              </div>
            </div>
          } />
          <Route path="/expenses" element={
            <div className="min-h-screen bg-gray-100">
              <NavbarUI onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
              <div className="flex pt-16">
                <SidebarUI isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <div className="flex-1 overflow-y-auto lg:ml-[270px]">
                  <ExpenseList />
                </div>
              </div>
            </div>
          } />
          <Route path="/expenses/add" element={
            <div className="min-h-screen bg-gray-100">
              <NavbarUI onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
              <div className="flex pt-16">
                <SidebarUI isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <div className="flex-1 overflow-y-auto lg:ml-[270px]">
                  <ExpenseAdd />
                </div>
              </div>
            </div>
          } />
          <Route path="/expenses/view/:id" element={
            <div className="min-h-screen bg-gray-100">
              <NavbarUI onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
              <div className="flex pt-16">
                <SidebarUI isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <div className="flex-1 overflow-y-auto lg:ml-[270px]">
                  <ExpenseView />
                </div>
              </div>
            </div>
          } />
          <Route path="/expenses/edit/:id" element={
            <div className="min-h-screen bg-gray-100">
              <NavbarUI onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
              <div className="flex pt-16">
                <SidebarUI isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <div className="flex-1 overflow-y-auto lg:ml-[270px]">
                  <ExpenseEdit />
                </div>
              </div>
            </div>
          } />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;