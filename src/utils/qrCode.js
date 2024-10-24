
/**
 * generate
 * creates a new QR code
 * @param {string} elementId 
 * @param {string} text
 * @returns the qrCode object
 */
export function generate(elementId, text) {
    const element = document.getElementById(elementId);
    element.innerHTML = text;
}
