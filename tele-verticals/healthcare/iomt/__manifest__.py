# -*- coding: utf-8 -*-
# Part of Tele. See LICENSE file for full copyright and licensing details.


{
    'name': 'Internet of Things',
    'category': 'Internet of Things (IoMT)',
    'sequence': 250,
    'summary': 'Basic models and helpers to support Internet of Things.',
    'description': """
This module provides management of your IoMT Boxes inside Tele.
""",
    'depends': ['mail','web'],
    'data': [
        'wizard/add_iomt_box_views.xml',
        'security/ir.model.access.csv',
        'security/iomt_security.xml',
        'views/iomt_views.xml',
    ],
    'demo': [
        'data/iomt_demo.xml'
    ],
    'installable': True,
    'application': True,
    'auto_install': False,
    'license': 'TEEL-1',
    'assets': {
        'web.assets_backend': [
            'iomt/static/src/**/*',
        ],
    }
}
