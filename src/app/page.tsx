import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import PaperPreview from "@/components/landing/PaperPreview";
// import WhyVaultify from "@/components/landing/WhyVaultify";

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <PaperPreview />
      {/* <WhyVaultify /> */}
    </main>
  );
}