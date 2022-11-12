/** @tele-module */

import { registry } from "@web/core/registry";
import mobile from "tele_mobile.core";

function mobileErrorHandler(env, error, originalError) {
    if (mobile.methods.crashManager) {
        error.originalError = originalError;
        mobile.methods.crashManager(error);
    }
}
registry
    .category("error_handlers")
    .add("tele_mobile.errorHandler", mobileErrorHandler, { sequence: 3 });
