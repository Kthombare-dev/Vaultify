import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Statistics from "@/components/landing/Statistics";
import PaperPreview from "@/components/landing/PaperPreview";
// import WhyVaultify from "@/components/landing/WhyVaultify";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <Statistics />
      <PaperPreview />
      {/* <WhyVaultify /> */}
    </main>
  );
}