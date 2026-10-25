import React from 'react';
import { Camera, Incident } from '../types';
import { ShieldAlert, CheckCircle2, AlertTriangle, Video, MapPin, Building2, Activity, ArrowUpRight, Camera as CameraIcon } from 'lucide-react';

interface OverviewViewProps {
  cameras: Camera[];
  incidents: Incident[];
  onNavigateTab: (tab: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ cameras, incidents, onNavigateTab }) => {
  const totalCams = cameras.length;
  const onlineCams = cameras.filter(c => c.status === 'Online').length;
  const offlineCams = totalCams - onlineCams;

  const totalInc = incidents.length;
  const pendingInc = incidents.filter(i => i.status === 'Pending Review' || i.status === 'New').length;
  const verifiedInc = incidents.filter(i => i.status === 'Verified').length;
  const resolvedInc = incidents.filter(i => i.status === 'Resolved').length;

  // City breakdown
  const cityCounts: Record<string, { cameras: number; incidents: number; verified: number }> = {};
  cameras.forEach(c => {
    if (!cityCounts[c.city]) cityCounts[c.city] = { cameras: 0, incidents: 0, verified: 0 };
    cityCounts[c.city].cameras += 1;
  });
  incidents.forEach(i => {
    if (!cityCounts[i.city]) cityCounts[i.city] = { cameras: 0, incidents: 0, verified: 0 };
    cityCounts[i.city].incidents += 1;
    if (i.status === 'Verified') cityCounts[i.city].verified += 1;
  });

  // Category counts
  const categoryCounts: Record<string, number> = {};
  incidents.forEach(i => {
    categoryCounts[i.category] = (categoryCounts[i.category] || 0) + 1;
  });

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto text-slate-900">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-semibold border border-amber-500/30">
              MADHYA PRADESH POLICE COMMAND HQ — BHOPAL
            </span>
            <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-medium border border-emerald-500/30 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>75 City CCC Nodes Active</span>
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            SAFEGUARD Statewide Traffic & Incident Intelligence
          </h2>
          <p className="text-slate-300 text-sm max-w-3xl">
            Real-time optical video surveillance, YOLOv8 vehicle detection, ByteTrack trajectory analysis, and automated ANPR violation routing across urban Madhya Pradesh command centers.
          </p>
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => onNavigateTab('live_monitor')}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center space-x-2"
          >
            <Video className="w-4 h-4" />
            <span>Open Live AI Feed</span>
          </button>
          <button
            onClick={() => onNavigateTab('incident_review')}
            className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl font-semibold text-sm border border-white/20 transition-all flex items-center space-x-2"
          >
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>Review Alerts ({pendingInc})</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
          <div className="absolute right-4 top-4 bg-blue-50 p-3 rounded-xl border border-blue-100 text-blue-600">
            <CameraIcon className="w-6 h-6" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Configured Cameras</p>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-2">{totalCams}</h3>
          <div className="flex items-center space-x-2 mt-3 text-xs text-slate-600">
            <span className="text-emerald-600 font-semibold">{onlineCams} Online</span>
            <span>•</span>
            <span className="text-red-600 font-semibold">{offlineCams} Offline</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
          <div className="absolute right-4 top-4 bg-amber-50 p-3 rounded-xl border border-amber-100 text-amber-600">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Incidents Logged</p>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-2">{totalInc}</h3>
          <div className="flex items-center space-x-1.5 mt-3 text-xs text-amber-700 font-medium">
            <Activity className="w-3.5 h-3.5" />
            <span>Active multi-district ingestion</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
          <div className="absolute right-4 top-4 bg-red-50 p-3 rounded-xl border border-red-100 text-red-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Awaiting Review</p>
          <h3 className="text-3xl font-extrabold text-red-600 mt-2">{pendingInc}</h3>
          <div className="flex items-center space-x-1.5 mt-3 text-xs text-red-600 font-medium">
            <span>Pending officer adjudication</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
          <div className="absolute right-4 top-4 bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Verified Citations</p>
          <h3 className="text-3xl font-extrabold text-emerald-600 mt-2">{verifiedInc}</h3>
          <div className="flex items-center space-x-1.5 mt-3 text-xs text-emerald-700 font-medium">
            <span>{resolvedInc} Cases resolved</span>
          </div>
        </div>
      </div>

      {/* Two Columns: City Regional Status & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* City Nodes Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-amber-600" />
                <span>Madhya Pradesh City Command Nodes</span>
              </h3>
              <p className="text-xs text-slate-500">Live operational telemetry across key urban command clusters</p>
            </div>
            <button
              onClick={() => onNavigateTab('central_hub')}
              className="text-xs text-amber-600 hover:text-amber-700 flex items-center space-x-1 font-semibold"
            >
              <span>View Apex Map</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider bg-slate-50">
                  <th className="p-3 font-semibold rounded-l-lg">City / District</th>
                  <th className="p-3 font-semibold text-center">Active Cameras</th>
                  <th className="p-3 font-semibold text-center">Incidents</th>
                  <th className="p-3 font-semibold text-center">Verified</th>
                  <th className="p-3 font-semibold text-right rounded-r-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-xs">
                {Object.entries(cityCounts).map(([city, data]) => (
                  <tr key={city} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-3 font-sans font-semibold text-slate-900 flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      <span>{city}</span>
                    </td>
                    <td className="py-3.5 text-center text-slate-700">{data.cameras}</td>
                    <td className="py-3.5 text-center text-amber-600 font-bold">{data.incidents}</td>
                    <td className="py-3.5 text-center text-emerald-600">{data.verified}</td>
                    <td className="py-3.5 px-3 text-right font-sans">
                      <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-full text-[10px] font-semibold">
                        Operational
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Categorical Breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <span>Violation Categories</span>
            </h3>
            <p className="text-xs text-slate-500">Frequency distribution by rule violation</p>
          </div>

          <div className="space-y-4 font-sans">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const pct = totalInc > 0 ? Math.round((count / totalInc) * 100) : 0;
              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700">{cat}</span>
                    <span className="text-amber-700 font-mono font-bold">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
            <p className="font-semibold text-slate-900">💡 Compliance Note:</p>
            <p>
              All AI detections are flagged as pending review. Human oversight is mandatory prior to legal citation generation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
