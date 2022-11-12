# -*- coding: utf-8 -*-
# Part of Tele. See LICENSE file for full copyright and licensing details.

import tele.tests
from tele.tools import mute_logger


@tele.tests.common.tagged('post_install', '-at_install')
class TestCustomSnippet(tele.tests.HttpCase):

    @mute_logger('tele.applets.http_routing.models.ir_http', 'tele.http')
    def test_01_run_tour(self):
        self.start_tour("/", 'test_custom_snippet', login="admin")
