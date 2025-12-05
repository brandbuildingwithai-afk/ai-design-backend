import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { BrandSetup } from './pages/BrandSetup'

function Landing() {
  const [isReady, setIsReady] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative max-w-4xl mx-auto text-center animate-slide-up">
        {/* Logo/Icon */}
        <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-2xl">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            AI Design Platform
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          The next generation of social media design.
          <span className="text-blue-400 font-medium"> Intelligent. Adaptive. Beautiful.</span>
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            to="/brand-setup"
            className="px-8 py-4 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg shadow-white/10"
          >
            Get Started
          </Link>
          <button className="px-8 py-4 bg-white/10 text-white rounded-full font-semibold hover:bg-white/20 transition-all backdrop-blur-sm border border-white/10">
            View Demo
          </button>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            { title: 'Brand Learning', desc: 'Upload your posts, we learn your style automatically.' },
            { title: 'Multi-Agent AI', desc: 'Planner, Designer, and Copywriter agents work together.' },
            { title: 'Canvas Editor', desc: 'Fully editable designs with drag-and-drop freedom.' }
          ].map((feature, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-md">
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Status Indicator */}
        <div className="mt-16 inline-flex items-center px-4 py-2 rounded-full bg-black/30 border border-white/10 backdrop-blur-md">
          <div className={`w-2 h-2 rounded-full mr-3 ${isReady ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
          <span className="text-sm text-gray-400 font-mono">
            System Status: {isReady ? 'ONLINE' : 'INITIALIZING'}
          </span>
        </div>
      </div>
    </div>
  )
}

import { DesignStudio } from './pages/DesignStudio'
import { Gallery } from './pages/Gallery'
import { SharedDesign } from './pages/SharedDesign'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/brand-setup" element={<BrandSetup />} />
      <Route path="/design" element={<DesignStudio />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/share/:id" element={<SharedDesign />} />
    </Routes>
  )
}

export default App
