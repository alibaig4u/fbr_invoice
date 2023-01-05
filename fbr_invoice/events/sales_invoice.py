import frappe
from frappe import _
import json
import requests
from pyqrcode import create as qrcreate

@frappe.whitelist()
def set_invoice_number(doctype, name, inv):
    frappe.db.set_value(doctype, name, "fbr_invoice_no", inv)
    generate_fbr_barcode(inv, name)
    frappe.db.commit()

@frappe.whitelist()
def generate_fbr_barcode(code=None, docname=None):
    from pathlib import Path
    import os
    import qrcode

    try:
        name_tobe = docname + ".png"
        # Get the current working directory
        cwd = os.getcwd()
        print(cwd)
        site_dir_path = cwd + "/sites/"
        site_dir_path = site_dir_path.replace('sites/sites', 'sites')
        f = open(site_dir_path + "currentsite.txt", "r")
        currentsitename = f.readline()
        qrcode_dir = site_dir_path + currentsitename + "/public/files/qrcodes/"
        if not os.path.exists(qrcode_dir):
            os.makedirs(qrcode_dir)
            os.chmod(qrcode_dir, 0o775)
        check_file = Path(qrcode_dir + name_tobe)
        if not check_file.is_file():
            img = qrcode.make(code)
            img.save(qrcode_dir + name_tobe)
    except Exception as ex:
        frappe.log_error(frappe.get_traceback())