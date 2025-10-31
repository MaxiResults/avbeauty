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
    <div className="min-h-screen bg-[#f3f0e9]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#e5e7eb] shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
        <div className="max-w-[1200px] mx-auto px-6 py-5 flex justify-between items-center">
          <h2 className="text-[#3a4934] text-xl font-bold">Nicole Guedes Odonto</h2>
          <Link
            to="/"
            className="text-[#97624b] font-semibold px-5 py-2.5 border-2 border-[#97624b] rounded-lg transition-all hover:bg-[#97624b] hover:text-white"
          >
            ← Voltar para o Site
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-180px)] px-6 py-10">
        <article className="max-w-[900px] mx-auto bg-white rounded-xl p-8 md:p-16 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
          <h1 className="text-4xl md:text-[42px] text-[#3a4934] font-bold text-center mb-4">
            POLÍTICA DE PRIVACIDADE
          </h1>
          <p className="text-center text-sm text-[#6b7280] mb-12">
            Última atualização: 25 de novembro de 2024
          </p>

          <div className="mb-12">
            <p className="mb-4">
              A Nicole Guedes Odonto ("nós", "nosso" ou "clínica") valoriza e respeita a sua privacidade. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais quando você utiliza nosso site e serviços.
            </p>
            <p className="mb-4">
              Ao utilizar nosso site e serviços, você concorda com as práticas descritas nesta política.
            </p>
          </div>

          {/* TOC */}
          <nav className="bg-[#f9fafb] border border-[#e5e7eb] rounded-lg p-6 mb-12">
            <h3 className="text-lg font-semibold text-[#3a4934] mb-4">ÍNDICE</h3>
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
                    className={`text-[#97624b] hover:text-[#3a4934] hover:underline transition-colors ${
                      activeSection === item.id ? "font-semibold text-[#3a4934] underline" : ""
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ol>
          </nav>

          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[#e5e7eb] to-transparent my-12" />

          {/* Section 1 */}
          <section id="secao-1" className="section mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold text-[#3a4934] mb-6 pb-3 border-b-2 border-[#97624b]">
              1. INFORMAÇÕES QUE COLETAMOS
            </h2>

            <h3 className="text-xl font-semibold text-[#292823] mt-8 mb-4">
              1.1. Informações Fornecidas por Você
            </h3>
            <p className="mb-4">Coletamos informações que você nos fornece diretamente ao:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Preencher formulários de contato</li>
              <li>Cadastrar-se para receber ofertas e promoções</li>
              <li>Realizar compras de procedimentos ou pacotes</li>
              <li>Entrar em contato conosco por e-mail, telefone ou WhatsApp</li>
              <li>Agendar consultas ou procedimentos</li>
            </ul>

            <p className="mb-4">Essas informações podem incluir:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Nome completo</li>
              <li>CPF</li>
              <li>Endereço de e-mail</li>
              <li>Número de telefone (incluindo WhatsApp)</li>
              <li>Endereço residencial</li>
              <li>Informações de pagamento (processadas por gateways seguros)</li>
              <li>Histórico de compras e agendamentos</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#292823] mt-8 mb-4">
              1.2. Informações Coletadas Automaticamente
            </h3>
            <p className="mb-4">Quando você acessa nosso site, podemos coletar automaticamente:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Endereço IP</li>
              <li>Tipo de navegador e dispositivo</li>
              <li>Sistema operacional</li>
              <li>Páginas visitadas e tempo de permanência</li>
              <li>Origem do acesso (como você chegou ao nosso site)</li>
              <li>Cookies e identificadores similares</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#292823] mt-8 mb-4">
              1.3. Informações de Terceiros
            </h3>
            <p className="mb-4">Podemos receber informações suas através de:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Plataformas de redes sociais (Instagram, Facebook)</li>
              <li>Ferramentas de análise (Google Analytics)</li>
              <li>Plataformas de pagamento (Mercado Pago, PagSeguro)</li>
            </ul>
          </section>

          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[#e5e7eb] to-transparent my-12" />

          {/* Section 2 */}
          <section id="secao-2" className="section mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold text-[#3a4934] mb-6 pb-3 border-b-2 border-[#97624b]">
              2. COMO USAMOS SUAS INFORMAÇÕES
            </h2>

            <p className="mb-4">Utilizamos suas informações pessoais para:</p>

            <h3 className="text-xl font-semibold text-[#292823] mt-8 mb-4">
              2.1. Prestação de Serviços
            </h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Processar suas compras e pagamentos</li>
              <li>Agendar e confirmar seus procedimentos</li>
              <li>Enviar confirmações e atualizações sobre seus agendamentos</li>
              <li>Fornecer suporte e atendimento ao cliente</li>
              <li>Gerenciar sua conta e histórico de atendimentos</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#292823] mt-8 mb-4">2.2. Comunicação</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Enviar e-mails transacionais (confirmações, lembretes)</li>
              <li>Enviar comunicações de marketing (se você consentiu)</li>
              <li>Responder suas dúvidas e solicitações</li>
              <li>Enviar pesquisas de satisfação</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#292823] mt-8 mb-4">
              2.3. Melhorias e Análises
            </h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Analisar o uso do site para melhorar sua experiência</li>
              <li>Realizar pesquisas e análises de mercado</li>
              <li>Desenvolver novos serviços e produtos</li>
              <li>Personalizar conteúdo e ofertas</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#292823] mt-8 mb-4">
              2.4. Segurança e Conformidade Legal
            </h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Prevenir fraudes e atividades ilegais</li>
              <li>Proteger nossos direitos e propriedade</li>
              <li>Cumprir obrigações legais e regulatórias</li>
              <li>Resolver disputas</li>
            </ul>
          </section>

          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[#e5e7eb] to-transparent my-12" />

          {/* Section 3 */}
          <section id="secao-3" className="section mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold text-[#3a4934] mb-6 pb-3 border-b-2 border-[#97624b]">
              3. BASE LEGAL PARA PROCESSAMENTO
            </h2>

            <p className="mb-4">Processamos seus dados pessoais com base em:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                <strong className="font-semibold text-[#3a4934]">Consentimento:</strong> Quando você nos autoriza explicitamente
              </li>
              <li>
                <strong className="font-semibold text-[#3a4934]">Execução de Contrato:</strong> Para fornecer os serviços contratados
              </li>
              <li>
                <strong className="font-semibold text-[#3a4934]">Obrigação Legal:</strong> Para cumprir leis e regulamentos
              </li>
              <li>
                <strong className="font-semibold text-[#3a4934]">Legítimo Interesse:</strong> Para melhorar nossos serviços e proteger nossos direitos
              </li>
            </ul>
          </section>

          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[#e5e7eb] to-transparent my-12" />

          {/* Section 4 */}
          <section id="secao-4" className="section mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold text-[#3a4934] mb-6 pb-3 border-b-2 border-[#97624b]">
              4. COMPARTILHAMENTO DE DADOS
            </h2>

            <p className="mb-4">
              Não vendemos suas informações pessoais. Compartilhamos seus dados apenas nas seguintes situações:
            </p>

            <h3 className="text-xl font-semibold text-[#292823] mt-8 mb-4">
              4.1. Prestadores de Serviços
            </h3>
            <p className="mb-4">Compartilhamos informações com empresas que nos auxiliam, incluindo:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Processadores de pagamento (Mercado Pago, PagSeguro)</li>
              <li>Provedores de hospedagem e armazenamento de dados</li>
              <li>Serviços de e-mail marketing</li>
              <li>Ferramentas de análise (Google Analytics, Facebook Pixel)</li>
              <li>Plataformas de comunicação (WhatsApp Business)</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#292823] mt-8 mb-4">
              4.2. Exigências Legais
            </h3>
            <p className="mb-4">Podemos divulgar suas informações se exigido por lei ou para:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Cumprir processos legais</li>
              <li>Responder a solicitações governamentais</li>
              <li>Proteger nossos direitos e propriedade</li>
              <li>Prevenir fraudes ou atividades ilegais</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#292823] mt-8 mb-4">
              4.3. Transferência de Negócios
            </h3>
            <p className="mb-4">
              Em caso de fusão, aquisição ou venda de ativos, suas informações podem ser transferidas.
            </p>
          </section>

          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[#e5e7eb] to-transparent my-12" />

          {/* Section 5 */}
          <section id="secao-5" className="section mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold text-[#3a4934] mb-6 pb-3 border-b-2 border-[#97624b]">
              5. ARMAZENAMENTO E SEGURANÇA
            </h2>

            <h3 className="text-xl font-semibold text-[#292823] mt-8 mb-4">5.1. Onde Armazenamos</h3>
            <p className="mb-4">
              Seus dados são armazenados em servidores seguros localizados no Brasil e em outros países, incluindo:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Infraestrutura em nuvem</li>
              <li>Serviços de e-mail</li>
              <li>Plataformas de pagamento</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#292823] mt-8 mb-4">
              5.2. Medidas de Segurança
            </h3>
            <p className="mb-4">
              Implementamos medidas técnicas e organizacionais para proteger suas informações:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Criptografia de dados em trânsito e em repouso</li>
              <li>Controles de acesso restrito</li>
              <li>Monitoramento regular de segurança</li>
              <li>Backup regular de dados</li>
              <li>Treinamento de equipe sobre privacidade</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#292823] mt-8 mb-4">5.3. Limitações</h3>
            <p className="mb-4">
              Embora façamos o possível para proteger seus dados, nenhum sistema é 100% seguro. Você é responsável por manter a confidencialidade de suas senhas e credenciais.
            </p>
          </section>

          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[#e5e7eb] to-transparent my-12" />

          {/* Section 6 */}
          <section id="secao-6" className="section mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold text-[#3a4934] mb-6 pb-3 border-b-2 border-[#97624b]">
              6. COOKIES E TECNOLOGIAS SIMILARES
            </h2>

            <h3 className="text-xl font-semibold text-[#292823] mt-8 mb-4">6.1. O que são Cookies</h3>
            <p className="mb-4">
              Cookies são pequenos arquivos de texto armazenados no seu dispositivo que nos ajudam a melhorar sua experiência.
            </p>

            <h3 className="text-xl font-semibold text-[#292823] mt-8 mb-4">
              6.2. Tipos de Cookies que Usamos
            </h3>

            <h4 className="text-lg font-semibold text-[#3a4934] mt-6 mb-3">
              Cookies Essenciais (Necessários)
            </h4>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Funcionamento básico do site</li>
              <li>Segurança e autenticação</li>
              <li>Carrinho de compras</li>
            </ul>

            <h4 className="text-lg font-semibold text-[#3a4934] mt-6 mb-3">Cookies de Desempenho</h4>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Google Analytics</li>
              <li>Análise de uso do site</li>
              <li>Melhorias de performance</li>
            </ul>

            <h4 className="text-lg font-semibold text-[#3a4934] mt-6 mb-3">
              Cookies de Funcionalidade
            </h4>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Preferências do usuário</li>
              <li>Idioma e configurações</li>
              <li>Lembretes de login</li>
            </ul>

            <h4 className="text-lg font-semibold text-[#3a4934] mt-6 mb-3">Cookies de Marketing</h4>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Facebook Pixel</li>
              <li>Google Ads</li>
              <li>Anúncios direcionados</li>
              <li>Remarketing</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#292823] mt-8 mb-4">6.3. Gerenciar Cookies</h3>
            <p className="mb-4">
              Você pode controlar cookies através das configurações do seu navegador. Note que desabilitar cookies pode afetar a funcionalidade do site.
            </p>
          </section>

          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[#e5e7eb] to-transparent my-12" />

          {/* Section 7 */}
          <section id="secao-7" className="section mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold text-[#3a4934] mb-6 pb-3 border-b-2 border-[#97624b]">
              7. SEUS DIREITOS (LGPD)
            </h2>

            <p className="mb-4">
              De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem os seguintes direitos:
            </p>

            <div className="bg-[#f0fdf4] border-l-4 border-[#10b981] p-6 my-8 rounded">
              <h3 className="text-lg text-[#10b981] font-semibold mt-0 mb-4">
                7.1. Direito de Acesso
              </h3>
              <p className="mb-4">
                Você pode solicitar cópia de todos os dados pessoais que temos sobre você.
              </p>

              <h3 className="text-lg text-[#10b981] font-semibold mt-6 mb-4">
                7.2. Direito de Retificação
              </h3>
              <p className="mb-4">
                Você pode solicitar a correção de dados incorretos ou desatualizados.
              </p>

              <h3 className="text-lg text-[#10b981] font-semibold mt-6 mb-4">
                7.3. Direito de Exclusão
              </h3>
              <p className="mb-4">
                Você pode solicitar a exclusão de seus dados pessoais, exceto quando necessário para cumprimento de obrigações legais.
              </p>

              <h3 className="text-lg text-[#10b981] font-semibold mt-6 mb-4">
                7.4. Direito de Portabilidade
              </h3>
              <p className="mb-4">
                Você pode solicitar seus dados em formato estruturado e de leitura automática.
              </p>

              <h3 className="text-lg text-[#10b981] font-semibold mt-6 mb-4">
                7.5. Direito de Oposição
              </h3>
              <p className="mb-4">
                Você pode se opor ao processamento de seus dados para certas finalidades.
              </p>

              <h3 className="text-lg text-[#10b981] font-semibold mt-6 mb-4">
                7.6. Direito de Revogar Consentimento
              </h3>
              <p className="mb-4">Você pode retirar seu consentimento a qualquer momento.</p>

              <h3 className="text-lg text-[#10b981] font-semibold mt-6 mb-4">
                7.7. Direito à Informação
              </h3>
              <p className="mb-0">
                Você pode solicitar informações sobre o uso compartilhado de seus dados.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-[#292823] mt-8 mb-4">
              Como Exercer Seus Direitos:
            </h3>
            <p className="mb-4">
              Para exercer qualquer um desses direitos, entre em contato conosco através de:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>E-mail: contato@nicoleguedesodonto.com.br</li>
              <li>WhatsApp: (11) 95190-3402</li>
              <li>Presencialmente em nossa clínica</li>
            </ul>
            <p className="mb-4">Responderemos sua solicitação em até 15 dias úteis.</p>
          </section>

          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[#e5e7eb] to-transparent my-12" />

          {/* Section 8 */}
          <section id="secao-8" className="section mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold text-[#3a4934] mb-6 pb-3 border-b-2 border-[#97624b]">
              8. RETENÇÃO DE DADOS
            </h2>

            <p className="mb-4">Mantemos suas informações pessoais pelo tempo necessário para:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Fornecer nossos serviços</li>
              <li>Cumprir obrigações legais (ex: dados fiscais por 5 anos)</li>
              <li>Resolver disputas</li>
              <li>Fazer cumprir nossos acordos</li>
            </ul>
            <p className="mb-4">
              Após esse período, seus dados serão anonimizados ou excluídos de forma segura.
            </p>
          </section>

          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[#e5e7eb] to-transparent my-12" />

          {/* Section 9 */}
          <section id="secao-9" className="section mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold text-[#3a4934] mb-6 pb-3 border-b-2 border-[#97624b]">
              9. MENORES DE IDADE
            </h2>

            <p className="mb-4">
              Nossos serviços são destinados a pessoas maiores de 18 anos. Não coletamos intencionalmente informações de menores de idade sem o consentimento dos pais ou responsáveis legais.
            </p>
            <p className="mb-4">
              Se você acredita que coletamos informações de um menor inadvertidamente, entre em contato conosco imediatamente.
            </p>
          </section>

          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[#e5e7eb] to-transparent my-12" />

          {/* Section 10 */}
          <section id="secao-10" className="section mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold text-[#3a4934] mb-6 pb-3 border-b-2 border-[#97624b]">
              10. ALTERAÇÕES NESTA POLÍTICA
            </h2>

            <p className="mb-4">
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre mudanças significativas através de:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Aviso no site</li>
              <li>E-mail</li>
              <li>Notificação no aplicativo</li>
            </ul>
            <p className="mb-4">
              A data da "Última atualização" no topo desta página indica quando a política foi revisada pela última vez.
            </p>
            <p className="mb-4">Recomendamos que você revise esta política regularmente.</p>
          </section>

          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[#e5e7eb] to-transparent my-12" />

          {/* Section 11 */}
          <section id="secao-11" className="section mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold text-[#3a4934] mb-6 pb-3 border-b-2 border-[#97624b]">
              11. CONTATO
            </h2>

            <p className="mb-4">
              Se você tiver dúvidas, preocupações ou solicitações relacionadas a esta Política de Privacidade ou ao tratamento de seus dados pessoais, entre em contato conosco:
            </p>

            <div className="bg-[#f9fafb] border-2 border-[#e5e7eb] rounded-xl p-8 my-8">
              <h3 className="text-lg font-semibold text-[#3a4934] mt-0 mb-4">
                Nicole Guedes Odonto
              </h3>

              <p className="mb-4">
                <strong className="font-semibold text-[#3a4934]">Endereço:</strong>
                <br />
                Av. Aniello Pratice, 50 - Jardim Santa Francisca
                <br />
                Guarulhos/SP - Brasil
              </p>

              <p className="mb-4">
                <strong className="font-semibold text-[#3a4934]">E-mail:</strong>{" "}
                contato@nicoleguedesodonto.com.br
                <br />
                <strong className="font-semibold text-[#3a4934]">WhatsApp:</strong> (11) 95190-3402
                <br />
                <strong className="font-semibold text-[#3a4934]">Instagram:</strong>{" "}
                @dra.nicoleguedess
              </p>

              <p className="mb-0">
                <strong className="font-semibold text-[#3a4934]">Encarregado de Dados (DPO):</strong>
                <br />
                Para questões específicas sobre proteção de dados, entre em contato através do e-mail acima com o assunto "LGPD - Proteção de Dados".
              </p>
            </div>

            <p className="italic text-[#6b7280] my-8 p-4 bg-[#f9fafb] rounded-lg">
              Ao utilizar nosso site e serviços, você reconhece que leu, compreendeu e concordou com esta Política de Privacidade.
            </p>

            <p className="text-center text-sm text-[#6b7280] mt-12 pt-8 border-t border-[#e5e7eb]">
              Nicole Guedes Odonto - CNPJ: XX.XXX.XXX/XXXX-XX
              <br />© 2024 - Todos os direitos reservados
            </p>
          </section>
        </article>
      </main>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 w-12 h-12 bg-[#97624b] text-white rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all z-50 hover:bg-[#3a4934] hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)] ${
          showBackToTop ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        aria-label="Voltar ao topo"
      >
        <ChevronUp className="w-6 h-6" />
      </button>

      {/* Footer */}
      <footer className="bg-[#292823] text-[#f3f0e9] py-8 px-6 text-center">
        <nav className="mb-4">
          <Link to="/" className="text-[#f3f0e9] hover:text-[#97624b] transition-colors mx-2">
            Home
          </Link>{" "}
          |
          <Link
            to="/politica-de-privacidade"
            className="text-[#f3f0e9] hover:text-[#97624b] transition-colors mx-2"
          >
            Política de Privacidade
          </Link>{" "}
          |
          <Link
            to="/termos-de-uso"
            className="text-[#f3f0e9] hover:text-[#97624b] transition-colors mx-2"
          >
            Termos de Uso
          </Link>
        </nav>
        <p className="text-sm text-[#b8b8b8]">
          © 2024 Nicole Guedes Odonto - Todos os direitos reservados
        </p>
      </footer>
    </div>
  );
};

export default PoliticaPrivacidade;
