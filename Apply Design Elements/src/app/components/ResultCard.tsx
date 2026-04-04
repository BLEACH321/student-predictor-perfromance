import { motion } from 'motion/react';

interface ResultCardProps {
  predictedMarks: number | null;
}

export function ResultCard({ predictedMarks }: ResultCardProps) {
  if (predictedMarks === null) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl mb-6" style={{ color: '#333333' }}>Prediction Results</h2>
        <div className="flex items-center justify-center h-48 text-gray-400">
          Enter student data and click Predict to see results
        </div>
      </div>
    );
  }

  const percentage = Math.min(100, Math.max(0, predictedMarks));
  const status = percentage >= 75 ? 'Excellent' : percentage >= 60 ? 'Good' : percentage >= 50 ? 'Average' : 'Needs Improvement';
  const statusColor = percentage >= 75 ? '#2ECC71' : percentage >= 60 ? '#4A90E2' : percentage >= 50 ? '#F39C12' : '#E74C3C';

  return (
    <motion.div
      className="bg-white rounded-xl shadow-md p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl mb-6" style={{ color: '#333333' }}>Prediction Results</h2>

      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <div className="text-6xl mb-2" style={{ color: statusColor }}>
            {percentage.toFixed(1)}%
          </div>
          <div className="text-lg" style={{ color: '#666666' }}>Predicted Marks</div>
        </motion.div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2" style={{ color: '#666666' }}>
          <span>Progress</span>
          <span>{percentage.toFixed(1)}%</span>
        </div>
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: statusColor }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#F5F7FA' }}>
        <div className="text-sm" style={{ color: '#666666' }}>Status</div>
        <div className="text-lg mt-1" style={{ color: statusColor }}>{status}</div>
      </div>
    </motion.div>
  );
}
