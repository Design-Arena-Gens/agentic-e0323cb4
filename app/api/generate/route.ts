import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { tema, estilo, duracao } = await request.json()

  // Mapeamento de duração para número de cenas
  const numCenas = duracao === 'curto' ? 3 : duracao === 'medio' ? 5 : 8

  // Geração de roteiro estruturado (simulado - pode ser integrado com OpenAI API)
  const story = {
    titulo: gerarTitulo(tema, estilo),
    roteiro: gerarSinopse(tema, estilo),
    cenas: Array.from({ length: numCenas }, (_, i) => gerarCena(i + 1, tema, estilo, duracao, numCenas))
  }

  return NextResponse.json(story)
}

function gerarTitulo(tema: string, estilo: string): string {
  const prefixos: Record<string, string[]> = {
    terror: ['O Segredo de', 'A Maldição de', 'O Mistério de', 'Sombras em'],
    misterio: ['O Enigma de', 'O Caso', 'Investigando', 'Os Segredos de'],
    ficcao: ['Além de', 'Viagem para', 'A Dimensão de', 'Futuro'],
    drama: ['A História de', 'Memórias de', 'O Dilema de', 'Entre'],
    comedia: ['As Aventuras de', 'Confusões em', 'O Dia Que', 'Risadas em'],
    acao: ['A Missão', 'Caçada em', 'Fuga de', 'Batalha em'],
    motivacional: ['Superando', 'A Jornada de', 'Transformação', 'O Poder de'],
    educativo: ['Entendendo', 'A Ciência de', 'Como Funciona', 'Descobrindo']
  }

  const prefixoLista = prefixos[estilo] || prefixos.misterio
  const prefixo = prefixoLista[Math.floor(Math.random() * prefixoLista.length)]
  const temaFormatado = tema.substring(0, 30).trim()

  return `${prefixo} ${temaFormatado}`
}

function gerarSinopse(tema: string, estilo: string): string {
  const templates: Record<string, string> = {
    terror: `Uma história assustadora sobre ${tema}. Prepare-se para momentos de tensão e sustos que vão prender sua atenção do início ao fim. Elementos sobrenaturais e atmosfera sombria criam uma experiência aterrorizante.`,
    misterio: `Um intrigante mistério envolvendo ${tema}. Pistas são reveladas gradualmente, levando a uma conclusão surpreendente que vai desafiar suas expectativas.`,
    ficcao: `Uma aventura de ficção científica explorando ${tema}. Tecnologia avançada, conceitos futuristas e dilemas éticos se entrelaçam nesta narrativa épica.`,
    drama: `Um drama emocionante sobre ${tema}. Personagens profundos enfrentam desafios pessoais e decisões difíceis que mudarão suas vidas para sempre.`,
    comedia: `Uma comédia divertida sobre ${tema}. Situações hilárias e diálogos espirituosos garantem risadas do início ao fim.`,
    acao: `Uma ação explosiva envolvendo ${tema}. Cenas de tirar o fôlego, adrenalina pura e uma narrativa dinâmica mantêm você na ponta da cadeira.`,
    motivacional: `Uma história inspiradora sobre ${tema}. Superação, determinação e transformação pessoal mostram que é possível alcançar o impossível.`,
    educativo: `Um conteúdo educativo sobre ${tema}. Informações valiosas apresentadas de forma clara e envolvente para facilitar o aprendizado.`
  }

  return templates[estilo] || templates.misterio
}

function gerarCena(numero: number, tema: string, estilo: string, duracao: string, totalCenas: number) {
  const duracaoSegundos = duracao === 'curto' ? '15-20s' : duracao === 'medio' ? '30-60s' : '60-120s'

  const estrutura = {
    inicio: numero <= Math.ceil(totalCenas * 0.25),
    meio: numero > Math.ceil(totalCenas * 0.25) && numero < Math.ceil(totalCenas * 0.75),
    fim: numero >= Math.ceil(totalCenas * 0.75)
  }

  let descricao = ''
  let promptImagem = ''
  let promptAnimacao = ''
  let sfx: string[] = []
  let dialogos: string[] = []
  let trilha = ''

  if (estrutura.inicio) {
    descricao = `Estabelecimento da cena. Apresentação do ambiente e contexto relacionado a ${tema}. O mood é definido para capturar a atenção do espectador imediatamente.`
    promptImagem = `cinematic establishing shot of ${tema}, ${estilo} atmosphere, dramatic lighting, high quality, detailed environment, photorealistic, 8k resolution`
    promptAnimacao = `slow camera push in, subtle atmospheric movement, particles floating in air, cinematic reveal`
    sfx = ['ambiente', 'transição suave', 'atmosfera inicial']
    trilha = `${estilo === 'terror' ? 'Música tensa e misteriosa' : estilo === 'comedia' ? 'Música alegre e animada' : 'Música atmosférica e envolvente'} com build-up gradual`
  } else if (estrutura.meio) {
    descricao = `Desenvolvimento da narrativa sobre ${tema}. Elementos centrais da história são explorados com maior profundidade e tensão crescente.`
    promptImagem = `detailed scene showing ${tema}, ${estilo} mood, dynamic composition, rich colors, emotional lighting, cinematic framing, ultra detailed`
    promptAnimacao = `dynamic camera movement, ${estilo === 'acao' ? 'fast-paced action, intense motion blur' : 'smooth transitions, layered depth'}, professional video effects`
    sfx = ['movimento', 'ação', 'intensificação', 'impacto sonoro']
    dialogos = [`"${numero === 2 ? 'Algo não está certo aqui...' : numero === 3 ? 'Precisamos descobrir a verdade.' : 'Este é o momento decisivo.'}"${numero % 2 === 0 ? `\n"${estilo === 'terror' ? 'Você ouviu isso?' : 'Vamos em frente!'}"` : ''}`]
    trilha = 'Música principal intensifica, ritmo aumenta, elementos melódicos mais presentes'
  } else {
    descricao = `Clímax e resolução da história sobre ${tema}. A narrativa atinge seu ponto alto com revelações impactantes e conclusão satisfatória.`
    promptImagem = `epic finale scene for ${tema}, ${estilo} climax, dramatic contrast, powerful composition, cinematic masterpiece, award-winning photography, 8k`
    promptAnimacao = `dramatic camera reveal, ${estilo === 'terror' ? 'shocking twist visual' : 'emotional crescendo'}, slow motion elements, final impact shot`
    sfx = ['clímax sonoro', 'impacto final', 'resolução', 'fade out']
    dialogos = [`"${numero === totalCenas ? 'Finalmente entendemos tudo.' : 'Este é apenas o começo...'}"`]
    trilha = 'Música atinge o clímax, resolução harmônica, fade out emocional'
  }

  return {
    numero,
    descricao,
    duracao: duracaoSegundos,
    dialogos: dialogos.filter(d => d.trim().length > 0),
    promptImagem,
    promptAnimacao,
    sfx,
    trilhaSonora: trilha
  }
}
