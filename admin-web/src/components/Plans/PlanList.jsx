import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Plans.css';
import './WorkflowHelp.css';

const PlanList = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const response = await api.get('/plans');
            setPlans(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Erreur lors du chargement des plans:', error);
            setLoading(false);
        }
    };

    const handleActivate = async (planId) => {
        try {
            await api.patch(`/plans/${planId}/activate`);
            fetchPlans();
        } catch (error) {
            console.error('Erreur lors de l\'activation:', error);
            alert('Erreur lors de l\'activation du plan');
        }
    };

    const handleDelete = async (planId, year) => {
        if (!window.confirm(`Supprimer définitivement le plan ${year} ?\n\nCette action supprimera aussi tous les stands associés !`)) return;
        try {
            await api.delete(`/plans/${planId}`);
            alert('✅ Plan supprimé !');
            fetchPlans();
        } catch (error) {
            const errorMsg = error.response?.data?.msg || 'Erreur lors de la suppression';
            alert('❌ ' + errorMsg);
        }
    };

    if (loading) return <div className="loading">Chargement...</div>;

    return (
        <div className="plan-list-container">
            <div className="page-header">
                <h1>Plans Interactifs</h1>
                <button className="btn-primary" onClick={() => navigate('/plans/new')}>
                    ➕ Nouveau Plan
                </button>
            </div>

            <div className="plans-grid">
                {plans.length === 0 ? (
                    <div className="empty-state">
                        <p>Aucun plan créé pour le moment</p>
                        <button className="btn-primary" onClick={() => navigate('/plans/new')}>
                            Créer le premier plan
                        </button>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Année</th>
                                <th>Image</th>
                                <th>Stands</th>
                                <th>Status</th>
                                <th>Créé le</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {plans.map((plan) => (
                                <tr key={plan.id}>
                                    <td><strong>{plan.year}</strong></td>
                                    <td>
                                        {plan.imageUrl ? (
                                            <span className="badge badge-success">✓</span>
                                        ) : (
                                            <span className="badge badge-warning">Aucune</span>
                                        )}
                                    </td>
                                    <td>{plan.standsCount || 0} stands</td>
                                    <td>
                                        {plan.isActive ? (
                                            <span className="badge badge-success">🟢 Actif</span>
                                        ) : (
                                            <span className="badge badge-secondary">⚪ Inactif</span>
                                        )}
                                    </td>
                                    <td>{new Date(plan.createdAt).toLocaleDateString()}</td>
                                    <td className="actions">
                                        <button
                                            className="btn-icon"
                                            onClick={() => navigate(`/plans/${plan.id}/stands`)}
                                            title="Gérer les stands"
                                        >
                                            📍
                                        </button>
                                        <button
                                            className="btn-icon"
                                            onClick={() => navigate(`/plans/${plan.id}/view`)}
                                            title="Visualiser le plan"
                                            style={{ color: '#17a2b8' }}
                                        >
                                            👁️
                                        </button>
                                        <button
                                            className="btn-icon"
                                            onClick={() => navigate(`/plans/edit/${plan.id}`)}
                                            title="Modifier"
                                        >
                                            ✏️
                                        </button>
                                        {!plan.isActive && (
                                            <button
                                                className="btn-icon btn-success"
                                                onClick={() => handleActivate(plan.id)}
                                                title="Activer ce plan"
                                            >
                                                ✅
                                            </button>
                                        )}
                                        {!plan.isActive && (
                                            <button
                                                className="btn-icon btn-danger"
                                                onClick={() => handleDelete(plan.id, plan.year)}
                                                title={plans.length === 1 ? "❌ Impossible de supprimer le dernier plan" : "Supprimer ce plan"}
                                                disabled={plans.length === 1}
                                                style={{
                                                    opacity: plans.length === 1 ? 0.5 : 1,
                                                    cursor: plans.length === 1 ? 'not-allowed' : 'pointer'
                                                }}
                                            >
                                                🗑️
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Section d'aide et workflow */}
                <div className="workflow-help">
                    <h2>📚 Guide Complet : Créer et Gérer un Plan Interactif</h2>

                    <div className="workflow-steps">
                        <div className="step-card">
                            <div className="step-number">1️⃣</div>
                            <div className="step-content">
                                <h3>Préparer l'image du plan</h3>
                                <ul>
                                    <li>Format : <strong>PNG</strong> ou <strong>JPG</strong></li>
                                    <li>Notez les dimensions en pixels (largeur × hauteur)</li>
                                    <li>Exemple : <code>1725 × 1725 px</code></li>
                                    <li>💡 L'image doit être claire et lisible avec les numéros de stands visibles</li>
                                </ul>
                            </div>
                        </div>

                        <div className="step-card">
                            <div className="step-number">2️⃣</div>
                            <div className="step-content">
                                <h3>Créer le plan dans l'interface</h3>
                                <ul>
                                    <li>Cliquez sur <strong>"➕ Nouveau Plan"</strong></li>
                                    <li>Renseignez l'année (ex: 2025)</li>
                                    <li>Uploadez l'image du plan</li>
                                    <li>Entrez les dimensions exactes (largeur et hauteur en pixels)</li>
                                    <li>⚠️ Les dimensions doivent correspondre exactement à votre image !</li>
                                </ul>
                            </div>
                        </div>

                        <div className="step-card">
                            <div className="step-number">3️⃣</div>
                            <div className="step-content">
                                <h3>Extraire les positions des stands (VGG ou manuel)</h3>
                                <p><strong>Option A : Utiliser VGG (Vision/IA)</strong></p>
                                <ul>
                                    <li>Utilisez un outil d'annotation d'images (VGG Image Annotator, LabelImg, etc.)</li>
                                    <li>Dessinez des rectangles autour de chaque stand</li>
                                    <li>Notez les coordonnées <code>(x, y, width, height)</code> en pixels</li>
                                    <li>Exportez en format JSON → convertir en CSV</li>
                                </ul>
                                <p style={{ marginTop: '12px' }}><strong>Option B : Mesure manuelle</strong></p>
                                <ul>
                                    <li>Ouvrez l'image dans un éditeur (Photoshop, GIMP, etc.)</li>
                                    <li>Utilisez l'outil Sélection pour chaque stand</li>
                                    <li>Notez : position X, Y, largeur, hauteur</li>
                                </ul>
                            </div>
                        </div>

                        <div className="step-card">
                            <div className="step-number">4️⃣</div>
                            <div className="step-content">
                                <h3>Préparer le fichier CSV</h3>
                                <p><strong>Format de base :</strong></p>
                                <pre className="code-sample">label,x,y,width,height
                                    54,494.04,1176.97,51.92,70.03
                                    55,495.07,1107.97,51.06,69.00</pre>

                                <p style={{ marginTop: '16px' }}><strong>Format complet avec catégories et entreprises :</strong></p>
                                <pre className="code-sample">label,x,y,width,height,category,company_name
                                    54,494.04,1176.97,51.92,70.03,Entreprise,MAROC TELECOM</pre>

                                <div className="info-box">
                                    <strong>📝 Colonnes disponibles :</strong>
                                    <ul>
                                        <li><code>label</code> : Numéro ou nom du stand (obligatoire)</li>
                                        <li><code>x, y, width, height</code> : Coordonnées en pixels (obligatoires)</li>
                                        <li><code>category</code> : Type de stand (optionnel, défaut: "Entreprise")
                                            <ul style={{ marginLeft: '20px', marginTop: '4px' }}>
                                                <li><em>Entreprise</em> : Stands d'exposants</li>
                                                <li><em>Service</em> : Accueil, Toilettes, Vestiaire, Info</li>
                                                <li><em>Salle</em> : Salles de conférence, réunion</li>
                                                <li><em>Restauration</em> : Cafétéria, restaurants</li>
                                            </ul>
                                        </li>
                                        <li><code>company_name</code> : Nom de l'entreprise (optionnel, pour catégorie "Entreprise" uniquement)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="step-card">
                            <div className="step-number">5️⃣</div>
                            <div className="step-content">
                                <h3>Importer les stands</h3>
                                <ul>
                                    <li>Dans la liste des plans, cliquez sur <strong>"📍"</strong> (Gérer les stands)</li>
                                    <li>Cliquez sur <strong>"📥 Importer CSV"</strong></li>
                                    <li>Glissez-déposez votre fichier CSV</li>
                                    <li>Vérifiez la preview (nombre de stands détectés)</li>
                                    <li>Cliquez <strong>"✅ Importer"</strong></li>
                                    <li>⚙️ Le système convertit automatiquement les pixels en pourcentages</li>
                                    <li>🔗 Les entreprises sont automatiquement associées si le nom correspond</li>
                                </ul>
                            </div>
                        </div>

                        <div className="step-card">
                            <div className="step-number">6️⃣</div>
                            <div className="step-content">
                                <h3>Vérifier et activer le plan</h3>
                                <ul>
                                    <li>Cliquez sur <strong>"👁️"</strong> (Visualiser) pour voir le plan</li>
                                    <li>Vérifiez que les rectangles sont bien positionnés</li>
                                    <li>Cliquez sur les stands pour voir les infos entreprises</li>
                                    <li>Si tout est OK, cliquez <strong>"✅"</strong> (Activer ce plan)</li>
                                    <li>🚀 Le plan devient actif dans l'application mobile !</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="tips-section">
                        <h3>💡 Conseils et astuces</h3>
                        <div className="tips-grid">
                            <div className="tip-card">
                                <strong>🎯 Précision des coordonnées</strong>
                                <p>Plus les coordonnées sont précises, meilleure sera l'expérience utilisateur dans l'app mobile</p>
                            </div>
                            <div className="tip-card">
                                <strong>🏢 Association automatique</strong>
                                <p>Le nom de l'entreprise doit correspondre EXACTEMENT au nom dans la base de données (insensible à la casse)</p>
                            </div>
                            <div className="tip-card">
                                <strong>📊 Gestion des versions</strong>
                                <p>Vous pouvez créer plusieurs plans (ex: 2024, 2025) et basculer entre eux en activant le plan souhaité</p>
                            </div>
                            <div className="tip-card">
                                <strong>🔄 Modification des stands</strong>
                                <p>Vous pouvez ré-importer un CSV à tout moment. Les anciens stands seront remplacés par les nouveaux</p>
                            </div>
                        </div>
                    </div>

                    <div className="warning-box">
                        <strong>⚠️ Points d'attention</strong>
                        <ul>
                            <li>Les dimensions du plan doivent être exactes, sinon les positions seront décalées</li>
                            <li>Seul le plan "Actif" (🟢) est visible dans l'application mobile</li>
                            <li>Vous ne pouvez pas supprimer le dernier plan ni le plan actuellement actif</li>
                            <li>Pour les stands de type Service/Salle, laissez la colonne <code>company_name</code> vide</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanList;
