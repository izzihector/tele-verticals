# -*- coding: utf-8 -*-

from tele import models, fields, api, _
from tele.http import request
import logging

_logger = logging.getLogger(__name__)


class KsLoginBackgroundColor(models.Model):
    _name = 'ks.login.background.color'
    _description = 'Login Background Color'

    ks_color = fields.Char(string="Color")
    ks_active = fields.Boolean(string="Background selected")
