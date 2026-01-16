import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { AlertTriangle, CheckCircle2, FileText, MessageSquare, TrendingUp, User } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDiagnosisStore } from '@/stores/diagnosisStore';
import { toast } from 'sonner';

export default function DiagnosisDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const diagnosis = useDiagnosisStore((s) => s.getDiagnosis(id || ''));

  if (!diagnosis) {
    return (
      <div className="min-h-screen pb-20">
        <PageHeader title="Diagnosis Details" showBack />
        <div className="flex flex-col items-center justify-center h-[60vh] px-5">
          <AlertTriangle className="w-12 h-12 text-muted-foreground mb-4" />
          <h2 className="text-lg font-medium mb-2">Diagnosis not found</h2>
          <Button variant="outline" onClick={() => navigate('/history')}>
            Go to History
          </Button>
        </div>
      </div>
    );
  }

  const handleReport = () => {
    toast.info('Report feature ready for backend integration');
  };

  return (
    <div className="min-h-screen pb-24">
      <PageHeader title="Diagnosis Details" showBack />

      {/* Image */}
      <div className="relative">
        <img
          src={diagnosis.imageUrl}
          alt={diagnosis.plantName}
          className="w-full aspect-video object-cover"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        <div className="absolute bottom-4 left-4">
          <StatusBadge status={diagnosis.status} />
        </div>
      </div>

      <div className="px-5 py-6 space-y-6">
        {/* Header Info */}
        <div className="animate-fade-up">
          <h1 className="text-2xl font-bold mb-1">{diagnosis.diseaseName || 'Pending Analysis'}</h1>
          <p className="text-muted-foreground">
            Plant: <span className="text-foreground font-medium">{diagnosis.plantName}</span>
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Submitted {format(diagnosis.createdAt, 'MMM d, yyyy h:mm a')}
          </p>
        </div>

        {/* Confidence Score */}
        {diagnosis.confidence !== null && (
          <Card className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                AI Confidence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${diagnosis.confidence * 100}%` }}
                  />
                </div>
                <span className="font-bold text-lg">{Math.round(diagnosis.confidence * 100)}%</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Treatment */}
        {diagnosis.status === 'APPROVED' && diagnosis.treatment && (
          <Card className="animate-fade-up border-status-approved/30" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-status-approved" />
                Treatment Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{diagnosis.treatment}</p>
            </CardContent>
          </Card>
        )}

        {/* Agronomist Notes */}
        {diagnosis.agronomistNotes && (
          <Card className="animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Agronomist Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {diagnosis.agronomistNotes}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Pending State */}
        {diagnosis.status === 'PENDING' && (
          <Card className="animate-fade-up bg-status-pending/10 border-status-pending/30" style={{ animationDelay: '0.2s' }}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-status-pending/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-status-pending-foreground" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Awaiting Expert Review</h3>
                  <p className="text-sm text-muted-foreground">
                    An agronomist will review your submission and provide treatment recommendations soon.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rejected State */}
        {diagnosis.status === 'REJECTED' && (
          <Card className="animate-fade-up bg-status-rejected/10 border-status-rejected/30" style={{ animationDelay: '0.2s' }}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-status-rejected/20 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-status-rejected" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Review Required</h3>
                  <p className="text-sm text-muted-foreground">
                    {diagnosis.agronomistNotes || 'Please submit a new image with better quality for accurate diagnosis.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-20 left-0 right-0 p-5 bg-gradient-to-t from-background via-background to-transparent">
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={handleReport}
        >
          <MessageSquare className="w-4 h-4" />
          Report Incorrect Prediction
        </Button>
      </div>
    </div>
  );
}
