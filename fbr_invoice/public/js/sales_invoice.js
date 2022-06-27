frappe.new_doc = false
frappe.ui.form.on("Sales Invoice", {
    refresh: function(frm){
        debugger;
        if(frm.doc.docstatus == 1){
            if(is_null(frm.doc.fbr_invoice_no)){
                frm.add_custom_button(__("Update FBR Invoice"), ()=>{
                    var item_list = []
                    var total_qty = 0
                    var tax_rate = (frm.doc.taxes.length > 0 ? frm.doc.taxes[0].rate : 0)
                    $.each(frm.doc.items, (k,item)=>{
                        var salevalue = item.rate * item.qty
                        item_list.push({
                            "ItemCode": item.item_code,
                            "ItemName": item.item_name,
                            "Quantity": item.qty,
                            "PCTCode": "11001010",
                            "TaxRate": tax_rate,
                            "SaleValue": salevalue,
                            "TotalAmount": salevalue * ( 1+ (tax_rate/100) ) ,
                            "TaxCharged": (salevalue/100)*tax_rate,
                            "Discount": "0.0",
                            "FurtherTax": 0,
                            "InvoiceType": 1,
                            "RefUSIN": null
                        })
                        total_qty += item.qty
                    })


                    // cur_pos.frm.doc.base_total_taxes_and_charges // pos tax field
                    var data = {
                        "InvoiceNumber": "",
                        "POSID": frm.doc.pos_id,
                        "USIN": frm.doc.name,
                        "DateTime": frm.doc.posting_date,
                        "BuyerNTN": frm.doc.ntn_no,
                        "BuyerCNIC": null,
                        "BuyerName": frm.doc.customer,
                        "BuyerPhoneNumber": null,
                        "TotalBillAmount": frm.doc.rounded_total,
                        "TotalQuantity": total_qty,
                        "TotalSaleValue": frm.doc.net_total,
                        "TotalTaxCharged": frm.doc.total_taxes_and_charges,
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
                        async: false,
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
                                async: false,
                                callback: function(e){
                                    debugger;
                                    frm.reload_doc();
                                }
                            })

                        },
                        error: function (jqXhr, textStatus, errorMessage) {
                            console.log('Error' + errorMessage);
                        }
                    });

                })
            }
        }

    },
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
                    "PCTCode": "11001010",
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