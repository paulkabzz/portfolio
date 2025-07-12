import { Navigate, Outlet } from "react-router";

interface IProtectedRoute {
    children?: React.ReactNode;
    redirectPath?:string;
}

const ProtectedRoute: React.FC<IProtectedRoute> = ({ children, redirectPath="/login" }) => {
    const user = null;

    if (!user) return <Navigate to={redirectPath} />;

    return children ? <>children</> : <Outlet />;
}

export default ProtectedRoute;