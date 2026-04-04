import { useState } from 'react';
import { Student } from '../types';
import { ArrowLeft, User, ChevronRight, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';

interface StudentLoginProps {
  students: Student[];
  onLogin: (student: Student) => void;
  onBack: () => void;
}

export function StudentLogin({ students, onLogin, onBack }: StudentLoginProps) {
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanInput = studentId.toLowerCase().trim().replace(/\s*\(.*?\)\s*/g, '').trim();

    const student = students.find(s =>
      s.id === studentId ||
      s.name.toLowerCase() === studentId.toLowerCase() ||
      s.name.toLowerCase() === cleanInput ||
      s.name.toLowerCase().includes(cleanInput) ||
      cleanInput.includes(s.name.toLowerCase())
    );

    if (student) {
      onLogin(student);
    } else {
      setError('Student not found. Please check your ID or name.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden p-6">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-student/5 rounded-full blur-[100px] -mr-32 -mt-32" />
      
      <div className="w-full max-w-md relative z-10">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="group mb-8 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          <div className="p-2 rounded-full group-hover:bg-muted transition-colors">
            <ArrowLeft size={18} />
          </div>
          Back to Selection
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card border border-border/50 rounded-3xl shadow-premium-xl overflow-hidden"
        >
          {/* Header/Banner */}
          <div className="h-2 bg-student" />
          
          <div className="p-10">
            <div className="w-20 h-20 rounded-2xl bg-student-secondary flex items-center justify-center mb-8 mx-auto shadow-sm">
              <GraduationCap size={40} className="text-student" />
            </div>

            <h2 className="text-3xl font-bold text-center mb-2">Student Dashboard Access</h2>
            <p className="text-muted-foreground text-center mb-10">
              Welcome back! Access your personalized performance metrics.
            </p>

            {students.length === 0 ? (
              <div className="text-center py-10 bg-muted/30 rounded-2xl border border-dashed border-border/50">
                <p className="font-semibold text-foreground mb-2">No Students Found</p>
                <p className="text-sm text-muted-foreground max-w-[200px] mx-auto">
                  Ask your instructor to add your profile to the database.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground/80 pl-1">
                    Student Identity
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-student">
                      <User size={20} className="text-muted-foreground" />
                    </div>
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => {
                        setStudentId(e.target.value);
                        setError('');
                      }}
                      required
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-muted/30 border border-transparent focus:bg-card focus:border-student/30 focus:ring-4 focus:ring-student/5 outline-none transition-all placeholder:text-muted-foreground/50"
                      placeholder="Enter full name or ID"
                    />
                  </div>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-2xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20 flex items-start gap-3"
                  >
                    <span className="mt-0.5">⚠️</span>
                    {error}
                  </motion.div>
                )}


                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-student text-white font-bold text-lg shadow-lg shadow-student/25 hover:shadow-xl hover:shadow-student/30 flex items-center justify-center gap-2 transition-all"
                >
                  Enter Dashboard
                  <ChevronRight size={18} />
                </motion.button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

