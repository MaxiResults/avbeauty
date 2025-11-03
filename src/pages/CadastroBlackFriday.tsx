import { useEffect, useState } from 'react';
import { Hero } from '@/components/teaser/Hero';
import { MysterySection } from '@/components/teaser/MysterySection';
import { WhyCadastrar } from '@/components/teaser/WhyCadastrar';
import { FormularioCadastro } from '@/components/teaser/FormularioCadastro';
import { ProvaSocial } from '@/components/teaser/ProvaSocial';
import { FAQ } from '@/components/teaser/FAQ';
import { CTAFinal } from '@/components/teaser/CTAFinal';
import { FooterTeaser } from '@/components/teaser/FooterTeaser';

export default function CadastroBlackFriday() {
  const [cadastroCount, setCadastroCount] = useState(847);

  // Incrementar contador a cada 5-10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCadastroCount(prev => prev + 1);
    }, Math.random() * 5000 + 5000);

    return () => clearInterval(interval);
  }, []);

  // Scroll suave para o formulário
  const scrollToForm = () => {
    const formElement = document.getElementById('formulario-cadastro');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-[#181818] min-h-screen">
      <Hero onCTAClick={scrollToForm} cadastroCount={cadastroCount} />
      <MysterySection />
      <WhyCadastrar />
      <FormularioCadastro cadastroCount={cadastroCount} />
      <ProvaSocial />
      <FAQ />
      <CTAFinal onCTAClick={scrollToForm} />
      <FooterTeaser />
    </div>
  );
}
