import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Student } from '../types';

interface AnalyticsProps {
  students: Student[];
}

export function Analytics({ students }: AnalyticsProps) {
  const gradeData = students.reduce((acc, student) => {
    const grade = student.grade;
    if (!acc[grade]) {
      acc[grade] = { grade, avgPredicted: 0, count: 0, total: 0 };
    }
    acc[grade].total += student.predictedMarks || 0;
    acc[grade].count += 1;
    acc[grade].avgPredicted = acc[grade].total / acc[grade].count;
    return acc;
  }, {} as Record<string, any>);

  const gradeChartData = Object.values(gradeData);

  const performanceDistribution = students.reduce(
    (acc, student) => {
      const marks = student.predictedMarks || 0;
      if (marks >= 85) acc.excellent++;
      else if (marks >= 70) acc.good++;
      else if (marks >= 60) acc.average++;
      else acc.needsHelp++;
      return acc;
    },
    { excellent: 0, good: 0, average: 0, needsHelp: 0 }
  );

  const distributionData = [
    { category: 'Excellent (≥85%)', count: performanceDistribution.excellent, fill: '#2ECC71' },
    { category: 'Good (70-84%)', count: performanceDistribution.good, fill: '#4A90E2' },
    { category: 'Average (60-69%)', count: performanceDistribution.average, fill: '#FFA726' },
    { category: 'Needs Help (<60%)', count: performanceDistribution.needsHelp, fill: '#E74C3C' },
  ];

  const factorCorrelation = students.length > 0 ? [
    {
      factor: 'Study Hours',
      correlation: students.reduce((sum, s) => sum + s.studyHours, 0) / students.length,
    },
    {
      factor: 'Attendance',
      correlation: students.reduce((sum, s) => sum + s.attendance, 0) / students.length,
    },
    {
      factor: 'Assignments',
      correlation: students.reduce((sum, s) => sum + s.assignmentScore, 0) / students.length,
    },
    {
      factor: 'Previous Marks',
      correlation: students.reduce((sum, s) => sum + s.previousMarks, 0) / students.length,
    },
  ] : [];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6" style={{ color: '#1F2937' }}>
        Analytics
      </h2>

      {students.length === 0 ? (
        <div className="bg-white rounded-xl p-12 shadow-sm text-center">
          <p className="text-gray-500 text-lg">
            No data available for analytics. Add students to view insights.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-4" style={{ color: '#1F2937' }}>
                Performance Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={distributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4A90E2" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-4" style={{ color: '#1F2937' }}>
                Average Predicted Marks by Grade
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={gradeChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="grade" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="avgPredicted"
                    stroke="#4A90E2"
                    strokeWidth={3}
                    name="Avg Predicted Marks"
                    dot={{ fill: '#4A90E2', r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-4" style={{ color: '#1F2937' }}>
              Average Factor Values
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={factorCorrelation}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="factor" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="correlation" fill="#2ECC71" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-4" style={{ color: '#1F2937' }}>
              Top 5 Performers
            </h3>
            <div className="space-y-3">
              {[...students]
                .sort((a, b) => (b.predictedMarks || 0) - (a.predictedMarks || 0))
                .slice(0, 5)
                .map((student, index) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                        style={{ backgroundColor: '#4A90E2' }}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.grade}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold" style={{ color: '#2ECC71' }}>
                        {student.predictedMarks?.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
