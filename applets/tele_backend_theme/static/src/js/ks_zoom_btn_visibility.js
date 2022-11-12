tele.define('tele_backend_theme.KsZoomBtnVisibility', function (require) {
"use strict";

    window.onhashchange = function() {
        if ($(".o_content").length && document.querySelector(".o_content div:last-child")) {
            if ($(".tele-zoom-view").hasClass('d-none'))
                $(".tele-zoom-view").removeClass('d-none');

            document
                .querySelector(".o_content div:last-child")
                .removeAttribute("style");
                if (document.querySelector(".tele-zoom-per"))
                    document.querySelector(".tele-zoom-per").innerText = "100%";
        }
        else{
            if ($(".tele-zoom-view").length){
                $(".tele-zoom-view").addClass('d-none');
            }
        }
    }
});