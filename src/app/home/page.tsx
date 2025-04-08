import React from "react";
import Header from "@/components/header";
import HomeHero from "@/components/homehero";
import PoojaItems from "@/components/poojaitems";
import HinduPoojas from "@/components/hindupoojas";
import Footer from "@/components/footer";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Header (Sticky for better scrolling UX) */}
      <header className="w-full sticky top-0 z-50">
        <Header />
      </header>

      {/* Main Content (Centered and Responsive) */}
      <main className="flex flex-col grow items-center w-full">
        <HomeHero />
        <PoojaItems />
        <HinduPoojas />
      </main>
      <footer>
        <Footer/>
      </footer>
    </div>
  );
}
