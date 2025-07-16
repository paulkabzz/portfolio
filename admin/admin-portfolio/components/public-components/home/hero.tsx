import Link from "next/link";
import Button from "../button/button";
import styles from './index.module.css';
import { parseTextWithFormatting } from "@/components/utils";


interface IHero {
    name: string;
    avatar_url: string;
    occupation: string;
    linkedin?: string | null;
    github?: string | null;
    headline: string;
}

const Headline = ({ headline }: {headline: string}) => {


    return (
        <h3 className="font-bold text-[1rem]">
            {parseTextWithFormatting(headline)}
        </h3>
    );
};

const Hero: React.FC<IHero> = ({name, avatar_url, occupation, linkedin, github, headline}) => {

  return (
    <section className={styles.container}>
        <div className={styles.imageSection}>
            <div className={styles.imageContainer}>
                <img src={avatar_url} alt="My image" className={styles.image}/>
            </div>
        </div>
        <div className={styles.textSection}>
            <div className={styles.textContainer}>
                {/* <h3 className="font-bold">
                    Hello, I'm <span className={styles.name}>{name}</span>.
                </h3> */}
                <Headline headline={headline} />
                <h2 className={styles.occupation}>
                    {occupation}
                </h2>
                <div className={styles.buttons}>
                    <Button label="Request CV" isLight={true}/>
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