"use client";

import Navigation from "./components/Navigation";
import HeroSection from "./components/HeroSection";
import ManifestoSection from "./components/ManifestoSection";
import EditorialOne from "./components/EditorialOne";
import ProductGridOne from "./components/ProductGridOne";
import ArchiveGrid from "./components/ArchiveGrid";
import EditorialTwo from "./components/Editorialtwo";
import HorizontalScroll from "./components/HorizontalScroll";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="bg-[#050505] min-h-screen selection:bg-neutral-600 selection:text-white overflow-x-hidden">
      <Navigation />
      <main>
        <HeroSection />
        <ManifestoSection />
        <ProductGridOne />
        <EditorialOne />
        <ArchiveGrid />
        <EditorialTwo />
        <HorizontalScroll />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
