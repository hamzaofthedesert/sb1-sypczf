import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react'

interface Audio {
  id: number
  name: string
  path: string
}

const API_URL = import.meta.env.VITE_API_URL || '/api'

function App() {
  const [audioList, setAudioList] = useState<Audio[]>([])
  const [currentAudio, setCurrentAudio] = useState<Audio | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAudioList()
  }, [])

  const fetchAudioList = async () => {
    try {
      const response = await axios.get(`${API_URL}/get_audio_list.php`)
      setAudioList(response.data)
      setError(null)
    } catch (error) {
      console.error('Error fetching audio list:', error)
      setError('Failed to fetch audio list. Please try again later.')
    }
  }

  const playAudio = (audio: Audio) => {
    setCurrentAudio(audio)
    setIsPlaying(true)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const nextAudio = () => {
    if (currentAudio) {
      const currentIndex = audioList.findIndex(audio => audio.id === currentAudio.id)
      const nextIndex = (currentIndex + 1) % audioList.length
      setCurrentAudio(audioList[nextIndex])
    }
  }

  const previousAudio = () => {
    if (currentAudio) {
      const currentIndex = audioList.findIndex(audio => audio.id === currentAudio.id)
      const previousIndex = (currentIndex - 1 + audioList.length) % audioList.length
      setCurrentAudio(audioList[previousIndex])
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Audio Player</h1>
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Now Playing</h2>
          <p className="text-gray-600">{currentAudio ? currentAudio.name : 'No audio selected'}</p>
        </div>
        <div className="flex justify-center items-center space-x-4 mb-6">
          <button onClick={previousAudio} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
            <SkipBack size={24} />
          </button>
          <button onClick={togglePlayPause} className="p-4 rounded-full bg-blue-500 hover:bg-blue-600 text-white">
            {isPlaying ? <Pause size={32} /> : <Play size={32} />}
          </button>
          <button onClick={nextAudio} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
            <SkipForward size={24} />
          </button>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Audio List</h3>
          {audioList.length === 0 ? (
            <p className="text-gray-600">No audio files found.</p>
          ) : (
            <ul className="space-y-2">
              {audioList.map(audio => (
                <li
                  key={audio.id}
                  className="flex items-center justify-between p-2 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer"
                  onClick={() => playAudio(audio)}
                >
                  <span>{audio.name}</span>
                  <Volume2 size={18} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default App