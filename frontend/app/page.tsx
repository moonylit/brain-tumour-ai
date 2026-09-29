import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import UploadCard from "@/components/UploadCard";
import EvaluationCard from "@/components/EvaluationCard";
import Features from "@/components/Features";
import Stats from "@/components/Stats";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-blue-600 selection:text-white">
      <Navbar />
      <Hero />
      <UploadCard />
      <EvaluationCard />
      <Features />
      <Stats />
      <Footer />
    </main>
  );
}