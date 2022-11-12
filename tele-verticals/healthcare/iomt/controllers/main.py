# -*- coding: utf-8 -*-
# Part of Tele. See LICENSE file for full copyright and licensing details.

import io
import json
import os
import zipfile

from tele import http
from tele.http import request
from tele.modules import module as modules


class IoMTController(http.Controller):

    @http.route('/iomt/get_handlers', type='http', auth='public', csrf=False)
    def download_iomt_handlers(self, mac, auto):
        # Check mac is of one of the IoMT Boxes
        box = request.env['iomt.box'].sudo().search([('identifier', '=', mac)], limit=1)
        if not box or (auto == 'True' and not box.drivers_auto_update):
            return ''

        zip_list = []
        module_ids = request.env['ir.module.module'].sudo().search([('state', '=', 'installed')])
        for module in module_ids.mapped('name') + ['hw_drivers']:
            filetree = modules.get_module_filetree(module, 'iomt_handlers')
            if not filetree:
                continue
            for directory, files in filetree.items():
                for file in files:
                    if file.startswith('.') or file.startswith('_'):
                        continue
                    # zip it
                    zip_list.append((modules.get_resource_path(module, 'iomt_handlers', directory, file), os.path.join(directory, file)))

        file_like_object = io.BytesIO()
        zipfile_ob = zipfile.ZipFile(file_like_object, 'w')
        for zip in zip_list:
            zipfile_ob.write(zip[0], zip[1]) # In order to remove the absolute path
        zipfile_ob.close()
        return file_like_object.getvalue()

    @http.route('/iomt/keyboard_layouts', type='http', auth='public', csrf=False)
    def load_keyboard_layouts(self, available_layouts):
        if not request.env['iomt.keyboard.layout'].sudo().search_count([]):
            request.env['iomt.keyboard.layout'].sudo().create(json.loads(available_layouts))
        return ''

    @http.route('/iomt/box/<string:identifier>/display_url', type='http', auth='public')
    def get_url(self, identifier):
        urls = {}
        iomtbox = request.env['iomt.box'].sudo().search([('identifier', '=', identifier)], limit=1)
        if iomtbox:
            iomt_devices = iomtbox.device_ids.filtered(lambda device: device.type == 'display')
            for device in iomt_devices:
                urls[device.identifier] = device.display_url
        return json.dumps(urls)

    @http.route('/iomt/setup', type='json', auth='public')
    def update_box(self, **kwargs):
        """
        This function receives a dict from the iomt box with information from it 
        as well as devices connected and supported by this box.
        This function create the box and the devices and set the status (connected / disconnected)
         of devices linked with this box
        """
        if kwargs:
            # Box > V19
            iomt_box = kwargs['iomt_box']
            devices = kwargs['devices']
        else:
            # Box < V19
            data = request.jsonrequest
            iomt_box = data
            devices = data['devices']

         # Update or create box
        box = request.env['iomt.box'].sudo().search([('identifier', '=', iomt_box['identifier'])], limit=1)
        if box:
            box = box[0]
            box.ip = iomt_box['ip']
            box.name = iomt_box['name']
        else:
            iomt_token = request.env['ir.config_parameter'].sudo().search([('key', '=', 'iomt_token')], limit=1)
            if iomt_token.value.strip('\n') == iomt_box['token']:
                box = request.env['iomt.box'].sudo().create({
                    'name': iomt_box['name'],
                    'identifier': iomt_box['identifier'],
                    'ip': iomt_box['ip'],
                    'version': iomt_box['version'],
                })

        # Update or create devices
        if box:
            previously_connected_iomt_devices = request.env['iomt.device'].sudo().search([
                ('iomt_id', '=', box.id),
                ('connected', '=', True)
            ])
            connected_iomt_devices = request.env['iomt.device'].sudo()
            for device_identifier in devices:
                available_types = [s[0] for s in request.env['iomt.device']._fields['type'].selection]
                available_connections = [s[0] for s in request.env['iomt.device']._fields['connection'].selection]

                data_device = devices[device_identifier]
                if data_device['type'] in available_types and data_device['connection'] in available_connections:
                    if data_device['connection'] == 'network':
                        device = request.env['iomt.device'].sudo().search([('identifier', '=', device_identifier)])
                    else:
                        device = request.env['iomt.device'].sudo().search([('iomt_id', '=', box.id), ('identifier', '=', device_identifier)])
                
                    # If an `iomt.device` record isn't found for this `device`, create a new one.
                    if not device:
                        device = request.env['iomt.device'].sudo().create({
                            'iomt_id': box.id,
                            'name': data_device['name'],
                            'identifier': device_identifier,
                            'type': data_device['type'],
                            'manufacturer': data_device['manufacturer'],
                            'connection': data_device['connection'],
                        })
                    elif device and device.type != data_device.get('type'):
                        device.write({
                        'name': data_device.get('name'),
                        'type': data_device.get('type'),
                        'manufacturer': data_device.get('manufacturer')
                        })

                    connected_iomt_devices |= device
            # Mark the received devices as connected, disconnect the others.
            connected_iomt_devices.write({'connected': True})
            (previously_connected_iomt_devices - connected_iomt_devices).write({'connected': False})
