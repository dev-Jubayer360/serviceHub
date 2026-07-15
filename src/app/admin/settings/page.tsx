'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Save, Settings as SettingsIcon, Globe, Bell, Shield, Loader2, Link as LinkIcon } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [settings, setSettings] = useState({
    general: {
      platformName: 'ServiceHub',
      contactEmail: 'support@servicehub.com',
      contactPhone: '+880 1234 567890',
      commissionPercentage: 10,
      officeAddress: '123 Innovation Drive, Dhaka, Bangladesh'
    },
    seo: {
      metaTitle: 'ServiceHub - Professional Home Services',
      metaDescription: 'Book trusted professionals for your home service needs.',
      keywords: 'services, home, repair, cleaning'
    },
    socialLinks: {
      facebook: '#',
      linkedin: '#',
      github: '#'
    }
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.data.success && res.data.data) {
          setSettings({
            general: {
              ...settings.general,
              ...res.data.data.general
            },
            seo: {
              ...settings.seo,
              ...res.data.data.seo
            },
            socialLinks: {
              ...settings.socialLinks,
              ...res.data.data.socialLinks
            }
          });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (section: 'general' | 'seo' | 'socialLinks', field: string, value: string | number) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await api.patch('/settings', {
        general: settings.general,
        seo: settings.seo,
        socialLinks: settings.socialLinks
      });
      if (res.data.success) {
        toast.success('Settings saved successfully!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Platform Settings</h1>
          <p className="text-muted mt-1">Configure global platform settings and preferences.</p>
        </div>
        <Button variant="primary" className="flex items-center gap-2" onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Settings Sidebar */}
        <Card className="w-full md:w-64 shrink-0 h-fit">
           <CardContent className="p-2">
              <nav className="space-y-1">
                 <button 
                   onClick={() => setActiveTab('general')}
                   className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'general' ? 'bg-primary/10 text-primary' : 'text-muted hover:bg-muted/10'}`}
                 >
                   <SettingsIcon className="w-5 h-5" /> General
                 </button>
                 <button 
                   onClick={() => setActiveTab('seo')}
                   className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'seo' ? 'bg-primary/10 text-primary' : 'text-muted hover:bg-muted/10'}`}
                 >
                   <Globe className="w-5 h-5" /> SEO & Meta
                 </button>
                 <button 
                   onClick={() => setActiveTab('social')}
                   className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'social' ? 'bg-primary/10 text-primary' : 'text-muted hover:bg-muted/10'}`}
                 >
                   <LinkIcon className="w-5 h-5" /> Social Links
                 </button>
                 <button 
                   onClick={() => setActiveTab('notifications')}
                   className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'notifications' ? 'bg-primary/10 text-primary' : 'text-muted hover:bg-muted/10'}`}
                 >
                   <Bell className="w-5 h-5" /> Notifications
                 </button>
                 <button 
                   onClick={() => setActiveTab('security')}
                   className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'security' ? 'bg-primary/10 text-primary' : 'text-muted hover:bg-muted/10'}`}
                 >
                   <Shield className="w-5 h-5" /> Security
                 </button>
              </nav>
           </CardContent>
        </Card>

        {/* Settings Content */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>
              {activeTab === 'general' && 'General Settings'}
              {activeTab === 'seo' && 'SEO Configuration'}
              {activeTab === 'social' && 'Social Links'}
              {activeTab === 'notifications' && 'Notification Preferences'}
              {activeTab === 'security' && 'Security Settings'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {activeTab === 'general' && (
               <>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <Input 
                    label="Platform Name" 
                    value={settings.general.platformName} 
                    onChange={(e) => handleChange('general', 'platformName', e.target.value)}
                   />
                   <Input 
                    label="Contact Email" 
                    value={settings.general.contactEmail} 
                    onChange={(e) => handleChange('general', 'contactEmail', e.target.value)}
                   />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <Input 
                    label="Contact Phone" 
                    value={settings.general.contactPhone} 
                    onChange={(e) => handleChange('general', 'contactPhone', e.target.value)}
                   />
                   <Input 
                    label="Platform Commission (%)" 
                    type="number" 
                    value={settings.general.commissionPercentage} 
                    onChange={(e) => handleChange('general', 'commissionPercentage', Number(e.target.value))}
                   />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Office Address</label>
                    <textarea 
                      className="w-full p-3 rounded-xl border border-border bg-background outline-none resize-none h-24"
                      value={settings.general.officeAddress}
                      onChange={(e) => handleChange('general', 'officeAddress', e.target.value)}
                    />
                 </div>
               </>
            )}

            {activeTab === 'seo' && (
               <>
                 <Input 
                  label="Meta Title" 
                  value={settings.seo.metaTitle} 
                  onChange={(e) => handleChange('seo', 'metaTitle', e.target.value)}
                 />
                 <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Meta Description</label>
                    <textarea 
                      className="w-full p-3 rounded-xl border border-border bg-background outline-none resize-none h-24"
                      value={settings.seo.metaDescription}
                      onChange={(e) => handleChange('seo', 'metaDescription', e.target.value)}
                    />
                 </div>
                 <Input 
                  label="Keywords" 
                  value={settings.seo.keywords} 
                  onChange={(e) => handleChange('seo', 'keywords', e.target.value)}
                 />
               </>
            )}

            {activeTab === 'social' && (
               <>
                 <Input 
                  label="Facebook URL" 
                  value={settings.socialLinks.facebook} 
                  onChange={(e) => handleChange('socialLinks', 'facebook', e.target.value)}
                 />
                 <Input 
                  label="LinkedIn URL" 
                  value={settings.socialLinks.linkedin} 
                  onChange={(e) => handleChange('socialLinks', 'linkedin', e.target.value)}
                 />
                 <Input 
                  label="GitHub URL" 
                  value={settings.socialLinks.github} 
                  onChange={(e) => handleChange('socialLinks', 'github', e.target.value)}
                 />
               </>
            )}

            {activeTab === 'notifications' && (
               <div className="space-y-4">
                 <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                   <div>
                     <h4 className="font-semibold text-sm">Email Notifications</h4>
                     <p className="text-xs text-muted mt-1">Receive system alerts via email.</p>
                   </div>
                   <div className="w-11 h-6 bg-primary rounded-full relative cursor-pointer">
                     <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                   </div>
                 </div>
                 <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                   <div>
                     <h4 className="font-semibold text-sm">SMS Alerts</h4>
                     <p className="text-xs text-muted mt-1">Send booking confirmations via SMS.</p>
                   </div>
                   <div className="w-11 h-6 bg-muted/50 rounded-full relative cursor-pointer">
                     <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 shadow-sm border border-border"></div>
                   </div>
                 </div>
                 <p className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                   Note: Notification settings are not yet connected to the backend in this demo.
                 </p>
               </div>
            )}

            {activeTab === 'security' && (
               <div className="space-y-4">
                  <Input label="Admin Portal URL Prefix" defaultValue="/admin" disabled />
                  <Input label="Session Timeout (minutes)" type="number" defaultValue="60" disabled />
                  <div className="pt-4 border-t border-border mt-4">
                    <Button variant="outline" className="text-destructive hover:bg-destructive/10 border-destructive/20">
                      Force Logout All Users
                    </Button>
                  </div>
               </div>
            )}

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
