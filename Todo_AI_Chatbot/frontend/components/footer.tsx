import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="py-10 bg-gradient-to-r from-black/20 to-black/10 backdrop-blur-sm border-t border-yellow-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <p className="text-sm text-gray-300 text-center md:text-left">
            © 2026 TaskFlow by Iqra. All rights reserved.
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-6 md:mt-0">
            <Link href="/terms" className="text-sm text-gray-300 hover:text-yellow-400 transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-gray-300 hover:text-yellow-400 transition-colors">
              Privacy
            </Link>
            <Link href="/contact" className="text-sm text-gray-300 hover:text-yellow-400 transition-colors">
              Contact
            </Link>
            <Link href="/support" className="text-sm text-gray-300 hover:text-yellow-400 transition-colors">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
