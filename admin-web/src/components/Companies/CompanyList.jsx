import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { companyService } from '../../services/api'
import './Companies.css'

const CompanyList = () => {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const loadCompanies = async () => {
    try {
      setLoading(true)
      const res = await companyService.getCompanies()
      setCompanies(res.companies)
    } catch (err) {
      console.error(err)
      alert("Erreur lors du chargement des entreprises")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCompanies()
  }, [])

  if (loading) return <p>Chargement...</p>

  return (
    <div className="companies-page">
      <div className="companies-header">
        <h2>Entreprises</h2>
        <button className="btn-primary" onClick={() => navigate('/companies/new')}>
          + Ajouter
        </button>
      </div>

      <table className="companies-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Secteur</th>
            <th>Site Web</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {companies.map((company) => (
            <tr key={company.id}>
              <td>{company.name}</td>
              <td>{company.sector}</td>
              <td>{company.websiteUrl}</td>
              <td>
                <button
                  className="btn-small"
                  onClick={() => navigate(`/companies/edit/${company.id}`)}
                >
                  Modifier
                </button>

                <button
                  className="btn-small-danger"
                  onClick={async () => {
                    if (!window.confirm("Supprimer cette entreprise ?")) return
                    await companyService.deleteCompany(company.id)
                    loadCompanies()
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

export default CompanyList
