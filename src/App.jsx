import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import BlogCategories from './pages/BlogCategories'
import AllBlogs from './pages/AllBlogs'
import CategoryBlogs from './pages/CategoryBlogs'
import BlogDetail from './pages/BlogDetail'
import NetToAiTransition from './pages/NetToAiTransition'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blogs" element={<BlogCategories />} />
            <Route path="/blogs/all" element={<AllBlogs />} />
            <Route path="/net-to-ai" element={<NetToAiTransition />} />
            <Route path="/blogs/category/:categoryId" element={<CategoryBlogs />} />
            <Route path="/blogs/:slug" element={<BlogDetail />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
