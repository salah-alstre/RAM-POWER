import Navbar from "@/components/Navbar";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import Hero from "@/components/Hero";
import AboutProduct from "@/components/AboutProduct";
import ColdCanSection from "@/components/ColdCanSection";
import DetailSection from "@/components/DetailSection";
import AgentsDirectory from "@/components/AgentsDirectory";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <ScrollProgressBar />
      <Navbar />
      <main id="main-content">
        <Hero />
        <AboutProduct />
        <ColdCanSection />
        <DetailSection />
        <AgentsDirectory />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
