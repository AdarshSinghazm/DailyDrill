import React, { useState } from 'react';
import { 
  BarChart3, 
  Calendar, 
  Search, 
  Clock, 
  TrendingUp, 
  Tv, 
  Mic, 
  PenTool
} from 'lucide-react';

export default function HistoryStatsView({ entries = [] }) {
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // ================= 1. LIFETIME HOURS CALCULATION =================
  const consumptionMins = entries
    .filter(e => e.category === 'Consumption')
    .reduce((sum, e) => sum + (Number(e.duration) || 0), 0);
  const consumptionHours = (consumptionMins / 60).toFixed(1);

  const speakingMins = entries
    .filter(e => e.category === 'Speaking')
    .reduce((sum, e) => sum + (Number(e.duration) || 0), 0);
  const speakingHours = (speakingMins / 60).toFixed(1);

  const writingWords = entries
    .filter(e => e.category === 'Writing')
    .reduce((sum, e) => sum + (Number(e.wordCount) || 0), 0);
  const writingMins = entries
    .filter(e => e.category === 'Writing')
    .reduce((sum, e) => sum + (Number(e.duration) || (Number(e.wordCount) / 20) || 0), 0);
  const writingHours = (writingMins / 60).toFixed(1);

  const totalLifetimeHours = (Number(consumptionHours) + Number(speakingHours) + Number(writingHours)).toFixed(1);

  // ================= 2. 12-WEEK GITHUB-STYLE HEATMAP DATA =================
  const today = new Date();
  const heatmapDays = [];
  for (let i = 83; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    const dayEntries = entries.filter(e => e.date === dateStr);
    const count = dayEntries.length;
    
    heatmapDays.push({
      dateStr,
      dateLabel: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      count,
      isComplete: count > 0
    });
  }

  const heatmapColumns = [];
  for (let col = 0; col < 12; col++) {
    heatmapColumns.push(heatmapDays.slice(col * 7, (col + 1) * 7));
  }

  const activeDaysCount = heatmapDays.filter(d => d.isComplete).length;
  const completionPercentage = Math.round((activeDaysCount / 84) * 100);

  // ================= 3. WRITING WORD COUNT LINE CHART DATA =================
  const writingEntries = entries
    .filter(e => e.category === 'Writing')
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const chartWidth = 600;
  const chartHeight = 160;
  const padding = 30;

  const maxWordCount = Math.max(...writingEntries.map(e => Number(e.wordCount) || 0), 500);
  
  const chartPoints = writingEntries.map((e, idx) => {
    const x = writingEntries.length === 1 
      ? chartWidth / 2 
      : padding + (idx / (writingEntries.length - 1)) * (chartWidth - 2 * padding);
    
    const count = Number(e.wordCount) || 0;
    const y = chartHeight - padding - (count / maxWordCount) * (chartHeight - 2 * padding);
    return { x, y, count, date: e.date, topic: e.topic || 'Writing Entry' };
  });

  const pathD = chartPoints.length > 0 
    ? chartPoints.reduce((acc, pt, idx) => idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`, '')
    : '';

  const areaD = chartPoints.length > 0 
    ? `${pathD} L ${chartPoints[chartPoints.length - 1].x},${chartHeight - padding} L ${chartPoints[0].x},${chartHeight - padding} Z`
    : '';

  // Filter timeline entries
  const filteredEntries = entries.filter((entry) => {
    const matchesCategory = filterCategory === 'ALL' || entry.category === filterCategory;
    const searchTarget = (
      (entry.title || '') + 
      (entry.topic || '') + 
      (entry.mediaType || '') + 
      (entry.note || '') + 
      (entry.summary || '')
    ).toLowerCase();
    
    const matchesSearch = !searchQuery || searchTarget.includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3a3a3a] pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#f0f0f0] flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#f0f0f0]" />
            History & Analytics Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-[#a0a0a0] mt-1">
            Lifetime hours, 12-week contribution heatmap, and writing growth analytics.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono bg-[#2d2d2d] border border-[#3a3a3a] px-3.5 py-1.5 rounded-xl text-[#f0f0f0] font-semibold">
          <Clock className="w-4 h-4 text-[#a0a0a0]" />
          <span>Lifetime: {totalLifetimeHours} Hours</span>
        </div>
      </div>

      {/* ================= SECTION 1: LIFETIME HOURS PER CATEGORY ================= */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#a0a0a0] flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-[#a0a0a0]" /> Lifetime Practice Hours
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Consumption */}
          <div className="minimal-card p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#a0a0a0] uppercase tracking-wider flex items-center gap-1.5">
                <Tv className="w-4 h-4 text-[#f0f0f0]" /> Consumption
              </span>
              <span className="text-[10px] bg-[#242424] text-[#f0f0f0] border border-[#3a3a3a] px-2 py-0.5 rounded font-mono font-semibold">
                {consumptionMins} mins
              </span>
            </div>
            <div className="text-3xl font-extrabold text-[#f0f0f0] font-sans">
              {consumptionHours} <span className="text-sm font-normal text-[#a0a0a0]">hrs</span>
            </div>
            <p className="text-[11px] text-[#a0a0a0]">
              Shows, podcasts, TED talks & movies
            </p>
          </div>

          {/* Speaking */}
          <div className="minimal-card p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#a0a0a0] uppercase tracking-wider flex items-center gap-1.5">
                <Mic className="w-4 h-4 text-[#f0f0f0]" /> Speaking
              </span>
              <span className="text-[10px] bg-[#242424] text-[#f0f0f0] border border-[#3a3a3a] px-2 py-0.5 rounded font-mono font-semibold">
                {speakingMins} mins
              </span>
            </div>
            <div className="text-3xl font-extrabold text-[#f0f0f0] font-sans">
              {speakingHours} <span className="text-sm font-normal text-[#a0a0a0]">hrs</span>
            </div>
            <p className="text-[11px] text-[#a0a0a0]">
              Out-loud practice & discussions
            </p>
          </div>

          {/* Writing */}
          <div className="minimal-card p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#a0a0a0] uppercase tracking-wider flex items-center gap-1.5">
                <PenTool className="w-4 h-4 text-[#f0f0f0]" /> Writing
              </span>
              <span className="text-[10px] bg-[#242424] text-[#f0f0f0] border border-[#3a3a3a] px-2 py-0.5 rounded font-mono font-semibold">
                {writingWords} words
              </span>
            </div>
            <div className="text-3xl font-extrabold text-[#f0f0f0] font-sans">
              {writingHours} <span className="text-sm font-normal text-[#a0a0a0]">hrs</span>
            </div>
            <p className="text-[11px] text-[#a0a0a0]">
              Essays, journaling & summaries
            </p>
          </div>
        </div>
      </div>

      {/* ================= SECTION 2: GITHUB-STYLE CONTRIBUTION HEATMAP (12 WEEKS) ================= */}
      <div className="minimal-card p-5 sm:p-6 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#3a3a3a] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#f0f0f0] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#a0a0a0]" />
              12-Week Practice Contribution Heatmap
            </h3>
            <p className="text-xs text-[#a0a0a0]">
              Daily practice activity over the last 12 weeks (84 days).
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <span className="text-[#a0a0a0] font-mono">
              <strong className="text-[#4ade80] font-bold">{activeDaysCount}</strong> / 84 Active Days ({completionPercentage}%)
            </span>
            <div className="flex items-center space-x-1 text-[10px] text-[#a0a0a0] font-mono">
              <span>Less</span>
              <span className="w-3 h-3 rounded bg-[#242424] border border-[#3a3a3a] inline-block" />
              <span className="w-3 h-3 rounded bg-[#2d5a3d] inline-block" />
              <span className="w-3 h-3 rounded bg-[#4ade80] inline-block" />
              <span>More</span>
            </div>
          </div>
        </div>

        {/* Heatmap Grid Container */}
        <div className="overflow-x-auto pb-2">
          <div className="flex space-x-1.5 min-w-[560px]">
            {heatmapColumns.map((colDays, colIdx) => (
              <div key={colIdx} className="flex flex-col space-y-1.5">
                {colDays.map((day) => {
                  let bgClass = 'bg-[#242424] border-[#3a3a3a]';
                  if (day.count === 1) bgClass = 'bg-[#2d5a3d] border-[#3a7852] shadow-2xs';
                  else if (day.count >= 2) bgClass = 'bg-[#4ade80] border-[#86efac] shadow-2xs';

                  return (
                    <div
                      key={day.dateStr}
                      title={`${day.dateLabel}: ${day.count} practice entry(s)`}
                      className={`w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-[4px] border transition-transform hover:scale-125 cursor-pointer ${bgClass}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= SECTION 3: WRITING WORD COUNT LINE CHART OVER TIME ================= */}
      <div className="minimal-card p-5 sm:p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#3a3a3a] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#f0f0f0] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#a0a0a0]" />
              Writing Output Growth (Word Count per Entry)
            </h3>
            <p className="text-xs text-[#a0a0a0]">
              Track whether writing entry word counts are increasing over time.
            </p>
          </div>

          <span className="text-xs font-mono text-[#f0f0f0] bg-[#242424] border border-[#3a3a3a] px-3 py-1 rounded-full font-semibold">
            {writingEntries.length} Writing Entries Logged
          </span>
        </div>

        {writingEntries.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#a0a0a0]">
            No writing entries logged yet. Log a writing session to see your growth curve!
          </div>
        ) : (
          <div className="space-y-2">
            {/* SVG Line Chart */}
            <div className="relative w-full overflow-x-auto">
              <svg 
                viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                className="w-full h-44 text-[#f0f0f0] overflow-visible"
              >
                {/* Horizontal Grid lines */}
                <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="#3a3a3a" strokeDasharray="4 4" strokeWidth="1" />
                <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} stroke="#3a3a3a" strokeDasharray="4 4" strokeWidth="1" />
                <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#525252" strokeWidth="1" />

                {/* Y-Axis Label */}
                <text x={padding} y={padding - 8} fill="#a0a0a0" fontSize="10" fontFamily="monospace">
                  {maxWordCount} words
                </text>

                {/* Area Gradient Fill */}
                <defs>
                  <linearGradient id="monoGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4ade80" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#4ade80" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {chartPoints.length > 1 && (
                  <>
                    <path d={areaD} fill="url(#monoGradient)" />
                    <path d={pathD} fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </>
                )}

                {/* Data Points */}
                {chartPoints.map((pt, idx) => (
                  <g key={idx} className="group cursor-pointer">
                    <circle 
                      cx={pt.x} 
                      cy={pt.y} 
                      r="5" 
                      className="fill-[#4ade80] stroke-[#1e1e1e] stroke-2 hover:r-7 transition-all"
                    />
                    <title>{`${pt.date}: ${pt.count} words`}</title>
                    <text 
                      x={pt.x} 
                      y={pt.y - 10} 
                      fill="#4ade80" 
                      fontSize="10" 
                      fontWeight="bold" 
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {pt.count}w
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* ================= SECTION 4: SEARCHABLE TIMELINE LOGS ================= */}
      <div className="minimal-card rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-[#3a3a3a] bg-[#242424] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-[#f0f0f0]">Practice Log Timeline</h3>

          <div className="flex items-center space-x-3">
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-[#a0a0a0] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search entries..."
                className="w-full bg-[#1e1e1e] border border-[#3a3a3a] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#f0f0f0] placeholder:text-[#737373] focus:outline-none focus:border-[#525252]"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-[#1e1e1e] border border-[#3a3a3a] rounded-xl px-3 py-1.5 text-xs text-[#f0f0f0] focus:outline-none cursor-pointer font-medium"
            >
              <option value="ALL" className="bg-[#242424]">All Categories</option>
              <option value="Consumption" className="bg-[#242424]">Consumption</option>
              <option value="Speaking" className="bg-[#242424]">Speaking</option>
              <option value="Writing" className="bg-[#242424]">Writing</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-[#3a3a3a]">
          {filteredEntries.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#a0a0a0]">
              No matching practice logs found.
            </div>
          ) : (
            filteredEntries.map((entry) => {
              const isConsumption = entry.category === 'Consumption';
              const isSpeaking = entry.category === 'Speaking';

              return (
                <div key={entry.id} className="p-4 sm:p-5 hover:bg-[#333333] transition-colors space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#242424] text-[#f0f0f0] border border-[#3a3a3a]">
                        {entry.category}
                      </span>
                      <h4 className="text-sm font-bold text-[#f0f0f0]">
                        {isConsumption ? entry.title : entry.topic}
                      </h4>
                    </div>

                    <span className="text-[#a0a0a0] font-mono text-xs">{entry.date}</span>
                  </div>

                  {isConsumption && (
                    <div className="text-xs text-[#a0a0a0] flex items-center space-x-4">
                      <span>Type: <strong className="text-[#f0f0f0]">{entry.mediaType}</strong></span>
                      <span>Duration: <strong className="text-[#f0f0f0] font-mono">{entry.duration} mins</strong></span>
                    </div>
                  )}

                  {isSpeaking && (
                    <div className="space-y-1">
                      <p className="text-xs text-[#a0a0a0]">
                        Duration: <strong className="text-[#f0f0f0] font-mono">{entry.duration} mins</strong>
                      </p>
                      {entry.note && (
                        <p className="text-xs text-[#a0a0a0] bg-[#242424] p-2.5 rounded-lg border border-[#3a3a3a]">
                          {entry.note}
                        </p>
                      )}
                    </div>
                  )}

                  {!isConsumption && !isSpeaking && (
                    <div className="space-y-1">
                      <p className="text-xs text-[#a0a0a0]">
                        Word Count: <strong className="text-[#f0f0f0] font-mono">{entry.wordCount} words</strong>
                      </p>
                      {entry.summary && (
                        <p className="text-xs text-[#a0a0a0] bg-[#242424] p-2.5 rounded-lg border border-[#3a3a3a]">
                          Summary: "{entry.summary}"
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
