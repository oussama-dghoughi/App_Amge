import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Login.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      console.log('Tentative de connexion avec:', { email })
      
      const result = await login(email, password)
      console.log('Résultat de connexion:', result)

      if (result.success) {
        console.log('Connexion réussie, redirection...')
        // Ajouter un petit délai pour voir le succès
        setTimeout(() => {
          navigate('/')
        }, 500)
        return // Ne pas exécuter le setLoading(false) ci-dessous
      } else {
        console.error('Erreur de connexion:', result.error)
        setError(result.error || 'Erreur de connexion')
      }
    } catch (err) {
      console.error('Erreur lors de la connexion:', err)
      setError('Erreur de connexion. Vérifiez que le serveur est démarré.')
    }
    
    // Arrêter le loading seulement en cas d'erreur
    setLoading(false)
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>AMGE Admin</h1>
          <p>Interface d'administration</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message" role="alert">
              <span style={{ fontSize: '20px' }}>⚠️</span>
              <div style={{ flex: 1 }}>
                <strong>Erreur :</strong>
                <div style={{ marginTop: '5px' }}>{error}</div>
              </div>
              <button
                type="button"
                onClick={() => setError('')}
                className="error-close-btn"
                aria-label="Fermer"
              >
                ×
              </button>
            </div>
          )}
          
          {loading && !error && (
            <div className="loading-message">
              <div className="spinner"></div>
              <span>Connexion en cours...</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@amge.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="login-button" 
            disabled={loading}
            onClick={() => console.log('Bouton cliqué, email:', email)}
          >
            {loading ? (
              <>
                <div className="button-spinner"></div>
                Connexion...
              </>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login

