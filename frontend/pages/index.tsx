import Head from 'next/head'
import Navbar from '../components/layout/Navbar'
import AnimatedBackground from '../components/ui/AnimatedBackground'
import HeroSection from '../components/landing/HeroSection'
import TrustSection from '../components/landing/TrustSection'
import DashboardPreview from '../components/landing/DashboardPreview'
import FeaturesSection from '../components/landing/FeaturesSection'
import HowItWorksSection from '../components/landing/HowItWorksSection'
import ProductShowcase from '../components/landing/ProductShowcase'
import UseCasesSection from '../components/landing/UseCasesSection'
import PricingSection from '../components/landing/PricingSection'
import FAQSection from '../components/landing/FAQSection'
import CTASection from '../components/landing/CTASection'
import ContactSection from '../components/landing/ContactSection'
import Footer from '../components/layout/Footer'

export default function Home() {
  return (
    <>
      <Head>
        <title>Born AI - Enterprise OS for Autonomous Agents</title>
        <meta name="description" content="Build, scale, and deploy intelligent agents grounded in your enterprise knowledge." />
      </Head>

      <div className="min-h-screen bg-transparent text-slate-50 font-sans selection:bg-purple-500/30">
        <AnimatedBackground />
        <Navbar />
        
        <main>
          <HeroSection />
          <TrustSection />
          <DashboardPreview />
          <FeaturesSection />
          <HowItWorksSection />
          <ProductShowcase />
          <UseCasesSection />
          <PricingSection />
          <FAQSection />
          <CTASection />
          <ContactSection />
        </main>

        <Footer />
      </div>
    </>
  )
}
