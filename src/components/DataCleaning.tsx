import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { 
  Wand2, 
  Filter, 
  TrendingUp, 
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Sparkles
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

interface DataCleaningProps {
  uploadedData?: ParsedData | null;
}

export function DataCleaning({ uploadedData }: DataCleaningProps) {
  const [cleaningProgress, setCleaningProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState([2010, 2025]);
  const [selectedOutlierMethod, setSelectedOutlierMethod] = useState<string>('iqr');
  const { toast } = useToast();

  const cleaningOptions = [
    { id: 'missing', label: 'Handle Missing Values', description: 'Remove or impute missing data' },
    { id: 'outliers', label: 'Outlier Detection', description: 'Identify and handle statistical outliers' },
    { id: 'duplicates', label: 'Remove Duplicates', description: 'Eliminate duplicate records' },
    { id: 'normalize', label: 'Data Normalization', description: 'Standardize numerical values' },
    { id: 'encoding', label: 'Categorical Encoding', description: 'Convert categorical data to numerical' }
  ];

  const imputationMethods = [
    { value: 'mean', label: 'Mean Imputation' },
    { value: 'median', label: 'Median Imputation' },
    { value: 'mode', label: 'Mode Imputation' },
    { value: 'forward', label: 'Forward Fill' },
    { value: 'backward', label: 'Backward Fill' },
    { value: 'interpolate', label: 'Linear Interpolation' }
  ];

  const outlierMethods = [
    { value: 'iqr', label: 'IQR Method' },
    { value: 'zscore', label: 'Z-Score Method' },
    { value: 'isolation', label: 'Isolation Forest' },
    { value: 'lof', label: 'Local Outlier Factor' }
  ];

  const handleProcessData = () => {
    setIsProcessing(true);
    setCleaningProgress(0);
    
    const interval = setInterval(() => {
      setCleaningProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          return 100;
        }
        return prev + 12.5;
      });
    }, 400);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Data Alchemy Laboratory</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Transform raw data into analytical gold through advanced cleaning and preprocessing techniques
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Data Quality Overview */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              Data Quality Index
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completeness</span>
                <span className="font-medium">87%</span>
              </div>
              <Progress value={87} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Validity</span>
                <span className="font-medium">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Consistency</span>
                <span className="font-medium">78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            <div className="flex gap-2 mt-4">
              <Badge variant="secondary">3,247 missing values</Badge>
              <Badge variant="destructive">127 outliers</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Cleaning Operations */}
        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-accent" />
              Transformation Protocols
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cleaningOptions.map((option) => (
                <div key={option.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                  <Checkbox 
                    id={option.id}
                    checked={selectedFilters.includes(option.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedFilters([...selectedFilters, option.id]);
                      } else {
                        setSelectedFilters(selectedFilters.filter(f => f !== option.id));
                      }
                    }}
                  />
                  <div className="space-y-1">
                    <label htmlFor={option.id} className="text-sm font-medium leading-none cursor-pointer">
                      {option.label}
                    </label>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Advanced Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-3">
                <label className="text-sm font-medium">Missing Value Strategy</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select imputation method" />
                  </SelectTrigger>
                  <SelectContent>
                    {imputationMethods.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium">Outlier Detection</label>
                <Select value={selectedOutlierMethod} onValueChange={setSelectedOutlierMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select outlier method" />
                  </SelectTrigger>
                  <SelectContent>
                    {outlierMethods.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Temporal Filtering */}
        <Card className="shadow-card lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-accent" />
              Temporal Slice Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Date Range Filter</label>
                <span className="text-sm text-muted-foreground">
                  {dateRange[0]} - {dateRange[1]}
                </span>
              </div>
              <Slider
                value={dateRange}
                onValueChange={setDateRange}
                min={2000}
                max={2025}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>2000</span>
                <span>2025</span>
              </div>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Filtering will reduce dataset from 15,432 to approximately {Math.floor(15432 * (dateRange[1] - dateRange[0]) / 25)} records
                based on the selected date range.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Processing Status */}
        <Card className="shadow-card lg:col-span-3">
          <CardContent className="pt-6">
            {isProcessing ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-accent animate-pulse" />
                  <span className="font-medium">Processing transformation protocols...</span>
                </div>
                <Progress value={cleaningProgress} className="w-full" />
                <p className="text-sm text-muted-foreground text-center">
                  {cleaningProgress}% complete - Applying {selectedFilters.length} transformation(s)
                </p>
              </div>
            ) : cleaningProgress === 100 ? (
              <div className="text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-success mx-auto" />
                <p className="font-medium text-success">Data transformation complete!</p>
                <p className="text-sm text-muted-foreground">
                  Dataset ready for visualization and modeling
                </p>
              </div>
            ) : (
              <div className="text-center">
                <Button 
                  onClick={handleProcessData}
                  disabled={selectedFilters.length === 0}
                  variant="accent"
                  className="px-8"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Execute Transformation Sequence
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  {selectedFilters.length} operation(s) selected
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}