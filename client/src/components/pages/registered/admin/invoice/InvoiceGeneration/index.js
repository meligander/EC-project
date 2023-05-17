import React, { useEffect } from "react";
import { connect } from "react-redux";

import { getInvoiceNumber } from "../../../../../../actions/invoice";
import { loadDiscount } from "../../../../../../actions/global";
import { loadCategories } from "../../../../../../actions/category";

import Tabs from "../../../sharedComp/Tabs";
import InstallmentsSearchTab from "./tabs/InstallmentsSearchTab";
import InvoiceTab from "./tabs/InvoiceTab";

const InvoiceGeneration = ({
   getInvoiceNumber,
   loadDiscount,
   loadCategories,
   invoices: {
      otherValues: { invoiceNumber },
   },
   categories: { loading: loadingCategories },
   global: { loading },
}) => {
   useEffect(() => {
      if (invoiceNumber === "") getInvoiceNumber();
   }, [getInvoiceNumber, invoiceNumber]);

   useEffect(() => {
      if (loading) loadDiscount();
   }, [loading, loadDiscount]);

   useEffect(() => {
      if (loadingCategories) loadCategories();
   }, [loadingCategories, loadCategories]);

   return (
      <>
         <h1>Facturación</h1>
         {invoiceNumber !== "" && (
            <Tabs
               tablist={["Cuotas", "Factura"]}
               panellist={[InstallmentsSearchTab, InvoiceTab]}
            />
         )}
      </>
   );
};

const mapStateToProps = (state) => ({
   invoices: state.invoices,
   global: state.global,
   categories: state.categories,
});

export default connect(mapStateToProps, {
   getInvoiceNumber,
   loadDiscount,
   loadCategories,
})(InvoiceGeneration);
