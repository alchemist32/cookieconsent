import * as qrCode from 'qrcodejs';

/**
 * generate
 * creates a new QR code
 * @param {string} elementId 
 * @param {string} text
 * @returns {QRCode} the qrCode object
 */
export function generate(elementId, text) {
    const qr = new qrCode(elementId, {
        text,
        width: 280,
        height: 280,
    });
    return qr;
}
