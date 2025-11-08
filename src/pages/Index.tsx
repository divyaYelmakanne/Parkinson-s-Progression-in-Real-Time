import Hero from "@/components/Hero";
import WhyItMatters from "@/components/WhyItMatters";
import Features from "@/components/Features";
import RealTimeMonitoring from "@/components/RealTimeMonitoring";
import Dashboard from "@/components/Dashboard";
import OutputExample from "@/components/OutputExample";
import AlertsReports from "@/components/AlertsReports";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <WhyItMatters />
      <Features />
      <RealTimeMonitoring />
      <Dashboard />
      <OutputExample />
      <AlertsReports />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Index;
