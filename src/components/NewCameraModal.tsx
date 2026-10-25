import React, { useState } from 'react';
import { Camera } from '../types';
import { X, Camera as CamIcon, CheckCircle2 } from 'lucide-react';

interface NewCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCamera: (cam: Camera) => void;
}

export const NewCameraModal: React.FC<NewCameraModalProps> = ({ isOpen, onClose, onAddCamera }) => {
  const [id, setId] = useState<string>('CAM-MP-' + Math.floor(Math.random() * 899 + 100));
  const [name, setName] = useState<string>('');
  const [city, setCity] = useState<string>('Bhopal');
  const [location, setLocation] = useState<string>('');
  const [cameraType, setCameraType] = useState<'PTZ Traffic' | 'Fixed ANPR' | 'Dome Wide' | 'Highway Bullet'>('Fixed ANPR');
  const [videoSource, setVideoSource] = useState<string>('sample_traffic.mp4');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location) {
      alert('Please fill out all mandatory fields.');
      return;
    }

    const newCam: Camera = {
      id,
      name,
      city,
      location,
      latitude: 23.2599 + (Math.random() - 0.5) * 0.1,
      longitude: 77.4126 + (Math.random() - 0.5) * 0.1,
      cameraType,
      status: 'Online',
      videoSource,
      isDemo: true,
      lastActive: 'Just now'
    };

    onAddCamera(newCam);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl text-slate-900">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-2 text-slate-900 font-bold">
            <CamIcon className="w-5 h-5 text-amber-600" />
            <span>Configure New CCTV Camera Source</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-600 block mb-1 font-medium">Camera ID</label>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3.5 py-2 rounded-xl text-xs font-mono"
                required
              />
            </div>

            <div>
              <label className="text-xs text-slate-600 block mb-1 font-medium">City / District</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3.5 py-2 rounded-xl text-xs font-medium"
              >
                <option value="Bhopal">Bhopal</option>
                <option value="Indore">Indore</option>
                <option value="Gwalior">Gwalior</option>
                <option value="Jabalpur">Jabalpur</option>
                <option value="Ujjain">Ujjain</option>
                <option value="Sagar">Sagar</option>
                <option value="Rewa">Rewa</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-600 block mb-1 font-medium">Camera Name</label>
            <input
              type="text"
              placeholder="e.g. Roshanpura Square North PTZ"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3.5 py-2 rounded-xl text-xs"
              required
            />
          </div>

          <div>
            <label className="text-xs text-slate-600 block mb-1 font-medium">Exact Location Description</label>
            <input
              type="text"
              placeholder="e.g. Near TT Nagar Stadium Gate 2"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3.5 py-2 rounded-xl text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-600 block mb-1 font-medium">Camera Type</label>
              <select
                value={cameraType}
                onChange={(e) => setCameraType(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3.5 py-2 rounded-xl text-xs font-medium"
              >
                <option value="Fixed ANPR">Fixed ANPR</option>
                <option value="PTZ Traffic">PTZ Traffic</option>
                <option value="Dome Wide">Dome Wide</option>
                <option value="Highway Bullet">Highway Bullet</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-600 block mb-1 font-medium">Video Source URI / Stream</label>
              <input
                type="text"
                value={videoSource}
                onChange={(e) => setVideoSource(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3.5 py-2 rounded-xl text-xs font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors"
            >
              Save & Register Camera
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
