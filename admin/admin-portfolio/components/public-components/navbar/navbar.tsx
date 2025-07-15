import styles from './index.module.css';
import { Hamburger } from "../button/hamburger";
import Link from 'next/link';

export interface NavLink {
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
        <h1 className={styles.name}>
            { name }
        </h1>

        <Hamburger />
        <nav className={styles.cont}>
            <ul className={styles.linksContainer}>
                {
                    links.map((link, index: number) => (
                        <li key={index}>
                            <Link href={link.href}>{link.label}</Link>
                        </li>
                    ))
                }
            </ul>
        </nav>
    </header>
  )
}

export default NavBar