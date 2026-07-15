import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Star } from 'lucide-react';

interface ReviewCardProps {
  avatar: string;
  name: string;
  serviceUsed: string;
  rating: number;
  reviewText: string;
  date: string;
}

export const ReviewCard = ({
  avatar,
  name,
  serviceUsed,
  rating,
  reviewText,
  date,
}: ReviewCardProps) => {
  return (
    <Card className="h-full">
      <CardContent className="pt-6">
        <div className="flex gap-4 mb-4">
          <img 
            src={avatar} 
            alt={name} 
            className="w-12 h-12 rounded-full object-cover bg-muted/20"
          />
          <div>
            <h4 className="font-semibold text-foreground text-sm">{name}</h4>
            <p className="text-xs text-muted mb-1">{serviceUsed}</p>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3 h-3 ${i < rating ? 'fill-accent text-accent' : 'text-muted/30'}`} 
                />
              ))}
            </div>
          </div>
        </div>
        <p className="text-sm text-foreground mb-4 leading-relaxed line-clamp-4">
          "{reviewText}"
        </p>
        <p className="text-xs text-muted">{date}</p>
      </CardContent>
    </Card>
  );
};
