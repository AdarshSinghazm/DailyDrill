import React from 'react';
import { LayoutDashboard, PlusCircle, FolderKanban, BarChart3 } from 'lucide-react';

export const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Overview & daily metrics'
  },
  {
    id: 'log',
    label: 'Log Entry',
    icon: PlusCircle,
    description: 'Track today\'s practice'
  },
  {
    id: 'topics',
    label: 'Topics',
    icon: FolderKanban,
    description: 'Speaking & writing prompts'
  },
  {
    id: 'stats',
    label: 'History / Stats',
    icon: BarChart3,
    description: 'Analytics & logs'
  }
];

export default function Navigation({ activeTab, setActiveTab }) {
  return (
    <>
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 bg-[#1e1e1e] border-r border-[#3a3a3a] min-h-[calc(100vh-65px)] p-4 flex-shrink-0">
        <div className="mb-2 px-3 py-2">
          <p className="text-[11px] font-semibold text-[#a0a0a0] uppercase tracking-wider">Navigation</p>
        </div>

        <nav className="space-y-1.5 flex-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#404040] text-[#f0f0f0] font-medium border border-[#525252] shadow-sm'
                    : 'text-[#a0a0a0] hover:text-[#f0f0f0] hover:bg-[#2d2d2d] border border-transparent hover:border-[#3a3a3a]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#f0f0f0]' : 'text-[#a0a0a0]'}`} />
                  <div>
                    <span className="block text-sm leading-tight">{item.label}</span>
                    <span className={`text-[11px] block leading-tight ${isActive ? 'text-[#e5e5e5]' : 'text-[#737373]'}`}>
                      {item.description}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Storage Badge */}
        <div className="mt-auto p-3.5 rounded-xl bg-[#2d2d2d] border border-[#3a3a3a] text-xs">
          <div className="flex items-center space-x-2 text-[#f0f0f0] font-medium mb-1">
            <span className="w-2 h-2 rounded-full bg-[#404040]" />
            <span>Local Storage Active</span>
          </div>
          <p className="text-[#a0a0a0] text-[11px] leading-relaxed">
            Data saved in your browser storage.
          </p>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1e1e1e] border-t border-[#3a3a3a] px-2 py-1.5 flex justify-around items-center">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-lg text-xs transition-colors cursor-pointer ${
                isActive ? 'text-[#f0f0f0] font-bold' : 'text-[#a0a0a0] hover:text-[#f0f0f0]'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-[#f0f0f0]' : 'text-[#a0a0a0]'}`} />
              <span className="text-[11px]">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
