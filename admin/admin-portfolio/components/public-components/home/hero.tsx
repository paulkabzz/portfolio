import Link from "next/link";
import Button from "../button/button";
import styles from './index.module.css';


interface IHero {
    name: string;
    avatar_url: string;
    occupation: string;
    linkedin?: string | null;
    github?: string | null;
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
              {
                (linkedin || github) && (
                <div className={styles.socials}>
                    {
                        linkedin && 
                        <Link target="_blank" href={linkedin} className={styles.social}>
                            <img src={'/linkedin.png'} alt="Linkedin" />
                        </Link>
                    }
                    {
                        github &&
                        <Link href={github} target="_blank" className={styles.social}>
                            <img src={'/github.png'} alt="Github" />
                        </Link>
                    }
                </div>
                )
              }
            </div>
        </div>
    </section>
  )
}

export default Hero