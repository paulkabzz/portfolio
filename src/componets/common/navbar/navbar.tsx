import { Link } from "react-router";
import styles from './index.module.css';

interface NavLink {
    label: string;
    href: string;
}
interface INavBar {
    name: string;
    links: Array<NavLink>;
}

const NavBar: React.FC<INavBar> = ({name, links}) => {
  return (
    <header className={styles.header}>
        <section>
            { name }
        </section>
        <section>
            <nav>
                <ul>
                    {
                        links.map((link, index: number) => (
                            <li key={index}>
                                <Link to={link.href}>{link.label}</Link>
                            </li>
                        ))
                    }
                </ul>
            </nav>
        </section>
    </header>
  )
}

export default NavBar