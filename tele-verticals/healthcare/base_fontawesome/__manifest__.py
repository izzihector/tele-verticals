# Copyright 2017 Simone Orsi
# Copyright 2018 Creu Blanca
# License LGPL-3.0 or later (http://www.gnu.org/licenses/lgpl).

{
    "name": "Base Fontawesome",
    "summary": """Up to date Fontawesome resources.""",
    "version": "1.0.1.0.1",
    "license": "LGPL-3",
    "author": "Tele INC",
    "depends": ["web"],
    "assets": {
        "web.assets_common": [
            (
                "replace",
                "web/static/lib/fontawesome/css/font-awesome.css",
                "base_fontawesome/static/src/css/fontawesome.css",
            ),
            "base_fontawesome/static/lib/fontawesome-5.15.4/css/all.css",
            "base_fontawesome/static/lib/fontawesome-5.15.4/css/v4-shims.css",
            "base_fontawesome/static/src/js/form_renderer.js",
            "base_fontawesome/static/src/js/list_renderer.js",
        ],
        "web.report_assets_common": [
            (
                "replace",
                "web/static/lib/fontawesome/css/font-awesome.css",
                "base_fontawesome/static/src/css/fontawesome.css",
            ),
            "base_fontawesome/static/lib/fontawesome-5.15.4/css/all.css",
            "base_fontawesome/static/lib/fontawesome-5.15.4/css/v4-shims.css",
        ],
    },
}
