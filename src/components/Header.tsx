import React from 'react';
import { Shield, Radio, Bell, User as UserIcon, Lock } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  currentUser: UserProfile;
  activeIncidentsCount: number;
  onOpenNewCamera: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentUser, activeIncidentsCount }) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 px-6 py-3.5 flex items-center justify-between sticky top-0 z-50 shadow-md">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="bg-amber-500/20 p-2 rounded-xl border border-amber-500/30 flex items-center justify-center">
            <Shield className="w-7 h-7 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-lg tracking-wide text-white">
                SAFEGUARD
              </h1>
              <span className="text-xs bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded-full border border-amber-500/30">
                MP POLICE CENTRAL HQ
              </span>
            </div>
            <p className="text-xs text-slate-300">
              AI-Powered Traffic Monitoring & Incident Management System (75 City CCCs)
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        {/* System Node Telemetry */}
        <div className="hidden lg:flex items-center space-x-4 text-xs bg-slate-800 px-3.5 py-1.5 rounded-lg border border-slate-700">
          <div className="flex items-center space-x-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-200 font-medium">Bhopal Core: Online</span>
          </div>
          <div className="h-3 w-[1px] bg-slate-700"></div>
          <div className="flex items-center space-x-1.5 text-slate-200">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>Connected CCCs: <strong className="text-white">75 / 75</strong></span>
          </div>
        </div>

        {/* Active Alerts Pill */}
        <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded-lg text-red-400 text-xs font-medium">
          <Bell className="w-4 h-4 animate-pulse" />
          <span>{activeIncidentsCount} Pending Review</span>
        </div>

        {/* User Profile Info */}
        <div className="flex items-center space-x-3 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold text-xs">
            <UserIcon className="w-4 h-4" />
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-white">{currentUser.fullName}</p>
            <p className="text-[10px] text-amber-400 flex items-center space-x-1">
              <Lock className="w-2.5 h-2.5 inline mr-0.5" />
              <span>{currentUser.role} ({currentUser.badgeNumber})</span>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
