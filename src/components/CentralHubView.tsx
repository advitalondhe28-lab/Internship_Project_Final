import React from 'react';
import { Camera, Incident } from '../types';
import { Globe2, Building2, ShieldAlert, CheckCircle2, AlertTriangle, Radio, MapPin, ArrowUpRight } from 'lucide-react';

interface CentralHubViewProps {
  cameras: Camera[];
  incidents: Incident[];
}

export const CentralHubView: React.FC<CentralHubViewProps> = ({ cameras, incidents }) => {
  const mpCities = [
    { name: 'Bhopal', code: 'MP-04', center: 'Roshanpura Central CCC', status: 'Online', personnel: 42 },
    { name: 'Indore', code: 'MP-09', center: 'AICTSL Palasia CCC', status: 'Online', personnel: 58 },
    { name: 'Gwalior', code: 'MP-07', center: 'Maharaj Bada Smart City CCC', status: 'Online', personnel: 35 },
    { name: 'Jabalpur', code: 'MP-20', center: 'Russell Chowk CCC', status: 'Online', personnel: 30 },
    { name: 'Ujjain', code: 'MP-13', center: 'Mahakal Kshipra CCC', status: 'Online', personnel: 25 },
    { name: 'Sagar', code: 'MP-15', center: 'Civil Lines CCC', status: 'Online', personnel: 18 },
    { name: 'Rewa', code: 'MP-17', center: 'Sirmaour Square CCC', status: 'Online', personnel: 15 },
    { name: 'Satna', code: 'MP-19', center: 'Circuit House CCC', status: 'Online', personnel: 14 }
  ];

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto text-slate-900">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold border border-indigo-500/30">
              CENTRAL APEX MONITORING — BHOPAL HEADQUARTERS
            </span>
            <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-medium border border-emerald-500/30 flex items-center space-x-1">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>Multi-City Gateway Synced</span>
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            SAFEGUARD Statewide Apex Operations Hub
          </h2>
          <p className="text-slate-300 text-sm max-w-3xl">
            Aggregating telemetry, live violation alerts, and evidence archives from 75 urban Madhya Pradesh command nodes into the central Bhopal server.
          </p>
        </div>

        <div className="bg-white/10 border border-white/20 p-4 rounded-xl text-center shrink-0">
          <p className="text-xs text-slate-300">Total Statewide Nodes</p>
          <p className="text-2xl font-black text-amber-400 font-mono mt-0.5">75 CCCs</p>
        </div>
      </div>

      {/* City Nodes Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-amber-600" />
            <span>Madhya Pradesh City Command Centre Status</span>
          </h3>
          <p className="text-xs text-slate-500">Showing primary regional hubs connected to Bhopal Central</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {mpCities.map((city) => {
            const cityCams = cameras.filter(c => c.city === city.name).length;
            const cityIncs = incidents.filter(i => i.city === city.name).length;

            return (
              <div key={city.code} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs bg-slate-100 text-amber-700 px-2.5 py-1 rounded-lg border border-slate-200 font-bold">
                    {city.code}
                  </span>
                  <span className="flex items-center space-x-1.5 text-xs text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>{city.status}</span>
                  </span>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-slate-900">{city.name} Command Centre</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{city.center}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center font-mono">
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <p className="text-[10px] text-slate-500">Cams</p>
                    <p className="text-sm font-bold text-slate-900">{cityCams}</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <p className="text-[10px] text-slate-500">Alerts</p>
                    <p className="text-sm font-bold text-amber-600">{cityIncs}</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <p className="text-[10px] text-slate-500">Staff</p>
                    <p className="text-sm font-bold text-cyan-700">{city.personnel}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
