import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
// import { db } from '../lib/database';
import { FeatherService } from '../lib/featherService';
import { LanguageService } from '../lib/language';
import { useTranslations } from '../lib/translations';

interface ChartData {
  date: string;
  mood: number;
  activities: number;
}

interface FeatherData {
  type: string;
  count: number;
  color: string;
}

export const Impact: React.FC = () => {
  const currentLanguage = LanguageService.getCurrentLanguage();
  const t = useTranslations(currentLanguage);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [featherData, setFeatherData] = useState<FeatherData[]>([]);
  const [totalFeathers, setTotalFeathers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load real feather data
        const totalFeathers = await FeatherService.getTotalFeathers();
        setTotalFeathers(totalFeathers);

        // Load feather data by type
        const breathingFeathers = await FeatherService.getFeathersByType('task_completion');
        const checkinFeathers = await FeatherService.getFeathersByType('daily_checkin');
        const reflectionFeathers = await FeatherService.getFeathersByType('reflection');

        const realFeatherData: FeatherData[] = [
          { type: t.pieTasksCompleted, count: breathingFeathers.length, color: '#00A29D' },
          { type: t.pieCheckins, count: checkinFeathers.length, color: '#FFCC66' },
          { type: t.pieReflections, count: reflectionFeathers.length, color: '#05585F' },
        ];

        // Mock chart data for demonstration
        const mockChartData: ChartData[] = [
          { date: '2024-01-01', mood: 7, activities: 2 },
          { date: '2024-01-02', mood: 6, activities: 3 },
          { date: '2024-01-03', mood: 8, activities: 1 },
          { date: '2024-01-04', mood: 7, activities: 4 },
          { date: '2024-01-05', mood: 9, activities: 2 },
        ];

        setChartData(mockChartData);
        setFeatherData(realFeatherData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p className="text-neutral-600">{currentLanguage === 'ar' ? 'جاري تحميل البيانات...' : 'Loading data...'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-primary-900 mb-4">{t.yourProgress}</h1>
        <p className="text-neutral-600">{t.trackYourJourney}</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <h2 className="text-xl font-semibold mb-4">{t.moodTrend}</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="#00A29D" 
                  strokeWidth={2}
                  dot={{ fill: '#00A29D', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <h2 className="text-xl font-semibold mb-4">{t.feathersEarnedTitle}</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={featherData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, count }) => `${type}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {featherData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid md:grid-cols-3 gap-4 mb-8"
      >
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-500 mb-2">12</div>
          <div className="text-neutral-600">{t.sessionsCompleted}</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-accent-500 mb-2">8</div>
          <div className="text-neutral-600">{t.consecutiveDays}</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-700 mb-2">{totalFeathers}</div>
          <div className="text-neutral-600">{t.totalFeathers}</div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <button
          onClick={() => window.location.href = '/'}
          className="btn-primary"
        >
          {t.startNewSession}
        </button>
      </motion.div>
    </div>
  );
};
