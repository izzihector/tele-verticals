import tele.tests
from tele.tools import mute_logger


@tele.tests.common.tagged('post_install', '-at_install')
class TestWebsiteError(tele.tests.HttpCase):

    @mute_logger('tele.applets.http_routing.models.ir_http', 'tele.http')
    def test_01_run_test(self):
        self.start_tour("/test_error_view", 'test_error_website')
