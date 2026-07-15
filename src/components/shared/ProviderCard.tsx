import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Star, CheckCircle, Briefcase } from 'lucide-react';
import Link from 'next/link';

interface ProviderCardProps {
  id: string;
  image: string;
  name: string;
  specialization: string;
  experience: string;
  rating: number;
  completedJobs: number;
}

export const ProviderCard = ({
  id,
  image,
  name,
  specialization,
  experience,
  rating,
  completedJobs,
}: ProviderCardProps) => {
  return (
    <Card className="text-center hover:-translate-y-1 transition-transform duration-300">
      <CardContent className="pt-6">
        <div className="relative inline-block mb-4">
          <img 
            src={image} 
            alt={name} 
            className="w-24 h-24 rounded-full object-cover border-4 border-background shadow-sm"
          />
          <div className="absolute bottom-1 right-1 bg-white rounded-full p-0.5 shadow-sm">
            <CheckCircle className="w-5 h-5 text-secondary" />
          </div>
        </div>
        
        <h3 className="font-semibold text-lg text-foreground">{name}</h3>
        <p className="text-sm text-secondary font-medium mb-4">{specialization}</p>
        
        <div className="grid grid-cols-2 gap-2 text-sm mb-6 pb-6 border-b border-border">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 font-bold text-foreground mb-1">
              <Star className="w-4 h-4 fill-accent text-accent" />
              {rating.toFixed(1)}
            </div>
            <span className="text-xs text-muted text-center">Rating</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 font-bold text-foreground mb-1">
              <Briefcase className="w-4 h-4 text-muted" />
              {completedJobs}+
            </div>
            <span className="text-xs text-muted text-center">Completed</span>
          </div>
        </div>
        
        <div className="text-xs text-muted mb-4 font-medium">
          Experience: {experience}
        </div>
        
        <Link href={`/provider/${id}`}>
          <Button variant="outline" fullWidth>View Profile</Button>
        </Link>
      </CardContent>
    </Card>
  );
};
