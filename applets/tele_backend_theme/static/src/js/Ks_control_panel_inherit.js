tele.define('tele_backend_theme.Ks_control_panel_inherit.js', function (require) {
    "use strict";

   const ControlPanel = require('web.ControlPanel');
   var session = require("web.session");
   const { patch } = require('web.utils');


   // Overrided to add a method which will return the flag that wether a user is using the system through mobile device or pc

   patch(ControlPanel.prototype, 'tele_backend_theme.Ks_control_panel_inherit.js', {
        mounted() {
            this._super();
            this.props['ks_breadcrumb_style'] = session['ks_breadcrumb_style'];
            // add breadcrumb class
            $('ol.ks_custom_breadcrumb').addClass(session['ks_breadcrumb_style']);
        },

        ksIsMobileDevice() {
            return this.env.device.isMobile;
        },
   });

});


