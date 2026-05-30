import { useState, useEffect } from 'react';
import axios from 'axios';

export default function EventDiscovery() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/events');
                setEvents(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching events:", err);
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const handleRegister = async (eventId) => {
        const name = prompt("Enter your name:");
        const email = prompt("Enter your email:");
        
        if (name && email) {
            try {
                await axios.post('http://localhost:5000/api/registrations', {
                    eventId, attendeeName: name, attendeeEmail: email
                });
                alert("Registration successful!");
                window.location.reload(); // Refresh to update ticket counts
            } catch (err) {
                alert(err.response?.data?.msg || "Registration failed.");
            }
        }
    };

    if (loading) return <div className="text-center mt-10">Loading Events...</div>;

    return (
        <div>
            <h1 className="text-4xl font-bold mb-8 text-center">Upcoming Events</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => (
                    <div key={event._id} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700">
                        <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">{event.description}</p>
                        
                        <div className="text-sm mb-4">
                            <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                            <p><strong>Location:</strong> {event.location}</p>
                            <p><strong>Availability:</strong> {event.capacity - event.registeredCount} spots left</p>
                        </div>

                        <button 
                            onClick={() => handleRegister(event._id)}
                            disabled={event.capacity <= event.registeredCount}
                            className={`w-full p-2 rounded text-white font-semibold ${event.capacity <= event.registeredCount ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                        >
                            {event.capacity <= event.registeredCount ? 'Sold Out' : 'Register Now'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}