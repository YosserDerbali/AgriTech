import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Diagnosis } from '@/types/diagnosis';
import { formatDistanceToNow } from 'date-fns';
import { ChevronRight, Leaf, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PendingDiagnosisCardProps {
  diagnosis: Diagnosis;
}

export function PendingDiagnosisCard({ diagnosis }: PendingDiagnosisCardProps) {
  const isLowConfidence = diagnosis.confidence !== null && diagnosis.confidence < 0.7;

  return (
    <Link to={`/agronomist/review/${diagnosis.id}`}>
      <Card className={cn(
        "overflow-hidden hover:shadow-card transition-shadow animate-fade-up",
        isLowConfidence && "border-warning/50"
      )}>
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
              {isLowConfidence && (
                <div className="absolute top-1 left-1 bg-warning text-warning-foreground rounded-full p-1">
                  <AlertCircle className="w-3 h-3" />
                </div>
              )}
            </div>
            
            <div className="flex-1 py-3 pr-3">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">{diagnosis.plantName}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              </div>
              
              <p className="text-foreground font-medium mb-1 line-clamp-1">
                {diagnosis.diseaseName || 'Analyzing...'}
              </p>
              
              <div className="flex items-center gap-2 mb-2">
                <span className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full",
                  isLowConfidence 
                    ? "bg-warning/20 text-warning-foreground" 
                    : "bg-success/20 text-success"
                )}>
                  {diagnosis.confidence !== null 
                    ? `${Math.round(diagnosis.confidence * 100)}% confidence`
                    : 'Pending'}
                </span>
              </div>
              
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
