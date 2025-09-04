// src/pages/InstructionsPage.js
import TopChatMenu from "../components/TopChatMenu";

export default function InstructionsPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 text-gray-800 leading-relaxed">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
        Instruções de Uso do AlanBot
      </h1>

      {/* Submenu de ações, centralizado */}
      <div className="mb-8">
        <TopChatMenu />
      </div>

      <p className="mb-6">
        O AlanBot lembra do que você diz dentro das sessões e conecta informações ao longo do tempo.
        Cada conversa não é isolada, mas um capítulo da sua história. Quanto mais claro e consistente
        você for, mais a memória funciona bem.
      </p>

      {/* Como a memória funciona hoje */}
      <section className="space-y-3 mb-8">
        <h2 className="text-2xl font-semibold">Como a memória funciona hoje</h2>

        <div className="space-y-2">
          <p>🧠 <strong>O que é salvo</strong></p>
          <ul className="list-disc pl-6">
            <li>Histórico de conversas em cada sessão.</li>
            <li>Resumos finais e próximos passos, quando você escreve explicitamente.</li>
          </ul>
        </div>

        <div className="space-y-2">
          <p>🚫 <strong>O que não é salvo</strong></p>
          <ul className="list-disc pl-6">
            <li>Mensagens soltas sem contexto.</li>
            <li>Dados ambíguos ou contraditórios.</li>
          </ul>
        </div>

        <div className="space-y-2">
          <p>📂 <strong>Sessões</strong></p>
          <ul className="list-disc pl-6">
            <li>Cada conversa é uma sessão. Você pode retomá-las em “Sessões”.</li>
            <li>No fim de uma sessão, um resumo curto ajuda a consolidar o que foi dito.</li>
          </ul>
        </div>
      </section>

      {/* 5 práticas essenciais */}
      <section className="space-y-4 mb-8">
        <h2 className="text-2xl font-semibold">5 práticas essenciais</h2>

        <div>
          <p className="font-medium">1) 🎯 Defina um objetivo claro</p>
          <p>✅ “Hoje quero trabalhar minha dificuldade em delegar tarefas.”</p>
          <p>❌ “Quero falar de tudo ao mesmo tempo.”</p>
        </div>

        <div>
          <p className="font-medium">2) 🧩 Dê contexto suficiente</p>
          <p>✅ “Na última conversa falamos de medo de falar em público. Hoje tive reunião e fiquei ansioso.”</p>
          <p>❌ “Hoje foi ruim.”</p>
        </div>

        <div>
          <p className="font-medium">3) 🏷️ Seja consistente nos nomes</p>
          <p>✅ Use sempre “Projeto Aurora”.</p>
          <p>❌ Alternar entre “Aurora”, “meu projeto de marketing” e “aquele trabalho novo”.</p>
        </div>

        <div>
          <p className="font-medium">4) 🗂️ Separe temas em sessões diferentes</p>
          <p>✅ Hoje produtividade. Amanhã relacionamento.</p>
          <p>❌ Misturar dieta, finanças e vida amorosa na mesma conversa.</p>
        </div>

        <div>
          <p className="font-medium">5) ✍️ Finalize com resumo e próximos passos</p>
          <p>✅ “Resumo: vou delegar 2 tarefas por semana e marcar treino de oratória. Retomar em 7 dias.”</p>
          <p>❌ Encerrar com “ok, tchau”.</p>
        </div>
      </section>

      {/* Erros comuns */}
      <section className="space-y-3 mb-10">
        <h2 className="text-2xl font-semibold">Erros comuns</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>❌ Trocar nomes no meio da história.</li>
          <li>❌ Juntar vários assuntos diferentes na mesma sessão.</li>
          <li>❌ Não fechar a conversa com resumo.</li>
        </ul>
      </section>

      {/* Conclusão */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Conclusão</h2>
        <p>
          Seguindo essas práticas simples, suas conversas com o AlanBot ficam mais ricas e conectadas.
          Com o tempo, cada sessão se soma às anteriores, criando um acompanhamento cada vez mais próximo e
          personalizado.
        </p>
        <p className="text-lg">
          ✨ Que venham boas conversas e descobertas — o AlanBot está aqui para caminhar junto com você.
        </p>
      </section>
    </main>
  );
}
