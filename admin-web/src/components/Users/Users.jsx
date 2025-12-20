import React, { useState, useEffect } from 'react'
import { userService } from '../../services/api'
import UserList from './UserList'
import UserForm from './UserForm'
import { FiPlus, FiSearch, FiFilter } from 'react-icons/fi'
import './Users.css'

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    userType: '',
    role: '',
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(search && { search }),
        ...(filters.userType && { userType: filters.userType }),
        ...(filters.role && { role: filters.role }),
      }

      const response = await userService.getUsers(params)
      setUsers(response.users || [])
      setPagination({
        ...pagination,
        total: response.total || 0,
        pages: response.pages || 0,
      })
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error)
      alert('Erreur lors du chargement des utilisateurs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [pagination.page, search, filters])

  const handleCreate = () => {
    setEditingUser(null)
    setShowForm(true)
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingUser(null)
  }

  const handleFormSuccess = () => {
    handleFormClose()
    fetchUsers()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return
    }

    try {
      await userService.deleteUser(id)
      fetchUsers()
      alert('Utilisateur supprimé avec succès')
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      alert(error.response?.data?.msg || 'Erreur lors de la suppression')
    }
  }

  const handleToggleActive = async (id) => {
    try {
      await userService.toggleUserActive(id)
      fetchUsers()
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error)
      alert(error.response?.data?.msg || 'Erreur lors du changement de statut')
    }
  }

  return (
    <div className="users-page">
      <div className="users-header">
        <h2>Gestion des utilisateurs</h2>
        <button className="btn-primary" onClick={handleCreate}>
          <FiPlus /> Nouvel utilisateur
        </button>
      </div>

      <div className="users-filters">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher par nom, prénom ou email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPagination({ ...pagination, page: 1 })
            }}
          />
        </div>

        <div className="filter-box">
          <FiFilter className="filter-icon" />
          <select
            value={filters.userType}
            onChange={(e) => {
              setFilters({ ...filters, userType: e.target.value })
              setPagination({ ...pagination, page: 1 })
            }}
          >
            <option value="">Tous les types</option>
            <option value="etudiant">Étudiant</option>
            <option value="salarie">Salarié</option>
            <option value="autre">Autre</option>
          </select>

          <select
            value={filters.role}
            onChange={(e) => {
              setFilters({ ...filters, role: e.target.value })
              setPagination({ ...pagination, page: 1 })
            }}
          >
            <option value="">Tous les rôles</option>
            <option value="user">Utilisateur</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {showForm && (
        <UserForm
          user={editingUser}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      <UserList
        users={users}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
        pagination={pagination}
        onPageChange={(page) => setPagination({ ...pagination, page })}
      />
    </div>
  )
}

export default Users

