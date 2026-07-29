import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [qrCode, setQrCode] = useState(null);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ attendeeName: '', attendeeEmail: '' });
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/events/${id}`);
                setEvent(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching event:", err);
                setMessage({ text: 'Event not found.', type: 'error' });
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' }); // Clear previous messages
        setQrCode(null); // Clear previous QR code if registering another person

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/registrations`, {
                eventId: id,
                ...formData
            });

            // DEBUG LOG: Check your browser console to verify the data is here
            console.log("Server Response:", res.data);

            setMessage({ text: 'Successfully registered!', type: 'success' });
            setQrCode(res.data.ticketQR); // Save the QR code from the backend
            setFormData({ attendeeName: '', attendeeEmail: '' }); // Reset form
            
            // Update local event state to reflect new registration count
            setEvent({ ...event, registeredCount: event.registeredCount + 1 });
            
        } catch (err) {
            setMessage({ 
                text: err.response?.data?.msg || 'Registration failed. Please try again.', 
                type: 'error' 
            });
        }
    };

    if (loading) return <div className="text-center mt-20 text-xl">Loading Event Details...</div>;
    if (!event) return <div className="text-center mt-20 text-red-500">{message.text}</div>;

    const isSoldOut = event.capacity <= event.registeredCount;

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <button onClick={() => navigate('/')} className="text-blue-500 hover:underline mb-6 block">
                &larr; Back to Events
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Event Information */}
                <div>
                    <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                        {event.description}
                    </p>
                    
                    <div className="space-y-3 border-t dark:border-gray-700 pt-6">
                        <p><strong>📅 Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                        <p><strong>📍 Location:</strong> {event.location}</p>
                        <p>
                            <strong>🎟️ Availability:</strong> {event.capacity - event.registeredCount} spots remaining 
                            <span className="text-sm text-gray-500 ml-2">({event.capacity} total capacity)</span>
                        </p>
                    </div>
                </div>

                {/* Right Column: Registration Form */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg border dark:border-gray-600">
                    <h2 className="text-2xl font-semibold mb-6">Register for this Event</h2>
                    
                    {/* The new, combined Message & QR Code Box */}
                    {message.text && (
                        <div className={`p-4 mb-6 rounded flex flex-col items-center text-center ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-800 border border-green-300'}`}>
                            <p className="font-bold text-lg mb-2">{message.text}</p>
                            
                            {/* QR Code renders exactly here now */}
                            {qrCode && (
                                <div className="mt-2 flex flex-col items-center">
                                    {/* ADD THIS DIAGNOSTIC LINE */}
                                    
                                    
                                    <div className="bg-white p-2 rounded shadow-sm">
                                        <img src={qrCode} alt="Ticket QR Code" className="w-40 h-40" />
                                    </div>
                                    <p className="text-xs mt-2 text-green-900 font-semibold uppercase tracking-wide">
                                        Take a screenshot of your ticket
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Full Name</label>
                            <input 
                                type="text" 
                                name="attendeeName"
                                value={formData.attendeeName}
                                onChange={handleChange}
                                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                required
                                disabled={isSoldOut}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Email Address</label>
                            <input 
                                type="email" 
                                name="attendeeEmail"
                                value={formData.attendeeEmail}
                                onChange={handleChange}
                                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                required
                                disabled={isSoldOut}
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            disabled={isSoldOut}
                            className={`w-full py-3 rounded text-white font-bold transition-colors ${
                                isSoldOut 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {isSoldOut ? 'Event Sold Out' : 'Confirm Registration'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}