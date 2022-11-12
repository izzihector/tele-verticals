# -*- coding: utf-8 -*-
# Part of Tele. See LICENSE file for full copyright and licensing details.
{
    'name' : 'Automobile Dashboard',
    'version' : '0.1',
    'sequence': 200,
    'category': 'Human Resources/Automobile',
    'website' : 'https://www.tele.studio/app/automobile',
    'summary' : 'Dashboard for automobile',
    'description' : """
Vehicle, leasing, insurances, cost
==================================
With this module, Tele helps you managing all your vehicles, the
contracts associated to those vehicle as well as services, costs
and many other features necessary to the management of your automobile
of vehicle(s)

Main Features
-------------
* Add vehicles to your automobile
* Manage contracts for vehicles
* Reminder when a contract reach its expiration date
* Add services, odometer values for all vehicles
* Show all costs associated to a vehicle or to a type of service
* Analysis graph for costs
""",
    'depends': [
        'automobile', 'web_dashboard'
    ],
    'data': [
        'views/automobile_board_view.xml',
    ],

    'installable': True,
    'application': False,
    'auto_install': True,
    'uninstall_hook': 'uninstall_hook',
    'license': 'TEEL-1',
}
