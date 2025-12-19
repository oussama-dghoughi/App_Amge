import React, { useState } from 'react';
import api from '../../services/api';
import './Plans.css';

const CsvImporter = ({ planId, onImportSuccess, onCancel }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        handleFile(selectedFile);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        handleFile(droppedFile);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleFile = (selectedFile) => {
        if (!selectedFile) return;

        if (!selectedFile.name.endsWith('.csv')) {
            setError('Seuls les fichiers CSV sont acceptés (.csv)');
            return;
        }

        setFile(selectedFile);
        setError(null);

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            const lines = text.split('\n').filter(line => line.trim());
            const dataLines = lines.length - 1;
            setPreview({
                totalLines: lines.length,
                standsCount: dataLines,
                firstLines: lines.slice(0, 5).join('\n')
            });
        };
        reader.readAsText(selectedFile);
    };

    const handleImport = async () => {
        if (!file) {
            setError('Aucun fichier sélectionné');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('csvFile', file);

            const response = await api.post(`/plans/${planId}/import-csv`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            alert(`✅ ${response.data.msg}`);
            onImportSuccess();
        } catch (err) {
            console.error('Erreur import:', err);
            const errorMsg = err.response?.data?.msg || 'Erreur lors de l\'import';
            const errors = err.response?.data?.errors || [];

            if (errors.length > 0) {
                setError(
                    <div>
                        <p>{errorMsg}</p>
                        <ul>
                            {errors.slice(0, 5).map((e, i) => (
                                <li key={i}>
                                    Ligne {e.line}: {e.error}
                                </li>
                            ))}
                            {errors.length > 5 && <li>... et {errors.length - 5} autres erreurs</li>}
                        </ul>
                    </div>
                );
            } else {
                setError(errorMsg);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="csv-importer">
            <h3>📥 Importer des Stands depuis CSV</h3>

            <div
                className={`csv-dropzone ${file ? 'has-file' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => document.getElementById('csv-file-input').click()}
            >
                <input
                    id="csv-file-input"
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                />

                {!file ? (
                    <>
                        <p className="dropzone-icon">📄</p>
                        <p>Glissez votre fichier CSV ici</p>
                        <p className="dropzone-hint">ou cliquez pour sélectionner</p>
                        <p className="dropzone-format">Format : label,x,y,width,height</p>
                    </>
                ) : (
                    <>
                        <p className="dropzone-icon">✅</p>
                        <p className="file-name">{file.name}</p>
                        {preview && (
                            <div className="csv-preview">
                                <p className="preview-count">
                                    <strong>{preview.standsCount} stands détectés</strong>
                                </p>
                                <pre className="preview-content">{preview.firstLines}</pre>
                            </div>
                        )}
                    </>
                )}
            </div>

            {error && (
                <div className="error-message">
                    ❌ {error}
                </div>
            )}

            <div className="csv-actions">
                <button
                    className="btn-primary"
                    onClick={handleImport}
                    disabled={!file || loading}
                >
                    {loading ? '⏳ Import en cours...' : '✅ Importer'}
                </button>
                <button
                    className="btn-secondary"
                    onClick={onCancel}
                    disabled={loading}
                >
                    ❌ Annuler
                </button>
            </div>

            <div className="csv-info">
                <p>ℹ️ <strong>Format CSV requis :</strong></p>
                <code>label,x,y,width,height</code>
                <p>• Les coordonnées doivent être en <strong>pixels</strong></p>
                <p>• Elles seront automatiquement converties en pourcentages</p>

                <p style={{ marginTop: '12px' }}>💡 <strong>Colonnes optionnelles :</strong></p>
                <code>label,x,y,width,height,category,company_name</code>
                <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                    <li><code>category</code> : Type de stand (<em>Entreprise</em>, <em>Service</em>, <em>Salle</em>, <em>Restauration</em>)</li>
                    <li><code>company_name</code> : Nom de l'entreprise (pour catégorie <em>Entreprise</em> uniquement)</li>
                </ul>
                <p style={{ marginTop: '8px', fontSize: '13px', color: '#666' }}>
                    • L'entreprise sera automatiquement associée si le nom existe<br />
                    • Pour les stands Service/Salle, laissez <code>company_name</code> vide
                </p>
            </div>
        </div>
    );
};

export default CsvImporter;
