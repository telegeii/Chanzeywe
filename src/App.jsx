import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Charter from "./pages/Charter/Charter";
import Career from "./pages/Career/Career";
import Tender from "./pages/Tender/Tender";
import Courses from "./pages/Courses/Courses";
import Instruction from "./pages/Instruction/Instruction";
import Downloads from "./pages/Downloads/Downloads";
import Computing from "./pages/Departments/Computing/Computing";
import Agriculture from "./pages/Departments/Agriculture/Agriculture";
import Building from "./pages/Departments/Building/Building";
import Electrical from "./pages/Departments/Electrical/Electrical";
import Liberal from "./pages/Departments/Liberal/Liberal";
import Hospitality from "./pages/Departments/Hospitality/Hospitality";
import ApplicationForm from "./pages/Application/ApplicationForm";
import Blog from "./pages/Blog/Blog";
import BlogView from "./pages/BlogView/BlogView"; 
import News from "./components/News/News";
import Corruption from "./pages/Corruption/Corruption";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/charter" element={<Charter />} />
      <Route path="/career" element={<Career />} />
      <Route path="/tender" element={<Tender />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/instruction" element={<Instruction />} />
      <Route path="/downloads" element={<Downloads />} />
      <Route path="/computing" element={<Computing />} />
      <Route path="/agriculture" element={<Agriculture />} />
      <Route path="/building" element={<Building />} />
      <Route path="/electrical" element={<Electrical />} />
      <Route path="/liberal" element={<Liberal />} />
      <Route path="/hospitality" element={<Hospitality />} />
      <Route path="/applicationform" element={<ApplicationForm />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blogview" element={<BlogView />} /> 
      <Route path="/News" element={<News />} /> 
       <Route path="/Corruption" element={<Corruption />} /> 

    </Routes>
  );
}

export default App;