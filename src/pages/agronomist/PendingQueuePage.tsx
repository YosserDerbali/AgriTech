import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { PendingDiagnosisCard } from '@/components/agronomist/PendingDiagnosisCard';
import { useDiagnosisStore } from '@/stores/diagnosisStore';
import { Button } from '@/components/ui/button';
import { CheckCircle, Filter, SortDesc } from 'lucide-react';
import { cn } from '@/lib/utils';

type SortOption = 'newest' | 'oldest' | 'confidence';

export default function PendingQueuePage() {
  const { diagnoses, getPendingDiagnoses } = useDiagnosisStore();
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showLowConfidenceOnly, setShowLowConfidenceOnly] = useState(false);

  const pendingDiagnoses = getPendingDiagnoses();

  const filteredDiagnoses = pendingDiagnoses
    .filter((d) => !showLowConfidenceOnly || (d.confidence !== null && d.confidence < 0.7))
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return a.createdAt.getTime() - b.createdAt.getTime();
        case 'confidence':
          return (a.confidence || 0) - (b.confidence || 0);
        case 'newest':
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });

  const lowConfidenceCount = pendingDiagnoses.filter(
    (d) => d.confidence !== null && d.confidence < 0.7
  ).length;

  return (
    <div className="min-h-screen pb-20">
      <PageHeader 
        title="Pending Queue" 
        showBack
        action={
          <span className="text-sm text-muted-foreground">
            {pendingDiagnoses.length} pending
          </span>
        }
      />

      <main className="p-4 space-y-4">
        {/* Filters & Sort */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Button
            variant={showLowConfidenceOnly ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowLowConfidenceOnly(!showLowConfidenceOnly)}
            className="whitespace-nowrap"
          >
            <Filter className="w-4 h-4 mr-1" />
            Low Confidence ({lowConfidenceCount})
          </Button>
          
          <div className="flex bg-muted rounded-lg p-0.5">
            {(['newest', 'oldest', 'confidence'] as SortOption[]).map((option) => (
              <button
                key={option}
                onClick={() => setSortBy(option)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize',
                  sortBy === option
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Queue List */}
        {filteredDiagnoses.length === 0 ? (
          <div className="bg-success/10 border border-success/30 rounded-xl p-8 text-center">
            <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
            <p className="font-medium text-success text-lg">All caught up!</p>
            <p className="text-sm text-muted-foreground mt-1">
              {showLowConfidenceOnly 
                ? 'No low confidence diagnoses to review.'
                : 'No pending diagnoses in the queue.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDiagnoses.map((diagnosis) => (
              <PendingDiagnosisCard key={diagnosis.id} diagnosis={diagnosis} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
