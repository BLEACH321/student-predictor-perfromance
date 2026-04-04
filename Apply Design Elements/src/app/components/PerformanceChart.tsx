import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { StudentData } from './InputCard';

interface PerformanceChartProps {
  studentData: StudentData | null;
  predictedMarks: number | null;
}

export function PerformanceChart({ studentData, predictedMarks }: PerformanceChartProps) {
  if (!studentData || predictedMarks === null) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl mb-6" style={{ color: '#333333' }}>Performance Comparison</h2>
        <div className="flex items-center justify-center h-64 text-gray-400">
          No data to display
        </div>
      </div>
    );
  }

  const data = [
    {
      name: 'Study Hours',
      value: (studentData.studyHours / 40) * 100, // Normalize to percentage (40 hours as max)
      display: `${studentData.studyHours}h`,
    },
    {
      name: 'Attendance',
      value: studentData.attendance,
      display: `${studentData.attendance}%`,
    },
    {
      name: 'Assignment',
      value: studentData.assignmentScore,
      display: `${studentData.assignmentScore}%`,
    },
    {
      name: 'Previous',
      value: studentData.previousMarks,
      display: `${studentData.previousMarks}%`,
    },
    {
      name: 'Predicted',
      value: predictedMarks,
      display: `${predictedMarks.toFixed(1)}%`,
    },
  ];

  const getColor = (index: number) => {
    if (index === 4) return '#2ECC71'; // Predicted in green
    return '#4A90E2'; // Others in blue
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-md p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-xl mb-6" style={{ color: '#333333' }}>Performance Comparison</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
          <XAxis dataKey="name" stroke="#666666" />
          <YAxis stroke="#666666" />
          <Tooltip
            contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E0E0E0', borderRadius: '8px' }}
            formatter={(value: number, name: string, props: any) => [props.payload.display, name]}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(index)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
