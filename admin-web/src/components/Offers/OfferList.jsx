import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { offerService } from '../../services/api'
import './Offers.css'

const OfferList = () => {
  const [offers, setOffers] = useState([])
  const navigate = useNavigate()

  const loadOffers = async () => {
    try {
      const res = await offerService.getOffers()
      setOffers(res.offers)
    } catch (err) {
      console.error(err)
      alert("Erreur lors du chargement des offres")
    }
  }

  useEffect(() => {
    loadOffers()
  }, [])

  return (
    <div className="offers-page">
      <div className="offers-header">
        <h2>Offres</h2>
        <button className="btn-primary" onClick={() => navigate('/offers/new')}>
          + Ajouter
        </button>
      </div>

      <table className="offers-table">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Entreprise</th>
            <th>Salaire</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {offers.map((o) => (
            <tr key={o.id}>
              <td>{o.title}</td>
              <td>{o.Company?.name}</td>
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
                  onClick={async () => {
                    if (!window.confirm("Supprimer cette offre ?")) return
                    await offerService.deleteOffer(o.id)
                    loadOffers()
                  }}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  )
}

export default OfferList
