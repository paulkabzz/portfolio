import Hero from '../../componets/home/hero';
import styles from './index.module.css';
// import me from '../../assets/me.jpg';
import ProjectsSection from '../../componets/project/project-section';


const Home = () => {
  const user = {
    name: "Paul",
    occupation: "Computer Science & Engineering Student",
    avatar_url: "https://fra.cloud.appwrite.io/v1/storage/buckets/6874c4060036ca341929/files/687653760002d1f119f2/view?project=687104d900141f752463&mode=admin"
  }
  return (
    <>
      <Hero name={user.name} occupation={user.occupation} avatar_url={user.avatar_url}/>
      <ProjectsSection />
    </>    
  )
}

export default Home;