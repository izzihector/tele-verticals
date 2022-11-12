# -*- coding: utf-8 -*-
# Part of Tele. See LICENSE file for full copyright and licensing details.

import tele.tests
from tele.tools import mute_logger


@tele.tests.common.tagged('post_install', '-at_install')
class TestMedia(tele.tests.HttpCase):

    @mute_logger('tele.applets.http_routing.models.ir_http', 'tele.http')
    def test_01_replace_media(self):
        GIF = b"R0lGODdhAQABAIAAAP///////ywAAAAAAQABAAACAkQBADs="
        self.env['ir.attachment'].create({
            'name': 'sample.gif',
            'public': True,
            'mimetype': 'image/gif',
            'datas': GIF,
        })
        self.start_tour("/", 'test_replace_media', login="admin")

    def test_02_image_link(self):
        self.start_tour("/", 'test_image_link', login="admin")
