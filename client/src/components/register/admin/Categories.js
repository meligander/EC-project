import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import moment from "moment";
import {
   loadCategories,
   updateCategories,
   categoriesPDF,
} from "../../../actions/category";
import Loading from "../../modal/Loading";
import Confirm from "../../modal/Confirm";
import PropTypes from "prop-types";

const Categories = ({
   history,
   loadCategories,
   updateCategories,
   categoriesPDF,
   categories: { categories, loading },
   auth: { userLogged },
}) => {
   const [formData, setFormData] = useState([]);
   const [otherValues, setOtherValues] = useState({
      min: "",
      max: "",
      month: "",
      toggleModal: false,
   });

   const { min, max, month, toggleModal } = otherValues;

   useEffect(() => {
      const initInput = () => {
         setFormData([...categories]);
      };
      const monthMinMax = (date, num) => {
         return date.getMonth() + num > 9
            ? date.getMonth() + num
            : "0" + (date.getMonth() + num);
      };
      const setMinMax = () => {
         const date = new Date();
         setOtherValues((prev) => ({
            ...prev,
            min: date.getFullYear() + "-" + monthMinMax(date, 1),
            max: date.getFullYear() + "-" + monthMinMax(date, 4),
         }));
      };

      if (loading) loadCategories();
      else {
         initInput();
         setMinMax();
      }
   }, [loadCategories, loading, categories]);

   const setToggle = (e) => {
      if (e) e.preventDefault();
      setOtherValues({
         ...otherValues,
         toggleModal: !toggleModal,
      });
   };

   const onChange = (e, index) => {
      let newValue = [...formData];
      newValue[index] = {
         ...newValue[index],
         value: e.target.value,
      };
      setFormData(newValue);
   };

   const onChangeMonth = (e) => {
      setOtherValues({
         ...otherValues,
         month: e.target.value,
      });
   };

   const onSubmit = () => {
      const mon = moment(month);
      updateCategories(
         { categories: formData, month: mon.month() + 1 },
         history,
         userLogged._id
      );
   };

   const pdfGeneratorSave = () => {
      categoriesPDF(categories);
   };

   return (
      <>
         {!loading ? (
            <>
               <h2>Categorías y Precios</h2>
               <Confirm
                  text="¿Está seguro que los datos son correctos?"
                  confirm={onSubmit}
                  setToggleModal={setToggle}
                  toggleModal={toggleModal}
               />
               <div className="form ">
                  <div className="form-group">
                     <input
                        className="form-input"
                        id="month"
                        type="month"
                        value={month}
                        name="month"
                        onChange={onChangeMonth}
                        min={min}
                        max={max}
                     />
                     <label htmlFor="month" className="form-label show">
                        Seleccione el mes desde el cual correrá el aumento de
                        precio.
                     </label>
                  </div>
               </div>
               <table className="smaller col-same-size">
                  <thead>
                     <tr>
                        <th>Nombre</th>
                        <th>Valor</th>
                     </tr>
                  </thead>
                  <tbody>
                     {formData.length > 0 &&
                        formData.map((category, index) => (
                           <tr key={index}>
                              <td>{category.name}</td>
                              <td>
                                 <input
                                    type="number"
                                    name={`value${index}`}
                                    value={category.value}
                                    placeholder="Valor"
                                    onChange={(e) => onChange(e, index)}
                                 />
                              </td>
                           </tr>
                        ))}
                  </tbody>
               </table>
               <div className="btn-right p-2">
                  <button
                     type="submit"
                     onClick={setToggle}
                     className="btn btn-primary"
                  >
                     <i className="far fa-save"></i>Actualizar
                     <span className="hide-sm"> Precios</span>
                  </button>
                  <button
                     className="btn btn-secondary"
                     onClick={pdfGeneratorSave}
                  >
                     <i className="fas fa-file-pdf"></i>
                  </button>
               </div>
            </>
         ) : (
            <Loading />
         )}
      </>
   );
};

Categories.propTypes = {
   loadCategories: PropTypes.func.isRequired,
   categories: PropTypes.object.isRequired,
   auth: PropTypes.object.isRequired,
   updateCategories: PropTypes.func.isRequired,
   categoriesPDF: PropTypes.func.isRequired,
};

const mapStatetoProps = (state) => ({
   categories: state.categories,
   auth: state.auth,
});

export default connect(mapStatetoProps, {
   loadCategories,
   updateCategories,
   categoriesPDF,
})(withRouter(Categories));
