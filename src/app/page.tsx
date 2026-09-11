import Navbar from "@/components/Navbar";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import Hero from "@/components/Hero";
import AboutProduct from "@/components/AboutProduct";
import ColdCanSection from "@/components/ColdCanSection";
import DetailSection from "@/components/DetailSection";
import ProductGallery from "@/components/ProductGallery";
import SceneDivider from "@/components/SceneDivider";
import AgentsDirectory from "@/components/AgentsDirectory";
import ShopOwnerSection from "@/components/ShopOwnerSection";
import FaqSection from "@/components/FaqSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import LightboxProvider from "@/components/LightboxProvider";
import MobileActionBar from "@/components/MobileActionBar";

export default function Home() {
  return (
    <>
      <ScrollProgressBar />
      <Navbar />
      <LightboxProvider>
        <main id="main-content">
          <Hero />
          <AboutProduct />
          <ColdCanSection />
          <DetailSection />
          <ProductGallery />
          <SceneDivider />
          <AgentsDirectory />
          <ShopOwnerSection />
          <FaqSection />
          <ContactSection />
        </main>
        <Footer />
      </LightboxProvider>
      <MobileActionBar />
    </>
  );
}
