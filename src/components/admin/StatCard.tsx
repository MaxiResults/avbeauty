import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'green' | 'blue' | 'purple' | 'orange';
}

const colorClasses = {
  green: 'bg-[hsl(var(--success))] text-white',
  blue: 'bg-[#3b82f6] text-white',
  purple: 'bg-[#8b5cf6] text-white',
  orange: 'bg-[hsl(var(--warning))] text-white',
};

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => {
  return (
    <Card className="shadow-soft hover:shadow-hover transition-smooth">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        <div>
          <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
};
