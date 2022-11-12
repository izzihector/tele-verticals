/** @tele-module **/

const SearchPanel = require("web.searchPanel");
import { patch } from 'web.utils';

patch(SearchPanel.prototype, '/tele_backend_theme/static/src/js/ks_search_panel.js', {
    _ksSearchPanelClose(){
        $(".ks_search_panel").removeClass("show");
    }

});