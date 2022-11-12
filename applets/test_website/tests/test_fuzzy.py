# -*- coding: utf-8 -*-
# Part of Tele. See LICENSE file for full copyright and licensing details.

import logging

from tele.applets.website.controllers.main import Website
from tele.applets.website.tools import MockRequest
import tele.tests
from tele.tests.common import TransactionCase

_logger = logging.getLogger(__name__)

@tele.tests.tagged('-at_install', 'post_install')
class TestAutoComplete(TransactionCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.website = cls.env['website'].browse(1)
        cls.WebsiteController = Website()

    def _autocomplete(self, term, expected_count, expected_fuzzy_term):
        """ Calls the autocomplete for a given term and performs general checks """
        with MockRequest(self.env, website=self.website):
            suggestions = self.WebsiteController.autocomplete(
                search_type="test", term=term, max_nb_chars=50, options={},
            )
        self.assertEqual(expected_count, suggestions['results_count'], "Wrong number of suggestions")
        self.assertEqual(expected_fuzzy_term, suggestions.get('fuzzy_search', 'Not found'), "Wrong fuzzy match")

    def test_01_many_records(self):
        # REF1000~REF3999
        data = [{
            'name': 'REF%s' % count,
            'is_published': True,
        } for count in range(1000, 4000)]
        self.env['test.model'].create(data)
        # NUM1000~NUM1998
        data = [{
            'name': 'NUM%s' % count,
            'is_published': True,
        } for count in range(1000, 1999)]
        self.env['test.model'].create(data)
        # There are more than 1000 "R*" records
        # => Find exact match through the fallback
        self._autocomplete('REF3000', 1, False)
        # => No exact match => Find fuzzy within first 1000 (distance=3: replace D by F, move 3, add 1)
        self._autocomplete('RED3000', 1, 'ref3000' if self.env.registry.has_trigram else 'ref1003')
        # => Find exact match through the fallback
        self._autocomplete('REF300', 10, False)
        # => Find exact match through the fallback
        self._autocomplete('REF1', 1000, False)
        # => No exact match => Nothing close enough (min distance=5)
        self._autocomplete('REFX', 0, "Not found")
        # => Find exact match through the fallback - unfortunate because already in the first 1000 records
        self._autocomplete('REF1230', 1, False)
        # => Find exact match through the fallback
        self._autocomplete('REF2230', 1, False)

        # There are less than 1000 "N*" records
        # => Fuzzy within N* (distance=1: add 1)
        self._autocomplete('NUM000', 1, "num1000")
        # => Exact match (distance=0 shortcut logic)
        self._autocomplete('NUM100', 10, False)
        # => Exact match (distance=0 shortcut logic)
        self._autocomplete('NUM199', 9, False)
        # => Exact match (distance=0 shortcut logic)
        self._autocomplete('NUM1998', 1, False)
        # => Fuzzy within N* (distance=1: replace 1 by 9)
        self._autocomplete('NUM1999', 1, 'num1199')
        # => Fuzzy within N* (distance=1: add 1)
        self._autocomplete('NUM200', 1, 'num1200')

        # There are no "X*" records
        self._autocomplete('XEF1000', 0, "Not found")