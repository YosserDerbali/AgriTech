import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDiagnosisStore } from '@/stores/diagnosisStore';
import { 
  Leaf, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Brain,
  Calendar,
  Edit3,
  Save
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function DiagnosisReviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getDiagnosis, approveDiagnosis, rejectDiagnosis, updateDiagnosis } = useDiagnosisStore();
  
  const diagnosis = getDiagnosis(id || '');
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedDisease, setEditedDisease] = useState(diagnosis?.diseaseName || '');
  const [treatment, setTreatment] = useState(diagnosis?.treatment || '');
  const [notes, setNotes] = useState(diagnosis?.agronomistNotes || '');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  if (!diagnosis) {
    return (
      <div className="min-h-screen pb-20">
        <PageHeader title="Review" showBack />
        <div className="p-4 text-center text-muted-foreground">
          Diagnosis not found.
        </div>
      </div>
    );
  }

  const isLowConfidence = diagnosis.confidence !== null && diagnosis.confidence < 0.7;

  const handleApprove = () => {
    if (!treatment.trim()) {
      toast.error('Please provide treatment recommendations');
      return;
    }
    approveDiagnosis(diagnosis.id, treatment, notes);
    toast.success('Diagnosis approved successfully');
    navigate('/agronomist/queue');
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    rejectDiagnosis(diagnosis.id, rejectionReason);
    toast.success('Diagnosis rejected');
    navigate('/agronomist/queue');
  };

  const handleSaveEdits = () => {
    updateDiagnosis(diagnosis.id, { diseaseName: editedDisease });
    setIsEditing(false);
    toast.success('Diagnosis updated');
  };

  return (
    <div className="min-h-screen pb-24">
      <PageHeader 
        title="Review Diagnosis" 
        showBack
        action={<StatusBadge status={diagnosis.status} />}
      />

      <main className="p-4 space-y-4">
        {/* Plant Image */}
        <Card className="overflow-hidden">
          <div className="relative aspect-video">
            <img
              src={diagnosis.imageUrl}
              alt={diagnosis.plantName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <div className="flex items-center gap-2 text-white">
                <Leaf className="w-5 h-5" />
                <span className="font-semibold">{diagnosis.plantName}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* AI Analysis */}
        <Card className={cn(isLowConfidence && 'border-warning/50')}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Brain className="w-4 h-4 text-accent" />
              AI Analysis
              {isLowConfidence && (
                <span className="ml-auto flex items-center gap-1 text-xs text-warning">
                  <AlertTriangle className="w-3 h-3" />
                  Low Confidence
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label className="text-muted-foreground text-xs">Detected Disease</Label>
                {!isEditing && diagnosis.status === 'PENDING' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="h-6 text-xs"
                  >
                    <Edit3 className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
              {isEditing ? (
                <div className="flex gap-2">
                  <Input
                    value={editedDisease}
                    onChange={(e) => setEditedDisease(e.target.value)}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={handleSaveEdits}>
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <p className="font-medium">{diagnosis.diseaseName || 'Unknown'}</p>
              )}
            </div>

            <div>
              <Label className="text-muted-foreground text-xs">Confidence Score</Label>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all",
                      isLowConfidence ? "bg-warning" : "bg-success"
                    )}
                    style={{ width: `${(diagnosis.confidence || 0) * 100}%` }}
                  />
                </div>
                <span className={cn(
                  "text-sm font-medium",
                  isLowConfidence ? "text-warning" : "text-success"
                )}>
                  {diagnosis.confidence !== null 
                    ? `${Math.round(diagnosis.confidence * 100)}%`
                    : 'N/A'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {format(diagnosis.createdAt, 'MMM d, yyyy HH:mm')}
              </span>
              <span>
                {formatDistanceToNow(diagnosis.createdAt, { addSuffix: true })}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Treatment Recommendation (for approval) */}
        {diagnosis.status === 'PENDING' && !showRejectForm && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Treatment Recommendation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="treatment">Treatment Guidelines *</Label>
                <Textarea
                  id="treatment"
                  placeholder="Provide detailed treatment recommendations..."
                  value={treatment}
                  onChange={(e) => setTreatment(e.target.value)}
                  className="mt-1.5 min-h-[120px]"
                />
              </div>
              <div>
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional observations or notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rejection Form */}
        {diagnosis.status === 'PENDING' && showRejectForm && (
          <Card className="border-destructive/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-destructive">Rejection Reason</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Please explain why this diagnosis is being rejected..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>
        )}

        {/* Existing Treatment (for non-pending) */}
        {diagnosis.status !== 'PENDING' && diagnosis.treatment && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Treatment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{diagnosis.treatment}</p>
            </CardContent>
          </Card>
        )}

        {/* Agronomist Notes (for non-pending) */}
        {diagnosis.status !== 'PENDING' && diagnosis.agronomistNotes && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Agronomist Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{diagnosis.agronomistNotes}</p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Action Buttons */}
      {diagnosis.status === 'PENDING' && (
        <div className="fixed bottom-20 left-0 right-0 p-4 bg-background border-t border-border">
          {showRejectForm ? (
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowRejectForm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleReject}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Confirm Reject
              </Button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                onClick={() => setShowRejectForm(true)}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button
                className="flex-1 bg-success hover:bg-success/90"
                onClick={handleApprove}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
