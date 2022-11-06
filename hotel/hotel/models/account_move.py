# See LICENSE file for full copyright and licensing details.

from tele import api, models


class AccountMove(models.Model):

    _inherit = "account.move"

    @api.model
    def create(self, vals):
        res = super(AccountMove, self).create(vals)
        if self._context.get("folio_id"):
            folio = self.env["hotel.folio"].browse(self._context["folio_id"])
            folio.write({"hotel_invoice_id": res.id, "invoice_status": "invoiced"})
        return res
