import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../lib/api';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isValidToken, setIsValidToken] = useState(false);

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token');
      return;
    }

    // Validate the token
    const validateToken = async () => {
      try {
        const response = await apiClient.validateResetToken(token);
        if (response.success) {
          setIsValidToken(true);
        } else {
          setError('Invalid or expired reset token, try again to request a new link');
        }
      } catch (err) {
        setError('Failed to validate reset token');
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await apiClient.resetPassword(token!, password);
      if (response.success) {
        setMessage('Password has been reset successfully!');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="bg-white">
        <div className="max-w-sm mx-auto text-center">
          <div className="bg-red-50 border border-red-200 text-red-600 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm mb-4">
            Invalid or missing reset token
          </div>
          <div className="mt-4">
            <Link
              to="/forgot-password"
              className="text-primary-600 hover:text-primary-700 font-medium text-xs sm:text-sm"
            >
              Request a new reset link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="bg-white">
        <div className="max-w-sm mx-auto text-center">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm">
            {error ? error : 'Validating reset token...'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-sm mx-auto">
        {/* Page Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Reset Password
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Enter your new password below
          </p>
        </div>

        {/* Reset Password Form */}
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

          {/* New Password Field */}
          <div className="space-y-1 sm:space-y-2">
            <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700">
              New Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                name="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Enter new password"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1 sm:space-y-2">
            <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Confirm new password"
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
                <span className="text-sm sm:text-base">Resetting...</span>
              </div>
            ) : (
              'Reset Password'
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

export default ResetPasswordPage;
