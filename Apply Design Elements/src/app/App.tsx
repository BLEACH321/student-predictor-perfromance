import { useState } from 'react';
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
  const [students, setStudents] = useState<Student[]>([
    { 
      id: '1', 
      name: 'Alice Smith', 
      grade: '10', 
      studyHours: 25, 
      attendance: 92, 
      assignmentScore: 88, 
      previousMarks: 85, 
      subjects: [
        { name: 'Mathematics', score: 92 },
        { name: 'Science', score: 88 },
        { name: 'Social Studies', score: 85 },
        { name: 'English', score: 90 },
        { name: 'Language', score: 87 }
      ],
      predictedMarks: 88.5 
    },
    { 
      id: '2', 
      name: 'Bob Johnson', 
      grade: 'Engineering', 
      studyHours: 15, 
      attendance: 75, 
      assignmentScore: 70, 
      previousMarks: 72, 
      subjects: [
        { name: 'Eng Math', score: 65 },
        { name: 'Data Structures', score: 75 },
        { name: 'OS', score: 70 },
        { name: 'Digital Logic', score: 68 },
        { name: 'OOPs', score: 72 }
      ],
      predictedMarks: 71.0 
    },
  ]);

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

  const handleAddStudent = (studentData: Omit<Student, 'id' | 'predictedMarks'>) => {
    // Subject average contributes to prediction
    const subjectAvg = studentData.subjects.reduce((sum, s) => sum + s.score, 0) / studentData.subjects.length;
    
    // Weighted prediction
    const studyWeight = 0.20;
    const attendanceWeight = 0.20;
    const assignmentWeight = 0.20;
    const previousWeight = 0.20;
    const subjectWeight = 0.20;

    const normalizedStudyHours = Math.min((studentData.studyHours / 40) * 100, 100);

    const predictedMarks =
      normalizedStudyHours * studyWeight +
      studentData.attendance * attendanceWeight +
      studentData.assignmentScore * assignmentWeight +
      studentData.previousMarks * previousWeight +
      subjectAvg * subjectWeight;

    const newStudent: Student = {
      ...studentData,
      id: Date.now().toString(),
      predictedMarks: Math.round(predictedMarks * 10) / 10,
    };

    setStudents([...students, newStudent]);
    setActiveAdminView('predictions');
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
      <AdminHeader onLogout={handleBackToRoleSelection} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeView={activeAdminView} onViewChange={setActiveAdminView} />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {renderAdminView()}
          </div>
        </main>
      </div>
    </div>
  );
}