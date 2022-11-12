tele.define('iomt.iomt_box_views', function (require) {
"use strict";

var IoMTBoxControllers = require('iomt.iomt_box_controllers');
var KanbanView = require('web.KanbanView');
var ListView = require('web.ListView');
var view_registry = require('web.view_registry');

var IoMTBoxKanbanView = KanbanView.extend({
    config: _.extend({}, KanbanView.prototype.config, {
        Controller: IoMTBoxControllers.IoMTBoxKanbanController,
    }),
});

view_registry.add('box_kanban_view', IoMTBoxKanbanView);

var IoMTBoxListView = ListView.extend({
    config: _.extend({}, ListView.prototype.config, {
        Controller: IoMTBoxControllers.IoMTBoxListController,
    }),
});

view_registry.add('box_list_view', IoMTBoxListView);

});
