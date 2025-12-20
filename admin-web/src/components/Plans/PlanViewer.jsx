import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Plans.css';

const PlanViewer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [plan, setPlan] = useState(null);
    const [stands, setStands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStand, setSelectedStand] = useState(null);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            // Charger le plan
            const planRes = await api.get('/plans');
            const planData = planRes.data.data.find(p => p.id === id);
            setPlan(planData);

            // Charger les stands
            const standsRes = await api.get(`/plans/${id}/stands`);
            setStands(standsRes.data.data);

            setLoading(false);
        } catch (error) {
            console.error('Erreur chargement:', error);
            alert('Erreur lors du chargement des données');
            setLoading(false);
        }
    };

    const handleStandClick = (stand) => {
        setSelectedStand(stand);
    };

    if (loading) return <div className="loading">Chargement...</div>;

    if (!plan || !plan.imageUrl) {
        return (
            <div className="plan-viewer-container">
                <div className="page-header">
                    <h1>👁️ Visualisation du Plan</h1>
                    <button className="btn-secondary" onClick={() => navigate('/plans')}>
                        ← Retour
                    </button>
                </div>
                <div className="empty-state">
                    <p>⚠️ Aucune image de plan disponible</p>
                    <button className="btn-primary" onClick={() => navigate(`/plans/edit/${id}`)}>
                        Ajouter une image
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="plan-viewer-container">
            <div className="page-header">
                <h1>👁️ Plan {plan.year}</h1>
                <div>
                    <button className="btn-primary" onClick={() => navigate(`/plans/${id}/stands`)}>
                        📍 Gérer les stands
                    </button>
                    <button className="btn-secondary" onClick={() => navigate('/plans')}>
                        ← Retour
                    </button>
                </div>
            </div>

            <div className="plan-viewer-info">
                <p>📊 <strong>{stands.length}</strong> stands • <strong>{stands.filter(s => s.companyId).length}</strong> avec entreprise</p>
            </div>

            <div className="plan-viewer-wrapper">
                <div className="plan-image-container" style={{ position: 'relative', display: 'inline-block' }}>
                    <img
                        src={plan.imageUrl}
                        alt={`Plan ${plan.year}`}
                        style={{
                            maxWidth: '100%',
                            height: 'auto',
                            display: 'block',
                            border: '2px solid #ddd',
                            borderRadius: '8px'
                        }}
                    />

                    <svg
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            pointerEvents: 'none'
                        }}
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                    >
                        {stands.map((stand) => (
                            <g key={stand.id}>
                                {/* Rectangle simple transparent */}
                                <rect
                                    x={stand.xPercent}
                                    y={stand.yPercent}
                                    width={stand.wPercent}
                                    height={stand.hPercent}
                                    fill="rgba(255, 255, 255, 0.3)"
                                    stroke="#000"
                                    strokeWidth="0.2"
                                    style={{
                                        cursor: 'pointer',
                                        pointerEvents: 'all',
                                        transition: 'fill 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.fill = 'rgba(0, 123, 255, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.fill = 'rgba(255, 255, 255, 0.3)';
                                    }}
                                    onClick={() => handleStandClick(stand)}
                                />
                            </g>
                        ))}
                    </svg>
                </div>
            </div>

            {/* Modal simple au clic */}
            {selectedStand && (
                <div className="stand-info-modal" onClick={() => setSelectedStand(null)}>
                    <div className="stand-info-card" onClick={(e) => e.stopPropagation()}>
                        <h3>Stand {selectedStand.standNumber}</h3>
                        {selectedStand.company ? (
                            <div>
                                <p><strong>🏢 Entreprise :</strong> {selectedStand.company.name}</p>
                                {selectedStand.company.sector && (
                                    <p><strong>Secteur :</strong> {selectedStand.company.sector}</p>
                                )}
                            </div>
                        ) : (
                            <p style={{ color: '#999' }}>Aucune entreprise associée</p>
                        )}

                        <button className="btn-primary" onClick={() => setSelectedStand(null)}>
                            Fermer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlanViewer;
