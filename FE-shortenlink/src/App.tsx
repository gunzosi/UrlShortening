import React, {ReactNode} from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LinkManagement from './pages/LinkManagement';
import CreateLinkPage from './pages/CreateLinkPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { Routes, Route, Navigate } from 'react-router-dom';
import QrCodePage from "./components/QRCodePage";
import AnalyticsPage from "./components/AnalyticsPage";
import EditPage from "./components/EditPage";
import { useAuth } from './hooks/AuthContext';

interface ProtectedRouteProps {
    children: ReactNode;
}

// const ProtectedRoute = ({ children }) => {
//     const { isAuthenticated } = useAuth();
//     if (!isAuthenticated) {
//         console.error("Access denied. User is not authenticated.");
//         return <Navigate to="/login" replace />;
//     }
//     return children;
// };


interface ProtectedRouteProps {
    children: ReactNode; // Sử dụng ReactNode để hỗ trợ bất kỳ kiểu JSX nào
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        console.error("Access denied. User is not authenticated.");
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};


const App = () => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1">
                <Header />
                <main className="p-6">
                    <Routes>
                        {/* Authentication Routes */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />

                        {/* Protected Routes */}
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <LinkManagement />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/create"
                            element={
                                <ProtectedRoute>
                                    <CreateLinkPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/qr-code"
                            element={
                                <ProtectedRoute>
                                    <QrCodePage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/analytics/:urlCode"
                            element={
                                <ProtectedRoute>
                                    <AnalyticsPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/edit/:urlCode"
                            element={
                                <ProtectedRoute>
                                    <EditPage />
                                </ProtectedRoute>
                            }
                        />

                        {/* Redirect to login for any undefined routes */}
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default App;