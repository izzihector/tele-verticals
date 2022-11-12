tele.define("tele_mobile.Dialog", function (require) {
    "use strict";

    var Dialog = require("web.Dialog");
    var mobileMixins = require("tele_mobile.mixins");

    Dialog.include(
        _.extend({}, mobileMixins.BackButtonEventMixin, {
            //--------------------------------------------------------------------------
            // Handlers
            //--------------------------------------------------------------------------

            /**
             * Close the current dialog on 'backbutton' event.
             *
             * @private
             * @override
             * @param {Event} ev
             */
            _onBackButton: function () {
                this.close();
            },
        })
    );
});

tele.define("tele_mobile.OwlDialog", function (require) {
    "use strict";

    const OwlDialog = require("web.OwlDialog");
    const { useBackButton } = require("tele_mobile.hooks");
    const { patch } = require("web.utils");

    patch(OwlDialog.prototype, "tele_mobile", {
        setup() {
            this._super(...arguments);
            useBackButton(this._onBackButton.bind(this));
        },

        //---------------------------------------------------------------------
        // Handlers
        //---------------------------------------------------------------------

        /**
         * Close dialog on back-button
         * @private
         */
        _onBackButton() {
            this._close();
        },
    });
});

tele.define("tele_mobile.Popover", function (require) {
    "use strict";

    const Popover = require("web.Popover");
    const { useBackButton } = require("tele_mobile.hooks");
    const { patch } = require("web.utils");

    patch(Popover.prototype, "tele_mobile", {
        setup() {
            this._super(...arguments);
            useBackButton(this._onBackButton.bind(this), () => this.state.displayed);
        },

        //---------------------------------------------------------------------
        // Handlers
        //---------------------------------------------------------------------

        /**
         * Close popover on back-button
         * @private
         */
        _onBackButton() {
            this._close();
        },
    });
});

tele.define("tele_mobile.ControlPanel", function (require) {
    "use strict";

    const { device } = require("web.config");

    if (!device.isMobile) {
        return;
    }

    const ControlPanel = require("web.ControlPanel");
    const { useBackButton } = require("tele_mobile.hooks");
    const { patch } = require("web.utils");

    patch(ControlPanel.prototype, "tele_mobile", {
        setup() {
            this._super(...arguments);
            useBackButton(this._onBackButton.bind(this), () => this.state.showMobileSearch);
        },

        //---------------------------------------------------------------------
        // Handlers
        //---------------------------------------------------------------------

        /**
         * close mobile search on back-button
         * @private
         */
        _onBackButton() {
            this._resetSearchState();
        },
    });
});