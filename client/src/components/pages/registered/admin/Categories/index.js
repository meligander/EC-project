import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import {
   loadCategories,
   updateCategories,
   categoriesPDF,
} from "../../../../../actions/category";

import Loading from "../../../../modal/Loading";
import PopUp from "../../../../modal/PopUp";

import "./style.scss";

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
      date: "",
      toggleModal: false,
   });

   const { min, max, date, toggleModal } = otherValues;

   useEffect(() => {
      const initInput = () => {
         setFormData(categories);
      };
      const monthMinMax = (date, num) => {
         if (date.getMonth() + num < 11) {
            let value = date.getMonth() + num;
            if (value < 9) value = "0" + value;
            return `${date.getFullYear()}-${value}`;
         } else {
            let value = num - (11 - date.getMonth());
            if (value < 9) value = "0" + value;
            return `${date.getFullYear() + 1}-${value}`;
         }
      };
      const setMinMax = () => {
         const date = new Date();
         setOtherValues((prev) => ({
            ...prev,
            min: monthMinMax(date, 1),
            max: monthMinMax(date, 4),
         }));
      };

      if (loading) loadCategories();
      else {
         initInput();
         setMinMax();
      }
   }, [loadCategories, loading, categories]);

   const setToggle = () => {
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
         date: e.target.value,
      });
   };

   return (
      <>
         {!loading ? (
            <>
               <h2>Categorías y Precios</h2>
               <PopUp
                  text="¿Está seguro que los datos son correctos?"
                  confirm={() =>
                     updateCategories(
                        { categories: formData, date },
                        history,
                        userLogged._id
                     )
                  }
                  setToggleModal={setToggle}
                  toggleModal={toggleModal}
               />
               <div className="form ">
                  <div className="form-group">
                     <input
                        className="form-input"
                        id="date"
                        type="month"
                        value={date}
                        name="date"
                        onChange={onChangeMonth}
                        min={min}
                        max={max}
                     />
                     <label htmlFor="date" className="form-label show">
                        Seleccione el mes desde el cual correrá el aumento de
                        precio.
                     </label>
                  </div>
               </div>

               <table className="smaller category">
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
                     type="button"
                     onClick={(e) => {
                        e.preventDefault();
                        setToggle();
                     }}
                     className="btn btn-primary"
                  >
                     <i className="far fa-save"></i>
                     <span className="hide-sm">&nbsp; Actualizar</span>
                  </button>
                  <div className="tooltip">
                     <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={(e) => {
                           e.preventDefault();
                           categoriesPDF(categories);
                        }}
                     >
                        <i className="fas fa-file-pdf"></i>
                     </button>
                     <span className="tooltiptext">
                        PDF con categorías y precios
                     </span>
                  </div>
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
