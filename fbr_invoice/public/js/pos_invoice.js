//frappe.new_doc = false
frappe.ui.form.on("POS Invoice", {
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



                    $.ajax('https://gw.fbr.gov.pk/imsp/v1/api/Live/PostData', {
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
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader("Authorization", "Bearer " + frm.doc.fbr_pos_token);
                        },
                        error: function (jqXhr, textStatus, errorMessage) {
                            console.log('Error' + errorMessage);
                        }
                    });

                })
            }
        }

    },

})