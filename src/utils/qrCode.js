import qrcode from 'qrcodejs';



/**
 * generate
 * creates a new QR code
 * @param {string} elementId 
 * @param {string} text
 * @returns {qrcode} the qrCode object
 */
export function generate(elementId, text) {
    return new qrcode(elementId, {
        text,
        width: 280,
        height: 280,
    });
}
