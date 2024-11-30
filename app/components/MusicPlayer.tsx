'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Play, Pause, SkipBack, SkipForward, Share2, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'

interface Song {
  id: number
  cat: string
  title: string
  song_name: string
  path: string
  song_img_path: string
  date: string
}

export default function MusicPlayer() {
  const [songs, setSongs] = useState<Song[]>([])
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isVolumeHovered, setIsVolumeHovered] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const volumeSliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/songs')
      .then(response => response.json())
      .then(data => {
        setSongs(data)
        if (data.length > 0) {
          setCurrentSong(data[0])
        }
      })
      .catch(error => console.error('Error fetching songs:', error))
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, currentSong])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (volumeSliderRef.current && !volumeSliderRef.current.contains(event.target as Node)) {
        setIsVolumeHovered(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handlePrevious = () => {
    const currentIndex = songs.findIndex(song => song.id === currentSong?.id)
    const previousIndex = (currentIndex - 1 + songs.length) % songs.length
    setCurrentSong(songs[previousIndex])
  }

  const handleNext = () => {
    const currentIndex = songs.findIndex(song => song.id === currentSong?.id)
    const nextIndex = (currentIndex + 1) % songs.length
    setCurrentSong(songs[nextIndex])
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
      setDuration(audioRef.current.duration)
    }
  }

  const handleSliderChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const handleShare = async () => {
    if (navigator.share && currentSong) {
      try {
        await navigator.share({
          title: currentSong.song_name,
          text: `Check out this song: ${currentSong.song_name}`,
          url: `https://www.tokkisverse.com${currentSong.path}`,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      alert('Web Share API is not supported in your browser')
    }
  }

  if (!currentSong) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <audio
        ref={audioRef}
        src={currentSong.path}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
        preload="none"
      />
      <div className="flex items-center mb-4">
        <div className="w-16 h-16 mr-4 rounded-full overflow-hidden">
          <Image
            src={currentSong.song_img_path}
            alt={`${currentSong.song_name} cover`}
            width={64}
            height={64}
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">{currentSong.song_name}</h2>
          <p className="text-gray-600">{new Date(currentSong.date).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" size="icon" onClick={handlePrevious}>
          <SkipBack className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handlePlayPause}>
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button variant="outline" size="icon" onClick={handleNext}>
          <SkipForward className="h-4 w-4" />
        </Button>
        <div className="relative" ref={volumeSliderRef}>
          <Button
            variant="outline"
            size="icon"
            onMouseEnter={() => setIsVolumeHovered(true)}
          >
            <Volume2 className="h-4 w-4" />
          </Button>
          {isVolumeHovered && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
              <Slider
                orientation="vertical"
                value={[volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="h-20"
              />
            </div>
          )}
        </div>
        <Button variant="outline" size="icon" onClick={handleShare}>
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
      <Slider
        value={[currentTime]}
        max={duration}
        step={0.1}
        onValueChange={handleSliderChange}
        className="w-full"
      />
      <div className="flex justify-between text-sm text-gray-500 mt-1">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Playlist</h3>
        <ul className="space-y-2">
          {songs.map((song) => (
            <li
              key={song.id}
              className={`flex items-center cursor-pointer p-2 rounded ${
                song.id === currentSong.id ? 'bg-blue-100' : 'hover:bg-gray-100'
              }`}
              onClick={() => setCurrentSong(song)}
            >
              <div className="w-10 h-10 mr-3 rounded-full overflow-hidden">
                <Image
                  src={song.song_img_path}
                  alt={`${song.song_name} cover`}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <p className="font-medium">{song.song_name}</p>
                {/* <p className="text-sm text-gray-600">{new Date(song.date).toLocaleDateString()}</p> */}
                <p className="text-sm text-gray-600">{song.title}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function formatTime(time: number): string {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

