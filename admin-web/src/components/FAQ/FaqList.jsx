import React, { useState, useEffect } from 'react';
import faqApi from '../../services/faqApi';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import './Faq.css';

const FaqList = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingFaq, setEditingFaq] = useState(null);
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        order: 0,
        isActive: true
    });

    useEffect(() => {
        fetchFaqs();
    }, []);

    const fetchFaqs = async () => {
        try {
            const response = await faqApi.getAllFaqs();
            setFaqs(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Erreur chargement FAQ:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingFaq) {
                await faqApi.updateFaq(editingFaq.id, formData);
            } else {
                await faqApi.createFaq(formData);
            }
            setShowModal(false);
            resetForm();
            fetchFaqs();
        } catch (error) {
            console.error('Erreur sauvegarde FAQ:', error);
            alert('Erreur lors de la sauvegarde');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Voulez-vous vraiment supprimer cette question ?')) {
            try {
                await faqApi.deleteFaq(id);
                fetchFaqs();
            } catch (error) {
                console.error('Erreur suppression FAQ:', error);
                alert('Erreur lors de la suppression');
            }
        }
    };

    const openEditModal = (faq) => {
        setEditingFaq(faq);
        setFormData({
            question: faq.question,
            answer: faq.answer,
            order: faq.order || 0,
            isActive: faq.isActive
        });
        setShowModal(true);
    };

    const openCreateModal = () => {
        setEditingFaq(null);
        resetForm();
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            question: '',
            answer: '',
            order: faqs.length + 1,
            isActive: true
        });
    };

    if (loading) return <div>Chargement...</div>;

    return (
        <div className="faq-container">
            <div className="faq-header">
                <h1>Gestion FAQ</h1>
                <button className="btn-add" onClick={openCreateModal}>
                    <FiPlus /> Ajouter une question
                </button>
            </div>

            <div className="faq-list">
                {faqs.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                        Aucune question FAQ pour le moment
                    </div>
                ) : (
                    faqs.map((faq) => (
                        <div key={faq.id} className="faq-item">
                            <div className="faq-content">
                                <div className="faq-question">
                                    {faq.order}. {faq.question}
                                    {!faq.isActive && <span style={{ fontSize: '12px', color: '#dc3545', marginLeft: '8px' }}>(Inactif)</span>}
                                </div>
                                <div className="faq-answer">{faq.answer}</div>
                            </div>
                            <div className="faq-actions">
                                <button className="btn-icon btn-edit" onClick={() => openEditModal(faq)} title="Modifier">
                                    <FiEdit2 />
                                </button>
                                <button className="btn-icon btn-delete" onClick={() => handleDelete(faq.id)} title="Supprimer">
                                    <FiTrash2 />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal Formulaire */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{editingFaq ? 'Modifier la question' : 'Nouvelle question'}</h2>
                            <button className="btn-icon" onClick={() => setShowModal(false)}>
                                <FiX />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Question</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.question}
                                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                    required
                                    placeholder="Ex: Comment s'inscrire ?"
                                />
                            </div>
                            <div className="form-group">
                                <label>Réponse</label>
                                <textarea
                                    className="form-control"
                                    value={formData.answer}
                                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                    required
                                    placeholder="Ex: Rendez-vous sur la page..."
                                />
                            </div>
                            <div className="form-group">
                                <label>Ordre d'affichage</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={formData.order}
                                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    />
                                    Question active (visible dans l'app)
                                </label>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                                    Annuler
                                </button>
                                <button type="submit" className="btn-primary">
                                    {editingFaq ? 'Mettre à jour' : 'Créer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FaqList;
