import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { companyService, offerService } from '../../services/api'
import './Offers.css'

const OfferForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [companies, setCompanies] = useState([])
  const [form, setForm] = useState({
    title: "",
    description: "",
    companyId: "",
    salary: "",
  })

  const loadCompanies = async () => {
    const res = await companyService.getCompanies()
    setCompanies(res.companies)
  }

  const loadOffer = async () => {
    const res = await offerService.getOffer(id)
    setForm(res.offer)
  }

  useEffect(() => {
    loadCompanies()
    if (id) loadOffer()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (id) await offerService.updateOffer(id, form)
    else await offerService.createOffer(form)

    navigate('/offers')
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
        />

        <label>Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <label>Entreprise *</label>
        <select
          required
          value={form.companyId}
          onChange={(e) => setForm({ ...form, companyId: e.target.value })}
        >
          <option value="">Sélectionner...</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <label>Salaire</label>
        <input
          type="number"
          value={form.salary || ""}
          onChange={(e) => setForm({ ...form, salary: e.target.value })}
        />

        <button className="btn-primary">Enregistrer</button>
      </form>
    </div>
  )
}

export default OfferForm
