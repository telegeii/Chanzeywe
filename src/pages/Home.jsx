import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Slider from "../components/Slider/Slider";
import Principal from "../components/Principal/Principal";
import ProgramFeatured from "../components/ProgramFeatured/ProgramFeatured";
import Partners from "../components/Partners/Partners";
import Curricula from "../components/Curricula/Curricula";
import Footer from "../components/Footer/Footer";
import News from "../components/News/News";
import { apiGet } from "../utils/api";
import useSeo from "../utils/useSeo";
import Image1 from "../assets/Photo1.jpg";
import Image2 from "../assets/Photo2.jpg";
import Image3 from "../assets/Photo3.jpg";

const FALLBACK_IMAGES = [Image1, Image2, Image3];

const Home = () => {
  useSeo({
    title: "Home",
    description: "Chanzeywe Vocational Training College in Vihiga County, Kenya — CDACC-accredited diploma, certificate and artisan courses in Computing, Building, Electrical, Hospitality, Agriculture and Liberal Studies. Apply online today.",
  });

  const [slides, setSlides] = useState(null);
  const [principal, setPrincipal] = useState(null);

  useEffect(() => {
    apiGet("/hero.php?active=1")
      .then((data) =>
        setSlides(
          data.map((s, i) => ({
            image: s.image || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length],
            eyebrow: s.eyebrow,
            text: s.headline,
            subtitle: s.subtitle,
            cta: s.ctaLabel,
            link: s.ctaLink,
          }))
        )
      )
      .catch(() => setSlides([]));

    apiGet("/principal.php")
      .then(setPrincipal)
      .catch(() => setPrincipal(null));
  }, []);

  return (
    <>
      <Navbar />
      {slides === null ? null : slides.length > 0 ? <Slider slides={slides} /> : <Slider />}
      <Principal data={principal} />
      <News />
      <ProgramFeatured />
      <Curricula />
      <Partners />
      <Footer />
    </>
  );
};

export default Home;
