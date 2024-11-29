import MusicPlayer from './components/MusicPlayer'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 p-4 md:p-8">
      <h1 className="text-3xl font-bold text-center mb-8">TokkisVerse MP</h1>
      <MusicPlayer />
    </main>
  )
}

