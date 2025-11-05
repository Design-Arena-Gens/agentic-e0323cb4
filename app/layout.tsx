import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Assistente de Roteiros IA - YouTube',
  description: 'Gerador de roteiros, histórias, SFX, imagens e animações para vídeos do YouTube',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
