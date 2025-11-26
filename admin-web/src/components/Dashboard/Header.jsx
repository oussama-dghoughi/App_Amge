import React from 'react'
import './Header.css'

const Header = ({ user }) => {
  return (
    <header className="dashboard-header">
      <div className="header-content">
        <h1>Tableau de bord</h1>
        <div className="header-user">
          <span className="user-name">
            {user?.name} {user?.surname}
          </span>
          <span className="user-role">Administrateur</span>
        </div>
      </div>
    </header>
  )
}

export default Header

