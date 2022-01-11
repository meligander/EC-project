import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import format from "date-fns/format";
import { FaCalendarDay } from "react-icons/fa";
import es from "date-fns/locale/es";

import {
   loadRegister,
   /* allowNewRegister, */
} from "../../../../../actions/register";
import { loadExpenceTypes } from "../../../../../actions/expence";

import Tabs from "../../sharedComp/Tabs";
import RegisterTab from "./tabs/RegisterTab";
import IncomeExpenceTab from "./tabs/IncomeExpenceTab";

import "./style.scss";

const RegisterInfo = ({
   loadRegister,
   loadExpenceTypes,
   /*  allowNewRegister, */
   registers: { register, loadingRegister },
}) => {
   const [date, setDate] = useState(new Date());

   useEffect(() => {
      if (!loadingRegister) {
         if (register && register.temporary) setDate(register.date);
         /* if (
            !register ||
            (register && !register.temporary && register.registermoney === 0)
         ) {
            allowNewRegister();
         } */
      } else {
         loadRegister();
         loadExpenceTypes(false, true);
      }
   }, [loadRegister, loadExpenceTypes, loadingRegister, register]);

   return (
      <>
         <h1 className="text-center">Caja</h1>
         <h3 className="heading-tertiary my-4 text-dark">
            <FaCalendarDay />
            &nbsp;
            {format(new Date(date), "Lo 'de' LLLL 'de' yyyy", { locale: es })}
         </h3>
         <Tabs
            tablist={["Caja Diaria", "Ingreso/Egreso"]}
            panellist={[RegisterTab, IncomeExpenceTab]}
         />
      </>
   );
};

const mapStateToProps = (state) => ({
   registers: state.registers,
});

export default connect(mapStateToProps, {
   loadRegister,
   loadExpenceTypes,
   /* allowNewRegister, */
})(RegisterInfo);
