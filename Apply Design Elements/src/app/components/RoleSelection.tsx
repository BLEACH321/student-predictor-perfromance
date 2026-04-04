import { GraduationCap, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface RoleSelectionProps {
  onSelectRole: (role: 'student' | 'admin') => void;
}

export function RoleSelection({ onSelectRole }: RoleSelectionProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-student/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-teacher/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-teacher">
            Student Performance Predictor
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Empowering students and educators with data-driven insights to achieve academic excellence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Student Card */}
          <motion.button
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectRole('student')}
            className="group relative bg-card border border-border rounded-3xl p-10 text-left transition-all shadow-premium-lg hover:shadow-premium-xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-student/5 rounded-full -mr-16 -mt-16 group-hover:bg-student/10 transition-colors" />
            
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-student-secondary text-student shadow-sm group-hover:scale-110 transition-transform">
              <GraduationCap size={32} />
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Student</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Access your personalized dashboard, view performance predictions, and discover paths to improvement.
            </p>
            
            <div className="flex items-center gap-2 text-student font-semibold group-hover:gap-4 transition-all">
              <span>Continue as Student</span>
              <span className="text-xl">→</span>
            </div>
          </motion.button>

          {/* Teacher/Admin Card */}
          <motion.button
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectRole('admin')}
            className="group relative bg-card border border-border rounded-3xl p-10 text-left transition-all shadow-premium-lg hover:shadow-premium-xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-teacher/5 rounded-full -mr-16 -mt-16 group-hover:bg-teacher/10 transition-colors" />
            
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-teacher-secondary text-teacher shadow-sm group-hover:scale-110 transition-transform">
              <ShieldCheck size={32} />
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Instructor / Admin</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Manage student datasets, update grading records, and analyze cohort performance trends.
            </p>
            
            <div className="flex items-center gap-2 text-teacher font-semibold group-hover:gap-4 transition-all">
              <span>Continue as Admin</span>
              <span className="text-xl">→</span>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}

