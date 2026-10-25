import React, { useState } from 'react';
import { Incident, IncidentStatus } from '../types';
import { ShieldAlert, Search, Filter, CheckCircle2, XCircle, Clock, FileText, UserCheck, AlertCircle, ExternalLink } from 'lucide-react';

interface IncidentReviewViewProps {
  incidents: Incident[];
  onUpdateIncidentStatus: (incidentId: string, newStatus: IncidentStatus, notes: string, assignedTeam: string) => void;
}

export const IncidentReviewView: React.FC<IncidentReviewViewProps> = ({ incidents, onUpdateIncidentStatus }) => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(incidents[0]?.id || null);

  const [notesInput, setNotesInput] = useState<Record<string, string>>({});
  const [teamInput, setTeamInput] = useState<Record<string, string>>({});

  const cities = Array.from(new Set(incidents.map(i => i.city)));

  const filteredIncidents = incidents.filter(inc => {
    if (selectedStatusFilter !== 'ALL' && inc.status !== selectedStatusFilter) return false;
    if (selectedCityFilter !== 'ALL' && inc.city !== selectedCityFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchNum = inc.incidentNumber.toLowerCase().includes(q);
      const matchPlate = (inc.registrationPlate || '').toLowerCase().includes(q);
      const matchCam = inc.cameraName.toLowerCase().includes(q);
      if (!matchNum && !matchPlate && !matchCam) return false;
    }
    return true;
  });

  const handleAction = (incId: string, status: IncidentStatus) => {
    const notes = notesInput[incId] || 'Reviewed by authorized personnel via SAFEGUARD command console.';
    const team = teamInput[incId] || 'MP State Highway Patrol';
    onUpdateIncidentStatus(incId, status, notes, team);
  };

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto text-slate-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <ShieldAlert className="w-6 h-6 text-amber-600" />
            <span>Incident Review & Case Adjudication Workflow</span>
          </h2>
          <p className="text-slate-600 text-sm">
            All automated AI detections are marked as <strong className="text-amber-700">Potential Violation — Pending Review</strong> until verified.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search ID, plate, camera..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-300 text-slate-900 pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:border-amber-500 w-64 shadow-sm"
            />
          </div>

          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="bg-white border border-slate-300 text-slate-900 px-4 py-2 rounded-xl text-sm focus:outline-none focus:border-amber-500 shadow-sm font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="New">New</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Verified">Verified</option>
            <option value="Rejected">Rejected</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select
            value={selectedCityFilter}
            onChange={(e) => setSelectedCityFilter(e.target.value)}
            className="bg-white border border-slate-300 text-slate-900 px-4 py-2 rounded-xl text-sm focus:outline-none focus:border-amber-500 shadow-sm font-medium"
          >
            <option value="ALL">All MP Cities</option>
            {cities.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Incidents List / Accordion */}
      <div className="space-y-4">
        {filteredIncidents.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 space-y-3 shadow-sm">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
            <p className="text-lg font-medium text-slate-900">No matching incident records found</p>
            <p className="text-xs">Adjust your filter criteria or simulate new detections in Live Edge AI View.</p>
          </div>
        ) : (
          filteredIncidents.map((inc) => {
            const isExpanded = expandedId === inc.id;
            const statusColor = 
              inc.status === 'Verified' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
              inc.status === 'Rejected' ? 'bg-red-100 text-red-800 border-red-300' :
              inc.status === 'Resolved' ? 'bg-blue-100 text-blue-800 border-blue-300' :
              'bg-amber-100 text-amber-800 border-amber-300';

            return (
              <div
                key={inc.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all"
              >
                {/* Header row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : inc.id)}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                      <ShieldAlert className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3">
                        <span className="font-mono font-bold text-slate-900 text-base">{inc.incidentNumber}</span>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${statusColor}`}>
                          {inc.status}
                        </span>
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono border border-slate-200">
                          {inc.city}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Camera: <strong className="text-slate-800">{inc.cameraName}</strong> ({inc.cameraId}) • Category: <strong className="text-amber-700">{inc.category}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-xs text-slate-600 font-mono">
                    <div>
                      <span>Confidence: </span>
                      <strong className="text-emerald-700">{(inc.confidence * 100).toFixed(1)}%</strong>
                    </div>
                    <div>
                      <span>Plate: </span>
                      <strong className="text-amber-800">{inc.registrationPlate || 'Uncertain'}</strong>
                    </div>
                    <div>
                      <span>{new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>

                {/* Expanded Details & Adjudication Panel */}
                {isExpanded && (
                  <div className="border-t border-slate-200 p-6 bg-slate-50 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Evidence Images */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Scene Evidence Snapshot</p>
                        <div className="rounded-xl overflow-hidden border border-slate-200 bg-white aspect-video shadow-xs">
                          <img
                            src={inc.evidenceImagePath}
                            alt="Evidence Snapshot"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {inc.plateImagePath && (
                        <div>
                          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">ANPR License Plate Crop</p>
                          <div className="rounded-xl overflow-hidden border border-slate-200 bg-white h-24 w-48 shadow-xs">
                            <img
                              src={inc.plateImagePath}
                              alt="Plate Crop"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Metadata & Details */}
                    <div className="space-y-4 text-xs text-slate-700 font-mono">
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider font-sans">Forensic Metadata</p>
                      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2.5 shadow-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Vehicle Class:</span>
                          <span className="text-slate-900 font-bold uppercase">{inc.vehicleClass}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">ByteTrack ID:</span>
                          <span className="text-amber-700 font-bold">#{inc.trackId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">OCR Confidence:</span>
                          <span className="text-emerald-700 font-bold">{(inc.ocrConfidence ? inc.ocrConfidence * 100 : 0).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Detection Method:</span>
                          <span className="text-slate-800">{inc.detectionMethod}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block mb-1">SHA-256 Evidence Checksum:</span>
                          <span className="text-[10px] text-slate-600 break-all bg-slate-100 p-2 rounded block font-mono border border-slate-200">
                            {inc.evidenceHash}
                          </span>
                        </div>
                      </div>

                      <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-amber-900 font-sans">
                        <p className="font-semibold">AI Notes:</p>
                        <p className="mt-0.5 text-slate-700">{inc.notes || 'No notes provided.'}</p>
                      </div>
                    </div>

                    {/* Adjudication Controls */}
                    <div className="space-y-4 font-sans">
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Reviewer Adjudication</p>

                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-slate-600 block mb-1 font-medium">Assigned Enforcement Unit</label>
                          <input
                            type="text"
                            value={teamInput[inc.id] !== undefined ? teamInput[inc.id] : (inc.assignedTeam || 'MP Traffic Flying Squad')}
                            onChange={(e) => setTeamInput({ ...teamInput, [inc.id]: e.target.value })}
                            className="w-full bg-white border border-slate-300 text-slate-900 px-3.5 py-2 rounded-xl text-xs focus:outline-none focus:border-amber-500 shadow-xs"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-slate-600 block mb-1 font-medium">Investigation Notes & Citation Log</label>
                          <textarea
                            rows={3}
                            placeholder="Add case notes or rejection rationale..."
                            value={notesInput[inc.id] !== undefined ? notesInput[inc.id] : ''}
                            onChange={(e) => setNotesInput({ ...notesInput, [inc.id]: e.target.value })}
                            className="w-full bg-white border border-slate-300 text-slate-900 p-3 rounded-xl text-xs focus:outline-none focus:border-amber-500 resize-none shadow-xs"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <button
                            onClick={() => handleAction(inc.id, 'Verified')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center justify-center space-x-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Verify & Cite</span>
                          </button>

                          <button
                            onClick={() => handleAction(inc.id, 'Rejected')}
                            className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center justify-center space-x-1.5"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Reject False Pos</span>
                          </button>

                          <button
                            onClick={() => handleAction(inc.id, 'Assigned')}
                            className="bg-white hover:bg-slate-100 text-slate-800 py-2 px-3 rounded-xl font-semibold text-xs border border-slate-300 shadow-xs transition-all flex items-center justify-center space-x-1.5"
                          >
                            <UserCheck className="w-4 h-4 text-cyan-600" />
                            <span>Assign Unit</span>
                          </button>

                          <button
                            onClick={() => handleAction(inc.id, 'Resolved')}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-xl font-semibold text-xs shadow-sm transition-all flex items-center justify-center space-x-1.5"
                          >
                            <Clock className="w-4 h-4" />
                            <span>Mark Resolved</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
