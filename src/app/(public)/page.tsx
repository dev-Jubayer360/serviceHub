'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Grid, CheckCircle2, Shield, Calendar, CreditCard, ArrowRight, Wrench, Droplet, Zap, Home, Camera, BookOpen, Monitor, Scissors, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { ServiceCard } from '@/components/shared/ServiceCard';
import { ProviderCard } from '@/components/shared/ProviderCard';
import { ReviewCard } from '@/components/shared/ReviewCard';
import { StatCard } from '@/components/shared/StatCard';
import { Badge } from '@/components/ui/Badge';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { districts } from '@/lib/districts';

// Mock Data
const MOCK_CATEGORIES = [
  { name: 'Home Cleaning', icon: Home, count: '120+', iconClass: 'text-blue-500', bgClass: 'bg-blue-50 group-hover:bg-blue-500' },
  { name: 'Electrical', icon: Zap, count: '150+', iconClass: 'text-orange-500', bgClass: 'bg-orange-50 group-hover:bg-orange-500' },
  { name: 'Plumbing', icon: Droplet, count: '90+', iconClass: 'text-green-500', bgClass: 'bg-green-50 group-hover:bg-green-500' },
  { name: 'AC Repair', icon: Wrench, count: '110+', iconClass: 'text-cyan-500', bgClass: 'bg-cyan-50 group-hover:bg-cyan-500' },
  { name: 'Photography', icon: Camera, count: '80+', iconClass: 'text-purple-500', bgClass: 'bg-purple-50 group-hover:bg-purple-500' },
  { name: 'Tutoring', icon: BookOpen, count: '70+', iconClass: 'text-red-500', bgClass: 'bg-red-50 group-hover:bg-red-500' },
  { name: 'Web Dev', icon: Monitor, count: '60+', iconClass: 'text-pink-500', bgClass: 'bg-pink-50 group-hover:bg-pink-500' },
  { name: 'Beauty', icon: Scissors, count: '50+', iconClass: 'text-teal-500', bgClass: 'bg-teal-50 group-hover:bg-teal-500' },
];



const MOCK_REVIEWS = [
  {
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop',
    name: 'Farhana Akhter',
    serviceUsed: 'AC Repair Service',
    rating: 5,
    reviewText: 'Excellent service! The technician was very professional and fixed my AC quickly. Highly recommend.',
    date: '2 days ago'
  },
  {
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop',
    name: 'Rashed Karim',
    serviceUsed: 'Apartment Deep Cleaning',
    rating: 5,
    reviewText: 'Very satisfied with their cleaning service. My apartment looks brand new. Will definitely book again.',
    date: '1 week ago'
  },
  {
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop',
    name: 'Tania Islam',
    serviceUsed: 'Event Photography',
    rating: 4,
    reviewText: 'Amazing photography! They captured our event beautifully. The team was very cooperative.',
    date: '2 weeks ago'
  }
];

