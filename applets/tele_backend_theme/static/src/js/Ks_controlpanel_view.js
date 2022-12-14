/** @tele-module */

import { ControlPanel } from "@web/search/control_panel/control_panel";
import { patch } from 'web.utils';
import Dialog from 'web.Dialog';
import core from 'web.core';
const { useListener } = require("web.custom_hooks");
const _t = core._t;

patch(ControlPanel.prototype, 'tele_backend_theme/static/src/js/Ks_controlpanel_view.js', {
    setup() {
      this._super();
      useListener( "click", ".reload_view", this._KsReloadView );
      },

    _KsReloadView: function() {
        location.reload(); //bug
    },

     _ksActiveSearchFilter() {
        var ks_all_sections = this.searchMenus;
        var ks_result = [];
        if (ks_all_sections) {
            ks_all_sections.forEach((element,index)=>{
                if (element.type == "filter") {
                    var ks_display = false
                    element.values.forEach((values,index)=>{
                        if (values.checked) {
                            if (!ks_display)
                                ks_display = values.display_name;
                            else
                                ks_display += ', ' + values.display_name;
                        }
                    }
                    );
                    if (ks_display) {
                        ks_result.push({
                            icon: element.icon,
                            display_name: ks_display,
                        });
                    }
                }
                if (element.activeValueId) {
                    let ks_active_id = element.activeValueId;
                    element.values.forEach((values,index)=>{
                        if (values.id == ks_active_id) {
                            ks_result.push({
                                icon: element.icon,
                                display_name: values.display_name,
                            });
                        }
                    }
                    );
                }
            }
            );
        }
        return ks_result;
    },

    _ksSearchFragmentOpen() {
        $(".tele-phone-filter-modal").addClass("show");
        $('div.tele-item-search-box').removeClass("d-none");
    },

    _ksSearchFragmentClose() {
        $(".tele-phone-filter-modal").removeClass("show");
        $('div.tele-item-search-box').addClass("d-none");
    },

    _ksSearchReset() {
        this.env.searchModel.clearQuery();
    },

    _ksViewSwitcher(ev) {
        $(".o_cp_switch_buttons").removeClass("show");
        this.trigger("switch-view", {
            view_type: $(ev.currentTarget).attr("ksView"),
        });
    },

    _ksSearchPanelOpen() {
           $('.o_search_panel').toggle();
           if($('.o_search_panel').is(":visible")){
                $('button.tele-phone-category-btn i').removeClass('fa-filter');
                $('button.tele-phone-category-btn i').addClass('fa-arrow-left');
            }else{
            $('button.tele-phone-category-btn i').removeClass('fa-arrow-left');
                $('button.tele-phone-category-btn i').addClass('fa-filter');
                }
          // $('.o_search_panel').toggleClass('');

      //  $(".ks_search_panel").addClass("show");
//        $(".ks_search_panel").removeClass("none");
    },

    _ksCheckMobileView() {
        if (screen.width > 1024)
            return false;
        return true;
    },

    _ksCheckSearchPanel() {
        var ks_search_data = this.searchMenus;
        if (ks_search_data.length>0)
            return true;
        return false;
//        var a =this.__proto__.__proto__._ksCheckSearchPanel;
//        console.log(a.ks_search_data);
    },

    _ksSearchButtonOpen() {
        $(".ks_search_responsive").addClass("show");
        // Hide breadcrumb text and search icon.
        $(".o_cp_top_left .breadcrumb-item").addClass("d-none");
        $(".o_cp_top_right .tele-phone-sr-btn").addClass("d-none");
    },

    _ksSearchButtonClose() {
        $(".ks_search_responsive").removeClass("show");
        $(".o_cp_top_left .breadcrumb-item").removeClass("d-none");
        $(".o_cp_top_right .tele-phone-sr-btn").removeClass("d-none");
    },

    _ksMobileViewSwitcher() {
        $(".o_cp_switch_buttons").toggleClass("show");
    },

    _onksFullScreen(ev) {
        var ks_window = document.documentElement;
        var ks_elem_class = ev.currentTarget.classList;
        if (window.innerHeight == screen.height) {
            if ($("button.ks_fullscreen").hasClass("fa-expand")) {
                alert(_t("Browser is in fullscreen mode."));
            } else {
                try {
                    ks_elem_class.remove("fa-compress");
                    ks_elem_class.add("fa-expand");
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitExitFullscreen) {
                        /* Safari */
                        document.webkitExitFullscreen();
                    } else if (document.msExitFullscreen) {
                        /* IE11 */
                        document.msExitFullscreen();
                    }
                } catch (err) {
                    alert(_t("Unable to perform this operation."));
                }
            }
        } else {
            ks_elem_class.remove("fa-expand");
            ks_elem_class.add("fa-compress");
            if (ks_window.requestFullscreen) {
                ks_window.requestFullscreen();
            } else if (ks_window.webkitRequestFullscreen) {
                /* Safari */
                ks_window.webkitRequestFullscreen();
            } else if (ks_window.msRequestFullscreen) {
                /* IE11 */
                ks_window.msRequestFullscreen();
            }
        }

        document.addEventListener("fullscreenchange", (event)=>{
            if (document.fullscreenElement) {
                $("button.ks_fullscreen").removeClass("fa-expand");
                $("button.ks_fullscreen").addClass("fa-compress");
            } else {
                $("button.ks_fullscreen").removeClass("fa-compress");
                $("button.ks_fullscreen").addClass("fa-expand");
            }
        });
    },

});


