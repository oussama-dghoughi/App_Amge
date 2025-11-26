import React, { useState, useEffect } from 'react'
import { statsService } from '../../services/api'
import { FiUsers, FiUserCheck, FiUserX, FiShield } from 'react-icons/fi'
import './Stats.css'

const Stats = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const response = await statsService.getStats()
      setStats(response.stats)
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error)
      alert('Erreur lors du chargement des statistiques')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des statistiques...</p>
      </div>
    )
  }

  if (!stats) {
    return <div className="empty-state">Aucune statistique disponible</div>
  }

  const statCards = [
    {
      title: 'Total utilisateurs',
      value: stats.totalUsers || 0,
      icon: FiUsers,
      color: '#667eea',
    },
    {
      title: 'Utilisateurs actifs',
      value: stats.activeUsers || 0,
      icon: FiUserCheck,
      color: '#48bb78',
    },
    {
      title: 'Utilisateurs inactifs',
      value: stats.inactiveUsers || 0,
      icon: FiUserX,
      color: '#f56565',
    },
    {
      title: 'Administrateurs',
      value: stats.adminUsers || 0,
      icon: FiShield,
      color: '#ed8936',
    },
  ]

  return (
    <div className="stats-page">
      <h2>Statistiques</h2>

      <div className="stats-grid">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <div key={index} className="stat-card">
              <div className="stat-card-icon" style={{ backgroundColor: `${card.color}20`, color: card.color }}>
                <Icon />
              </div>
              <div className="stat-card-content">
                <h3>{card.value}</h3>
                <p>{card.title}</p>
              </div>
            </div>
          )
        })}
      </div>

      {stats.usersByType && stats.usersByType.length > 0 && (
        <div className="stats-section">
          <h3>Répartition par type</h3>
          <div className="users-by-type">
            {stats.usersByType.map((item, index) => (
              <div key={index} className="type-item">
                <span className="type-label">{item._id || 'Non spécifié'}</span>
                <div className="type-bar">
                  <div
                    className="type-bar-fill"
                    style={{
                      width: `${(item.count / stats.totalUsers) * 100}%`,
                    }}
                  />
                </div>
                <span className="type-count">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.recentUsers && stats.recentUsers.length > 0 && (
        <div className="stats-section">
          <h3>Derniers utilisateurs inscrits</h3>
          <div className="recent-users">
            <table className="recent-users-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Type</th>
                  <th>Date d'inscription</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      {user.name} {user.surname}
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className="badge badge-type">{user.userType}</span>
                    </td>
                    <td>
                      {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Stats

