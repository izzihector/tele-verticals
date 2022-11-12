/** @tele-module */

var { SearchBar } = require("@web/search/search_bar/search_bar");
import { patch } from 'web.utils';
import Dialog from 'web.Dialog';
import core from 'web.core';
const { useListener } = require("web.custom_hooks");
const _t = core._t;

patch(SearchBar.prototype, 'tele_backend_theme/static/src/js/Ks_searchbar.js', {

    _ksSearchFragmentOpen() {
        $(".tele-phone-filter-modal").addClass("show");
        $('div.tele-item-search-box').removeClass("d-none");
    },

    _ksSearchButtonOpen() {
        $(".ks_search_responsive").addClass("show");
        // Hide breadcrumb text and search icon.
        $(".o_cp_top_left .breadcrumb-item").addClass("d-none");
        $(".o_cp_top_right .tele-phone-sr-btn").addClass("d-none");
    },

    _ksSearchButtonClose() {
        $(".ks_search_responsive").removeClass("show");
        $(".o_cp_top_left .breadcrumb-item").removeClass("d-none");
        $(".o_cp_top_right .tele-phone-sr-btn").removeClass("d-none");
    },


});


