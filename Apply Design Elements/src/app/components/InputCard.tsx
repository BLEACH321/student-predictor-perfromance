import { motion } from 'motion/react';

interface InputCardProps {
  onPredict: (data: StudentData) => void;
}

export interface StudentData {
  studyHours: number;
  attendance: number;
  assignmentScore: number;
  previousMarks: number;
}

export function InputCard({ onPredict }: InputCardProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: StudentData = {
      studyHours: Number(formData.get('studyHours')),
      attendance: Number(formData.get('attendance')),
      assignmentScore: Number(formData.get('assignmentScore')),
      previousMarks: Number(formData.get('previousMarks')),
    };
    onPredict(data);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl mb-6" style={{ color: '#333333' }}>Student Information</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="studyHours" className="block text-sm mb-2" style={{ color: '#666666' }}>
            Study Hours (per week)
          </label>
          <input
            type="number"
            id="studyHours"
            name="studyHours"
            min="0"
            max="168"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
            style={{ focusRingColor: '#4A90E2' }}
          />
        </div>
        <div>
          <label htmlFor="attendance" className="block text-sm mb-2" style={{ color: '#666666' }}>
            Attendance (%)
          </label>
          <input
            type="number"
            id="attendance"
            name="attendance"
            min="0"
            max="100"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
            style={{ focusRingColor: '#4A90E2' }}
          />
        </div>
        <div>
          <label htmlFor="assignmentScore" className="block text-sm mb-2" style={{ color: '#666666' }}>
            Assignment Score (%)
          </label>
          <input
            type="number"
            id="assignmentScore"
            name="assignmentScore"
            min="0"
            max="100"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
            style={{ focusRingColor: '#4A90E2' }}
          />
        </div>
        <div>
          <label htmlFor="previousMarks" className="block text-sm mb-2" style={{ color: '#666666' }}>
            Previous Marks (%)
          </label>
          <input
            type="number"
            id="previousMarks"
            name="previousMarks"
            min="0"
            max="100"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
            style={{ focusRingColor: '#4A90E2' }}
          />
        </div>
        <motion.button
          type="submit"
          className="w-full py-3 rounded-lg text-white transition-all"
          style={{ backgroundColor: '#4A90E2' }}
          whileHover={{ scale: 1.02, backgroundColor: '#3A7BC8' }}
          whileTap={{ scale: 0.98 }}
        >
          Predict Performance
        </motion.button>
      </form>
    </div>
  );
}
