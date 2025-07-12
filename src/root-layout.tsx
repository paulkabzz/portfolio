import { href, Outlet } from "react-router";
import NavBar from "./componets/common/navbar/navbar";
import { useAuth } from "./context/auth-context";
import Footer from "./componets/common/footer/footer";

const RootLayout: React.FC = (): React.ReactElement => {
    const { user } = useAuth();
    const links = [
        {
            label: "Projects",
            href: "#projects"
        }
    ]
  return (
    <>
      <NavBar name={user?.name ?? "John Doe"} links={links} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default RootLayout;