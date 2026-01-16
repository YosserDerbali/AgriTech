import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { DiagnosisCard } from '@/components/diagnosis/DiagnosisCard';
import { useDiagnosisStore } from '@/stores/diagnosisStore';
import { Button } from '@/components/ui/button';
import { DiagnosisStatus } from '@/types/diagnosis';
import { cn } from '@/lib/utils';
import { Inbox } from 'lucide-react';

type FilterType = 'ALL' | DiagnosisStatus;

const filters: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
];

export default function HistoryPage() {
  const diagnoses = useDiagnosisStore((s) => s.diagnoses);
  const [filter, setFilter] = useState<FilterType>('ALL');

  const filteredDiagnoses = filter === 'ALL'
    ? diagnoses
    : diagnoses.filter((d) => d.status === filter);

  return (
    <div className="min-h-screen pb-20">
      <PageHeader title="Diagnosis History" />

      {/* Filters */}
      <div className="px-5 py-4 sticky top-[57px] bg-background/95 backdrop-blur-sm z-30">
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {filters.map(({ label, value }) => (
            <Button
              key={value}
              variant={filter === value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(value)}
              className={cn(
                'flex-shrink-0',
                filter === value && 'shadow-soft'
              )}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="px-5 pb-4">
        {filteredDiagnoses.length > 0 ? (
          <div className="space-y-3">
            {filteredDiagnoses.map((diagnosis, i) => (
              <div
                key={diagnosis.id}
                className="animate-fade-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <DiagnosisCard diagnosis={diagnosis} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Inbox className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-1">No diagnoses found</h3>
            <p className="text-sm text-muted-foreground">
              {filter === 'ALL'
                ? 'Start by scanning your first plant'
                : `No ${filter.toLowerCase()} diagnoses yet`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
