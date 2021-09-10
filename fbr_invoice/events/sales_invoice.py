#!/home/vatsky/frappe-bench/env/bin/python
#####/Users/saqibrupani/Documents/pythoncode/SkylinesVAT/frappe-bench/env/bin/python

import frappe
from frappe import _
import datetime
import dateutil.relativedelta
from frappe.utils import get_formatted_email
import requests
import json
from dateutil.relativedelta import relativedelta
# from requests.models import Response

@frappe.whitelist()
def send_pos_invoice_fbr(doc=None, handler=None):
    try:
        # login to system
        # print orgid
        # loginurl = 'http://192.168.0.176:8524/api/IMSFiscal/Get'
        data = {
            "InvoiceNumber": "",
            "POSID": 943949,
            "USIN": "SALE\/POS\/BEVERLY\/2021\/05\/100361",
            "DateTime": "2021-05-18 13:16:05",
            "BuyerNTN": None,
            "BuyerCNIC": None,
            "BuyerName": "Walk-in Customer",
            "BuyerPhoneNumber": None,
            "TotalBillAmount": "1772.7",
            "TotalQuantity": 7,
            "TotalSaleValue": "1940.0",
            "TotalTaxCharged": "123.7",
            "Discount": "291.0",
            "FurtherTax": "123.7",
            "PaymentMode": 1,
            "RefUSIN": None,
            "InvoiceType": 1,
            "Items": [{
                "ItemCode": "140",
                "ItemName": "Brownies - Cookie Dough Fudge Brownies",
                "Quantity": "1",
                "PCTCode": "98012000",
                "TaxRate": 0,
                "SaleValue": "170.0",
                "TotalAmount": "170.0",
                "TaxCharged": 0,
                "Discount": "0.0",
                "FurtherTax": 0,
                "InvoiceType": 1,
                "RefUSIN": None
            }]
        }
        
        data = json.dumps(data)
        # data = unicode(data, "utf-8")
        url = 'http://192.168.0.182:8524/api/IMSFiscal/GetInvoiceNumberByModel'

        # sid = Response.headers._store['set-cookie'][1].split(";")[4].split(',')[1]
        response = requests.post(url, data=data, headers={
            'content-type': "application/json"
        })

        print(response)
        res_data = json.loads(response.content)

        # res_data = json.loads(response.content)["message"]
        print(res_data)
        frappe.db.set_value(doc.doctype, doc.name, "fbr_invoice_no", res_data["InvoiceNumber"])
        generate_fbr_barcode(res_data["InvoiceNumber"])
        frappe.db.commit()
        # get organization details
        # docname = ''
        # orgdoc = frappe.get_doc("Organization",orgid)
        # for cur_log in res_data['qc_log']:
        #     previousinvoice = frappe.get_list('QC Pending',fields=["name","invoice_number"],filters={'organization':orgid,'invoice_number':cur_log['NAME']},ignore_permissions=True)
        #     if len(previousinvoice) > 0:
        #         qcpending_doc = frappe.get_doc("QC Pending",previousinvoice[0].name)
        #         if cur_log['qc_status'] == 'Pending for QC1' and cur_log['comment'] == '':
        #                 qcp_datetime = datetime.datetime.strptime(cur_log['date'], '%Y-%m-%d %H:%M:%S')
        #                 qcpending_doc.qc_pending_date = str(qcp_datetime.date())
        #                 qcpending_doc.qc_pending_time = str(qcp_datetime.time())
        #                 qcpending_doc.qc1_rempendingarks = cur_log['comment']
        #         elif (cur_log['qc_status'] == 'Pending for QC1' and cur_log['comment'] != '') or (cur_log['qc_status'] == 'Pending for QC2' and cur_log['comment'] == 'All Clear (OK)'):
        #                 qcp_datetime = datetime.datetime.strptime(cur_log['date'], '%Y-%m-%d %H:%M:%S')
        #                 qcpending_doc.qc1_date = str(qcp_datetime.date())
        #                 qcpending_doc.qc1_time = str(qcp_datetime.time())
        #                 qcpending_doc.qc1_remarks = cur_log['comment']
        #         elif (cur_log['qc_status'] == 'Pending for QC2' and cur_log['comment'] != '') or (cur_log['qc_status'] == 'QC COMPLETED' and cur_log['comment'] == 'All Clear (OK)'):
        #             qcp_datetime = datetime.datetime.strptime(cur_log['date'], '%Y-%m-%d %H:%M:%S')
        #             qcpending_doc.qc2_date = str(qcp_datetime.date())
        #             qcpending_doc.qc2_time = str(qcp_datetime.time())
        #             qcpending_doc.qc2_remarks = cur_log['comment']
        #         qcpending_doc.qc_by = cur_log['qc_user']
        #         qcpending_doc.qc_status = cur_log['qc_status']
        #         qcpending_doc.save(ignore_permissions=True)
        #         frappe.db.commit()
        #         continue
               
    except Exception as ex:
        print(ex)
        return ex


@frappe.whitelist()
def generate_fbr_barcode(code=None):
    import shutil
    import barcode
    from pathlib import Path
    import os

    name_tobe = code + ".svg"
    # Get the current working directory
    cwd = os.getcwd()
    print(cwd)
    f = open(cwd+"/currentsite.txt", "r")
    currentsitename = f.readline()
    check_file = Path(cwd + "/" + currentsitename + "/public/files/barcodes/" + name_tobe)
    if not check_file.is_file():
        bar = barcode.get('code128', str(code))
        result = bar.save(code)
        shutil.move(result, cwd + "/" + currentsitename + '/public/files/barcodes')
