# -*- coding: utf-8 -*-

from tele import api, fields, models, _


class KsIrUiMenu(models.Model):
    _name = 'ks.fav.menu'
    _description = 'Backend Theme Favorite Menu'

    ks_fav_app = fields.Boolean(string='Fav App')
    ks_users = fields.Many2one(comodel_name='res.users')
    ks_ir_ui_menu = fields.Many2one(comodel_name='ir.ui.menu')
