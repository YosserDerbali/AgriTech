import { Link } from 'react-router-dom';
import { Camera, FileCheck, Clock, Sprout, ChevronRight, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/home/StatCard';
import { DiagnosisCard } from '@/components/diagnosis/DiagnosisCard';
import { useDiagnosisStore } from '@/stores/diagnosisStore';

export default function HomePage() {
  const diagnoses = useDiagnosisStore((s) => s.diagnoses);
  const recentDiagnoses = diagnoses.slice(0, 3);
  
  const stats = {
    total: diagnoses.length,
    approved: diagnoses.filter((d) => d.status === 'APPROVED').length,
    pending: diagnoses.filter((d) => d.status === 'PENDING').length,
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <div className="gradient-hero px-5 pt-12 pb-8 text-primary-foreground">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
            <Leaf className="w-6 h-6" />
          </div>
          <span className="font-semibold text-lg">AgriScan</span>
        </div>
        
        <h1 className="text-2xl font-bold mb-2 animate-fade-up">
          Welcome back! 👋
        </h1>
        <p className="text-primary-foreground/80 mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          Protect your crops with AI-powered disease detection
        </p>

        <Link to="/diagnose">
          <Button
            size="lg"
            className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-elevated animate-fade-up"
            style={{ animationDelay: '0.2s' }}
          >
            <Camera className="w-5 h-5 mr-2" />
            New Diagnosis
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="px-5 -mt-4">
        <div className="grid grid-cols-3 gap-3 animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <StatCard icon={Sprout} label="Total Scans" value={stats.total} color="primary" />
          <StatCard icon={FileCheck} label="Approved" value={stats.approved} color="approved" />
          <StatCard icon={Clock} label="Pending" value={stats.pending} color="pending" />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-5 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Diagnoses</h2>
          <Link to="/history" className="text-sm text-primary font-medium flex items-center gap-1">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {recentDiagnoses.length > 0 ? (
          <div className="space-y-3">
            {recentDiagnoses.map((diagnosis, i) => (
              <div key={diagnosis.id} style={{ animationDelay: `${0.4 + i * 0.1}s` }}>
                <DiagnosisCard diagnosis={diagnosis} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Sprout className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-1">No diagnoses yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start by scanning your first plant
            </p>
            <Link to="/diagnose">
              <Button size="sm">
                <Camera className="w-4 h-4 mr-2" />
                Scan Plant
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Quick Tips */}
      <div className="px-5 mt-8 mb-4">
        <h2 className="text-lg font-semibold mb-4">Quick Tips</h2>
        <div className="bg-secondary rounded-xl p-4">
          <p className="text-sm text-secondary-foreground">
            💡 <strong>Pro tip:</strong> For best results, take photos in natural daylight and focus on the affected area of the plant.
          </p>
        </div>
      </div>
    </div>
  );
}
