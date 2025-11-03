import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronUp } from "lucide-react";

const TermosUso = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      // Back to top button
      setShowBackToTop(window.pageYOffset > 300);

      // Active section highlight
      const sections = document.querySelectorAll(".section");
      let current = "";

      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop <= 150 && sectionTop >= -section.clientHeight) {
          current = section.getAttribute("id") || "";
        }
      });

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const tocItems = [
    { id: "secao-1", label: "Definições" },
    { id: "secao-2", label: "Aceitação dos Termos" },
    { id: "secao-3", label: "Descrição dos Serviços" },
    { id: "secao-4", label: "Elegibilidade e Cadastro" },
    { id: "secao-5", label: "Compra de Procedimentos e Pacotes" },
    { id: "secao-6", label: "Pagamentos e Preços" },
    { id: "secao-7", label: "Política de Cancelamento e Reembolso" },
    { id: "secao-8", label: "Agendamento e Comparecimento" },
    { id: "secao-9", label: "Validade dos Pacotes" },
    { id: "secao-10", label: "Responsabilidades do Usuário" },
    { id: "secao-11", label: "Responsabilidades do Studio" },
    { id: "secao-12", label: "Propriedade Intelectual" },
    { id: "secao-13", label: "Limitação de Responsabilidade" },
    { id: "secao-14", label: "Privacidade e Proteção de Dados" },
    { id: "secao-15", label: "Comunicações Eletrônicas" },
    { id: "secao-16", label: "Modificações dos Termos" },
    { id: "secao-17", label: "Rescisão" },
    { id: "secao-18", label: "Lei Aplicável e Foro" },
    { id: "secao-19", label: "Disposições Gerais" },
    { id: "secao-20", label: "Contato" },
  ];

  return (
    <div className="min-h-screen bg-[#000000]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1a1a1a] border-b border-[#2a2a2a] shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
        <div className="max-w-[1200px] mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-[#FFD700] text-xl font-bold">AV Beauty</h2>
          <Link
            to="/"
            className="text-[#FFD700] font-semibold px-5 py-2.5 border-2 border-[#FFD700] rounded-lg transition-all hover:bg-[#FFD700] hover:text-[#000000] w-full md:w-auto text-center"
          >
            ← Voltar para o Site
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-180px)] px-4 md:px-6 py-10">
        <article className="max-w-[900px] mx-auto bg-[#1a1a1a] rounded-xl p-6 md:p-16 shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
          <h1 className="text-3xl md:text-[42px] text-[#FFD700] font-bold text-center mb-4">
            TERMOS DE USO
          </h1>
          <p className="text-center text-sm text-[#999] mb-12">
            Última atualização: 3 de janeiro de 2025
          </p>

          <div className="mb-12 text-[#ccc]">
            <p className="mb-4">
              Bem-vindo ao site da AV Beauty. Ao acessar e usar nosso site, você concorda em cumprir e estar vinculado aos seguintes Termos de Uso. Se você não concorda com qualquer parte destes termos, não utilize nosso site ou serviços.
            </p>
          </div>

          {/* TOC */}
          <nav className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-6 mb-12">
            <h3 className="text-lg font-semibold text-[#FFD700] mb-4">ÍNDICE</h3>
            <ol className="list-decimal pl-6 space-y-2">
              {tocItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className={`text-[#FFD700] hover:text-white hover:underline transition-colors ${
                      activeSection === item.id ? "font-semibold text-white underline" : ""
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ol>
          </nav>

          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent my-12" />

          {/* Sections */}
          <section id="secao-1" className="section mb-12 scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-[#FFD700] mb-6 pb-3 border-b-2 border-[#FFD700]">
              1. DEFINIÇÕES
            </h2>
            <p className="mb-4 text-[#ccc]">Para os fins destes Termos de Uso:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-[#ccc]">
              <li>
                <strong className="font-semibold text-white">"Studio", "nós", "nosso":</strong> refere-se à AV Beauty
              </li>
              <li>
                <strong className="font-semibold text-white">"Usuário", "você", "seu":</strong> refere-se à pessoa que acessa ou utiliza nosso site e serviços
              </li>
              <li>
                <strong className="font-semibold text-white">"Site":</strong> refere-se ao website avbeauty.com.br e todas as suas páginas
              </li>
              <li>
                <strong className="font-semibold text-white">"Serviços":</strong> refere-se aos procedimentos de estética facial oferecidos
              </li>
              <li>
                <strong className="font-semibold text-white">"Procedimentos":</strong> tratamentos de estética facial realizados pelo studio
              </li>
              <li>
                <strong className="font-semibold text-white">"Pacotes":</strong> conjunto de procedimentos vendidos em conjunto com condições especiais
              </li>
            </ul>
          </section>

          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent my-12" />

          <section id="secao-2" className="section mb-12 scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-[#FFD700] mb-6 pb-3 border-b-2 border-[#FFD700]">
              2. ACEITAÇÃO DOS TERMOS
            </h2>
            <p className="mb-4 text-[#ccc]">
              <strong className="font-semibold text-white">2.1.</strong> Ao acessar ou usar nosso site, você concorda em estar legalmente vinculado a estes Termos de Uso e à nossa Política de Privacidade.
            </p>
            <p className="mb-4 text-[#ccc]">
              <strong className="font-semibold text-white">2.2.</strong> Se você não concorda com estes termos, não deve usar nosso site ou serviços.
            </p>
            <p className="mb-4 text-[#ccc]">
              <strong className="font-semibold text-white">2.3.</strong> Reservamo-nos o direito de modificar estes termos a qualquer momento. O uso contínuo do site após as modificações constituirá sua aceitação dos novos termos.
            </p>
          </section>

          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent my-12" />

          <section id="secao-3" className="section mb-12 scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-[#FFD700] mb-6 pb-3 border-b-2 border-[#FFD700]">
              3. DESCRIÇÃO DOS SERVIÇOS
            </h2>
            <p className="mb-4 text-[#ccc]">
              <strong className="font-semibold text-white">3.1.</strong> A AV Beauty oferece serviços de estética facial nas seguintes áreas:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-[#ccc]">
              <li>Design de sobrancelhas</li>
              <li>Brow lamination</li>
              <li>Limpeza de pele</li>
              <li>Despigmentação labial</li>
              <li>Outros procedimentos de estética facial</li>
            </ul>
            <p className="mb-4 text-[#ccc]">
              <strong className="font-semibold text-white">3.2.</strong> Todos os procedimentos são realizados por profissionais devidamente capacitados.
            </p>
            <p className="mb-4 text-[#ccc]">
              <strong className="font-semibold text-white">3.3.</strong> As informações no site têm caráter informativo. Cada caso será avaliado individualmente durante consulta presencial.
            </p>
          </section>

          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent my-12" />

          <section id="secao-4" className="section mb-12 scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-[#FFD700] mb-6 pb-3 border-b-2 border-[#FFD700]">
              4. ELEGIBILIDADE E CADASTRO
            </h2>
            <h3 className="text-xl font-semibold text-white mt-8 mb-4">4.1. Idade Mínima</h3>
            <p className="mb-4 text-[#ccc]">Para utilizar nossos serviços, você deve:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-[#ccc]">
              <li>Ter no mínimo 18 anos de idade, OU</li>
              <li>Ter entre 16 e 18 anos com autorização expressa dos pais ou responsável legal, OU</li>
              <li>Estar representado por responsável legal (menores de 16 anos)</li>
            </ul>
            <h3 className="text-xl font-semibold text-white mt-8 mb-4">4.2. Informações de Cadastro</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-[#ccc]">
              <li>Você concorda em fornecer informações verdadeiras, precisas e atualizadas</li>
              <li>Você é responsável por manter a confidencialidade de sua conta</li>
              <li>Você deve notificar-nos imediatamente sobre qualquer uso não autorizado de sua conta</li>
            </ul>
          </section>

          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent my-12" />

          <section id="secao-5" className="section mb-12 scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-[#FFD700] mb-6 pb-3 border-b-2 border-[#FFD700]">
              5. COMPRA DE PROCEDIMENTOS E PACOTES
            </h2>
            <h3 className="text-xl font-semibold text-white mt-8 mb-4">5.1. Processo de Compra</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-[#ccc]">
              <li>As compras são realizadas através do nosso site ou presencialmente</li>
              <li>Ao finalizar uma compra, você receberá confirmação por WhatsApp</li>
              <li>A compra constitui um contrato vinculante entre você e o studio</li>
            </ul>
            <h3 className="text-xl font-semibold text-white mt-8 mb-4">5.2. Avaliação Prévia</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-[#ccc]">
              <li>Certos procedimentos requerem avaliação presencial prévia</li>
              <li>O studio pode recusar realizar um procedimento por motivos técnicos</li>
              <li>Em caso de contraindicação, será oferecido reembolso integral</li>
            </ul>
          </section>

          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent my-12" />

          <section id="secao-6" className="section mb-12 scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-[#FFD700] mb-6 pb-3 border-b-2 border-[#FFD700]">
              6. PAGAMENTOS E PREÇOS
            </h2>
            <h3 className="text-xl font-semibold text-white mt-8 mb-4">6.1. Formas de Pagamento</h3>
            <p className="mb-4 text-[#ccc]">Aceitamos:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-[#ccc]">
              <li>Pix</li>
              <li>Cartão de crédito (parcelamento sujeito a condições)</li>
              <li>Cartão de débito</li>
              <li>Dinheiro</li>
            </ul>
            <h3 className="text-xl font-semibold text-white mt-8 mb-4">6.2. Preços</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-[#ccc]">
              <li>Todos os preços são em Reais (BRL)</li>
              <li>Preços incluem impostos aplicáveis</li>
              <li>Preços promocionais têm validade limitada</li>
              <li>Reservamo-nos o direito de corrigir erros de precificação</li>
            </ul>
          </section>

          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent my-12" />

          <section id="secao-7" className="section mb-12 scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-[#FFD700] mb-6 pb-3 border-b-2 border-[#FFD700]">
              7. POLÍTICA DE CANCELAMENTO E REEMBOLSO
            </h2>
            <h3 className="text-xl font-semibold text-white mt-8 mb-4">
              7.1. Direito de Arrependimento (Código de Defesa do Consumidor)
            </h3>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-[#ccc]">
              <li>Compras online: até 7 dias corridos após a compra ou primeiro atendimento</li>
              <li>Reembolso integral do valor pago</li>
              <li>Solicitar através dos canais de atendimento</li>
            </ul>
            <h3 className="text-xl font-semibold text-white mt-8 mb-4">7.2. Cancelamento pelo Cliente</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-[#ccc]">
              <li>Cancelamentos com mais de 48h de antecedência: reembolso integral</li>
              <li>Cancelamentos com 24h a 48h de antecedência: reembolso de 50%</li>
              <li>Cancelamentos com menos de 24h: sem reembolso</li>
              <li>Não comparecimento (no-show): sem reembolso</li>
            </ul>
          </section>

          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent my-12" />

          <section id="secao-8" className="section mb-12 scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-[#FFD700] mb-6 pb-3 border-b-2 border-[#FFD700]">
              8. AGENDAMENTO E COMPARECIMENTO
            </h2>
            <h3 className="text-xl font-semibold text-white mt-8 mb-4">8.1. Agendamento</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-[#ccc]">
              <li>Após a compra, você deve agendar através do WhatsApp</li>
              <li>Sujeito à disponibilidade de horários</li>
              <li>Confirmação será enviada por WhatsApp</li>
            </ul>
            <h3 className="text-xl font-semibold text-white mt-8 mb-4">8.2. Remarcação</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-[#ccc]">
              <li>Permitida com no mínimo 48h de antecedência</li>
              <li>Limite de 2 remarcações por procedimento</li>
              <li>Sujeito à disponibilidade</li>
            </ul>
          </section>

          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent my-12" />

          <section id="secao-9" className="section mb-12 scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-[#FFD700] mb-6 pb-3 border-b-2 border-[#FFD700]">
              9. VALIDADE DOS PACOTES
            </h2>
            <h3 className="text-xl font-semibold text-white mt-8 mb-4">9.1. Prazo de Validade</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-[#ccc]">
              <li>Pacotes promocionais: validade especificada na compra (geralmente 6 a 12 meses)</li>
              <li>Procedimentos individuais: validade de 12 meses a partir da compra</li>
              <li>Após o vencimento, não haverá reembolso ou prorrogação</li>
            </ul>
          </section>

          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent my-12" />

          <section id="secao-10" className="section mb-12 scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-[#FFD700] mb-6 pb-3 border-b-2 border-[#FFD700]">
              10. RESPONSABILIDADES DO USUÁRIO
            </h2>
            <p className="mb-4 text-[#ccc]">Você concorda em:</p>
            <h3 className="text-xl font-semibold text-white mt-8 mb-4">10.1. Informações de Saúde</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-[#ccc]">
              <li>Fornecer histórico de saúde completo e verdadeiro</li>
              <li>Informar sobre alergias, medicamentos em uso e condições de saúde</li>
              <li>Seguir as orientações pré e pós-procedimento</li>
              <li>Informar imediatamente sobre qualquer reação adversa</li>
            </ul>
          </section>

          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent my-12" />

          <section id="secao-11" className="section mb-12 scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-[#FFD700] mb-6 pb-3 border-b-2 border-[#FFD700]">
              11. RESPONSABILIDADES DO STUDIO
            </h2>
            <h3 className="text-xl font-semibold text-white mt-8 mb-4">11.1. Comprometimentos</h3>
            <p className="mb-4 text-[#ccc]">O studio se compromete a:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-[#ccc]">
              <li>Prestar serviços com qualidade e profissionalismo</li>
              <li>Utilizar materiais e equipamentos adequados</li>
              <li>Manter ambiente limpo e seguro</li>
              <li>Respeitar sua privacidade e dados pessoais</li>
              <li>Fornecer informações claras sobre procedimentos</li>
            </ul>
          </section>

          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent my-12" />

          <section id="secao-12" className="section mb-12 scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-[#FFD700] mb-6 pb-3 border-b-2 border-[#FFD700]">
              12. PROPRIEDADE INTELECTUAL
            </h2>
            <h3 className="text-xl font-semibold text-white mt-8 mb-4">12.1. Direitos Autorais</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-[#ccc]">
              <li>Todo o conteúdo do site (textos, imagens, logos, vídeos) é propriedade da AV Beauty</li>
              <li>Protegido por leis de direitos autorais e propriedade intelectual</li>
              <li>Uso não autorizado pode resultar em ações legais</li>
            </ul>
          </section>

          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent my-12" />

          <section id="secao-13" className="section mb-12 scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-[#FFD700] mb-6 pb-3 border-b-2 border-[#FFD700]">
              13. LIMITAÇÃO DE RESPONSABILIDADE
            </h2>
            <p className="mb-4 text-[#ccc]">
              <strong className="font-semibold text-white">13.1.</strong> Na máxima extensão permitida por lei:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-[#ccc]">
              <li>O site é fornecido "como está" e "conforme disponível"</li>
              <li>Não garantimos que o site estará sempre disponível ou livre de erros</li>
              <li>Não nos responsabilizamos por danos indiretos, incidentais ou consequenciais</li>
              <li>Nossa responsabilidade total é limitada ao valor pago pelo serviço</li>
            </ul>
          </section>

          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent my-12" />

          <section id="secao-14" className="section mb-12 scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-[#FFD700] mb-6 pb-3 border-b-2 border-[#FFD700]">
              14. PRIVACIDADE E PROTEÇÃO DE DADOS
            </h2>
            <p className="mb-4 text-[#ccc]">
              <strong className="font-semibold text-white">14.1.</strong> Sua privacidade é importante para nós. O tratamento de seus dados pessoais é regido por nossa{" "}
              <Link to="/politica-de-privacidade" className="text-[#FFD700] underline hover:text-white">
                Política de Privacidade
              </Link>
              .
            </p>
            <p className="mb-4 text-[#ccc]">
              <strong className="font-semibold text-white">14.2.</strong> Ao usar nossos serviços, você consente com:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-[#ccc]">
              <li>Coleta e uso de dados conforme Política de Privacidade</li>
              <li>Comunicações por WhatsApp</li>
              <li>Uso de cookies e tecnologias similares</li>
            </ul>
          </section>

          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent my-12" />

          <section id="secao-15" className="section mb-12 scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-[#FFD700] mb-6 pb-3 border-b-2 border-[#FFD700]">
              15. COMUNICAÇÕES ELETRÔNICAS
            </h2>
            <p className="mb-4 text-[#ccc]">
              <strong className="font-semibold text-white">15.1.</strong> Ao usar nossos serviços, você concorda em receber:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-[#ccc]">
              <li>Mensagens transacionais via WhatsApp (confirmações, lembretes)</li>
              <li>Mensagens de marketing via WhatsApp (se você consentiu)</li>
            </ul>
          </section>

          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent my-12" />

          <section id="secao-16" className="section mb-12 scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-[#FFD700] mb-6 pb-3 border-b-2 border-[#FFD700]">
              16. MODIFICAÇÕES DOS TERMOS
            </h2>
            <p className="mb-4 text-[#ccc]">
              <strong className="font-semibold text-white">16.1.</strong> Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento.
            </p>
            <p className="mb-4 text-[#ccc]">
              <strong className="font-semibold text-white">16.2.</strong> O uso contínuo do site após as modificações constitui aceitação dos novos termos.
            </p>
          </section>

          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent my-12" />

          <section id="secao-17" className="section mb-12 scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-[#FFD700] mb-6 pb-3 border-b-2 border-[#FFD700]">
              17. RESCISÃO
            </h2>
            <h3 className="text-xl font-semibold text-white mt-8 mb-4">17.1. Rescisão por Você</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-[#ccc]">
              <li>Você pode parar de usar nossos serviços a qualquer momento</li>
              <li>Solicitar exclusão de conta através dos canais de contato</li>
              <li>Procedimentos já pagos continuam válidos conforme condições de compra</li>
            </ul>
          </section>

          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent my-12" />

          <section id="secao-18" className="section mb-12 scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-[#FFD700] mb-6 pb-3 border-b-2 border-[#FFD700]">
              18. LEI APLICÁVEL E FORO
            </h2>
            <p className="mb-4 text-[#ccc]">
              <strong className="font-semibold text-white">18.1.</strong> Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil.
            </p>
            <p className="mb-4 text-[#ccc]">
              <strong className="font-semibold text-white">18.2.</strong> Qualquer disputa será resolvida preferencialmente por negociação amigável.
            </p>
            <p className="mb-4 text-[#ccc]">
              <strong className="font-semibold text-white">18.3.</strong> Caso não haja acordo, fica eleito o foro da Comarca de São Paulo/SP para dirimir quaisquer questões oriundas destes termos.
            </p>
          </section>

          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent my-12" />

          <section id="secao-19" className="section mb-12 scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-[#FFD700] mb-6 pb-3 border-b-2 border-[#FFD700]">
              19. DISPOSIÇÕES GERAIS
            </h2>
            <h3 className="text-xl font-semibold text-white mt-8 mb-4">19.1. Acordo Completo</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-[#ccc]">
              <li>Estes Termos de Uso, juntamente com a Política de Privacidade, constituem o acordo completo entre você e a AV Beauty</li>
              <li>Substitui todos os acordos anteriores, orais ou escritos</li>
            </ul>
          </section>

          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent my-12" />

          <section id="secao-20" className="section mb-12 scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-[#FFD700] mb-6 pb-3 border-b-2 border-[#FFD700]">
              20. CONTATO
            </h2>
            <p className="mb-4 text-[#ccc]">
              Se você tiver dúvidas, preocupações ou reclamações sobre estes Termos de Uso, entre em contato conosco:
            </p>

            <div className="bg-[#0a0a0a] border-2 border-[#2a2a2a] rounded-xl p-8 my-8">
              <h3 className="text-lg font-semibold text-[#FFD700] mt-0 mb-4">
                AV Beauty
              </h3>

              <p className="mb-4 text-[#ccc]">
                <strong className="font-semibold text-white">Endereço:</strong>
                <br />
                Studio de estética facial
                <br />
                Ermelino Matarazzo - Zona Leste de SP
                <br />
                São Paulo/SP - Brasil
              </p>

              <p className="mb-4 text-[#ccc]">
                <strong className="font-semibold text-white">WhatsApp:</strong> (11) 98936-8534
                <br />
                <strong className="font-semibold text-white">Instagram:</strong>{" "}
                @andreiavieira_beauty
              </p>

              <p className="mb-0 text-[#ccc]">
                <strong className="font-semibold text-white">Horário de Atendimento:</strong>
                <br />
                Segunda a Sexta: 9h às 18h
                <br />
                Sábado: 9h às 14h
              </p>
            </div>

            <div className="bg-[#0a0a0a] border-l-4 border-[#FFD700] p-6 my-8 rounded">
              <h3 className="text-lg text-[#FFD700] font-semibold mt-0 mb-4">
                DECLARAÇÃO DE CONSENTIMENTO
              </h3>
              <p className="mb-4 text-[#ccc]">Ao clicar em "Aceito" ou ao usar nosso site e serviços, você declara que:</p>
              <ul className="list-disc pl-6 mb-0 space-y-2 text-[#ccc]">
                <li>Leu e compreendeu estes Termos de Uso</li>
                <li>Leu e compreendeu nossa Política de Privacidade</li>
                <li>Concorda em estar legalmente vinculado a estes termos</li>
                <li>Tem capacidade legal para aceitar estes termos</li>
                <li>Fornecerá informações verdadeiras e precisas</li>
              </ul>
            </div>

            <p className="text-center text-sm text-[#666] mt-12 pt-8 border-t border-[#2a2a2a]">
              AV Beauty - Studio de Estética Facial
              <br />
              Profissional: Andreia Vieira
              <br />© 2025 - Todos os direitos reservados
            </p>

            <p className="text-center text-xs text-[#555] mt-4">
              Última atualização: 3 de janeiro de 2025 | Versão 1.0
            </p>
          </section>
        </article>
      </main>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 w-12 h-12 bg-[#FFD700] text-[#000000] rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(255,215,0,0.3)] transition-all z-50 hover:bg-white hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(255,215,0,0.4)] ${
          showBackToTop ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        aria-label="Voltar ao topo"
      >
        <ChevronUp className="w-6 h-6" />
      </button>

      {/* Footer */}
      <footer className="bg-[#000000] border-t border-[#2a2a2a] text-[#ccc] py-8 px-6 text-center">
        <nav className="mb-4 flex flex-wrap justify-center gap-2">
          <Link to="/" className="text-[#ccc] hover:text-[#FFD700] transition-colors mx-2">
            Home
          </Link>
          <span className="hidden md:inline">|</span>
          <Link
            to="/politica-de-privacidade"
            className="text-[#ccc] hover:text-[#FFD700] transition-colors mx-2"
          >
            Política de Privacidade
          </Link>
          <span className="hidden md:inline">|</span>
          <Link
            to="/termos-de-uso"
            className="text-[#ccc] hover:text-[#FFD700] transition-colors mx-2"
          >
            Termos de Uso
          </Link>
        </nav>
        <p className="text-sm text-[#666]">
          © 2025 AV Beauty - Todos os direitos reservados
        </p>
      </footer>
    </div>
  );
};

export default TermosUso;
