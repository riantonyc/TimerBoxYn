export default function Navbar({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'boxing', label: 'Boxing Timer' },
    { id: 'hiit', label: 'HIIT Workout' },
    { id: 'log', label: 'Workout Log' },
  ]

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/img/title_logoWeb.png" alt="Training" className="navbar-logo-img" />
      </div>
      <div className="navbar-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'nav-tab--active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
            {activeTab === tab.id && <span className="nav-tab-indicator" />}
          </button>
        ))}
      </div>
    </nav>
  )
}