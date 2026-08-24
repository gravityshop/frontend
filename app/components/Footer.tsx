import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-[#050505] border-t border-neutral-900 py-16 px-6 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 font-['Space_Grotesk'] text-neutral-500 text-xs md:text-sm uppercase tracking-widest">
        {/* Spalte 1: Info */}
        <div className="flex flex-col gap-4">
          <h5 className="text-white font-bold">Gravity Studio</h5>
          <p className="leading-relaxed">
            Hamburg
            <br />
            Germany
          </p>
        </div>

        {/* Spalte 2: Legal */}
        <div className="flex flex-col gap-4">
          <h5 className="text-white font-bold">Legal</h5>
          <ul className="space-y-3">
            <li>
              <Link
                href="/imprint"
                className="hover:text-white transition-colors"
              >
                Imprint
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        {/* Spalte 3: Social */}
        <div className="flex flex-col gap-4">
          <h5 className="text-white font-bold">Network</h5>
          <ul className="space-y-3">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Instagram
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                X / Twitter
              </a>
            </li>
          </ul>
        </div>

        {/* Spalte 4: Logo & Copyright */}
        <div className="md:text-right flex flex-col justify-between items-start md:items-end gap-8 md:gap-0">
          <h1 className="font-['Anton'] text-6xl md:text-8xl text-white leading-none">
            G.
          </h1>
          <p className="text-[10px] md:text-xs tracking-[0.2em] mt-auto">
            © 2026 Gravity. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
