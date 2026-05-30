const QRCode = require('qrcode');

/**
 * Generates a QR Code as a base64 Data URL
 * @param {string} text - The data to encode (e.g., a registration ID or verification link)
 * @returns {Promise<string>} - The base64 Data URL of the QR code
 */
const generateTicketQR = async (text) => {
    try {
        // Generate a QR code string
        const qrDataUrl = await QRCode.toDataURL(text, {
            errorCorrectionLevel: 'H', // High error correction so it scans easily on screens
            type: 'image/png',
            margin: 2,
            width: 300
        });
        
        return qrDataUrl;
    } catch (err) {
        console.error('Error generating QR code:', err);
        throw new Error('Failed to generate QR Code');
    }
};

module.exports = generateTicketQR;