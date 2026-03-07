import Navbar from "../components/Navbar";
import Slider from "../components/Slider/Slider";
import Principal from "../components/Principal/Principal";
import ProgramFeatured from "../components/ProgramFeatured/ProgramFeatured";
import Partners from "../components/Partners/Partners";
import Curricula from "../components/Curricula/Curricula";
import Footer from "../components/Footer/Footer";
import News from "../components/News/News";

const Home = () => {
  return (
    <>
      <Navbar />
      <Slider />
      <Principal />
      <News />
      <ProgramFeatured />
      <Curricula />
      <Partners />
      <Footer />
    </>
  );
};

export default Home;