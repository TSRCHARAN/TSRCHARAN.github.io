import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BlogPost from "./pages/BlogPost";
import BlogsPage from "./pages/BlogsPage";
import ProjectDetail from "./pages/ProjectDetail";
import Chatbot from "./components/Chatbot";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
      </Routes>
      <Chatbot />
    </Router>
  );
}
