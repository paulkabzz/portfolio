import NavBar, { NavLink } from "@/components/public-components/navbar/navbar";

export default function Home() {
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
    <div className="">
        <NavBar links={links} name="KK"/>


    </div>
  );
}
