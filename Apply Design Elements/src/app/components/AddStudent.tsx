import { useState, useEffect } from 'react';
import { Student, Subject } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { UserPlus, BookOpen, GraduationCap, CheckCircle } from 'lucide-react';

interface AddStudentProps {
  onAddStudent: (student: Omit<Student, 'id' | 'predictedMarks'>) => void;
}

const GRADE_SUBJECTS: Record<any, string[]> = {
  '10': ['Mathematics', 'Science', 'Social Studies', 'English', 'Language'],
  '11': ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English'],
  '12': ['Physics', 'Chemistry', 'Mathematics', 'Comp Science', 'English'],
  'Engineering': ['Eng Math', 'Digital Logic', 'OOPs', 'Data Structures', 'OS'],
};

export function AddStudent({ onAddStudent }: AddStudentProps) {
  const [formData, setFormData] = useState({
    name: '',
    grade: '' as Student['grade'],
    studyHours: '',
    attendance: '',
    assignmentScore: '',
    previousMarks: '',
  });

  const [subjectMarks, setSubjectMarks] = useState<Record<string, string>>({});

  useEffect(() => {
    if (formData.grade && GRADE_SUBJECTS[formData.grade]) {
      const initialMarks: Record<string, string> = {};
      GRADE_SUBJECTS[formData.grade].forEach(sub => {
        initialMarks[sub] = '';
      });
      setSubjectMarks(initialMarks);
    }
  }, [formData.grade]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const studyHours = parseFloat(formData.studyHours);
    const attendance = parseFloat(formData.attendance);
    const assignmentScore = parseFloat(formData.assignmentScore);
    const previousMarks = parseFloat(formData.previousMarks);

    const subjects: Subject[] = Object.entries(subjectMarks).map(([name, score]) => ({
      name,
      score: parseFloat(score) || 0
    }));

    const student = {
      name: formData.name,
      grade: formData.grade,
      studyHours,
      attendance,
      assignmentScore,
      previousMarks,
      subjects,
    };

    onAddStudent(student);

    // Reset form
    setFormData({
      name: '',
      grade: '' as any,
      studyHours: '',
      attendance: '',
      assignmentScore: '',
      previousMarks: '',
    });
    setSubjectMarks({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubjectChange = (subject: string, value: string) => {
    setSubjectMarks({
      ...subjectMarks,
      [subject]: value
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-12"
    >
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
          <UserPlus size={28} />
        </div>
        <div>
          <h2 className="text-3xl font-black tracking-tight text-foreground">Add New Student</h2>
          <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest">Enrollment Portal</p>
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-[2.5rem] p-10 shadow-premium-xl max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Section 1: Basic Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">1</span>
              Identity & Classification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground/70 pl-1">Full Identity</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-muted/30 border border-transparent focus:bg-card focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                  placeholder="e.g. Alexander Thorne"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground/70 pl-1">Academic Grade</label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-muted/30 border border-transparent focus:bg-card focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select Grade Level</option>
                  <option value="10">Grade 10</option>
                  <option value="11">Grade 11</option>
                  <option value="12">Grade 12</option>
                  <option value="Engineering">Engineering</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Subject Marks (Conditional) */}
          <AnimatePresence>
            {formData.grade && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-6 overflow-hidden"
              >
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-teacher/10 text-teacher flex items-center justify-center text-xs">2</span>
                  Subject Performance (Recent)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 bg-muted/20 p-6 rounded-[2rem] border border-border/50">
                  {GRADE_SUBJECTS[formData.grade].map((sub) => (
                    <div key={sub} className="space-y-2">
                      <label className="text-[11px] font-black text-muted-foreground uppercase pl-1">{sub}</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={subjectMarks[sub] || ''}
                        onChange={(e) => handleSubjectChange(sub, e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-card border border-border/50 focus:border-teacher/30 focus:ring-4 focus:ring-teacher/5 outline-none transition-all font-bold tabular-nums"
                        placeholder="Marks / 100"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Section 3: Performance Metrics */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-status-excellent/10 text-status-excellent flex items-center justify-center text-xs">3</span>
              Engagement Metrics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-muted-foreground uppercase pl-1">Study Hours (Wk)</label>
                <input
                  type="number"
                  name="studyHours"
                  value={formData.studyHours}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-3.5 rounded-xl bg-muted/30 border border-transparent focus:bg-card focus:border-primary/30 outline-none transition-all font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-muted-foreground uppercase pl-1">Attendance %</label>
                <input
                  type="number"
                  name="attendance"
                  value={formData.attendance}
                  onChange={handleChange}
                  required
                  min="0"
                  max="100"
                  className="w-full px-4 py-3.5 rounded-xl bg-muted/30 border border-transparent focus:bg-card focus:border-primary/30 outline-none transition-all font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-muted-foreground uppercase pl-1">Assignment Avg</label>
                <input
                  type="number"
                  name="assignmentScore"
                  value={formData.assignmentScore}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3.5 rounded-xl bg-muted/30 border border-transparent focus:bg-card focus:border-primary/30 outline-none transition-all font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-muted-foreground uppercase pl-1">Previous GPA %</label>
                <input
                  type="number"
                  name="previousMarks"
                  value={formData.previousMarks}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3.5 rounded-xl bg-muted/30 border border-transparent focus:bg-card focus:border-primary/30 outline-none transition-all font-bold"
                />
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            className="w-full py-5 rounded-[1.5rem] bg-primary text-white font-bold text-xl shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 flex items-center justify-center gap-3 transition-all"
          >
            <CheckCircle size={24} />
            Add Student & Synthesize Analysis
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
