import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AIModelCard } from '@/components/admin/AIModelCard';
import { StatsCard } from '@/components/admin/StatsCard';
import { useAdminStore } from '@/stores/adminStore';
import { Brain, TrendingUp, Zap, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';

export default function AIModelsPage() {
  const { aiModels, toggleAIModel, loadAIModels } = useAdminStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    loadAIModels()
      .catch(err => console.error('Failed to load AI models:', err))
      .finally(() => setIsLoading(false));
  }, [loadAIModels]);

  const handleToggle = (modelId: string) => {
    const model = aiModels.find((m) => m.id === modelId);
    toggleAIModel(modelId);
    toast.success(`${model?.name} ${model?.isEnabled ? 'disabled' : 'enabled'}`);
  };

  const totalPredictions = aiModels.reduce((sum, m) => sum + m.totalPredictions, 0);
  const avgAccuracy = aiModels.reduce((sum, m) => sum + (m.accuracy || 0), 0) / aiModels.length;
  const enabledModels = aiModels.filter((m) => m.isEnabled).length;

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      
      <main className="lg:ml-72 pt-16 lg:pt-0">
        <div className="p-4 lg:p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-primary/10">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">AI Performance</h1>
              <p className="text-muted-foreground">Monitor and manage AI models</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard
              title="Active Models"
              value={`${enabledModels}/${aiModels.length}`}
              icon={Zap}
              variant="primary"
            />
            <StatsCard
              title="Total Predictions"
              value={totalPredictions.toLocaleString()}
              icon={Activity}
              variant="accent"
            />
            <StatsCard
              title="Avg. Accuracy"
              value={`${avgAccuracy.toFixed(1)}%`}
              icon={TrendingUp}
              variant="success"
            />
            <StatsCard
              title="Models Available"
              value={aiModels.length}
              icon={Brain}
              variant="default"
            />
          </div>

          {/* Performance Overview */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Model Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {aiModels.map((model) => (
                  <div key={model.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{model.name}</span>
                        <span className={`w-2 h-2 rounded-full ${model.isEnabled ? 'bg-status-approved' : 'bg-muted'}`} />
                      </div>
                      <span className="text-sm font-semibold">{model.accuracy}%</span>
                    </div>
                    <Progress value={model.accuracy} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {model.totalPredictions.toLocaleString()} predictions • {model.version}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Models Grid */}
          <h2 className="text-lg font-semibold mb-4">Manage Models</h2>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
              {aiModels.map((model) => (
                <AIModelCard
                  key={model.id}
                  model={model}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
