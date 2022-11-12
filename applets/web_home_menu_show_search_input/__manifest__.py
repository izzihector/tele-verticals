# -*- coding: utf-8 -*-
{
    'name': "WebHomeMenuShowSearch",

    'summary': """
        
        Actively display the search box in the main menu
        
        """,

    'description': """
Actively display the search box in the main menu
    """,
    'category': 'Extra Tools',
    'version': '1.0.1.1.0',
    'license': 'TPL-1',

    'depends': ['base'],
    'assets': {
        'web.assets_backend': [
            'web_home_menu_show_search_input/static/src/js/home_menu_search.js',
        ],
    },
    'application': False,
    'auto_install': True,
}
