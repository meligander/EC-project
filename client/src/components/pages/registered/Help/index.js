import React from "react";
import { FaPlus, BiFilterAlt, FaUserPlus } from "react-icons";

import "./style.scss";

const Help = () => {
   return (
      <div className="bg-white">
         <h2 className="heading-secondary">Ayuda</h2>
         <p className="heading-tertiary">Registrar usuario</p>
         <ul>
            <li>
               Desde la página principal ir a "Búsqueda" en el menú de la
               izquierda o en el menú de la barra superior de color azul (tres
               líneas) que se encuentra arriba a la derecha.
            </li>
            <li>
               Hacer click en el botón que dice "Registrar Usuario" que se
               encuentra arriba a la derecha.
               <button className="btn btn-dark">
                  <FaUserPlus /> &nbsp;Registrar Usuario
               </button>
            </li>
            <li>Seleccionar el tipo de usuario del menú desplegable.</li>
            <li>
               Cargar todos los datos que pide (desde DNI en la mayoría de los
               casos)
            </li>
            <li>
               Si selecciona el usuario "Alumno", cargar el celular del alumno y
               el de los padres desde el botón{" "}
               <button className="btn btn-tertiary">
                  <FaPlus />
                  <span className="hide-sm">&nbsp;Celular</span>
               </button>{" "}
               en donde colocar el tipo de vinculo con el alumno, nombre y
               celular. Rellenar todos los campos siguientes, seleccionar el
               tipo de descuento (los mas usados es "Ninguno" o "Hermanos"), si
               es que tiene, y cuando se realiza el recargo (el día 15 en
               general).
            </li>
            <li>
               Si selecciona el usuario "Tutor" debe agregar los alumnos que
               están vinculados con ese tutor (para ello los alumnos deben estar
               previamente cargados).
            </li>
            <li>
               Para finalizar, hacer click en el botón "Registrar"
               <button className="btn btn-primary">Registrar</button> que se
               encuentra al final de la página y aceptar en la pantalla
               emergente.
            </li>
         </ul>
         <p className="heading-tertiary">Editar usuario</p>
         <ul>
            <li>
               Desde la página principal ir a "Búsqueda" en el menú de la
               izquierda o en el menú de la barra superior de color azul (tres
               líneas) que se encuentra arriba a la derecha.
            </li>
            <li>
               Ir a la pestaña correspondiente dependiendo del usuario que desea
               buscar.
            </li>
            <li>
               Ingresar los datos del usuario para buscarlo (nombre y/o
               apellido).
            </li>
            <li>
               Hacer click en el botón "Buscar"{" "}
               <button className="btn btn-light">
                  <BiFilterAlt />
                  &nbsp;Buscar
               </button>
            </li>
            <li>Seleccionar el usuario haciendo click sobre el nombre.</li>
            <li>
               Hacer click en el botón "Editar"{" "}
               <button className="btn btn-mix-secondary">
                  <FaUserEdit />
                  &nbsp;Editar
               </button>{" "}
               que se encuentra debajo de los datos del usuario.
            </li>
            <li>Modificar los datos necesarios</li>
            <li>
               Hacer click en el botón Guardar Cambios{" "}
               <button className="btn btn-primary">
                  <FaUserEdit />
                  &nbsp;Guardar Cambios
               </button>{" "}
               que se encuentra al final de la página y aceptar en la pantalla
               emergente.
            </li>
         </ul>
         <p className="heading-tertiary">
            Modificar credenciales (Email y Contraseña)
         </p>
         <ul>
            <li>
               Desde la página principal ir a "Búsqueda" en el menú de la
               izquierda o en el menú de la barra superior de color azul (tres
               líneas) que se encuentra arriba a la derecha.
            </li>
            <li>
               Ir a la pestaña correspondiente dependiendo del usuario que desea
               buscar.
            </li>
            <li>
               Ingresar los datos del usuario para buscarlo (nombre y/o
               apellido).
            </li>
            <li>
               Hacer click en el botón "Buscar"{" "}
               <button className="btn btn-light">
                  <BiFilterAlt />
                  &nbsp;Buscar
               </button>
            </li>
            <li>Seleccionar el usuario haciendo click sobre el nombre.</li>
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
               que se encuentra arriba a la derecha de la pantalla.
            </li>
            <li>Modificar los datos necesarios.</li>
            <li>
               Si necesita modificar la contraseña, colocarla en donde dice
               "Nueva contraseña" y volver a repetirla donde dice "Confirmación
               de contraseña".
            </li>
            <li>
               Hacer click en el botón Guardar Cambios{" "}
               <button className="btn btn-primary">
                  <FaUserEdit />
                  &nbsp;Guardar Cambios
               </button>{" "}
               que se encuentra al final de la página y aceptar en la pantalla
               emergente.
            </li>
         </ul>
         <p className="heading-tertiary">Subir imágen en el perfil</p>
         <ul>
            <li>
               Desde la página principal ir a "Búsqueda" en el menú de la
               izquierda o en el menú de la barra superior de color azul (tres
               líneas) que se encuentra arriba a la derecha.
            </li>
            <li>
               Ir a la pestaña correspondiente dependiendo del usuario que desea
               buscar.
            </li>
            <li>
               Ingresar los datos del usuario para buscarlo (nombre y/o
               apellido).
            </li>
            <li>
               Hacer click en el botón "Buscar"{" "}
               <button className="btn btn-light">
                  <BiFilterAlt />
                  &nbsp;Buscar
               </button>
            </li>
            <li>Seleccionar el usuario haciendo click sobre el nombre.</li>
            <li>
               Hacer click en el botón "Editar"{" "}
               <button className="btn btn-mix-secondary">
                  <FaUserEdit />
                  &nbsp;Editar
               </button>{" "}
               que se encuentra debajo de los datos del usuario.
            </li>
            <li>
               Ir casi al final de la página donde se encuentra el botón que
               dice "Subir imágen"{" "}
               <div className="upl-img">
                  <div className="fileUpload">
                     <input id="fileInput" className="upload" />
                     <span>
                        <FaCloudUploadAlt />
                        &nbsp;Subir imágen
                     </span>
                  </div>
               </div>{" "}
               y hacerle click.
            </li>
            <li>
               Buscar y seleccionar la imágen que se quiere subir y hacer click
               en "Abrir".
            </li>
            <li>
               Hacer click en el botón Guardar Cambios{" "}
               <button className="btn btn-primary">
                  <FaUserEdit />
                  &nbsp;Guardar Cambios
               </button>{" "}
               que se encuentra al final de la página y aceptar en la pantalla
               emergente.
            </li>
         </ul>
         <p className="heading-tertiary">Inscribir un alumno</p>
         <li>
            Desde la página principal ir a "Inscripción" en el menú de la
            izquierda o en el menú de la barra superior de color azul (tres
            líneas) que se encuentra arriba a la derecha.
         </li>
         <li>Buscar el alumno por apellido y/o nombre</li>
         <li>Seleccionar la categoría a la que va a asistir el alumno.</li>
         <li>
            Seleccione el año para el que es la inscripción (en el caso de que
            se quiera inscribir para el año siguiente).
         </li>
         <li>
            Si es una inscripción para el año en curso, hay que ingresar a
            partir de que mes se lo desea inscribir (es para que el programa
            genere las cuotas desde el mes correcto, sino puede generar una
            cuota de más o de menos y habría que hacerlo manualmente).
         </li>
         <li>
            Hacer click en el botón Inscribir{" "}
            <button className="btn btn-primary">
               <FaUserEdit />
               &nbsp; Inscribir
            </button>{" "}
            que se encuentra al final de la página y aceptar en la pantalla
            emergente.
         </li>
         <p className="heading-tertiary">Modificar inscripción de un alumno</p>
         <li>
            Desde la página principal ir a "Inscripción" en el menú de la
            izquierda o en el menú de la barra superior de color azul (tres
            líneas) que se encuentra arriba a la derecha.
         </li>
      </div>
   );
};

export default Help;
