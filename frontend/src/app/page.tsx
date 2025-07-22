'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { Calendar, Users, Heart, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    // Check if user is authenticated and redirect accordingly
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const features = [
    {
      icon: Calendar,
      title: 'Community Events',
      description: 'Join exciting events and activities organized by our community.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Users,
      title: 'Member Network',
      description: 'Connect with fellow members and build meaningful relationships.',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Heart,
      title: 'Donations',
      description: 'Support our community initiatives through secure donations.',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Header */}
      <header className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-primary-600">YSSVT Community</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push('/login')}
              className="text-sm font-medium text-gray-600 px-3 py-2 rounded-lg active:bg-gray-100"
            >
              Login
            </button>
            <button
              onClick={() => router.push('/register')}
              className="btn-primary btn-sm"
            >
              Join
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to{' '}
            <span className="text-primary-600">YSSVT Community</span>
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Connect, collaborate, and contribute to our vibrant community. Join us in building meaningful relationships and making a positive impact together.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/register')}
              className="btn-primary w-full"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button
              onClick={() => router.push('/events')}
              className="btn-outline w-full"
            >
              View Events
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-8 bg-gray-50">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            What We Offer
          </h2>
          <p className="text-gray-600 text-center">
            Discover the amazing features that make our community platform special
          </p>
        </div>
        
        <div className="space-y-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card p-4"
            >
              <div className="flex items-center space-x-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-8 bg-primary-600">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-primary-100 mb-6">
            Become a part of something bigger. Connect with like-minded individuals and make a difference.
          </p>
          <button
            onClick={() => router.push('/register')}
            className="btn bg-white text-primary-600 active:bg-gray-50 w-full"
          >
            Join Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white px-4 py-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold mb-2">YSSVT Community</h3>
            <p className="text-gray-400 text-sm">
              Building a stronger community through connection, collaboration, and shared values.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <button
                    onClick={() => router.push('/events')}
                    className="active:text-white"
                  >
                    Events
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push('/donations')}
                    className="active:text-white"
                  >
                    Donations
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push('/about')}
                    className="active:text-white"
                  >
                    About Us
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>info@yssvt.org</li>
                <li>+1 (555) 123-4567</li>
                <li>123 Community St</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-4 text-center text-gray-400 text-sm">
            <p>&copy; 2024 YSSVT Community. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 