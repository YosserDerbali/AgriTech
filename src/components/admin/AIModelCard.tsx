import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AIModel } from '@/types/admin';
import { formatDistanceToNow } from 'date-fns';
import { Brain, Mic, Users } from 'lucide-react';

interface AIModelCardProps {
  model: AIModel;
  onToggle: (modelId: string) => void;
}

export function AIModelCard({ model, onToggle }: AIModelCardProps) {
  const getModelIcon = () => {
    switch (model.type) {
      case 'DISEASE_DETECTION':
        return Brain;
      case 'SPEECH_RECOGNITION':
        return Mic;
      case 'RECOMMENDATION':
        return Users;
      default:
        return Brain;
    }
  };

  const getModelTypeBadge = () => {
    switch (model.type) {
      case 'DISEASE_DETECTION':
        return 'Disease Detection';
      case 'SPEECH_RECOGNITION':
        return 'Speech Recognition';
      case 'RECOMMENDATION':
        return 'Recommendation';
      default:
        return model.type;
    }
  };

  const Icon = getModelIcon();

  return (
    <Card className="animate-fade-up">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">{model.name}</CardTitle>
              <p className="text-xs text-muted-foreground">{model.version}</p>
            </div>
          </div>
          <Switch
            checked={model.isEnabled}
            onCheckedChange={() => onToggle(model.id)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="secondary">{getModelTypeBadge()}</Badge>
            <Badge variant={model.isEnabled ? 'default' : 'outline'}>
              {model.isEnabled ? 'Active' : 'Disabled'}
            </Badge>
          </div>

          {model.accuracy !== undefined && (
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Accuracy</span>
                <span className="font-medium">{model.accuracy}%</span>
              </div>
              <Progress value={model.accuracy} className="h-2" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Total Predictions</p>
              <p className="font-semibold">{model.totalPredictions.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Last Updated</p>
              <p className="font-semibold">
                {formatDistanceToNow(model.lastUpdated, { addSuffix: true })}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
