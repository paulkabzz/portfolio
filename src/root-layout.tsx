import { href, Outlet } from "react-router";
import NavBar, { type NavLink } from "./componets/common/navbar/navbar";
import { useAuth } from "./context/auth-context";
import Footer from "./componets/common/footer/footer";

const RootLayout: React.FC = (): React.ReactElement => {
    const { user } = useAuth();
    const links: NavLink[] = [
    {
        label: "About",
        href: "#about"
    },
    {
        label: "Projects",
        href: "#projects"
    },
    {
        label: "Education",
        href: "#education"
    },
    {
        label: "Experience",
        href: "#experience"
    },
    {
        label: "Contact",
        href: "/contact"
    }
    ];

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