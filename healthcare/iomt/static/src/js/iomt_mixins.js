tele.define('iomt.mixins', function (require) {
'use strict';

var Dialog = require('web.Dialog');
var core = require('web.core');

var _t = core._t;

var IoMTConnectionMixin = {
    _doWarnFail: function (url){
        var $content = $('<div/>')
            .append($('<p/>').text(_t('Tele cannot reach the IoMT Box.')))
            .append($('<span/>').text(_t('Please check if the IoMT Box is still connected.')))
            .append($('<p/>').text(_t('If you are on a secure server (HTTPS) check if you accepted the certificate:')))
            .append($('<p/>').html(_.str.sprintf('<a href="https://%s" target="_blank"><i class=""fa fa-external-link"/>' + _t('Click here to open your IoMT Homepage') + '</a>', url)))
            .append($('<li/>').text(_t('Please accept the certificate of your IoMT Box (procedure depends on your browser) :')))
            .append($('<li/>').text(_t('Click on Advanced/Show Details/Details/More information')))
            .append($('<li/>').text(_t('Click on Proceed to .../Add Exception/Visit this website/Go on to the webpage')))
            .append($('<li/>').text(_t('Firefox only : Click on Confirm Security Exception')))
            .append($('<li/>').text(_t('Close this window and try again')));

        var dialog = new Dialog(this, {
            title: _t('Connection to IoMT Box failed'),
            $content: $content,
            buttons: [
                {
                    text: _t('Close'),
                    classes: 'btn-secondary o_form_button_cancel',
                    close: true,
                }
            ],
        });

        dialog.open();
    },
};

return {
    IoMTConnectionMixin: IoMTConnectionMixin,
};

});
