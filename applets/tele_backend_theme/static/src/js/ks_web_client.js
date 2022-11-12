tele.define('tele_backend_theme.KsWebClient', function (require) {
"use strict";

    const WebClientEnterprise = require('@tele_enterprise/webclient/webclient');
    const session = require('web.session');
    const { patch } = require('web.utils');
    patch(WebClientEnterprise.WebClientEnterprise.prototype, "WebClientEnterprise", {
        _updateClassList() {
            this._super()
            if(this.hm.hasHomeMenu){
                $('body').removeClass('ks_menubar_autohide')
                $('body').removeClass('brightness')
                if ($("html").attr("data-drawer-font-style") == "dark")
                      $("html").attr("data-color-mode", "tele-dark");
                    else if ($("html").attr("data-drawer-font-style") == "light")
                      $("html").attr("data-color-mode", "tele-light");

                // Manage App drawer theme color.
                document.body.style.removeProperty("--body-background");
                document.body.style.removeProperty("--nav-link-color");
                document.body.style.removeProperty("--tele-over-link");

                $(".o_menu_systray").removeClass("ks_color_theme_dark_header");
                if(document.querySelector('.tele-menu-systray')){
                    document.querySelector('.tele-menu-systray').classList.remove('ks_color_theme_dark_header')
                }
                $('.o_main_navbar button.phone-menu-btn').removeClass("ks_color_theme_dark_header");
                $('.ks_left_sidebar_panel .ks_app_sidebar .inner-sidebar button.phone-menu-btn').removeClass("ks_color_theme_dark_header");
            }
            else{
                 $("html").attr("data-color-mode", session.ks_current_color_mode);
                 $('body').addClass('brightness')
                 if(session.tele_backend_theme_data && session.tele_backend_theme_data.ks_menubar_autohide)
                  $('body').addClass('ks_menubar_autohide')
                if (session.ks_current_color_mode == "tele-light") {
                  // Apply Color theme back.
                  document.body.style.setProperty(
                    "--body-background",
                    session.ks_color_theme["body-background"]
                  );

                  document.body.style.setProperty(
                    "--nav-link-color",
                    session.ks_color_theme["nav-link-color"]
                  );

                  document.body.style.setProperty(
                    "--tele-over-link",
                    session.ks_color_theme["tele-over-link"]
                  );
                }

                if (session.ks_color_theme.ks_header_icon_clr) {
                  $(".o_menu_systray").addClass("ks_color_theme_dark_header");
                  $('.o_main_navbar button.phone-menu-btn').addClass("ks_color_theme_dark_header");
                  $('.ks_left_sidebar_panel .ks_app_sidebar .inner-sidebar button.phone-menu-btn').addClass("ks_color_theme_dark_header");
                }
            }

        }
    })
});