import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import './Plans.css';

const PlanForm = () => {
    const { id } = useParams(); // Si id existe, mode édition
    const isEditing = !!id;
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        year: new Date().getFullYear(),
        imageUrl: '',
        imageWidth: 1725,
        imageHeight: 1725,
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(isEditing);

    // Charger les données du plan si mode édition
    useEffect(() => {
        if (isEditing) {
            loadPlanData();
        }
    }, [id]);

    const loadPlanData = async () => {
        try {
            const response = await api.get(`/plans`);
            const plan = response.data.data.find(p => p.id === id);

            if (plan) {
                setFormData({
                    year: plan.year,
                    imageUrl: plan.imageUrl || '',
                    imageWidth: plan.imageWidth,
                    imageHeight: plan.imageHeight,
                });
                // Afficher l'image actuelle
                if (plan.imageUrl) {
                    setImagePreview(plan.imageUrl);
                }
            }
            setLoadingData(false);
        } catch (error) {
            console.error('Erreur chargement plan:', error);
            setLoadingData(false);
            alert('Erreur lors du chargement du plan');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            // Créer preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEditing) {
                // Mode édition
                await api.patch(`/plans/${id}`, {
                    year: formData.year,
                    imageWidth: formData.imageWidth,
                    imageHeight: formData.imageHeight
                });

                // Si nouvelle image sélectionnée, l'uploader
                if (selectedImage) {
                    const formDataImage = new FormData();
                    formDataImage.append('image', selectedImage);

                    await api.post(`/plans/${id}/upload-image`, formDataImage, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                }

                alert('✅ Plan modifié !');
            } else {
                // Mode création
                const planResponse = await api.post('/plans', formData);
                const planId = planResponse.data.data.id;

                // Si une image est sélectionnée, l'uploader
                if (selectedImage) {
                    const formDataImage = new FormData();
                    formDataImage.append('image', selectedImage);

                    await api.post(`/plans/${planId}/upload-image`, formDataImage, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });

                    alert('✅ Plan créé et image uploadée !');
                } else {
                    alert('✅ Plan créé !');
                }
            }

            navigate('/plans');
        } catch (error) {
            console.error('Erreur:', error);
            alert(error.response?.data?.msg || `Erreur lors de ${isEditing ? 'la modification' : 'la création'} du plan`);
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return <div className="loading">Chargement...</div>;
    }

    return (
        <div className="plan-form-container">
            <div className="page-header">
                <h1>{isEditing ? '✏️ Modifier le Plan' : '➕ Nouveau Plan'}</h1>
                <button className="btn-secondary" onClick={() => navigate('/plans')}>
                    ← Retour
                </button>
            </div>

            <form onSubmit={handleSubmit} className="form-card">
                <div className="form-group">
                    <label>Année *</label>
                    <input
                        type="number"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                        min="2020"
                        max="2100"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>📤 {isEditing ? 'Changer l\'Image du Plan' : 'Image du Plan'}</label>

                    {isEditing && formData.imageUrl && !selectedImage && (
                        <div style={{ marginBottom: '15px' }}>
                            <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                                Image actuelle :
                            </p>
                            <img
                                src={imagePreview}
                                alt="Plan actuel"
                                style={{
                                    maxWidth: '300px',
                                    maxHeight: '300px',
                                    border: '2px solid #28a745',
                                    borderRadius: '8px',
                                    marginBottom: '10px'
                                }}
                            />
                        </div>
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ marginBottom: '10px' }}
                    />

                    {selectedImage && imagePreview && (
                        <div style={{ marginTop: '10px' }}>
                            <p style={{ fontSize: '14px', color: '#666' }}>
                                {isEditing ? 'Nouvelle image' : 'Aperçu'} :
                            </p>
                            <img
                                src={imagePreview}
                                alt="Preview"
                                style={{
                                    maxWidth: '300px',
                                    maxHeight: '300px',
                                    border: '2px solid #007bff',
                                    borderRadius: '8px'
                                }}
                            />
                        </div>
                    )}

                    {!selectedImage && !formData.imageUrl && (
                        <small>Aucune image sélectionnée</small>
                    )}
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Largeur (px)</label>
                        <input
                            type="number"
                            value={formData.imageWidth}
                            onChange={(e) => setFormData({ ...formData, imageWidth: parseInt(e.target.value) })}
                            required
                        />
                        <small>Largeur de l'image en pixels (pour conversion stand)</small>
                    </div>

                    <div className="form-group">
                        <label>Hauteur (px)</label>
                        <input
                            type="number"
                            value={formData.imageHeight}
                            onChange={(e) => setFormData({ ...formData, imageHeight: parseInt(e.target.value) })}
                            required
                        />
                        <small>Hauteur de l'image en pixels (pour conversion stand)</small>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="btn-secondary" onClick={() => navigate('/plans')}>
                        Annuler
                    </button>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? (isEditing ? 'Modification...' : 'Création...') : (isEditing ? '✅ Modifier' : '✅ Créer le plan')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PlanForm;
