import React, { useEffect, useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { eventService } from "../../services/api";
import EventList from "./EventList";
import EventForm from "./EventForm";
import "./Events.css";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: 0,
    pages: 0,
  });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {
        ...(search && { search }),
        page: pagination.page,
        limit: pagination.limit,
      };
      const response = await eventService.getEvents(params);
      setEvents(response.events || []);
      setPagination((prev) => ({
        ...prev,
        total: response.total || 0,
        pages: response.pages || 0,
      }));
    } catch (error) {
      console.error("Erreur lors du chargement des événements:", error);
      alert(
        error.response?.data?.msg || "Erreur lors du chargement des événements"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, pagination.page, pagination.limit]);

  const handleCreate = () => {
    setEditingEvent(null);
    setShowForm(true);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await eventService.deleteEvent(id);
      fetchEvents();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'événement:", error);
      alert(error.response?.data?.msg || "Erreur lors de la suppression");
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingEvent(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    fetchEvents();
  };

  return (
    <div className="events-page">
      <div className="events-header">
        <h2>Gestion des événements</h2>
        <button className="btn-primary" onClick={handleCreate}>
          <FiPlus /> Nouvel événement
        </button>
      </div>

      <div className="events-filters">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher par titre..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
          />
        </div>
      </div>

      {showForm && (
        <EventForm
          event={editingEvent}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      <EventList
        events={events}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pagination={pagination}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
      />
    </div>
  );
};

export default Events;
