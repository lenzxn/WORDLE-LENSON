import Game from './Game.jsx'

export default function App() {
  return (
    <div>
      <div className="header">
        <a href="/" className="title-link">
          <h1>Wordle</h1>
        </a>
        <p> retro word game v 1.0556 </p>
        <nav className="nav">
          <a href="/highscore">&gt; SEE HIGHSCORE</a>
          <span className="nav-divider">//</span>
          <a href="/about">&gt; ABOUT THIS GAME</a>
        </nav>
      </div>
      <div className="console">
        <div className="console-header">
          <span>game.exe</span>
          <div className="console-dots">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        <Game />
      </div>
    </div>
  )
}
