# -*- coding: utf-8 -*-
# Part of Tele. See LICENSE file for full copyright and licensing details.

from tele import models, fields

class AutomobileVehicle(models.Model):
    _inherit = 'automobile.vehicle'

    rate_ids = fields.One2many('automobile.disallowed.expenses.rate', 'vehicle_id', string='Disallowed Expenses Rate')


class AutomobileDisallowedExpensesRate(models.Model):
    _name = 'automobile.disallowed.expenses.rate'
    _description = 'Vehicle Disallowed Expenses Rate'
    _order = 'date_from desc'

    rate = fields.Float(string='%', required=True)
    date_from = fields.Date(string='Start Date', required=True)
    vehicle_id = fields.Many2one('automobile.vehicle', string='Vehicle', required=True)
    company_id = fields.Many2one('res.company', string='Company', related='vehicle_id.company_id', readonly=True)
