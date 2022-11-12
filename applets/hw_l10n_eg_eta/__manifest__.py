# -*- coding: utf-8 -*-
# Part of Tele. See LICENSE file for full copyright and licensing details.

{
    'name': 'Egypt ETA Hardware Driver',
    'category': 'Accounting/Accounting',
    'website': 'https://www.tele.studio',
    'summary': 'Egypt ETA Hardware Driver',
    'description': """
Egypt ETA Hardware Driver
=======================

This module allows Tele to digitally sign invoices using an USB key approved by the egyptian government

Special thanks to Plementus <info@plementus.com> for their help in developing this module.

Requirements per system
-----------------------

Windows:
    - eps2003csp11.dll
    
Linux/macOS:
    - OpenSC

""",
    'external_dependencies': {
        'python': ['PyKCS11'],
    },
    'installable': False,
    'license': 'LGPL-3',
}
