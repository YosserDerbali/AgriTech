import { PageHeader } from '@/components/layout/PageHeader';
import { AgronomistStatCard } from '@/components/agronomist/StatCard';
import { PendingDiagnosisCard } from '@/components/agronomist/PendingDiagnosisCard';
import { useDiagnosisStore } from '@/stores/diagnosisStore';
import { useArticleStore } from '@/stores/articleStore';
import { ClipboardList, CheckCircle, XCircle, FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function AgronomistDashboardPage() {
  const { diagnoses, getPendingDiagnoses } = useDiagnosisStore();
  const { getMyArticles } = useArticleStore();

  const pendingDiagnoses = getPendingDiagnoses();
  const approvedCount = diagnoses.filter((d) => d.status === 'APPROVED').length;
  const rejectedCount = diagnoses.filter((d) => d.status === 'REJECTED').length;
  const myArticles = getMyArticles();

  return (
    <div className="min-h-screen pb-20">
      <PageHeader title="Dashboard" />

      <main className="p-4 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-accent/20 to-accent/5 rounded-xl p-4 border border-accent/30">
          <h2 className="font-semibold text-lg mb-1">Welcome back, Dr. Green!</h2>
          <p className="text-sm text-muted-foreground">
            You have {pendingDiagnoses.length} diagnoses waiting for your review.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <AgronomistStatCard
            title="Pending Review"
            value={pendingDiagnoses.length}
            icon={ClipboardList}
            variant="warning"
          />
          <AgronomistStatCard
            title="Approved"
            value={approvedCount}
            icon={CheckCircle}
            variant="success"
            trend={{ value: 12, isPositive: true }}
          />
          <AgronomistStatCard
            title="Rejected"
            value={rejectedCount}
            icon={XCircle}
            variant="default"
          />
          <AgronomistStatCard
            title="My Articles"
            value={myArticles.length}
            icon={FileText}
            variant="accent"
          />
        </div>

        {/* Pending Queue Preview */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Pending Diagnoses</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/agronomist/queue" className="flex items-center gap-1 text-accent">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          {pendingDiagnoses.length === 0 ? (
            <div className="bg-success/10 border border-success/30 rounded-xl p-6 text-center">
              <CheckCircle className="w-10 h-10 text-success mx-auto mb-2" />
              <p className="font-medium text-success">All caught up!</p>
              <p className="text-sm text-muted-foreground">No pending diagnoses to review.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingDiagnoses.slice(0, 2).map((diagnosis) => (
                <PendingDiagnosisCard key={diagnosis.id} diagnosis={diagnosis} />
              ))}
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="font-semibold mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link to="/agronomist/queue">
                <ClipboardList className="w-5 h-5 text-accent" />
                <span className="text-sm">Review Queue</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link to="/agronomist/articles/new">
                <FileText className="w-5 h-5 text-primary" />
                <span className="text-sm">Write Article</span>
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
