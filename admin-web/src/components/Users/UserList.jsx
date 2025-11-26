import React from 'react'
import { FiEdit, FiTrash2, FiUserX, FiUserCheck, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import './UserList.css'

const UserList = ({
  users,
  loading,
  onEdit,
  onDelete,
  onToggleActive,
  pagination,
  onPageChange,
}) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des utilisateurs...</p>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="empty-state">
        <p>Aucun utilisateur trouvé</p>
      </div>
    )
  }

  const getBadgeClass = (userType) => {
    const classes = {
      etudiant: 'badge-etudiant',
      salarie: 'badge-salarie',
      autre: 'badge-autre',
    }
    return classes[userType] || 'badge-autre'
  }

  return (
    <div className="user-list-container">
      <div className="table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Type</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="user-name-cell">
                    <strong>{user.name} {user.surname}</strong>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge ${getBadgeClass(user.userType)}`}>
                    {user.userType}
                  </span>
                </td>
                <td>
                  <span className={`badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`status ${user.isActive ? 'active' : 'inactive'}`}>
                    {user.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td>
                  <div className="actions">
                    <button
                      className="btn-icon btn-edit"
                      onClick={() => onEdit(user)}
                      title="Modifier"
                    >
                      <FiEdit />
                    </button>
                    <button
                      className="btn-icon btn-toggle"
                      onClick={() => onToggleActive(user.id)}
                      title={user.isActive ? 'Désactiver' : 'Activer'}
                    >
                      {user.isActive ? <FiUserX /> : <FiUserCheck />}
                    </button>
                    <button
                      className="btn-icon btn-delete"
                      onClick={() => onDelete(user.id)}
                      title="Supprimer"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination.pages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            <FiChevronLeft /> Précédent
          </button>
          <span className="pagination-info">
            Page {pagination.page} sur {pagination.pages} ({pagination.total} utilisateurs)
          </span>
          <button
            className="pagination-btn"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
          >
            Suivant <FiChevronRight />
          </button>
        </div>
      )}
    </div>
  )
}

export default UserList

