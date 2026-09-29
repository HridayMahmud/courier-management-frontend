import { Hero } from "@/components/marketing/hero";
import { CallToAction, Features, HowItWorks, StatsStrip, Highlights } from "@/components/marketing/sections";

export default function Home() {
  return (
    <>
      <Hero />
      <StatsStrip />
      <Features />
      <HowItWorks />
      <Highlights />
      <CallToAction />
    </>
  );
}
