import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { VceCalculator } from './pages/VceCalculator';
import { BlastWallDesigner } from './pages/BlastWallDesigner';
import { DamageZonePage } from './pages/DamageZonePage';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/vce', label: 'VCE Calculator' },
  { to: '/wall', label: 'Wall Designer' },
  { to: '/damage', label: 'Damage Zones' },
];

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
            </div>
          </div>
        </nav>

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
