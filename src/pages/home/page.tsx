import Hero from '../../componets/home/hero';
import styles from './index.module.css';
import me from '../../assets/me.jpg';
import ProjectsSection from '../../componets/project/project-section';


const Home = () => {
  const user = {
    name: "Paul",
    occupation: "Computer Science & Engineering Student",
    avatar_url: me
  }
  return (
    <>
      <Hero name={user.name} occupation={user.occupation} avatar_url={user.avatar_url}/>
      <ProjectsSection />
    </>    
  )
}

export default Home;