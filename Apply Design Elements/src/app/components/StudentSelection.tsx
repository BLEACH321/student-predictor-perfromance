import { Student } from '../types';
import { User, ArrowLeft } from 'lucide-react';

interface StudentSelectionProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onBack: () => void;
}

export function StudentSelection({ students, onSelectStudent, onBack }: StudentSelectionProps) {
  if (students.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F7FA' }}>
        <div className="text-center">
          <button
            onClick={onBack}
            className="mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={20} />
            Back to Role Selection
          </button>
          <div className="bg-white rounded-2xl p-12 shadow-lg">
            <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: '#FFF3E0' }}>
              <User size={48} style={{ color: '#FF9800' }} />
            </div>
            <h2 className="text-2xl mb-4" style={{ color: '#333' }}>
              No Students Found
            </h2>
            <p className="text-gray-600 mb-6">
              Please contact your teacher to add your profile to the system.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#F5F7FA' }}>
      <div className="max-w-5xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Role Selection
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl mb-2" style={{ color: '#4A90E2' }}>
            Select Your Profile
          </h1>
          <p className="text-gray-600">Choose your name to view your performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <button
              key={student.id}
              onClick={() => onSelectStudent(student)}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all transform hover:scale-105 text-left"
            >
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#E3F2FD' }}>
                <User size={32} style={{ color: '#4A90E2' }} />
              </div>
              <h3 className="text-xl text-center mb-2" style={{ color: '#333' }}>
                {student.name}
              </h3>
              <div className="text-center">
                <span className="inline-block px-3 py-1 rounded-full text-sm" style={{ backgroundColor: '#E3F2FD', color: '#4A90E2' }}>
                  Grade {student.grade}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
