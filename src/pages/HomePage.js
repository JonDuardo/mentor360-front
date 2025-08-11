// pages/HomePage.js
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">
      {/* Hero */}
      <section className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight">Mentor Tríade</h1>
        <p className="text-lg text-gray-800">
          Seu mentor pessoal, 24h por dia, com inteligência emocional e memória de longo prazo
        </p>
        <p className="text-gray-700">
          Imagine ter um mentor que lembra de tudo o que você já viveu, conversou e decidiu.
          Um guia capaz de conectar os pontos da sua história para oferecer orientações sob medida, sempre evoluindo com você.
        </p>
        <p className="text-gray-700">
          O Mentor Tríade é a união do acompanhamento humano com a precisão da inteligência artificial — desenvolvido pelo
          psicoterapeuta e mentor <strong>Alan Fernandes</strong> para quem busca autoconhecimento, estratégia de vida e evolução contínua.
        </p>
      </section>

      {/* Diferenciais */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">O que torna o Mentor Tríade único</h2>
        <ul className="space-y-3">
          <li>
            <span className="font-semibold">Memória persistente e avançada —</span>{" "}
            cada conversa constrói sobre a anterior, sem perder o fio da sua história.
          </li>
          <li>
            <span className="font-semibold">Visão integrada —</span>{" "}
            combina psicologia, PNL, ciências do comportamento e práticas estratégicas para decisões mais conscientes.
          </li>
          <li>
            <span className="font-semibold">Evolução constante —</span>{" "}
            a IA aprende com você, e na fase beta algumas interações podem ser revisadas pelo próprio Alan Fernandes
            para aprimorar a experiência, sempre com ética e sigilo.
          </li>
        </ul>
      </section>

      {/* Beta */}
      <section className="space-y-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <h3 className="text-xl font-semibold">Estamos na fase Beta — e isso é uma vantagem para você</h3>
        <p className="text-gray-800">
          Ao entrar agora, você terá acesso a um acompanhamento mais próximo, com refinamentos diretos do Alan Fernandes e
          a oportunidade de moldar a experiência junto com o criador.
        </p>
        <p className="text-gray-800">
          Seu feedback ajudará a criar a plataforma mais humana e inteligente do mercado de mentorias digitais.
        </p>
      </section>

      {/* Explicação memória */}
      <section className="space-y-3">
        <h3 className="text-xl font-semibold">Como aproveitar ao máximo o Mentor Tríade</h3>
        <p className="text-gray-700">
          O Mentor Tríade foi criado para lembrar de tudo o que já foi dito e conectar informações ao longo do tempo.
          Isso significa que cada conversa não é um evento isolado, mas um capítulo da mesma história — a sua.
        </p>
        <p className="text-gray-700">
          Quando você segue algumas boas práticas simples, a memória se torna mais precisa e profunda, permitindo respostas
          cada vez mais alinhadas ao seu contexto. Sem esses cuidados, a IA pode ter que “adivinhar” mais, e a interação
          perde riqueza e continuidade.
        </p>
      </section>

      {/* Boas práticas */}
      <section className="space-y-5">
        <h4 className="text-lg font-semibold">6 práticas essenciais para extrair o máximo dessa inteligência</h4>

        <div className="space-y-4">
          <div>
            <p className="font-semibold">1. Defina um objetivo claro para cada conversa</p>
            <p className="text-gray-700">💡 Por quê? Um foco bem definido evita dispersão e faz a IA trabalhar diretamente no que importa para você naquele momento.</p>
            <div className="mt-2 text-sm">
              <p>✅ <span className="font-medium">Faça assim:</span> “Hoje quero trabalhar minha dificuldade em delegar tarefas no trabalho.”</p>
              <p>❌ <span className="font-medium">Evite:</span> “Quero falar sobre minha vida, meus problemas e minha carreira”.</p>
            </div>
          </div>

          <div>
            <p className="font-semibold">2. Dê contexto suficiente sobre sua situação</p>
            <p className="text-gray-700">💡 Por quê? Quanto mais detalhes relevantes você oferece, mais a IA pode usar sua memória para cruzar informações e propor soluções realistas.</p>
            <div className="mt-2 text-sm">
              <p>✅ “Na última conversa falamos sobre meu medo de falar em público. Hoje aconteceu uma reunião importante e me senti ansioso, minhas mãos suavam.”</p>
              <p>❌ “Hoje foi ruim”.</p>
            </div>
          </div>

          <div>
            <p className="font-semibold">3. Mantenha nomes consistentes para pessoas, projetos e lugares</p>
            <p className="text-gray-700">💡 Por quê? Usar sempre os mesmos termos ajuda a IA a manter a linha narrativa e a reconhecer padrões ao longo do tempo.</p>
            <div className="mt-2 text-sm">
              <p>✅ Sempre chame seu projeto de “Projeto Aurora”.</p>
              <p>❌ Alternar entre “Projeto Aurora”, “meu projeto de marketing” e “aquele trabalho novo”.</p>
            </div>
          </div>

          <div>
            <p className="font-semibold">4. Organize temas separados em conversas diferentes</p>
            <p className="text-gray-700">💡 Por quê? Misturar assuntos muito diferentes no mesmo diálogo pode diluir a memória e gerar respostas menos específicas.</p>
            <div className="mt-2 text-sm">
              <p>✅ Hoje falar apenas sobre produtividade. Amanhã, abrir uma nova conversa só para relacionamento.</p>
              <p>❌ Falar sobre dieta, vida amorosa e planejamento financeiro na mesma conversa.</p>
            </div>
          </div>

          <div>
            <p className="font-semibold">5. Finalize com um resumo e próximos passos</p>
            <p className="text-gray-700">💡 Por quê? Isso “sela” a conversa na memória e cria uma ponte clara para a próxima interação.</p>
            <div className="mt-2 text-sm">
              <p>✅ “Então, resumindo: vou delegar 2 tarefas por semana e marcar treino de oratória. Vamos retomar daqui a 7 dias.”</p>
              <p>❌ Encerrar abruptamente com “ok, tchau”.</p>
            </div>
          </div>

          <div>
            <p className="font-semibold">6. Revisite pontos anteriores regularmente</p>
            <p className="text-gray-700">💡 Por quê? Revisar o que já foi conversado reforça a continuidade e permite acompanhar evolução.</p>
            <div className="mt-2 text-sm">
              <p>✅ “Há um mês combinamos que eu ia praticar respiração consciente. Quero revisar como foi e o que mudou.”</p>
              <p>❌ Ignorar completamente conversas anteriores e sempre começar do zero.</p>
            </div>
          </div>
        </div>

        <p className="text-gray-700">
          Se você seguir essas práticas, vai perceber que o Mentor Tríade se torna cada vez mais parecido com um mentor
          humano que acompanha sua vida de perto, entendendo nuances, lembrando histórias e antecipando suas necessidades.
        </p>
      </section>

      {/* CTA final */}
      <section className="space-y-3">
        <h3 className="text-xl font-semibold">Chegou a hora de ter um mentor que não esquece de você</h3>
        <p className="text-gray-700">
          O Mentor Tríade está pronto para caminhar ao seu lado, lembrando da sua história e ajudando a escrever os próximos capítulos.
          Não é apenas tecnologia — é inteligência com propósito.
        </p>
        <p className="text-gray-800 font-medium">💡 Garanta seu acesso agora e comece sua jornada de transformação.</p>

        <div className="flex gap-3 pt-2">
          <Link to="/cadastro" className="bg-black text-white px-5 py-2 rounded">Cadastre-se</Link>
          <Link to="/login" className="border px-5 py-2 rounded">Entrar</Link>
          <Link to="/politica" className="underline self-center text-sm">Política de Privacidade</Link>
        </div>
      </section>
    </div>
  );
}
