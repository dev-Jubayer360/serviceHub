import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Heart, Star, MapPin, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface ServiceCardProps {
  id: string;
  image: string;
  category: string;
  title: string;
  providerName: string;
  isVerified: boolean;
  location: string;
  rating: number;
  price: number;
}

export const ServiceCard = ({
  id,
  image,
  category,
  title,
  providerName,
  isVerified,
  location,
  rating,
  price,
}: ServiceCardProps) => {
  return (
    <Link href={`/services/${id}`} className="block h-full group">
      <Card className="flex flex-col h-full group-hover:-translate-y-1 transition-transform duration-300">
      <div className="relative h-48 w-full overflow-hidden bg-muted/20">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-secondary shadow-sm">{category}</Badge>
        </div>
        <div className="absolute top-3 right-3">
          <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-muted hover:text-red-500 transition-colors shadow-sm cursor-pointer z-10" onClick={(e) => { e.preventDefault(); /* handle like logic later */ }}>
            <Heart className="w-4 h-4" />
          </div>
        </div>
        <div className="absolute bottom-3 right-3">
          <Badge className="bg-white/90 backdrop-blur-sm text-foreground shadow-sm flex items-center gap-1 font-bold">
            <Star className="w-3 h-3 fill-accent text-accent" />
            {rating.toFixed(1)}
          </Badge>
        </div>
      </div>
      
      <CardContent className="flex-1 flex flex-col pt-5">
        <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-1">{title}</h3>
        
        <div className="flex items-center gap-1 mb-3">
          <span className="text-sm font-medium text-muted">{providerName}</span>
          {isVerified && <CheckCircle className="w-4 h-4 text-secondary" />}
        </div>
        
        <div className="flex items-center gap-1 text-sm text-muted mb-4">
          <MapPin className="w-4 h-4" />
          {location}
        </div>
        
        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
          <div>
            <span className="text-xs text-muted">From</span>
            <div className="font-bold text-foreground text-lg">৳{price.toLocaleString()}</div>
          </div>
          <span className="inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-white shadow hover:bg-primary/90 h-9 px-4 py-2">
            View Details
          </span>
        </div>
      </CardContent>
      </Card>
    </Link>
  );
};
