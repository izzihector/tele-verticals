# -*- coding: utf-8 -*-

{
    'name': "Delivery Barcode Scanning",
    'summary': "Add barcode scanning facilities to Delivery.",
    'description': """
This module enables the management of deliveries through the use of barcode scanning.
    """,
    'category': 'Inventory/Delivery',
    'version': '1.0',
    'depends': ['stock_barcode', 'delivery'],
    'data': [
        'views/stock_picking_views.xml',
        ],
    'installable': True,
    'auto_install': True,
    'license': 'TEEL-1',
    'assets': {
        'web.assets_backend': [
            'delivery_barcode/static/**/*',
        ],
    }
}
