import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
 
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
 
import EventDiscovery from './pages/EventDiscovery';
import EventDetails from './pages/EventDetails';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';

function App() {
  return (
    <AuthProvider> 
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        <Router>
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes> 
              <Route path="/" element={<EventDiscovery />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/login" element={<Login />} />
               
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;