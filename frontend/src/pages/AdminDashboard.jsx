import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function AdminDashboard() {
    const { logout } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [formData, setFormData] = useState({
        title: '', description: '', date: '', location: '', capacity: ''
    });
    const [editingEventId, setEditingEventId] = useState(null); // Track which row is being edited
    const [editFormData, setEditFormData] = useState({          // Hold temporary edit inputs
        title: '', description: '', date: '', location: '', capacity: ''
    });

    const fetchEvents = async () => {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/events`);
        setEvents(res.data);
    };

    const handleDelete = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
        try {
            // Sends the DELETE request to our backend route
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/events/${eventId}`);
            alert("Event deleted successfully!");
            fetchEvents(); // Refresh the table automatically
        } catch (err) {
            console.error("Error deleting event:", err);
            alert("Failed to delete event.");
        }
    }
};
// Triggered when the user clicks "Edit" on a row
const startEditing = (event) => {
    setEditingEventId(event._id);
    setEditFormData({
        title: event.title,
        description: event.description,
        date: event.date.split('T')[0], // Formats database date to YYYY-MM-DD for the input field
        location: event.location,
        capacity: event.capacity
    });
};

// Triggered when typing into the edit inputs
const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
};

// Triggered when clicking "Save"
const handleEditSubmit = async (e, eventId) => {
    e.preventDefault();
    try {
        // Make the PUT request to the backend route we created earlier
        await axios.put(`${import.meta.env.VITE_API_URL}/api/events/${eventId}`, editFormData);
        alert("Event updated successfully!");
        setEditingEventId(null); // Close the editing mode
        fetchEvents();           // Refresh the table numbers
    } catch (err) {
        console.error("Error updating event:", err);
        alert("Failed to update event.");
    }
};

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Note: Axios automatically attaches the x-auth-token header here because of our AuthContext
            await axios.post(`${import.meta.env.VITE_API_URL}/api/events`, formData);
            setFormData({ title: '', description: '', date: '', location: '', capacity: '' });
            fetchEvents(); // Refresh table
        } catch (err) {
            console.error(err);
            alert("Failed to create event. Are you logged in?");
        }
    };
    const handleExportCSV = async (eventId, eventTitle) => {
        try {
            // We must specify 'blob' so Axios knows it is receiving a file, not text
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/events/${eventId}/csv`, {
                responseType: 'blob'
            });
            
            // Create a hidden link, click it to download the file, and remove it
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            
            // Clean up the title so it makes a good file name
            const safeTitle = eventTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            link.setAttribute('download', `${safeTitle}_attendees.csv`);
            
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (err) {
            console.error("Error exporting CSV:", err);
            alert("Failed to export CSV. Make sure there are registered attendees first!");
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Logout</button>
            </div>

            {/* Create Event Form */}
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mb-10">
                <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="title" placeholder="Event Title" value={formData.title} onChange={handleChange} className="p-2 rounded border dark:text-black" required />
                    <input type="date" name="date" value={formData.date} onChange={handleChange} className="p-2 rounded border dark:text-black" required />
                    <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="p-2 rounded border dark:text-black" required />
                    <input type="number" name="capacity" placeholder="Total Capacity" value={formData.capacity} onChange={handleChange} className="p-2 rounded border dark:text-black" required />
                    <textarea name="description" placeholder="Event Description" value={formData.description} onChange={handleChange} className="p-2 rounded border md:col-span-2 dark:text-black" required />
                    <button type="submit" className="md:col-span-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Publish Event</button>
                </form>
            </div>

            {/* Event Management Table */}
            <h2 className="text-xl font-semibold mb-4">Manage Events</h2>
            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
                <table className="min-w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-200 dark:bg-gray-700">
                            <th className="p-4 border-b">Event Name</th>
                            <th className="p-4 border-b">Date</th>
                            <th className="p-4 border-b">Registrations</th>
                            <th className="p-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map(event => (
                            <tr key={event._id} className="border-b dark:border-gray-700">
                                {editingEventId === event._id ? (
                                    // --- EDITABLE ROW VIEW ---
                                    <>
                                        <td className="p-2">
                                            <input type="text" name="title" value={editFormData.title} onChange={handleEditChange} className="w-full p-1 border rounded text-black text-sm" required />
                                        </td>
                                        <td className="p-2">
                                            <input type="date" name="date" value={editFormData.date} onChange={handleEditChange} className="w-full p-1 border rounded text-black text-sm" required />
                                        </td>
                                        <td className="p-2">
                                            <span className="text-sm gray-500">{event.registeredCount} / </span>
                                            <input type="number" name="capacity" value={editFormData.capacity} onChange={handleEditChange} className="w-16 p-1 border rounded text-black text-sm inline" required />
                                        </td>
                                        <td className="p-4 flex space-x-2">
                                            <button 
                                                onClick={(e) => handleEditSubmit(e, event._id)} 
                                                className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                                            >
                                                Save
                                            </button>
                                            <button 
                                                onClick={() => setEditingEventId(null)} 
                                                className="bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600"
                                            >
                                                Cancel
                                            </button>
                                        </td>
                                    </>
                                ) : (
                                    // --- STANDARD READ-ONLY ROW VIEW ---
                                    <>
                                        <td className="p-4 font-medium">{event.title}</td>
                                        <td className="p-4">{new Date(event.date).toLocaleDateString()}</td>
                                        <td className="p-4">{event.registeredCount} / {event.capacity}</td>
                                        <td className="p-4 flex flex-wrap gap-3 items-center">
                                            <button 
                                                onClick={() => handleExportCSV(event._id, event.title)} 
                                                className="text-green-600 hover:underline font-semibold"
                                                disabled={event.registeredCount === 0}
                                                title={event.registeredCount === 0 ? "No attendees to export" : "Download CSV"}
                                            >
                                                CSV
                                            </button>
                                            <button 
                                                onClick={() => startEditing(event)} 
                                                className="text-blue-500 hover:underline font-semibold"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(event._id)} 
                                                className="text-red-500 hover:underline font-semibold"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}