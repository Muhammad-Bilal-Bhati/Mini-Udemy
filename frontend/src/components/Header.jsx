import { Link } from 'react-router-dom'

function Header({ user, onSignIn, onSignUp, onSignOut, onCreateCourse }) {
  return (
    <header className="topbar">
      <Link className="brand" to="/"><span className="brand-mark">M</span><span>Mentora</span></Link>
      <nav><Link to="/courses">Explore</Link><a href="/#how-it-works">How it works</a></nav>
      <div className="account-actions">
        {user ? <>{user.role === 'instructor' && <button className="dark-button compact" onClick={onCreateCourse}>Create course</button>}<span className="user-greeting">Hi, {user.name.split(' ')[0]}</span><button className="text-button" onClick={onSignOut}>Sign out</button></> : <><button className="text-button" onClick={onSignIn}>Log in</button><button className="dark-button compact" onClick={onSignUp}>Join free</button></>}
      </div>
    </header>
  )
}

export default Header
