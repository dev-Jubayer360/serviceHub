'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Star, MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ProviderReviewsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'provider') {
      router.push('/login');
      return;
    }

    const fetchReviews = async () => {
      try {
        const res = await api.get('/reviews/provider-reviews');
        if (res.data.success) {
          setReviews(res.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch reviews', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, [user, authLoading, router]);

  const handleReplySubmit = async (reviewId: string) => {
    if (!replyText.trim()) return;
    
    try {
      const res = await api.patch(`/reviews/${reviewId}/reply`, { reply: replyText });
      if (res.data.success) {
        setReviews(reviews.map(r => r._id === reviewId ? res.data.data : r));
        setReplyingTo(null);
        setReplyText('');
        toast.success('Reply added successfully');
      }
    } catch (error: any) {
      console.error('Error replying to review', error);
      toast.error(error.response?.data?.message || 'Failed to submit reply');
    }
  };

  if (authLoading || isLoading) return <div className="p-10 text-center">Loading reviews...</div>;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Customer Reviews</h1>
        <p className="text-muted mt-1">Read and reply to feedback from your customers.</p>
      </div>

      <div className="space-y-6">
        {reviews.map(review => (
          <Card key={review._id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                
                {/* Reviewer Info */}
                <div className="md:w-1/4 flex flex-col items-start gap-2">
                  <div className="flex items-center gap-3">
                    {review.userId?.image ? (
                      <img src={review.userId.image} alt={review.userId.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                        {review.userId?.name?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-foreground">{review.userId?.name || 'Unknown User'}</div>
                      <div className="text-xs text-muted">{new Date(review.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="mt-2 w-full text-xs text-muted truncate border-t border-border/50 pt-2">
                    Service: <span className="font-medium text-foreground">{review.serviceId?.title}</span>
                  </div>
                </div>

                {/* Review Content */}
                <div className="md:w-3/4 flex flex-col">
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-accent text-accent' : 'fill-muted text-muted opacity-30'}`} />
                    ))}
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {review.comment}
                  </p>

                  {/* Provider Reply Display */}
                  {review.adminReply && (
                    <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 mt-2">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-sm text-foreground">Your Reply</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {review.adminReply}
                      </p>
                    </div>
                  )}

                  {/* Reply Input */}
                  {!review.adminReply && replyingTo !== review._id && (
                    <div className="mt-auto pt-4 text-right">
                      <Button variant="ghost" size="sm" onClick={() => setReplyingTo(review._id)}>
                        Reply to Review
                      </Button>
                    </div>
                  )}

                  {replyingTo === review._id && (
                    <div className="mt-4 space-y-3">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full min-h-[100px] p-3 text-sm rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Write your response to the customer..."
                      />
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => { setReplyingTo(null); setReplyText(''); }}>Cancel</Button>
                        <Button variant="primary" size="sm" onClick={() => handleReplySubmit(review._id)}>Submit Reply</Button>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {reviews.length === 0 && (
          <Card>
            <CardContent className="p-10 text-center text-muted">
              You haven't received any reviews yet.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
