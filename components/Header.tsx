import Image from "next/image";
import Link from "next/link";
import OffcanvasMenu from "@/components/OffcanvasMenu";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-gray-50/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/pixiio-logo.svg"
            alt="pixiio design agency"
            width={119}
            height={37}
            priority
            className="h-8 w-auto"
          />
        </Link>

        <OffcanvasMenu />
      </div>
    </header>
  );
}
