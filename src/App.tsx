import React, { useState } from 'react';
import { INITIAL_USER, INITIAL_CAMERAS, INITIAL_INCIDENTS, INITIAL_AUDIT_LOGS } from './mockData';
import { Camera, Incident, IncidentStatus, AuditLogItem } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { OverviewView } from './components/OverviewView';
import { LiveMonitorView } from './components/LiveMonitorView';
import { IncidentReviewView } from './components/IncidentReviewView';
import { CentralHubView } from './components/CentralHubView';
import { AnalyticsView } from './components/AnalyticsView';
import { NewCameraModal } from './components/NewCameraModal';

export default function App() {
  const [currentUser] = useState(INITIAL_USER);
  const [cameras, setCameras] = useState<Camera[]>(INITIAL_CAMERAS);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isNewCameraOpen, setIsNewCameraOpen] = useState<boolean>(false);

  const pendingReviewCount = incidents.filter(i => i.status === 'Pending Review' || i.status === 'New').length;

  const handleAddIncident = (newInc: Incident) => {
    setIncidents(prev => [newInc, ...prev]);

    const newAudit: AuditLogItem = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      username: currentUser.username,
      action: 'AI_DETECTION_TRIGGER',
      resource: `Incident: ${newInc.incidentNumber}`,
      details: `Automated detection rule triggered for ${newInc.category} on camera ${newInc.cameraId}.`,
      ipAddress: '10.245.12.90'
    };
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  const handleUpdateIncidentStatus = (
    incidentId: string,
    newStatus: IncidentStatus,
    notes: string,
    assignedTeam: string
  ) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          status: newStatus,
          assignedTeam,
          notes: `${inc.notes}\n[${new Date().toLocaleString()}] Status set to ${newStatus}. Note: ${notes}`,
          updatedAt: new Date().toISOString()
        };
      }
      return inc;
    }));

    const targetInc = incidents.find(i => i.id === incidentId);

    const newAudit: AuditLogItem = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      username: currentUser.username,
      action: `INCIDENT_${newStatus.toUpperCase().replace(/\s+/g, '_')}`,
      resource: `Incident: ${targetInc?.incidentNumber || incidentId}`,
      details: `Status updated to ${newStatus}. Assigned team: ${assignedTeam}. Notes: ${notes}`,
      ipAddress: '10.245.12.90'
    };
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  const handleAddCamera = (newCam: Camera) => {
    setCameras(prev => [newCam, ...prev]);

    const newAudit: AuditLogItem = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      username: currentUser.username,
      action: 'REGISTER_CAMERA',
      resource: `Camera: ${newCam.id}`,
      details: `New CCTV camera node registered in ${newCam.city} at ${newCam.location}.`,
      ipAddress: '10.245.12.90'
    };
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-amber-500 selection:text-white">
      <Header
        currentUser={currentUser}
        activeIncidentsCount={pendingReviewCount}
        onOpenNewCamera={() => setIsNewCameraOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          camerasCount={cameras.length}
          pendingReviewCount={pendingReviewCount}
          onOpenNewCamera={() => setIsNewCameraOpen(true)}
        />

        <main className="flex-1 overflow-y-auto bg-slate-50">
          {activeTab === 'overview' && (
            <OverviewView
              cameras={cameras}
              incidents={incidents}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'live_monitor' && (
            <LiveMonitorView
              cameras={cameras}
              onAddIncident={handleAddIncident}
            />
          )}

          {activeTab === 'incident_review' && (
            <IncidentReviewView
              incidents={incidents}
              onUpdateIncidentStatus={handleUpdateIncidentStatus}
            />
          )}

          {activeTab === 'central_hub' && (
            <CentralHubView
              cameras={cameras}
              incidents={incidents}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              auditLogs={auditLogs}
            />
          )}
        </main>
      </div>

      <NewCameraModal
        isOpen={isNewCameraOpen}
        onClose={() => setIsNewCameraOpen(false)}
        onAddCamera={handleAddCamera}
      />
    </div>
  );
}
