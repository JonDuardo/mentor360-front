// src/pages/AboutPage.js

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 text-gray-800 leading-relaxed">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">
        Alan Fernandes – Psicoterapeuta, Mentor de Autoconhecimento e Habilidades Comportamentais, Empreendedor
      </h1>

      {/* Foto do Alan */}
      <div className="flex justify-center mb-10">
        <img
          src="/media/alanbot-sobre.jpg"
          alt="Alan Fernandes"
          className="rounded-lg shadow-md max-w-full w-[500px]"
        />
      </div>

      <p className="mb-6">
        Durante muitos anos, eu acreditei que nunca conseguiria me comunicar plenamente.{" "}
        <strong>A gagueira me acompanhava desde a infância</strong> e trouxe insegurança, medo de me expor
        e a sensação de estar sempre limitado. Essa dor me empurrou para a busca pelo autoconhecimento:
        entender como a mente, as emoções e os padrões de comportamento inconscientes moldam a vida de cada um de nós.
        Aos poucos, transformei a gagueira em força e clareza — e percebi que meu propósito era compartilhar esse caminho com outras pessoas.
      </p>

      <p className="mb-6">
        De lá para cá, já se passaram <strong>mais de 15 anos de atuação profissional</strong>. 
        Sou formado em <strong>Psicanálise</strong> e em <strong>Administração de Empresas</strong>, 
        com especializações em <strong>Neurociência, Neurolinguística e Desenvolvimento Comportamental</strong>. 
        Atendi milhares de pessoas e empresas em processos de psicoterapia, mentoria e desenvolvimento humano. 
        Ministrei treinamentos, promovi eventos e acompanhei histórias de diversas pessoas não só no Brasil, 
        mas também em <strong>Portugal, Espanha, Inglaterra, Estados Unidos, Irlanda e Japão</strong>. 
        Cada encontro me confirmou que, apesar das diferenças culturais, os dilemas humanos são universais: 
        todos buscamos liberdade para escolher quem queremos ser e realizar nossos sonhos.
      </p>

      <p className="mb-6">
        Meu trabalho é voltado para <strong>despertar o poder pessoal das pessoas</strong>, ajudando-as a desenvolver
        suas habilidades emocionais, sociais e comportamentais. Para isso, criei a{" "}
        <strong>Metodologia TRÍADE</strong> — que une Consciência, Influência e Consistência. 
        Essa abordagem proporciona aumento da permissão interna, expansão das habilidades emocionais, sociais e comportamentais, 
        clareza sobre direcionamento e estratégias práticas para a realização de objetivos.
      </p>

      <p className="mb-6">
        O meu estilo de atuação une <strong>ciência do comportamento, prática clínica e uma linguagem simples e acessível</strong>. 
        Não acredito em autoconhecimento distante da vida real. 
        Acredito em olhar profundo, mas também em ferramentas práticas para lidar com os desafios do dia a dia.
      </p>

      <p className="mb-6">
        Se você chegou até aqui, quero te dizer algo:{" "}
        <strong>
          eu sei como é se sentir preso em padrões que parecem maiores do que nós. 
          Mas também sei que é possível se libertar, fazer escolhas conscientes e criar uma vida mais autêntica.
        </strong>{" "}
        O AlanBot é um convite para você <strong>começar — ou continuar — esse caminho de descoberta e transformação</strong>.
      </p>
    </main>
  );
}
