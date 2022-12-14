from tele import models, fields, api, _


class KsIrConfig(models.Model):
    _inherit = 'ir.config_parameter'

    ks_enterprise_apps = fields.Boolean(string="Hide Enterprise Apps", default=False)
    ks_tele_referral = fields.Boolean(string="Show Tele Referral", default=False)
    ks_login_design = fields.Selection(string="", selection=[('default', 'Default'), ('login_style_1', 'Style 1')],
                                       default='default')
    ks_login_background = fields.Binary(string="Login Background Image")