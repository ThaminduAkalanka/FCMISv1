import Hero from "../components/hero/Hero";
import WhoWeAre from "../components/who-we-are/WhoWeAre";
import BMI from "../components/bmi/BMI";
import Blog from "../components/blog/Blog";

function Home() {
  return (
    <main>
      <Hero />
      <WhoWeAre />
      <BMI />
      <Blog />
    </main>
  );
}

export default Home;
