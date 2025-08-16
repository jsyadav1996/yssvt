import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../lib/api';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await apiClient.forgotPassword(email);
      if (response.success) {
        setMessage('Password reset link has been sent to your email address.');
        setEmail('');
      } else {
        setError(response.message || 'Failed to send reset link');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <div className="max-w-sm mx-auto">
        {/* Page Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Forgot Password
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        {/* Forgot Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {message && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm">
              {error}
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1 sm:space-y-2">
            <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Enter your email address"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 text-white py-2 sm:py-3 px-4 rounded-xl font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent mr-2"></div>
                <span className="text-sm sm:text-base">Sending...</span>
              </div>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 sm:my-8 flex items-center">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-3 sm:px-4 text-xs sm:text-sm text-gray-500">or</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Back to Login Link */}
        <div className="text-center">
          <p className="text-xs sm:text-sm text-gray-600">
            Remember your password?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
