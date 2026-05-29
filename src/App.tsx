import React, { useEffect, useCallback, useRef } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { VceCalculator } from './pages/VceCalculator';
import { BlastWallDesigner } from './pages/BlastWallDesigner';
import { DamageZonePage } from './pages/DamageZonePage';
import { useProjectStore } from './store/projectSlice';
import { useVCEStore } from './store/vceSlice';
import { useWallDesignStore } from './store/wallDesignSlice';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/vce', label: 'VCE Calculator' },
  { to: '/wall', label: 'Wall Designer' },
  { to: '/damage', label: 'Damage Zones' },
];

function FileToolbar() {
  const {
    currentProjectId,
    currentProjectName,
    isDirty,
    newProject,
    saveProject,
    saveAsProject,
    exportProject,
    importProject,
  } = useProjectStore();

  const [showSaveAs, setShowSaveAs] = React.useState(false);
  const [saveAsName, setSaveAsName] = React.useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSave = useCallback(async () => {
    if (currentProjectId) {
      await saveProject();
    } else {
      const id = await newProject(currentProjectName);
      // It's now saved
    }
  }, [currentProjectId, saveProject, newProject, currentProjectName]);

  // Ctrl+S handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleSave]);

  const handleSaveAs = async () => {
    if (saveAsName.trim()) {
      await saveAsProject(saveAsName.trim());
      setShowSaveAs(false);
      setSaveAsName('');
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
    <div className="flex items-center gap-2">
      <button
        onClick={async () => await newProject()}
        className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-gray-700"
      >
        New
      </button>
      <button
        onClick={async () => {
          if (!currentProjectId) {
            await newProject();
          }
          // Open dialog is on Dashboard
        }}
        className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-gray-700"
        title="Use Dashboard to open projects"
      >
        Open
      </button>
      <button
        onClick={handleSave}
        className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-gray-700"
      >
        Save{isDirty ? ' •' : ''} <span className="text-gray-500">⌘S</span>
      </button>
      <button
        onClick={() => { setSaveAsName(currentProjectName); setShowSaveAs(true); }}
        className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-gray-700"
      >
        Save As
      </button>
      <button
        onClick={() => exportProject()}
        className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-gray-700"
      >
        Export JSON
      </button>
      <label className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-gray-700 cursor-pointer">
        Import JSON
        <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
      </label>

      {showSaveAs && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96">
            <h2 className="text-lg font-semibold text-white mb-4">Save As</h2>
            <input
              type="text"
              value={saveAsName}
              onChange={(e) => setSaveAsName(e.target.value)}
              className="w-full bg-gray-700 text-white rounded px-3 py-2 mb-4"
              autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter') handleSaveAs(); }}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowSaveAs(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button onClick={handleSaveAs} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Auto-save hook with debounce
function AutoSave() {
  const currentProjectId = useProjectStore((s) => s.currentProjectId);
  const isDirty = useProjectStore((s) => s.isDirty);
  const saveProject = useProjectStore((s) => s.saveProject);
  const markDirty = useProjectStore((s) => s.markDirty);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  // Subscribe to VCE and Wall store changes to mark dirty
  useEffect(() => {
    const unsubVCE = useVCEStore.subscribe(() => {
      if (currentProjectId) markDirty();
    });
    const unsubWall = useWallDesignStore.subscribe(() => {
      if (currentProjectId) markDirty();
    });
    return () => { unsubVCE(); unsubWall(); };
  }, [currentProjectId, markDirty]);

  // Debounced auto-save
  useEffect(() => {
    if (isDirty && currentProjectId) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        saveProject();
      }, 3000);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isDirty, currentProjectId, saveProject]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900 text-gray-100">
        {/* Navigation */}
        <nav className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center gap-1">
                <span className="text-xl font-bold text-white mr-4">⚡ BlastShield</span>
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `px-3 py-2 rounded text-sm font-medium transition-colors ${
                        isActive ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
              <FileToolbar />
            </div>
          </div>
        </nav>

        <AutoSave />

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/vce" element={<VceCalculator />} />
            <Route path="/wall" element={<BlastWallDesigner />} />
            <Route path="/damage" element={<DamageZonePage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
