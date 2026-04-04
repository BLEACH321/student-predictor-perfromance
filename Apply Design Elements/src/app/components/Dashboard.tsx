import { Users, TrendingUp, Award, BookOpen } from 'lucide-react';
import { Student } from '../types';

interface DashboardProps {
  students: Student[];
}

export function Dashboard({ students }: DashboardProps) {
  const totalStudents = students.length;
  const avgPredictedMarks = students.length > 0
    ? students.reduce((sum, s) => sum + (s.predictedMarks || 0), 0) / students.length
    : 0;
  const topPerformers = students.filter(s => (s.predictedMarks || 0) >= 85).length;
  const needsAttention = students.filter(s => (s.predictedMarks || 0) < 60).length;

  const stats = [
    {
      title: 'Total Students',
      value: totalStudents,
      icon: Users,
      color: '#4A90E2',
      bgColor: '#E3F2FD',
    },
    {
      title: 'Average Predicted Score',
      value: avgPredictedMarks.toFixed(1) + '%',
      icon: TrendingUp,
      color: '#2ECC71',
      bgColor: '#E8F5E9',
    },
    {
      title: 'Top Performers',
      value: topPerformers,
      icon: Award,
      color: '#FFA726',
      bgColor: '#FFF3E0',
    },
    {
      title: 'Needs Attention',
      value: needsAttention,
      icon: BookOpen,
      color: '#E74C3C',
      bgColor: '#FFEBEE',
    },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6" style={{ color: '#1F2937' }}>
        Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: stat.bgColor }}
                >
                  <Icon size={24} style={{ color: stat.color }} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold" style={{ color: stat.color }}>
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

    </div>
  );
}
