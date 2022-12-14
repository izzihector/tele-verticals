from tele import http

from tele.http import request
from tele.applets.tele_studio.controllers import main

class TeleStudioController(main.TeleStudioController):

    @http.route('/tele_studio/edit_view', type='json', auth='user')
    def edit_view(self, view_id, studio_view_arch, operations=None):
        action = super(TeleStudioController, self).edit_view(view_id, studio_view_arch, operations)
        model = request.env['ir.ui.view'].browse(view_id).model
        worksheet_template_to_change = request.env['worksheet.template'].sudo().search([('model_id', '=', model)])
        if worksheet_template_to_change:
            worksheet_template_to_change._generate_qweb_report_template()
        return action
