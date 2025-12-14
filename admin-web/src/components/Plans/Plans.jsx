import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PlanList from './PlanList';
import PlanForm from './PlanForm';
import StandManager from './StandManager';
import PlanViewer from './PlanViewer';

const Plans = () => {
    return (
        <Routes>
            <Route path="/" element={<PlanList />} />
            <Route path="/new" element={<PlanForm />} />
            <Route path="/edit/:id" element={<PlanForm />} />
            <Route path="/:id/view" element={<PlanViewer />} />
            <Route path="/:id/stands" element={<StandManager />} />
            <Route path="*" element={<Navigate to="/plans" replace />} />
        </Routes>
    );
};

export default Plans;
