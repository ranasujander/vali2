import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { FileUpload } from '@/components/FileUpload';
import { DataCleaning } from '@/components/DataCleaning';
import { Visualization } from '@/components/Visualization';
import { MachineLearning } from '@/components/MachineLearning';
import { PerformanceAnalysis } from '@/components/PerformanceAnalysis';
import { ExportResults } from '@/components/ExportResults';

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

const Index = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [isDataUploaded, setIsDataUploaded] = useState(false);
  const [uploadedData, setUploadedData] = useState<ParsedData | null>(null);

  const handleDataUploaded = (data: ParsedData) => {
    setUploadedData(data);
    setIsDataUploaded(true);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'upload':
        return <FileUpload onDataUploaded={handleDataUploaded} />;
      case 'clean':
        return <DataCleaning uploadedData={uploadedData} />;
      case 'visualize':
        return <Visualization uploadedData={uploadedData} />;
      case 'model':
        return <MachineLearning uploadedData={uploadedData} />;
      case 'performance':
        return <PerformanceAnalysis uploadedData={uploadedData} />;
      case 'export':
        return <ExportResults uploadedData={uploadedData} />;
      default:
        return <FileUpload onDataUploaded={handleDataUploaded} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        isDataUploaded={isDataUploaded}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-in fade-in duration-500">
          {renderTabContent()}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              © 2024 Validatron. Advanced Data Analytics Platform.
            </div>
            <div className="text-sm text-muted-foreground">
              Advanced Analytics • Machine Learning • Data Science
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
