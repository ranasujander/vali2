import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Download, 
  FileText, 
  Image, 
  Table, 
  BarChart3,
  FileSpreadsheet,
  Presentation,
  BookOpen,
  CheckCircle2,
  Zap
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

interface ExportResultsProps {
  uploadedData?: ParsedData | null;
}

export function ExportResults({ uploadedData }: ExportResultsProps) {
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const exportSections = [
    { id: 'summary', name: 'Executive Summary', description: 'High-level findings and recommendations', icon: BookOpen },
    { id: 'data_profile', name: 'Data Profile Report', description: 'Dataset overview and quality metrics', icon: Table },
    { id: 'cleaning', name: 'Data Cleaning Log', description: 'Transformation steps and impact analysis', icon: Zap },
    { id: 'visualizations', name: 'Visualization Gallery', description: 'All generated charts and plots', icon: BarChart3 },
    { id: 'models', name: 'Model Performance', description: 'Algorithm results and comparisons', icon: Presentation },
    { id: 'diagnostics', name: 'Diagnostic Tests', description: 'Statistical validation results', icon: CheckCircle2 },
    { id: 'appendix', name: 'Technical Appendix', description: 'Detailed methodology and code', icon: FileText }
  ];

  const exportFormats = [
    { value: 'docx', name: 'Microsoft Word (.docx)', icon: FileText, description: 'Comprehensive formatted report' },
    { value: 'pdf', name: 'PDF Report (.pdf)', icon: FileText, description: 'Publication-ready document' },
    { value: 'pptx', name: 'PowerPoint (.pptx)', icon: Presentation, description: 'Presentation slides' },
    { value: 'xlsx', name: 'Excel Workbook (.xlsx)', icon: FileSpreadsheet, description: 'Data tables and metrics' },
    { value: 'html', name: 'Interactive HTML', icon: Image, description: 'Web-based dashboard' }
  ];

  const handleExport = () => {
    setIsExporting(true);
    setExportProgress(0);
    
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          // Simulate download
          const filename = `DataForge_Report_${new Date().toISOString().split('T')[0]}`;
          const extension = exportFormats.find(f => f.value === exportFormat)?.value || 'docx';
          const link = document.createElement('a');
          link.href = '#'; // In real implementation, this would be the file URL
          link.download = `${filename}.${extension}`;
          // link.click(); // Commented out to avoid actual download in demo
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const getSectionIcon = (iconComponent: React.ComponentType<any>) => {
    return React.createElement(iconComponent, { className: "w-5 h-5 text-accent" });
  };

  const getFormatIcon = (iconComponent: React.ComponentType<any>) => {
    return React.createElement(iconComponent, { className: "w-4 h-4" });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Data Codex Archive</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Generate comprehensive reports and export your analytical insights in professional formats
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Selection */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-accent" />
              Report Sections
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedSections(exportSections.map(s => s.id))}
              >
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedSections([])}
              >
                Clear All
              </Button>
            </div>
            
            {exportSections.map((section) => (
              <div key={section.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/20">
                <Checkbox 
                  id={section.id}
                  checked={selectedSections.includes(section.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedSections([...selectedSections, section.id]);
                    } else {
                      setSelectedSections(selectedSections.filter(s => s !== section.id));
                    }
                  }}
                />
                <div className="flex items-start gap-3 flex-1">
                  {getSectionIcon(section.icon)}
                  <div className="space-y-1">
                    <label htmlFor={section.id} className="text-sm font-medium leading-none cursor-pointer">
                      {section.name}
                    </label>
                    <p className="text-xs text-muted-foreground">{section.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Export Configuration */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-accent" />
              Export Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">Output Format</label>
              {exportFormats.map((format) => (
                <div
                  key={format.value}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                    exportFormat === format.value
                      ? 'border-accent bg-accent/10'
                      : 'border-border hover:border-accent/50'
                  }`}
                  onClick={() => setExportFormat(format.value)}
                >
                  <div className="flex items-center gap-3">
                    {getFormatIcon(format.icon)}
                    <div className="flex-1">
                      <div className="font-medium text-sm">{format.name}</div>
                      <div className="text-xs text-muted-foreground">{format.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Report Template</label>
              <Select defaultValue="executive">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="executive">Executive Summary</SelectItem>
                  <SelectItem value="technical">Technical Deep Dive</SelectItem>
                  <SelectItem value="presentation">Presentation Format</SelectItem>
                  <SelectItem value="custom">Custom Template</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Chart Resolution</label>
              <Select defaultValue="high">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard (72 DPI)</SelectItem>
                  <SelectItem value="high">High Quality (300 DPI)</SelectItem>
                  <SelectItem value="print">Print Ready (600 DPI)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Export Status */}
        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle>Export Progress</CardTitle>
          </CardHeader>
          <CardContent>
            {isExporting ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-accent animate-pulse" />
                  <span className="font-medium">Generating report...</span>
                </div>
                <Progress value={exportProgress} className="w-full" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className={`p-2 rounded ${exportProgress > 20 ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground'}`}>
                    ✓ Compiling Data
                  </div>
                  <div className={`p-2 rounded ${exportProgress > 40 ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground'}`}>
                    ✓ Generating Charts
                  </div>
                  <div className={`p-2 rounded ${exportProgress > 70 ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground'}`}>
                    ✓ Formatting Document
                  </div>
                  <div className={`p-2 rounded ${exportProgress > 95 ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground'}`}>
                    ✓ Finalizing Export
                  </div>
                </div>
              </div>
            ) : exportProgress === 100 ? (
              <div className="text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-success mx-auto" />
                <div>
                  <p className="font-medium text-success text-lg">Export Complete!</p>
                  <p className="text-sm text-muted-foreground">
                    Your report has been generated and is ready for download.
                  </p>
                </div>
                <div className="flex gap-2 justify-center">
                  <Button variant="accent">
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                  <Button variant="outline" onClick={() => setExportProgress(0)}>
                    Generate Another
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Alert>
                  <AlertDescription>
                    <strong>Ready to Export:</strong> {selectedSections.length} section(s) selected in {exportFormats.find(f => f.value === exportFormat)?.name || 'no format selected'}.
                  </AlertDescription>
                </Alert>
                
                <div className="text-center">
                  <Button
                    onClick={handleExport}
                    disabled={selectedSections.length === 0 || !exportFormat}
                    variant="accent"
                    className="px-8"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Generate Report Archive
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Estimated generation time: {Math.ceil(selectedSections.length * 2)} seconds
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}