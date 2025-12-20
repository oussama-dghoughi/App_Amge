import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import CompanyList from './CompanyList'
import CompanyForm from './CompanyForm'

const Companies = () => {
  return (
    <Routes>
      <Route path="/" element={<CompanyList />} />
      <Route path="/new" element={<CompanyForm />} />
      <Route path="/edit/:id" element={<CompanyForm />} />
      <Route path="*" element={<Navigate to="/companies" replace />} />
    </Routes>
  )
}

export default Companies
