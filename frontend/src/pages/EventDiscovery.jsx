import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EventDiscovery() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // <-- Added navigation hook

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

    if (loading) return <div className="text-center mt-10">Loading Events...</div>;

    return (
        <div>
            <h1 className="text-4xl font-bold mb-8 text-center">Upcoming Events</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => (
                    <div key={event._id} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700 flex flex-col justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{event.description}</p>
                            
                            <div className="text-sm mb-4">
                                <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                                <p><strong>Location:</strong> {event.location}</p>
                                <p><strong>Availability:</strong> {event.capacity - event.registeredCount} spots left</p>
                            </div>
                        </div>

                        {/* This button now redirects to the Event Details page! */}
                        <button 
                            onClick={() => navigate(`/events/${event._id}`)}
                            className={`w-full p-2 rounded text-white font-semibold mt-4 transition-colors ${
                                event.capacity <= event.registeredCount 
                                ? 'bg-gray-400 hover:bg-gray-500' 
                                : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {event.capacity <= event.registeredCount ? 'View Sold Out Event' : 'View Details & Register'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}