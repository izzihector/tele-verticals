import tele.tests
from tele.tools import mute_logger


@tele.tests.common.tagged('post_install', '-at_install')
class TestWebsiteSession(tele.tests.HttpCase):

    def test_01_run_test(self):
        self.start_tour('/', 'test_json_auth')
