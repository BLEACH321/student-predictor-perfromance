import { useState } from 'react';
import { ArrowLeft, ShieldCheck, Lock, Mail, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface TeacherLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

export function TeacherLogin({ onLogin, onBack }: TeacherLoginProps) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      formData.username === ADMIN_CREDENTIALS.username &&
      formData.password === ADMIN_CREDENTIALS.password
    ) {
      onLogin();
    } else {
      setError('Invalid username or password. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden p-6">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-teacher/5 rounded-full blur-[100px] -ml-32 -mb-32" />
      
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
          {/* Header indicator */}
          <div className="h-2 bg-gradient-to-r from-teacher to-orange-600" />
          
          <div className="p-10">
            <div className="w-20 h-20 rounded-2xl bg-teacher-secondary flex items-center justify-center mb-8 mx-auto shadow-sm">
              <ShieldCheck size={40} className="text-teacher" />
            </div>

            <h2 className="text-3xl font-bold text-center mb-2">Instructor Access</h2>
            <p className="text-muted-foreground text-center mb-10">
              Authorized personnel only. Access your administrative tools.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground/80 pl-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-teacher transition-colors">
                    <Mail size={18} className="text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-muted/30 border border-transparent focus:bg-card focus:border-teacher/30 focus:ring-4 focus:ring-teacher/5 outline-none transition-all placeholder:text-muted-foreground/40"
                    placeholder="Enter your username"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center pl-1">
                  <label className="text-sm font-bold text-foreground/80">
                    Security Password
                  </label>
                  <button type="button" className="text-xs font-bold text-teacher hover:underline">
                    Forgot?
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-teacher transition-colors">
                    <Lock size={18} className="text-muted-foreground" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-muted/30 border border-transparent focus:bg-card focus:border-teacher/30 focus:ring-4 focus:ring-teacher/5 outline-none transition-all placeholder:text-muted-foreground/40"
                    placeholder="••••••••"
                    autoComplete="current-password"
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
                className="w-full py-4 rounded-2xl bg-teacher text-white font-bold text-lg shadow-lg shadow-teacher/25 hover:shadow-xl hover:shadow-teacher/30 flex items-center justify-center gap-2 transition-all"
              >
                Launch Admin Portal
                <ChevronRight size={18} />
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

