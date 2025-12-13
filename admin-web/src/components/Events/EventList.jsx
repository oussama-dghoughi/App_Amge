import React from "react";
import { FiEdit, FiTrash2, FiCalendar } from "react-icons/fi";
import "./EventList.css";

const formatDateTime = (value) => {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString();
  } catch (e) {
    return value;
  }
};

const EventList = ({ events, loading, onEdit, onDelete, pagination, onPageChange }) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des événements...</p>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="empty-state">
        <p>Aucun événement trouvé</p>
      </div>
    );
  }

  return (
    <div className="event-list-container">
      <div className="table-wrapper">
        <table className="event-table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Description</th>
              <th>Début</th>
              <th>Fin</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td className="event-title">
                  <div>
                    <strong>{event.title}</strong>
                  </div>
                </td>
                <td className="event-description">
                  {event.description || (
                    <span className="muted">Aucune description</span>
                  )}
                </td>
                <td>{formatDateTime(event.startDateTime)}</td>
                <td>{formatDateTime(event.endDateTime)}</td>
                <td>
                  <div className="actions">
                    <button
                      className="btn-icon btn-edit"
                      onClick={() => onEdit(event)}
                      title="Modifier"
                    >
                      <FiEdit />
                    </button>
                    <button
                      className="btn-icon btn-delete"
                      onClick={() => onDelete(event.id)}
                      title="Supprimer"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination?.pages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            Précédent
          </button>
          <span className="pagination-info">
            Page {pagination.page} sur {pagination.pages} ({pagination.total} événements)
          </span>
          <button
            className="pagination-btn"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
};

export default EventList;
