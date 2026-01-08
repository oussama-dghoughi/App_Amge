import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import OfferList from './OfferList'
import OfferForm from './OfferForm'

const Offers = () => {
  return (
    <Routes>
      <Route path="/" element={<OfferList />} />
      <Route path="/new" element={<OfferForm />} />
      <Route path="/edit/:id" element={<OfferForm />} />
      <Route path="*" element={<Navigate to="/offers" replace />} />
    </Routes>
  )
}

export default Offers
