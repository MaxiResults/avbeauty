import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import avBeautyHero from '@/assets/av-beauty-hero.jpg';
interface HeroProps {
  onCTAClick: () => void;
  cadastroCount: number;
}
export function Hero({
  onCTAClick,
  cadastroCount
}: HeroProps) {
  return <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Background com partículas */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
        <div className="absolute inset-0 opacity-30">
          {[...Array(30)].map((_, i) => <motion.div key={i} className="absolute w-1 h-1 bg-[#FFD700] rounded-full" style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`
        }} animate={{
          y: [0, -30, 0],
          opacity: [0.3, 0.8, 0.3]
        }} transition={{
          duration: Math.random() * 3 + 2,
          repeat: Infinity,
          ease: "easeInOut"
        }} />)}
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
        {/* Foto AV Beauty */}
        <motion.div initial={{
        opacity: 0,
        scale: 0.8
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        duration: 0.8
      }} className="flex justify-center mb-8">
          <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-[#FFD700]" style={{
          boxShadow: '0 0 60px rgba(255, 215, 0, 0.6), 0 0 100px rgba(255, 215, 0, 0.4)'
        }}>
            <img src={avBeautyHero} alt="AV Beauty" className="w-full h-full object-cover" />
          </div>
        </motion.div>

        {/* Emoji de Fogo */}
        <motion.div className="text-7xl" animate={{
        scale: [1, 1.1, 1]
      }} transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }} style={{
        filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.5))'
      }}>
          🔥
        </motion.div>

        {/* Supratítulo */}
        <motion.p initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.2
      }} className="text-[#FFD700] text-2xl font-bold uppercase tracking-[4px]">
          OFERTAS DO 1º LOTE VÁLIDAS ATÉ 14/11
        </motion.p>

        {/* Título Principal */}
        <motion.h1 initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.4
      }} style={{
        background: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 0 40px rgba(255, 215, 0, 0.3)'
      }} className="text-5xl font-black leading-tight md:text-6xl text-yellow-500">
          A MAIOR BLACK BEAUTY DE OFERTAS TÁ ATIVA, TÁ NO AR! TÁ VALENDO
        </motion.h1>

        {/* Subtítulo */}
        <motion.p initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.6
      }} className="text-2xl md:text-3xl text-[#B8B8B8] font-light">
          Preços e condições que você <span className="text-white font-semibold">NUNCA</span> viu
        </motion.p>

        {/* Separador */}
        <motion.div initial={{
        scaleX: 0
      }} animate={{
        scaleX: 1
      }} transition={{
        delay: 0.8,
        duration: 0.8
      }} className="w-80 h-0.5 mx-auto" style={{
        background: 'linear-gradient(90deg, transparent, #FFD700, transparent)'
      }} />

        {/* Badge de Exclusividade */}
        <motion.div initial={{
        opacity: 0,
        scale: 0.9
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        delay: 1
      }} className="inline-flex flex-col items-center gap-2 px-8 py-4 rounded-full border-2 border-[#FFD700]" style={{
        background: 'rgba(255, 215, 0, 0.1)',
        boxShadow: '0 0 40px rgba(255, 215, 0, 0.2)'
      }}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚠️</span>
            <div className="text-left">
              <p className="text-xl font-bold text-white">ACESSO EXCLUSIVO</p>
              <p className="text-sm text-[#B8B8B8]">Apenas para cadastrados</p>
            </div>
          </div>
        </motion.div>

        {/* CTA Principal */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 1.2
      }}>
          <Button onClick={onCTAClick} className="h-14 sm:h-16 px-6 sm:px-12 text-base sm:text-xl font-bold rounded-full text-black border-none" style={{
          background: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)',
          boxShadow: '0 8px 32px rgba(255, 215, 0, 0.4)'
        }}>
            <span className="block sm:hidden">QUERO MEU ACESSO →</span>
            <span className="hidden sm:block">QUERO MEU ACESSO EXCLUSIVO →</span>
          </Button>
        </motion.div>

        {/* Informações Secundárias */}
        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 1.4
      }} className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-[#B8B8B8]">
            <span className="text-xl">⏰</span>
            <span>Lançamento em breve</span>
          </div>
          <div className="flex items-center gap-2 text-[#FFD700] font-semibold">
            <span className="text-xl">👥</span>
            <span>{cadastroCount} pessoas já garantiram acesso</span>
          </div>
        </motion.div>

        {/* Indicador de Scroll */}
        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 1.6
      }} className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <motion.p animate={{
          y: [0, 10, 0]
        }} transition={{
          duration: 2,
          repeat: Infinity
        }} className="text-[#666] text-sm">
            ↓ Role para saber mais
          </motion.p>
        </motion.div>
      </div>
    </section>;
}