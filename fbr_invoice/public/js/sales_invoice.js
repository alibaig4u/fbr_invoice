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
            frappe.call({
                method: "fbr_invoice.events.sales_invoice.send_pos_invoice_fbr",
                args:{
                    doc: frm.doc
                },
                callback: function(e){
                    debugger;
                    frm.reload_doc()
                    window.open("/printview?doctype=Sales Invoice&name="+frm.doc.name+"&trigger_print=1&format=FBR Invoice&no_letterhead=0&_lang=en")
                }
            })
        }

	}

})