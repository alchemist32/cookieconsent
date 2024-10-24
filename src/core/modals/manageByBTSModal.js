import { globalObj } from '../global';
import {
    createNode,
    addClass,
    setAttribute,
    addEvent,
    appendChild,
    getModalFocusableData,
    fireEvent,
    getSvgIcon,
    handleFocusTrap,
    debug
} from '../../utils/general';

import { guiManager } from '../../utils/gui-manager';
import {
    DIV_TAG,
    ARIA_HIDDEN,
    BUTTON_TAG,
    CLICK_EVENT,
    MANAGE_BY_BTS_MODAL_NAME
} from '../../utils/constants';

import { get } from '../../utils/client';
import { generate } from '../../utils/qrCode';

/**
 * Generates manage by bts modal and appends it to "cc-main" el.
 * @param {import("../global").Api} api
 * @param {CreateMainContainer} createMainContainer
 */
export const createManageByBTSModal = (api, createMainContainer) => {
    const state = globalObj._state;
    const dom = globalObj._dom;
    const { hideManageByBTSModal } = api;

    const modalData = state._currentTranslation && state._currentTranslation.manageByBTSModal;
    if (!modalData) {
        return;
    }
    if (!dom._btsm) {
        dom._btsmContainer = createNode(DIV_TAG);
        addClass(dom._btsmContainer, 'btsm-wrapper');

        const btsmOverlay = createNode(DIV_TAG);
        addClass(btsmOverlay, 'btsm-overlay');
        appendChild(dom._btsmContainer, btsmOverlay);

        addEvent(btsmOverlay, CLICK_EVENT, hideManageByBTSModal);

        dom._btsm =  createNode(DIV_TAG);

        addClass(dom._btsm, 'btsm');
        setAttribute(dom._btsm, 'role', 'dialog');
        setAttribute(dom._btsm, ARIA_HIDDEN, true);
        setAttribute(dom._btsm, 'aria-modal', true);
        setAttribute(dom._btsm, 'aria-labelledby', 'btsm__title');

        addEvent(dom._htmlDom, 'keydown', (event) => {
            if (event.keyCode === 27) {
                hideManageByBTSModal();
            }
        }, true);

        dom._btsmContent = createNode(DIV_TAG);
        addClass(dom._btsmContent, 'btsm__body');

        dom._btsmQrContainer = createNode(DIV_TAG);
        addClass(dom._btsmQrContainer, 'btsm__qr-container');

        const qrInstructions = createNode('h3');
        qrInstructions.textContent = 'Scan the QR code to get the data';

        dom._btsmQr = createNode(DIV_TAG);
        setAttribute(dom._btsmQr, 'id', 'qrCodeContainer');

        getUsers().then((result) =>  {
            appendUserData(result, 'qrCodeContainer');
        });
        
        

        appendChild(dom._btsmQrContainer, qrInstructions);
        appendChild(dom._btsmQrContainer, dom._btsmQr);
        appendChild(dom._btsmContent, dom._btsmQrContainer);

        dom._btsmDivTabindex = createNode(DIV_TAG);
        setAttribute(dom._btsmDivTabindex, 'tabIndex', -1);

        const btsmHeader = createNode(DIV_TAG);
        addClass(btsmHeader, 'btsm__header');

        const title = createNode('h2');
        title.textContent = 'Manage with BTS';
        addClass(title, 'btsm__title');

        dom._btsmCloseBtn = createNode(BUTTON_TAG);
        const crossIcon = createNode('span');
        crossIcon.innerHTML = getSvgIcon();

        addClass(dom._btsmCloseBtn, 'btsm__close-btn');
        setAttribute(dom._btsmCloseBtn, 'aria-label', 'Close modal');
        addEvent(dom._btsmCloseBtn, CLICK_EVENT, hideManageByBTSModal);

        appendChild(dom._btsmCloseBtn, crossIcon);

        appendChild(btsmHeader, title);
        appendChild(btsmHeader, dom._btsmCloseBtn);

        const btsmFooter = createNode('footer');
        addClass(btsmFooter, 'btsm__footer');

        const closeBtn = createNode(BUTTON_TAG);
        closeBtn.textContent = 'Close';
        addClass(closeBtn, 'pm__btn');
        addClass(closeBtn, 'pm__btn--secondary');
        addEvent(closeBtn, CLICK_EVENT, hideManageByBTSModal);

        appendChild(btsmFooter, closeBtn);

        appendChild(dom._btsm, dom._btsmDivTabindex);
        appendChild(dom._btsm, btsmHeader);
        appendChild(dom._btsm, dom._btsmContent);
        appendChild(dom._btsm, btsmFooter);

        appendChild(dom._btsmContainer, dom._btsm);
    }
    guiManager(2);

    if (!state._manageByBTSModalExists) {
        state._manageByBTSModalExists = true;
        debug('CookieConsent [HTML] created', MANAGE_BY_BTS_MODAL_NAME);

        fireEvent(globalObj._customEvents._onModalReady, MANAGE_BY_BTS_MODAL_NAME, dom._btsm);
        createMainContainer(api);
        appendChild(dom._ccMain, dom._btsmContainer);
        handleFocusTrap(dom._btsm);

        setTimeout(() => addClass(dom._btsmContainer, 'cc--anim'), 100);
    }
    getModalFocusableData(3);
};

/**
 * 
 * @returns {Promise<{ id: string; username: string; name: string; email: string; phone: number}>}
 */
async function getUsers() {
    const url = 'https://jsonplaceholder.typicode.com/users/1';
    try {
        const user = await get(url);
        return {
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            phone: user.phone
        };
    } catch (error) {
        console.error('Error trying to get the user in BTS modal', error);
        return;
    }
}

/**
 * appendUserData
 * generates a QR a appends the data to the dom
 * @param {{ id: string; username: string; name: string; email: string; phone: number}}userData 
 * @param {string} elementId
 */
function appendUserData(userData, elementId) {
    let data = '';
    const noDataMsg = 'No data to show';
    const dom = globalObj._dom;
    if (!userData) {
        dom._btsmQr.innerHTML = noDataMsg;
        return;
    }

    if (!dom._btsmQr) {
        dom._btsmQrContainer.innerHTML = noDataMsg;
        return;
    }
    data = JSON.stringify(userData);
    generate(elementId, data);
}
