import React, { useState, useEffect } from 'react'
import { userService } from '../../services/api'
import { FiX } from 'react-icons/fi'
import './UserForm.css'

const UserForm = ({ user, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    userType: 'autre',
    status: '',
    domain: '',
    track: '',
    role: 'user',
    isActive: true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isEdit = !!user

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        surname: user.surname || '',
        email: user.email || '',
        password: '',
        userType: user.userType || 'autre',
        status: user.status || '',
        domain: user.domain || '',
        track: user.track || '',
        role: user.role || 'user',
        isActive: user.isActive !== undefined ? user.isActive : true,
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const submitData = { ...formData }
      if (!submitData.password || submitData.password.trim() === '') {
        delete submitData.password
      }

      if (isEdit) {
        await userService.updateUser(user.id, submitData)
      } else {
        if (!submitData.password) {
          setError('Le mot de passe est requis pour un nouvel utilisateur')
          setLoading(false)
          return
        }
        await userService.createUser(submitData)
      }

      onSuccess()
    } catch (err) {
      setError(err.response?.data?.msg || 'Erreur lors de la sauvegarde')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEdit ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}</h3>
          <button className="modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="user-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label>Nom *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Prénom *</label>
              <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Mot de passe {!isEdit && '*'}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!isEdit}
              placeholder={isEdit ? "Laisser vide pour ne pas modifier" : ""}
              minLength={6}
            />
            {isEdit && (
              <small className="form-hint">Laisser vide pour ne pas modifier le mot de passe</small>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Type d'utilisateur *</label>
              <select name="userType" value={formData.userType} onChange={handleChange} required>
                <option value="etudiant">Étudiant</option>
                <option value="salarie">Salarié</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div className="form-group">
              <label>Rôle *</label>
              <select name="role" value={formData.role} onChange={handleChange} required>
                <option value="user">Utilisateur</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Statut</label>
            <input
              type="text"
              name="status"
              value={formData.status}
              onChange={handleChange}
              placeholder="Ex: Étudiant en Master"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Domaine</label>
              <input
                type="text"
                name="domain"
                value={formData.domain}
                onChange={handleChange}
                placeholder="Ex: Informatique"
              />
            </div>

            <div className="form-group">
              <label>Parcours</label>
              <input
                type="text"
                name="track"
                value={formData.track}
                onChange={handleChange}
                placeholder="Ex: Master 2"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              Compte actif
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Enregistrement...' : isEdit ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserForm

