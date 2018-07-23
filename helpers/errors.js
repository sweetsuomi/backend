let lang = 'en-EN';

function setLang(value) {
    if (value) {
        lang = value.match(/es-ES/) || value.match(/es/) ? 'es-ES' : 'en-EN';
    }
}

function error (key, status) {
    const langSelected = require('../languages/' + lang);
    const err = new Error(langSelected[key]);
    err.status = status || 404;
    return err;
};

module.exports = {
    setLang: setLang,
    error: error
};