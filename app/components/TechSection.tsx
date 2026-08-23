const TechSection = () => {
  return (
    <section
      id="tech"
      className="w-full min-h-screen flex items-center justify-center bg-[#0a0a0a] py-32 px-8"
    >
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-3 mb-12 overflow-hidden">
          <h2 className="tech-title font-['Anton'] text-7xl md:text-9xl text-white uppercase leading-none">
            One Model.
            <br />
            <span className="text-neutral-700">Infinite</span>
          </h2>
        </div>

        <div className="tech-card border-t border-neutral-800 pt-8">
          <h4 className="font-['Anton'] text-3xl text-white mb-4">
            raw_shoe.glb
          </h4>
          <p className="font-['Space_Grotesk'] text-neutral-400 leading-relaxed">
            We load a single, perfectly optimized base model. No bloated assets.
            Near-zero load times. Pure WebGL performance.
          </p>
        </div>
        <div className="tech-card border-t border-neutral-800 pt-8">
          <h4 className="font-['Anton'] text-3xl text-white mb-4">
            Hex Injection
          </h4>
          <p className="font-['Space_Grotesk'] text-neutral-400 leading-relaxed">
            20 distinct variations driven entirely by database entries.
            Materials and hex codes applied in milliseconds via Three.js.
          </p>
        </div>
        <div className="tech-card border-t border-neutral-800 pt-8">
          <h4 className="font-['Anton'] text-3xl text-white mb-4">Real-Time</h4>
          <p className="font-['Space_Grotesk'] text-neutral-400 leading-relaxed">
            Seamless transition into the customizer. See your design changes in
            60 frames per second with studio lighting.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TechSection;
