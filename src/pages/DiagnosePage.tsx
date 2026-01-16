import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Send, Loader2, Info } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ImageUploader } from '@/components/diagnosis/ImageUploader';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useDiagnosisStore } from '@/stores/diagnosisStore';
import { toast } from 'sonner';

export default function DiagnosePage() {
  const navigate = useNavigate();
  const { addDiagnosis, setLoading, isLoading } = useDiagnosisStore();
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [context, setContext] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = async () => {
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }

    setLoading(true);

    // Simulate API call - this is where external AI API would be called
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Create local URL for preview (in production, this would be uploaded to storage)
    const imageUrl = URL.createObjectURL(selectedImage);

    // Mock AI response - replace with actual API call
    addDiagnosis({
      imageUrl,
      plantName: 'Unknown Plant',
      diseaseName: 'Analyzing...',
      confidence: null,
      status: 'PENDING',
      treatment: null,
      agronomistNotes: null,
    });

    setLoading(false);
    toast.success('Diagnosis submitted for review');
    navigate('/history');
  };

  const toggleRecording = () => {
    if (!selectedImage) {
      toast.error('Please select an image first before adding voice notes');
      return;
    }
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast.info('Voice recording is ready for external API integration');
    }
  };

  return (
    <div className="min-h-screen pb-24">
      <PageHeader title="New Diagnosis" showBack />

      <div className="px-5 py-6 space-y-6">
        {/* Image Upload Section */}
        <section className="animate-fade-up">
          <h2 className="font-medium mb-3">Plant Image</h2>
          <ImageUploader
            selectedImage={selectedImage}
            onImageSelect={setSelectedImage}
            onClear={() => setSelectedImage(null)}
          />
        </section>

        {/* Context Section */}
        <section className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-medium">Additional Context</h2>
            <span className="text-xs text-muted-foreground">(Optional)</span>
          </div>

          <div className="relative">
            <Textarea
              placeholder="Describe any symptoms, growing conditions, or concerns..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="min-h-[100px] pr-12 resize-none"
            />
            <Button
              size="icon"
              variant={isRecording ? 'destructive' : 'ghost'}
              className="absolute bottom-2 right-2"
              onClick={toggleRecording}
              disabled={!selectedImage}
            >
              {isRecording ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </Button>
          </div>

          {isRecording && (
            <div className="flex items-center gap-2 mt-2 text-sm text-destructive animate-pulse-soft">
              <div className="w-2 h-2 rounded-full bg-destructive" />
              Recording voice note...
            </div>
          )}
        </section>

        {/* Info Box */}
        <section className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex gap-3 p-4 bg-secondary rounded-xl">
            <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-secondary-foreground mb-1">
                How it works
              </p>
              <p className="text-muted-foreground">
                Your image will be analyzed by AI and reviewed by an agronomist
                for accurate diagnosis and treatment recommendations.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Submit Button */}
      <div className="fixed bottom-20 left-0 right-0 p-5 bg-gradient-to-t from-background via-background to-transparent">
        <Button
          size="lg"
          className="w-full"
          onClick={handleSubmit}
          disabled={!selectedImage || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Submit for Diagnosis
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
