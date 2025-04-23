import { Route, Routes } from "react-router-dom"
import { CreateProject } from "@/pages/CreateProject"
import { ProjectPlayground } from "@/pages/ProjectPlayground"
import { SigninContainer } from '@/components/organisms/Auth/SigninContainer';
import { SignupContainer } from '@/components/organisms/Auth/SignupContainer';
import { Auth } from '@/pages/Auth/Auth';
import { Notfound } from "./pages/Notfound/Notfound";
import { ProtectedRoute } from "./components/molecules/ProtectedRoute/ProtectedRoute";


export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/auth/signup" element={<Auth><SignupContainer /></Auth>} />
            <Route path="/auth/signin" element={<Auth><SigninContainer /></Auth>} />
            <Route path="/" element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
            <Route path="/project/:projectId" element={<ProtectedRoute><ProjectPlayground /></ProtectedRoute>} />
            
            <Route path="/*" element={<Notfound />} />
        </Routes>
    )
}