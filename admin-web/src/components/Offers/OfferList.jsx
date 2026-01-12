import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { offerService } from '../../services/api'
import './Offers.css'

const OfferList = () => {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const loadOffers = async () => {
    try {
      setLoading(true)
      const res = await offerService.getOffers()
      // ✅ Handle the new response structure
      setOffers(res.offers || res.data || [])
    } catch (err) {
      console.error('Error loading offers:', err)
      alert("Erreur lors du chargement des offres")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOffers()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette offre ?")) return
    
    try {
      await offerService.deleteOffer(id)
      alert("Offre supprimée avec succès")
      loadOffers() // Reload the list
    } catch (err) {
      console.error('Error deleting offer:', err)
      alert("Erreur lors de la suppression")
    }
  }

  if (loading) {
    return (
      <div className="offers-page">
        <p>Chargement des offres...</p>
      </div>
    )
  }

  return (
    <div className="offers-page">
      <div className="offers-header">
        <h2>Offres</h2>
        <button className="btn-primary" onClick={() => navigate('/offers/new')}>
          + Ajouter
        </button>
      </div>

      {offers.length === 0 ? (
        <p>Aucune offre disponible. Créez-en une !</p>
      ) : (
        <table className="offers-table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Entreprise</th>
              <th>Secteur</th>
              <th>Salaire</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {offers.map((o) => (
              <tr key={o.id}>
                <td>{o.title}</td>
                {/* ✅ Use the transformed data */}
                <td>{o.companyDetails?.name || o.companyId || '-'}</td>
                <td>{o.secteur || o.companyDetails?.sector || '-'}</td>
                <td>{o.salary || '-'}</td>
                <td>
                  <button
                    className="btn-small"
                    onClick={() => navigate(`/offers/edit/${o.id}`)}
                  >
                    Modifier
                  </button>

                  <button
                    className="btn-small-danger"
                    onClick={() => handleDelete(o.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default OfferList