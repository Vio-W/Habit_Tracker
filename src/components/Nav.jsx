import { useAuth } from '../context/AuthContext'
import AvatarUploader from './AvatarUploader'

export default function Nav() {
  const { user, signOut } = useAuth()

  return (
    <div className="nav-container">
      <header className="nav-header">
        <div className="user-info">
          <h1>My Habits</h1>
          {user?.email && <p className="user-email">{user.email}</p>}
        </div>
        <button className="btn-secondary" onClick={signOut}>
          Sign out
        </button>
      </header>

      {user?.id && <AvatarUploader userId={user.id} />}
    </div>
  )
}