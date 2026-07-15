import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  iconBgColor?: string;
  iconColor?: string;
}

export const StatCard = ({
  icon: Icon,
  value,
  label,
  iconBgColor = 'bg-primary/10',
  iconColor = 'text-primary',
}: StatCardProps) => {
  return (
    <Card className="flex flex-col justify-center h-full">
      <CardContent className="p-6 flex items-center gap-4 mt-0 pt-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${iconBgColor}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div className="overflow-hidden">
          <div className="text-2xl font-bold text-foreground truncate">{value}</div>
          <div className="text-sm font-medium text-muted truncate">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
};
