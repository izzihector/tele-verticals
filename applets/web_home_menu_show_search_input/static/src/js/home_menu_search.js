/** @tele-module **/
import {HomeMenu} from "@tele_enterprise/webclient/home_menu/home_menu";
import {patch} from "@web/core/utils/patch";

const {session} = require('@web/session');
const {hooks} = owl;
const {useState} = hooks;

patch(HomeMenu.prototype, "tele_enterprise.InheritHomeMenu", {
    setup() {
        this._super();
        this.state = useState({
            isSearching: true,
        });
    }
});