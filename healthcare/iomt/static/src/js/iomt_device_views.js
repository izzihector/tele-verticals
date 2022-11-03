tele.define('iomt.iomt_device_views', function (require) {
"use strict";

var IoMTDeviceControllers = require('iomt.iomt_device_controllers');
var FormView = require('web.FormView');
var viewRegistry = require('web.view_registry');

var IoMTDeviceFormView = FormView.extend({
    config: _.extend({}, FormView.prototype.config, {
        Controller: IoMTDeviceControllers.IoMTDeviceFormController,
    }),
});

viewRegistry.add('iomt_device_form', IoMTDeviceFormView);

return {
    IoMTDeviceFormView: IoMTDeviceFormView,
};

});
