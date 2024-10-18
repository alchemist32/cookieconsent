import axios from 'axios';

/**
 * 
 * @param {string} url
 * @param {import("axios").AxiosRequestConfig}
 * @returns {Promise<any>}
 */
export const get = async (url, config) => {
    try {
        const resp = await axios.get(url, config);
        return resp.data;
    } catch (error) {
        console.error('Error trying to get response: ', error);
        return;
    }
};
