import Button from "../common/buttons/button";
import styles from './index.module.css';
import Github from '../../assets/github.png';
import Linkedin from '../../assets/linkedin.png';

interface IHero {
    name: string;
    avatar_url: string;
    occupation: string;
    linkedin?: string;
    github?: string;
}

const Hero: React.FC<IHero> = ({name, avatar_url, occupation, linkedin, github}) => {
  return (
    <section className={styles.container}>
        <div className={styles.imageSection}>
            <div className={styles.imageContainer}>
                <img src={avatar_url} alt="My image" className={styles.image}/>
            </div>
        </div>
        <div className={styles.textSection}>
            <div className={styles.textContainer}>
                <h3>
                    Hello, I'm <span className={styles.name}>{name}</span>.
                </h3>
                <h2 className={styles.occupation}>
                    {occupation}
                </h2>
                <div className={styles.buttons}>
                    <Button label="Download CV" isLight={true}/>
                    <Button label="Contact Me" />
                </div>
                <div className={styles.socials}>
                    <div className={styles.social}>
                        <img src={Linkedin} alt="Linkedin" />
                    </div>
                    <div className={styles.social}>
                        <img src={Github} alt="Github" />
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Hero