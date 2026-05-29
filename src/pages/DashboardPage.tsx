import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useVCEStore } from '../store';
import { useProjectStore } from '../store/projectSlice';

export const DashboardPage: React.FC = () => {
  const { bstResult, tntResult, tnoResult } = useVCEStore();
  const hasResults = !!(bstResult || tntResult || tnoResult);

  const {
    projects,
    currentProjectId,
    currentProjectName,
    newProject,
    openProject,
    deleteProject,
    importProject,
    loadProjectList,
  } = useProjectStore();

  const [showNewDialog, setShowNewDialog] = useState(false);
  const [showOpenDialog, setShowOpenDialog] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadProjectList();
  }, [loadProjectList]);

  const handleNew = async () => {
    if (newName.trim()) {
      await newProject(newName.trim(), newDesc.trim());
      setNewName('');
      setNewDesc('');
      setShowNewDialog(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await importProject(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">BlastShield Dashboard</h1>
          <p className="text-gray-400 mt-1">VCE Blast Analysis & Blast Wall Design Suite</p>
          {currentProjectId && (
            <p className="text-sm text-blue-400 mt-1">Project: {currentProjectName}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowNewDialog(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium"
          >
            + New
          </button>
          <button
            onClick={() => setShowOpenDialog(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
          >
            Open
          </button>
          <label className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-medium cursor-pointer">
            Import
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
          </label>
        </div>
      </div>

      {/* New Project Dialog */}
      {showNewDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96">
            <h2 className="text-lg font-semibold text-white mb-4">New Project</h2>
            <input
              type="text"
              placeholder="Project name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full bg-gray-700 text-white rounded px-3 py-2 mb-3"
              autoFocus
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full bg-gray-700 text-white rounded px-3 py-2 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowNewDialog(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button onClick={handleNew} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Create</button>
            </div>
          </div>
        </div>
      )}

      {/* Open Project Dialog */}
      {showOpenDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-[480px] max-h-[70vh] overflow-auto">
            <h2 className="text-lg font-semibold text-white mb-4">Open Project</h2>
            {projects.length === 0 ? (
              <p className="text-gray-400 text-sm">No saved projects found.</p>
            ) : (
              <div className="space-y-2">
                {projects.map((p) => (
                  <div key={p.id} className="flex items-center justify-between bg-gray-700 rounded px-4 py-3">
                    <button
                      onClick={async () => { await openProject(p.id); setShowOpenDialog(false); }}
                      className="text-left flex-1"
                    >
                      <div className="text-white font-medium">{p.name}</div>
                      <div className="text-gray-400 text-xs">{p.description || 'No description'}</div>
                      <div className="text-gray-500 text-xs">Updated: {new Date(p.updatedAt).toLocaleString()}</div>
                    </button>
                    <button
                      onClick={async () => { await deleteProject(p.id); }}
                      className="text-red-400 hover:text-red-300 ml-3 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end mt-4">
              <button onClick={() => setShowOpenDialog(false)} className="px-4 py-2 text-gray-400 hover:text-white">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/vce"
          className="block bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-lg p-6 transition-colors hover:border-blue-500"
        >
          <div className="text-2xl mb-2">💥</div>
          <h2 className="text-lg font-semibold text-white">VCE Calculator</h2>
          <p className="text-sm text-gray-400 mt-1">BST, TNT Equivalent, TNO Multi-Energy</p>
        </Link>
        <Link
          to="/wall"
          className="block bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-lg p-6 transition-colors hover:border-blue-500"
        >
          <div className="text-2xl mb-2">🧱</div>
          <h2 className="text-lg font-semibold text-white">Blast Wall Designer</h2>
          <p className="text-sm text-gray-400 mt-1">Steel & RC wall sizing, connection design</p>
        </Link>
        <Link
          to="/damage"
          className="block bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-lg p-6 transition-colors hover:border-blue-500"
        >
          <div className="text-2xl mb-2">📏</div>
          <h2 className="text-lg font-semibold text-white">Damage Zones</h2>
          <p className="text-sm text-gray-400 mt-1">Safe distances & damage thresholds</p>
        </Link>
      </div>

      {/* Recent Results Summary */}
      {hasResults && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Analysis Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bstResult && (
              <div className="border border-gray-700 rounded p-3">
                <div className="text-sm text-gray-400">BST Peak Overpressure</div>
                <div className="text-lg font-mono text-yellow-400">{bstResult.peakOverpressure.toFixed(4)} bar</div>
              </div>
            )}
            {tntResult && (
              <div className="border border-gray-700 rounded p-3">
                <div className="text-sm text-gray-400">TNT Peak Overpressure</div>
                <div className="text-lg font-mono text-yellow-400">{tntResult.peakOverpressure.toFixed(4)} bar</div>
              </div>
            )}
            {tnoResult && (
              <div className="border border-gray-700 rounded p-3">
                <div className="text-sm text-gray-400">TNO Peak Overpressure</div>
                <div className="text-lg font-mono text-yellow-400">{tnoResult.peakOverpressure.toFixed(4)} bar</div>
              </div>
            )}
          </div>
        </div>
      )}

      {!hasResults && (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <div className="text-gray-500 text-lg">No analysis results yet.</div>
          <div className="text-gray-600 text-sm mt-2">Start with the VCE Calculator to run your first analysis.</div>
          <Link to="/vce" className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium">
            Get Started →
          </Link>
        </div>
      )}
    </div>
  );
};
