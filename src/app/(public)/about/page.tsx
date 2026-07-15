'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Shield, Users, Target, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function AboutPage() {
  const { user } = useAuth();
  const [isRequesting, setIsRequesting] = useState(false);

  const handleProviderRequest = async () => {
    if (user?.role === 'provider' || user?.role === 'admin') {
      toast.error('You are already a provider or admin');
      return;
    }
    
    setIsRequesting(true);
    try {
      const res = await api.post('/user/request-provider');
      if (res.data.success) {
        toast.success('Your request to become a provider has been sent to the admin.');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send request');
    } finally {
      setIsRequesting(false);
    }
  };

  const stats = [
    { label: 'Active Users', value: '10K+' },
    { label: 'Verified Providers', value: '2,500+' },
    { label: 'Services Completed', value: '50K+' },
    { label: 'Cities Covered', value: '64' },
  ];

  const features = [
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      title: 'Verified Professionals',
      description: 'Every provider undergoes a strict background check and skill verification process to ensure quality and safety.'
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-green-500" />,
      title: 'Satisfaction Guaranteed',
      description: 'We prioritize your satisfaction. If you are not happy with a service, we work to make it right.'
    },
    {
      icon: <Target className="w-6 h-6 text-orange-500" />,
      title: 'Instant Booking',
      description: 'Say goodbye to long phone calls and negotiations. Book your required service instantly with transparent pricing.'
    },
    {
      icon: <Users className="w-6 h-6 text-purple-500" />,
      title: 'Community Driven',
      description: 'Read real reviews from neighbors and community members to make informed hiring decisions.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -skew-y-3 origin-top-left z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Revolutionizing How You Find <span className="text-primary">Local Services</span>
            </h1>
            <p className="text-lg md:text-xl text-muted leading-relaxed mb-10">
              ServiceHub is the leading platform connecting customers with trusted, verified local professionals for all their home, business, and personal service needs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/services">
                <Button size="lg" className="rounded-full px-8">Find a Service</Button>
              </Link>
              {!user ? (
                <Link href="/register">
                  <Button variant="outline" size="lg" className="rounded-full px-8">Join as Provider</Button>
                </Link>
              ) : (
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="rounded-full px-8"
                  onClick={handleProviderRequest}
                  disabled={isRequesting || user.role === 'provider' || user.role === 'admin'}
                >
                  {isRequesting ? 'Requesting...' : 'Request to become a provider'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 -mt-16 relative z-20">
        <div className="container mx-auto px-4">
          <Card className="p-8 rounded-3xl shadow-xl border-none bg-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border/50">
              {stats.map((stat, idx) => (
                <div key={idx} className={`text-center ${idx % 2 === 0 ? '' : 'border-none md:border-solid'}`}>
                  <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">{stat.value}</div>
                  <div className="text-sm font-medium text-muted uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-[3rem] -rotate-3 scale-105"></div>
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
                alt="Our Team" 
                className="relative rounded-[3rem] shadow-2xl object-cover h-[500px] w-full"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
                Our Mission
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Empowering communities through reliable connections
              </h2>
              <p className="text-lg text-muted mb-6 leading-relaxed">
                We believe that finding a reliable plumber, a skilled electrician, or an expert photographer shouldn't be a gamble. Our mission is to build a transparent, trustworthy ecosystem where quality professionals can grow their businesses while customers receive exceptional service.
              </p>
              <p className="text-lg text-muted mb-8 leading-relaxed">
                By leveraging technology, we are breaking down barriers, ensuring fair pricing, and elevating the standard of local services across the country.
              </p>
              <Button variant="ghost" className="hover:bg-primary/5 hover:text-primary">
                Read our story <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values / Features */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose ServiceHub?</h2>
            <p className="text-lg text-muted">We stand by our commitment to deliver an exceptional experience for both our customers and our service providers.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <Card key={idx} className="p-8 rounded-3xl border-none shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white group">
                <div className="w-14 h-14 bg-muted/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
