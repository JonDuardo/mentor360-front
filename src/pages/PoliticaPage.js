// src/pages/PoliticaPage.jsx
import { Link } from "react-router-dom";

export default function PoliticaPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      {/* Título */}
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Política de Privacidade – AlanBot
        </h1>
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Última atualização:</span> 29 de agosto de 2025
        </p>
      </header>

      {/* 1. Escopo e Finalidade */}
      <section id="escopo-finalidade" className="space-y-3">
        <h2 className="text-2xl font-semibold">1. Escopo e Finalidade</h2>
        <p className="text-gray-800">
          O AlanBot é um sistema em fase beta. Nosso objetivo é oferecer uma experiência
          de orientação e suporte baseada em inteligência artificial, programada com
          conhecimento técnico e abordagem de um profissional qualificado como
          psicoterapeuta e mentor de desenvolvimento humano integral.
        </p>
      </section>

      {/* 2. Tratamento das Conversas */}
      <section id="tratamento-conversas" className="space-y-3">
        <h2 className="text-2xl font-semibold">2. Tratamento das Conversas</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-800">
          <li>
            Suas interações com a IA Alanbot são registradas no seu histórico de sessões,
            para que você possa acessá-las posteriormente e para que a IA possa manter sua
            abordagem em melhoria contínua e personalizada para você.
          </li>
          <li>
            Suas interações com a IA Alanbot estão sobre absoluto sigilo e protegidas por
            criptografia.
          </li>
          <li>Nunca será compartilhado o contexto da sua conversa.</li>
          <li>Nunca será informado quem é o usuário.</li>
          <li>
            As análises de todas interações da IA AlanBot com seus usuários, serão abordadas
            como padrões gerais de interação, para avaliação de melhorias contínuas pelo
            sistema de programação da performance da IA AlanBot.
          </li>
        </ul>
      </section>

      {/* 3. Compartilhamento com Equipe Técnica */}
      <section id="compartilhamento-equipe" className="space-y-3">
        <h2 className="text-2xl font-semibold">3. Compartilhamento com Equipe Técnica</h2>
        <p className="text-gray-800">
          Trechos anônimos das conversas podem ser usados para ajustes e testes de
          funcionalidades, além de melhoria dos modelos de inteligência artificial
          utilizados. Nenhum dado que identifique pessoalmente o usuário será repassado
          a terceiros.
        </p>
      </section>

      {/* 4. Armazenamento e Segurança */}
      <section id="armazenamento-seguranca" className="space-y-3">
        <h2 className="text-2xl font-semibold">4. Armazenamento e Segurança</h2>
        <p className="text-gray-800">
          As informações são armazenadas de forma segura em servidores de parceiros
          confiáveis, com criptografia em trânsito e controles de acesso restritos.
          Apesar de adotarmos boas práticas de segurança, nenhum sistema é 100% imune
          a falhas. Ao utilizar o AlanBot, você reconhece e aceita esse risco residual.
        </p>
      </section>

      {/* 5. Direitos do Usuário */}
      <section id="direitos-usuario" className="space-y-3">
        <h2 className="text-2xl font-semibold">5. Direitos do Usuário</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-800">
          <li>Solicitar acesso aos seus dados.</li>
          <li>Solicitar a correção de informações imprecisas.</li>
          <li>Solicitar a exclusão de suas informações e histórico de conversas.</li>
          <li>
            Retirar seu consentimento dessa política de privacidade a qualquer momento
            (o que pode impedir o uso do serviço).
          </li>
        </ul>
      </section>

      {/* 6. Alterações nesta Política */}
      <section id="alteracoes" className="space-y-3">
        <h2 className="text-2xl font-semibold">6. Alterações nesta Política</h2>
        <p className="text-gray-800">
          Podemos atualizar esta política periodicamente. Alterações relevantes serão
          comunicadas por email ou destacadas dentro da própria plataforma. O uso
          contínuo do serviço após a atualização significará a aceitação da nova versão.
        </p>
      </section>

      {/* 7. Contato */}
      <section id="contato" className="space-y-3">
        <h2 className="text-2xl font-semibold">7. Contato</h2>
        <p className="text-gray-800">
          Em caso de dúvidas sobre esta política ou sobre o tratamento de dados, entre
          em contato pelo email:{" "}
          <a
            href="mailto:contato@dominandoojogo.com.br"
            className="underline"
          >
            contato@dominandoojogo.com.br
          </a>
          .
        </p>
      </section>

      {/* Rodapé simples da página de política */}
      <footer className="pt-6 border-t">
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/" className="underline">Voltar à Home</Link>
          <span className="text-gray-400">|</span>
          <Link to="/cadastro" className="underline">Cadastre-se grátis</Link>
          <span className="text-gray-400">|</span>
          <Link to="/login" className="underline">Entrar</Link>
        </div>
      </footer>
    </main>
  );
}
