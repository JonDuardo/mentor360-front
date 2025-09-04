// src/pages/AboutPage.js

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 text-gray-800 leading-relaxed">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">
        Alan Fernandes – Psicoterapeuta, Mentor de Autoconhecimento e Empreendedor
      </h1>

      {/* Foto do Alan */}
      <div className="flex justify-center mb-10">
        <img
          src="/media/alanbot-poster.jpg"
          alt="Alan Fernandes"
          className="rounded-lg shadow-md max-w-full w-[500px]"
        />
      </div>

      <p className="mb-6">
        Durante muitos anos eu acreditei que nunca conseguiria me comunicar plenamente. 
        <strong> A gagueira me acompanhava desde a infância </strong> e trouxe insegurança, 
        medo de me expor e a sensação de estar sempre limitado. 
        Foi essa dor que me empurrou para a busca pelo autoconhecimento: entender como a mente, 
        as emoções e os padrões inconscientes moldam a vida de cada um de nós. 
        Aos poucos, essa jornada me ajudou a transformar a gagueira em força e clareza. 
        E foi aí que eu percebi que meu propósito era compartilhar esse caminho com outras pessoas.
      </p>

      <p className="mb-6">
        De lá para cá já se passaram mais de 15 anos de atuação. 
        Sou formado em psicologia, com especializações em programação neurolinguística e coaching, 
        além de diversos cursos que fiz e continuo fazendo. 
        Atendi <strong>mais de 2000 pessoas</strong> em processos de psicoterapia, mentoria e performance. 
        Criei cursos, ministrei treinamentos, participei de eventos e tive a oportunidade de acompanhar histórias 
        não só no Brasil, mas também em <strong>Portugal, Irlanda e Estados Unidos</strong>. 
        Cada encontro me mostrou que, apesar das diferenças culturais, os dilemas humanos são universais: 
        todos buscamos liberdade para escolher quem queremos ser.
      </p>

      <p className="mb-6">
        O meu estilo de trabalho une ciência do comportamento, prática clínica e uma linguagem simples e acessível. 
        Não acredito em autoconhecimento distante da vida real. 
        Acredito em olhar profundo, mas também em ferramentas práticas para lidar com os desafios do dia a dia.
      </p>

      <p className="mb-6">
        O <strong>AlanBot</strong> nasceu justamente dessa bagagem. 
        Ele foi criado para traduzir, em um espaço digital, a forma como penso, questiono e provoco transformações. 
        É uma forma de estar presente para mais pessoas, levando clareza, acolhimento e direção mesmo fora da sala de atendimento.
      </p>

      <p className="mb-6">
        Se você chegou até aqui, quero te dizer uma coisa: 
        <strong> eu sei como é se sentir preso em padrões que parecem maiores do que nós. </strong> 
        Mas também sei que é possível se libertar, fazer escolhas conscientes e criar uma vida mais autêntica. 
        As minhas mentorias individuais e o AlanBot são convites para você começar — ou continuar — 
        esse caminho de descoberta e transformação.
      </p>
    </main>
  );
}
