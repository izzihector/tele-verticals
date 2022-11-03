tele.define('iomt.widgets', function (require) {
'use strict';

var core = require('web.core');
var Widget = require('web.Widget');
var field_registry = require('web.field_registry');
var widget_registry = require('web.widget_registry');
var Dialog = require('web.Dialog');
var basic_fields = require('web.basic_fields');
var DeviceProxy = require('iomt.DeviceProxy');
var IoMTConnectionMixin = require('iomt.mixins').IoMTConnectionMixin;

var _t = core._t;

var IoMTValueFieldMixin = {
    /**
     * @returns {Promise}
     */
    willStart: function() {
        this.iomt_device = null; // the attribute to which the device proxy created with ``_getDeviceInfo`` will be assigned.
        return Promise.all([this._super(), this._getDeviceInfo()]);
    },

    start: function() {
        this._super.apply(this, arguments);
        this._startListening();
    },

    destroy: function () {
        this._stopListening();
        this._super.apply(this, arguments);
    },

    /**
     * To implement
     * @abstract
     * @private
     */
    _getDeviceInfo: function() {
        var identifier = this.recordData[this.attrs.options.identifier];
        var iomt_ip = this.recordData[this.attrs.options.ip_field];
        if (identifier) {
            this.iomt_device = new DeviceProxy(this, { iomt_ip: iomt_ip, identifier: identifier });
        }
        return Promise.resolve();
    },

    /**
     * To implement
     * @abstract
     * @private
     */
    _onValueChange: function (data){},

    /**
     * @private
     */
    _startListening: function () {
        if (this.iomt_device) {
            this.iomt_device.add_listener(this._onValueChange.bind(this));
        }
    },

    /**
     * @private
     */
    _stopListening: function () {
        if (this.iomt_device) {
            this.iomt_device.remove_listener();
        }
    },

    /**
     * After a request to make action on device and this call don't return true in the result
     * this means that the IoMT Box can't connect to device
     *
     * @param {Object} data.result
     */
    _onIoMTActionResult: function (data) {
        if (data.result !== true) {
            var $content = $('<p/>').text(_t('Please check if the device is still connected.'));
            var dialog = new Dialog(this, {
                title: _t('Connection to device failed'),
                $content: $content,
            });
            dialog.open();
        }
    },

    /**
     * After a request to make action on device and this call fail
     * this means that the customer browser can't connect to IoMT Box
     */
    _onIoMTActionFail: function () {
        // Display the generic warning message when the connection to the IoMT box failed.
        this.call('iomt_longpolling', '_doWarnFail', this.ip);
    },
};

var IoMTRealTimeValue = basic_fields.InputField.extend(IoMTValueFieldMixin, {
    /**
     * @private
     */
    _onValueChange: function (data){
        var self = this;
        this._setValue(data.value.toString())
            .then(function() {
                if (!self.isDestroyed()) {
                    self._render();
                }
            });
    },
});

field_registry.add('iomt_realtime_value', IoMTRealTimeValue);

var IoMTDeviceValueDisplay = Widget.extend(IoMTValueFieldMixin, {
    /**
     * @override
     */
    init: function (parent, params) {
        this._super.apply(this, arguments);
        this.identifier = params.data.identifier;
        this.iomt_ip = params.data.iomt_ip;
    },
    /**
     * @override
     * @private
     */
    _getDeviceInfo: function() {
        this.iomt_device = new DeviceProxy(this, { identifier: this.identifier, iomt_ip:this.iomt_ip });
        return Promise.resolve();
    },

    /**
     * @override
     * @private
     */
    _onValueChange: function (data){
        if (this.$el) {
            this.$el.text(data.value);
        }
    },
});

widget_registry.add('iomt_device_value_display', IoMTDeviceValueDisplay);

var IoMTDownloadLogsButton = Widget.extend(IoMTConnectionMixin, {
    tagName: 'button',
    className: 'o_iomt_logs_button btn btn-primary rounded-sm',
    events: {
        'click': '_downloadLogs',
    },

    /**
     * @override
     */
    init: function (parent, params) {
        this._ip_url = params.data.ip_url;
        return this._super.apply(this, arguments);
    },

    /**
     * @override
     */
    start: function () {
        this._super.apply(this, arguments);
        this.$el.text(_t('Download Logs'));
    },

    //--------------------------------------------------------------------------
    // Handlers
    //--------------------------------------------------------------------------

    /**
     * @param {MouseEvent} ev
     * @private
     */
    _downloadLogs: function (ev) {
        var self = this;
        ev.stopPropagation();
        $.ajax({
            url: this._ip_url + '/hw_proxy/hello',
            type: 'GET',
            success: function() {
                window.location = self._ip_url + '/hw_drivers/download_logs';
            },
            error: this._doWarnFail,
        });
    },
});

widget_registry.add('iomt_download_logs', IoMTDownloadLogsButton);

return {
    IoMTValueFieldMixin: IoMTValueFieldMixin,
    IoMTRealTimeValue: IoMTRealTimeValue,
    IoMTDeviceValueDisplay: IoMTDeviceValueDisplay,
    IoMTDownloadLogsButton: IoMTDownloadLogsButton,
};

});
