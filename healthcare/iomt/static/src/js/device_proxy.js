tele.define('iomt.DeviceProxy', function (require) {
'use strict';

var core = require('web.core');
const ServicesMixin = require('web.ServicesMixin');
const { EventDispatcherMixin } = require('web.mixins');


/**
 * Frontend interface to iomt devices
 */
var DeviceProxy = core.Class.extend(EventDispatcherMixin, ServicesMixin, {
    /**
     * @param {Object} iomt_device - Representation of an iomt device
     * @param {string} iomt_device.iomt_ip - The ip address of the iomt box the device is connected to
     * @param {string} iomt_device.identifier - The device's unique identifier
     */
    init: function(parent, iomt_device) {
        EventDispatcherMixin.init.call(this, arguments);
        this.setParent(parent);
        this._id = _.uniqueId('listener-');
        this._iomt_ip = iomt_device.iomt_ip;
        this._identifier = iomt_device.identifier;
        this.manual_measurement = iomt_device.manual_measurement;
    },

    /**
     * Call actions on the device
     * @param {Object} data
     * @returns {Promise}
     */
    action: function(data) {
        return this.call('iomt_longpolling', 'action', this._iomt_ip, this._identifier, data);
    },

    /**
     * Add `callback` to the listeners callbacks list it gets called everytime the device's value is updated.
     * @param {function} callback
     * @returns {Promise}
     */
    add_listener: function(callback) {
        return this.call('iomt_longpolling', 'addListener', this._iomt_ip, [this._identifier, ], this._id, callback);
    },
    /**
     * Stop listening the device
     */
    remove_listener: function() {
        return this.call('iomt_longpolling', 'removeListener', this._iomt_ip, this._identifier, this._id);
    },
});

return DeviceProxy;

});
