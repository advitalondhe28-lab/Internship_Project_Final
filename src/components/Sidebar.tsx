import React from 'react';
import { LayoutDashboard, Video, ShieldAlert, Globe2, FileText, PlusCircle, Camera } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  camerasCount: number;
  pendingReviewCount: number;
  onOpenNewCamera: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  camerasCount,
  pendingReviewCount,
  onOpenNewCamera
}) => {
  const navItems = [
    {
      id: 'overview',
      label: '1. Executive Overview',
      icon: LayoutDashboard,
      description: 'Statewide command telemetry'
    },
    {
      id: 'live_monitor',
      label: '2. Live Edge AI Monitor',
      icon: Video,
      description: 'YOLOv8 + ByteTrack streams',
      badge: 'Live'
    },
    {
      id: 'incident_review',
      label: '3. Incident Review & Workflow',
      icon: ShieldAlert,
      description: 'Verify, reject & cite',
      count: pendingReviewCount
    },
    {
      id: 'central_hub',
      label: '4. Bhopal Central SAFEGUARD Hub',
      icon: Globe2,
      description: 'Multi-district MP aggregation'
    },
    {
      id: 'analytics',
      label: '5. Forensic Analytics & Audit',
      icon: FileText,
      description: 'Immutable chain of custody'
    }
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 min-h-[calc(100vh-65px)] shadow-sm">
      <div className="p-4 space-y-2">
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Command Modules
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-start space-x-3 px-3.5 py-3 rounded-xl transition-all text-left group relative ${
                  isActive
                    ? 'bg-amber-50 text-slate-900 border border-amber-300 shadow-sm font-medium'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className={`p-2 rounded-lg mt-0.5 transition-colors ${
                  isActive ? 'bg-amber-500 text-white font-bold' : 'bg-slate-100 text-slate-500 group-hover:text-amber-600'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 border border-emerald-300 px-1.5 py-0.5 rounded font-mono animate-pulse">
                        {item.badge}
                      </span>
                    )}
                    {typeof item.count === 'number' && item.count > 0 && (
                      <span className="text-[10px] bg-red-100 text-red-700 border border-red-300 px-1.5 py-0.5 rounded-full font-bold">
                        {item.count}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{item.description}</p>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-200 space-y-3 bg-slate-50">
        <button
          onClick={onOpenNewCamera}
          className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-slate-100 text-slate-800 py-2.5 px-3 rounded-xl border border-slate-300 transition-colors text-xs font-semibold shadow-sm"
        >
          <PlusCircle className="w-4 h-4 text-amber-600" />
          <span>Configure CCTV Source</span>
        </button>

        <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between text-slate-600">
            <span>Active Camera Nodes:</span>
            <span className="text-emerald-600 font-mono font-bold">{camerasCount}</span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span>System Architecture:</span>
            <span className="text-slate-800 font-mono">FastAPI + React</span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span>Model Engine:</span>
            <span className="text-amber-700 font-mono">YOLOv8 + ByteTrack</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
