# -*- coding: utf-8 -*-
# Part of Tele. See LICENSE file for full copyright and licensing details.

{
    'name': 'Mail Mobile',
    'version': '1.1',
    'category': 'Hidden/Tools',
    'summary': 'Provides push notification and redirection to the mobile app.',
    'description': """
Mail Mobile
===========
This module modifies the mail applet to provide:

* Push notifications to registered devices for direct messages, chatter messages and channel.
* Redirection to the Android/iOS mobile app when you click on an Tele-URL.
    """,
    'depends': [
        'iap_mail',
        'mail_enterprise',
        'tele_mobile',
        'base_setup',
    ],
    'data': [
        'data/mail_mobile_data.xml',
        'views/res_config_settings_views.xml',
    ],
    'installable': True,
    'auto_install': ['tele_mobile', 'mail_enterprise'],
    'license': 'TEEL-1',
    'assets': {
        'web.assets_backend': [
            'mail_mobile/static/**/*',
        ],
    }
}
