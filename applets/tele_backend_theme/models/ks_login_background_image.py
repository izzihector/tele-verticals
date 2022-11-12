# -*- coding: utf-8 -*-

from tele import models, fields, api, _
from tele.http import request
import logging

_logger = logging.getLogger(__name__)


class KsLoginBackgroundImage(models.Model):
    _name = 'ks.login.background.image'
    _description = 'Backend Theme Login Background Image'

    ks_image = fields.Binary(string="Image")
    ks_active = fields.Boolean(string="Background selected")
