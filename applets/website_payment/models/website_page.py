# -*- coding: utf-8 -*-
# Part of Tele. See LICENSE file for full copyright and licensing details.

from tele import models


class Page(models.Model):
    _inherit = 'website.page'

    @classmethod
    def _get_cached_blacklist(cls):
        return super()._get_cached_blacklist() + (
            # Contains a form with a dynamically added CSRF token
            'data-snippet="s_donation"',
        )
