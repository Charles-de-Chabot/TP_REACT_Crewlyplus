import React from 'react';

const RevenueChart = ({ theme, data = [0, 0, 0, 0, 0, 0, 0] }) => {
    // We need to scale the data to fit the 150px height
    const maxVal = Math.max(...data, 100); // Minimum scale of 100 to avoid flat lines
    const revenuePoints = data.map(v => (v / maxVal) * 100);
    
    const chartPath = revenuePoints.map((p, i) => `${i * 100},${150 - p}`).join(' L ');

    return (
        <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[3rem] backdrop-blur-xl relative overflow-hidden">
            <h3 className="text-xl font-black text-white mb-8">Évolution des revenus</h3>
            <div className="h-48 w-full">
                <svg viewBox="0 0 600 150" className="w-full h-full overflow-visible">
                    <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" className={theme.primary} />
                            <stop offset="100%" stopColor="currentColor" stopOpacity="0" className={theme.primary} />
                        </linearGradient>
                    </defs>
                    
                    {/* Background area */}
                    {chartPath && (
                        <path 
                            d={`M 0,150 L 0,${150 - revenuePoints[0]} L ${chartPath} L 600,150 Z`} 
                            fill="url(#chartGradient)"
                        />
                    )}

                    {/* Line */}
                    {chartPath && (
                        <path 
                            d={`M 0,${150 - revenuePoints[0]} L ${chartPath}`} 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="4" 
                            className={theme.primary}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    )}

                    {/* Data Points */}
                    {revenuePoints.map((p, i) => (
                        <g key={i} className="group">
                            <circle 
                                cx={i * 100} 
                                cy={150 - p} 
                                r="6" 
                                className={`${theme.primary.replace('text', 'fill')} stroke-slate-950 stroke-2 cursor-pointer transition-all hover:r-8`} 
                            />
                            {/* Simple tooltip on hover could be added here */}
                        </g>
                    ))}
                </svg>
            </div>
            <div className="flex justify-between mt-6 px-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                <span>-6 mois</span><span>-5</span><span>-4</span><span>-3</span><span>-2</span><span>-1</span><span>Ce mois</span>
            </div>
        </div>
    );
};

export default RevenueChart;
