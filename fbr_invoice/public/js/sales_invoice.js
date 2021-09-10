frappe.ui.form.on("Sales Invoice", {
    after_insert: function(frm){
        frappe.call({
			method: "fbr_invoice.events.sales_invoice.send_pos_invoice_fbr",
			args:{
				frm: frm.doc
			},
			callback: function(e){
				frm.reload()
				window.open("/printview?doctype=Sales Invoice="+r.message+"&trigger_print=1&format=FBR Invoice&no_letterhead=0&_lang=en")
			}
        })
    }

})