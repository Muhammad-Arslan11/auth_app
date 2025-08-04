import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";
import DashboardPage from "./components/pages/DashboardPage";
import SignUpPage from "./components/pages/SignUpPage";
import LoginPage from "./components/pages/LoginPage";
import ResetPasswordPage from "./components/pages/ResetPasswordPage";
import ForgotPasswordPage from "./components/pages/ForgotPassword";
import EmailVerificationPage from "./components/pages/EmailVerificationPage";
import { useAuthStore } from "./store/authStore.js";
import LoadingSpinner from "./components/LoadingSpinner";

import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

// ✅ Stable selectors for auth state
const ProtectedRoute = ({ children }) => {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const user = useAuthStore((state) => state.user);

	if (!isAuthenticated) return <Navigate to="/login" replace />;
	if (user && !user.isVerified) return <Navigate to="/verify-email" replace />;

	return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const user = useAuthStore((state) => state.user);

	if (isAuthenticated && user?.isVerified) {
		return <Navigate to="/" replace />;
	}

	return children;
};


function App() {
	// only track loading state here
	const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

	useEffect(() => {
		// ✅ avoid unstable function references
		useAuthStore.getState().checkAuth();
	}, []);

	if (isCheckingAuth) return <LoadingSpinner />;

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
			<FloatingShape color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
			<FloatingShape color="bg-emerald-500" size="w-48 h-48" top="70%" left="80%" delay={5} />
			<FloatingShape color="bg-lime-500" size="w-32 h-32" top="40%" left="-10%" delay={2} />

			<Routes>
				<Route
					path="/"
					element={
						<ProtectedRoute>
							<DashboardPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/signup"
					element={
						<RedirectAuthenticatedUser>
							<SignUpPage />
						</RedirectAuthenticatedUser>
					}
				/>
				<Route
					path="/login"
					element={
						<RedirectAuthenticatedUser>
							<LoginPage />
						</RedirectAuthenticatedUser>
					}
				/>
				<Route path="/verify-email" element={<EmailVerificationPage />} />
				<Route
					path="/forgot-password"
					element={
						<RedirectAuthenticatedUser>
							<ForgotPasswordPage />
						</RedirectAuthenticatedUser>
					}
				/>
				<Route
					path="/reset-password/:token"
					element={
						<RedirectAuthenticatedUser>
							<ResetPasswordPage />
						</RedirectAuthenticatedUser>
					}
				/>
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
			<Toaster />
		</div>
	);
}

export default App;
