import React from "react";

import "./style.scss";

const Certificate = ({ onChange, date, students, period }) => {
   return (
      <div className="popup-certificate">
         <div className="form">
            <h4>Certificados a generar</h4>
            {!period && (
               <div className="form-group">
                  <input
                     className="form-input"
                     id="date"
                     type="date"
                     name="date"
                     value={date}
                     onChange={onChange}
                  />
                  <label htmlFor="category" className="form-label">
                     Fecha para los certificados
                  </label>
               </div>
            )}

            <h5>Alumnos</h5>
            <div className="wrapper both">
               {students.map((student, i) => (
                  <div className="student" key={i}>
                     <p className="name">{student.name}</p>
                     <input
                        className="form-checkbox"
                        type="checkbox"
                        checked={student.checked}
                        onChange={(e) => onChange(e, i)}
                        name="student"
                        id={`cb${period}-${i}`}
                     />
                     <label
                        className="checkbox-lbl"
                        id="check"
                        htmlFor={`cb${period}-${i}`}
                     >
                        {student.checked ? "Si" : "No"}
                     </label>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

export default Certificate;
