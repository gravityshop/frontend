import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-[#050505] border-t border-neutral-900 py-12 px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 font-['Space_Grotesk'] text-neutral-500 text-sm uppercase tracking-widest">
        <div>
          <h5 className="text-white font-bold mb-4">Gravity Studio</h5>
          <p>
            Hamburg
            <br />
            Germany
          </p>
        </div>
        <div>
          <h5 className="text-white font-bold mb-4">Legal</h5>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="hover:text-white">
                Imprint
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white">
                Terms
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h5 className="text-white font-bold mb-4">Social</h5>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="hover:text-white">
                Instagram
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white">
                Twitter / X
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white">
                LinkedIn
              </Link>
            </li>
          </ul>
        </div>
        <div className="md:text-right flex flex-col justify-between">
          <h1 className="font-['Anton'] text-4xl text-white">G.</h1>
          <p className="mt-8 md:mt-0">© 2026 Gravity. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
