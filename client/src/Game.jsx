import { useState, useRef, useEffect } from 'react'
import axios from 'axios'

const API = '';
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function Game() {
  const [gameId, setGameId] = useState(null)
  const [wordLength, setWordLength] = useState(5)
  const [uniqueOnly, setUniqueOnly] = useState(false)
  const [guess, setGuess] = useState('')
  const [guesses, setGuesses] = useState([])
  const [won, setWon] = useState(false)
  const [time, setTime] = useState(null)
  const [name, setName] = useState('')
  const [saved, setSaved] = useState(false)
  const [glitch, setGlitch] = useState(false)
  const [gridLetters, setGridLetters] = useState(() =>
    Array.from({ length: 28 }).map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
  )

  const guessEndRef = useRef(null)

  useEffect(() => {
    guessEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [guesses])

  useEffect(() => {
    function doGlitch() {
      setGlitch(true)
      setGridLetters(
        Array.from({ length: 28 }).map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
      )
      setTimeout(() => setGlitch(false), 200)
    }

    doGlitch()
    const interval = setInterval(doGlitch, 3000)
    return () => clearInterval(interval)
  }, [])

  function getCorrectSlots() {
    const slots = Array(wordLength).fill(null)
    guesses.forEach(g => {
      g.feedback.forEach((f, i) => {
        if (f.result === 'correct') slots[i] = f.letter.toUpperCase()
      })
    })
    return slots
  }

  function getLetterStatus() {
    const status = {}
    guesses.forEach(g => {
      g.feedback.forEach(f => {
        const l = f.letter.toUpperCase()
        if (f.result === 'correct') status[l] = 'correct'
        else if (f.result === 'misplaced' && status[l] !== 'correct') status[l] = 'misplaced'
        else if (!status[l]) status[l] = 'incorrect'
      })
    })
    return status
  }

  async function startGame() {
    const res = await axios.post(`${API}/api/game/start`, { wordLength, uniqueOnly })
    setGameId(res.data.gameId)
    setGuesses([])
    setWon(false)
    setTime(null)
    setSaved(false)
    setGuess('')
  }

  async function submitGuess() {
    const cleaned = guess.trim()
    if (!cleaned || cleaned.length !== wordLength) return
    const res = await axios.post(`${API}/api/game/guess`, { gameId, guess: cleaned })
    const { feedback, won, time } = res.data
    setGuesses(prev => [...prev, { word: cleaned, feedback }])
    setGuess('')
    if (won) { setWon(true); setTime(time) }
  }

  async function saveScore() {
    await axios.post(`${API}/api/highscore`, {
      name, time,
      guesses: guesses.map(g => g.word),
      wordLength, uniqueOnly
    })
    setSaved(true)
  }

  function getSymbol(result) {
    if (result === 'correct') return '[ ✓ ]'
    if (result === 'misplaced') return '[ ? ]'
    return '[ ✗ ]'
  }

  const letterStatus = getLetterStatus()
  const correctSlots = getCorrectSlots()

  if (!gameId) {
    return (
      <div className="console-body">
        <div className="letter-grid">
          {gridLetters.map((letter, i) => (
            <div
              key={i}
              className={`grid-cell ${glitch ? 'glitch-cell' : ''}`}
              style={{
                animationDelay: `${(i * 0.1) % 2}s`,
                color: ['#bf5fff', '#00fff7', '#ff6ec7', '#3a3a6a'][i % 4]
              }}
            >
              {letter}
            </div>
          ))}
        </div>

        <div className="boot-text">
          <p className="boot-line">&gt; SYSTEM READY</p>
          <p className="boot-line">&gt; WORD DATABASE LOADED — 370,106 WORDS</p>
          <p className="boot-line">&gt; CONFIGURE AND START_</p>
        </div>

        <div className="settings">
          <label>
            Word length
            <input
              type="number"
              value={wordLength}
              onChange={e => setWordLength(Number(e.target.value))}
              min={3} max={10}
            />
          </label>
          <label>
            Unique letters only
            <input
              type="checkbox"
              checked={uniqueOnly}
              onChange={e => setUniqueOnly(e.target.checked)}
            />
          </label>
        </div>

        <button className="start-btn" onClick={startGame}>
          &gt;&gt; INITIALIZE GAME_ &gt;&gt;
        </button>
      </div>
    )
  }

  return (
    <div className="game-layout">
      <div className="answer-slots">
        {correctSlots.map((letter, i) => (
          <div key={i} className={`answer-slot ${letter ? 'filled' : ''}`}>
            {letter || '_'}
          </div>
        ))}
      </div>

      <div className="legend">
        <span className="legend-item correct">[ ✓ ] correct place</span>
        <span className="legend-item misplaced">[ ? ] wrong place</span>
        <span className="legend-item incorrect">[ ✗ ] not in word</span>
      </div>

      <div className="tracker-bar">
        {ALPHABET.map(letter => (
          <div key={letter} className={`tracker-letter ${letterStatus[letter] || ''}`}>
            {letter}
          </div>
        ))}
      </div>

      <div className="game-screen">
        {guesses.map((g, i) => (
          <div key={i} className="guess-row">
            {g.feedback.map((f, j) => (
              <div key={j} className={`letter-box ${f.result}`}>
                {f.letter.toUpperCase()}
                <span className="symbol">{getSymbol(f.result)}</span>
              </div>
            ))}
          </div>
        ))}

        {!won && Array.from({ length: Math.max(0, 6 - guesses.length) }).map((_, i) => (
          <div key={`empty-${i}`} className="guess-row">
            {Array.from({ length: wordLength }).map((_, j) => (
              <div key={j} className="letter-box empty"></div>
            ))}
          </div>
        ))}

        {won && (
          <div className="win-screen">
            <p className="win-title">// WORD FOUND //</p>
            <p className="win-time">
              &gt; {guesses.length} attempts — {Math.round(time / 1000)}s elapsed
            </p>
            {!saved ? (
              <>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="ENTER NAME_"
                />
                <button onClick={saveScore}>&gt; SAVE SCORE_</button>
              </>
            ) : (
              <>
                <p className="win-time">// SCORE SAVED TO DATABASE //</p>
                <a href={`${API}/highscore`}>&gt; VIEW LEADERBOARD_</a>
                <br /><br />
                <button onClick={() => setGameId(null)}>&gt; PLAY AGAIN_</button>
              </>
            )}
          </div>
        )}

        <div ref={guessEndRef} />
      </div>

      {!won && (
        <div className="console-input-bar">
          <span className="prompt">&gt;</span>
          <input
            value={guess}
            onChange={e => setGuess(e.target.value.replace(/[^a-zA-Z]/g, ''))}
            onKeyDown={e => e.key === 'Enter' && submitGuess()}
            placeholder={`enter ${wordLength}-letter word...`}
            maxLength={wordLength}
            autoFocus
          />
          <button onClick={submitGuess}>GO_</button>
        </div>
      )}
    </div>
  )
}
