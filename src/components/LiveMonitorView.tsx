import React, { useState, useEffect, useRef } from 'react';
import { Camera, Incident, IncidentCategory } from '../types';
import { Video, Play, Square, AlertTriangle, ShieldCheck, Camera as CamIcon, Sparkles, RefreshCw, Upload, CheckCircle } from 'lucide-react';

interface LiveMonitorViewProps {
  cameras: Camera[];
  onAddIncident: (incident: Incident) => void;
}

interface SimulatedVehicle {
  id: number;
  type: 'car' | 'motorcycle' | 'bus' | 'truck';
  x: number;
  y: number;
  vx: number;
  vy: number;
  plate: string;
  confidence: number;
  color: string;
}

export const LiveMonitorView: React.FC<LiveMonitorViewProps> = ({ cameras, onAddIncident }) => {
  const [selectedCamId, setSelectedCamId] = useState<string>(cameras[0]?.id || 'CAM-BPL-001');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [latestAlert, setLatestAlert] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number>(0);

  const currentCamera = cameras.find(c => c.id === selectedCamId) || cameras[0];

  const vehiclesRef = useRef<SimulatedVehicle[]>([
    { id: 101, type: 'car', x: 280, y: 120, vx: 0, vy: 3.2, plate: 'MP04CB8821', confidence: 0.94, color: '#2563eb' },
    { id: 102, type: 'motorcycle', x: 420, y: 310, vx: 0, vy: -4.5, plate: 'MP09MN4321', confidence: 0.91, color: '#dc2626' },
    { id: 103, type: 'truck', x: 150, y: 220, vx: 1.5, vy: 0, plate: 'MP07TR7712', confidence: 0.89, color: '#d97706' },
  ]);

  useEffect(() => {
    let lastTime = performance.now();

    const animate = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (isPlaying && canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Draw road background
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Draw road lanes & asphalt grid
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(canvas.width / 2, 0);
          ctx.lineTo(canvas.width / 2, canvas.height);
          ctx.stroke();

          // Dashed center divider
          ctx.strokeStyle = '#94a3b8';
          ctx.setLineDash([15, 15]);
          ctx.beginPath();
          ctx.moveTo(canvas.width / 2, 0);
          ctx.lineTo(canvas.width / 2, canvas.height);
          ctx.stroke();
          ctx.setLineDash([]);

          // Stop Line (Red)
          const stopLineY = 280;
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(50, stopLineY);
          ctx.lineTo(canvas.width - 50, stopLineY);
          ctx.stroke();

          ctx.fillStyle = '#ef4444';
          ctx.font = 'bold 12px monospace';
          ctx.fillText('STOP-LINE (SIGNAL: RED)', 60, stopLineY - 10);

          // Restricted Zone Polygon
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
          ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(500, 80);
          ctx.lineTo(720, 80);
          ctx.lineTo(720, 220);
          ctx.lineTo(500, 220);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#f87171';
          ctx.fillText('RESTRICTED PEDESTRIAN ZONE', 510, 105);

          // Update & draw vehicles
          vehiclesRef.current.forEach((veh) => {
            veh.x += veh.vx;
            veh.y += veh.vy;

            if (veh.y > canvas.height + 50) veh.y = -50;
            if (veh.y < -50) veh.y = canvas.height + 50;

            const w = veh.type === 'truck' ? 90 : veh.type === 'bus' ? 110 : 70;
            const h = veh.type === 'truck' ? 140 : veh.type === 'bus' ? 160 : 100;

            // Bounding box
            ctx.strokeStyle = veh.color;
            ctx.lineWidth = 2;
            ctx.strokeRect(veh.x, veh.y, w, h);

            // Label background
            ctx.fillStyle = veh.color;
            ctx.fillRect(veh.x, veh.y - 22, w, 22);

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 11px monospace';
            ctx.fillText(`ID:#${veh.id} ${veh.type.toUpperCase()}`, veh.x + 5, veh.y - 7);

            // ANPR Plate Box
            ctx.fillStyle = 'rgba(0,0,0,0.85)';
            ctx.fillRect(veh.x + 5, veh.y + h - 30, w - 10, 24);
            ctx.strokeStyle = '#e2e8f0';
            ctx.strokeRect(veh.x + 5, veh.y + h - 30, w - 10, 24);
            ctx.fillStyle = '#facc15';
            ctx.font = 'bold 11px monospace';
            ctx.fillText(veh.plate, veh.x + 10, veh.y + h - 14);
          });

          // Overlay watermark
          ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
          ctx.font = '11px monospace';
          ctx.fillText(`SAFEGUARD MP POLICE | CAM:${currentCamera?.id} | MODEL: YOLOv8+ByteTrack | 25 FPS`, 20, canvas.height - 20);
        }
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying, currentCamera]);

  const triggerViolationSimulation = (category: IncidentCategory, customNote: string) => {
    const newInc: Incident = {
      id: `INC-${Date.now()}`,
      incidentNumber: `INC-MP-${Math.floor(Math.random() * 89 + 10)}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 8999 + 1000)}`,
      cameraId: currentCamera.id,
      cameraName: currentCamera.name,
      city: currentCamera.city,
      category,
      status: 'Pending Review',
      confidence: parseFloat((0.88 + Math.random() * 0.1).toFixed(2)),
      trackId: Math.floor(Math.random() * 50 + 10),
      vehicleClass: 'car',
      registrationPlate: 'MP04AB' + Math.floor(Math.random() * 8999 + 1000),
      ocrConfidence: parseFloat((0.85 + Math.random() * 0.14).toFixed(2)),
      evidenceImagePath: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
      plateImagePath: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c351?auto=format&fit=crop&w=300&q=80',
      evidenceHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b85',
      detectionMethod: 'YOLOv8 + ByteTrack Spatial Rule Engine',
      assignedTeam: `${currentCamera.city} Traffic Flying Squad`,
      notes: customNote,
      timestamp: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onAddIncident(newInc);
    setLatestAlert(`⚠️ [${category}] detected on ${currentCamera.name}! Incident record generated.`);
    setTimeout(() => setLatestAlert(null), 5000);
  };

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto text-slate-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <Video className="w-6 h-6 text-amber-600" />
            <span>Live Camera Ingestion & Edge AI Monitoring</span>
          </h2>
          <p className="text-slate-600 text-sm">
            Real-time YOLOv8 bounding box detection, multi-object ByteTrack trajectory tracking, and automated rule validation.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedCamId}
            onChange={(e) => setSelectedCamId(e.target.value)}
            className="bg-white border border-slate-300 text-slate-900 px-4 py-2 rounded-xl text-sm focus:outline-none focus:border-amber-500 font-medium shadow-sm"
          >
            {cameras.map(c => (
              <option key={c.id} value={c.id}>
                📍 {c.city} - {c.name} ({c.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {latestAlert && (
        <div className="bg-amber-50 border border-amber-300 text-amber-900 p-4 rounded-xl flex items-center space-x-3 shadow-sm animate-bounce">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <span className="text-sm font-semibold">{latestAlert}</span>
        </div>
      )}

      {/* Main Grid: Video Canvas & Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Canvas Feed */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-sm font-bold text-slate-900">{currentCamera.name}</span>
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono border border-slate-200">{currentCamera.city}</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 border border-slate-300 transition-colors"
              >
                {isPlaying ? <Square className="w-3.5 h-3.5 text-amber-600" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
                <span>{isPlaying ? 'Pause Stream' : 'Resume'}</span>
              </button>
            </div>
          </div>

          <div className="relative aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center shadow-inner">
            <canvas
              ref={canvasRef}
              width={960}
              height={540}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <p className="text-[11px] text-slate-500 uppercase">Model FPS</p>
              <p className="text-lg font-bold font-mono text-emerald-600 mt-0.5">28.4 FPS</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <p className="text-[11px] text-slate-500 uppercase">Active Tracks</p>
              <p className="text-lg font-bold font-mono text-amber-600 mt-0.5">{vehiclesRef.current.length} Vehicles</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <p className="text-[11px] text-slate-500 uppercase">ANPR Status</p>
              <p className="text-lg font-bold font-mono text-cyan-700 mt-0.5">Active (EasyOCR)</p>
            </div>
          </div>
        </div>

        {/* Violation Simulation & Controls */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <span>Simulate AI Detection Trigger</span>
              </h3>
              <p className="text-xs text-slate-500">
                Manually trigger specific traffic violations to test the automated incident pipeline and evidence storage.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => triggerViolationSimulation('Stop-Line Crossing', 'Vehicle crossed junction stop-line during RED signal state at Roshanpura junction.')}
                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-900 p-3 rounded-xl border border-slate-200 text-left transition-all group flex items-center justify-between shadow-xs"
              >
                <div>
                  <p className="text-sm font-bold text-red-600">🛑 Stop-Line Crossing</p>
                  <p className="text-xs text-slate-500 mt-0.5">Signal state: RED | Intersection breach</p>
                </div>
                <span className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-lg border border-red-200 font-semibold">Trigger</span>
              </button>

              <button
                onClick={() => triggerViolationSimulation('Wrong-Way Driving', 'Vehicle detected travelling in opposing flow against calibrated corridor heading.')}
                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-900 p-3 rounded-xl border border-slate-200 text-left transition-all group flex items-center justify-between shadow-xs"
              >
                <div>
                  <p className="text-sm font-bold text-amber-700">⚠️ Wrong-Way Driving</p>
                  <p className="text-xs text-slate-500 mt-0.5">Vector inversion detected</p>
                </div>
                <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-200 font-semibold">Trigger</span>
              </button>

              <button
                onClick={() => triggerViolationSimulation('Restricted Zone Entry', 'Unauthorized transport entry into pedestrian commercial promenade.')}
                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-900 p-3 rounded-xl border border-slate-200 text-left transition-all group flex items-center justify-between shadow-xs"
              >
                <div>
                  <p className="text-sm font-bold text-purple-700">🚫 Restricted Zone Intrusion</p>
                  <p className="text-xs text-slate-500 mt-0.5">Geo-fence polygon violation</p>
                </div>
                <span className="text-xs bg-purple-100 text-purple-800 px-2.5 py-1 rounded-lg border border-purple-200 font-semibold">Trigger</span>
              </button>

              <button
                onClick={() => triggerViolationSimulation('Overspeeding', 'Vehicle clocked at 82 km/h in 50 km/h urban speed limit zone.')}
                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-900 p-3 rounded-xl border border-slate-200 text-left transition-all group flex items-center justify-between shadow-xs"
              >
                <div>
                  <p className="text-sm font-bold text-cyan-700">⚡ Overspeeding Detection</p>
                  <p className="text-xs text-slate-500 mt-0.5">Displacement radar estimator</p>
                </div>
                <span className="text-xs bg-cyan-100 text-cyan-800 px-2.5 py-1 rounded-lg border border-cyan-200 font-semibold">Trigger</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
            <p className="font-semibold text-slate-900 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Evidence Pipeline Status:</span>
            </p>
            <p>
              Snapshots saved in <code className="text-amber-700 bg-slate-100 px-1 py-0.5 rounded font-mono">storage/evidence/</code> with SHA-256 integrity hash. Pending review status automatically assigned.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
