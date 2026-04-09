import { useState, useEffect } from 'react';
import { RoleSelection } from './components/RoleSelection';
import { StudentLogin } from './components/StudentLogin';
import { TeacherLogin } from './components/TeacherLogin';
import { StudentDashboard } from './components/StudentDashboard';
import { AdminHeader } from './components/AdminHeader';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { AddStudent } from './components/AddStudent';
import { Predictions } from './components/Predictions';
import { Analytics } from './components/Analytics';
import { Student } from './types';

type Role = 'student' | 'admin' | null;
type View = 'role-selection' | 'student-login' | 'teacher-login' | 'student-dashboard' | 'admin-dashboard';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('role-selection');
  const [currentRole, setCurrentRole] = useState<Role>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activeAdminView, setActiveAdminView] = useState('dashboard');
  const [students, setStudents] = useState<Student[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        // If it's a Make.com webhook, we send a POST with action=fetch
        if (apiUrl?.includes('make.com')) {
          const res = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'fetch_students' }),
          });
          const data = await res.json();
          if (Array.isArray(data)) setStudents(data);
        } else {
          // Standard backend fallback
          const res = await fetch(`${apiUrl || 'http://localhost:8080'}/students`);
          const data = await res.json();
          if (Array.isArray(data)) setStudents(data);
        }
      } catch (error) {
        console.error("Failed to fetch students:", error);
      }
    };
    fetchStudents();
  }, []);

  const handleRoleSelection = (role: 'student' | 'admin') => {
    setCurrentRole(role);
    if (role === 'student') {
      setCurrentView('student-login');
    } else {
      setCurrentView('teacher-login');
    }
  };

  const handleStudentLogin = (student: Student) => {
    setSelectedStudent(student);
    setCurrentView('student-dashboard');
  };

  const handleTeacherLogin = () => {
    setCurrentView('admin-dashboard');
  };

  const handleBackToRoleSelection = () => {
    setCurrentView('role-selection');
    setCurrentRole(null);
    setSelectedStudent(null);
  };

  const handleBackToStudentLogin = () => {
    setCurrentView('student-login');
    setSelectedStudent(null);
  };

  const handleAddStudent = async (studentData: Omit<Student, 'id' | 'predictedMarks'>) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      
      if (apiUrl?.includes('make.com')) {
        // Combined predict and store for Make.com efficiency
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            action: 'predict_and_store',
            studentData 
          }),
        });
        const result = await res.json();
        
        // Make.com should return the full student object with predictedMarks
        const studentWithPrediction = result.student || {
          ...studentData,
          id: result.id || Date.now().toString(),
          predictedMarks: result.predictedMarks
        };
        
        setStudents([...students, studentWithPrediction]);
      } else {
        // 1. Get prediction from backend
        const predictRes = await fetch(`${apiUrl || 'http://localhost:8080'}/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(studentData),
        });
        const predictData = await predictRes.json();
        const predictedMarks = predictData.predictedMarks;

        const studentWithPrediction: Student = {
          ...studentData,
          id: Date.now().toString(),
          predictedMarks,
        };

        // 2. Store in Database via backend
        await fetch(`${apiUrl || 'http://localhost:8080'}/store`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(studentWithPrediction),
        });

        setStudents([...students, studentWithPrediction]);
      }
      setActiveAdminView('predictions');
    } catch (error) {
      console.error("Error connecting to backend:", error);
      // Fallback to local calculation if backend is down
      const subjectAvg = studentData.subjects.reduce((sum, s) => sum + s.score, 0) / studentData.subjects.length;
      const fallbackPredicted = (studentData.studyHours * 0.2 + studentData.attendance * 0.2 + studentData.assignmentScore * 0.2 + studentData.previousMarks * 0.2 + subjectAvg * 0.2);
      
      const newStudent: Student = {
        ...studentData,
        id: Date.now().toString(),
        predictedMarks: Math.round(fallbackPredicted * 10) / 10,
      };
      setStudents([...students, newStudent]);
      setActiveAdminView('predictions');
    }
  };

  const renderAdminView = () => {
    switch (activeAdminView) {
      case 'dashboard':
        return <Dashboard students={students} />;
      case 'add-student':
        return <AddStudent onAddStudent={handleAddStudent} />;
      case 'predictions':
        return <Predictions students={students} />;
      case 'analytics':
        return <Analytics students={students} />;
      default:
        return <Dashboard students={students} />;
    }
  };

  // Render based on current view
  if (currentView === 'role-selection') {
    return <RoleSelection onSelectRole={handleRoleSelection} />;
  }

  if (currentView === 'student-login') {
    return (
      <StudentLogin
        students={students}
        onLogin={handleStudentLogin}
        onBack={handleBackToRoleSelection}
      />
    );
  }

  if (currentView === 'teacher-login') {
    return (
      <TeacherLogin
        onLogin={handleTeacherLogin}
        onBack={handleBackToRoleSelection}
      />
    );
  }

  if (currentView === 'student-dashboard' && selectedStudent) {
    return (
      <StudentDashboard
        student={selectedStudent}
        onBack={handleBackToStudentLogin}
      />
    );
  }

  // Admin Dashboard
  return (
    <div className="size-full flex flex-col" style={{ backgroundColor: '#F5F7FA' }}>
      <AdminHeader 
        onLogout={handleBackToRoleSelection} 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar 
          activeView={activeAdminView} 
          onViewChange={(view) => {
            setActiveAdminView(view);
            setIsSidebarOpen(false);
          }} 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className={`flex-1 overflow-y-auto p-4 md:p-8 transition-all duration-300 ${isSidebarOpen ? 'blur-sm md:blur-none opacity-50 md:opacity-100' : ''}`}>
          <div className="max-w-7xl mx-auto">
            {renderAdminView()}
          </div>
        </main>
      </div>
    </div>
  );
}