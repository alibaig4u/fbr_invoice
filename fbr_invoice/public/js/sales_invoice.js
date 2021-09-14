frappe.new_doc = false
frappe.ui.form.on("Sales Invoice", {
    onload: function(frm){
        debugger;
        if(frm.is_new() == 1){
            frappe.new_doc = true
        }
    },
    after_save: function(frm) {
        debugger;
        if(frappe.new_doc == true){
            debugger;
            var item_list = []
            $.each(frm.doc.items, (k,item)=>{
                item_list.push({
                    "ItemCode": item.item_code,
                    "ItemName": item.item_name,
                    "Quantity": item.qty,
                    "PCTCode": "",
                    "TaxRate": 0,
                    "SaleValue": item.rate,
                    "TotalAmount": item.amount,
                    "TaxCharged": 0,
                    "Discount": "0.0",
                    "FurtherTax": 0,
                    "InvoiceType": 1,
                    "RefUSIN": null
                })

            })


            var data = {
                "InvoiceNumber": "",
                "POSID": frm.doc.pos_id,
                "USIN": "SALE POS BEVERLY 2021 05 100361",
                "DateTime": frm.doc.posting_date,
                "BuyerNTN": frm.doc.ntn_no,
                "BuyerCNIC": null,
                "BuyerName": frm.doc.customer,
                "BuyerPhoneNumber": null,
                "TotalBillAmount": frm.doc.net_total,
                "TotalQuantity": 7,
                "TotalSaleValue": frm.doc.grand_total,
                "TotalTaxCharged": "0",
                "Discount": "0",
                "FurtherTax": "0",
                "PaymentMode": 1,
                "RefUSIN": null,
                "InvoiceType": 1,
                "Items": item_list
            }



            $.ajax('http://127.0.0.1:8524/api/IMSFiscal/GetInvoiceNumberByModel', {
                type: 'POST',  // http method
                data: data,  // data to submit
                success: function (data, status, xhr) {
                    debugger;
                    console.log('status: ' + status + ', data: ' + JSON.stringify(data));
                    var invoiceNumber = data.InvoiceNumber;
                    var data = JSON.stringify(data);

                    frappe.call({
                        method: "fbr_invoice.events.sales_invoice.set_invoice_number",
                        args:{
                            doctype: frm.doc.doctype,
                            name: frm.doc.name,
                            inv: invoiceNumber
                        },
                        callback: function(e){
                            debugger;
                            frm.reload_doc()
                            window.open("/printview?doctype=Sales Invoice&name="+frm.doc.name+"&trigger_print=1&format=FBR Invoice&no_letterhead=0&_lang=en")
                        }
                    })



//                    $.ajax({
//                        type: "post",
//                        url: "<?= site_url('pos/set_sale_invoice_no') ?>",
//                        data: {<?= $this->security->get_csrf_token_name(); ?>: "<?= $this->security->get_csrf_hash(); ?>", invoice_no: invoiceNumber, id: <?= $inv->id; ?>},
//                        dataType: "json",
//                        success: function (data) {
//                            $('#fbr_invoice_no').qrcode({width: 64,height: 64,text: invoiceNumber.toString() });
//                            $('#fbr_invoice_no_text').html(invoiceNumber.toString());
//                            if (printFlag++ == 0)
//                                window.print();
//                        },
//                        error: function () {
//                            alert('<?= lang('ajax_request_failed'); ?>');
//                            if (printFlag++ == 0)
//                                window.print();
//
//                            return false;
//                        }
//                    });
                },
                error: function (jqXhr, textStatus, errorMessage) {
//                    if (printFlag++ == 0)
//                        window.print();
                    console.log('Error' + errorMessage);

                }
            });
//            frappe.call({
//                method: "fbr_invoice.events.sales_invoice.send_pos_invoice_fbr",
//                args:{
//                    doc: frm.doc
//                },
//                callback: function(e){
//                    debugger;
//                    frm.reload_doc()
//                    window.open("/printview?doctype=Sales Invoice&name="+frm.doc.name+"&trigger_print=1&format=FBR Invoice&no_letterhead=0&_lang=en")
//                }
//            })
        }

	}

})