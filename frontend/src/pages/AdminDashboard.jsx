import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function AdminDashboard() {
    const { logout } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [formData, setFormData] = useState({
        title: '', description: '', date: '', location: '', capacity: ''
    });

    const fetchEvents = async () => {
        const res = await axios.get('http://localhost:5000/api/events');
        setEvents(res.data);
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Note: Axios automatically attaches the x-auth-token header here because of our AuthContext
            await axios.post('http://localhost:5000/api/events', formData);
            setFormData({ title: '', description: '', date: '', location: '', capacity: '' });
            fetchEvents(); // Refresh table
        } catch (err) {
            console.error(err);
            alert("Failed to create event. Are you logged in?");
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
                                <td className="p-4">{event.title}</td>
                                <td className="p-4">{new Date(event.date).toLocaleDateString()}</td>
                                <td className="p-4">{event.registeredCount} / {event.capacity}</td>
                                <td className="p-4">
                                    <button className="text-blue-500 hover:underline mr-4">Edit</button>
                                    <button className="text-red-500 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}