# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from . import __version__ as app_version

app_name = "fbr_invoice"
app_title = "Fbr Invoice"
app_publisher = "swe.mirza.ali@gmail.com"
app_description = "Fbr Invoice Return"
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "swe.mirza.ali@gmail.com"
app_license = "MIT"

fixtures = [
    {
        "dt": "Custom Field", "filters": [
            [
                "name", "in", ["POS Profile-ntn_no", "Sales Invoice-ntn_no", "Sales Invoice-fbr_invoice_no",
                               "Sales Invoice-pos_id", "POS Profile-pos_id"]
            ]
        ]
    },
]
# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/fbr_invoice/css/fbr_invoice.css"
app_include_js = "/assets/fbr_invoice/js/qrcode.js"

# include js, css files in header of web template
# web_include_css = "/assets/fbr_invoice/css/fbr_invoice.css"
# web_include_js = "/assets/fbr_invoice/js/fbr_invoice.js"

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
doctype_js = {"Sales Invoice" : "public/js/sales_invoice.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Website user home page (by function)
# get_website_user_home_page = "fbr_invoice.utils.get_home_page"

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "fbr_invoice.install.before_install"
# after_install = "fbr_invoice.install.after_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "fbr_invoice.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"Sales Invoice": {
# 		"after_insert": "fbr_invoice.events.sales_invoice.send_pos_invoice_fbr",
# 	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"fbr_invoice.tasks.all"
# 	],
# 	"daily": [
# 		"fbr_invoice.tasks.daily"
# 	],
# 	"hourly": [
# 		"fbr_invoice.tasks.hourly"
# 	],
# 	"weekly": [
# 		"fbr_invoice.tasks.weekly"
# 	]
# 	"monthly": [
# 		"fbr_invoice.tasks.monthly"
# 	]
# }

# Testing
# -------

# before_tests = "fbr_invoice.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "fbr_invoice.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "fbr_invoice.task.get_dashboard_data"
# }

