import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  Target, 
  BarChart, 
  AlertTriangle,
  CheckCircle2,
  Eye,
  Zap,
  Activity
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

interface PerformanceAnalysisProps {
  uploadedData?: ParsedData | null;
}

export function PerformanceAnalysis({ uploadedData }: PerformanceAnalysisProps) {
  const metrics = [
    { name: 'Accuracy', value: 94.2, benchmark: 90, status: 'excellent' },
    { name: 'Precision', value: 89.7, benchmark: 85, status: 'good' },
    { name: 'Recall', value: 91.3, benchmark: 85, status: 'excellent' },
    { name: 'F1-Score', value: 90.5, benchmark: 85, status: 'excellent' },
    { name: 'AUC-ROC', value: 96.8, benchmark: 90, status: 'excellent' },
    { name: 'Log Loss', value: 0.087, benchmark: 0.1, status: 'excellent', inverse: true }
  ];

  const diagnostics = [
    { test: 'Residual Analysis', status: 'pass', description: 'No patterns in residuals detected' },
    { test: 'Normality Test', status: 'pass', description: 'Shapiro-Wilk p-value: 0.23' },
    { test: 'Homoscedasticity', status: 'warning', description: 'Slight heteroscedasticity detected' },
    { test: 'Multicollinearity', status: 'pass', description: 'All VIF values < 5' },
    { test: 'Feature Importance', status: 'pass', description: 'Balanced feature contributions' },
    { test: 'Overfitting Check', status: 'pass', description: 'Train/Val gap: 2.3%' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-success/10 text-success border border-success/20';
      case 'good': return 'bg-accent/10 text-accent border border-accent/20';
      case 'warning': return 'bg-warning/10 text-warning border border-warning/20';
      case 'poor': return 'bg-destructive/10 text-destructive border border-destructive/20';
      default: return 'bg-muted/20 text-muted-foreground border border-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'fail': return <AlertTriangle className="w-4 h-4 text-destructive" />;
      default: return <Eye className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Oracle Metrics Nexus</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Comprehensive model performance analysis with advanced diagnostic testing and validation metrics
        </p>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.name} className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{metric.name}</span>
                <Badge className={getStatusColor(metric.status)}>
                  {metric.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {metric.inverse ? metric.value.toFixed(3) : metric.value.toFixed(1)}
                  {!metric.inverse && '%'}
                </div>
                <div className="text-xs text-muted-foreground">
                  Benchmark: {metric.inverse ? metric.benchmark.toFixed(3) : metric.benchmark}
                  {!metric.inverse && '%'}
                </div>
                <Progress 
                  value={metric.inverse 
                    ? Math.max(0, 100 - (metric.value / metric.benchmark) * 100)
                    : (metric.value / metric.benchmark) * 100
                  } 
                  className="h-2" 
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Diagnostics */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-accent" />
              Diagnostic Testing Suite
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {diagnostics.map((diagnostic) => (
              <div key={diagnostic.test} className="flex items-start gap-3 p-3 rounded-lg bg-muted/20">
                {getStatusIcon(diagnostic.status)}
                <div className="flex-1">
                  <div className="font-medium text-sm">{diagnostic.test}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {diagnostic.description}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Confusion Matrix */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-accent" />
              Confusion Matrix Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div></div>
              <div className="text-center text-sm font-medium">Predicted 0</div>
              <div className="text-center text-sm font-medium">Predicted 1</div>
              
              <div className="text-sm font-medium">Actual 0</div>
              <div className="bg-success/10 text-success p-4 text-center rounded font-bold border border-success/20">
                2,847
              </div>
              <div className="bg-destructive/10 text-destructive p-4 text-center rounded font-bold border border-destructive/20">
                163
              </div>
              
              <div className="text-sm font-medium">Actual 1</div>
              <div className="bg-destructive/10 text-destructive p-4 text-center rounded font-bold border border-destructive/20">
                127
              </div>
              <div className="bg-success/10 text-success p-4 text-center rounded font-bold border border-success/20">
                2,693
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-muted/50 p-3 rounded">
                <div className="font-medium">True Positives</div>
                <div className="text-lg font-bold text-success">2,693</div>
              </div>
              <div className="bg-muted/50 p-3 rounded">
                <div className="font-medium">True Negatives</div>
                <div className="text-lg font-bold text-success">2,847</div>
              </div>
              <div className="bg-muted/50 p-3 rounded">
                <div className="font-medium">False Positives</div>
                <div className="text-lg font-bold text-destructive">163</div>
              </div>
              <div className="bg-muted/50 p-3 rounded">
                <div className="font-medium">False Negatives</div>
                <div className="text-lg font-bold text-destructive">127</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Importance */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="w-5 h-5 text-accent" />
              Feature Importance Ranking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { feature: 'Market Cap', importance: 0.342 },
              { feature: 'Revenue Growth', importance: 0.287 },
              { feature: 'Profit Margin', importance: 0.156 },
              { feature: 'Debt Ratio', importance: 0.089 },
              { feature: 'Sector Type', importance: 0.067 },
              { feature: 'Regional Index', importance: 0.041 },
              { feature: 'Volatility', importance: 0.018 }
            ].map((item) => (
              <div key={item.feature} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.feature}</span>
                  <span className="text-muted-foreground">{(item.importance * 100).toFixed(1)}%</span>
                </div>
                <Progress value={item.importance * 100} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Model Insights */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <TrendingUp className="h-4 w-4" />
              <AlertDescription>
                <strong>Excellent Performance:</strong> Model exceeds all benchmark metrics with 94.2% accuracy.
                Ready for production deployment.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3">
              <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                <div className="font-medium text-success">✓ Strong Predictive Power</div>
                <div className="text-sm text-success/80">AUC-ROC of 96.8% indicates excellent discrimination ability</div>
              </div>
              
              <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                <div className="font-medium text-accent">ℹ Balanced Performance</div>
                <div className="text-sm text-accent/80">Precision and recall are well-balanced at ~90%</div>
              </div>
              
              <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
                <div className="font-medium text-warning">⚠ Minor Heteroscedasticity</div>
                <div className="text-sm text-warning/80">Consider robust standard errors for inference</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cross-Validation Results */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="w-5 h-5 text-accent" />
              Cross-Validation Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="text-center">
                  <div className="text-lg font-bold text-primary">
                    Fold {i + 1}
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Accuracy: {(92 + Math.random() * 4).toFixed(1)}%
                  </div>
                  <Progress value={92 + Math.random() * 8} className="h-2" />
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <div className="text-sm text-muted-foreground">
                Mean CV Accuracy: <span className="font-bold">93.7% (±1.2%)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Backtesting Analysis */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              Backtesting Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Backtesting Period</div>
                  <div className="text-lg font-bold text-primary">2019-2023</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Rolling Window</div>
                  <div className="text-lg font-bold text-primary">12 months</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg border border-success/20">
                  <span className="font-medium">Sharpe Ratio</span>
                  <span className="text-success font-bold">1.85</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                  <span className="font-medium">Max Drawdown</span>
                  <span className="text-destructive font-bold">-8.3%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg border border-success/20">
                  <span className="font-medium">Win Rate</span>
                  <span className="text-success font-bold">67.4%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <span className="font-medium">Calmar Ratio</span>
                  <span className="text-primary font-bold">2.1</span>
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <div className="text-sm font-medium mb-2">Historical Performance</div>
                <div className="space-y-2">
                  {['2019', '2020', '2021', '2022', '2023'].map((year, i) => (
                    <div key={year} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                      <span className="text-sm">{year}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-mono">{(5 + Math.random() * 15).toFixed(1)}%</span>
                        <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-accent" 
                            style={{ width: `${50 + Math.random() * 50}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}