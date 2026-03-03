import Navbar from "../components/Navbar";
import Slider from "../components/Slider/Slider";
import Image1 from "../assets/Photo1.jpg";
import Image2 from "../assets/Photo2.jpg";
import Image3 from "../assets/Photo3.jpg";
import Principal from "../components/Principal/Principal";
import ProgramFeatured from "../components/ProgramFeatured/ProgramFeatured";
import Partners from "../components/Partners/Partners";
import Curricula from "../components/Curricula/Curricula";
import Footer from "../components/Footer/Footer";
import News from "../components/News/News";

const slides = [
  { image: Image1, text: "Welcome to Chanzeywe Vocational Training College" },
  { image: Image2, text: "" },
  { image: Image3, text: "Computer Science Students" },
];

const Home = () => {
  return (
    <>
      <Navbar />
      <Slider slides={slides} />
      <Principal />
      <News/>
      <ProgramFeatured />
      <Curricula />
      <Partners />
      <Footer />
    </>
  );
};

export default Home;