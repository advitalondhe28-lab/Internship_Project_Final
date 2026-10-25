import React from 'react';
import { AuditLogItem } from '../types';
import { FileText, Shield, Lock, Terminal, Download } from 'lucide-react';

interface AnalyticsViewProps {
  auditLogs: AuditLogItem[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ auditLogs }) => {
  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto text-slate-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <FileText className="w-6 h-6 text-amber-600" />
            <span>Forensic Auditing & Chain of Custody</span>
          </h2>
          <p className="text-slate-600 text-sm">
            Immutable system audit logs tracking user sessions, evidence access, and adjudication actions.
          </p>
        </div>

        <button
          onClick={() => alert('Audit log export initiated. Secure CSV generated.')}
          className="bg-white hover:bg-slate-50 text-slate-800 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 shadow-sm transition-all flex items-center space-x-2"
        >
          <Download className="w-4 h-4 text-amber-600" />
          <span>Export Audit Trail (CSV)</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center space-x-2 text-sm font-bold text-slate-900">
            <Terminal className="w-4 h-4 text-cyan-600" />
            <span>System Audit Transactions</span>
          </div>
          <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded font-mono border border-slate-200">
            {auditLogs.length} Records Logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider bg-slate-50">
                <th className="p-3 font-semibold rounded-l-lg">Timestamp</th>
                <th className="p-3 font-semibold">Operator / User</th>
                <th className="p-3 font-semibold">Action</th>
                <th className="p-3 font-semibold">Resource</th>
                <th className="p-3 font-semibold">IP Address</th>
                <th className="p-3 font-semibold rounded-r-lg">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-3 text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="py-3.5 px-3 text-slate-900 font-bold">{log.username}</td>
                  <td className="py-3.5 px-3 text-amber-700 font-bold">{log.action}</td>
                  <td className="py-3.5 px-3 text-cyan-700">{log.resource}</td>
                  <td className="py-3.5 px-3 text-slate-700">{log.ipAddress}</td>
                  <td className="py-3.5 px-3 text-slate-700 font-sans">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
