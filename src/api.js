const axios = require('axios');

const api = axios.create({
    baseURL: `https://registry.npmjs.cf/`,
    timeout: 10000,
});

module.exports = api;
