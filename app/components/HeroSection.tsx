const HeroSection = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <video
          src="/video/header_hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="hero-video w-full h-full object-cover grayscale-20"
        />
      </div>
      <div className="relative z-10 w-full h-full flex flex-col justify-center items-center text-center px-4 mt-20">
        <div className="overflow-hidden p-2">
          <h1 className="hero-text-line font-['Anton'] text-[18vw] md:text-[4vw] leading-[0.8] text-white uppercase tracking-tighter mix-blend-overlay">
            G R A V I T Y
          </h1>
        </div>

        <div className="overflow-hidden mt-8">
          <p className="hero-text-line font-['Space_Grotesk'] text-neutral-300 text-sm md:text-lg max-w-xl font-bold tracking-[0.3em] uppercase">
            Defy The Given. Form Over Hype. <br /> Substance Over Noise.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
