import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import { togglePopup } from "../../../../../../../../actions/global";
import { addDiscount } from "../../../../../../../../actions/invoice";

import PopUp from "../../../../../../../modal/PopUp";
import InstallmentsSearch from "../../../../../sharedComp/search/InstallmentsSearch";

const InstallmentsSearchTab = ({
   invoices: { invoice },
   addDiscount,
   togglePopup,
}) => {
   const [adminValues, setAdminValues] = useState({
      student: null,
   });
   const { student } = adminValues;

   const changeStudent = (student) => {
      setAdminValues((prev) => ({
         ...prev,
         student,
      }));
   };

   useEffect(() => {
      if (invoice) {
         const students = invoice.details.reduce((res, curr) => {
            if (curr.number > 2) {
               if (res[curr.student._id]) res[curr.student._id].push(curr);
               else Object.assign(res, { [curr.student._id]: [curr] });
            }

            return res;
         }, {});

         for (const x in students) {
            if (
               (!invoice.studentsD ||
                  !invoice.studentsD.some((item) => item === x)) &&
               students[x].length > 2 &&
               students[x].every((item) => !item.expired)
            )
               togglePopup("default");
         }
      }
   }, [invoice, togglePopup]);

   return (
      <div className="mt-4">
         <PopUp
            confirm={() => addDiscount(student._id)}
            info={
               student &&
               `¿Desea agregar un 10% de descuento a las cuotas del alumno
             ${student.lastname}, ${student.name}?`
            }
         />
         <InstallmentsSearch student={student} changeStudent={changeStudent} />
      </div>
   );
};

const mapStateToProps = (state) => ({
   invoices: state.invoices,
});

export default connect(mapStateToProps, { addDiscount, togglePopup })(
   InstallmentsSearchTab
);
