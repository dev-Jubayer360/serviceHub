'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Loader2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import api from '@/lib/api';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReviews = async () => {
    try {
      const res = await api.get('/reviews/all');
      setReviews(res.data.data);
    } catch (err: any) {
      setError('Failed to fetch reviews');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/reviews/${id}/status`, { status: newStatus });
      fetchReviews();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to completely delete this review?')) {
      try {
        await api.delete(`/reviews/${id}`);
        fetchReviews();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to delete review');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Reviews</h1>
          <p className="text-muted mt-1">Moderate customer reviews to keep the platform professional.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : error ? (
            <div className="text-red-500 text-center p-4">{error}</div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-sm text-left border-collapse min-w-[800px]">
                <thead className="text-xs text-muted uppercase bg-muted/5 border-y border-border">
                  <tr>
                    <th className="px-4 py-3 font-medium">Service & Rating</th>
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Comment</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-8 text-muted">No reviews found.</td></tr>
                  ) : reviews.map(review => (
                    <tr key={review._id} className="border-b border-border hover:bg-muted/5 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-foreground">{review.serviceId?.title || 'Unknown Service'}</div>
                        <div className="flex text-yellow-400 mt-1">
                          {[1,2,3,4,5].map(star => (
                            <span key={star} className={star <= review.rating ? 'opacity-100' : 'opacity-30'}>★</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-foreground font-medium">{review.userId?.name || 'Deleted User'}</div>
                        <div className="text-xs text-muted">{new Date(review.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="px-4 py-3 text-muted max-w-xs break-words">
                        {review.comment}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={review.status === 'Approved' ? 'success' : review.status === 'Pending' ? 'accent' : 'destructive'}>
                          {review.status || 'Pending'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          {review.status !== 'Approved' && (
                            <Button size="sm" variant="outline" className="text-green-600 hover:bg-green-50" onClick={() => handleUpdateStatus(review._id, 'Approved')}>
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          {review.status !== 'Rejected' && (
                            <Button size="sm" variant="outline" className="text-orange-500 hover:bg-orange-50" onClick={() => handleUpdateStatus(review._id, 'Rejected')}>
                              <XCircle className="w-4 h-4" />
                            </Button>
                          )}
                          <Button size="sm" variant="outline" className="text-red-500 hover:bg-red-50 hover:border-red-200" onClick={() => handleDelete(review._id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
