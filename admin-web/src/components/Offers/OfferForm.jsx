import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { companyService, offerService } from '../../services/api'
import './Offers.css'

const OfferForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [companies, setCompanies] = useState([])
  const [form, setForm] = useState({
    title: "",
    description: "",
    companyId: "",
    salary: "",
    sector: "", // ✅ Add sector field
  })

  // ✅ Define available sectors
  const availableSectors = [
    "Technologie",

    "Finance",

    "Banque",

    "Assurance",

    "Conseil",

    "Santé",

    "Éducation",

    "Commerce de détail",

    "Industrie manufacturière",

    "Immobilier",

    "Télécommunications",

    "Énergie",

    "Transports",

    "Autre"
  ]

  const loadCompanies = async () => {
    try {
      const res = await companyService.getCompanies()
      setCompanies(res.companies || res.data || [])
    } catch (err) {
      console.error('Error loading companies:', err)
      alert("Erreur lors du chargement des entreprises")
    }
  }

  const loadOffer = async () => {
    try {
      const res = await offerService.getOffer(id)
      const offer = res.offer || res.data
      
      setForm({
        title: offer.title || "",
        description: offer.description || "",
        companyId: offer.companyDetails?.id || offer.companyId || "",
        salary: offer.salary?.toString().replace(' MAD', '') || "",
        sector: offer.secteur || offer.companyDetails?.sector || "", // ✅ Load sector
      })
    } catch (err) {
      console.error('Error loading offer:', err)
      alert("Erreur lors du chargement de l'offre")
    }
  }

  useEffect(() => {
    loadCompanies()
    if (id) loadOffer()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const offerData = {
        title: form.title,
        description: form.description,
        companyId: form.companyId,
        salary: form.salary ? parseFloat(form.salary) : null,
      }

      if (id) {
        await offerService.updateOffer(id, offerData)
        alert("Offre modifiée avec succès")
      } else {
        await offerService.createOffer(offerData)
        alert("Offre créée avec succès")
      }

      // ✅ Update company sector if provided
      if (form.sector && form.companyId) {
        try {
          await companyService.updateCompany(form.companyId, { 
            sector: form.sector 
          })
        } catch (err) {
          console.warn('Could not update company sector:', err)
        }
      }

      navigate('/offers')
    } catch (err) {
      console.error('Error saving offer:', err)
      alert("Erreur lors de l'enregistrement")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="offer-form-page">
      <h2>{id ? "Modifier une offre" : "Créer une offre"}</h2>

      <form className="offer-form" onSubmit={handleSubmit}>

        <label>Titre *</label>
        <input
          type="text"
          value={form.title}
          required
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Ex: Développeur Full Stack"
        />

        <label>Description *</label>
        <textarea
          value={form.description}
          required
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Décrivez l'offre d'emploi..."
        />

        <label>Entreprise *</label>
        <select
          required
          value={form.companyId}
          onChange={(e) => setForm({ ...form, companyId: e.target.value })}
        >
          <option value="">Sélectionner une entreprise...</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} {c.sector ? `(${c.sector})` : ''}
            </option>
          ))}
        </select>

        {/* ✅ Add Sector Dropdown */}
        <label>Secteur</label>
        <select
          value={form.sector}
          onChange={(e) => setForm({ ...form, sector: e.target.value })}
        >
          <option value="">Sélectionner un secteur...</option>
          {availableSectors.map((sector) => (
            <option key={sector} value={sector}>
              {sector}
            </option>
          ))}
        </select>

        <label>Salaire (MAD)</label>
        <input
          type="number"
          value={form.salary || ""}
          onChange={(e) => setForm({ ...form, salary: e.target.value })}
          placeholder="Ex: 15000"
          min="0"
          step="100"
        />

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={() => navigate('/offers')}
            disabled={loading}
          >
            Annuler
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default OfferForm