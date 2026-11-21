import React, { useState, useEffect, useMemo } from 'react';
import { loadApiLogs } from '../../services/apiService';
import type { ApiLog } from '../../types';
import { useTheme } from '../../ThemeContext';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center">
        <div className="p-3 rounded-full bg-cyan-100 dark:bg-cyan-900/50 mr-4">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const BarChart: React.FC<{ title: string; data: { label: string; value: number }[]; theme: 'light' | 'dark' }> = ({ title, data, theme }) => {
    const maxValue = Math.max(...data.map(d => d.value), 0);
    if (data.length === 0) return null;
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">{title}</h3>
            <div className="space-y-3">
                {data.map(({ label, value }) => (
                    <div key={label} className="flex items-center" title={`${label}: ${value}`}>
                        <div className="w-1/3 text-xs text-gray-600 dark:text-gray-400 truncate pr-2">{label}</div>
                        <div className="w-2/3 flex items-center">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                                <div
                                    className="bg-cyan-500 h-4 rounded-full transition-all duration-500"
                                    style={{ width: `${maxValue > 0 ? (value / maxValue) * 100 : 0}%` }}
                                    aria-valuenow={value}
                                    aria-valuemin={0}
                                    aria-valuemax={maxValue}
                                    role="progressbar"
                                ></div>
                            </div>
                            <span className="text-xs font-semibold ml-2 text-gray-700 dark:text-gray-300">{value}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


const ApiInsightsDashboard: React.FC = () => {
    const [logs, setLogs] = useState<ApiLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { theme } = useTheme();

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const apiLogs = await loadApiLogs();
                setLogs(apiLogs);
            } catch (err) {
                setError("Failed to fetch API logs. Please check the backend server.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const stats = useMemo(() => {
        const totalCalls = logs.length;
        const successfulCalls = logs.filter(log => log.isSuccess).length;
        const failedCalls = totalCalls - successfulCalls;
        const totalTokens = logs.reduce((sum, log) => sum + (log.tokenUsage?.totalTokens || 0), 0);
        
        const callsByEndpoint = logs.reduce((acc, log) => {
            const endpoint = log.apiEndpoint.replace('/api/', '');
            acc[endpoint] = (acc[endpoint] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const callsByDate = logs.reduce((acc, log) => {
            const date = new Date(log.timestamp).toLocaleDateString();
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        return {
            totalCalls,
            successfulCalls,
            failedCalls,
            totalTokens: totalTokens.toLocaleString(),
            callsByEndpoint: Object.entries(callsByEndpoint).map(([label, value]) => ({ label, value })).sort((a,b) => b.value - a.value),
            callsByDate: Object.entries(callsByDate).map(([label, value]) => ({ label, value })).sort((a,b) => new Date(a.label).getTime() - new Date(b.label).getTime()),
        };
    }, [logs]);

    const handleDownloadCSV = () => {
        if (logs.length === 0) return;
        const headers = "logId,transactionId,timestamp,apiEndpoint,isSuccess,durationMs,totalTokens\n";
        const csvContent = logs.map(log => 
            `"${log.logId}","${log.transactionId}","${log.timestamp}","${log.apiEndpoint}",${log.isSuccess},${log.durationMs},${log.tokenUsage?.totalTokens || 0}`
        ).join("\n");
        const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "api_usage_report.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadPDF = () => {
        if (logs.length === 0 || typeof (window as any).jspdf === 'undefined') return;
        const { jsPDF } = (window as any).jspdf;
        const doc = new jsPDF();
        
        doc.setFontSize(20).text("API Usage Report", 14, 22);
        doc.setFontSize(12).text(`Total Calls: ${stats.totalCalls}`, 14, 32);
        doc.setFontSize(12).text(`Total Tokens: ${stats.totalTokens}`, 14, 40);

        (doc as any).autoTable({
            startY: 50,
            head: [['Timestamp', 'Endpoint', 'Success', 'Tokens', 'Duration (ms)']],
            body: logs.map(log => [
                new Date(log.timestamp).toLocaleString(),
                log.apiEndpoint,
                log.isSuccess ? 'Yes' : 'No',
                log.tokenUsage?.totalTokens || 0,
                log.durationMs
            ]),
            theme: 'grid',
            headStyles: { fillColor: [22, 160, 133] },
        });

        doc.save("api_usage_report.pdf");
    };

    if (isLoading) {
        return <div className="flex h-full items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div></div>;
    }
    if (error) {
        return <div className="text-center py-10 text-red-500 bg-red-100 dark:bg-red-900/30 p-4 rounded-md">{error}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">API Usage Insights</h2>
                <div className="space-x-2">
                    <button onClick={handleDownloadPDF} className="px-3 py-1.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors">Download PDF</button>
                    <button onClick={handleDownloadCSV} className="px-3 py-1.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors">Download CSV</button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total API Calls" value={stats.totalCalls} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>} />
                <StatCard title="Total Tokens Used" value={stats.totalTokens} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>} />
                <StatCard title="Successful Calls" value={stats.successfulCalls} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                <StatCard title="Failed Calls" value={stats.failedCalls} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BarChart title="API Calls by Endpoint" data={stats.callsByEndpoint} theme={theme} />
                <BarChart title="API Calls by Date" data={stats.callsByDate} theme={theme} />
            </div>
        </div>
    );
};

export default ApiInsightsDashboard;