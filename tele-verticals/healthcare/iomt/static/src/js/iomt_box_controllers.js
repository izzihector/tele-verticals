tele.define('iomt.iomt_box_controllers', function (require) {
"use strict";

var KanbanController = require('web.KanbanController');
var ListController = require('web.ListController');
const {_t} = require('web.core');

var IoMTBoxControllerMixin = {
    /**
     * @override
     */
    renderButtons: function ($node) {
        this.$buttons = $('<button/>', {
            class: ['btn btn-primary rounded-sm o_iomt_box_connect_button']
        }).text(_t('CONNECT'));

        if ($node) {
            this.$buttons.appendTo($node);
        }
    },
    _onConnectIoMTBox: function () {
        this.do_action('iomt.action_add_iomt_box');
    },
};

var IoMTBoxKanbanController = KanbanController.extend(IoMTBoxControllerMixin, {
    events: _.extend({}, ListController.prototype.events, {
        'click .o_iomt_box_connect_button': '_onConnectIoMTBox',
    }),
});

var IoMTBoxListController = KanbanController.extend(IoMTBoxControllerMixin, {
    events: _.extend({}, ListController.prototype.events, {
        'click .o_iomt_box_connect_button': '_onConnectIoMTBox',
    }),
});

return {
    IoMTBoxKanbanController: IoMTBoxKanbanController,
    IoMTBoxListController: IoMTBoxListController,
};

});
