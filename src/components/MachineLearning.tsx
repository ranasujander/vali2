import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Zap, 
  Target, 
  Settings, 
  TrendingUp,
  Activity,
  Cpu,
  GitBranch
} from 'lucide-react';

interface ParsedData {
  columns: string[];
  data: any[][];
  rowCount: number;
  summary: {
    numerical: number;
    categorical: number;
    datetime: number;
  };
}

interface MachineLearningProps {
  uploadedData?: ParsedData | null;
}

export function MachineLearning({ uploadedData }: MachineLearningProps) {
  const [selectedModel, setSelectedModel] = useState('');
  const [targetVariable, setTargetVariable] = useState('');
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);

  const models = [
    { id: 'linear', name: 'Linear Regression', type: 'regression', complexity: 'Low', icon: TrendingUp },
    { id: 'logistic', name: 'Logistic Regression', type: 'classification', complexity: 'Low', icon: GitBranch },
    { id: 'decision_tree', name: 'Decision Tree', type: 'both', complexity: 'Medium', icon: GitBranch },
    { id: 'random_forest', name: 'Random Forest', type: 'both', complexity: 'Medium', icon: Activity },
    { id: 'lasso', name: 'Lasso Regression', type: 'regression', complexity: 'Medium', icon: Target },
    { id: 'ridge', name: 'Ridge Regression', type: 'regression', complexity: 'Medium', icon: Target },
    { id: 'xgboost', name: 'XGBoost', type: 'both', complexity: 'High', icon: Zap },
    { id: 'catboost', name: 'CatBoost', type: 'both', complexity: 'High', icon: Zap },
    { id: 'neural_network', name: 'Neural Network', type: 'both', complexity: 'High', icon: Brain },
  ];

  const availableVariables = (uploadedData?.columns || [
    'revenue', 'profit_margin', 'market_cap', 'risk_score', 'rating'
  ]).filter(col => col && col.trim() !== '');

  const availableFeatures = (uploadedData?.columns || [
    'sector', 'region', 'year', 'quarter', 'volatility', 'debt_ratio', 'roa', 'roe'
  ]).filter(col => col && col.trim() !== '');

  const complexityColors = {
    'Low': 'bg-green-100 text-green-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'High': 'bg-red-100 text-red-800'
  };

  const typeColors = {
    'regression': 'bg-blue-100 text-blue-800',
    'classification': 'bg-purple-100 text-purple-800',
    'both': 'bg-gray-100 text-gray-800'
  };

  const handleTrainModel = () => {
    setIsTraining(true);
    setTrainingProgress(0);
    
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          return 100;
        }
        return prev + 8;
      });
    }, 300);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Algorithmic Forge</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Harness the power of advanced machine learning algorithms to uncover predictive insights
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Model Selection */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-accent" />
              Algorithm Arsenal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {models.map((model) => {
              const Icon = model.icon;
              return (
                <div
                  key={model.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                    selectedModel === model.id
                      ? 'border-accent bg-accent/10'
                      : 'border-border hover:border-accent/50'
                  }`}
                  onClick={() => setSelectedModel(model.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-accent" />
                      <span className="font-medium text-sm">{model.name}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Badge className={complexityColors[model.complexity as keyof typeof complexityColors]} variant="secondary">
                      {model.complexity}
                    </Badge>
                    <Badge className={typeColors[model.type as keyof typeof typeColors]} variant="secondary">
                      {model.type}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Configuration */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-accent" />
              Model Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Variable</label>
              <Select value={targetVariable} onValueChange={setTargetVariable}>
                <SelectTrigger>
                  <SelectValue placeholder="Select prediction target" />
                </SelectTrigger>
                <SelectContent>
                  {availableVariables.map((variable) => (
                    <SelectItem key={variable} value={variable}>
                      {variable.replace('_', ' ').toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Feature Variables</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {availableFeatures.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={feature}
                      className="rounded border-border"
                      defaultChecked={true}
                    />
                    <label htmlFor={feature} className="text-sm">
                      {feature.replace('_', ' ').toUpperCase()}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Train/Test Split</label>
              <Select defaultValue="80">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="70">70% Train / 30% Test</SelectItem>
                  <SelectItem value="80">80% Train / 20% Test</SelectItem>
                  <SelectItem value="90">90% Train / 10% Test</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Cross-Validation</label>
              <Select defaultValue="5">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3-Fold CV</SelectItem>
                  <SelectItem value="5">5-Fold CV</SelectItem>
                  <SelectItem value="10">10-Fold CV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Training Status */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-accent" />
              Training Matrix
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isTraining ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto gradient-accent rounded-full flex items-center justify-center mb-4">
                    <Brain className="w-8 h-8 text-accent-foreground animate-pulse" />
                  </div>
                  <p className="font-medium">Training {models.find(m => m.id === selectedModel)?.name}</p>
                  <p className="text-sm text-muted-foreground">Optimizing hyperparameters...</p>
                </div>
                <Progress value={trainingProgress} className="w-full" />
                <p className="text-xs text-center text-muted-foreground">
                  {trainingProgress}% - Epoch {Math.floor(trainingProgress / 10)}/10
                </p>
              </div>
            ) : trainingProgress === 100 ? (
              <div className="space-y-4">
                <Alert>
                  <AlertDescription>
                    <strong>Training Complete!</strong> Model ready for evaluation and deployment.
                  </AlertDescription>
                </Alert>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-muted/50 p-2 rounded">
                    <span className="font-medium">Accuracy:</span> 94.2%
                  </div>
                  <div className="bg-muted/50 p-2 rounded">
                    <span className="font-medium">RMSE:</span> 0.087
                  </div>
                  <div className="bg-muted/50 p-2 rounded">
                    <span className="font-medium">R²:</span> 0.912
                  </div>
                  <div className="bg-muted/50 p-2 rounded">
                    <span className="font-medium">F1:</span> 0.89
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Configure your model parameters and start training
                </p>
                <Button
                  onClick={handleTrainModel}
                  disabled={!selectedModel || !targetVariable}
                  variant="accent"
                  className="w-full"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Initialize Training Sequence
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Model Comparison */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Algorithm Performance Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Algorithm</th>
                  <th className="text-left p-2">Accuracy</th>
                  <th className="text-left p-2">Precision</th>
                  <th className="text-left p-2">Recall</th>
                  <th className="text-left p-2">Training Time</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {models.slice(0, 5).map((model, index) => (
                  <tr key={model.id} className="border-b">
                    <td className="p-2 font-medium">{model.name}</td>
                    <td className="p-2">{(0.85 + Math.random() * 0.1).toFixed(3)}</td>
                    <td className="p-2">{(0.82 + Math.random() * 0.15).toFixed(3)}</td>
                    <td className="p-2">{(0.80 + Math.random() * 0.18).toFixed(3)}</td>
                    <td className="p-2">{Math.floor(Math.random() * 120) + 30}s</td>
                    <td className="p-2">
                      <Badge variant={index < 3 ? "default" : "secondary"}>
                        {index < 3 ? "Trained" : "Pending"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}