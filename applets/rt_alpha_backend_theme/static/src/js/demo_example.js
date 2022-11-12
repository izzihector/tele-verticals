tele.define('rt_alpha_backend_theme.name_of_fetures', function (require) {
    'use strict';
    var core = require('web.core');
    var ajax = require('web.ajax');
    var qweb = core.qweb;
    ajax.loadXML('/rt_alpha_backend_theme/views/alpha_theme_setting.xml', qweb);
    });