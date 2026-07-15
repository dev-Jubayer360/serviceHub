'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, Lock, User, Phone } from 'lucide-react';
import api from '@/lib/api';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [accountType, setAccountType] = useState('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        phone,
        password,
        role: accountType
      });

      if (res.data.success) {
        setRegisteredEmail(email);
        setShowVerificationModal(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const res = await api.post('/auth/google', {
        tokenId: credentialResponse.credential,
        role: accountType
      });
      if (res.data.success) {
         login(res.data.data);
         if (res.data.data.role === 'provider') {
            router.push('/provider/dashboard');
         } else if (res.data.data.role === 'admin') {
            router.push('/admin/dashboard');
         } else {
            router.push('/');
         }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Form Side */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 py-12">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <Link href="/" className="inline-flex items-center gap-2 mb-8">
               <div className="w-8 h-8 bg-primary text-white flex items-center justify-center rounded-xl font-bold text-xl">S</div>
               <span className="text-xl font-bold text-primary">ServiceHub</span>
            </Link>
            <h2 className="text-3xl font-bold text-foreground">Create an account</h2>
            <p className="text-muted mt-2">Start your journey with us today.</p>
          </div>

          <div className="mb-6 flex p-1 bg-muted/10 rounded-xl border border-border">
             <button 
               type="button"
               className={`flex-1 text-sm font-medium py-2 rounded-lg transition-colors ${accountType === 'customer' ? 'bg-white shadow-sm text-foreground' : 'text-muted hover:text-foreground'}`}
               onClick={() => setAccountType('customer')}
             >
               Customer
             </button>
             <button 
               type="button"
               className={`flex-1 text-sm font-medium py-2 rounded-lg transition-colors ${accountType === 'provider' ? 'bg-white shadow-sm text-foreground' : 'text-muted hover:text-foreground'}`}
               onClick={() => setAccountType('provider')}
             >
               Service Provider
             </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && <div className="p-3 bg-red-100 text-red-600 rounded-md text-sm">{error}</div>}
            {success && <div className="p-3 bg-green-100 text-green-600 rounded-md text-sm">{success}</div>}

            <Input 
              label="Full Name" 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name" 
              icon={<User className="w-5 h-5" />}
              required
            />

            <Input 
              label="Email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email" 
              icon={<Mail className="w-5 h-5" />}
              required
            />
            
            <Input 
              label="Phone Number" 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number" 
              icon={<Phone className="w-5 h-5" />}
              required
            />

            <Input 
              label="Password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password" 
              icon={<Lock className="w-5 h-5" />}
              required
            />

            <div className="flex items-start gap-2 py-2">
              <input type="checkbox" required className="mt-1 rounded text-primary focus:ring-primary h-4 w-4 border-border" />
              <span className="text-sm text-muted">
                I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
              </span>
            </div>

            <Button type="submit" variant="primary" fullWidth size="lg" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google Registration Failed')}
                theme="outline"
                size="large"
                width="100%"
                text="signup_with"
              />
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-muted">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
      
      {/* Right Image Side */}
      <div className="hidden lg:block relative w-0 flex-1">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop"
          alt="Register background"
        />
        <div className="absolute inset-0 bg-secondary/40 backdrop-blur-sm mix-blend-multiply"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-start p-20 text-white">
           <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20">
             <div className="flex gap-1 mb-4">
               {[1,2,3,4,5].map(i => <div key={i} className="w-2 h-2 rounded-full bg-accent"></div>)}
             </div>
             <p className="text-xl max-w-md font-medium italic mb-6">"Joining ServiceHub as a provider was the best decision for my business. I get regular bookings and prompt payments."</p>
             <div className="font-bold">- Kamrul Islam, Electrician</div>
           </div>
        </div>
      </div>

      {/* Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => router.push('/login')}></div>
          <div className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-center text-foreground mb-4">Check Your Email</h3>
            
            <p className="text-center text-muted mb-2">
              We've sent a verification link to:
            </p>
            <p className="text-center font-bold text-foreground mb-6">
              {registeredEmail}
            </p>
            
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-8">
              <p className="text-sm text-orange-800 text-center">
                <strong className="block mb-1">Didn't receive the email?</strong>
                Please check your <strong>Spam</strong> or <strong>Junk</strong> folder just in case.
              </p>
            </div>
            
            <Button 
              variant="primary" 
              fullWidth 
              size="lg" 
              onClick={() => router.push('/login')}
            >
              Go to Login
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
