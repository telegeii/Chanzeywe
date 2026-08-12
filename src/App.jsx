import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";

// Route-level code splitting — keeps the initial bundle small so the
// homepage isn't paying for admin-panel and every department page's JS
// on first load (Core Web Vitals / SEO ranking factor).
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About/About"));
const Contact = lazy(() => import("./pages/Contact/Contact"));
const Charter = lazy(() => import("./pages/Charter/Charter"));
const Career = lazy(() => import("./pages/Career/Career"));
const Tender = lazy(() => import("./pages/Tender/Tender"));
const Courses = lazy(() => import("./pages/Courses/Courses"));
const Instruction = lazy(() => import("./pages/Instruction/Instruction"));
const Downloads = lazy(() => import("./pages/Downloads/Downloads"));
const Computing = lazy(() => import("./pages/Departments/Computing/Computing"));
const Agriculture = lazy(() => import("./pages/Departments/Agriculture/Agriculture"));
const Building = lazy(() => import("./pages/Departments/Building/Building"));
const Electrical = lazy(() => import("./pages/Departments/Electrical/Electrical"));
const Liberal = lazy(() => import("./pages/Departments/Liberal/Liberal"));
const Hospitality = lazy(() => import("./pages/Departments/Hospitality/Hospitality"));
const ApplicationForm = lazy(() => import("./pages/Application/ApplicationForm"));
const AdmissionLetter = lazy(() => import("./pages/AdmissionLetter/AdmissionLetter"));
const Blog = lazy(() => import("./pages/Blog/Blog"));
const BlogView = lazy(() => import("./pages/BlogView/BlogView"));
const News = lazy(() => import("./components/News/News"));
const AdminDashboard = lazy(() => import("./Admin/AdminDashboard"));
const AdminLogin = lazy(() => import("./Admin/AdminLogin"));

const PageLoader = () => (
  <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit', sans-serif", color: "#6b7280" }}>
    Loading…
  </div>
);

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ScrollToTop />
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
        <Route path="/admission-letter" element={<AdmissionLetter />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blogview" element={<BlogView />} />
        <Route path="/News" element={<News />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />

      </Routes>
    </Suspense>
  );
}

export default App;
