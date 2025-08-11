// pages/PoliticaPage.js
export default function PoliticaPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Política de Privacidade – Mentor 360</h1>
      <p className="text-sm text-gray-500 mb-6">Última atualização: 11 de agosto de 2025</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Escopo e Finalidade</h2>
      <p>
        O Mentor 360 é um sistema em fase beta. Nosso objetivo é oferecer uma experiência de orientação e suporte baseada em
        inteligência artificial, complementada por acompanhamento humano qualificado.
        Durante esta fase, as interações podem ser analisadas para aprimorar a precisão, a empatia e a segurança das respostas.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Tratamento das Conversas</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Suas conversas são registradas para que você possa acessá-las posteriormente e para que possamos melhorar a qualidade do serviço.</li>
        <li>
          Durante o período beta, <strong>o profissional Alan Fernandes</strong>, devidamente habilitado e aderente ao código ético
          de sua profissão, poderá revisar trechos das conversas de forma periódica para garantir a adequação e evolução do atendimento.
        </li>
        <li>
          O Alan poderá, eventualmente, discutir <strong>trechos específicos</strong> com a equipe técnica, exclusivamente para ajustes técnicos
          e melhoria das respostas. Nestes casos:
          <ul className="list-disc pl-6 mt-2">
            <li><strong>Nunca</strong> será compartilhado o contexto completo da conversa.</li>
            <li><strong>Nunca</strong> será informado quem é o usuário.</li>
            <li>O conteúdo será limitado ao necessário para solucionar o ponto técnico.</li>
          </ul>
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Compartilhamento com Equipe Técnica</h2>
      <p>
        Trechos anonimizados das conversas podem ser usados para ajustes e testes de funcionalidades, além de melhoria dos modelos
        de inteligência artificial utilizados. Nenhum dado que identifique pessoalmente o usuário será repassado a terceiros sem consentimento.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Armazenamento e Segurança</h2>
      <p>
        As informações são armazenadas de forma segura em servidores de parceiros confiáveis, com criptografia em trânsito e
        controles de acesso restritos. Apesar de adotarmos boas práticas de segurança, nenhum sistema é 100% imune a falhas.
        Ao utilizar o Mentor 360, você reconhece e aceita esse risco residual.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Direitos do Usuário</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Solicitar acesso aos seus dados.</li>
        <li>Solicitar a correção de informações imprecisas.</li>
        <li>Solicitar a exclusão de suas informações e histórico de conversas.</li>
        <li>Retirar seu consentimento a qualquer momento (o que pode impedir o uso do serviço).</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Alterações nesta Política</h2>
      <p>
        Podemos atualizar esta política periodicamente. Alterações relevantes serão comunicadas por email ou destacadas dentro
        da própria plataforma. O uso contínuo do serviço após a atualização significará a aceitação da nova versão.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Contato</h2>
      <p>Em caso de dúvidas sobre esta política ou sobre o tratamento de dados, entre em contato pelo email: suporte@mentor360.com.br</p>
    </div>
  );
}