export default function LandingPage() {
  const router = useRouter();
  const [featuredServices, setFeaturedServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [topProviders, setTopProviders] = useState<any[]>([]);
  const [stats, setStats] = useState({
    verifiedProviders: 0,
    availableServices: 0,
    completedBookings: 0,
    averageRating: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, categoriesRes, providersRes, statsRes] = await Promise.all([
          api.get('/services'),
          api.get('/categories'),
          api.get('/user/providers'),
          api.get('/services/stats/public')
        ]);
        
        if (servicesRes.data.success) {
          const allServices = servicesRes.data.data.services || servicesRes.data.data;
          setFeaturedServices(allServices.slice(0, 4));
        }

        if (categoriesRes.data.success) {
          setCategories(categoriesRes.data.data);
        }

        if (providersRes.data.success) {
          setTopProviders(providersRes.data.data.slice(0, 4));
        }

        if (statsRes.data.success) {
          setStats(statsRes.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };
    fetchData();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (location) params.append('location', location);
    router.push(`/services?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative bg-background pt-20 pb-24 overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-3xl"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Find Trusted Local <span className="text-primary">Professionals</span>
              </h1>
              <p className="text-lg text-muted mb-10 leading-relaxed">
                Book reliable home, business and personal services from verified professionals near you.
              </p>
              
              {/* Search Box */}
              <div className="bg-white p-3 rounded-2xl shadow-card flex flex-col sm:flex-row items-center gap-3 mb-8">
                <div className="flex-1 flex items-center gap-2 px-3 py-2 w-full">
                  <Search className="w-5 h-5 text-muted shrink-0" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="What service do you need?" 
                    className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted"
                  />
                </div>
                <div className="hidden sm:block w-px h-8 bg-border"></div>
                <div className="flex-1 flex items-center gap-2 px-3 py-2 w-full">
                  <MapPin className="w-5 h-5 text-muted shrink-0" />
                  <select 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-foreground appearance-none cursor-pointer"
                  >
                    <option value="">Select Location</option>
                    {districts.map((district) => (
                      <option key={district} value={district.toLowerCase()}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
                <Button onClick={handleSearch} size="lg" className="w-full sm:w-auto shrink-0 rounded-xl">
                  Find Services
                </Button>
              </div>
              
              {/* Popular Tags */}
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-muted font-medium mr-2">Popular:</span>
                {['AC Repair', 'Home Cleaning', 'Electrician', 'Plumbing', 'Photography'].map(tag => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-secondary/20 transition-colors">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Right Image */}
            <div className="relative hidden lg:block">
              <div className="relative w-full h-[600px]">
                <img 
                  src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=1965&auto=format&fit=crop" 
                  alt="Professional Worker" 
                  className="w-full h-full object-cover rounded-[2rem] shadow-2xl"
                />
                
                {/* Floating Cards */}
                <Card className="absolute top-10 -left-10 p-4 rounded-2xl shadow-xl border-white/50 bg-white/90 backdrop-blur-md animate-bounce-slow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 fill-accent text-accent" />
                    </div>
                    <div>
                      <div className="font-bold text-foreground">4.8 Rating</div>
                      <div className="text-xs text-muted">Average Rating</div>
                    </div>
                  </div>
                </Card>
                
                <Card className="absolute bottom-20 -right-10 p-4 rounded-2xl shadow-xl border-white/50 bg-white/90 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" className="w-8 h-8 rounded-full border-2 border-white" alt="User"/>
                      <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop" className="w-8 h-8 rounded-full border-2 border-white" alt="User"/>
                      <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop" className="w-8 h-8 rounded-full border-2 border-white" alt="User"/>
                    </div>
                    <div>
                      <div className="font-bold text-foreground">12K+</div>
                      <div className="text-xs text-muted">Completed Services</div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR CATEGORIES */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-3">Popular Categories</h2>
              <p className="text-muted">Explore our most requested service categories</p>
            </div>
            <Link href="/services" className="hidden sm:flex items-center gap-1 text-primary font-medium hover:underline">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 items-stretch">
            {categories.length > 0 ? categories.slice(0, 8).map((category) => (
              <Link href={`/services?category=${category.slug}`} key={category._id} className="block h-full">
                <Card className="text-center hover:border-primary hover:shadow-md transition-all duration-300 group cursor-pointer h-full flex flex-col justify-center">
                  <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center mt-0 pt-4 sm:pt-6">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white overflow-hidden shrink-0">
                      {category.image ? (
                        <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                      ) : (
                        <Grid className="w-6 h-6" />
                      )}
                    </div>
                    <h3 className="font-semibold text-sm text-foreground mb-1 group-hover:text-primary transition-colors">{category.name}</h3>
                    {category.numOfServices !== undefined && <p className="text-xs text-muted">{category.numOfServices} Services</p>}
                  </CardContent>
                </Card>
              </Link>
            )) : MOCK_CATEGORIES.map((category) => (
              <Link href={`/services?category=${category.name.toLowerCase()}`} key={category.name} className="block h-full">
                <Card className="text-center hover:border-primary hover:shadow-md transition-all duration-300 group cursor-pointer h-full flex flex-col justify-center">
                  <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center mt-0 pt-4 sm:pt-6">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors ${category.bgClass} ${category.iconClass} group-hover:text-white shrink-0`}>
                      <category.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-sm text-foreground mb-1 group-hover:text-primary transition-colors">{category.name}</h3>
                    <p className="text-xs text-muted">{category.count} Services</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED SERVICES */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-3">Featured Services</h2>
              <p className="text-muted">Top rated services by our customers</p>
            </div>
            <Link href="/services" className="hidden sm:flex items-center gap-1 text-primary font-medium hover:underline">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredServices.length > 0 ? featuredServices.map((service) => (
              <ServiceCard 
                key={service._id} 
                id={service._id} 
                title={service.title}
                category={service.category?.name || 'General'}
                price={service.price}
                rating={service.rating || 0}
                location={service.location || 'Dhaka, Bangladesh'}
                isVerified={true}
                providerName={service.provider?.name || 'Trusted Provider'} 
                image={service.image || service.images?.[0] || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070'} 
              />
            )) : (
              <div className="col-span-4 text-center py-10 text-muted">Loading featured services...</div>
            )}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-muted">Get your job done in four simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-border -z-10"></div>
            
            {[
              { icon: Search, title: 'Search Service', desc: 'Find the service you need' },
              { icon: Grid, title: 'Compare Professionals', desc: 'Check reviews & ratings' },
              { icon: Calendar, title: 'Book Service', desc: 'Schedule a convenient time' },
              { icon: CheckCircle2, title: 'Complete & Review', desc: 'Pay securely & leave feedback' }
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-background border-4 border-white shadow-lg flex items-center justify-center mb-6 relative z-10">
                  <step.icon className="w-8 h-8 text-primary" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm border-4 border-white">
                    {idx + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATISTICS */}
      <section className="py-10 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-sm border border-border p-8 flex flex-col md:flex-row justify-around items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stats.verifiedProviders}+</div>
                <div className="text-sm font-medium text-muted">Verified Providers</div>
              </div>
            </div>
            <div className="hidden md:block w-px h-12 bg-border"></div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stats.availableServices}+</div>
                <div className="text-sm font-medium text-muted">Available Services</div>
              </div>
            </div>
            <div className="hidden md:block w-px h-12 bg-border"></div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stats.completedBookings}+</div>
                <div className="text-sm font-medium text-muted">Completed Bookings</div>
              </div>
            </div>
            <div className="hidden md:block w-px h-12 bg-border"></div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stats.averageRating}</div>
                <div className="text-sm font-medium text-muted">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOP PROVIDERS */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-3">Top Providers</h2>
              <p className="text-muted">Meet our highest rated professionals</p>
            </div>
            <Link href="/providers" className="hidden sm:flex items-center gap-1 text-primary font-medium hover:underline">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topProviders.length > 0 ? (
              topProviders.map((provider) => (
                <ProviderCard 
                  key={provider._id} 
                  id={provider._id}
                  name={provider.name}
                  image={provider.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop'}
                  specialization="Professional Provider"
                  experience="Verified Expert"
                  rating={provider.rating || 0}
                  completedJobs={provider.completedJobs || 0}
                />
              ))
            ) : (
              <div className="col-span-4 text-center py-10 text-muted">Loading providers...</div>
            )}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">What Our Customers Say</h2>
            <p className="text-muted">Read reviews from people who have used our services</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_REVIEWS.map((review, idx) => (
              <ReviewCard key={idx} {...review} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-primary rounded-[2.5rem] p-8 md:p-16 text-center text-white overflow-hidden relative shadow-2xl">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Are you a skilled professional?</h2>
              <p className="text-lg md:text-xl text-primary-foreground/90 mb-10 leading-relaxed">
                Join ServiceHub and grow your business. Connect with thousands of customers looking for your services.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" className="bg-white hover:bg-white/90" style={{ color: '#2563EB' }}>
                  Register as Provider
                </Button>
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
