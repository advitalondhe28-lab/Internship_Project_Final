export type UserRole = 'Administrator' | 'City Command Centre Operator' | 'Reviewing Officer' | 'Read-only Viewer';

export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  badgeNumber: string;
  role: UserRole;
  city: string;
}

export interface Camera {
  id: string;
  name: string;
  city: string;
  location: string;
  latitude: number;
  longitude: number;
  cameraType: 'PTZ Traffic' | 'Fixed ANPR' | 'Dome Wide' | 'Highway Bullet';
  status: 'Online' | 'Offline' | 'Maintenance';
  videoSource: string;
  isDemo: boolean;
  lastActive: string;
}

export type IncidentCategory = 
  | 'Stop-Line Crossing' 
  | 'Wrong-Way Driving' 
  | 'Restricted Zone Entry' 
  | 'Red-Light Violation' 
  | 'Overspeeding' 
  | 'Suspicious Parking';

export type IncidentStatus = 
  | 'New' 
  | 'Pending Review' 
  | 'Verified' 
  | 'Rejected' 
  | 'Assigned' 
  | 'Under Investigation' 
  | 'Resolved';

export interface Incident {
  id: string;
  incidentNumber: string;
  cameraId: string;
  cameraName: string;
  city: string;
  category: IncidentCategory;
  status: IncidentStatus;
  confidence: number;
  trackId: number;
  vehicleClass: 'car' | 'motorcycle' | 'bus' | 'truck';
  registrationPlate?: string;
  ocrConfidence?: number;
  evidenceImagePath: string;
  plateImagePath?: string;
  evidenceVideoPath?: string;
  evidenceHash: string;
  detectionMethod: string;
  assignedTeam?: string;
  assignedOfficer?: string;
  notes?: string;
  timestamp: string;
  updatedAt: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  username: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
}
