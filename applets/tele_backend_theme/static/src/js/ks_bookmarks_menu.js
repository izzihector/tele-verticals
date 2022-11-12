tele.define("tele_backend_theme.ks_bookmarks", function (require) {
  "use strict";

  var Widget = require("web.Widget");
  var ajax = require("web.ajax");
  var core = require("web.core");
  var _t = core._t;

  var qweb = core.qweb;

  var KsBookmarks = Widget.extend({
    template: "tele_backend_theme.bookmark_bar",
    events: _.extend({}, Widget.prototype.events, {
      "click .tele-bookmartele-menu-toggle": "_ksBookmarksToggle",
      "click .tele-save-bookmark": "_ksSaveBookmark",
      "show.bs.dropdown .ks_add_bookmark_dropdown": "_ksAddBookmark",
      "click #addBookmarkDropdown": "_ksAddBookmarkDiv",
      "click .tele-btn-inn": "_ksSizeInc",
      "click .tele-btn-dec": "_ksSizeDec",
      "click .tele-btn-reset": "_ksSizeReset",
      "click .tele-btn-zoom": "_ksZoomButton",
      "contextmenu .bookmark-link": "_ksRightClick",
    }),

    init: function () {
      var self = this;
      document.bookmark_id;
      document.bookmark_name;
      document.bookmark_position;
      this._super.apply(this, arguments);
    },

    start: function () {
      var self = this;
      ajax.jsonRpc("/render/bookmarks", "call", {}).then(function (data) {
        $(".tele-bookmark-panel").append(data);
      });
      $("body").append(
        '<div class="tele-bookmark-dropdown">' +
          '<div class="tele-bookmark-dropdown-content">' +
          '<div id="tele-bookmark-rename" class="tele-bookmark-option">Rename</div>' +
          '<div id="tele-bookmark-delete" class="tele-bookmark-option">Delete</div>' +
          '<div id="tele-bookmark-moveup" class="tele-bookmark-option">Move-Up</div>' +
          '<div id="tele-bookmark-movedown" class="tele-bookmark-option">Move-Down</div>' +
          "</div>" +
          "</div>"
      );

      $("body").append(
        '<div id="renameBookmarkDropdown" class="tele-rename-bookmark-dropdown">' +
          '<div class="tele-rename-bookmark-header pt-2 px-3">Rename</div>' +
          '<div class="tele-rename-bookmark-body py-2 px-3">' +
          '<div class="form-group m-0">' +
          '<input type="text" class="form-control" placeholder="Name" id="ks_rename_bookmark"/>' +
          "</div>" +
          "</div>" +
          '<div class="tele-rename-bookmark-footer py-2 px-3">' +
          '<button type="button" class="btn btn-primary tele-rename-bookmark">Rename</button>' +
          '<button type="button" class="btn btn-default tele-rename-cancel">Cancel</button>' +
          "</div>" +
          "</div>"
      );
      document
        .getElementById("tele-bookmark-rename")
        .addEventListener("click", self._ksBookmarkRename);
      document
        .getElementById("tele-bookmark-delete")
        .addEventListener("click", self._ksBookmarkDelete);
      document
        .getElementById("tele-bookmark-moveup")
        .addEventListener("click", self._ksBookmarkMoveup);
      document
        .getElementById("tele-bookmark-movedown")
        .addEventListener("click", self._ksBookmarkMovedown);
    },

    // Displayed using bootstrap
    _ksAddBookmark: function (ev) {
        $("#bookmark_name").val("");
        $.each($('.breadcrumb-item'), function() {
            if($(this).text().length){
                if($("#bookmark_name").val().length)
                    var val = $("#bookmark_name").val() + '/' + $(this).text();
                else
                    var val = $(this).text();
                $("#bookmark_name").val(val);
            }
        });
    },
    // To prevent closing of div
    _ksAddBookmarkDiv: function (ev) {
      if (!ev.target.classList.contains("btn")) {
        ev.stopPropagation();
        ev.preventDefault();
        $("#ks_bookmark_alert").hide("slow");
      }
    },

    _ksSaveBookmark: function (ev) {
      if ($("#bookmark_name").val() == false) {
        ev.stopPropagation();
        ev.preventDefault();
        $("#ks_bookmark_alert").show("slow");
      } else {
        var bookmark_name = $("#bookmark_name").val();
        var bookmark_url =
          "/web#" + location.href.replace(/^[^#]*#?(.*)$/, "$1");
        var bookmark_position = $(".bookmark-item").length + 1;
        $("#addBookmarkDropdown").toggleClass("show");
        ajax
          .jsonRpc("/update/bookmarks", "call", {
            create_new: "create_new",
            bookmark_name: bookmark_name,
            bookmark_url: bookmark_url,
            bookmark_position: bookmark_position,
          })
          .then(function (data) {
            $(".tele-bookmark-panel").html(data);
            $(".ks_add_bookmark_dropdown").dropdown("dispose");
          });
        $("#ks_bookmark_alert").hide("slow");
      }
    },

    _ksBookmarksToggle: function () {
      document.body.classList.toggle("ks_show_bookmark");
    },

    _ksRightClick: function (event) {
      document.bookmark_id = event.currentTarget.getAttribute("data-id");
      document.bookmark_position =
        event.currentTarget.getAttribute("data-position");
      document.bookmark_name = event.currentTarget.getAttribute("data-name");
      $("#tele-bookmark-movedown").removeClass("d-none");
      $("#tele-bookmark-moveup").removeClass("d-none");
      if (document.bookmark_position == $(".bookmark-item").length) {
        $("#tele-bookmark-movedown").addClass("d-none");
      }
      if (document.bookmark_position == "1") {
        $("#tele-bookmark-moveup").addClass("d-none");
      }
      $(".tele-bookmark-dropdown").css({
        left: event.pageX - $(".tele-bookmark-dropdown").width(),
        top: event.pageY,
        display: "block",
      });
      window.addEventListener("click", () => {
        $(".tele-bookmark-dropdown").hide();
      });
      event.preventDefault();
    },

    // --- Zoom Functionality --- //
    ksResize: function (scale_value) {
      document.querySelector(".tele-zoom-per").innerText =
        String(scale_value) + "%";

      if (document.querySelector(".o_content").children.length == 1){
        var o_content_style = document.querySelector(
            ".o_content div:last-child"
          ).style;
      }
      else{
        var o_content_style = document.querySelector(
            ".o_content"
          ).style;
      }

      o_content_style.transform = "scale(" + scale_value / 100 + ")";
      o_content_style.transformOrigin = "left top";
      if ($('body.o_rtl').length)
        o_content_style.transformOrigin = "right top";
      o_content_style.width = 100 * (100 / scale_value) + "%";
      o_content_style.flex = "0 0 " + 100 * (100 / scale_value) + "%";
    },
    // Displayed using bootstrap
    _ksZoomButton: function (ev) {
      window.addEventListener("click", () => {
        $("#zoomPanel").removeClass("show");
      });
    },
    _ksSizeInc: function (ev) {
      ev.stopPropagation();
      if ($(".o_content").length) {
        var scale_value =
          parseInt(
            document.querySelector(".tele-zoom-per").innerText.replace("%", "")
          ) + 10;
        this.ksResize(scale_value);
        $(".tele-btn-dec")[0].removeAttribute("disabled");
        if (scale_value >= 500) {
          ev.currentTarget.setAttribute("disabled", true);
        }
      }
    },
    _ksSizeDec: function (ev) {
      ev.stopPropagation();
      if ($(".o_content").length) {
        var scale_value =
          parseInt(
            document.querySelector(".tele-zoom-per").innerText.replace("%", "")
          ) - 10;
        this.ksResize(scale_value);
        $(".tele-btn-inn")[0].removeAttribute("disabled");
        if (scale_value <= 20) {
          ev.currentTarget.setAttribute("disabled", true);
        }
      }
    },
    _ksSizeReset: function (ev) {
      ev.stopPropagation();
      if ($(".o_content").length) {
        if(document.querySelector(".o_content").children.length == 1){
            document
          .querySelector(".o_content div:last-child")
          .removeAttribute("style");
        }
        else{
            document
          .querySelector(".o_content")
          .removeAttribute("style");
        }

        document.querySelector(".tele-zoom-per").innerText = "100%";
      }
    },

    // --- Bookmark --- //
    _ksBookmarkRename: function () {
      $("#ks_rename_bookmark").val(document.bookmark_name);
      $(".tele-rename-bookmark-dropdown").css({
        left: event.pageX - $(".tele-rename-bookmark-dropdown").width(),
        top: event.pageY,
        display: "block",
      });
      $(".tele-rename-cancel")[0].addEventListener("click", () => {
        $(".tele-rename-bookmark-dropdown")[0].style.display = "none";
      });

      $(".tele-rename-bookmark")[0].addEventListener("click", () => {
        var name = $("#ks_rename_bookmark").val();
        var id = document.bookmark_id;
        if (name == false) {
          this.call("notification", "notify", {
            title: _t("Can't be Empty"),
            message: _t("Please enter the Name of Bookmark."),
            sticky: false,
          });
        } else {
          $(".tele-rename-bookmark-dropdown")[0].style.display = "none";
          ajax
            .jsonRpc("/update/bookmarks", "call", {
              bookmark_name: name,
              rename: "rename",
              bookmark_id: id,
            })
            .then(function (data) {
              $(".tele-bookmark-panel").html(data);
            });
        }
      });
      event.preventDefault();
    },
    _ksBookmarkDelete: function () {
      var id = document.bookmark_id;
      ajax
        .jsonRpc("/update/bookmarks", "call", {
          delete: "delete",
          bookmark_id: id,
        })
        .then(function (data) {
          $(".tele-bookmark-panel").html(data);
        });
    },
    _ksBookmarkMoveup: function () {
      var id = document.bookmark_id;
      ajax
        .jsonRpc("/update/bookmarks", "call", {
          reposition: "move_up",
          bookmark_position: document.bookmark_position,
          bookmark_id: document.bookmark_id,
        })
        .then(function (data) {
          $(".tele-bookmark-panel").html(data);
        });
    },
    _ksBookmarkMovedown: function () {
      ajax
        .jsonRpc("/update/bookmarks", "call", {
          reposition: "move_down",
          bookmark_position: document.bookmark_position,
          bookmark_id: document.bookmark_id,
        })
        .then(function (data) {
          $(".tele-bookmark-panel").html(data);
        });
    },
  });
  return KsBookmarks;
});
