import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { companyService } from '../../services/api'
import './Companies.css'

const CompanyForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: "",
    description: "",
    sector: "",
    websiteUrl: "",
    logoUrl: "",
    numEmployees: "",
  })

  const loadCompany = async () => {
    try {
      const res = await companyService.getCompany(id)
      setForm(res.company)
    } catch (err) {
      console.error(err)
      alert("Impossible de charger l'entreprise")
    }
  }

  useEffect(() => {
    if (id) loadCompany()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (id) await companyService.updateCompany(id, form)
      else await companyService.createCompany(form)

      navigate('/companies')
    } catch (err) {
      console.error(err)
      alert("Erreur lors de l'enregistrement")
    }
  }

  return (
    <div className="company-form-page">
      <h2>{id ? "Modifier une entreprise" : "Ajouter une entreprise"}</h2>

      <form className="company-form" onSubmit={handleSubmit}>
        
        <label>Nom *</label>
        <input
          type="text"
          value={form.name}
          required
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label>Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <label>Secteur</label>
        <input
          type="text"
          value={form.sector}
          onChange={(e) => setForm({ ...form, sector: e.target.value })}
        />

        <label>Site Web</label>
        <input
          type="text"
          value={form.websiteUrl}
          onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
        />

        <label>Logo (URL)</label>
        <input
          type="text"
          value={form.logoUrl}
          onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
        />

        <label>Nombre d'employés</label>
        <input
          type="number"
          value={form.numEmployees || ""}
          onChange={(e) =>
            setForm({ ...form, numEmployees: e.target.value })
          }
        />

        <button className="btn-primary">Enregistrer</button>
      </form>
    </div>
  )
}

export default CompanyForm
