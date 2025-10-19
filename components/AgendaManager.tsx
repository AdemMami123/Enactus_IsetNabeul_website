"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Event, EventFormData } from "@/types/event";
import {
  Calendar,
  Plus,
  ChevronLeft,
  ChevronRight,
  Filter,
  Clock,
  MapPin,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AgendaManager() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const eventsRef = collection(db, "events");
      const q = query(eventsRef, orderBy("date", "asc"));
      const querySnapshot = await getDocs(q);

      const fetchedEvents: Event[] = [];
      querySnapshot.forEach((doc) => {
        fetchedEvents.push({ id: doc.id, ...doc.data() } as Event);
      });

      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async (eventData: EventFormData) => {
    if (!user) return;

    try {
      const newEvent = {
        ...eventData,
        status: "pending",
        createdBy: user.uid,
        createdByName: user.displayName || user.email || "Unknown",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await addDoc(collection(db, "events"), newEvent);
      await fetchEvents();
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Failed to add event. Please try again.");
    }
  };

  const handleUpdateEvent = async (eventId: string, updates: Partial<Event>) => {
    try {
      const eventRef = doc(db, "events", eventId);
      await updateDoc(eventRef, {
        ...updates,
        updatedAt: Date.now(),
      });
      await fetchEvents();
      setSelectedEvent(null);
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event. Please try again.");
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      await deleteDoc(doc(db, "events", eventId));
      await fetchEvents();
      setSelectedEvent(null);
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event. Please try again.");
    }
  };

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    return events.filter((event) => {
      if (filterType !== "all" && event.type !== filterType) return false;
      return event.date === dateString;
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const previousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
    const days = [];

    // Empty cells for days before the month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="aspect-square p-2 bg-gray-800/30" />
      );
    }

    // Calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      const dayEvents = getEventsForDate(date);
      const isSelected = isSameDay(date, selectedDate);
      const isTodayDate = isToday(date);

      days.push(
        <motion.div
          key={day}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setSelectedDate(date);
            if (dayEvents.length > 0) {
              setSelectedEvent(dayEvents[0]);
            }
          }}
          className={`aspect-square p-2 cursor-pointer border border-gray-700/50 transition-all duration-200 ${
            isSelected
              ? "bg-[#FFD600] text-black font-bold"
              : isTodayDate
              ? "bg-[#FFD600]/20 border-[#FFD600]"
              : "bg-gray-800/50 hover:bg-gray-700/50"
          }`}
        >
          <div className="flex flex-col h-full">
            <span
              className={`text-sm md:text-base ${
                isSelected ? "text-black" : "text-white"
              }`}
            >
              {day}
            </span>
            <div className="flex-1 mt-1 space-y-1 overflow-hidden">
              {dayEvents.slice(0, 2).map((event) => (
                <div
                  key={event.id}
                  className={`text-xs px-1 rounded truncate ${
                    event.type === "meeting"
                      ? "bg-blue-500/80 text-white"
                      : event.type === "task"
                      ? "bg-green-500/80 text-white"
                      : "bg-purple-500/80 text-white"
                  }`}
                >
                  {event.title}
                </div>
              ))}
              {dayEvents.length > 2 && (
                <div className="text-xs text-[#FFD600]">
                  +{dayEvents.length - 2} more
                </div>
              )}
            </div>
          </div>
        </motion.div>
      );
    }

    return days;
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD600]"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
              <Calendar className="w-8 h-8 md:w-10 md:h-10 text-[#FFD600]" />
              Event Agenda
            </h1>
            <p className="text-gray-400 mt-2">
              Manage tasks, meetings, and events for your team
            </p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-[#FFD600] hover:bg-[#FFD600]/90 text-black font-semibold"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {["all", "task", "meeting", "event"].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterType === type
                ? "bg-[#FFD600] text-black"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
            {type !== "all" && (
              <span className="ml-2 text-xs">
                ({events.filter((e) => e.type === type).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Calendar */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700 p-4 md:p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h2>
          <div className="flex gap-2">
            <Button
              onClick={previousMonth}
              variant="outline"
              size="icon"
              className="bg-gray-800 border-gray-700 hover:bg-gray-700"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              onClick={() => setCurrentMonth(new Date())}
              variant="outline"
              className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-white"
            >
              Today
            </Button>
            <Button
              onClick={nextMonth}
              variant="outline"
              size="icon"
              className="bg-gray-800 border-gray-700 hover:bg-gray-700"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center font-semibold text-[#FFD600] py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
      </div>

      {/* Selected Date Events */}
      <AnimatePresence>
        {getEventsForDate(selectedDate).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-6 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">
              Events on {selectedDate.toLocaleDateString()}
            </h3>
            <div className="space-y-3">
              {getEventsForDate(selectedDate).map((event) => (
                <motion.div
                  key={event.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedEvent(event)}
                  className="bg-gray-800/50 rounded-lg p-4 cursor-pointer border border-gray-700 hover:border-[#FFD600] transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            event.type === "meeting"
                              ? "bg-blue-500 text-white"
                              : event.type === "task"
                              ? "bg-green-500 text-white"
                              : "bg-purple-500 text-white"
                          }`}
                        >
                          {event.type.toUpperCase()}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            event.priority === "high"
                              ? "bg-red-500 text-white"
                              : event.priority === "medium"
                              ? "bg-yellow-500 text-black"
                              : "bg-gray-500 text-white"
                          }`}
                        >
                          {event.priority}
                        </span>
                      </div>
                      <h4 className="text-white font-semibold text-lg">
                        {event.title}
                      </h4>
                      <p className="text-gray-400 text-sm mt-1">
                        {event.description}
                      </p>
                      {event.startTime && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                          <Clock className="w-4 h-4" />
                          {event.startTime}
                          {event.endTime && ` - ${event.endTime}`}
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Event Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddEventModal
            selectedDate={selectedDate}
            onClose={() => setShowAddModal(false)}
            onSave={handleAddEvent}
          />
        )}
      </AnimatePresence>

      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <EventDetailsModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onUpdate={handleUpdateEvent}
            onDelete={handleDeleteEvent}
            currentUserId={user?.uid || ""}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Add Event Modal Component
function AddEventModal({
  selectedDate,
  onClose,
  onSave,
}: {
  selectedDate: Date;
  onClose: () => void;
  onSave: (data: EventFormData) => void;
}) {
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    date: selectedDate.toISOString().split("T")[0],
    startTime: "",
    endTime: "",
    type: "task",
    priority: "medium",
    location: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert("Please fill in all required fields");
      return;
    }
    onSave(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-900 rounded-xl border border-gray-700 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Add New Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#FFD600]"
              placeholder="Event title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#FFD600]"
              placeholder="Event description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as "task" | "meeting" | "event",
                  })
                }
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#FFD600]"
              >
                <option value="task">Task</option>
                <option value="meeting">Meeting</option>
                <option value="event">Event</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: e.target.value as "low" | "medium" | "high",
                  })
                }
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#FFD600]"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#FFD600]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Time
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#FFD600]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                End Time
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#FFD600]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#FFD600]"
              placeholder="Meeting location or venue"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-[#FFD600] hover:bg-[#FFD600]/90 text-black font-semibold"
            >
              Create Event
            </Button>
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-700 hover:bg-gray-800"
            >
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// Event Details Modal Component
function EventDetailsModal({
  event,
  onClose,
  onUpdate,
  onDelete,
  currentUserId,
}: {
  event: Event;
  onClose: () => void;
  onUpdate: (eventId: string, updates: Partial<Event>) => void;
  onDelete: (eventId: string) => void;
  currentUserId: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(event);

  const canEdit = event.createdBy === currentUserId;

  const handleUpdate = () => {
    onUpdate(event.id, editData);
    setIsEditing(false);
  };

  const handleStatusChange = (status: Event["status"]) => {
    onUpdate(event.id, { status });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-900 rounded-xl border border-gray-700 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {isEditing ? (
          <>
            <h2 className="text-2xl font-bold text-white mb-6">Edit Event</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) =>
                    setEditData({ ...editData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#FFD600]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#FFD600]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Type
                  </label>
                  <select
                    value={editData.type}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        type: e.target.value as "task" | "meeting" | "event",
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#FFD600]"
                  >
                    <option value="task">Task</option>
                    <option value="meeting">Meeting</option>
                    <option value="event">Event</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={editData.priority}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        priority: e.target.value as "low" | "medium" | "high",
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#FFD600]"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={editData.location || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, location: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#FFD600]"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleUpdate}
                  className="flex-1 bg-[#FFD600] hover:bg-[#FFD600]/90 text-black font-semibold"
                >
                  Save Changes
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="flex-1 border-gray-700 hover:bg-gray-800"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`px-3 py-1 rounded text-sm font-semibold ${
                      event.type === "meeting"
                        ? "bg-blue-500 text-white"
                        : event.type === "task"
                        ? "bg-green-500 text-white"
                        : "bg-purple-500 text-white"
                    }`}
                  >
                    {event.type.toUpperCase()}
                  </span>
                  <span
                    className={`px-3 py-1 rounded text-sm font-semibold ${
                      event.priority === "high"
                        ? "bg-red-500 text-white"
                        : event.priority === "medium"
                        ? "bg-yellow-500 text-black"
                        : "bg-gray-500 text-white"
                    }`}
                  >
                    {event.priority.toUpperCase()}
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-white">{event.title}</h2>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm text-gray-400">Description</label>
                <p className="text-white mt-1">{event.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar className="w-5 h-5 text-[#FFD600]" />
                  <div>
                    <p className="text-sm text-gray-400">Date</p>
                    <p className="text-white">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {event.startTime && (
                  <div className="flex items-center gap-3 text-gray-300">
                    <Clock className="w-5 h-5 text-[#FFD600]" />
                    <div>
                      <p className="text-sm text-gray-400">Time</p>
                      <p className="text-white">
                        {event.startTime}
                        {event.endTime && ` - ${event.endTime}`}
                      </p>
                    </div>
                  </div>
                )}

                {event.location && (
                  <div className="flex items-center gap-3 text-gray-300">
                    <MapPin className="w-5 h-5 text-[#FFD600]" />
                    <div>
                      <p className="text-sm text-gray-400">Location</p>
                      <p className="text-white">{event.location}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 text-gray-300">
                  <User className="w-5 h-5 text-[#FFD600]" />
                  <div>
                    <p className="text-sm text-gray-400">Created By</p>
                    <p className="text-white">{event.createdByName}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {["pending", "in-progress", "completed", "cancelled"].map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() =>
                          handleStatusChange(
                            status as Event["status"]
                          )
                        }
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          event.status === status
                            ? "bg-[#FFD600] text-black"
                            : "bg-gray-800 text-white hover:bg-gray-700"
                        }`}
                      >
                        {status === "in-progress"
                          ? "In Progress"
                          : status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-700">
              {canEdit && (
                <>
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-[#FFD600] hover:bg-[#FFD600]/90 text-black font-semibold"
                  >
                    Edit Event
                  </Button>
                  <Button
                    onClick={() => onDelete(event.id)}
                    variant="outline"
                    className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    Delete
                  </Button>
                </>
              )}
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 border-gray-700 hover:bg-gray-800"
              >
                Close
              </Button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
