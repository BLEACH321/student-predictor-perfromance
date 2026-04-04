import { Student } from '../types';
import { ArrowLeft, TrendingUp, Clock, FileCheck, Award, Target, BrainCircuit, Sparkles, AlertCircle, GraduationCap, BookOpen } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Cell } from 'recharts';
import { motion } from 'motion/react';

interface StudentDashboardProps {
  student: Student;
  onBack: () => void;
}

export function StudentDashboard({ student, onBack }: StudentDashboardProps) {
  const getStatusInfo = (marks: number) => {
    if (marks >= 85) return { color: 'var(--status-excellent)', label: 'Outstanding', bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.2)' };
    if (marks >= 70) return { color: 'var(--status-good)', label: 'Strong', bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.2)' };
    if (marks >= 60) return { color: 'var(--status-average)', label: 'Moderate', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.2)' };
    return { color: 'var(--status-poor)', label: 'At Risk', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.2)' };
  };

  const predictedMarks = student.predictedMarks || 0;
  const status = getStatusInfo(predictedMarks);

  const performanceData = [
    { name: 'Study', value: Math.min((student.studyHours / 40) * 100, 100), color: 'var(--student-primary)' },
    { name: 'Attend', value: student.attendance, color: 'var(--status-excellent)' },
    { name: 'Assign', value: student.assignmentScore, color: 'var(--status-average)' },
    { name: 'Prev', value: student.previousMarks, color: '#EC4899' },
  ];

  const radarData = (student.subjects && student.subjects.length > 0)
    ? student.subjects.map(s => ({ subject: s.name, value: s.score, fullMark: 100 }))
    : [
        { subject: 'Study', value: Math.min((student.studyHours / 40) * 100, 100), fullMark: 100 },
        { subject: 'Attendance', value: student.attendance, fullMark: 100 },
        { subject: 'Assignments', value: student.assignmentScore, fullMark: 100 },
        { subject: 'Previous', value: student.previousMarks, fullMark: 100 },
      ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-background pb-12 pt-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="group mb-8 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all font-medium py-2 px-3 hover:bg-card rounded-xl border border-transparent hover:border-border/50"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Selection
        </motion.button>

        {/* Hero Header Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-card border border-border/50 rounded-[2.5rem] p-8 md:p-12 shadow-premium-xl mb-10 overflow-hidden"
        >
          {/* Background Highlight */}
          <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-student/10 to-transparent pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-student/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-student-secondary text-student border border-student/10 text-sm font-bold mb-6 shadow-sm">
                <Sparkles size={16} />
                AI-Powered Insights
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-3xl font-extrabold mb-2 leading-tight">
                Welcome, <span className="text-student">{student.name.split(' ')[0]}</span>.
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground mb-6">
                <GraduationCap size={18} />
                <span className="font-bold text-lg">{student.grade === 'Engineering' ? 'Engineering Program' : `Grade ${student.grade} Student`}</span>
              </div>
              <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                We've synthesized your academic trajectory based on recent performance across multiple subjects and engagement metrics.
              </p>
            </div>

            <div className="flex items-center gap-8 bg-white/50 backdrop-blur-md p-8 rounded-[2rem] border border-white/50 shadow-premium-lg">
              <div className="text-center">
                <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3">Predicted Mastery</div>
                <div className="text-7xl font-black tabular-nums tracking-tighter" style={{ color: status.color }}>
                  {predictedMarks.toFixed(1)}<span className="text-3xl opacity-60">%</span>
                </div>
                <div className="mt-4 px-5 py-1.5 rounded-full text-sm font-bold border flex items-center justify-center gap-2" 
                     style={{ backgroundColor: status.bg, color: status.color, borderColor: status.border }}>
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: status.color }} />
                  {status.label} Status
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
        >
          {/* Card 1: Study Hours */}
          <motion.div variants={item} className="bg-card border border-border/50 p-6 rounded-3xl shadow-premium-md hover:shadow-premium-lg transition-all group">
            <div className="flex items-start justify-between mb-8">
              <div className="w-14 h-14 rounded-2xl bg-student-secondary flex items-center justify-center text-student group-hover:scale-110 transition-transform">
                <Clock size={28} />
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-muted-foreground uppercase">Weekly Commitment</p>
                <h3 className="text-3xl font-black">{student.studyHours}h</h3>
              </div>
            </div>
            <div className="space-y-4">
              <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((student.studyHours / 40) * 100, 100)}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-student rounded-full"
                />
              </div>
            </div>
          </motion.div>

          {/* Card 2: Attendance */}
          <motion.div variants={item} className="bg-card border border-border/50 p-6 rounded-3xl shadow-premium-md hover:shadow-premium-lg transition-all group">
            <div className="flex items-start justify-between mb-8">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                <Target size={28} />
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-muted-foreground uppercase">Presence Rate</p>
                <h3 className="text-3xl font-black">{student.attendance}%</h3>
              </div>
            </div>
            <div className="space-y-4">
              <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${student.attendance}%` }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
            </div>
          </motion.div>

          {/* Card 3: Assignments */}
          <motion.div variants={item} className="bg-card border border-border/50 p-6 rounded-3xl shadow-premium-md hover:shadow-premium-lg transition-all group">
            <div className="flex items-start justify-between mb-8">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                <FileCheck size={28} />
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-muted-foreground uppercase">Practical Score</p>
                <h3 className="text-3xl font-black">{student.assignmentScore}%</h3>
              </div>
            </div>
            <div className="space-y-4">
              <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${student.assignmentScore}%` }}
                  transition={{ duration: 1, delay: 0.7 }}
                  className="h-full bg-amber-500 rounded-full"
                />
              </div>
            </div>
          </motion.div>

          {/* Card 4: Previous Performance */}
          <motion.div variants={item} className="bg-card border border-border/50 p-6 rounded-3xl shadow-premium-md hover:shadow-premium-lg transition-all group">
            <div className="flex items-start justify-between mb-8">
              <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600 group-hover:scale-110 transition-transform">
                <Award size={28} />
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-muted-foreground uppercase">Academic Base</p>
                <h3 className="text-3xl font-black">{student.previousMarks}%</h3>
              </div>
            </div>
            <div className="space-y-4">
              <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${student.previousMarks}%` }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="h-full bg-pink-500 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border/50 rounded-[2rem] p-8 shadow-premium-lg"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <div className="w-2 h-6 bg-student rounded-full" />
                Performance Distribution
              </h3>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fontWeight: 600, fill: '#64748B' }} 
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#64748B' }}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: 'var(--shadow-lg)' }}
                  />
                  <Bar 
                    dataKey="value" 
                    radius={[12, 12, 12, 12]} 
                    barSize={40}
                  >
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Radar Chart for Subject/Skill performance */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card border border-border/50 rounded-[2rem] p-8 shadow-premium-lg"
          >
             <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <div className="w-2 h-6 bg-emerald-500 rounded-full" />
                {student.subjects?.length ? 'Subject Analysis' : 'Competency Matrix'}
              </h3>
            </div>
            <div className="h-[350px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="rgba(0,0,0,0.05)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Student Performance"
                    dataKey="value"
                    stroke="var(--student-primary)"
                    fill="var(--student-primary)"
                    fillOpacity={0.15}
                    strokeWidth={4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Subject-Wise Table Section (Conditional) */}
        {student.subjects && student.subjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="bg-card border border-border/50 rounded-[2rem] p-8 shadow-premium-lg mb-10"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <BookOpen size={22} />
              </div>
              <h3 className="text-xl font-bold">Comprehensive Subject Breakdown</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {student.subjects.map((sub, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-muted/20 border border-border/50 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{idx + 1}. Module</p>
                    <h4 className="font-bold text-foreground">{sub.name}</h4>
                  </div>
                  <div className="text-right">
                    <span className={`text-2xl font-black ${sub.score >= 80 ? 'text-emerald-500' : sub.score >= 60 ? 'text-amber-500' : 'text-rose-500'}`}>
                      {sub.score}<span className="text-xs opacity-50 ml-0.5">%</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recommendations Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card border border-border/50 rounded-[2.5rem] p-8 md:p-10 shadow-premium-lg border-t-4 border-t-student"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-student/10 flex items-center justify-center text-student">
              <TrendingUp size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Personalized Growth Roadmap</h3>
              <p className="text-sm text-muted-foreground uppercase font-bold tracking-widest">Augmented Intelligence Strategy</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {student.studyHours < 20 && (
              <div className="p-6 rounded-[2rem] bg-amber-50/50 border border-amber-100 flex gap-4">
                <div className="text-2xl mt-1">⏰</div>
                <div className="space-y-2">
                  <h4 className="font-bold text-amber-900">Optimization Required</h4>
                  <p className="text-sm text-amber-800/80 leading-relaxed">
                    Increasing your weekly focus to <strong>25 hours</strong> could yield an immediate <strong>12%</strong> uplift in exam-ready mastery.
                  </p>
                </div>
              </div>
            )}
            
            {student.attendance < 85 && (
              <div className="p-6 rounded-[2rem] bg-rose-50/50 border border-rose-100 flex gap-4">
                <div className="text-2xl mt-1"><AlertCircle className="text-rose-600" /></div>
                <div className="space-y-2">
                  <h4 className="font-bold text-rose-900">Consistency Deficit</h4>
                  <p className="text-sm text-rose-800/80 leading-relaxed">
                    Presence is at <strong>{student.attendance}%</strong>. High-impact modules require continuous engagement to maintain conceptual flow.
                  </p>
                </div>
              </div>
            )}

            {student.assignmentScore < 80 && (
              <div className="p-6 rounded-[2rem] bg-indigo-50/50 border border-indigo-100 flex gap-4">
                <div className="text-2xl mt-1">📝</div>
                <div className="space-y-2">
                  <h4 className="font-bold text-indigo-900">Module Submission</h4>
                  <p className="text-sm text-indigo-800/80 leading-relaxed">
                    Refining assignment precision should be a priority. We suggest a peer-review protocol before final synthesis.
                  </p>
                </div>
              </div>
            )}

            {(!student.studyHours || student.studyHours >= 20) && (!student.attendance || student.attendance >= 85) && (!student.assignmentScore || student.assignmentScore >= 80) && (
              <div className="p-6 rounded-[2rem] bg-emerald-50/50 border border-emerald-100 flex gap-4 col-span-full">
                <div className="text-2xl mt-1">🚀</div>
                <div className="space-y-2">
                  <h4 className="font-bold text-emerald-900">Strategic Performance Protocol</h4>
                  <p className="text-sm text-emerald-800/80 leading-relaxed">
                    Current metrics indicate a high-performance trajectory. We recommend exploring advanced research or internship opportunities based on this mastery level.
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}



