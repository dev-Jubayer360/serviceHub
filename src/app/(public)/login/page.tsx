'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        if (res.data.data.requireOtp) {
          setIsOtpSent(true);
          setSuccess(res.data.message || 'OTP sent to your email.');
        } else {
           // Fallback in case backend is changed back to not require OTP
           login(res.data.data);
           redirectUser(res.data.data.role);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await api.post('/auth/verify-otp', { email, otp });
      if (res.data.success) {
         login(res.data.data);
         redirectUser(res.data.data.role);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'OTP Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const redirectUser = (role: string) => {
    if (role === 'provider') {
       router.push('/provider/dashboard');
    } else if (role === 'admin') {
       router.push('/admin/dashboard');
    } else {
       router.push('/');
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const res = await api.post('/auth/google', {
        tokenId: credentialResponse.credential
      });
      if (res.data.success) {
         login(res.data.data);
         redirectUser(res.data.data.role);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google Login failed');
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Form Side */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-10 text-center lg:text-left">
            <Link href="/" className="inline-flex items-center gap-2 mb-8">
               <div className="w-8 h-8 bg-primary text-white flex items-center justify-center rounded-xl font-bold text-xl">S</div>
               <span className="text-xl font-bold text-primary">ServiceHub</span>
            </Link>
            <h2 className="text-3xl font-bold text-foreground">Welcome back</h2>
            <p className="text-muted mt-2">Please enter your details to sign in.</p>
          </div>

          {!isOtpSent ? (
            <form className="space-y-6" onSubmit={handleLoginSubmit}>
              {error && <div className="p-3 bg-red-100 text-red-600 rounded-md text-sm">{error}</div>}
              
              <Input 
                label="Email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email" 
                icon={<Mail className="w-5 h-5" />}
                required
              />
              
              <div className="space-y-2">
                <Input 
                  label="Password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password" 
                  icon={<Lock className="w-5 h-5" />}
                  required
                />
                <div className="flex justify-end">
                  <a href="#" className="text-sm font-medium text-primary hover:underline">Forgot password?</a>
                </div>
              </div>

              <Button type="submit" variant="primary" fullWidth size="lg" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>

              <div className="pt-4 border-t border-border/50">
                <p className="text-xs text-center text-muted mb-3">Quick Login (No OTP required)</p>
                <div className="grid grid-cols-3 gap-2">
                  <Button type="button" variant="outline" size="sm" className="text-xs px-1" onClick={() => { setEmail('user@demo.com'); setPassword('123456'); }}>
                    User
                  </Button>
                  <Button type="button" variant="outline" size="sm" className="text-xs px-1" onClick={() => { setEmail('provider@demo.com'); setPassword('123456'); }}>
                    Provider
                  </Button>
                  <Button type="button" variant="outline" size="sm" className="text-xs px-1" onClick={() => { setEmail('admin@demo.com'); setPassword('123456'); }}>
                    Admin
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleOtpSubmit}>
              {success && <div className="p-3 bg-green-100 text-green-600 rounded-md text-sm">{success}</div>}
              {error && <div className="p-3 bg-red-100 text-red-600 rounded-md text-sm">{error}</div>}
              
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-2">
                <p className="text-xs text-orange-800 text-center">
                  <strong>Didn't receive the OTP?</strong><br />
                  Please check your <strong>Spam</strong> or <strong>Junk</strong> folder.
                </p>
              </div>
              
              <Input 
                label="Enter OTP" 
                type="text" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6-digit code" 
                icon={<ShieldCheck className="w-5 h-5" />}
                required
              />

              <Button type="submit" variant="primary" fullWidth size="lg" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </Button>
              
              <div className="text-center">
                 <button type="button" onClick={() => setIsOtpSent(false)} className="text-sm text-muted hover:text-primary transition-colors">
                    Back to login
                 </button>
              </div>
            </form>
          )}

          {!isOtpSent && (
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
                  onError={() => setError('Google Login Failed')}
                  theme="outline"
                  size="large"
                />
              </div>
            </div>
          )}

          <p className="mt-10 text-center text-sm text-muted">
            Don't have an account?{' '}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
      
      {/* Right Image Side */}
      <div className="hidden lg:block relative w-0 flex-1">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1556761175-5973dc0f32d7?q=80&w=1932&auto=format&fit=crop"
          alt="Login background"
        />
        <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm mix-blend-multiply"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-start p-20 text-white">
           <h1 className="text-5xl font-bold mb-6 max-w-lg leading-tight">Find the perfect professional for your needs.</h1>
           <p className="text-lg max-w-md text-white/80">Join thousands of users who trust ServiceHub to find reliable local services and grow their businesses.</p>
        </div>
      </div>
    </div>
  );
}
