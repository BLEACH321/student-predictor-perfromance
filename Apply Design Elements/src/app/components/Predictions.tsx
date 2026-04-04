import { Student } from '../types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PredictionsProps {
  students: Student[];
}

export function Predictions({ students }: PredictionsProps) {
  const sortedStudents = [...students].sort((a, b) => (b.predictedMarks || 0) - (a.predictedMarks || 0));

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6" style={{ color: '#1F2937' }}>
        Performance Predictions
      </h2>

      {students.length === 0 ? (
        <div className="bg-white rounded-xl p-12 shadow-sm text-center">
          <p className="text-gray-500 text-lg">
            No student data available. Add students to view predictions.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedStudents.map((student, index) => {
            const predictedMarks = student.predictedMarks || 0;
            const status =
              predictedMarks >= 85
                ? { label: 'Excellent', color: '#2ECC71', bg: '#E8F5E9' }
                : predictedMarks >= 60
                ? { label: 'Good', color: '#FFA726', bg: '#FFF3E0' }
                : { label: 'Needs Improvement', color: '#E74C3C', bg: '#FFEBEE' };

            return (
              <div key={student.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: '#1F2937' }}>
                      {student.name}
                    </h3>
                    <p className="text-sm text-gray-500">{student.grade}</p>
                  </div>
                  <div
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{ backgroundColor: status.bg, color: status.color }}
                  >
                    #{index + 1}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold" style={{ color: '#4A90E2' }}>
                      {predictedMarks.toFixed(1)}
                    </span>
                    <span className="text-gray-500">%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${predictedMarks}%`,
                        backgroundColor: status.color,
                      }}
                    />
                  </div>
                </div>

                <div
                  className="px-4 py-2 rounded-lg text-center font-semibold mb-4"
                  style={{ backgroundColor: status.bg, color: status.color }}
                >
                  {status.label}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Study Hours:</span>
                    <span className="font-semibold">{student.studyHours}h/week</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Attendance:</span>
                    <span className="font-semibold">{student.attendance}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Assignments:</span>
                    <span className="font-semibold">{student.assignmentScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Previous Marks:</span>
                    <span className="font-semibold">{student.previousMarks}%</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t flex items-center justify-center gap-2">
                  {predictedMarks >= student.previousMarks ? (
                    <>
                      <TrendingUp size={16} style={{ color: '#2ECC71' }} />
                      <span className="text-sm font-semibold" style={{ color: '#2ECC71' }}>
                        Improving
                      </span>
                    </>
                  ) : (
                    <>
                      <TrendingDown size={16} style={{ color: '#E74C3C' }} />
                      <span className="text-sm font-semibold" style={{ color: '#E74C3C' }}>
                        Needs Attention
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
