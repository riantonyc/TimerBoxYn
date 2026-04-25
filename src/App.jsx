import { useState } from 'react'
import Navbar from './components/Navbar'
import BoxingView from './components/BoxingView'
import HiitView from './components/HiitView'
import WorkoutLog from './components/WorkoutLog'
import './App.css'

export default function App() {
  const [activeTab, setActiveTab] = useState('boxing')

  return (
    <div className="app">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="app-main">
        <div className={`page page--${activeTab}`} key={activeTab}>
          {activeTab === 'boxing' && <BoxingView />}
          {activeTab === 'hiit' && <HiitView />}
          {activeTab === 'log' && <WorkoutLog />}
        </div>
      </main>
    </div>
  )
}