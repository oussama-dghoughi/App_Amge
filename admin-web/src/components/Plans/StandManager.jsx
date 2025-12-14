import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import CsvImporter from './CsvImporter';
import './Plans.css';

const StandManager = () => {
    const { id: planId } = useParams();
    const navigate = useNavigate();
    const [stands, setStands] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [showCsvImporter, setShowCsvImporter] = useState(false);
    const [formData, setFormData] = useState({
        standNumber: '',
        xPercent: 0,
        yPercent: 0,
        wPercent: 5,
        hPercent: 4,
        companyId: '',
    });

    useEffect(() => {
        fetchData();
    }, [planId]);

    const fetchData = async () => {
        try {
            const standsRes = await api.get(`/plans/${planId}/stands`);
            setStands(standsRes.data.data);

            try {
                const companiesRes = await api.get('/admin/companies');
                setCompanies(companiesRes.data.companies || []);
            } catch (compError) {
                console.warn('⚠️ Impossible de charger les entreprises:', compError);
                setCompanies([]);
            }

            setLoading(false);
        } catch (error) {
            console.error('❌ Erreur chargement stands:', error);
            alert('Erreur: ' + (error.response?.data?.msg || error.message));
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/plans/${planId}/stands`, formData);
            alert('✅ Stand ajouté !');
            setFormData({
                standNumber: '',
                xPercent: 0,
                yPercent: 0,
                wPercent: 5,
                hPercent: 4,
                companyId: '',
            });
            setShowForm(false);
            fetchData();
        } catch (error) {
            alert('❌ Erreur lors de l\'ajout du stand');
        }
    };

    const handleDelete = async (standId) => {
        if (!window.confirm('Supprimer ce stand ?')) return;
        try {
            await api.delete(`/stands/${standId}`);
            alert('✅ Stand supprimé !');
            fetchData();
        } catch (error) {
            alert('❌ Erreur lors de la suppression');
        }
    };

    const handleUpdateCompany = async (standId, companyId) => {
        try {
            await api.patch(`/stands/${standId}`, { companyId: companyId || null });
            alert('✅ Entreprise associée !');
            fetchData();
        } catch (error) {
            const errorMsg = error.response?.data?.msg || error.message || 'Erreur inconnue';
            alert('❌ Erreur: ' + errorMsg);
        }
    };

    const handleDeleteAll = async () => {
        const confirmMsg = `⚠️ ATTENTION ⚠️\n\nVoulez-vous vraiment supprimer TOUS les stands de ce plan ?\n\nCette action est IRRÉVERSIBLE !\n\n${stands.length} stand(s) seront supprimé(s).`;

        if (!window.confirm(confirmMsg)) return;
        if (!window.confirm('Dernière confirmation : Supprimer tous les stands ?')) return;

        try {
            const response = await api.delete(`/plans/${planId}/stands`);
            alert(`✅ ${response.data.msg}`);
            fetchData();
        } catch (error) {
            console.error('Erreur complète:', error);
            console.error('Response:', error.response);
            alert(`❌ Erreur lors de la suppression: ${error.response?.data?.msg || error.message}`);
        }
    };

    if (loading) return <div className="loading">Chargement...</div>;

    return (
        <div className="stand-manager-container">
            <div className="page-header">
                <h1>📍 Gestion des Stands</h1>
                <div>
                    <button className="btn-primary" onClick={() => {
                        setShowForm(!showForm);
                        setShowCsvImporter(false);
                    }}>
                        {showForm ? '❌ Annuler' : '➕ Ajouter un stand'}
                    </button>
                    <button className="btn-success" onClick={() => {
                        setShowCsvImporter(!showCsvImporter);
                        setShowForm(false);
                    }}>
                        {showCsvImporter ? '❌ Annuler' : '📥 ImportCSV'}
                    </button>
                    <button className="btn-secondary" onClick={() => navigate('/plans')}>
                        ← Retour
                    </button>
                </div>
            </div>

            {showCsvImporter && (
                <CsvImporter
                    planId={planId}
                    onImportSuccess={() => {
                        setShowCsvImporter(false);
                        fetchData();
                    }}
                    onCancel={() => setShowCsvImporter(false)}
                />
            )}

            {showForm && (
                <form onSubmit={handleSubmit} className="form-card stand-form">
                    <h3>Nouveau Stand</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Numéro du stand *</label>
                            <input
                                type="text"
                                value={formData.standNumber}
                                onChange={(e) => setFormData({ ...formData, standNumber: e.target.value })}
                                placeholder="A12"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Entreprise ({companies.length} disponibles)</label>
                            <select
                                value={formData.companyId}
                                onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                            >
                                <option value="">Aucune</option>
                                {companies.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>X (%)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.xPercent}
                                onChange={(e) => setFormData({ ...formData, xPercent: parseFloat(e.target.value) })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Y (%)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.yPercent}
                                onChange={(e) => setFormData({ ...formData, yPercent: parseFloat(e.target.value) })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Largeur (%)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.wPercent}
                                onChange={(e) => setFormData({ ...formData, wPercent: parseFloat(e.target.value) })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Hauteur (%)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.hPercent}
                                onChange={(e) => setFormData({ ...formData, hPercent: parseFloat(e.target.value) })}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary">
                        ✅ Ajouter
                    </button>
                </form>
            )}

            <div className="stands-table">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3>{stands.length} stands</h3>
                    {stands.length > 0 && (
                        <button
                            className="btn-icon btn-danger"
                            onClick={handleDeleteAll}
                            title="Supprimer tous les stands"
                            style={{ fontSize: '14px', padding: '8px 16px' }}
                        >
                            🗑️ Supprimer tous
                        </button>
                    )}
                </div>
                {stands.length === 0 ? (
                    <p className="empty-state">Aucun stand pour ce plan. Ajoutez-en un ou importez un CSV !</p>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Numéro</th>
                                <th>Entreprise</th>
                                <th>Position (X, Y)</th>
                                <th>Dimensions (L x H)</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stands.map((stand) => (
                                <tr key={stand.id}>
                                    <td><strong>{stand.standNumber}</strong></td>
                                    <td>
                                        <select
                                            value={stand.companyId || ''}
                                            onChange={(e) => handleUpdateCompany(stand.id, e.target.value)}
                                            className="company-select"
                                        >
                                            <option value="">Aucune</option>
                                            {companies.map((c) => (
                                                <option key={c.id} value={c.id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        {parseFloat(stand.xPercent).toFixed(2)}%, {parseFloat(stand.yPercent).toFixed(2)}%
                                    </td>
                                    <td>
                                        {parseFloat(stand.wPercent).toFixed(2)}% x {parseFloat(stand.hPercent).toFixed(2)}%
                                    </td>
                                    <td>
                                        <button
                                            className="btn-icon btn-danger"
                                            onClick={() => handleDelete(stand.id)}
                                            title="Supprimer"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default StandManager;
