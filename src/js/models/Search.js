
// API Key: 2f54333c91ef471b6aa82aeac3ffaef0
// https://www.food2fork.com/api/search
// https://www.food2fork.com/api/get

import axios from 'axios';
import { proxy, key } from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        // Comprobamos si hay algún error
        try {
            // Petición a la API con axios (devuelve directamente un JSON, no como 'fetch')
            const result = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.recipes = result.data.recipes;
        } catch (error) {
            alert(error);
        }
    }

}
