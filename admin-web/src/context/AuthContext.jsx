import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    const savedUser = localStorage.getItem('admin_user')

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error)
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      console.log('AuthContext: Tentative de connexion avec:', { email })
      const response = await authService.login(email, password)
      console.log('AuthContext: Réponse complète reçue:', JSON.stringify(response, null, 2))
      
      // La réponse d'axios est dans response.data
      const data = response.data || response
      console.log('AuthContext: Données extraites:', data)
      
      if (!data.success) {
        console.log('AuthContext: Échec - success est false')
        return {
          success: false,
          error: data.msg || 'Erreur de connexion',
        }
      }

      console.log('AuthContext: Vérification du rôle admin...', data.user?.role)

      // Vérifier que l'utilisateur est admin
      if (data.user && data.user.role !== 'admin') {
        console.log('AuthContext: Échec - utilisateur n\'est pas admin')
        return {
          success: false,
          error: 'Accès refusé. Vous devez être administrateur.',
        }
      }

      if (!data.token || !data.user) {
        console.log('AuthContext: Échec - token ou user manquant')
        return {
          success: false,
          error: 'Réponse invalide du serveur',
        }
      }
      
      console.log('AuthContext: Succès - sauvegarde du token et user')

      localStorage.setItem('admin_token', data.token)
      localStorage.setItem('admin_user', JSON.stringify(data.user))
      setUser(data.user)
      console.log('AuthContext: Token et user sauvegardés avec succès')
      
      return { success: true }
    } catch (error) {
      console.error('AuthContext: Erreur de connexion:', error)
      console.error('Détails:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        code: error.code,
      })
      
      let errorMessage = 'Erreur de connexion'
      
      if (error.response) {
        // Le serveur a répondu avec un code d'erreur
        errorMessage = error.response.data?.msg || `Erreur ${error.response.status}: ${error.response.statusText}`
      } else if (error.request) {
        // La requête a été faite mais aucune réponse n'a été reçue
        errorMessage = 'Impossible de contacter le serveur. Vérifiez que le backend est démarré sur http://localhost:5000'
      } else {
        // Une erreur s'est produite lors de la configuration de la requête
        errorMessage = error.message || 'Erreur de connexion'
      }
      
      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    setUser(null)
  }

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

