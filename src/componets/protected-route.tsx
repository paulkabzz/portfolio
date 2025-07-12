import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/auth-context";

interface IProtectedRoute {
    children?: React.ReactNode;
    redirectPath?: string;
}

const ProtectedRoute: React.FC<IProtectedRoute> = ({ children, redirectPath = "/login" }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }

    return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;