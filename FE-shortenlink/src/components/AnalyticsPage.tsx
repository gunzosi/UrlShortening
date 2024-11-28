import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUrlShortener } from '../hooks/useUrlShortener';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AnalyticsPage: React.FC = () => {
    const { urlCode } = useParams<{ urlCode: string }>();
    const { getUrlUUID, getUrlStats } = useUrlShortener();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const API_PROD_BASE_URL = "http://localhost:8080/";

    useEffect(() => {
        const fetchStats = async () => {
            if (urlCode) {
                const uuid = await getUrlUUID(urlCode);
                if (uuid) {
                    const statsData = await getUrlStats(uuid);
                    setStats(statsData);
                }
                setLoading(false);
            }
        };

        fetchStats().catch(error => {
            console.error('Error fetching stats:', error);
            setLoading(false);
        });
    }, [urlCode, getUrlUUID, getUrlStats]);

    const transformDataForChart = (data: Record<string, number>) => {
        return Object.entries(data).map(([name, value]) => ({ name, value }));
    };

    const browserData = transformDataForChart(stats?.clicksByBrowser || {});
    const osData = transformDataForChart(stats?.clicksByOS || {});
    const dailyClicksData = Object.entries(stats?.clicksByDay || {}).map(
        ([date, clicks]) => ({ name: date, clicks })
    );

    if (loading) return <div className="text-center text-lg mt-10">Loading...</div>;
    if (!stats) return <div className="text-center text-lg mt-10">No analytics data available</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">
                Analytics for URL: &nbsp;
                <a
                    className="hover:underline text-blue-600"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`${API_PROD_BASE_URL}${urlCode}`}
                >
                    {API_PROD_BASE_URL}{urlCode}
                </a>
            </h1>

            <div className="grid grid-cols-3 gap-6">
                {/* Overview */}
                <div className="bg-white p-8 rounded-lg shadow-lg flex items-center justify-center">
                    <div className="text-center">
                        <h3 className="font-semibold text-2xl mb-4">Total Clicks</h3>
                        <p className="text-8xl font-extrabold text-blue-600 leading-tight">
                            {stats.totalClicks}
                        </p>
                    </div>
                </div>

                {/* Browser Chart */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-semibold mb-2">Browsers</h3>
                    <PieChart width={560} height={300}>
                        <Pie
                            data={browserData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                            {browserData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend
                            layout="horizontal"
                            align="center"
                            verticalAlign="bottom"
                            wrapperStyle={{ paddingTop: '10px' }}
                        />
                    </PieChart>

                </div>

                {/* Operating System Chart */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-semibold mb-2">Operating Systems</h3>
                    <PieChart width={560} height={300}>
                        <Pie
                            data={osData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                            {browserData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend
                            layout="horizontal"
                            align="center"
                            verticalAlign="bottom"
                            wrapperStyle={{ paddingTop: '10px' }}
                        />
                    </PieChart>

                </div>

                {/* Daily Clicks Chart */}
                <div className="col-span-3 bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="font-semibold text-2xl text-center mb-6 text-gray-800">
                        Daily Clicks
                    </h3>
                    <div className="flex justify-center">
                        <BarChart width={1200} height={400} data={dailyClicksData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis dataKey="name" tick={{ fontSize: 14 }} />
                            <YAxis tick={{ fontSize: 14 }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#f9f9f9',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                }}
                                itemStyle={{ fontSize: 14 }}
                            />
                            <Legend wrapperStyle={{ fontSize: 14 }} />
                            <Bar dataKey="clicks" fill="#4A90E2" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </div>
                </div>

                {/* Recent Clicks List */}
                <div className="col-span-3 bg-white p-4 rounded-lg shadow">
                    <h3 className="font-semibold mb-4">Recent Clicks</h3>
                    <table className="w-full border-collapse">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">Time</th>
                            <th className="border p-2">Browser</th>
                            <th className="border p-2">IP Address</th>
                            <th className="border p-2">Operating System</th>
                        </tr>
                        </thead>
                        <tbody>
                        {stats.recentClicks.map((click: any) => (
                            <tr key={click.id} className="hover:bg-gray-50">
                                <td className="border p-2">{new Date(click.clickedAt).toLocaleString()}</td>
                                <td className="border p-2">{click.browser}</td>
                                <td className="border p-2">{click.ipAddress}</td>
                                <td className="border p-2">{click.os}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
