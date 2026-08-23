import Link from "next/link";

const ProductGridTwo = () => {
  return (
    <section className="w-full bg-[#050505] border-y border-neutral-900">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="product-image-2 overflow-hidden h-[60vh] md:h-auto bg-[#0a0a0a] flex items-center justify-center p-12 order-2 md:order-1 border-r border-neutral-900">
          <img
            src="/images/shoe_5.png"
            alt="Gravity Red/Tan Sneaker"
            className="w-full h-full object-contain filter contrast-125 grayscale-10"
          />
        </div>
        <div className="product-text-2 p-12 md:p-24 flex flex-col justify-center order-1 md:order-2">
          <div className="font-['Space_Grotesk'] text-neutral-500 font-bold mb-4 tracking-widest">
            ARCHIVE_005
          </div>
          <h2 className="font-['Anton'] text-6xl text-white mb-8 uppercase">
            Industrial Tone
          </h2>
          <p className="font-['Space_Grotesk'] text-neutral-400 text-lg leading-relaxed mb-12">
            Muted industrial orange and earthy tones. Complex layered mesh
            meeting raw environments. The database-driven colorway execution.
          </p>
          <Link
            href="/config"
            className="inline-flex w-fit font-['Space_Grotesk'] text-white border-b border-white pb-1 hover:text-neutral-500 hover:border-neutral-500 transition-colors uppercase tracking-widest font-bold"
          >
            Configure Model
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductGridTwo;
