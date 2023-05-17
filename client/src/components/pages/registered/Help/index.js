import React from "react";
import { connect } from "react-redux";
import {
   FaPlus,
   FaUserPlus,
   FaUserEdit,
   FaUserMinus,
   FaUnlock,
   FaSearch,
   FaEdit,
   FaCloudUploadAlt,
   FaTrashAlt,
   FaPenFancy,
   FaGraduationCap,
   FaScroll,
   FaAddressCard,
   FaMoneyCheckAlt,
   FaFileInvoiceDollar,
   FaHandPointRight,
   FaHandPointDown,
   FaDollarSign,
} from "react-icons/fa";
import { ImFilePdf } from "react-icons/im";
import { FiSave } from "react-icons/fi";
import { CgNotes } from "react-icons/cg";
import { IoIosListBox } from "react-icons/io";
import { GoTriangleRight, GoTriangleDown } from "react-icons/go";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import { BiFilterAlt, BiHelpCircle } from "react-icons/bi";

import { useState, useEffect } from "react";

import "./style.scss";

const Help = ({ auth: { userLogged } }) => {
   useEffect(() => {
      setAdminValues((prev) => ({
         ...prev,
         isAdmin:
            userLogged.type === "admin" || userLogged.type === "admin&teacher",
      }));
   }, [userLogged]);

   const [adminValues, setAdminValues] = useState({
      users: false,
      enrollments: false,
      classes: false,
      installments: false,
      categories: false,
      register: false,
      other: false,
      isAdmin: false,
   });

   const [usersAdmin, setUsersAdmin] = useState({
      registerUser: false,
      editUser: false,
      deleteUser: false,
      credentials: false,
      search: false,
      uploadImage: false,
      inactivateUser: false,
   });

   const [enrollAdmin, setEnrollAdmin] = useState({
      enroll: false,
      editEnroll: false,
      deleteEnroll: false,
      printEnroll: false,
   });

   const [classAdmin, setClassAdmin] = useState({
      registerClass: false,
      editClass: false,
      deleteClass: false,
      printClass: false,
      addGrades: false,
      printGrades: false,
      printCertificates: false,
      updateGradeType: false,
      updateAttendance: false,
      printAttendances: false,
      observations: false,
      reportCard: false,
   });

   const [installAdmin, setInstallAdmin] = useState({
      editInstall: false,
      printInstall: false,
      deleteInstall: false,
      invoice: false,
   });

   const [categoriesAdmin, setCategoriesAdmin] = useState({
      editCategories: false,
      printCategories: false,
   });

   const [registerAdmin, setRegisterAdmin] = useState({
      closeRegister: false,
      balanceRegister: false,
      addExpences: false,
      printIncome: false,
      printExpences: false,
      printWithdrawals: false,
      printMonthWithdrawals: false,
      printTransactions: false,
      printMonthTransactions: false,
      updateTransactionType: false,
   });

   const [otherAdmin, setOtherAdmin] = useState({
      updateSalaries: false,
      updateDiscount: false,
      updateTowns: false,
      mentions: false,
   });

   const {
      users,
      enrollments,
      classes,
      installments,
      categories,
      register,
      other,
      isAdmin,
   } = adminValues;

   const {
      registerUser,
      editUser,
      deleteUser,
      credentials,
      search,
      uploadImage,
      inactivateUser,
   } = usersAdmin;

   const { enroll, editEnroll, deleteEnroll, printEnroll } = enrollAdmin;

   const {
      registerClass,
      editClass,
      deleteClass,
      printClass,
      addGrades,
      printGrades,
      printCertificates,
      updateGradeType,
      updateAttendance,
      printAttendances,
      observations,
      reportCard,
   } = classAdmin;

   const { editInstall, printInstall, deleteInstall, invoice } = installAdmin;

   const { editCategories, printCategories } = categoriesAdmin;

   const {
      closeRegister,
      balanceRegister,
      addExpences,
      printIncome,
      printExpences,
      printWithdrawals,
      printMonthWithdrawals,
      printTransactions,
      printMonthTransactions,
      updateTransactionType,
   } = registerAdmin;

   const { updateSalaries, updateDiscount, updateTowns, mentions } = otherAdmin;

   return (
      <div className="bg-white help">
         <h2 className="heading-primary">
            <BiHelpCircle />
            &nbsp;Ayuda
         </h2>
         <div className="list-first">
            <div
               className="list-first-heading"
               onClick={() =>
                  setAdminValues((prev) => ({
                     ...prev,
                     users: !users,
                  }))
               }
            >
               <span className="pointer">
                  {users ? <FaHandPointDown /> : <FaHandPointRight />}
               </span>
               <p className="list-first-heading-title">Usuarios</p>
            </div>

            {users && (
               <div className="list-second">
                  {(isAdmin || userLogged.type === "secretary") && (
                     <>
                        <div
                           className="list-second-heading"
                           onClick={() =>
                              setUsersAdmin((prev) => ({
                                 ...prev,
                                 registerUser: !registerUser,
                              }))
                           }
                        >
                           <span className="pointer">
                              {registerUser ? (
                                 <GoTriangleDown />
                              ) : (
                                 <GoTriangleRight />
                              )}
                           </span>
                           <h4 className="list-second-heading-title">
                              Registrar usuario
                           </h4>
                        </div>
                        {registerUser && (
                           <ul>
                              <li>
                                 Desde la página principal ir a "Búsqueda" en el
                                 menú de la izquierda o en el menú de la barra
                                 superior de color azul (tres líneas) que se
                                 encuentra arriba a la derecha.
                              </li>
                              <li>
                                 Hacer click en el botón que dice "Registrar
                                 Usuario"{" "}
                                 <button className="btn btn-dark">
                                    <FaUserPlus /> &nbsp;Registrar Usuario
                                 </button>{" "}
                                 que se encuentra arriba a la derecha.
                              </li>
                              <li>
                                 Seleccionar el tipo de usuario del menú
                                 desplegable.
                              </li>
                              <li>
                                 Cargar todos los datos que pide (desde DNI en
                                 la mayoría de los casos).
                              </li>
                              <li>
                                 Si selecciona el usuario "Alumno", cargar el
                                 celular del alumno y el de los padres desde el
                                 botón{" "}
                                 <button className="btn btn-tertiary">
                                    <FaPlus />
                                    <span className="hide-sm">
                                       &nbsp;Celular
                                    </span>
                                 </button>{" "}
                                 en donde debe colocar el tipo de vínculo con el
                                 alumno, nombre y celular. Rellenar todos los
                                 campos siguientes, seleccionar el tipo de
                                 descuento (los mas usados es "Ninguno" o
                                 "Hermanos"), si es que tiene, y cuando se
                                 realiza el recargo (el día 15 en general).
                              </li>
                              <li>
                                 Si selecciona el usuario "Tutor" debe agregar
                                 los alumnos que están vinculados con ese tutor
                                 (para ello los alumnos deben estar previamente
                                 cargados).
                              </li>
                              <li>
                                 Para finalizar, hacer click en el botón
                                 "Registrar"{" "}
                                 <button className="btn btn-primary">
                                    Registrar
                                 </button>{" "}
                                 que se encuentra al final de la página y
                                 aceptar en la pantalla emergente.
                              </li>
                           </ul>
                        )}
                     </>
                  )}
                  {(isAdmin || userLogged.type === "secretary") && (
                     <>
                        <div
                           className="list-second-heading"
                           onClick={() =>
                              setUsersAdmin((prev) => ({
                                 ...prev,
                                 editUser: !editUser,
                              }))
                           }
                        >
                           <span className="pointer">
                              {editUser ? (
                                 <GoTriangleDown />
                              ) : (
                                 <GoTriangleRight />
                              )}
                           </span>
                           <h4 className="list-second-heading-title">
                              Editar usuario
                           </h4>
                        </div>
                        {editUser && (
                           <ul>
                              <li>
                                 Desde la página principal ir a "Búsqueda" en el
                                 menú de la izquierda o en el menú de la barra
                                 superior de color azul (tres líneas) que se
                                 encuentra arriba a la derecha.
                              </li>
                              <li>
                                 Ir a la pestaña correspondiente dependiendo del
                                 usuario que desea buscar.
                              </li>
                              <li>
                                 Ingresar los datos del usuario para buscarlo
                                 (nombre y/o apellido).
                              </li>
                              <li>
                                 Hacer click en el botón "Buscar"{" "}
                                 <button className="btn btn-light">
                                    <BiFilterAlt />
                                    &nbsp;Buscar
                                 </button>
                                 .
                              </li>
                              <li>
                                 Seleccionar el usuario haciendo click sobre el
                                 nombre.
                              </li>
                              <li>
                                 Hacer click en el botón "Editar"{" "}
                                 <button className="btn btn-mix-secondary">
                                    <FaUserEdit />
                                    &nbsp;Editar
                                 </button>{" "}
                                 que se encuentra debajo de los datos del
                                 usuario.
                              </li>
                              <li>Modificar los datos necesarios.</li>
                              <li>
                                 Hacer click en el botón Guardar Cambios{" "}
                                 <button className="btn btn-primary">
                                    <FaUserEdit />
                                    &nbsp;Guardar Cambios
                                 </button>{" "}
                                 que se encuentra al final de la página y en
                                 "Aceptar" en la pantalla emergente.
                              </li>
                           </ul>
                        )}
                     </>
                  )}
                  {(isAdmin || userLogged.type === "secretary") && (
                     <>
                        <div
                           className="list-second-heading"
                           onClick={() =>
                              setUsersAdmin((prev) => ({
                                 ...prev,
                                 deleteUser: !deleteUser,
                              }))
                           }
                        >
                           <span className="pointer">
                              {deleteUser ? (
                                 <GoTriangleDown />
                              ) : (
                                 <GoTriangleRight />
                              )}
                           </span>
                           <h4 className="list-second-heading-title">
                              Eliminar usuario
                           </h4>
                        </div>
                        {deleteUser && (
                           <ul>
                              <li>
                                 Recomendamos no eliminar un usuario. En caso de
                                 que quiera que no aparezca más entre los
                                 usuarios activos, lo único que debería hacer es
                                 desactivarlo.
                              </li>
                              <li>
                                 Desde la página principal ir a "Búsqueda" en el
                                 menú de la izquierda o en el menú de la barra
                                 superior de color azul (tres líneas) que se
                                 encuentra arriba a la derecha.
                              </li>
                              <li>
                                 Ir a la pestaña correspondiente dependiendo del
                                 usuario que desea buscar.
                              </li>
                              <li>
                                 Ingresar los datos del usuario para buscarlo
                                 (nombre y/o apellido).
                              </li>
                              <li>
                                 Hacer click en el botón "Buscar"{" "}
                                 <button className="btn btn-light">
                                    <BiFilterAlt />
                                    &nbsp;Buscar
                                 </button>
                                 .
                              </li>
                              <li>
                                 Seleccionar el usuario haciendo click sobre el
                                 nombre.
                              </li>
                              <li>
                                 Hacer click en el botón "Eliminar"{" "}
                                 <button className="btn btn-danger">
                                    <FaUserMinus />
                                    &nbsp;Eliminar
                                 </button>{" "}
                                 que se encuentra debajo de los datos del
                                 usuario.
                              </li>
                              <li>
                                 Hacer click en "Aceptar" en la pantalla
                                 emergente.
                              </li>
                           </ul>
                        )}
                     </>
                  )}
                  <>
                     <div
                        className="list-second-heading"
                        onClick={() =>
                           setUsersAdmin((prev) => ({
                              ...prev,
                              credentials: !credentials,
                           }))
                        }
                     >
                        <span className="pointer">
                           {credentials ? (
                              <GoTriangleDown />
                           ) : (
                              <GoTriangleRight />
                           )}
                        </span>
                        <h4 className="list-second-heading-title">
                           Modificar credenciales (Email y Contraseña)
                        </h4>
                     </div>
                     {credentials && (
                        <ul>
                           <li>
                              Desde la página principal ir a "Búsqueda" en el
                              menú de la izquierda o en el menú de la barra
                              superior de color azul (tres líneas) que se
                              encuentra arriba a la derecha.
                           </li>
                           <li>
                              Ir a la pestaña correspondiente dependiendo del
                              usuario que desea buscar.
                           </li>
                           <li>
                              Ingresar los datos del usuario para buscarlo
                              (nombre y/o apellido).
                           </li>
                           <li>
                              Hacer click en el botón "Buscar"{" "}
                              <button className="btn btn-light">
                                 <BiFilterAlt />
                                 &nbsp;Buscar
                              </button>
                              .
                           </li>
                           <li>
                              Seleccionar el usuario haciendo click sobre el
                              nombre.
                           </li>
                           <li>
                              Hacer click en el botón "Editar"{" "}
                              <button className="btn btn-mix-secondary">
                                 <FaUserEdit />
                                 &nbsp;Editar
                              </button>{" "}
                              que se encuentra debajo de los datos del usuario.
                           </li>
                           <li>
                              Hacer click en el botón "Modificar credenciales"{" "}
                              <button className="btn btn-primary">
                                 <FaUnlock />
                                 &nbsp;Modificar credenciales
                              </button>{" "}
                              que se encuentra arriba a la derecha de la
                              pantalla.
                           </li>
                           <li>Modificar los datos necesarios.</li>
                           <li>
                              Si necesita modificar la contraseña, colocarla en
                              donde dice "Nueva contraseña" y volver a repetirla
                              donde dice "Confirmación de contraseña".
                           </li>
                           <li>
                              Hacer click en el botón Guardar Cambios{" "}
                              <button className="btn btn-primary">
                                 <FaUserEdit />
                                 &nbsp;Guardar Cambios
                              </button>{" "}
                              que se encuentra al final de la página y "Aceptar"
                              en la pantalla emergente.
                           </li>
                        </ul>
                     )}
                  </>
                  {(isAdmin ||
                     userLogged.type === "secretary" ||
                     userLogged.type === "classManager") && (
                     <>
                        <div
                           className="list-second-heading"
                           onClick={() =>
                              setUsersAdmin((prev) => ({
                                 ...prev,
                                 search: !search,
                              }))
                           }
                        >
                           <span className="pointer">
                              {search ? (
                                 <GoTriangleDown />
                              ) : (
                                 <GoTriangleRight />
                              )}
                           </span>
                           <h4 className="list-second-heading-title">
                              Búsqueda de usuarios
                           </h4>
                        </div>
                        {search && (
                           <ul>
                              <li>
                                 Desde la página principal ir a "Búsqueda" en el
                                 menú de la izquierda o en el menú de la barra
                                 superior de color azul (tres líneas) que se
                                 encuentra arriba a la derecha.
                              </li>
                              <li>
                                 Ir a la pestaña correspondiente dependiendo del
                                 usuario que desea buscar.
                              </li>
                              <li>
                                 Ingresar los datos del/los usuario/s para
                                 buscarlos.
                              </li>
                              <li>
                                 Hacer click en el botón "Buscar"{" "}
                                 <button className="btn btn-light">
                                    <BiFilterAlt />
                                    &nbsp;Buscar
                                 </button>
                                 .
                              </li>
                              <li>
                                 Le aparecerá una lista de todos los usuarios
                                 que cumplen con dichos filtros.
                              </li>
                              <li>
                                 Si desea generar el pdf de la lista haga click
                                 en el botón{" "}
                                 <button className="btn btn-secondary">
                                    <ImFilePdf />
                                 </button>{" "}
                                 que está al final a la derecha.
                              </li>
                              <li>
                                 Si desea ver la info de un usuario, haga click
                                 en el nombre del mismo.
                              </li>
                              <li>
                                 En la pantalla aparecerá la información general
                                 del usuario junto con su imágen si esta está
                                 cargada y otra información dependiendo del tipo
                                 de usuario.
                              </li>
                              <li>
                                 Si es alumno mostrará la siguiente información:
                                 <div className="list-inside">
                                    <p>
                                       Tutores (solo si estos están previamente
                                       cargados). Se puede ver la información de
                                       estos usuarios haciendo click en "Ver
                                       Info"{" "}
                                       <button className="btn-text">
                                          Ver Info
                                       </button>{" "}
                                       que se encuentra a su derecha.
                                    </p>
                                    <p>
                                       Todos los cursos a los que el alumno ha
                                       asistitdo. Se pueden ver las notas,
                                       inasistencias, clases y demás información
                                       haciendo click en "Ver Info"{" "}
                                       <button className="btn-text">
                                          Ver Info
                                       </button>{" "}
                                       que se encuentra a su derecha.
                                    </p>
                                    <p>
                                       Los datos de la clase a la que está
                                       asistiendo el corriente año. Del lado
                                       izquierdo se puede acceder a la clase y
                                       toda su información a través del botón
                                       "Ver Info"{" "}
                                       <button className="btn-text">
                                          Ver Info
                                       </button>{" "}
                                       que se encuentra debajo, y del lado
                                       derecho se puede ver el profesor (se
                                       puede acceder a su información haciendo
                                       click en "Ver Info" que se encuentra
                                       debajo) y horarios de la clase.
                                    </p>
                                    <p>
                                       Las notas de los bimestres y finales si
                                       estas se encuentran cargadas.
                                    </p>
                                    <p>Las inasistencias.</p>
                                    <p>
                                       Observaciones si es que el profesor las
                                       ha cargado.
                                    </p>
                                    <p>Cuotas pendientes que el alumno debe.</p>
                                    <p>
                                       Y también se pueden ver los pagos
                                       anteriores al hacer click en "Facturas
                                       Pagas"{" "}
                                       <button className="btn-text liner">
                                          Facturas Pagas
                                       </button>
                                       . Si se desea ver una factura en
                                       particular, hacer click en la lupita{" "}
                                       <button className="btn-text">
                                          <FaSearch />
                                       </button>{" "}
                                       que se encuentra al lado de la factura.
                                    </p>
                                 </div>
                              </li>
                              <li>
                                 Si es tutor mostrará la siguiente información:
                                 <div className="list-inside">
                                    <p>
                                       Alumnos a cargo (solo si estos están
                                       previamente cargados). Se puede ver la
                                       información de estos usuarios haciendo
                                       click en "Ver Info"{" "}
                                       <button className="btn-text">
                                          Ver Info
                                       </button>{" "}
                                       que se encuentra a su derecha.
                                    </p>
                                 </div>
                              </li>
                              <li>
                                 Si es profesor mostrará la siguiente
                                 información:
                                 <div className="list-inside">
                                    <p>
                                       El listado de los cursos que dicho
                                       profesor tiene a cargo. Para ver la
                                       información de estos haga click en "Ver"{" "}
                                       <button className="btn-text">Ver</button>{" "}
                                       que se encuentra a su derecha.
                                    </p>
                                 </div>
                              </li>
                           </ul>
                        )}
                     </>
                  )}
                  <>
                     <div
                        className="list-second-heading"
                        onClick={() =>
                           setUsersAdmin((prev) => ({
                              ...prev,
                              uploadImage: !uploadImage,
                           }))
                        }
                     >
                        <span className="pointer">
                           {uploadImage ? (
                              <GoTriangleDown />
                           ) : (
                              <GoTriangleRight />
                           )}
                        </span>
                        <h4 className="list-second-heading-title">
                           Subir imágen en el perfil
                        </h4>
                     </div>
                     {uploadImage && (
                        <ul>
                           <li>
                              Desde la página principal ir a "Búsqueda" en el
                              menú de la izquierda o en el menú de la barra
                              superior de color azul (tres líneas) que se
                              encuentra arriba a la derecha.
                           </li>
                           <li>
                              Ir a la pestaña correspondiente dependiendo del
                              usuario que desea buscar.
                           </li>
                           <li>
                              Ingresar los datos del usuario para buscarlo
                              (nombre y/o apellido).
                           </li>
                           <li>
                              Hacer click en el botón "Buscar"{" "}
                              <button className="btn btn-light">
                                 <BiFilterAlt />
                                 &nbsp;Buscar
                              </button>
                              .
                           </li>
                           <li>
                              Seleccionar el usuario haciendo click sobre el
                              nombre.
                           </li>
                           <li>
                              Hacer click en el botón "Editar"{" "}
                              <button className="btn btn-mix-secondary">
                                 <FaUserEdit />
                                 &nbsp;Editar
                              </button>{" "}
                              que se encuentra debajo de los datos del usuario.
                           </li>
                           <li>
                              Ir casi al final de la página donde se encuentra
                              el botón que dice "Subir imágen"{" "}
                              <div className="form">
                                 <div className="upl-img">
                                    <div className="fileUpload">
                                       <input
                                          id="fileInput"
                                          className="upload"
                                       />
                                       <span>
                                          <FaCloudUploadAlt />
                                          &nbsp;Subir imágen
                                       </span>
                                    </div>
                                 </div>
                              </div>{" "}
                              y hacerle click.
                           </li>
                           <li>
                              Buscar y seleccionar la imágen que se quiere subir
                              y hacer click en "Abrir".
                           </li>
                           <li>
                              Hacer click en el botón Guardar Cambios{" "}
                              <button className="btn btn-primary">
                                 <FaUserEdit />
                                 &nbsp;Guardar Cambios
                              </button>{" "}
                              que se encuentra al final de la página y en
                              "Aceptar" en la pantalla emergente.
                           </li>
                        </ul>
                     )}
                  </>
                  {(isAdmin || userLogged.type === "secretary") && (
                     <>
                        <div
                           className="list-second-heading"
                           onClick={() =>
                              setUsersAdmin((prev) => ({
                                 ...prev,
                                 inactivateUser: !inactivateUser,
                              }))
                           }
                        >
                           <span className="pointer">
                              {inactivateUser ? (
                                 <GoTriangleDown />
                              ) : (
                                 <GoTriangleRight />
                              )}
                           </span>
                           <h4 className="list-second-heading-title">
                              Desactivar/Activar un usuario
                           </h4>
                        </div>
                        {inactivateUser && (
                           <ul>
                              <li>
                                 Desde la página principal ir a "Búsqueda" en el
                                 menú de la izquierda o en el menú de la barra
                                 superior de color azul (tres líneas) que se
                                 encuentra arriba a la derecha.
                              </li>
                              <li>
                                 Ir a la pestaña correspondiente dependiendo del
                                 usuario que desea buscar.
                              </li>
                              <li>
                                 Ingresar los datos del usuario para buscarlo
                                 (nombre y/o apellido).
                              </li>
                              <li>
                                 Hacer click en el botón "Buscar"{" "}
                                 <button className="btn btn-light">
                                    <BiFilterAlt />
                                    &nbsp;Buscar
                                 </button>
                                 .
                              </li>
                              <li>
                                 Seleccionar el usuario haciendo click sobre el
                                 nombre.
                              </li>
                              <li>
                                 Hacer click en el botón "Editar"{" "}
                                 <button className="btn btn-mix-secondary">
                                    <FaUserEdit />
                                    &nbsp;Editar
                                 </button>{" "}
                                 que se encuentra debajo de los datos del
                                 usuario.
                              </li>
                              <li>
                                 Ir casi al final de la página donde se
                                 encuentra el checkbox "Activo" o "Inactivo"{" "}
                                 <input
                                    className="form-checkbox"
                                    type="checkbox"
                                    name="active"
                                    id="active"
                                 />
                                 <label
                                    className="checkbox-lbl"
                                    htmlFor="active"
                                 >
                                    Activo
                                 </label>{" "}
                                 y hacerle click.
                              </li>
                              <li>Aceptar en la pantalla emergente.</li>
                              <li>
                                 Hacer click en el botón Guardar Cambios{" "}
                                 <button className="btn btn-primary">
                                    <FaUserEdit />
                                    &nbsp;Guardar Cambios
                                 </button>{" "}
                                 que se encuentra al final de la página y en
                                 "Aceptar" en la pantalla emergente.
                              </li>
                           </ul>
                        )}
                     </>
                  )}
               </div>
            )}
         </div>
         {(isAdmin || userLogged.type === "secretary") && (
            <div className="list-first">
               <div
                  className="list-first-heading"
                  onClick={() =>
                     setAdminValues((prev) => ({
                        ...prev,
                        enrollments: !enrollments,
                     }))
                  }
               >
                  <span className="pointer">
                     {enrollments ? <FaHandPointDown /> : <FaHandPointRight />}
                  </span>
                  <p className="list-first-heading-title">Inscripciones</p>
               </div>

               {enrollments && (
                  <div className="list-second">
                     <>
                        <div
                           className="list-second-heading"
                           onClick={() =>
                              setEnrollAdmin((prev) => ({
                                 ...prev,
                                 enroll: !enroll,
                              }))
                           }
                        >
                           <span className="pointer">
                              {enroll ? (
                                 <GoTriangleDown />
                              ) : (
                                 <GoTriangleRight />
                              )}
                           </span>
                           <h4 className="list-second-heading-title">
                              Inscribir un alumno
                           </h4>
                        </div>
                        {enroll && (
                           <ul>
                              <li>
                                 Desde la página principal ir a "Inscripción" en
                                 el menú de la izquierda o en el menú de la
                                 barra superior de color azul (tres líneas) que
                                 se encuentra arriba a la derecha.
                              </li>
                              <li>Buscar el alumno por apellido y/o nombre.</li>
                              <li>
                                 Seleccionar la categoría a la que va a asistir
                                 el alumno.
                              </li>
                              <li>
                                 Seleccione el año para el que es la inscripción
                                 (en el caso de que se quiera inscribir para el
                                 año siguiente).
                              </li>
                              <li>
                                 Si es una inscripción para el año en curso, hay
                                 que ingresar a partir de que mes se lo desea
                                 inscribir (es para que el programa genere las
                                 cuotas desde el mes correcto, sino puede
                                 generar una cuota de más o de menos y habría
                                 que hacerlo manualmente).
                              </li>
                              <li>
                                 Hacer click en el botón Inscribir{" "}
                                 <button className="btn btn-primary">
                                    <FaUserEdit />
                                    &nbsp; Inscribir
                                 </button>{" "}
                                 que se encuentra al final de la página y
                                 aceptar en la pantalla emergente.
                              </li>
                           </ul>
                        )}
                     </>
                     <>
                        <div
                           className="list-second-heading"
                           onClick={() =>
                              setEnrollAdmin((prev) => ({
                                 ...prev,
                                 editEnroll: !editEnroll,
                              }))
                           }
                        >
                           <span className="pointer">
                              {editEnroll ? (
                                 <GoTriangleDown />
                              ) : (
                                 <GoTriangleRight />
                              )}
                           </span>
                           <h4 className="list-second-heading-title">
                              Editar inscripción de un alumno
                           </h4>
                        </div>
                        {editEnroll && (
                           <ul>
                              <li>
                                 Desde la página principal ir a "Inscripción" en
                                 el menú de la izquierda o en el menú de la
                                 barra superior de color azul (tres líneas) que
                                 se encuentra arriba a la derecha.
                              </li>
                              <li>
                                 Ir al botón "Listado"{" "}
                                 <button className="btn btn-light">
                                    <IoIosListBox />
                                    &nbsp; Listado
                                 </button>{" "}
                                 que está en la parte superior derecha.
                              </li>
                              <li>
                                 Buscar la inscripción rellenando los campos
                                 necesarios de los filtros
                                 (Nombre/Apellido/Categoría/Año/Fechas).
                              </li>
                              <li>
                                 Hacer click en el botón "Buscar"{" "}
                                 <button className="btn btn-light">
                                    <BiFilterAlt />
                                    &nbsp;Buscar
                                 </button>
                                 .
                              </li>
                              <li>
                                 Localizar la inscripción en la lista de abajo y
                                 hacer click en el botón editar{" "}
                                 <button className="btn btn-success">
                                    <FaEdit />
                                 </button>{" "}
                                 que se encuentra a la derecha del mismo.
                              </li>
                              <li>
                                 Modificar la categoría a la que se le quiere
                                 cambiar.
                              </li>
                              <li>
                                 Seleccionar el mes a partir del cual se quiere
                                 hacer efectivo el cambio (esto es para que se
                                 modifique el valor de la cuota
                                 correspondiente).
                              </li>
                              <li>
                                 Hacer click en el botón Guardar Cambios{" "}
                                 <button className="btn btn-primary">
                                    <FiSave />
                                    &nbsp;Guardar Cambios
                                 </button>{" "}
                                 que se encuentra al final de la página y en
                                 "Aceptar" en la pantalla emergente.
                              </li>
                           </ul>
                        )}
                     </>
                     <>
                        <div
                           className="list-second-heading"
                           onClick={() =>
                              setEnrollAdmin((prev) => ({
                                 ...prev,
                                 deleteEnroll: !deleteEnroll,
                              }))
                           }
                        >
                           <span className="pointer">
                              {deleteEnroll ? (
                                 <GoTriangleDown />
                              ) : (
                                 <GoTriangleRight />
                              )}
                           </span>
                           <h4 className="list-second-heading-title">
                              Eliminar una inscripción
                           </h4>
                        </div>
                        {deleteEnroll && (
                           <ul>
                              <li>
                                 Desde la página principal ir a "Inscripción" en
                                 el menú de la izquierda o en el menú de la
                                 barra superior de color azul (tres líneas) que
                                 se encuentra arriba a la derecha.
                              </li>
                              <li>
                                 Ir al botón "Listado"{" "}
                                 <button className="btn btn-light">
                                    <IoIosListBox />
                                    &nbsp; Listado
                                 </button>{" "}
                                 que está en la parte superior derecha.
                              </li>
                              <li>
                                 Buscar la inscripción rellenando los campos
                                 necesarios de los filtros
                                 (Nombre/Apellido/Categoría/Año/Fechas).
                              </li>
                              <li>
                                 Hacer click en el botón "Buscar"{" "}
                                 <button className="btn btn-light">
                                    <BiFilterAlt />
                                    &nbsp;Buscar
                                 </button>
                                 .
                              </li>
                              <li>
                                 Localizar la inscripción en la lista de abajo y
                                 hacer click en el botón eliminar{" "}
                                 <button className="btn btn-danger">
                                    <FaTrashAlt />
                                 </button>{" "}
                                 que se encuentra a la derecha del mismo.Tener
                                 en cuenta que cuando se elimina una
                                 inscripción, también se elimina el alumno de la
                                 clase, sus notas y asistencias y las cuotas
                                 relacionadas con dicha inscripción.
                              </li>
                              <li>
                                 Hacer click en el botón "Aceptar" en la ventana
                                 emergente.
                              </li>
                           </ul>
                        )}
                     </>
                     <>
                        <div
                           className="list-second-heading"
                           onClick={() =>
                              setEnrollAdmin((prev) => ({
                                 ...prev,
                                 printEnroll: !printEnroll,
                              }))
                           }
                        >
                           <span className="pointer">
                              {printEnroll ? (
                                 <GoTriangleDown />
                              ) : (
                                 <GoTriangleRight />
                              )}
                           </span>
                           <h4 className="list-second-heading-title">
                              Ver/Imprimir listado de inscripciones
                           </h4>
                        </div>
                        {printEnroll && (
                           <ul>
                              <li>
                                 Desde la página principal ir a "Inscripción" en
                                 el menú de la izquierda o en el menú de la
                                 barra superior de color azul (tres líneas) que
                                 se encuentra arriba a la derecha.
                              </li>
                              <li>
                                 Ir al botón "Listado"{" "}
                                 <button className="btn btn-light">
                                    <IoIosListBox />
                                    &nbsp; Listado
                                 </button>{" "}
                                 que está en la parte superior derecha.
                              </li>
                              <li>
                                 Buscar la inscripción rellenando los campos
                                 necesarios de los filtros
                                 (Nombre/Apellido/Categoría/Año/Fechas).
                              </li>
                              <li>
                                 Hacer click en el botón "Buscar"{" "}
                                 <button className="btn btn-light">
                                    <BiFilterAlt />
                                    &nbsp;Buscar
                                 </button>
                                 .
                              </li>
                              <li>
                                 Si desea generar el pdf de la lista haga click
                                 en el botón{" "}
                                 <button className="btn btn-secondary">
                                    <ImFilePdf />
                                 </button>{" "}
                                 que está al final a la derecha.
                              </li>
                           </ul>
                        )}
                     </>
                  </div>
               )}
            </div>
         )}
         {userLogged.type !== "guardian" && userLogged.type !== "student" && (
            <div className="list-first">
               <div
                  className="list-first-heading"
                  onClick={() =>
                     setAdminValues((prev) => ({
                        ...prev,
                        classes: !classes,
                     }))
                  }
               >
                  <span className="pointer">
                     {classes ? <FaHandPointDown /> : <FaHandPointRight />}
                  </span>
                  <p className="list-first-heading-title">Clases</p>
               </div>

               {classes && (
                  <div className="list-second">
                     {(isAdmin || userLogged.type === "secretary") && (
                        <>
                           <div
                              className="list-second-heading"
                              onClick={() =>
                                 setClassAdmin((prev) => ({
                                    ...prev,
                                    registerClass: !registerClass,
                                 }))
                              }
                           >
                              <span className="pointer">
                                 {registerClass ? (
                                    <GoTriangleDown />
                                 ) : (
                                    <GoTriangleRight />
                                 )}
                              </span>
                              <h4 className="list-second-heading-title">
                                 Crear una clase
                              </h4>
                           </div>
                           {registerClass && (
                              <ul>
                                 <li>
                                    Desde la página principal ir a "Clases" en
                                    el menú de la izquierda o en el menú de la
                                    barra superior de color azul (tres líneas)
                                    que se encuentra arriba a la derecha.
                                 </li>
                                 <li>
                                    En la parte inferior de la pantalla, hacer
                                    click en el botón "Nueva Clase"{" "}
                                    <button className="btn btn-dark">
                                       <FaPlus />
                                       &nbsp;Nueva Clase
                                    </button>
                                    .
                                 </li>
                                 <li>
                                    Seleccionar la categoría que va a tener la
                                    clase nueva.
                                 </li>
                                 <li>
                                    Hacer click en el botón "Buscar"{" "}
                                    <button className="btn btn-light">
                                       <BiFilterAlt />
                                       &nbsp;Buscar
                                    </button>
                                    .
                                 </li>
                                 <li>
                                    Ir a la lista que aparece debajo y agregar
                                    los alumnos que irían a dicha clase haciendo
                                    click en el botón "Agregar"{" "}
                                    <button className="btn btn-dark">
                                       <FaPlus />
                                       &nbsp; Agregar
                                    </button>{" "}
                                    que se encuentra a la derecha del mismo.
                                 </li>
                                 <li>Ir a la pesataña "Clase".</li>
                                 <li>
                                    Rellenar los datos de la clase como
                                    profesor, aula, días y horarios.
                                 </li>
                                 <li>
                                    Solo en el caso de que los días tengan
                                    distintos horarios, hacer click sobre el
                                    checkbox que dice{" "}
                                    <div className="form">
                                       <input
                                          className="form-checkbox"
                                          type="checkbox"
                                       />
                                       <label
                                          className="checkbox-lbl"
                                          htmlFor="active"
                                       >
                                          Mismo Horario
                                       </label>
                                    </div>{" "}
                                    .
                                 </li>
                                 <li>
                                    Revisar que la lista de alumnos sea la
                                    correcta.
                                 </li>
                                 <li>
                                    Hacer click en el botón Registrar{" "}
                                    <button className="btn btn-primary">
                                       <FiSave />
                                       &nbsp;Registrar
                                    </button>{" "}
                                    que se encuentra al final de la página y
                                    aceptar en la pantalla emergente.
                                 </li>
                              </ul>
                           )}
                        </>
                     )}
                     {(isAdmin || userLogged.type === "secretary") && (
                        <>
                           <div
                              className="list-second-heading"
                              onClick={() =>
                                 setClassAdmin((prev) => ({
                                    ...prev,
                                    editClass: !editClass,
                                 }))
                              }
                           >
                              <span className="pointer">
                                 {editClass ? (
                                    <GoTriangleDown />
                                 ) : (
                                    <GoTriangleRight />
                                 )}
                              </span>
                              <h4 className="list-second-heading-title">
                                 Editar una clase / Agregar o quitar alumnos de
                                 una clase
                              </h4>
                           </div>
                           {editClass && (
                              <ul>
                                 <li>
                                    Desde la página principal ir a "Clases" en
                                    el menú de la izquierda o en el menú de la
                                    barra superior de color azul (tres líneas)
                                    que se encuentra arriba a la derecha.
                                 </li>
                                 <li>
                                    Si no encuentra la clase fácilmente, rellene
                                    los campos del filtro necesarios en la
                                    sección superior y haga click en el botón
                                    "Buscar"
                                    <button className="btn btn-light">
                                       <BiFilterAlt />
                                       &nbsp;Buscar
                                    </button>
                                    .
                                 </li>
                                 <li>
                                    Ubique la clase que desea modificar y haga
                                    click en "Ver"{" "}
                                    <button className="btn-text">
                                       Ver &rarr;
                                    </button>{" "}
                                    que se encuentra a la derecha de dicha clase
                                    (Si no encuentra la palabra ver, vaya al
                                    final de la página y corra la lista hacia la
                                    derecha con la barra celeste que está debajo
                                    de la lista y busque nuevamente la clase).
                                 </li>
                                 <li>
                                    En la próxima pantalla encontrará
                                    información sobre la clase como ser
                                    profesor, horarios, aula y la lista de
                                    alumnos.
                                 </li>
                                 <li>
                                    Al final de la página haga click en el botón
                                    de editar{" "}
                                    <button className="btn btn-mix-secondary">
                                       <FaEdit />
                                    </button>{" "}
                                    que se encuentra a la derecha entre el botón
                                    de eliminar y generar pdf.
                                 </li>
                                 <li>Modificar los datos necesarios.</li>
                                 <li>
                                    Si se necesita eliminar un alumno de dicha
                                    clase, ir al final de la página y eliminarlo
                                    de la lista de alumnos haciendo click en
                                    "Eliminar"{" "}
                                    <button className="btn btn-danger">
                                       <FaTrashAlt />
                                       &nbsp; Eliminar
                                    </button>{" "}
                                    que se encuentra a la derecha del mismo. .
                                 </li>
                                 <li>
                                    Si se necesita agregar un nuevo alumno, ir a
                                    la pestaña "Alumnos" y seleccionar el alumno
                                    que aparece en la lista con el botón
                                    "Agregar"{" "}
                                    <button className="btn btn-dark">
                                       <FaPlus />
                                       &nbsp; Agregar
                                    </button>{" "}
                                    que se encuentra a la derecha del mismo. Si
                                    el alumno no aparece en la lista, no se
                                    encuentra inscripto (Deberá inscribirlo
                                    previamente).
                                 </li>
                                 <li>
                                    Si no se encuentra en la pestaña "Clase",
                                    selecciónela.
                                 </li>
                                 <li>Vaya al final de la página </li>
                                 <li>
                                    Hacer click en el botón Guardar Cambios{" "}
                                    <button className="btn btn-primary">
                                       <FaEdit />
                                       &nbsp;Guardar Cambios
                                    </button>{" "}
                                    que se encuentra al final de la página y en
                                    "Aceptar" en la pantalla emergente.
                                 </li>
                              </ul>
                           )}
                        </>
                     )}
                     {(isAdmin || userLogged.type === "secretary") && (
                        <>
                           <div
                              className="list-second-heading"
                              onClick={() =>
                                 setClassAdmin((prev) => ({
                                    ...prev,
                                    deleteClass: !deleteClass,
                                 }))
                              }
                           >
                              <span className="pointer">
                                 {deleteClass ? (
                                    <GoTriangleDown />
                                 ) : (
                                    <GoTriangleRight />
                                 )}
                              </span>
                              <h4 className="list-second-heading-title">
                                 Eliminar una clase
                              </h4>
                           </div>
                           {deleteClass && (
                              <ul>
                                 <li>
                                    Desde la página principal ir a "Clases" en
                                    el menú de la izquierda o en el menú de la
                                    barra superior de color azul (tres líneas)
                                    que se encuentra arriba a la derecha.
                                 </li>
                                 <li>
                                    Si no encuentra la clase fácilmente, rellene
                                    los campos del filtro necesarios en la
                                    sección superior y haga click en el botón
                                    "Buscar"
                                    <button className="btn btn-light">
                                       <BiFilterAlt />
                                       &nbsp;Buscar
                                    </button>
                                    .
                                 </li>
                                 <li>
                                    Ubique la clase que desea eliminar y haga
                                    click en "Ver"{" "}
                                    <button className="btn-text">
                                       Ver &rarr;
                                    </button>{" "}
                                    que se encuentra a la derecha de dicha clase
                                    (Si no encuentra la palabra ver, vaya al
                                    final de la página y corra la lista hacia la
                                    derecha con la barra celeste que está debajo
                                    de la lista y busque nuevamente la clase).
                                 </li>
                                 <li>
                                    En la próxima pantalla encontrará
                                    información sobre la clase como ser
                                    profesor, horarios, aula y la lista de
                                    alumnos.
                                 </li>
                                 <li>
                                    Al final de la página haga click en el botón
                                    de eliminar{" "}
                                    <button className="btn btn-danger">
                                       <FaTrashAlt />
                                    </button>{" "}
                                    que se encuentra a la derecha. Tenga en
                                    cuenta que al eliminar la clase, deberá
                                    asignar los alumnos que pertenecían a esta a
                                    una nueva clase.
                                 </li>
                                 <li>
                                    Haga click en "Aceptar" en la pantalla
                                    emergente.
                                 </li>
                              </ul>
                           )}
                        </>
                     )}
                     <>
                        <div
                           className="list-second-heading"
                           onClick={() =>
                              setClassAdmin((prev) => ({
                                 ...prev,
                                 printClass: !printClass,
                              }))
                           }
                        >
                           <span className="pointer">
                              {printClass ? (
                                 <GoTriangleDown />
                              ) : (
                                 <GoTriangleRight />
                              )}
                           </span>
                           <h4 className="list-second-heading-title">
                              Ver información de clase / generar pdf con listado
                              de alumnos
                           </h4>
                        </div>
                        {printClass && (
                           <ul>
                              <li>
                                 Desde la página principal ir a "Clases" en el
                                 menú de la izquierda o en el menú de la barra
                                 superior de color azul (tres líneas) que se
                                 encuentra arriba a la derecha.
                              </li>
                              <li>
                                 Si no encuentra la clase fácilmente, rellene
                                 los campos del filtro necesarios en la sección
                                 superior y haga click en el botón "Buscar"
                                 <button className="btn btn-light">
                                    <BiFilterAlt />
                                    &nbsp;Buscar
                                 </button>
                                 .
                              </li>
                              <li>
                                 Ubique la clase que desea eliminar y haga click
                                 en "Ver"{" "}
                                 <button className="btn-text">
                                    Ver &rarr;
                                 </button>{" "}
                                 que se encuentra a la derecha de dicha clase
                                 (Si no encuentra la palabra ver, vaya al final
                                 de la página y corra la lista hacia la derecha
                                 con la barra celeste que está debajo de la
                                 lista y busque nuevamente la clase).
                              </li>
                              <li>
                                 En la próxima pantalla encontrará información
                                 sobre la clase como ser profesor, horarios,
                                 aula y la lista de alumnos.
                              </li>
                              <li>
                                 Si desea generar el pdf de la lista haga click
                                 en el botón{" "}
                                 <button className="btn btn-secondary">
                                    <ImFilePdf />
                                 </button>{" "}
                                 que está al final al lado de los botones editar
                                 y eliminar.
                              </li>
                           </ul>
                        )}
                     </>
                     <>
                        <div
                           className="list-second-heading"
                           onClick={() =>
                              setClassAdmin((prev) => ({
                                 ...prev,
                                 addGrades: !addGrades,
                              }))
                           }
                        >
                           <span className="pointer">
                              {addGrades ? (
                                 <GoTriangleDown />
                              ) : (
                                 <GoTriangleRight />
                              )}
                           </span>
                           <h4 className="list-second-heading-title">
                              Agregar/Modificar notas a una clase
                           </h4>
                        </div>
                        {addGrades && (
                           <ul>
                              <li>
                                 Desde la página principal ir a "Clases" en el
                                 menú de la izquierda o en el menú de la barra
                                 superior de color azul (tres líneas) que se
                                 encuentra arriba a la derecha.
                              </li>
                              <li>
                                 Si no encuentra la clase fácilmente, rellene
                                 los campos del filtro necesarios en la sección
                                 superior y haga click en el botón "Buscar"
                                 <button className="btn btn-light">
                                    <BiFilterAlt />
                                    &nbsp;Buscar
                                 </button>
                                 .
                              </li>
                              <li>
                                 Ubique la clase a la que desea
                                 agregar/modificar las notas y haga click en
                                 "Ver"{" "}
                                 <button className="btn-text">
                                    Ver &rarr;
                                 </button>{" "}
                                 que se encuentra a la derecha de dicha clase
                                 (Si no encuentra la palabra ver, vaya al final
                                 de la página y corra la lista hacia la derecha
                                 con la barra celeste que está debajo de la
                                 lista y busque nuevamente la clase).
                              </li>
                              <li>
                                 En la próxima pantalla encontrará información
                                 sobre la clase como ser profesor, horarios,
                                 aula y la lista de alumnos.
                              </li>
                              <li>
                                 Vaya al final de la página y haga click en el
                                 botón "Notas"{" "}
                                 <button className="btn btn-primar">
                                    <FaPenFancy />
                                    &nbsp; Notas
                                 </button>{" "}
                                 que está al final a la izquierda.
                              </li>
                              <li>
                                 Seleccione la pestaña correspondiente según las
                                 notas del bimestre que desea agregar/modificar.
                              </li>
                              <li>
                                 Si no están cargados los tipos de notas (no hay
                                 ningun lugar para rellenar con las notas de los
                                 alumnos):
                                 <div className="list-inside">
                                    <p>
                                       Haga click en el botón "+ Nota"{" "}
                                       <button className="btn btn-dark">
                                          <FaPlus />
                                          &nbsp; Nota
                                       </button>{" "}
                                       que está al final entre medio de los
                                       botones de "Guardar Cambios" y de generar
                                       el pdf.
                                    </p>
                                    <p>
                                       Seleccione el tipo de nota que desea
                                       agregar.
                                    </p>
                                    <p>Haga click en "Aceptar".</p>
                                 </div>
                              </li>
                              <li>
                                 Rellene los campos de las notas de los alumnos
                                 correspondientes.
                              </li>
                              <li>
                                 Haga click en el botón "Guardar Cambios"{" "}
                                 <button className="btn btn-primary">
                                    <FiSave />
                                    &nbsp;Guardar Cambios
                                 </button>{" "}
                                 que se encuentra al final de la página y en
                                 "Aceptar" en la pantalla emergente.
                              </li>
                           </ul>
                        )}
                     </>
                     <>
                        <div
                           className="list-second-heading"
                           onClick={() =>
                              setClassAdmin((prev) => ({
                                 ...prev,
                                 printGrades: !printGrades,
                              }))
                           }
                        >
                           <span className="pointer">
                              {printGrades ? (
                                 <GoTriangleDown />
                              ) : (
                                 <GoTriangleRight />
                              )}
                           </span>
                           <h4 className="list-second-heading-title">
                              Generar pdf de notas
                           </h4>
                        </div>
                        {printGrades && (
                           <ul>
                              <li>
                                 Desde la página principal ir a "Clases" en el
                                 menú de la izquierda o en el menú de la barra
                                 superior de color azul (tres líneas) que se
                                 encuentra arriba a la derecha.
                              </li>
                              <li>
                                 Si no encuentra la clase fácilmente, rellene
                                 los campos del filtro necesarios en la sección
                                 superior y haga click en el botón "Buscar"
                                 <button className="btn btn-light">
                                    <BiFilterAlt />
                                    &nbsp;Buscar
                                 </button>
                                 .
                              </li>
                              <li>
                                 Ubique la clase que desea eliminar y haga click
                                 en "Ver"{" "}
                                 <button className="btn-text">
                                    Ver &rarr;
                                 </button>{" "}
                                 que se encuentra a la derecha de dicha clase
                                 (Si no encuentra la palabra ver, vaya al final
                                 de la página y corra la lista hacia la derecha
                                 con la barra celeste que está debajo de la
                                 lista y busque nuevamente la clase).
                              </li>
                              <li>
                                 En la próxima pantalla encontrará información
                                 sobre la clase como ser profesor, horarios,
                                 aula y la lista de alumnos.
                              </li>
                              <li>
                                 Vaya al final de la página y haga click en el
                                 botón "Notas"{" "}
                                 <button className="btn btn-primar">
                                    <FaPenFancy />
                                    &nbsp; Notas
                                 </button>{" "}
                                 que está al final a la izquierda.
                              </li>
                              <li>
                                 En la próxima pantalla donde se pueden cargar
                                 las notas hay dos posibles pdfs que se pueden
                                 generar.
                                 <div className="list-inside">
                                    <p>
                                       El botón de arriba a la derecha que dice
                                       "Todas"{" "}
                                       <button className="btn btn-secondary">
                                          <ImFilePdf />
                                          &nbsp;Todas
                                       </button>{" "}
                                       genera el pdf con todas las notas de
                                       todos los bimestres y con las notas de
                                       fin de año inclusive. Si las notas no
                                       están cargadas pero están cargados los
                                       tipos de notas, se generará un pdf con
                                       los espacios vacíos.
                                    </p>
                                    <p>
                                       El botón{" "}
                                       <button className="btn btn-secondary">
                                          <ImFilePdf />
                                       </button>{" "}
                                       que se encuentra al final de la página a
                                       la derecha genera un pdf con las notas
                                       del bimestre en el que se encuentra. Si
                                       desea imprimir las notas de otro
                                       bimestre, busque la pestaña
                                       correspondiente antes de hacer click en
                                       el botón.
                                    </p>
                                 </div>
                              </li>
                           </ul>
                        )}
                     </>
                     <>
                        <div
                           className="list-second-heading"
                           onClick={() =>
                              setClassAdmin((prev) => ({
                                 ...prev,
                                 printCertificates: !printCertificates,
                              }))
                           }
                        >
                           <span className="pointer">
                              {printCertificates ? (
                                 <GoTriangleDown />
                              ) : (
                                 <GoTriangleRight />
                              )}
                           </span>
                           <h4 className="list-second-heading-title">
                              Generar pdfs de certificados de fin de año
                           </h4>
                        </div>
                        {printCertificates && (
                           <ul>
                              <li>
                                 Desde la página principal ir a "Clases" en el
                                 menú de la izquierda o en el menú de la barra
                                 superior de color azul (tres líneas) que se
                                 encuentra arriba a la derecha.
                              </li>
                              <li>
                                 Si no encuentra la clase fácilmente, rellene
                                 los campos del filtro necesarios en la sección
                                 superior y haga click en el botón "Buscar"
                                 <button className="btn btn-light">
                                    <BiFilterAlt />
                                    &nbsp;Buscar
                                 </button>
                                 .
                              </li>
                              <li>
                                 Ubique la clase que desea eliminar y haga click
                                 en "Ver"{" "}
                                 <button className="btn-text">
                                    Ver &rarr;
                                 </button>{" "}
                                 que se encuentra a la derecha de dicha clase
                                 (Si no encuentra la palabra ver, vaya al final
                                 de la página y corra la lista hacia la derecha
                                 con la barra celeste que está debajo de la
                                 lista y busque nuevamente la clase).
                              </li>
                              <li>
                                 En la próxima pantalla encontrará información
                                 sobre la clase como ser profesor, horarios,
                                 aula y la lista de alumnos.
                              </li>
                              <li>
                                 Vaya al final de la página y haga click en el
                                 botón "Notas"{" "}
                                 <button className="btn btn-primar">
                                    <FaPenFancy />
                                    &nbsp; Notas
                                 </button>{" "}
                                 que está al final a la izquierda.
                              </li>
                              <li>
                                 Vaya a la pestaña "Final" o "Cambridge"
                                 dependiendo de que certificado quiere generar.
                              </li>
                              <li>
                                 Haga click en el botón{" "}
                                 <button className="btn btn-secondary">
                                    <FaGraduationCap />
                                 </button>{" "}
                                 que está al final a la derecha.
                              </li>
                              <li>
                                 Ingrese la fecha para cuando quiere el
                                 certificado (generalmente el día del acto),
                                 seleccione los alumnos de los que quiere el
                                 certificado y haga click en "Aceptar".
                              </li>
                           </ul>
                        )}
                     </>
                     {isAdmin && (
                        <>
                           <div
                              className="list-second-heading"
                              onClick={() =>
                                 setClassAdmin((prev) => ({
                                    ...prev,
                                    updateGradeType: !updateGradeType,
                                 }))
                              }
                           >
                              <span className="pointer">
                                 {updateGradeType ? (
                                    <GoTriangleDown />
                                 ) : (
                                    <GoTriangleRight />
                                 )}
                              </span>
                              <h4 className="list-second-heading-title">
                                 Agregar/Modificar un TIPO de nota
                              </h4>
                           </div>
                           {updateGradeType && (
                              <ul>
                                 <li>
                                    Esto se utiliza en el caso de que se quiera
                                    modificar el nombre, agregar un tipo de nota
                                    nuevo para agregar en la clase o modificar a
                                    que curso ese tipo de nota se puede agregar.
                                 </li>
                                 <li>
                                    Desde la página principal ir a "Clases" en
                                    el menú de la izquierda o en el menú de la
                                    barra superior de color azul (tres líneas)
                                    que se encuentra arriba a la derecha.
                                 </li>
                                 <li>
                                    Ubique cualquier clase y haga click en "Ver"{" "}
                                    <button className="btn-text">
                                       Ver &rarr;
                                    </button>{" "}
                                    que se encuentra a la derecha de esta. (Si
                                    no encuentra la palabra ver, vaya al final
                                    de la página y corra la lista hacia la
                                    derecha con la barra celeste que está debajo
                                    de la lista y busque nuevamente la clase).
                                 </li>
                                 <li>
                                    En la próxima pantalla encontrará
                                    información sobre la clase como ser
                                    profesor, horarios, aula y la lista de
                                    alumnos.
                                 </li>
                                 <li>
                                    Vaya al final de la página y haga click en
                                    el botón "Notas"{" "}
                                    <button className="btn btn-primar">
                                       <FaPenFancy />
                                       &nbsp; Notas
                                    </button>{" "}
                                    que está al final a la izquierda.
                                 </li>
                                 <li>
                                    En la página para cargar notas haga click en
                                    el botón "+ Nota"{" "}
                                    <button className="btn btn-dark">
                                       <FaPlus />
                                       &nbsp; Nota
                                    </button>{" "}
                                    que está al final entre "Guardar Cambios" y
                                    el botón para generar pdf.
                                 </li>
                                 <li>
                                    En la pantalla emergente haga click en el
                                    botón editar{" "}
                                    <button className="btn btn-mix-secondary">
                                       <FaEdit />
                                    </button>{" "}
                                    que está a la derecha de donde se selecciona
                                    el tipo de nota.
                                 </li>
                                 <li>
                                    Modifique el nombre o los cursos a las que
                                    se le puede agregar agregando/sacando el
                                    tick correspondiente.
                                 </li>
                                 <li>
                                    Si desea agregar un tipo de nota nuevo, vaya
                                    al final de la página y haga click en el
                                    botón "Agregar Tipo de Nota"{" "}
                                    <button className="btn btn-primary">
                                       <FaPlus />
                                       &nbsp; Agregar Tipo de Nota
                                    </button>
                                    .
                                 </li>
                                 <li>Ingrese los datos necesarios.</li>
                                 <li>
                                    Haga click en el botón "Guardar"{" "}
                                    <button className="btn btn-primary">
                                       <FiSave />
                                       &nbsp;Guardar
                                    </button>
                                    que se encuentra al final de la página y en
                                    "Aceptar" en la pantalla emergente.
                                 </li>
                              </ul>
                           )}
                        </>
                     )}
                     <>
                        <div
                           className="list-second-heading"
                           onClick={() =>
                              setClassAdmin((prev) => ({
                                 ...prev,
                                 updateAttendance: !updateAttendance,
                              }))
                           }
                        >
                           <span className="pointer">
                              {updateAttendance ? (
                                 <GoTriangleDown />
                              ) : (
                                 <GoTriangleRight />
                              )}
                           </span>
                           <h4 className="list-second-heading-title">
                              Modificar inasistencias en una clase
                           </h4>
                        </div>
                        {updateAttendance && (
                           <ul>
                              <li>
                                 Desde la página principal ir a "Clases" en el
                                 menú de la izquierda o en el menú de la barra
                                 superior de color azul (tres líneas) que se
                                 encuentra arriba a la derecha.
                              </li>
                              <li>
                                 Si no encuentra la clase fácilmente, rellene
                                 los campos del filtro necesarios en la sección
                                 superior y haga click en el botón "Buscar"
                                 <button className="btn btn-light">
                                    <BiFilterAlt />
                                    &nbsp;Buscar
                                 </button>
                                 .
                              </li>
                              <li>
                                 Ubique la clase a la que desea
                                 agregar/modificar las notas y haga click en
                                 "Ver"{" "}
                                 <button className="btn-text">
                                    Ver &rarr;
                                 </button>{" "}
                                 que se encuentra a la derecha de dicha clase
                                 (Si no encuentra la palabra ver, vaya al final
                                 de la página y corra la lista hacia la derecha
                                 con la barra celeste que está debajo de la
                                 lista y busque nuevamente la clase).
                              </li>
                              <li>
                                 En la próxima pantalla encontrará información
                                 sobre la clase como ser profesor, horarios,
                                 aula y la lista de alumnos.
                              </li>
                              <li>
                                 Vaya al final de la página y haga click en el
                                 botón "Inasistencias"{" "}
                                 <button className="btn btn-primary">
                                    <IoCheckmarkCircleSharp />
                                    &nbsp; Inasistencias
                                 </button>{" "}
                                 que está al final entre el botón de "Notas" y
                                 "Observaciones".
                              </li>
                              <li>
                                 Seleccione la pestaña correspondiente según las
                                 inasistencias del bimestre que desea cargar.
                              </li>
                              <li>
                                 Si no están cargadas las fechas del bimestre:
                                 <div className="list-inside">
                                    <p>
                                       Haga click en el botón "+ Día"{" "}
                                       <button className="btn btn-dark">
                                          <FaPlus />
                                          &nbsp; Día
                                       </button>{" "}
                                       que está al final entre medio de los
                                       botones de "Guardar" y de generar el pdf.
                                    </p>
                                    <p>
                                       {" "}
                                       Seleccione la fecha desde cuando comienza
                                       el bimestre y cuando finaliza.
                                    </p>
                                    <p>Haga click en "Aceptar".</p>
                                 </div>
                              </li>
                              <li>
                                 Si desea cargar una fecha que no está en el
                                 listado de días:
                                 <div className="list-inside">
                                    <p>
                                       Haga click en el botón "+ Día"{" "}
                                       <button className="btn btn-dark">
                                          <FaPlus />
                                          &nbsp; Día
                                       </button>{" "}
                                       que está al final entre medio de los
                                       botones de "Guardar" y de generar el pdf.
                                    </p>
                                    <p>Seleccione la fecha que desea cargar.</p>
                                    <p>Haga click en "Aceptar".</p>
                                 </div>
                              </li>
                              <li>
                                 Deseleccione los alumnos en los días
                                 correspondientes.
                              </li>
                              <li>
                                 Haga click en el botón "Guardar"{" "}
                                 <button className="btn btn-primary">
                                    <FiSave />
                                    &nbsp;Guardar
                                 </button>
                                 que se encuentra al final de la página y en
                                 "Aceptar" en la pantalla emergente.
                              </li>
                           </ul>
                        )}
                     </>
                     <>
                        <div
                           className="list-second-heading"
                           onClick={() =>
                              setClassAdmin((prev) => ({
                                 ...prev,
                                 printAttendances: !printAttendances,
                              }))
                           }
                        >
                           <span className="pointer">
                              {printAttendances ? (
                                 <GoTriangleDown />
                              ) : (
                                 <GoTriangleRight />
                              )}
                           </span>
                           <h4 className="list-second-heading-title">
                              Generar pdf de inasistencias/lista de alumnos con
                              las fechas del bimestre
                           </h4>
                        </div>
                        {printAttendances && (
                           <ul>
                              <li>
                                 Desde la página principal ir a "Clases" en el
                                 menú de la izquierda o en el menú de la barra
                                 superior de color azul (tres líneas) que se
                                 encuentra arriba a la derecha.
                              </li>
                              <li>
                                 Si no encuentra la clase fácilmente, rellene
                                 los campos del filtro necesarios en la sección
                                 superior y haga click en el botón "Buscar"
                                 <button className="btn btn-light">
                                    <BiFilterAlt />
                                    &nbsp;Buscar
                                 </button>
                                 .
                              </li>
                              <li>
                                 Ubique la clase a la que desea
                                 agregar/modificar las notas y haga click en
                                 "Ver"{" "}
                                 <button className="btn-text">
                                    Ver &rarr;
                                 </button>{" "}
                                 que se encuentra a la derecha de dicha clase
                                 (Si no encuentra la palabra ver, vaya al final
                                 de la página y corra la lista hacia la derecha
                                 con la barra celeste que está debajo de la
                                 lista y busque nuevamente la clase).
                              </li>
                              <li>
                                 En la próxima pantalla encontrará información
                                 sobre la clase como ser profesor, horarios,
                                 aula y la lista de alumnos.
                              </li>
                              <li>
                                 Vaya al final de la página y haga click en el
                                 botón "Inasistencias"{" "}
                                 <button className="btn btn-primary">
                                    <IoCheckmarkCircleSharp />
                                    &nbsp; Inasistencias
                                 </button>{" "}
                                 que está al final entre el botón de "Notas" y
                                 "Observaciones".
                              </li>
                              <li>
                                 Seleccione la pestaña correspondiente según el
                                 pdf de inasistencias del bimestre que desea
                                 generar.
                              </li>
                              <li>
                                 Si desea generar el pdf de las inasistencias
                                 haga click en el botón{" "}
                                 <button className="btn btn-secondary">
                                    <ImFilePdf />
                                 </button>{" "}
                                 que está al final de la página.
                              </li>
                              <li>
                                 Si desea generar el pdf con la lista de alumnos
                                 y las fechas del bimestre (para que el profe
                                 cargue las inasistencias y/o notas), haga click
                                 en el botón{" "}
                                 <button className="btn btn-secondary">
                                    <FaScroll />
                                 </button>{" "}
                                 que está al final de la página a la derecha.
                              </li>
                           </ul>
                        )}
                     </>
                     <>
                        <div
                           className="list-second-heading"
                           onClick={() =>
                              setClassAdmin((prev) => ({
                                 ...prev,
                                 observations: !observations,
                              }))
                           }
                        >
                           <span className="pointer">
                              {observations ? (
                                 <GoTriangleDown />
                              ) : (
                                 <GoTriangleRight />
                              )}
                           </span>
                           <h4 className="list-second-heading-title">
                              Agregar/Modificar observaciones de los alumnos de
                              una clase (para la libreta)
                           </h4>
                        </div>
                        {observations && (
                           <ul>
                              <li>
                                 Desde la página principal ir a "Clases" en el
                                 menú de la izquierda o en el menú de la barra
                                 superior de color azul (tres líneas) que se
                                 encuentra arriba a la derecha.
                              </li>
                              <li>
                                 Si no encuentra la clase fácilmente, rellene
                                 los campos del filtro necesarios en la sección
                                 superior y haga click en el botón "Buscar"
                                 <button className="btn btn-light">
                                    <BiFilterAlt />
                                    &nbsp;Buscar
                                 </button>
                                 .
                              </li>
                              <li>
                                 Ubique la clase a la que desea
                                 agregar/modificar las notas y haga click en
                                 "Ver"{" "}
                                 <button className="btn-text">
                                    Ver &rarr;
                                 </button>{" "}
                                 que se encuentra a la derecha de dicha clase
                                 (Si no encuentra la palabra ver, vaya al final
                                 de la página y corra la lista hacia la derecha
                                 con la barra celeste que está debajo de la
                                 lista y busque nuevamente la clase).
                              </li>
                              <li>
                                 En la próxima pantalla encontrará información
                                 sobre la clase como ser profesor, horarios,
                                 aula y la lista de alumnos.
                              </li>
                              <li>
                                 Vaya al final de la página y haga click en el
                                 botón "Observaciones"{" "}
                                 <button className="btn btn-primary">
                                    <CgNotes />
                                    &nbsp; Observaciones
                                 </button>{" "}
                                 que está al final a la derecha.
                              </li>
                              <li>
                                 Seleccione la pestaña correspondiente según las
                                 observaciones del bimestre que desea cargar.
                              </li>
                              <li>
                                 Escriba las observaciones en los lugares
                                 correspondientes al lado de los alumnos.
                              </li>
                              <li>
                                 Haga click en el botón "Guardar"{" "}
                                 <button className="btn btn-primary">
                                    <FiSave />
                                    &nbsp;Guardar
                                 </button>{" "}
                                 que se encuentra al final de la página y en
                                 "Aceptar" en la pantalla emergente.
                              </li>
                           </ul>
                        )}
                     </>
                     <>
                        <div
                           className="list-second-heading"
                           onClick={() =>
                              setClassAdmin((prev) => ({
                                 ...prev,
                                 reportCard: !reportCard,
                              }))
                           }
                        >
                           <span className="pointer">
                              {reportCard ? (
                                 <GoTriangleDown />
                              ) : (
                                 <GoTriangleRight />
                              )}
                           </span>
                           <h4 className="list-second-heading-title">
                              Generar libretas
                           </h4>
                        </div>
                        {reportCard && (
                           <ul>
                              <li>
                                 Desde la página principal ir a "Clases" en el
                                 menú de la izquierda o en el menú de la barra
                                 superior de color azul (tres líneas) que se
                                 encuentra arriba a la derecha.
                              </li>
                              <li>
                                 Si no encuentra la clase fácilmente, rellene
                                 los campos del filtro necesarios en la sección
                                 superior y haga click en el botón "Buscar"
                                 <button className="btn btn-light">
                                    <BiFilterAlt />
                                    &nbsp;Buscar
                                 </button>
                                 .
                              </li>
                              <li>
                                 Ubique la clase que desea eliminar y haga click
                                 en "Ver"{" "}
                                 <button className="btn-text">
                                    Ver &rarr;
                                 </button>{" "}
                                 que se encuentra a la derecha de dicha clase
                                 (Si no encuentra la palabra ver, vaya al final
                                 de la página y corra la lista hacia la derecha
                                 con la barra celeste que está debajo de la
                                 lista y busque nuevamente la clase).
                              </li>
                              <li>
                                 En la próxima pantalla encontrará información
                                 sobre la clase como ser profesor, horarios,
                                 aula y la lista de alumnos.
                              </li>
                              <li>
                                 Vaya al final de la página y haga click en el
                                 botón "Observaciones"{" "}
                                 <button className="btn btn-primary">
                                    <CgNotes />
                                    &nbsp; Observaciones
                                 </button>{" "}
                                 que está al final a la izquierda.
                              </li>
                              <li>
                                 Seleccione la pestaña correspondiente según las
                                 libretas del bimestre que desea generar.
                              </li>
                              <li>
                                 Haga click en el botón{" "}
                                 <button className="btn btn-secondary">
                                    <FaAddressCard />
                                 </button>{" "}
                                 que esta al final de la página a la derecha.
                              </li>
                              <li>
                                 Seleccione los alumnos de los que quiere
                                 generar la libreta y haga click en "Aceptar".
                              </li>
                           </ul>
                        )}
                     </>
                  </div>
               )}
            </div>
         )}
         {(isAdmin || userLogged.type === "secretary") && (
            <div className="list-first">
               <div
                  className="list-first-heading"
                  onClick={() =>
                     setAdminValues((prev) => ({
                        ...prev,
                        installments: !installments,
                     }))
                  }
               >
                  <span className="pointer">
                     {installments ? <FaHandPointDown /> : <FaHandPointRight />}
                  </span>
                  <p className="list-first-heading-title">Cuotas/Facturación</p>
               </div>
               {installments && (
                  <div className="list-second">
                     <>
                        <div
                           className="list-second-heading"
                           onClick={() =>
                              setInstallAdmin((prev) => ({
                                 ...prev,
                                 editInstall: !editInstall,
                              }))
                           }
                        >
                           <span className="pointer">
                              {editInstall ? (
                                 <GoTriangleDown />
                              ) : (
                                 <GoTriangleRight />
                              )}
                           </span>
                           <h4 className="list-second-heading-title">
                              Agregar/Modificar una cuota de un alumno
                           </h4>
                        </div>
                        {editInstall && (
                           <ul>
                              <li>
                                 (Solo utilizar para agregar una cuota a un
                                 alumno si no se realiza la inscripción o es una
                                 cuota especial como "Clases Particulares" o
                                 "Exámen Libre".)
                              </li>
                              <li>
                                 Desde la página principal ir a "Cuotas" en el
                                 menú de la izquierda.
                              </li>
                              <li>
                                 En la sección "Búsqueda de alumnos" ingrese el
                                 apellido y/o nombre y seleccione el alumno al
                                 que le desea agregar/modificar una cuota.
                              </li>
                              <li>
                                 Haga click en el botón "Ver Cuotas"{" "}
                                 <button className="btn btn-dark">
                                    <FaMoneyCheckAlt />
                                    &nbsp; Ver Cuotas
                                 </button>
                                 .
                              </li>
                              <li>
                                 Si desea agregar una cuota nueva ir al final de
                                 la página y hacer click en el botón "Agregar
                                 Cuota"{" "}
                                 <button className="btn btn-primary">
                                    <FaPlus />
                                    &nbsp;Agregar cuota
                                 </button>
                                 .
                              </li>
                              <li>
                                 Si desea modificar una cuota hcer click en el
                                 botón editar{" "}
                                 <button className="btn btn-success">
                                    <FaEdit />
                                 </button>{" "}
                                 que está a la izquierda de la misma.
                              </li>
                              <li>
                                 Agregar/Modificar los datos de la misma. El
                                 botón "Permitir Actualizar" se debe sacar y
                                 dejarlo en "No Actualizar" en el caso de que no
                                 quiere que se modifique cuando se hace el
                                 recargo por no pago o con la actualización de
                                 precios.
                              </li>
                              <li>
                                 En "Estado de la Cuota" es "Válida" si se
                                 quiere crear pero que no se considere "Deuda"
                                 todavía (Son deudas las cuotas del mes
                                 corriente y vencidas las de meses anteriores).
                              </li>
                              <li>
                                 Haga click en el botón "Guardar"{" "}
                                 <button className="btn btn-primary">
                                    <FiSave />
                                    &nbsp;Guardar
                                 </button>{" "}
                                 que se encuentra al final de la página y en
                                 "Aceptar" en la pantalla emergente.
                              </li>
                           </ul>
                        )}
                     </>
                     <>
                        <div
                           className="list-second-heading"
                           onClick={() =>
                              setInstallAdmin((prev) => ({
                                 ...prev,
                                 deleteInstall: !deleteInstall,
                              }))
                           }
                        >
                           <span className="pointer">
                              {deleteInstall ? (
                                 <GoTriangleDown />
                              ) : (
                                 <GoTriangleRight />
                              )}
                           </span>
                           <h4 className="list-second-heading-title">
                              Eliminar una cuota de un alumno
                           </h4>
                        </div>

                        {deleteInstall && (
                           <ul>
                              <li>
                                 Desde la página principal ir a "Cuotas" en el
                                 menú de la izquierda.
                              </li>
                              <li>
                                 En la sección "Búsqueda de alumnos" ingrese el
                                 apellido y/o nombre y seleccione el alumno al
                                 que le desea agregar/modificar una cuota.
                              </li>
                              <li>
                                 Haga click en el botón "Ver Cuotas"{" "}
                                 <button className="btn btn-dark">
                                    <FaMoneyCheckAlt />
                                    &nbsp; Ver Cuotas
                                 </button>
                                 .
                              </li>
                              <li>
                                 Localizar la cuota en la lista de abajo y hacer
                                 click en el botón eliminar{" "}
                                 <button className="btn btn-danger">
                                    <FaTrashAlt />
                                 </button>{" "}
                                 que se encuentra a la derecha del mismo y hacer
                                 click en el botón "Aceptar" en la ventana
                                 emergente
                              </li>
                           </ul>
                        )}
                     </>
                     <>
                        <div
                           className="list-second-heading"
                           onClick={() =>
                              setInstallAdmin((prev) => ({
                                 ...prev,
                                 printInstall: !printInstall,
                              }))
                           }
                        >
                           <span className="pointer">
                              {printInstall ? (
                                 <GoTriangleDown />
                              ) : (
                                 <GoTriangleRight />
                              )}
                           </span>
                           <h4 className="list-second-heading-title">
                              Ver/Imprimir pdf de cuotas adeudadas
                           </h4>
                        </div>
                        {printInstall && (
                           <ul>
                              <li>
                                 Desde la página principal ir a "Cuotas" en el
                                 menú de la izquierda.
                              </li>
                              <li>
                                 Haga click en el botón "Listado Deudas"{" "}
                                 <button className="btn btn-light">
                                    <IoIosListBox />
                                    Listado&nbsp;Deudas
                                 </button>{" "}
                                 que está arriba a la derecha .
                              </li>
                              <li>
                                 Si desea filtrar las cuotas adeudadas (por
                                 mes/apellido), ingrese los datos necesarios y
                                 haga click en el botón "Buscar"{" "}
                                 <button
                                    type="submit"
                                    className="btn btn-light"
                                 >
                                    <BiFilterAlt />
                                    &nbsp;Buscar
                                 </button>
                                 .
                              </li>
                              <li>
                                 Si desea generar el pdf de la lista haga click
                                 en el botón{" "}
                                 <button className="btn btn-secondary">
                                    <ImFilePdf />
                                 </button>{" "}
                                 que está al final a la derecha.
                              </li>
                           </ul>
                        )}
                     </>
                     <>
                        <div
                           className="list-second-heading"
                           onClick={() =>
                              setInstallAdmin((prev) => ({
                                 ...prev,
                                 invoice: !invoice,
                              }))
                           }
                        >
                           <span className="pointer">
                              {invoice ? (
                                 <GoTriangleDown />
                              ) : (
                                 <GoTriangleRight />
                              )}
                           </span>
                           <h4 className="list-second-heading-title">
                              Facturación
                           </h4>
                        </div>
                        {invoice && (
                           <ul>
                              <li>
                                 Desde la página principal ir a "Facturación" en
                                 el menú de la izquierda o en el menú de la
                                 barra superior de color azul (tres líneas) que
                                 se encuentra arriba a la derecha.
                              </li>
                              <li>
                                 En la sección "Búsqueda de alumnos" ingrese el
                                 apellido y/o nombre y seleccione el alumno al
                                 que le desea cancelar la/s cuota/s.
                              </li>
                              <li>
                                 Haga click en el botón "Ver Cuotas"{" "}
                                 <button className="btn btn-dark">
                                    <FaMoneyCheckAlt />
                                    &nbsp; Ver Cuotas
                                 </button>
                                 .
                              </li>
                              <li>
                                 Seleccione la/las cuotas que se desean pagar
                                 haciendo click en el botón{" "}
                                 <button className="btn btn-success">
                                    <FaPlus />
                                 </button>
                                 .
                              </li>
                              <li>
                                 Haga click en la pestaña "Factura" (arriba a la
                                 derecha).
                              </li>
                              <li>
                                 En "Usuario a Pagar" ingrese el apellido y/o
                                 nombre y seleccione el usuario que paga la/s
                                 cuota/s.
                              </li>
                              <li>
                                 Si el pago es en efectivo, haga click en donde
                                 dice "Transferencia" para que diga "Contado",
                                 asi se aplica el % de descuento en efectivo. Si
                                 el pago es en transferencia, no tocar el botón.
                                 (Este lo que hace es aplicar el descuento. Si
                                 se quiere cobrar un valor en particular aunque
                                 este sea en efectivo, no le haga click).
                              </li>
                              <li>
                                 En cada una de las cuotas ingresar el monto a
                                 pagar.
                              </li>
                              <li>
                                 Haga click en el botón "Pagar"{" "}
                                 <button className="btn btn-primary">
                                    <FaFileInvoiceDollar />
                                    &nbsp;Pagar
                                 </button>{" "}
                                 que se encuentra al final de la página y en
                                 "Aceptar" en la pantalla emergente.
                              </li>
                           </ul>
                        )}
                     </>
                  </div>
               )}
            </div>
         )}
         {(isAdmin || userLogged.type === "secretary") && (
            <div className="list-first">
               <div
                  className="list-first-heading"
                  onClick={() =>
                     setAdminValues((prev) => ({
                        ...prev,
                        categories: !categories,
                     }))
                  }
               >
                  <span className="pointer">
                     {categories ? <FaHandPointDown /> : <FaHandPointRight />}
                  </span>
                  <p className="list-first-heading-title">Categorías</p>
               </div>
               {categories && (
                  <div className="list-second">
                     <>
                        <div
                           className="list-second-heading"
                           onClick={() =>
                              setCategoriesAdmin((prev) => ({
                                 ...prev,
                                 editCategories: !editCategories,
                              }))
                           }
                        >
                           <span className="pointer">
                              {editCategories ? (
                                 <GoTriangleDown />
                              ) : (
                                 <GoTriangleRight />
                              )}
                           </span>
                           <h4 className="list-second-heading-title">
                              Modificar valor de todas las categorías
                           </h4>
                        </div>
                        {editCategories && (
                           <ul>
                              <li>
                                 Desde la página principal ir a "Categorías" en
                                 el menú de la izquierda.
                              </li>
                              <li>
                                 Seleccione el mes desde el cual quiere que se
                                 aplique el nuevo valor.
                              </li>
                              <li>
                                 Modifique los valores correspondientes al lado
                                 de cada categoría.
                              </li>
                              <li>
                                 Haga click en el botón "Actualizar"{" "}
                                 <button className="btn btn-primary">
                                    <FiSave />
                                    &nbsp;Actualizar
                                 </button>{" "}
                                 que se encuentra al final de la página y en
                                 "Aceptar" en la pantalla emergente.
                              </li>
                           </ul>
                        )}
                     </>
                     <>
                        <div
                           className="list-second-heading"
                           onClick={() =>
                              setCategoriesAdmin((prev) => ({
                                 ...prev,
                                 printCategories: !printCategories,
                              }))
                           }
                        >
                           <span className="pointer">
                              {printCategories ? (
                                 <GoTriangleDown />
                              ) : (
                                 <GoTriangleRight />
                              )}
                           </span>
                           <h4 className="list-second-heading-title">
                              Imprimir pdf de categorías y sus valores
                           </h4>
                        </div>
                        {printCategories && (
                           <ul>
                              <li>
                                 Desde la página principal ir a "Categorías" en
                                 el menú de la izquierda.
                              </li>
                              <li>
                                 Al final de la página hacer click en el botón{" "}
                                 <button className="btn btn-secondary">
                                    <ImFilePdf />
                                 </button>{" "}
                                 que está más a la derecha para generar el pdf
                                 con los precios de marzo o el del medio para el
                                 pdf con los precios completos de las cuotas.
                              </li>
                           </ul>
                        )}
                     </>
                  </div>
               )}
            </div>
         )}
         {(isAdmin || userLogged.type === "secretary") && (
            <div className="list-first">
               <div
                  className="list-first-heading"
                  onClick={() =>
                     setAdminValues((prev) => ({
                        ...prev,
                        register: !register,
                     }))
                  }
               >
                  <span className="pointer">
                     {register ? <FaHandPointDown /> : <FaHandPointRight />}
                  </span>
                  <p className="list-first-heading-title">
                     Movimientos de Caja
                  </p>
               </div>
               {register && (
                  <div className="list-second">
                     <>
                        <div
                           className="list-second-heading"
                           onClick={() =>
                              setRegisterAdmin((prev) => ({
                                 ...prev,
                                 closeRegister: !closeRegister,
                              }))
                           }
                        >
                           <span className="pointer">
                              {closeRegister ? (
                                 <GoTriangleDown />
                              ) : (
                                 <GoTriangleRight />
                              )}
                           </span>
                           <h4 className="list-second-heading-title">
                              Cerrar la caja diaria
                           </h4>
                        </div>

                        {closeRegister && (
                           <ul>
                              <li>
                                 Desde la página principal ir a "Caja" en el
                                 menú de la izquierda o en el menú de la barra
                                 superior de color azul (tres líneas) que se
                                 encuentra arriba a la derecha.
                              </li>
                              <li>
                                 Haga click en el botón "Cerrar Caja"{" "}
                                 <button className="btn btn-primary">
                                    <FiSave />
                                    &nbsp;Cerrar Caja
                                 </button>{" "}
                                 que se encuentra al final de la página y en
                                 "Aceptar" en la pantalla emergente.
                              </li>
                           </ul>
                        )}
                     </>
                     {isAdmin && (
                        <>
                           <div
                              className="list-second-heading"
                              onClick={() =>
                                 setRegisterAdmin((prev) => ({
                                    ...prev,
                                    balanceRegister: !balanceRegister,
                                 }))
                              }
                           >
                              <span className="pointer">
                                 {balanceRegister ? (
                                    <GoTriangleDown />
                                 ) : (
                                    <GoTriangleRight />
                                 )}
                              </span>
                              <h4 className="list-second-heading-title">
                                 Hacer balance de dinero al final del día
                              </h4>
                           </div>
                           {balanceRegister && (
                              <ul>
                                 <li>
                                    Esto se puede realizar una vez que la caja
                                    está cerrada. Si no sabe como hacerlo ir a
                                    la explicación "Cerrar la caja diaria".
                                 </li>
                                 <li>
                                    Desde la página principal ir a "Caja" en el
                                    menú de la izquierda o en el menú de la
                                    barra superior de color azul (tres líneas)
                                    que se encuentra arriba a la derecha.
                                 </li>
                                 <li>
                                    Hacer click en el botón que dice "Cierre"{" "}
                                    <button className="btn btn-light">
                                       <IoIosListBox />
                                       <span className="hide-sm">
                                          &nbsp;Cierre
                                       </span>
                                    </button>{" "}
                                    que está a la derecha del valor que hay en
                                    la caja.
                                 </li>
                                 <li>
                                    Llenar con los valores correspondientes al
                                    dinero que hay en cada lugar.
                                 </li>
                                 <li>
                                    Haga click en el botón para guardar{" "}
                                    <button className="btn btn-success">
                                       <FiSave />
                                    </button>{" "}
                                    que está a la derecha de la fila y en
                                    "Aceptar" en la pantalla emergente.
                                 </li>
                              </ul>
                           )}
                        </>
                     )}
                     <>
                        <div
                           className="list-second-heading"
                           onClick={() =>
                              setRegisterAdmin((prev) => ({
                                 ...prev,
                                 addExpences: !addExpences,
                              }))
                           }
                        >
                           <span className="pointer">
                              {addExpences ? (
                                 <GoTriangleDown />
                              ) : (
                                 <GoTriangleRight />
                              )}
                           </span>
                           <h4 className="list-second-heading-title">
                              Cargar egresos
                           </h4>
                        </div>

                        {addExpences && (
                           <ul>
                              <li>
                                 Desde la página principal ir a "Caja" en el
                                 menú de la izquierda o en el menú de la barra
                                 superior de color azul (tres líneas) que se
                                 encuentra arriba a la derecha.
                              </li>
                              <li>
                                 Haga click en la pestaña "Egreso" (arriba a la
                                 derecha).
                              </li>
                              <li>Elegir el tipo de movimiento.</li>
                              <li>
                                 Si desea pagarle a los empleados:
                                 <div className="list-inside">
                                    <p>
                                       Seleccione el tipo de moviemiento "Pago a
                                       Empleados".
                                    </p>
                                    <p>
                                       Seleccione el empleado a quien desea
                                       pagar.
                                    </p>
                                    <p>
                                       Las horas se calculan automáticamente
                                       dependiendo de las horas de clases que
                                       dicho profesor tenga a cargo. En el caso
                                       de que haya dado menos o más horas,
                                       modificar las horas o el importe
                                       manualmente.
                                    </p>
                                 </div>
                              </li>
                              <li>
                                 Agregar una descripción de ser necesario. (Ej:
                                 Pago semana 4/5 al 7/5)
                              </li>
                              <li>
                                 Haga click en el botón "Guardar"{" "}
                                 <button className="btn btn-primary">
                                    <FiSave />
                                    &nbsp;Guardar
                                 </button>{" "}
                                 que se encuentra al final de la página y en
                                 "Aceptar" en la pantalla emergente.
                              </li>
                           </ul>
                        )}
                     </>
                     {isAdmin && (
                        <>
                           <div
                              className="list-second-heading"
                              onClick={() =>
                                 setRegisterAdmin((prev) => ({
                                    ...prev,
                                    updateTransactionType:
                                       !updateTransactionType,
                                 }))
                              }
                           >
                              <span className="pointer">
                                 {updateTransactionType ? (
                                    <GoTriangleDown />
                                 ) : (
                                    <GoTriangleRight />
                                 )}
                              </span>
                              <h4 className="list-second-heading-title">
                                 Modificar los tipos de movimientos
                              </h4>
                           </div>

                           {updateTransactionType && (
                              <ul>
                                 <li>
                                    Desde la página principal ir a "Caja" en el
                                    menú de la izquierda o en el menú de la
                                    barra superior de color azul (tres líneas)
                                    que se encuentra arriba a la derecha.
                                 </li>
                                 <li>
                                    Haga click en la pestaña "Egreso" (arriba a
                                    la derecha).
                                 </li>
                                 <li>
                                    Haga click en el botón "Tipo Movimiento"{" "}
                                    <button className="btn btn-mix-secondary">
                                       <FaEdit />
                                       &nbsp; Tipo Movimiento
                                    </button>{" "}
                                    que se encuentra al final de la página.
                                 </li>
                                 <li>
                                    Modifique el nombre del egreso que desea
                                    modificar o agregue uno nuevo haciendo click
                                    al botón que dice "Agregar Tipo de Egreso"
                                    que se encuentra al final de la página e
                                    ingresando los datos necesarios.
                                 </li>
                                 <li>
                                    Haga click en el botón "Guardar"{" "}
                                    <button className="btn btn-primary">
                                       <FiSave />
                                       &nbsp;Guardar
                                    </button>{" "}
                                    que se encuentra al final de la página y en
                                    "Aceptar" en la pantalla emergente.
                                 </li>
                              </ul>
                           )}
                        </>
                     )}
                     <>
                        <div
                           className="list-second-heading"
                           onClick={() =>
                              setRegisterAdmin((prev) => ({
                                 ...prev,
                                 printIncome: !printIncome,
                              }))
                           }
                        >
                           <span className="pointer">
                              {printIncome ? (
                                 <GoTriangleDown />
                              ) : (
                                 <GoTriangleRight />
                              )}
                           </span>
                           <h4 className="list-second-heading-title">
                              Ver/Imprimir listado de facturas o ingresos
                           </h4>
                        </div>

                        {printIncome && (
                           <ul>
                              <li>
                                 Desde la página principal ir a "Caja" en el
                                 menú de la izquierda o en el menú de la barra
                                 superior de color azul (tres líneas) que se
                                 encuentra arriba a la derecha.
                              </li>
                              <li>
                                 Haga click en el botón "Listado"{" "}
                                 <button className="btn btn-light">
                                    <IoIosListBox />
                                    &nbsp;Listado
                                 </button>{" "}
                                 que está primero al lado del valor de
                                 "Ingresos".
                              </li>
                              <li>
                                 Ahi irá a la lista de ingresos. Aquellos que se
                                 hicieron durante el día son los únicos que se
                                 pueden borrar (aparece un tacho de basura a la
                                 derecha de cada ingreso). Si no aparece ningún
                                 tacho de basura es porque no se registraron
                                 ingresos en el día.
                              </li>
                              <li>
                                 Si desea filtrar por fecha o nombre de alumno,
                                 ingréselos y haga click en el botón "Buscar"{" "}
                                 <button className="btn btn-light">
                                    <BiFilterAlt />
                                    &nbsp;Buscar
                                 </button>
                                 . Si no agrega ningún filtro, busca los
                                 ingresos del corriente año solamente.
                              </li>
                              <li>
                                 Si desea imprimir el listado de ingreso haga
                                 click en el botón{" "}
                                 <button className="btn btn-secondary">
                                    <ImFilePdf />
                                 </button>{" "}
                                 que está al final de la página a la derecha.
                              </li>
                           </ul>
                        )}
                     </>
                     <>
                        <div
                           className="list-second-heading"
                           onClick={() =>
                              setRegisterAdmin((prev) => ({
                                 ...prev,
                                 printExpences: !printExpences,
                              }))
                           }
                        >
                           <span className="pointer">
                              {printExpences ? (
                                 <GoTriangleDown />
                              ) : (
                                 <GoTriangleRight />
                              )}
                           </span>
                           <h4 className="list-second-heading-title">
                              Ver/Imprimir listado de egresos
                           </h4>
                        </div>

                        {printExpences && (
                           <ul>
                              <li>
                                 Desde la página principal ir a "Caja" en el
                                 menú de la izquierda o en el menú de la barra
                                 superior de color azul (tres líneas) que se
                                 encuentra arriba a la derecha.
                              </li>
                              <li>
                                 Haga click en el botón "Listado"{" "}
                                 <button className="btn btn-light">
                                    <IoIosListBox />
                                    &nbsp;Listado
                                 </button>{" "}
                                 que está segundo al lado del valor de
                                 "Egresos".
                              </li>
                              <li>
                                 Ahi irá a la lista de egresos. Aquellos que se
                                 cargaron durante el día son los únicos que se
                                 pueden borrar (aparece un tacho de basura a la
                                 derecha de cada egreso). Si no aparece ningún
                                 tacho de basura es porque no se registraron
                                 egresos en el día.
                              </li>
                              <li>
                                 Si desea filtrar por fecha ingrésela y haga
                                 click en el botón "Buscar"{" "}
                                 <button className="btn btn-light">
                                    <BiFilterAlt />
                                    &nbsp;Buscar
                                 </button>
                                 . Si no agrega ningún filtro, solo busca los
                                 egresos del corriente año solamente.
                              </li>
                              <li>
                                 Si desea imprimir el listado de egresos haga
                                 click en el botón{" "}
                                 <button className="btn btn-secondary">
                                    <ImFilePdf />
                                 </button>{" "}
                                 que está al final de la página a la derecha.
                              </li>
                           </ul>
                        )}
                     </>
                     {isAdmin && (
                        <>
                           <div
                              className="list-second-heading"
                              onClick={() =>
                                 setRegisterAdmin((prev) => ({
                                    ...prev,
                                    printWithdrawals: !printWithdrawals,
                                 }))
                              }
                           >
                              <span className="pointer">
                                 {printWithdrawals ? (
                                    <GoTriangleDown />
                                 ) : (
                                    <GoTriangleRight />
                                 )}
                              </span>
                              <h4 className="list-second-heading-title">
                                 Ver/Imprimir listado de retiros
                              </h4>
                           </div>

                           {printWithdrawals && (
                              <ul>
                                 <li>
                                    Desde la página principal ir a "Caja" en el
                                    menú de la izquierda o en el menú de la
                                    barra superior de color azul (tres líneas)
                                    que se encuentra arriba a la derecha.
                                 </li>
                                 <li>
                                    Haga click en el botón "Listado"{" "}
                                    <button className="btn btn-light">
                                       <IoIosListBox />
                                       &nbsp;Listado
                                    </button>{" "}
                                    que está tercero al lado del valor de
                                    "Retiro de Dinero".
                                 </li>
                                 <li>
                                    Ahi irá a la lista de retiros. Aquellos que
                                    se cargaron durante el día son los únicos
                                    que se pueden borrar (aparece un tacho de
                                    basura a la derecha de cada retiro). Si no
                                    aparece ningún tacho de basura es porque no
                                    se registraron retiros en el día.
                                 </li>
                                 <li>
                                    Si desea filtrar por fecha y/o los retiros
                                    de una persona en particular ingréselos y
                                    haga click en el botón "Buscar"{" "}
                                    <button className="btn btn-light">
                                       <BiFilterAlt />
                                       &nbsp;Buscar
                                    </button>
                                    . Si no agrega ningún filtro, solo busca los
                                    retiros del corriente año solamente.
                                 </li>
                                 <li>
                                    Si desea imprimir el listado de retiros haga
                                    click en el botón{" "}
                                    <button className="btn btn-secondary">
                                       <ImFilePdf />
                                    </button>{" "}
                                    que está al final de la página a la derecha.
                                 </li>
                              </ul>
                           )}
                        </>
                     )}
                     {isAdmin && (
                        <>
                           <div
                              className="list-second-heading"
                              onClick={() =>
                                 setRegisterAdmin((prev) => ({
                                    ...prev,
                                    printMonthWithdrawals:
                                       !printMonthWithdrawals,
                                 }))
                              }
                           >
                              <span className="pointer">
                                 {printMonthWithdrawals ? (
                                    <GoTriangleDown />
                                 ) : (
                                    <GoTriangleRight />
                                 )}
                              </span>
                              <h4 className="list-second-heading-title">
                                 Ver/Imprimir listado de retiros mensuales
                              </h4>
                           </div>

                           {printMonthWithdrawals && (
                              <ul>
                                 <li>
                                    Desde la página principal ir a "Caja" en el
                                    menú de la izquierda o en el menú de la
                                    barra superior de color azul (tres líneas)
                                    que se encuentra arriba a la derecha.
                                 </li>
                                 <li>
                                    Haga click en el botón "Listado"{" "}
                                    <button className="btn btn-light">
                                       <IoIosListBox />
                                       &nbsp;Listado
                                    </button>{" "}
                                    que está tercero al lado del valor de
                                    "Retiro de Dinero".
                                 </li>
                                 <li>
                                    Haga click en el botón que dice "Listado
                                    Mensual"{" "}
                                    <button className="btn btn-light">
                                       <IoIosListBox />
                                       &nbsp;Listado&nbsp;Mensual
                                    </button>{" "}
                                    que está arriba a la derecha.
                                 </li>
                                 <li>
                                    Ahi irá a la lista de retiros del corriente
                                    año.
                                 </li>
                                 <li>
                                    Si desea ver los retiros de otros años,
                                    búsquelo en la lista desplegable y haga
                                    click en el botón "Buscar"{" "}
                                    <button className="btn btn-light">
                                       <BiFilterAlt />
                                       &nbsp;Buscar
                                    </button>
                                    .
                                 </li>
                                 <li>
                                    Si desea imprimir el listado de retiros haga
                                    click en el botón{" "}
                                    <button className="btn btn-secondary">
                                       <ImFilePdf />
                                    </button>{" "}
                                    que está al final de la página a la derecha.
                                 </li>
                              </ul>
                           )}
                        </>
                     )}
                     {isAdmin && (
                        <>
                           <div
                              className="list-second-heading"
                              onClick={() =>
                                 setRegisterAdmin((prev) => ({
                                    ...prev,
                                    printTransactions: !printTransactions,
                                 }))
                              }
                           >
                              <span className="pointer">
                                 {printTransactions ? (
                                    <GoTriangleDown />
                                 ) : (
                                    <GoTriangleRight />
                                 )}
                              </span>
                              <h4 className="list-second-heading-title">
                                 Ver/Imprimir listado de moviemientos diarios
                              </h4>
                           </div>

                           {printTransactions && (
                              <ul>
                                 <li>
                                    Desde la página principal ir a "Caja" en el
                                    menú de la izquierda o en el menú de la
                                    barra superior de color azul (tres líneas)
                                    que se encuentra arriba a la derecha.
                                 </li>
                                 <li>
                                    Haga click en el botón "Listado"{" "}
                                    <button className="btn btn-light">
                                       <IoIosListBox />
                                       &nbsp;Listado
                                    </button>{" "}
                                    que está al final de la página al lado del
                                    botón para abrir/cerrar la caja.
                                 </li>
                                 <li>
                                    Ahi irá a la lista de movimientos diarios.
                                 </li>
                                 <li>
                                    Ahí irá a la lista de movimientos diarios de
                                    los últimos 10 días. Si desea ver los
                                    movimientos anteriores, seleccione las
                                    fechas desde y hasta y haga click en el
                                    botón "Buscar"{" "}
                                    <button className="btn btn-light">
                                       <BiFilterAlt />
                                       &nbsp;Buscar
                                    </button>
                                    .
                                 </li>
                                 <li>
                                    Si desea imprimir el listado de movimientos
                                    haga click en el botón{" "}
                                    <button className="btn btn-secondary">
                                       <ImFilePdf />
                                    </button>{" "}
                                    que está al final de la página a la derecha.
                                 </li>
                              </ul>
                           )}
                        </>
                     )}
                     {isAdmin && (
                        <>
                           <div
                              className="list-second-heading"
                              onClick={() =>
                                 setRegisterAdmin((prev) => ({
                                    ...prev,
                                    printMonthTransactions:
                                       !printMonthTransactions,
                                 }))
                              }
                           >
                              <span className="pointer">
                                 {printMonthTransactions ? (
                                    <GoTriangleDown />
                                 ) : (
                                    <GoTriangleRight />
                                 )}
                              </span>
                              <h4 className="list-second-heading-title">
                                 Ver/Imprimir listado de movimientos mensuales
                              </h4>
                           </div>

                           {printMonthTransactions && (
                              <ul>
                                 <li>
                                    Desde la página principal ir a "Caja" en el
                                    menú de la izquierda o en el menú de la
                                    barra superior de color azul (tres líneas)
                                    que se encuentra arriba a la derecha.
                                 </li>
                                 <li>
                                    Haga click en el botón "Listado"{" "}
                                    <button className="btn btn-light">
                                       <IoIosListBox />
                                       &nbsp;Listado
                                    </button>{" "}
                                    que está al final de la página al lado del
                                    botón para abrir/cerrar la caja.
                                 </li>
                                 <li>
                                    Haga click en el botón que dice "Listado
                                    Mensual"{" "}
                                    <button className="btn btn-light">
                                       <IoIosListBox />
                                       &nbsp;Listado&nbsp;Mensual
                                    </button>{" "}
                                    que está arriba a la derecha.
                                 </li>
                                 <li>
                                    Ahi irá a la lista de movimientos del
                                    corriente año.
                                 </li>
                                 <li>
                                    Si desea ver los movimientos de otros años,
                                    búsquelo en la lista desplegable y haga
                                    click en el botón "Buscar"{" "}
                                    <button className="btn btn-light">
                                       <BiFilterAlt />
                                       &nbsp;Buscar
                                    </button>
                                    .
                                 </li>
                                 <li>
                                    Si desea imprimir el listado de movimientos
                                    haga click en el botón{" "}
                                    <button className="btn btn-secondary">
                                       <ImFilePdf />
                                    </button>{" "}
                                    que está al final de la página a la derecha.
                                 </li>
                              </ul>
                           )}
                        </>
                     )}
                  </div>
               )}
            </div>
         )}
         {(isAdmin || userLogged.type === "secretary") && (
            <div className="list-first">
               <div
                  className="list-first-heading"
                  onClick={() =>
                     setAdminValues((prev) => ({
                        ...prev,
                        other: !other,
                     }))
                  }
               >
                  <span className="pointer">
                     {other ? <FaHandPointDown /> : <FaHandPointRight />}
                  </span>
                  <p className="list-first-heading-title">
                     Modificación de valores y extras
                  </p>
               </div>

               {other && (
                  <div className="list-second">
                     {isAdmin && (
                        <>
                           <div
                              className="list-second-heading"
                              onClick={() =>
                                 setOtherAdmin((prev) => ({
                                    ...prev,
                                    updateSalaries: !updateSalaries,
                                 }))
                              }
                           >
                              <span className="pointer">
                                 {updateSalaries ? (
                                    <GoTriangleDown />
                                 ) : (
                                    <GoTriangleRight />
                                 )}
                              </span>
                              <h4 className="list-second-heading-title">
                                 Modificar salarios
                              </h4>
                           </div>

                           {updateSalaries && (
                              <ul>
                                 <li>
                                    Desde la página principal ir a "Caja" en el
                                    menú de la izquierda o en el menú de la
                                    barra superior de color azul (tres líneas)
                                    que se encuentra arriba a la derecha.
                                 </li>
                                 <li>
                                    Haga click en la pestaña "Egreso" (arriba a
                                    la derecha).
                                 </li>
                                 <li>
                                    Seleccione el tipo de moviemiento "Pago a
                                    Empleados".
                                 </li>
                                 <li>
                                    Haga click en el botón que apareció arriba a
                                    la derecha que dice "Salarios"{" "}
                                    <button className="btn btn-mix-secondary">
                                       <FaEdit /> &nbsp; Salarios
                                    </button>
                                    .
                                 </li>
                                 <li>
                                    Modifique los valores que desea modificar.
                                 </li>
                                 <li>Haga click en el botón "Aceptar".</li>
                              </ul>
                           )}
                        </>
                     )}
                     {isAdmin && (
                        <>
                           <div
                              className="list-second-heading"
                              onClick={() =>
                                 setOtherAdmin((prev) => ({
                                    ...prev,
                                    updateDiscount: !updateDiscount,
                                 }))
                              }
                           >
                              <span className="pointer">
                                 {updateDiscount ? (
                                    <GoTriangleDown />
                                 ) : (
                                    <GoTriangleRight />
                                 )}
                              </span>
                              <h4 className="list-second-heading-title">
                                 Modificar recargo y/o descuento (en efectivo)
                              </h4>
                           </div>

                           {updateDiscount && (
                              <ul>
                                 <li>
                                    Desde la página principal ir a "Cuotas" en
                                    el menú de la izquierda.
                                 </li>
                                 <li>
                                    Haga click en la botón "Recargo/Descuento"{" "}
                                    <button className="btn btn-secondary">
                                       <FaDollarSign />
                                       &nbsp;Recargo/Descuento
                                    </button>
                                    , que se encuentra arriba a la derecha al
                                    lado del botón del listado de deudas.
                                 </li>
                                 <li>
                                    Ingrese el nuevo recargo y/o descuento en
                                    los lugares correspondientes.
                                 </li>
                                 <li>Haga click en el botón "Aceptar".</li>
                              </ul>
                           )}
                        </>
                     )}
                     {isAdmin && (
                        <>
                           <div
                              className="list-second-heading"
                              onClick={() =>
                                 setOtherAdmin((prev) => ({
                                    ...prev,
                                    updateTowns: !updateTowns,
                                 }))
                              }
                           >
                              <span className="pointer">
                                 {updateTowns ? (
                                    <GoTriangleDown />
                                 ) : (
                                    <GoTriangleRight />
                                 )}
                              </span>
                              <h4 className="list-second-heading-title">
                                 Agregar o modificar barrios y/o localidades
                              </h4>
                           </div>

                           {updateTowns && (
                              <ul>
                                 <li>
                                    Desde la página principal ir a "Búsqueda" en
                                    el menú de la izquierda o en el menú de la
                                    barra superior de color azul (tres líneas)
                                    que se encuentra arriba a la derecha.
                                 </li>
                                 <li>
                                    Hacer click en el botón que dice "Registrar
                                    Usuario"{" "}
                                    <button className="btn btn-dark">
                                       <FaUserPlus /> &nbsp;Registrar Usuario
                                    </button>{" "}
                                    que se encuentra arriba a la derecha.
                                 </li>
                                 <li>
                                    En la sección de dirección/localidad donde
                                    vive hacer click en el botón editar{" "}
                                    <button className="btn btn-mix-secondary">
                                       <FaEdit />
                                    </button>{" "}
                                    que se encuentra abajo a la derecha de donde
                                    se coloca el barrio.
                                 </li>
                                 <li>
                                    Seleccionar la pestaña correspondiente si se
                                    desea modificar o agregar una localidad o
                                    barrio.
                                 </li>
                                 <li>
                                    Modificar el barrio o localidad o agregar
                                    uno nuevo haciendo click en el botón que
                                    dice "Agregar Localidad/Barrio"{" "}
                                    <button className="btn btn-primary">
                                       <FaPlus />
                                       &nbsp; Agregar Localidad
                                    </button>{" "}
                                    que se encuentra abajo a la derecha.
                                 </li>
                                 <li>
                                    Hacer click en el botón Guardar Cambios{" "}
                                    <button className="btn btn-primary">
                                       <FiSave />
                                       &nbsp;Guardar
                                    </button>{" "}
                                    que se encuentra al final de la página y en
                                    "Aceptar" en la pantalla emergente.
                                 </li>
                              </ul>
                           )}
                        </>
                     )}
                     <>
                        <div
                           className="list-second-heading"
                           onClick={() =>
                              setOtherAdmin((prev) => ({
                                 ...prev,
                                 mentions: !mentions,
                              }))
                           }
                        >
                           <span className="pointer">
                              {mentions ? (
                                 <GoTriangleDown />
                              ) : (
                                 <GoTriangleRight />
                              )}
                           </span>
                           <h4 className="list-second-heading-title">
                              Generar las menciones de fin de año (Promedio y
                              Asistencia)
                           </h4>
                        </div>

                        {mentions && (
                           <ul>
                              <li>
                                 Desde la página principal ir a "Mensiones" en
                                 el menú de la izquierda.
                              </li>
                              <li>
                                 Si desea buscar los mejores promedios quedese
                                 en la pestaña que está.
                                 <div className="list-inside">
                                    <p>
                                       Ingrese si desea buscar los alumnos de
                                       una categoría en especial, el año (si es
                                       del corriente año, dejelo como está) y la
                                       cantidad de alumno que desee que muestre
                                       (generalmente al rededor de 10). La
                                       cantidad de alumnos hay que ingresarlo
                                       sino tira todos los alumnos desde el que
                                       tiene el mejor promedio hasta el que
                                       tiene el peor.
                                    </p>
                                 </div>
                              </li>
                              <li>
                                 Si desea buscar las mejores asistencias o
                                 asistencias perfectas, vaya a la pestaña
                                 "Asistencia" que está arriba a la derecha.
                                 <div className="list-inside">
                                    <p>
                                       Ingrese si desea buscar los alumnos de
                                       una categoría en especial, el año (si es
                                       del corriente año, dejelo como está) y el
                                       número de faltas que desee que tenga el
                                       alumno (generalmente una para que
                                       aparezcan los alumnos con asistencia
                                       perfecta y casi perfecta, es decir, solo
                                       una).
                                    </p>
                                 </div>
                                 <li>
                                    Haga click en el botón "Buscar"{" "}
                                    <button className="btn btn-light">
                                       <BiFilterAlt />
                                       &nbsp;Buscar
                                    </button>
                                    .
                                 </li>
                                 <li>
                                    Si desea imprimir la lista, haga click en el
                                    botón{" "}
                                    <button className="btn btn-secondary">
                                       <ImFilePdf />
                                    </button>{" "}
                                    que está al final a la derecha.
                                 </li>
                              </li>
                           </ul>
                        )}
                     </>
                  </div>
               )}
            </div>
         )}
      </div>
   );
};

const mapStateToProps = (state) => ({
   auth: state.auth,
});

export default connect(mapStateToProps, {})(Help);
