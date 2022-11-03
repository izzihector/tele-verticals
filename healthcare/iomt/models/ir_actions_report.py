# -*- coding: utf-8 -*-
# Part of Tele. See LICENSE file for full copyright and licensing details.

import base64

from tele import fields, models


class IrActionReport(models.Model):
    _inherit = 'ir.actions.report'

    device_id = fields.Many2one('iomt.device', string='IoMT Device', domain="[('type', '=', 'printer')]",
                                help='When setting a device here, the report will be printed through this device on the IoMT Box')

    def iomt_render(self, res_ids, data=None):
        if self.mapped('device_id'):
            device = self.mapped('device_id')[0]
        else:
            device = self.env['iomt.device'].browse(data['device_id'])
        datas = self._render(res_ids, data=data)
        data_bytes = datas[0]
        data_base64 = base64.b64encode(data_bytes)
        return device.iomt_id.ip, device.identifier, data_base64

    def report_action(self, docids, data=None, config=True):
        result = super(IrActionReport, self).report_action(docids, data, config)
        if result.get('type') != 'ir.actions.report':
            return result
        device = self.device_id
        if data and data.get('device_id'):
            device = self.env['iomt.device'].browse(data['device_id'])

        result['id'] = self.id
        result['device_id'] = device.identifier
        return result

    def _get_readable_fields(self):
        return super()._get_readable_fields() | {
            "device_id",
        }
