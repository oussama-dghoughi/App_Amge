import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FiUsers, FiBarChart2, FiLogOut } from 'react-icons/fi'
import './Sidebar.css'
import { FiBriefcase, FiFileText } from 'react-icons/fi'
const Sidebar = ({ activePage }) => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuItems = [
    { id: 'users', label: 'Utilisateurs', icon: FiUsers, path: '/users' },
    { id: 'stats', label: 'Statistiques', icon: FiBarChart2, path: '/stats' },
    { id: 'companies', label: 'Entreprises', icon: FiBriefcase, path: '/companies' },
    { id: 'offers', label: 'Offres', icon: FiFileText, path: '/offers' },
  ]

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>AMGE Admin</h2>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <Icon className="nav-icon" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-button" onClick={handleLogout}>
          <FiLogOut className="nav-icon" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar

