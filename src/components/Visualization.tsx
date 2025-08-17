import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Plot from 'react-plotly.js';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  ScatterChart, 
  Map,
  Box,
  TrendingUp,
  Layers3,
  Palette
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

interface VisualizationProps {
  uploadedData?: ParsedData | null;
}

export function Visualization({ uploadedData }: VisualizationProps) {
  const [figure, setFigure] = useState<any | null>(null);
  const [xField, setXField] = useState<string>('');
  const [yField, setYField] = useState<string>('');
  const [agg, setAgg] = useState<string>('sum');
  const { toast } = useToast();
  const [selectedChart, setSelectedChart] = useState('bar');
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');

  const chartTypes = [
    { id: 'bar', name: 'Bar Chart', icon: BarChart3, category: 'basic' },
    { id: 'line', name: 'Line Chart', icon: LineChart, category: 'basic' },
    { id: 'scatter', name: 'Scatter Plot', icon: ScatterChart, category: 'basic' },
    { id: 'pie', name: 'Pie Chart', icon: PieChart, category: 'basic' },
    { id: 'box', name: 'Box Plot', icon: Box, category: 'advanced' },
    { id: 'violin', name: 'Violin Plot', icon: TrendingUp, category: 'advanced' },
    { id: 'bubble', name: 'Bubble Chart', icon: ScatterChart, category: 'advanced' },
    { id: 'heatmap', name: 'Heatmap', icon: Layers3, category: 'advanced' },
    { id: 'geo', name: 'Geospatial', icon: Map, category: 'spatial' },
    { id: '3d', name: '3D Surface', icon: Layers3, category: 'dimensional' },
    { id: '4d', name: '4D Scatter', icon: Layers3, category: 'dimensional' }
  ];

  const availableColumns = (uploadedData?.columns || [
    'revenue', 'profit_margin', 'market_cap', 'sector', 'region', 
    'year', 'quarter', 'rating', 'risk_score', 'volatility'
  ]).filter(col => col && col.trim() !== '');

  const categoryColors = {
    basic: 'bg-blue-100 text-blue-800',
    advanced: 'bg-accent/20 text-accent',
    spatial: 'bg-green-100 text-green-800',
    dimensional: 'bg-purple-100 text-purple-800'
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Neural Canvas Studio</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Create stunning visualizations with AI-powered insights and interactive data exploration
        </p>
      </div>

      <Tabs defaultValue="builder" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="builder">Chart Builder</TabsTrigger>
          <TabsTrigger value="gallery">Visualization Gallery</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Chart Type Selection */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-accent" />
                  Chart Types
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(
                  chartTypes.reduce((acc, chart) => {
                    if (!acc[chart.category]) acc[chart.category] = [];
                    acc[chart.category].push(chart);
                    return acc;
                  }, {} as Record<string, typeof chartTypes>)
                ).map(([category, charts]) => (
                  <div key={category} className="space-y-2">
                    <Badge className={categoryColors[category as keyof typeof categoryColors]}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Badge>
                    <div className="space-y-1">
                      {charts.map((chart) => {
                        const Icon = chart.icon;
                        return (
                          <Button
                            key={chart.id}
                            variant={selectedChart === chart.id ? "default" : "ghost"}
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => setSelectedChart(chart.id)}
                          >
                            <Icon className="w-4 h-4 mr-2" />
                            {chart.name}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Configuration Panel */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Chart Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">X-Axis</label>
                  <Select value={xAxis} onValueChange={setXAxis}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select X variable" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableColumns.map((col) => (
                        <SelectItem key={col} value={col}>
                          {col.replace('_', ' ').toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Y-Axis</label>
                  <Select value={yAxis} onValueChange={setYAxis}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Y variable" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableColumns.map((col) => (
                        <SelectItem key={col} value={col}>
                          {col.replace('_', ' ').toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Group By</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Optional grouping" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sector">Sector</SelectItem>
                      <SelectItem value="region">Region</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full" variant="accent"> onClick={async ()=>{ try { const backendPath = (window as any).__UPLOADED_FILE_PATH__; if (!backendPath) { toast({variant:"destructive", title:"No file on server", description:"Please upload a file first."}); return; } const res = await api.task("neural-canvas", { file_path: backendPath, params: { chart_type: selectedChart, x: xField, y: yField, agg } }); const fig = (res as any)?.output?.figure || (res as any)?.figure || (res as any)?.output; setFigure(fig); } catch(e:any){ toast({variant:"destructive", title:"Visualization failed", description: e.message}); } }}>
                  Generate Visualization
                </Button>
              </CardContent>
            </Card>

            {/* Chart Preview */}
            <Card className="shadow-card lg:col-span-2">
              <CardHeader>
                <CardTitle>Preview Canvas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted/20 rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 mx-auto gradient-accent rounded-full flex items-center justify-center">
                      {React.createElement(
                        chartTypes.find(c => c.id === selectedChart)?.icon || BarChart3,
                        { className: "w-8 h-8 text-accent-foreground" }
                      )}
                    </div>
                    <p className="text-lg font-medium">
                      {chartTypes.find(c => c.id === selectedChart)?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Configure axes and click generate to create visualization
                    </p>
                    {figure && (
                      <div className="mt-6">
                        <Plot data={figure.data || []} layout={figure.layout || { title: 'Chart' }} style={{width:'100%', height:'500px'}} />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="gallery">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="shadow-card">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-t-lg"></div>
                  <div className="p-4">
                    <h3 className="font-medium">Sample Visualization {i + 1}</h3>
                    <p className="text-sm text-muted-foreground">
                      Interactive chart example
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>AI-Powered Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-accent/10 rounded-lg">
                  <p className="font-medium text-accent">💡 Pattern Recognition</p>
                  <p className="text-sm mt-1">Strong correlation detected between market_cap and revenue (r=0.87)</p>
                </div>
                <div className="p-4 bg-warning/10 rounded-lg">
                  <p className="font-medium text-warning">⚠️ Anomaly Detection</p>
                  <p className="text-sm mt-1">Unusual volatility spike in Q3 2023 data requires investigation</p>
                </div>
                <div className="p-4 bg-success/10 rounded-lg">
                  <p className="font-medium text-success">📈 Trend Analysis</p>
                  <p className="text-sm mt-1">Positive growth trend identified across all sectors (15% YoY average)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}