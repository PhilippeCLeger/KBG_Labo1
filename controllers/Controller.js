/////////////////////////////////////////////////////////////////////
// This module define the base Controller class of all controllers.
/////////////////////////////////////////////////////////////////////
// Important note about derived controllers class:
// They must respect pluralize convention:
// RessourceNamesController in order to have proper routing
/////////////////////////////////////////////////////////////////////
// Author : Nicolas Chourot
// Lionel-Groulx College
/////////////////////////////////////////////////////////////////////
module.exports =
    class Controller {
        constructor(HttpContext) {
            this.HttpContext = HttpContext;
        }
        head() {
            this.HttpContext.response.notImplemented();
        }
        get(id) {
            this.HttpContext.response.notImplemented();
        }
        post(data) {
            this.HttpContext.response.notImplemented();
        }
        put(data) {
            this.HttpContext.response.notImplemented();
        }
        remove(id) {
            this.HttpContext.response.notImplemented();
        }
    }
