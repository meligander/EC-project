import React, { useEffect } from "react";
import { connect } from "react-redux";
import format from "date-fns/format";
import { FaCalendarDay } from "react-icons/fa";
import es from "date-fns/locale/es";

import { loadRegister } from "../../../../../actions/register";
import { loadExpenceTypes } from "../../../../../actions/expence";
import { loadUsers } from "../../../../../actions/user";

import Tabs from "../../sharedComp/Tabs";
import RegisterTab from "./tabs/RegisterTab";
import ExpenceTab from "./tabs/ExpenceTab";

import "./style.scss";

const RegisterInfo = ({
   registers: { register, loadingRegister },
   expences: { loadingET, expencetypes },
   users: { loading },
   loadRegister,
   loadExpenceTypes,
   loadUsers,
}) => {
   useEffect(() => {
      if (loadingET || expencetypes.length < 4) loadExpenceTypes(false, true);
   }, [loadingET, loadExpenceTypes, expencetypes]);

   useEffect(() => {
      if (loadingRegister) loadRegister(true);
   }, [loadingRegister, loadRegister]);

   useEffect(() => {
      if (loading) loadUsers({ active: true, type: "team" }, false, true);
   }, [loading, loadUsers]);

   return (
      <>
         <h1 className="text-center">Caja</h1>
         {!loadingRegister && !loadingET && !loading && (
            <>
               <h3 className="heading-tertiary my-4 text-dark">
                  <FaCalendarDay />
                  &nbsp;
                  {format(
                     register.temporary ? new Date(register.date) : new Date(),
                     "EEEE, do 'de' LLLL 'de' yyyy",
                     { locale: es }
                  )}
               </h3>
               <Tabs
                  tablist={["Caja Diaria", "Egreso"]}
                  panellist={[RegisterTab, ExpenceTab]}
               />
            </>
         )}
      </>
   );
};

const mapStateToProps = (state) => ({
   registers: state.registers,
   expences: state.expences,
   users: state.users,
});

export default connect(mapStateToProps, {
   loadRegister,
   loadExpenceTypes,
   loadUsers,
})(RegisterInfo);
