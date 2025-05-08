import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth/auth';
import { useAuth } from '../../services/auth/authContext';
import { ChevronRight, Lock, User, Coffee } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const { checkAuthStatus } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await authService.login({
                username: formData.username.trim(),
                password: formData.password
            });
            checkAuthStatus(); // Update auth context after successful login
            navigate('/'); // Navigate to home page
        } catch (err) {
            // @ts-ignore
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Decorative food elements */}
            <div className="absolute top-4 left-4 opacity-5 lg:opacity-10">
                <img src="/api/placeholder/200/200" alt="placeholder" className="w-40 h-40" />
            </div>
            <div className="absolute bottom-4 right-4 opacity-5 lg:opacity-10">
                <img src="/api/placeholder/200/200" alt="placeholder" className="w-40 h-40" />
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="flex justify-center">
                    <div className="bg-orange-500 text-white rounded-full p-4 shadow-lg transform transition-all duration-500 hover:scale-110">
                        <Coffee size={32} />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Welcome Back</h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Sign in to order your favorite food
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 transform transition-all duration-500 hover:shadow-2xl">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded animate-pulse">
                            <p className="font-medium">Oops!</p>
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <div className={`flex items-center relative border rounded-lg transition-all duration-300 ${
                                focusedField === 'username' ? 'border-orange-500 ring-1 ring-orange-500 shadow-sm' : 'border-gray-300'
                            }`}>
                                <span className="pl-3 text-gray-400">
                                    <User size={18} />
                                </span>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    className="block w-full pl-3 py-3 rounded-lg focus:outline-none bg-transparent"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    onFocus={() => setFocusedField('username')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Enter your username"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className={`flex items-center relative border rounded-lg transition-all duration-300 ${
                                focusedField === 'password' ? 'border-orange-500 ring-1 ring-orange-500 shadow-sm' : 'border-gray-300'
                            }`}>
                                <span className="pl-3 text-gray-400">
                                    <Lock size={18} />
                                </span>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="block w-full pl-3 py-3 rounded-lg focus:outline-none bg-transparent"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Enter your password"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>
                            <Link to="/forgot-password" className="text-sm font-medium text-orange-600 hover:text-orange-500 transition-colors duration-300">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 transition-all duration-300 transform hover:translate-y-px"
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    Sign in
                                    <ChevronRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                                </span>
                            )}
                        </button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    Don't have an account?
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Link
                                to="/register"
                                className="w-full flex justify-center py-3 px-4 border border-orange-300 rounded-lg shadow-sm text-sm font-medium text-orange-600 bg-transparent hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300"
                            >
                                Create a new account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;