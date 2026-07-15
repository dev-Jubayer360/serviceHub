'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User, Mail, Phone, Lock, Camera, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export default function ProfilePage() {
  const { user, login, isLoading } = useAuth();
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState('');
  
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password Form State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Image Upload State
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push('/login');
    } else {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setImage(user.image || '');
    }
  }, [user, isLoading, router]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setIsProfileLoading(true);

    try {
      const res = await api.patch('/user/profile', { name, email, phone, image });
      if (res.data.success) {
        setProfileSuccess('Profile updated successfully!');
        // Update context to reflect changes everywhere
        if (user) {
           login({ ...user, name, email, phone, image });
        }
      }
    } catch (err: any) {
      setProfileError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setIsPasswordLoading(true);

    try {
      const res = await api.patch('/user/change-password', { oldPassword, newPassword });
      if (res.data.success) {
        setPasswordSuccess('Password changed successfully!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (e.g., 5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setProfileError('Image size should be less than 5MB');
      return;
    }

    setIsUploadingImage(true);
    setProfileError('');
    setProfileSuccess('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      // Use the generic upload endpoint
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.data.success && res.data.data?.url) {
        const imageUrl = res.data.data.url;
        setImage(imageUrl);
        // Automatically save it to profile
        const updateRes = await api.patch('/user/profile', { image: imageUrl });
        if (updateRes.data.success && user) {
           login({ ...user, image: imageUrl });
           setProfileSuccess('Profile picture updated successfully!');
        }
      }
    } catch (err: any) {
      setProfileError('Failed to upload image. Please try again.');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-muted font-medium">Loading profile...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-3xl font-bold text-foreground mb-8">Account Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column - Profile Picture & Overview */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="relative mb-4 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-primary/10 flex items-center justify-center">
                  {isUploadingImage ? (
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  ) : image ? (
                    <img src={image.startsWith('http') ? image : `http://localhost:5000${image}`} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-bold text-primary">{name?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-8 h-8 text-white mb-1" />
                  <span className="text-xs text-white font-medium">Change</span>
                </div>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/jpeg,image/png,image/webp" 
                  onChange={handleImageUpload} 
                />
              </div>
              
              <h2 className="text-xl font-bold text-foreground">{name}</h2>
              <p className="text-muted text-sm mb-4">{email}</p>
              
              <div className="w-full pt-4 border-t border-border flex justify-between text-sm">
                 <span className="text-muted font-medium">Account Role</span>
                 <span className="font-bold text-foreground capitalize">{user.role}</span>
              </div>
              <div className="w-full pt-3 flex justify-between text-sm">
                 <span className="text-muted font-medium">Joined</span>
                 <span className="font-bold text-foreground">Recently</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Forms */}
        <div className="md:col-span-2 space-y-6">
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">General Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-5">
                {profileSuccess && <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm font-medium">{profileSuccess}</div>}
                {profileError && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm font-medium">{profileError}</div>}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input 
                    label="Full Name" 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    icon={<User className="w-5 h-5" />}
                    required
                  />
                  <Input 
                    label="Phone Number" 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    icon={<Phone className="w-5 h-5" />}
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div className="space-y-1">
                  <Input 
                    label="Email Address" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<Mail className="w-5 h-5" />}
                    disabled={true}
                    required
                  />
                  <p className="text-xs text-muted-foreground ml-1">
                    Email address cannot be changed.
                  </p>
                </div>
                
                <div className="flex justify-end pt-2">
                  <Button type="submit" variant="primary" disabled={isProfileLoading}>
                    {isProfileLoading ? 'Saving Changes...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {user.provider === 'credentials' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-red-600">Security Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-5">
                  {passwordSuccess && <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm font-medium">{passwordSuccess}</div>}
                  {passwordError && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm font-medium">{passwordError}</div>}
                  
                  <Input 
                    label="Current Password" 
                    type="password" 
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    icon={<Lock className="w-5 h-5" />}
                    placeholder="Enter current password"
                    required
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input 
                      label="New Password" 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      icon={<Lock className="w-5 h-5" />}
                      placeholder="Min. 6 characters"
                      required
                    />
                    <Input 
                      label="Confirm New Password" 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      icon={<Lock className="w-5 h-5" />}
                      placeholder="Must match new password"
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end pt-2">
                    <Button type="submit" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" disabled={isPasswordLoading}>
                      {isPasswordLoading ? 'Updating Password...' : 'Update Password'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

        </div>

      </div>
    </div>
  );
}
