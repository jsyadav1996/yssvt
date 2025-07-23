'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Plus, DollarSign, CreditCard, Building2, CreditCard as Paypal } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';

interface Donation {
  _id: string;
  amount: number;
  currency: string;
  purpose?: string;
  anonymous: boolean;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export default function DonationsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    purpose: '',
    anonymous: false,
    paymentMethod: 'credit_card',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDonations();
    }
  }, [isAuthenticated]);

  const fetchDonations = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getMyDonations();
      
      if (data.success && data.data) {
        setDonations(data.data.donations);
      } else {
        toast.error('Failed to load donations');
      }
    } catch (error) {
      toast.error('Failed to load donations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await apiClient.createDonation({
        ...formData,
        amount: parseFloat(formData.amount),
      });
      
      if (data.success) {
        toast.success('Donation submitted successfully!');
        setShowDonationForm(false);
        setFormData({
          amount: '',
          currency: 'USD',
          purpose: '',
          anonymous: false,
          paymentMethod: 'credit_card',
        });
        fetchDonations();
      } else {
        toast.error(data.message || 'Failed to submit donation');
      }
    } catch (error) {
      toast.error('Failed to submit donation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'failed':
        return 'badge-error';
      default:
        return 'badge-info';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'credit_card':
      case 'debit_card':
        return <CreditCard className="h-4 w-4" />;
      case 'bank_transfer':
        return <Building2 className="h-4 w-4" />;
      case 'paypal':
        return <Paypal className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main Content */}
      <main className="px-4 py-6 pb-20">
        {/* Donation Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="card p-3 text-center">
            <Heart className="h-6 w-6 text-red-600 mx-auto mb-2" />
            <p className="text-xs text-gray-500 mb-1">Total Donations</p>
            <p className="text-lg font-bold text-gray-900">
              {donations.length}
            </p>
          </div>
          
          <div className="card p-3 text-center">
            <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-xs text-gray-500 mb-1">Total Amount</p>
            <p className="text-lg font-bold text-gray-900">
              ${donations.reduce((sum, d) => sum + d.amount, 0).toFixed(0)}
            </p>
          </div>
        </div>

        {/* Donation History */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Donations</h3>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="loading-spinner"></div>
            </div>
          ) : donations.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No donations yet</h3>
              <p className="text-gray-600 mb-4">
                Make your first donation to support our community
              </p>
              <button
                onClick={() => setShowDonationForm(true)}
                className="btn-primary"
              >
                Make a Donation
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {donations.map((donation) => (
                <div key={donation._id} className="card">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        {getPaymentMethodIcon(donation.paymentMethod)}
                        <span className="font-semibold text-gray-900">
                          ${donation.amount} {donation.currency}
                        </span>
                      </div>
                      <span className={`badge ${getStatusColor(donation.status)}`}>
                        {donation.status}
                      </span>
                    </div>
                    
                    {donation.purpose && (
                      <p className="text-sm text-gray-600 mb-2">
                        {donation.purpose}
                      </p>
                    )}
                    
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </span>
                      {donation.anonymous && (
                        <span>Anonymous</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Donation Form Modal */}
      {showDonationForm && (
        <div className="mobile-modal">
          <div className="mobile-modal-content">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Make a Donation</h2>
                <button
                  onClick={() => setShowDonationForm(false)}
                  className="text-gray-500 p-2"
                >
                  ×
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="input pl-8"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              {/* Currency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="input"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                </select>
              </div>

              {/* Purpose */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purpose (Optional)
                </label>
                <input
                  type="text"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="input"
                  placeholder="What is this donation for?"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="input"
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="paypal">PayPal</option>
                  <option value="cash">Cash</option>
                </select>
              </div>

              {/* Anonymous */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={formData.anonymous}
                  onChange={(e) => setFormData({ ...formData, anonymous: e.target.checked })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="anonymous" className="text-sm text-gray-700">
                  Make this donation anonymous
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="loading-spinner mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Submit Donation'
                )}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
} 