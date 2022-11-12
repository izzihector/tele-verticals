/** @tele-module **/

import { registry } from "@web/core/registry";

import mobile from "tele_mobile.core";
import { shortcutItem, switchAccountItem } from "./user_menu_items";

const serviceRegistry = registry.category("services");
const userMenuRegistry = registry.category("user_menuitems");

const mobileService = {
    start() {
        if (mobile.methods.addHomeShortcut) {
            userMenuRegistry.add("tele_mobile.shortcut", shortcutItem);
        }

        if (mobile.methods.switchAccount) {
            // remove "Log Out" and "My Tele.Studio Account"
            userMenuRegistry.remove('log_out');
            userMenuRegistry.remove('tele_account');

            userMenuRegistry.add("tele_mobile.switch", switchAccountItem);
        }
    },
};
serviceRegistry.add("mobile", mobileService);
