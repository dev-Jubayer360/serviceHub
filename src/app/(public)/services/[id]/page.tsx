'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Star, MapPin, CheckCircle, Heart, Share2, ChevronRight, MessageCircle, Map, CreditCard, User, Check, Copy, X } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function ServiceDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const { user } = useAuth();
  const router = useRouter();

  const [service, setService] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [similarServices, setSimilarServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('description');

  // Booking State
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  // bKash Payment State
  const [showBkashModal, setShowBkashModal] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const providerBkashNumber = "01712345678"; // Mock provider bKash number

  // Favorite and Share
  const [isFavourite, setIsFavourite] = useState(false);
  const [isUpdatingFavourite, setIsUpdatingFavourite] = useState(false);

  useEffect(() => {
    if (user && user.address) {
      setAddressLine1(user.address.street || '');
      setCity(user.address.city || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      if (!id) return;
      try {
        const [serviceRes, reviewsRes, similarRes] = await Promise.all([
          api.get(`/services/${id}`),
          api.get(`/services/${id}/reviews`),
          api.get(`/services`)
        ]);

        if (serviceRes.data.success) {
          setService(serviceRes.data.data);
          
          if (similarRes.data.success) {
            const allServices = similarRes.data.data.services || similarRes.data.data;
            setSimilarServices(allServices.filter((s: any) => s._id !== id).slice(0, 2));
          }
        }
        if (reviewsRes.data.success) setReviews(reviewsRes.data.data);

        // Check favorite status if user is logged in and is a customer
        if (user && user.role === 'customer') {
          try {
            const favRes = await api.get(`/favourites/check/${id}`);
            if (favRes.data.success) {
              setIsFavourite(favRes.data.isFavourite);
            }
          } catch (e) {
            // ignore if error (e.g. not authorized)
          }
        }
      } catch (error) {
        console.error('Failed to fetch service details', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServiceDetails();
  }, [id, user]);

  const handleBookService = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to book a service');
      router.push('/login');
      return;
    }
    
    if (user.role === 'provider' || user.role === 'admin') {
      toast.error('Only customers can book services');
      return;
    }

    if (!bookingDate) { toast.error('Please select a booking date'); return; }
    if (!bookingTime) { toast.error('Please select a time slot'); return; }
    if (!addressLine1.trim()) { toast.error('Please provide a street address'); return; }
    if (!city.trim()) { toast.error('Please provide a city'); return; }
    if (!phone.trim()) { toast.error('Please provide a phone number'); return; }

    // Open bKash Modal instead of directly calling API
    setShowBkashModal(true);
  };

  const submitBkashPayment = async () => {
    if (!transactionId.trim()) {
      toast.error('Please enter the bKash Transaction ID');
      return;
    }

    setIsBooking(true);
    try {
      const res = await api.post('/bookings', {
        serviceId: id,
        date: bookingDate,
        timeSlot: bookingTime,
        address: { addressLine1, city, phone },
        transactionId
      });

      if (res.data.success) {
        toast.success('Service booked successfully!');
        setShowBkashModal(false);
        router.push('/dashboard/bookings');
      }
    } catch (error: any) {
      console.error('Error booking service', error);
      toast.error(error.response?.data?.message || 'Failed to book service');
    } finally {
      setIsBooking(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Number copied to clipboard!');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Service link copied to clipboard!');
  };

  const toggleFavourite = async () => {
    if (!user) {
      toast.error('Please log in to add to favourites');
      router.push('/login');
      return;
    }
    if (user.role !== 'customer') {
      toast.error('Only customers can favourite services');
      return;
    }

    setIsUpdatingFavourite(true);
    try {
      if (isFavourite) {
        await api.delete(`/favourites/${id}`);
        setIsFavourite(false);
        toast.success('Removed from favourites');
      } else {
        await api.post('/favourites', { serviceId: id });
        setIsFavourite(true);
        toast.success('Added to favourites');
      }
    } catch (error: any) {
      console.error('Error toggling favourite', error);
      toast.error(error.response?.data?.message || 'Failed to update favourites');
    } finally {
      setIsUpdatingFavourite(false);
    }
  };

  if (isLoading) return <div className="p-20 text-center text-muted">Loading service details...</div>;
  if (!service) return <div className="p-20 text-center text-muted">Service not found.</div>;

  const mainImage = service.image || service.images?.[0] || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2000&auto=format&fit=crop';
  
  const rating = service.rating || 0;
  const numReviews = service.numOfReviews || 0;
  const providerName = service.provider?.name || 'Trusted Provider';

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-16 pt-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/services" className="hover:text-primary transition-colors">Explore Services</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="hover:text-primary transition-colors cursor-pointer">{service.category?.name || 'Category'}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium truncate">{service.title}</span>
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{service.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <Badge variant="outline" className="rounded-full bg-blue-50 text-blue-600 font-medium border-none px-3 py-1">
                {service.category?.name || 'General'}
              </Badge>
              
              <div className="text-border">|</div>
              
              <div className="flex items-center gap-2 font-medium text-foreground">
                <User className="w-4 h-4 text-muted-foreground" />
                {providerName}
                <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-50" />
              </div>
              
              <div className="text-border">|</div>

              <div className="flex items-center gap-1 font-medium">
                <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                <span className="text-foreground">{rating.toFixed(1)}</span>
                <span className="text-muted-foreground">({numReviews})</span>
              </div>
              
              <div className="text-border">|</div>

              <div className="flex items-center gap-1 text-muted-foreground font-medium">
                <MapPin className="w-4 h-4" />
                {service.location || 'Dhaka, Bangladesh'}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleFavourite}
              disabled={isUpdatingFavourite}
              className={`rounded-xl shadow-sm border-border h-10 w-10 transition-colors ${isFavourite ? 'bg-red-50 text-red-500 border-red-200 hover:bg-red-100 hover:text-red-600' : 'bg-white hover:text-red-500'}`}
            >
              <Heart className={`w-4 h-4 ${isFavourite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleShare}
              className="rounded-xl bg-white shadow-sm hover:text-primary border-border h-10 w-10"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT COLUMN */}
          <div className="w-full lg:w-[65%] space-y-8">
            
            {/* Hero Image */}
            <div className="relative rounded-3xl overflow-hidden aspect-[16/9] bg-muted">
              <img src={mainImage} alt={service.title} className="w-full h-full object-cover" />
            </div>

            {/* Tabs */}
            <div className="flex gap-8 border-b border-border text-base font-medium">
              <div 
                className={`pb-4 cursor-pointer relative ${activeTab === 'description' ? 'text-blue-600 font-bold' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setActiveTab('description')}
              >
                Description
                {activeTab === 'description' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>}
              </div>
              <div 
                className={`pb-4 cursor-pointer relative ${activeTab === 'reviews' ? 'text-blue-600 font-bold' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews ({numReviews})
                {activeTab === 'reviews' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>}
              </div>
              <div className="pb-4 cursor-pointer text-muted-foreground hover:text-foreground">FAQ</div>
            </div>

            {/* Description Tab */}
            {activeTab === 'description' && (
              <div className="animate-in fade-in duration-300 space-y-6">
                <h3 className="text-xl font-bold text-foreground">About this service</h3>
                <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-[15px]">
                  {service.description || "No description provided."}
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="animate-in fade-in duration-300">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-foreground">Reviews ({numReviews})</h3>
                  <span className="text-sm font-semibold text-blue-600 cursor-pointer">View all</span>
                </div>
                
                <div className="space-y-4">
                  {reviews.length > 0 ? reviews.map((review) => (
                    <div key={review._id} className="p-5 rounded-2xl border border-border bg-white shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-muted text-muted-foreground flex items-center justify-center font-bold rounded-full text-lg">
                          {review.userId?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-foreground">{review.userId?.name}</span> 
                            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium flex items-center"><Check className="w-3 h-3 mr-1" /> Verified Buyer</span>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'fill-orange-400 text-orange-400' : 'fill-muted text-muted'}`} />
                              ))}
                            </div>
                            <span className="text-xs font-bold text-foreground">{review.rating.toFixed(1)}</span>
                            <span className="text-xs text-muted-foreground">• 2 days ago</span>
                          </div>
                          <p className="text-[15px] text-foreground">
                            {review.comment}
                          </p>
                          
                          {review.reply && (
                            <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/10 relative ml-2">
                              <div className="absolute -left-2 top-4 w-4 h-[1px] bg-primary/20"></div>
                              <div className="absolute -left-2 top-4 w-[1px] h-full bg-primary/20 -mt-px -z-10"></div>
                              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Provider's Reply</p>
                              <p className="text-sm text-foreground">{review.reply}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-white rounded-2xl border border-border">
                      <MessageCircle className="w-12 h-12 mb-3 opacity-20" />
                      <p>No reviews yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN (SIDEBAR) */}
          <div className="w-full lg:w-[35%] space-y-6">
            
            {/* Pricing Card */}
            <Card className="rounded-3xl shadow-sm border-border bg-white">
              <div className="p-7">
                <div className="mb-6">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Starting From</div>
                  <div className="text-[2.5rem] font-bold text-foreground leading-none">৳{service.price?.toLocaleString()}</div>
                </div>
                
                {!showBookingForm ? (
                  <div className="space-y-3 mb-8">
                    <Button onClick={() => setShowBookingForm(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 shadow-sm font-semibold text-[15px]">
                      Book This Service
                    </Button>
                  </div>
                ) : (
                  <div className="mb-8 pt-4 border-t border-border animate-in fade-in zoom-in-95 duration-200">
                    <h4 className="font-bold text-sm mb-4">Complete Your Booking</h4>
                    <div className="space-y-3">
                      <Input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="h-11 rounded-xl" />
                      <select value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} className="w-full h-11 rounded-xl border border-border bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                        <option value="">Choose a time slot</option>
                        <option value="Morning">Morning (8AM - 12PM)</option>
                        <option value="Afternoon">Afternoon (12PM - 4PM)</option>
                        <option value="Evening">Evening (4PM - 8PM)</option>
                      </select>
                      <Input placeholder="Street Address" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} className="h-11 rounded-xl" />
                      <div className="flex gap-2">
                        <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="h-11 rounded-xl" />
                        <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11 rounded-xl" />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button type="button" variant="outline" className="w-1/3 rounded-xl font-semibold" onClick={() => setShowBookingForm(false)}>Cancel</Button>
                        <Button type="button" onClick={() => handleBookService()} className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold" disabled={isBooking}>
                          {isBooking ? 'Processing...' : 'Confirm Book'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Real Data Stats */}
                <div className="space-y-4 text-sm font-medium pt-6 border-t border-border">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 text-muted-foreground"><CreditCard className="w-5 h-5" /> Pricing Type</div>
                    <div className="text-foreground text-right capitalize">{service.pricingType || 'Fixed'}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 text-muted-foreground"><Map className="w-5 h-5" /> Location Area</div>
                    <div className="text-foreground text-right max-w-[150px] truncate">{service.location || 'Anywhere'}</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* About Provider Card */}
            <Card className="rounded-3xl shadow-sm border-border bg-white">
              <div className="p-7">
                <h3 className="font-bold text-[17px] text-foreground mb-5">About the Provider</h3>
                
                <div className="flex flex-col items-center justify-center mb-6">
                  <img src={service.provider?.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100'} className="w-[80px] h-[80px] rounded-full object-cover mb-4" alt="Provider" />
                  <div className="font-bold text-foreground text-[17px] flex items-center gap-1 mb-1">
                    {providerName} <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-50" />
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">Web Developer</div>
                  <div className="flex items-center gap-1 text-[13px] font-bold">
                    <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                    <span>{rating.toFixed(1)}</span> <span className="text-muted-foreground font-medium">({numReviews} Reviews)</span>
                  </div>
                </div>

                <div className="space-y-4 text-[13px] mb-6 px-2">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin className="w-4 h-4" /> Dhaka, Bangladesh
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <User className="w-4 h-4" /> Member since Jan 2020
                  </div>
                </div>

                <Link href={`/provider/${service.provider?._id}`}>
                  <Button variant="outline" className="w-full rounded-xl h-12 border-border text-foreground font-semibold text-[14px]">
                    View Full Profile
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Related Services */}
            {similarServices.length > 0 && (
              <div className="pt-2">
                <div className="flex justify-between items-center mb-4 px-1">
                  <h3 className="font-bold text-[17px] text-foreground">Related Services</h3>
                  <span className="text-sm text-blue-600 font-semibold cursor-pointer">View all</span>
                </div>
                
                <div className="space-y-4">
                  {similarServices.map((sim, idx) => (
                    <Card key={sim._id} className="rounded-2xl border-none shadow-sm overflow-hidden bg-white group cursor-pointer">
                      <Link href={`/services/${sim._id}`} className="flex p-3 gap-4 items-center">
                        <img src={sim.image || sim.images?.[0] || 'https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=200'} className="w-[84px] h-[64px] rounded-lg object-cover shrink-0" alt="Related" />
                        <div className="flex-1 py-1 min-w-0">
                          <h4 className="text-[14px] font-bold text-foreground truncate mb-1">{sim.title}</h4>
                          <div className="flex justify-between items-center text-[13px] text-muted-foreground font-medium">
                            <span>From <span className="font-bold text-foreground">৳{sim.price?.toLocaleString()}</span></span>
                            <span className="flex items-center gap-1 font-bold text-foreground"><Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400" /> {sim.rating || 4.8}</span>
                          </div>
                        </div>
                      </Link>
                    </Card>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* bKash Payment Modal */}
      {showBkashModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-pink-600 px-6 py-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg flex items-center gap-2">
                Pay with bKash
              </h3>
              <button onClick={() => setShowBkashModal(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Please Send Money to the provider's Personal bKash number below.</p>
                <div className="text-2xl font-bold text-foreground">৳{service.price?.toLocaleString()}</div>
              </div>

              <div className="bg-muted/30 border border-border rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">bKash Personal Number</div>
                  <div className="font-bold text-[17px] tracking-wider">{providerBkashNumber}</div>
                </div>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(providerBkashNumber)} className="h-9 px-3 shrink-0 rounded-lg gap-1.5">
                  <Copy className="w-4 h-4" /> Copy
                </Button>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">Enter Transaction ID (TrxID)</label>
                <Input 
                  placeholder="e.g. 8N7A6D5E9W" 
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="h-12 rounded-xl text-center uppercase font-mono tracking-widest text-lg"
                />
              </div>

              <Button 
                onClick={submitBkashPayment} 
                className="w-full bg-pink-600 hover:bg-pink-700 text-white rounded-xl h-12 shadow-sm font-bold text-[15px]" 
                disabled={isBooking}
              >
                {isBooking ? 'Processing...' : 'Confirm Payment & Book'}
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
