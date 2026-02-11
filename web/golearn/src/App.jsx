import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './context/useAuthStore';
import Layout from './components/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import SubjectDetail from './pages/SubjectDetail';
import MaterialView from './pages/MaterialView';
import Profile from './pages/Profile';
import Register from './pages/Register';
import { Toaster } from 'react-hot-toast';

const ProtectedRoute = ({ children }) => {
    const { token } = useAuthStore();
    if (!token) return <Navigate to="/login" />;
    return children;
};

function App() {
    return (
        <BrowserRouter>
        <Toaster position="top-center" />
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Home />} />
            <Route path="subject/:id" element={<SubjectDetail />} />
            <Route path="material/:id" element={<MaterialView />} />
            <Route path="profile" element={<Profile />} />
            </Route>
        </Routes>
        </BrowserRouter>
    );
}

export default App;