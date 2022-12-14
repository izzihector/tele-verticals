# -*- coding: utf-8 -*-
# Part of Tele. See LICENSE file for full copyright and licensing details.

{
    'name': "Timesheets And Timeoff",
    'summary': "Link between timesheet and time off",
    'description': """
This module prevents taking time offs into account when computing employee overtime.
    """,

    'category': 'Services/Timesheets',
    'version': '1.0',

    'depends': ['project_timesheet_holidays', 'timesheet_grid'],
    'auto_install': True,
    'application': False,
    'license': 'TEEL-1',
}
