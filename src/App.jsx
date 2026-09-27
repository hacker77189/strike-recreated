import { useState } from 'react'
import SaleBanner from './components/SaleBanner.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import CodePlayground from './components/CodePlayground.jsx'
import Membership from './components/Membership.jsx'
import Courses from './components/Courses.jsx'
import WhyChooseUs from './components/WhyChooseUs.jsx'
import Faang from './components/Faang.jsx'
import Mentors from './components/Mentors.jsx'
import Testimonials from './components/Testimonials.jsx'
import Faq from './components/Faq.jsx'
import Footer from './components/Footer.jsx'
import ToolButton from './components/ToolButton.jsx'
import { SaleProvider } from './sale/react.jsx'
import SaleController from './sale/SaleController.jsx'

export default function App() {
  const [bannerOpen, setBannerOpen] = useState(true)

  const scrollToPlayground = () =>
    document.querySelector('#playground')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <SaleProvider>
    <div className="relative min-h-screen bg-ink font-body text-neutral-200 selection:bg-white/20">
      <SaleBanner
        open={bannerOpen}
        onClose={() => setBannerOpen(false)}
        onOpenPlayground={scrollToPlayground}
      />
      <Navbar bannerOpen={bannerOpen} />
      <ToolButton />
      <SaleController />

      <main>
        <Hero />
        <CodePlayground />
        <Membership />
        <Courses />
        <WhyChooseUs />
        <Faang />
        <Mentors />
        <Testimonials />
        <Faq />
      </main>

      <Footer />
    </div>
    </SaleProvider>
  )
}
