import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function PageShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 overflow-x-clip">{children}</main>
      <Footer />
    </>
  );
}
