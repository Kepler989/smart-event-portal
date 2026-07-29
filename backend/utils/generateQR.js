const QRCode = require('qrcode');

 
const generateTicketQR = async (text) => {
    try { 
        const qrDataUrl = await QRCode.toDataURL(text, {
            errorCorrectionLevel: 'H',  
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