/** @tele-module */
import { registry } from "@web/core/registry";
import DeviceProxy from "iomt.DeviceProxy";
import { ComponentAdapter } from "web.OwlCompatibility";
const { Component } = owl;


function onIoMTActionResult(data, env) {
    if (data.result === true) {
        env.services.notification.add(env._t("Successfully sent to printer!"));
    } else {
        env.services.notification.add(env._t("Check if the printer is still connected"), {
            title: env._t("Connection to printer failed"),
            type: "danger",
        });
    }
}

function onValueChange(data, env) {
    if (data.status) {
        env.services.notification.add(env._t("Printer ") + data.status);
    }
}

async function iomtReportActionHandler(action, options, env) {
    if (action.device_id) {
        // Call new route that sends you report to send to printer
        const orm = env.services.orm;
        action.data = action.data || {};
        action.data["device_id"] = action.device_id;
        const args = [action.id, action.context.active_ids, action.data];
        const [ip, identifier, document] = await orm.call("ir.actions.report", "iomt_render", args);
        const adapterParent = new ComponentAdapter(null, { Component }); // For trigger_up and service calls
        const iomtDevice = new DeviceProxy(adapterParent, { iomt_ip: ip, identifier });
        iomtDevice.add_listener(data => onValueChange(data, env));
        iomtDevice.action({ document })
            .then(data => onIoMTActionResult(data, env))
            .guardedCatch(() => iomtDevice.call("iomt_longpolling", "_doWarnFail", ip));
        return true;
    }
}

registry
    .category("ir.actions.report handlers")
    .add("iomt_report_action_handler", iomtReportActionHandler);
