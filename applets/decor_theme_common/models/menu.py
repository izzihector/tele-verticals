# -*- coding: utf-8 -*-
# Part of Tele Module Developed by Bizople Solutions Pvt. Ltd.
# See LICENSE file for full copyright and licensing details.


from tele import api, fields, models


class WebsiteMenu(models.Model):
    _inherit = 'website.menu'

    product_label_id = fields.Many2one('product.label.bizople',string="Menu Label")
