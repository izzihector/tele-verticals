# -*- coding: utf-8 -*-
# Part of Tele. See LICENSE file for full copyright and licensing details.

{
    'name': 'Point of Sale enterprise',
    'category': 'Sales/Point of Sale',
    'summary': 'Advanced features for PoS',
    'description': """
Advanced features for the PoS like better views 
for IoT Box config.   
""",
    'data': [
        'views/pos_config_view.xml',
    ],
    'depends': ['tele_enterprise', 'point_of_sale'],
    'auto_install': True,
    'license': 'TEEL-1',
}
