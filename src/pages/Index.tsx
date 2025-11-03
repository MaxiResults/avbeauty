import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <About />
        <Gallery />
        <Services />
        <Testimonials />
        <Contact />
      </main>
      <section className="py-4 text-center">
        <Link to="/auth" className="text-primary hover:underline">Área do Administrador</Link>
      </section>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default Index;
