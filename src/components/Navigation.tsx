import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Upload, 
  Database, 
  BarChart3, 
  Brain, 
  TrendingUp, 
  Download,
  Zap
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isDataUploaded: boolean;
}

const tabs = [
  {
    id: 'upload',
    name: 'Data Inception',
    description: 'Upload & Initialize',
    icon: Upload,
    enabled: true
  },
  {
    id: 'clean',
    name: 'Data Alchemy',
    description: 'Clean & Transform',
    icon: Database,
    enabled: false
  },
  {
    id: 'visualize',
    name: 'Neural Canvas',
    description: 'Visualize & Explore',
    icon: BarChart3,
    enabled: false
  },
  {
    id: 'model',
    name: 'Algorithmic Forge',
    description: 'Model & Predict',
    icon: Brain,
    enabled: false
  },
  {
    id: 'performance',
    name: 'Oracle Metrics',
    description: 'Analyze & Validate',
    icon: TrendingUp,
    enabled: false
  },
  {
    id: 'export',
    name: 'Data Codex',
    description: 'Export & Share',
    icon: Download,
    enabled: false
  }
];

export function Navigation({ activeTab, onTabChange, isDataUploaded }: NavigationProps) {
  return (
    <nav className="bg-card border-b border-border shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">QuantForge</h1>
              <p className="text-xs text-foreground">Advanced Data Analytics</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="hidden md:flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const enabled = tab.enabled || isDataUploaded;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => enabled && onTabChange(tab.id)}
                  disabled={!enabled}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2",
                    enabled
                      ? activeTab === tab.id
                        ? "bg-[hsl(220_100%_15%)] text-white shadow-elegant"
                        : "bg-[hsl(220_100%_20%)] text-white hover:bg-[hsl(220_100%_15%)] hover:shadow-sm"
                      : "bg-[hsl(220_50%_40%)] text-white/50 cursor-not-allowed"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <div className="text-left">
                    <div className="text-xs font-semibold">{tab.name}</div>
                    <div className="text-xs opacity-75">{tab.description}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Mobile menu - simplified for now */}
          <div className="md:hidden">
            <select
              value={activeTab}
              onChange={(e) => onTabChange(e.target.value)}
              className="bg-background border border-border rounded-lg px-3 py-2 text-sm"
            >
              {tabs.map((tab) => (
                <option 
                  key={tab.id} 
                  value={tab.id}
                  disabled={!tab.enabled && !isDataUploaded}
                >
                  {tab.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
}