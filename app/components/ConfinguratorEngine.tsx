import Link from "next/link";

const ConfiguratorEngine = () => {
  return (
    <section
      id="engine"
      className="w-full min-h-screen bg-[#050505] flex flex-col md:flex-row border-y border-neutral-900"
    >
      <div className="w-full md:w-1/2 p-12 md:p-24 flex flex-col justify-center border-r border-neutral-900">
        <h2 className="font-['Anton'] text-7xl md:text-8xl text-white uppercase mb-8 leading-none">
          Parametric <br /> Engine
        </h2>
        <p className="font-['Space_Grotesk'] text-lg md:text-xl text-neutral-400 leading-relaxed mb-12">
          Stop buying pre-made identities. We provide the master geometry. You
          dictate the material reality. Millisecond compilation. Infinite
          states. Construct your aesthetics in real-time.
        </p>
        <Link
          href="/configurator"
          className="inline-block font-['Space_Grotesk'] text-white text-sm font-bold tracking-[0.2em] uppercase border border-neutral-700 w-fit px-10 py-5 hover:bg-white hover:text-black transition-colors"
        >
          Initialize Configurator
        </Link>
      </div>
      <div className="w-full md:w-1/2 bg-[#0a0a0a] flex items-center justify-center p-12 min-h-[50vh]">
        <img
          src="/images/shoe_5.png"
          alt="Engine Base Model"
          className="w-full max-w-lg object-contain filter contrast-150 drop-shadow-2xl hover:-translate-y-4 transition-transform duration-700"
        />
      </div>
    </section>
  );
};

export default ConfiguratorEngine;
