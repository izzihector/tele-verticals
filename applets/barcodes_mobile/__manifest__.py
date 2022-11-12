# -*- coding: utf-8 -*-
# Part of Tele. See LICENSE file for full copyright and licensing details.

{
    'name': 'Barcode in Mobile',
    'category': 'Hidden',
    'summary': 'Barcode scan in Mobile',
    'version': '1.0',
    'description': """ """,
    'depends': ['barcodes', 'tele_mobile'],
    'installable': True,
    'auto_install': True,
    'license': 'TEEL-1',
    'assets': {
        'web.assets_backend': [
            'barcodes_mobile/static/src/js/barcode_events.js',
            'barcodes_mobile/static/src/js/barcode_mobile_mixin.js',
            'barcodes_mobile/static/src/scss/barcode_mobile.scss',
        ],
        'web.assets_qweb': [
            'barcodes_mobile/static/src/xml/**/*',
        ],
    }
}