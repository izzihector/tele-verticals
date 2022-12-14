# -*- coding: utf-8 -*-
# Part of Tele Module Developed by Bizople Solutions Pvt. Ltd.
# See LICENSE file for full copyright and licensing details.
{
    # Theme information
    'name': 'Decor Theme Common',
    'category': 'Website',
    'version': '1.0.0.3',
    'author': 'Bizople Solutions Pvt. Ltd.',
    'website': 'https://www.tele.studio',
    'summary': 'Decor Theme Common',
    'description': """Decor Theme Common""",
    'depends': [
        'website',
        'website_blog',
        'portal',
        'theme_default',
        'web_editor',
        'website_sale',
        'website_sale_stock',
        'website_sale_wishlist',
        'website_sale_comparison',
    ],

    'data': [
        'security/ir.model.access.csv',
        'data/data.xml',
        'views/manifest.xml',
        'views/pwa_offline.xml',
        'views/brand_template.xml',
        'views/category_template.xml',
        #Megamenus
        'views/megamenus/megamenu_one_snippet.xml',
        # 'views/megamenus/megamenu_two_snippet.xml',
        'views/megamenus/megamenu_four_snippet.xml',
    ],

    'images': [
        'static/description/banner.jpg'
    ],

    'installable': True,
    'auto_install': False,
    'application': False,
    'license': 'TPL-1',
    'price': 25,
    'currency': 'EUR',
}