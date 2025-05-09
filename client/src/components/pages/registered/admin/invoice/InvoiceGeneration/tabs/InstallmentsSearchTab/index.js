import React, {
   // useEffect,
   useState,
} from "react";
import { connect } from "react-redux";

// import { togglePopup } from "../../../../../../../../actions/global";
// import { addDiscount } from "../../../../../../../../actions/invoice";

// import PopUp from "../../../../../../../modal/PopUp";
import InstallmentsSearch from "../../../../../sharedComp/search/InstallmentsSearch";

const InstallmentsSearchTab = ({
   invoices: { invoice },
   // addDiscount,
   // togglePopup,
}) => {
   // const month = new Date().getMonth() + 1;

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

   //Cambiar a un checkbox que se habilite cuando supera esas condiciones
   // useEffect(() => {
   //    if (invoice) {
   //       const students = invoice.details.reduce((res, curr) => {
   //          if (curr.number > 2) {
   //             if (res[curr.student._id]) res[curr.student._id].push(curr);
   //             else Object.assign(res, { [curr.student._id]: [curr] });
   //          }

   //          return res;
   //       }, {});

   //       for (const x in students) {
   //          if (
   //             (!invoice.studentsD ||
   //                !invoice.studentsD.some((item) => item === x)) &&
   //             students[x].filter(
   //                (item) => item.status !== "expired" && item.number > month
   //             ).length > 2
   //          )
   //             togglePopup("default");
   //       }
   //    }
   // }, [invoice, togglePopup, month]);

   return (
      <div className="mt-4">
         {/* <PopUp
            confirm={() => addDiscount(student._id)}
            info={
               student &&
               `¿Desea agregar un 10% de descuento a las cuotas del alumno
             ${student.lastname}, ${student.name}?`
            }
         /> */}
         <InstallmentsSearch student={student} changeStudent={changeStudent} />
      </div>
   );
};

const mapStateToProps = (state) => ({
   invoices: state.invoices,
});

export default connect(
   mapStateToProps
   // { addDiscount, togglePopup }
)(InstallmentsSearchTab);
