import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Diagnosis } from '@/types/diagnosis';
import { formatDistanceToNow } from 'date-fns';
import { ChevronRight, Leaf } from 'lucide-react';

interface DiagnosisCardProps {
  diagnosis: Diagnosis;
}

export function DiagnosisCard({ diagnosis }: DiagnosisCardProps) {
  return (
    <Link to={`/diagnosis/${diagnosis.id}`}>
      <Card className="overflow-hidden hover:shadow-card transition-shadow animate-fade-up">
        <CardContent className="p-0">
          <div className="flex gap-4">
            <div className="relative w-24 h-24 flex-shrink-0">
              <img
                src={diagnosis.imageUrl}
                alt={diagnosis.plantName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/10" />
            </div>
            
            <div className="flex-1 py-3 pr-3">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">{diagnosis.plantName}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              </div>
              
              <p className="text-foreground font-medium mb-2 line-clamp-1">
                {diagnosis.diseaseName || 'Analyzing...'}
              </p>
              
              <div className="flex items-center justify-between gap-2">
                <StatusBadge status={diagnosis.status} />
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(diagnosis.createdAt, { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
