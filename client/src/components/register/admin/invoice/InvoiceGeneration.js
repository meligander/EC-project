import React from "react";
import Tabs from "../../../Tabs";
import InstallmentsSearch from "../../../InstallmentsSearch";
import InvoiceTab from "./InvoiceTab";

const InvoiceGeneration = () => {
   return (
      <>
         <h1>Facturación</h1>
         <Tabs
            tablist={["Cuotas", "Factura"]}
            panellist={[InstallmentsSearch, InvoiceTab]}
         />
      </>
   );
};

export default InvoiceGeneration;
