import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronUp } from "lucide-react";

const PoliticaPrivacidade = () => {
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

  return (
    <div className="min-h-screen bg-[#000000]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1a1a1a] border-b border-[#2a2a2a] shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
        <div className="max-w-[1200px] mx-auto px-6 py-5 flex justify-between items-center">
          <h2 className="text-[#FFD700] text-xl font-bold">AV Beauty</h2>
          <Link
            to="/"
            className="text-[#FFD700] font-semibold px-5 py-2.5 border-2 border-[#FFD700] rounded-lg transition-all hover:bg-[#FFD700] hover:text-[#000000]"
          >
            ← Voltar para o Site
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-180px)] px-6 py-10">
        <article className="max-w-[900px] mx-auto bg-[#1a1a1a] rounded-xl p-8 md:p-16 shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
          <h1 className="text-4xl md:text-[42px] text-[#FFD700] font-bold text-center mb-4">
            POLÍTICA DE PRIVACIDADE
          </h1>
          <p className="text-center text-sm text-[#999] mb-12">
            Última atualização: 3 de janeiro de 2025
          </p>

          <div className="mb-12 text-[#ccc]">
            <p className="mb-4">
              A AV Beauty ("nós", "nosso" ou "studio") valoriza e respeita a sua privacidade. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais quando você utiliza nosso site e serviços.
            </p>
            <p className="mb-4">
              Ao utilizar nosso site e serviços, você concorda com as práticas descritas nesta política.
            </p>
          </div>

          {/* TOC */}
          <nav className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-6 mb-12">
            <h3 className="text-lg font-semibold text-[#FFD700] mb-4">ÍNDICE</h3>
            <ol className="list-decimal pl-6 space-y-2">
              {[
                { id: "secao-1", label: "Informações que Coletamos" },
                { id: "secao-2", label: "Como Usamos Suas Informações" },
                { id: "secao-3", label: "Base Legal para Processamento" },
                { id: "secao-4", label: "Compartilhamento de Dados" },
                { id: "secao-5", label: "Armazenamento e Segurança" },
                { id: "secao-6", label: "Cookies e Tecnologias Similares" },
                { id: "secao-7", label: "Seus Direitos (LGPD)" },
                { id: "secao-8", label: "Retenção de Dados" },
                { id: "secao-9", label: "Menores de Idade" },
                { id: "secao-10", label: "Alterações nesta Política" },
                { id: "secao-11", label: "Contato" },
              ].map((item) => (
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

          {/* Section 1 */}
          <section id="secao-1" className="section mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold text-[#FFD700] mb-6 pb-3 border-b-2 border-[#FFD700]">
              1. INFORMAÇÕES QUE COLETAMOS
            </h2>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">
              1.1. Informações Fornecidas por Você
            </h3>
            <p className="mb-4 text-[#ccc]">Coletamos informações que você nos fornece diretamente ao:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-[#ccc]">
              <li>Preencher formulários de contato</li>
              <li>Cadastrar-se para receber ofertas e promoções</li>
              <li>Realizar compras de procedimentos ou pacotes</li>
              <li>Entrar em contato conosco por e-mail, telefone ou WhatsApp</li>
              <li>Agendar consultas ou procedimentos</li>
            </ul>

            <p className="mb-4 text-[#ccc]">Essas informações podem incluir:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-[#ccc]">
              <li>Nome completo</li>
              <li>CPF</li>
              <li>Endereço de e-mail</li>
              <li>Número de telefone (incluindo WhatsApp)</li>
              <li>Endereço residencial</li>
              <li>Informações de pagamento (processadas por gateways seguros)</li>
              <li>Histórico de compras e agendamentos</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">
              1.2. Informações Coletadas Automaticamente
            </h3>
            <p className="mb-4 text-[#ccc]">Quando você acessa nosso site, podemos coletar automaticamente:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-[#ccc]">
              <li>Endereço IP</li>
              <li>Tipo de navegador e dispositivo</li>
              <li>Sistema operacional</li>
              <li>Páginas visitadas e tempo de permanência</li>
              <li>Origem do acesso (como você chegou ao nosso site)</li>
              <li>Cookies e identificadores similares</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">
              1.3. Informações de Terceiros
            </h3>
            <p className="mb-4 text-[#ccc]">Podemos receber informações suas através de:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-[#ccc]">
              <li>Plataformas de redes sociais (Instagram, Facebook)</li>
              <li>Ferramentas de análise (Google Analytics)</li>
              <li>Plataformas de pagamento (Mercado Pago, PagSeguro)</li>
            </ul>
          </section>

          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent my-12" />

          {/* Section 2 */}
          <section id="secao-2" className="section mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold text-[#FFD700] mb-6 pb-3 border-b-2 border-[#FFD700]">
              2. COMO USAMOS SUAS INFORMAÇÕES
            </h2>

            <p className="mb-4 text-[#ccc]">Utilizamos suas informações pessoais para:</p>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">
              2.1. Prestação de Serviços
            </h3>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-[#ccc]">
              <li>Processar suas compras e pagamentos</li>
              <li>Agendar e confirmar seus procedimentos</li>
              <li>Enviar confirmações e atualizações sobre seus agendamentos</li>
              <li>Fornecer suporte e atendimento ao cliente</li>
              <li>Gerenciar sua conta e histórico de atendimentos</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">2.2. Comunicação</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-[#ccc]">
              <li>Enviar e-mails transacionais (confirmações, lembretes)</li>
              <li>Enviar comunicações de marketing (se você consentiu)</li>
              <li>Responder suas dúvidas e solicitações</li>
              <li>Enviar pesquisas de satisfação</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">
              2.3. Melhorias e Análises
            </h3>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-[#ccc]">
              <li>Analisar o uso do site para melhorar sua experiência</li>
              <li>Realizar pesquisas e análises de mercado</li>
              <li>Desenvolver novos serviços e produtos</li>
              <li>Personalizar conteúdo e ofertas</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">
              2.4. Segurança e Conformidade Legal
            </h3>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-[#ccc]">
              <li>Prevenir fraudes e atividades ilegais</li>
              <li>Proteger nossos direitos e propriedade</li>
              <li>Cumprir obrigações legais e regulatórias</li>
              <li>Resolver disputas</li>
            </ul>
          </section>

          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent my-12" />

          {/* Section 3 */}
          <section id="secao-3" className="section mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold text-[#FFD700] mb-6 pb-3 border-b-2 border-[#FFD700]">
              3. BASE LEGAL PARA PROCESSAMENTO
            </h2>

            <p className="mb-4 text-[#ccc]">Processamos seus dados pessoais com base em:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-[#ccc]">
              <li>
                <strong className="font-semibold text-white">Consentimento:</strong> Quando você nos autoriza explicitamente
              </li>
              <li>
                <strong className="font-semibold text-white">Execução de Contrato:</strong> Para fornecer os serviços contratados
              </li>
              <li>
                <strong className="font-semibold text-white">Obrigação Legal:</strong> Para cumprir leis e regulamentos
              </li>
              <li>
                <strong className="font-semibold text-white">Legítimo Interesse:</strong> Para melhorar nossos serviços e proteger nossos direitos
              </li>
            </ul>
          </section>

          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent my-12" />

          {/* Section 4 */}
          <section id="secao-4" className="section mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold text-[#FFD700] mb-6 pb-3 border-b-2 border-[#FFD700]">
              4. COMPARTILHAMENTO DE DADOS
            </h2>

            <p className="mb-4 text-[#ccc]">
              Não vendemos suas informações pessoais. Compartilhamos seus dados apenas nas seguintes situações:
            </p>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">
              4.1. Prestadores de Serviços
            </h3>
            <p className="mb-4 text-[#ccc]">Compartilhamos informações com empresas que nos auxiliam, incluindo:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-[#ccc]">
              <li>Processadores de pagamento (Mercado Pago, PagSeguro)</li>
              <li>Provedores de hospedagem e armazenamento de dados</li>
              <li>Serviços de e-mail marketing</li>
              <li>Ferramentas de análise (Google Analytics, Facebook Pixel)</li>
              <li>Plataformas de comunicação (WhatsApp Business)</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">
              4.2. Exigências Legais
            </h3>
            <p className="mb-4 text-[#ccc]">Podemos divulgar suas informações se exigido por lei ou para:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-[#ccc]">
              <li>Cumprir processos legais</li>
              <li>Responder a solicitações governamentais</li>
              <li>Proteger nossos direitos e propriedade</li>
              <li>Prevenir fraudes ou atividades ilegais</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">
              4.3. Transferência de Negócios
            </h3>
            <p className="mb-4 text-[#ccc]">
              Em caso de fusão, aquisição ou venda de ativos, suas informações podem ser transferidas.
            </p>
          </section>

          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent my-12" />

          {/* Section 5 */}
          <section id="secao-5" className="section mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold text-[#FFD700] mb-6 pb-3 border-b-2 border-[#FFD700]">
              5. ARMAZENAMENTO E SEGURANÇA
            </h2>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">5.1. Onde Armazenamos</h3>
            <p className="mb-4 text-[#ccc]">
              Seus dados são armazenados em servidores seguros localizados no Brasil e em outros países, incluindo:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-[#ccc]">
              <li>Infraestrutura em nuvem</li>
              <li>Serviços de e-mail</li>
              <li>Plataformas de pagamento</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">
              5.2. Medidas de Segurança
            </h3>
            <p className="mb-4 text-[#ccc]">
              Implementamos medidas técnicas e organizacionais para proteger suas informações:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-[#ccc]">
              <li>Criptografia de dados em trânsito e em repouso</li>
              <li>Controles de acesso restrito</li>
              <li>Monitoramento regular de segurança</li>
              <li>Backup regular de dados</li>
              <li>Treinamento de equipe sobre privacidade</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">5.3. Limitações</h3>
            <p className="mb-4 text-[#ccc]">
              Embora façamos o possível para proteger seus dados, nenhum sistema é 100% seguro. Você é responsável por manter a confidencialidade de suas senhas e credenciais.
            </p>
          </section>

          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent my-12" />

          {/* Section 6 */}
          <section id="secao-6" className="section mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold text-[#FFD700] mb-6 pb-3 border-b-2 border-[#FFD700]">
              6. COOKIES E TECNOLOGIAS SIMILARES
            </h2>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">6.1. O que são Cookies</h3>
            <p className="mb-4 text-[#ccc]">
              Cookies são pequenos arquivos de texto armazenados no seu dispositivo que nos ajudam a melhorar sua experiência.
            </p>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">
              6.2. Tipos de Cookies que Usamos
            </h3>

            <h4 className="text-lg font-semibold text-[#FFD700] mt-6 mb-3">
              Cookies Essenciais (Necessários)
            </h4>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-[#ccc]">
              <li>Funcionamento básico do site</li>
              <li>Segurança e autenticação</li>
              <li>Carrinho de compras</li>
            </ul>

            <h4 className="text-lg font-semibold text-[#FFD700] mt-6 mb-3">Cookies de Desempenho</h4>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-[#ccc]">
              <li>Google Analytics</li>
              <li>Análise de uso do site</li>
              <li>Melhorias de performance</li>
            </ul>

            <h4 className="text-lg font-semibold text-[#FFD700] mt-6 mb-3">
              Cookies de Funcionalidade
            </h4>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-[#ccc]">
              <li>Preferências do usuário</li>
              <li>Idioma e configurações</li>
              <li>Lembretes de login</li>
            </ul>

            <h4 className="text-lg font-semibold text-[#FFD700] mt-6 mb-3">Cookies de Marketing</h4>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-[#ccc]">
              <li>Facebook Pixel</li>
              <li>Google Ads</li>
              <li>Anúncios direcionados</li>
              <li>Remarketing</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">6.3. Gerenciar Cookies</h3>
            <p className="mb-4 text-[#ccc]">
              Você pode controlar cookies através das configurações do seu navegador. Note que desabilitar cookies pode afetar a funcionalidade do site.
            </p>
          </section>

          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent my-12" />

          {/* Section 7 */}
          <section id="secao-7" className="section mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold text-[#FFD700] mb-6 pb-3 border-b-2 border-[#FFD700]">
              7. SEUS DIREITOS (LGPD)
            </h2>

            <p className="mb-4 text-[#ccc]">
              De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem os seguintes direitos:
            </p>

            <div className="bg-[#0a0a0a] border-l-4 border-[#FFD700] p-6 my-8 rounded">
              <h3 className="text-lg text-[#FFD700] font-semibold mt-0 mb-4">
                7.1. Direito de Acesso
              </h3>
              <p className="mb-4 text-[#ccc]">
                Você pode solicitar cópia de todos os dados pessoais que temos sobre você.
              </p>

              <h3 className="text-lg text-[#FFD700] font-semibold mt-6 mb-4">
                7.2. Direito de Retificação
              </h3>
              <p className="mb-4 text-[#ccc]">
                Você pode solicitar a correção de dados incorretos ou desatualizados.
              </p>

              <h3 className="text-lg text-[#FFD700] font-semibold mt-6 mb-4">
                7.3. Direito de Exclusão
              </h3>
              <p className="mb-4 text-[#ccc]">
                Você pode solicitar a exclusão de seus dados pessoais, exceto quando necessário para cumprimento de obrigações legais.
              </p>

              <h3 className="text-lg text-[#FFD700] font-semibold mt-6 mb-4">
                7.4. Direito de Portabilidade
              </h3>
              <p className="mb-4 text-[#ccc]">
                Você pode solicitar seus dados em formato estruturado e de leitura automática.
              </p>

              <h3 className="text-lg text-[#FFD700] font-semibold mt-6 mb-4">
                7.5. Direito de Oposição
              </h3>
              <p className="mb-4 text-[#ccc]">
                Você pode se opor ao processamento de seus dados para certas finalidades.
              </p>

              <h3 className="text-lg text-[#FFD700] font-semibold mt-6 mb-4">
                7.6. Direito de Revogar Consentimento
              </h3>
              <p className="mb-4 text-[#ccc]">Você pode retirar seu consentimento a qualquer momento.</p>

              <h3 className="text-lg text-[#FFD700] font-semibold mt-6 mb-4">
                7.7. Direito à Informação
              </h3>
              <p className="mb-0 text-[#ccc]">
                Você pode solicitar informações sobre o uso compartilhado de seus dados.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">
              Como Exercer Seus Direitos:
            </h3>
            <p className="mb-4 text-[#ccc]">
              Para exercer qualquer um desses direitos, entre em contato conosco através de:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-[#ccc]">
              <li>WhatsApp: (11) 98936-8534</li>
              <li>Instagram: @andreiavieira_beauty</li>
              <li>Presencialmente em nosso studio</li>
            </ul>
            <p className="mb-4 text-[#ccc]">Responderemos sua solicitação em até 15 dias úteis.</p>
          </section>

          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent my-12" />

          {/* Section 8 */}
          <section id="secao-8" className="section mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold text-[#FFD700] mb-6 pb-3 border-b-2 border-[#FFD700]">
              8. RETENÇÃO DE DADOS
            </h2>

            <p className="mb-4 text-[#ccc]">Mantemos suas informações pessoais pelo tempo necessário para:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-[#ccc]">
              <li>Fornecer nossos serviços</li>
              <li>Cumprir obrigações legais (ex: dados fiscais por 5 anos)</li>
              <li>Resolver disputas</li>
              <li>Fazer cumprir nossos acordos</li>
            </ul>
            <p className="mb-4 text-[#ccc]">
              Após esse período, seus dados serão anonimizados ou excluídos de forma segura.
            </p>
          </section>

          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent my-12" />

          {/* Section 9 */}
          <section id="secao-9" className="section mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold text-[#FFD700] mb-6 pb-3 border-b-2 border-[#FFD700]">
              9. MENORES DE IDADE
            </h2>

            <p className="mb-4 text-[#ccc]">
              Nossos serviços são destinados a pessoas maiores de 18 anos. Não coletamos intencionalmente informações de menores de idade sem o consentimento dos pais ou responsáveis legais.
            </p>
            <p className="mb-4 text-[#ccc]">
              Se você acredita que coletamos informações de um menor inadvertidamente, entre em contato conosco imediatamente.
            </p>
          </section>

          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent my-12" />

          {/* Section 10 */}
          <section id="secao-10" className="section mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold text-[#FFD700] mb-6 pb-3 border-b-2 border-[#FFD700]">
              10. ALTERAÇÕES NESTA POLÍTICA
            </h2>

            <p className="mb-4 text-[#ccc]">
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre mudanças significativas através de:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-[#ccc]">
              <li>Aviso no site</li>
              <li>E-mail</li>
              <li>WhatsApp</li>
            </ul>
            <p className="mb-4 text-[#ccc]">
              A data da "Última atualização" no topo desta página indica quando a política foi revisada pela última vez.
            </p>
            <p className="mb-4 text-[#ccc]">Recomendamos que você revise esta política regularmente.</p>
          </section>

          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent my-12" />

          {/* Section 11 */}
          <section id="secao-11" className="section mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold text-[#FFD700] mb-6 pb-3 border-b-2 border-[#FFD700]">
              11. CONTATO
            </h2>

            <p className="mb-4 text-[#ccc]">
              Se você tiver dúvidas, preocupações ou solicitações relacionadas a esta Política de Privacidade ou ao tratamento de seus dados pessoais, entre em contato conosco:
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
                <strong className="font-semibold text-white">Encarregado de Dados (DPO):</strong>
                <br />
                Para questões específicas sobre proteção de dados, entre em contato através do WhatsApp acima com o assunto "LGPD - Proteção de Dados".
              </p>
            </div>

            <p className="italic text-[#999] my-8 p-4 bg-[#0a0a0a] rounded-lg">
              Ao utilizar nosso site e serviços, você reconhece que leu, compreendeu e concordou com esta Política de Privacidade.
            </p>

            <p className="text-center text-sm text-[#666] mt-12 pt-8 border-t border-[#2a2a2a]">
              AV Beauty - Studio de Estética Facial
              <br />© 2025 - Todos os direitos reservados
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
        <nav className="mb-4">
          <Link to="/" className="text-[#ccc] hover:text-[#FFD700] transition-colors mx-2">
            Home
          </Link>{" "}
          |
          <Link
            to="/politica-de-privacidade"
            className="text-[#ccc] hover:text-[#FFD700] transition-colors mx-2"
          >
            Política de Privacidade
          </Link>{" "}
          |
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

export default PoliticaPrivacidade;
