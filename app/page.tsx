'use client'

import { useState } from 'react'
import { Film, Wand2, Music, Image, Video, Download, Sparkles } from 'lucide-react'

interface Story {
  titulo: string
  roteiro: string
  cenas: Array<{
    numero: number
    descricao: string
    duracao: string
    dialogos: string[]
    promptImagem: string
    promptAnimacao: string
    sfx: string[]
    trilhaSonora: string
  }>
}

export default function Home() {
  const [tema, setTema] = useState('')
  const [estilo, setEstilo] = useState('terror')
  const [duracao, setDuracao] = useState('curto')
  const [loading, setLoading] = useState(false)
  const [story, setStory] = useState<Story | null>(null)

  const estilos = [
    { value: 'terror', label: 'Terror/Horror', icon: '👻' },
    { value: 'misterio', label: 'Mistério', icon: '🔍' },
    { value: 'ficcao', label: 'Ficção Científica', icon: '🚀' },
    { value: 'drama', label: 'Drama', icon: '🎭' },
    { value: 'comedia', label: 'Comédia', icon: '😂' },
    { value: 'acao', label: 'Ação/Aventura', icon: '⚔️' },
    { value: 'motivacional', label: 'Motivacional', icon: '💪' },
    { value: 'educativo', label: 'Educativo', icon: '📚' },
  ]

  const duracoes = [
    { value: 'curto', label: 'Curto (30-60s)', desc: 'YouTube Shorts' },
    { value: 'medio', label: 'Médio (3-5min)', desc: 'Conteúdo rápido' },
    { value: 'longo', label: 'Longo (8-15min)', desc: 'Vídeo completo' },
  ]

  const generateStory = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tema, estilo, duracao }),
      })
      const data = await response.json()
      setStory(data)
    } catch (error) {
      console.error('Erro ao gerar roteiro:', error)
      alert('Erro ao gerar roteiro. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const exportarJSON = () => {
    if (!story) return
    const blob = new Blob([JSON.stringify(story, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `roteiro-${story.titulo.toLowerCase().replace(/\s+/g, '-')}.json`
    a.click()
  }

  const exportarTXT = () => {
    if (!story) return
    let texto = `${story.titulo}\n${'='.repeat(story.titulo.length)}\n\n${story.roteiro}\n\n`
    story.cenas.forEach(cena => {
      texto += `\nCENA ${cena.numero} - ${cena.duracao}\n${'-'.repeat(50)}\n`
      texto += `${cena.descricao}\n\n`
      if (cena.dialogos.length > 0) {
        texto += `Diálogos:\n${cena.dialogos.join('\n')}\n\n`
      }
      texto += `🎨 Prompt Imagem: ${cena.promptImagem}\n\n`
      texto += `🎬 Prompt Animação: ${cena.promptAnimacao}\n\n`
      texto += `🔊 SFX: ${cena.sfx.join(', ')}\n\n`
      texto += `🎵 Trilha: ${cena.trilhaSonora}\n\n`
    })
    const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `roteiro-${story.titulo.toLowerCase().replace(/\s+/g, '-')}.txt`
    a.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Film className="w-12 h-12 text-purple-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Assistente de Roteiros IA
            </h1>
          </div>
          <p className="text-gray-300 text-lg">
            Crie roteiros profissionais para YouTube com prompts de IA para imagens, animações, SFX e trilhas
          </p>
        </header>

        {/* Form */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mb-8 border border-purple-500/20">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tema ou Ideia do Vídeo
              </label>
              <input
                type="text"
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                placeholder="Ex: Uma casa assombrada com segredos do passado..."
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-white placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Estilo do Conteúdo
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {estilos.map((e) => (
                  <button
                    key={e.value}
                    onClick={() => setEstilo(e.value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      estilo === e.value
                        ? 'border-purple-500 bg-purple-500/20 text-white'
                        : 'border-gray-600 bg-gray-700/30 text-gray-300 hover:border-purple-400'
                    }`}
                  >
                    <div className="text-2xl mb-1">{e.icon}</div>
                    <div className="text-sm font-medium">{e.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Duração do Vídeo
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {duracoes.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDuracao(d.value)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      duracao === d.value
                        ? 'border-purple-500 bg-purple-500/20 text-white'
                        : 'border-gray-600 bg-gray-700/30 text-gray-300 hover:border-purple-400'
                    }`}
                  >
                    <div className="font-medium">{d.label}</div>
                    <div className="text-sm text-gray-400">{d.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generateStory}
              disabled={!tema || loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Gerando Roteiro...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Gerar Roteiro Completo
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {story && (
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-purple-500/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-purple-400">{story.titulo}</h2>
              <div className="flex gap-2">
                <button
                  onClick={exportarJSON}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4" />
                  JSON
                </button>
                <button
                  onClick={exportarTXT}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4" />
                  TXT
                </button>
              </div>
            </div>

            <div className="mb-8 p-4 bg-gray-700/30 rounded-lg border border-gray-600">
              <h3 className="text-lg font-semibold text-purple-300 mb-2">Sinopse</h3>
              <p className="text-gray-300 leading-relaxed">{story.roteiro}</p>
            </div>

            <div className="space-y-6">
              {story.cenas.map((cena) => (
                <div key={cena.numero} className="bg-gray-700/30 rounded-xl p-6 border border-gray-600 hover:border-purple-500/50 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-xl font-bold">
                      {cena.numero}
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Video className="w-5 h-5 text-purple-400" />
                          <span className="font-semibold text-purple-300">Cena {cena.numero}</span>
                          <span className="text-sm text-gray-400">• {cena.duracao}</span>
                        </div>
                        <p className="text-gray-300">{cena.descricao}</p>
                      </div>

                      {cena.dialogos.length > 0 && (
                        <div className="bg-gray-800/50 p-3 rounded-lg">
                          <div className="text-sm font-semibold text-gray-400 mb-2">💬 Diálogos</div>
                          {cena.dialogos.map((dialogo, idx) => (
                            <p key={idx} className="text-gray-300 text-sm italic">{dialogo}</p>
                          ))}
                        </div>
                      )}

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 p-4 rounded-lg border border-pink-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <Image className="w-4 h-4 text-pink-400" />
                            <span className="text-sm font-semibold text-pink-300">Prompt de Imagem</span>
                          </div>
                          <p className="text-sm text-gray-300">{cena.promptImagem}</p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-4 rounded-lg border border-blue-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-blue-400" />
                            <span className="text-sm font-semibold text-blue-300">Prompt de Animação</span>
                          </div>
                          <p className="text-sm text-gray-300">{cena.promptAnimacao}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[200px]">
                          <div className="flex items-center gap-2 mb-2">
                            <Music className="w-4 h-4 text-green-400" />
                            <span className="text-sm font-semibold text-green-300">Efeitos Sonoros</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {cena.sfx.map((sfx, idx) => (
                              <span key={idx} className="px-3 py-1 bg-green-900/30 text-green-300 text-xs rounded-full border border-green-500/30">
                                {sfx}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex-1 min-w-[200px]">
                          <div className="flex items-center gap-2 mb-2">
                            <Music className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-semibold text-yellow-300">Trilha Sonora</span>
                          </div>
                          <p className="text-sm text-gray-300">{cena.trilhaSonora}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-purple-900/20 rounded-lg border border-purple-500/30">
              <h3 className="text-lg font-semibold text-purple-300 mb-2">📝 Próximos Passos</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Use os prompts de imagem em ferramentas como Midjourney, DALL-E ou Stable Diffusion</li>
                <li>• Use os prompts de animação em ferramentas como Runway, Pika Labs ou Stable Video</li>
                <li>• Busque os SFX em bibliotecas como Epidemic Sound, Artlist ou Freesound</li>
                <li>• Encontre trilhas sonoras em YouTube Audio Library, Epidemic Sound ou Artlist</li>
                <li>• Monte o vídeo final em editores como DaVinci Resolve, Premiere Pro ou CapCut</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
