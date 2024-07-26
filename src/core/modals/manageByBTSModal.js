import { globalObj } from '../global';
import {
    createNode,
    addClass,
    addClassPm,
    setAttribute,
    removeClass,
    addEvent,
    appendChild,
    getKeys,
    hasClass,
    elContains,
    getModalFocusableData,
    isString,
    isObject,
    fireEvent,
    getSvgIcon,
    handleFocusTrap,
    debug
} from '../../utils/general';

import { guiManager } from '../../utils/gui-manager';
import {
    SCRIPT_TAG_SELECTOR,
    DIV_TAG,
    ARIA_HIDDEN,
    BUTTON_TAG,
    BTN_GROUP_CLASS,
    CLICK_EVENT,
    DATA_ROLE,
    MANAGE_BY_BTS_MODAL_NAME
} from '../../utils/constants';

/**
 * Generates manage by bts modal and appends it to "cc-main" el.
 * @param {import("../global").Api} api
 * @param {CreateMainContainer} createMainContainer
 */
export const createManageByBTSModal = (api, createMainContainer) => {
    const state = globalObj._state;
    const dom = globalObj._dom;
    const { hide, hideManageByBTSModal } = api;

    const modalData = state._currentTranslation && state._currentTranslation.manageByBTSModal;
    if (!modalData) {
        return;
    }

    if (!dom.pm) {
        dom._btsmContainer = createNode(DIV_TAG);
        addClass(dom._btsmContainer, 'pm-wrapper');

        const btsmOverlay = createNode(DIV_TAG);
        addClass(btsmOverlay, 'pm-overlay');
        appendChild(dom._btsmContainer, btsmOverlay);

        addEvent(btsmOverlay, CLICK_EVENT, hideManageByBTSModal);

        dom._btsm =  createNode(DIV_TAG);

        addClass(dom._btsm, 'pm');
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
        const pTag = createNode('p');
        pTag.textContent = 'This is managed by BTS';
        appendChild(dom._btsmContent, pTag);

        dom._btsmDivTabindex = createNode(DIV_TAG);
        setAttribute(dom._btsmDivTabindex, 'tabIndex', -1);
        appendChild(dom._btsm, dom._btsmDivTabindex);
    }
    guiManager(2);

    if (state._manageByBTSModalExists) {
        state._manageByBTSModalExists = true;
        debug('CookieConsent [HTML] created', MANAGE_BY_BTS_MODAL_NAME);

        fireEvent(globalObj._customEvents._onModalReady, MANAGE_BY_BTS_MODAL_NAME, dom._btsm);
        createMainContainer(api);
        appendChild(dom._ccMain, dom._btsmContainer);
        handleFocusTrap(dom._btsm);

        setTimeout(() => addClass(dom._pmContainer, 'cc--anim'), 100);
    }
    getModalFocusableData(2);
};