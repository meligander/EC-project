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
               que se encuentra al final de la página y en "Aceptar" en la
               pantalla emergente.
            </li>
         </ul>
         <p className="heading-tertiary">Eliminar usuario</p>
         <ul>
            <li>
               Recomendamos no eliminar un usuario. En caso de que quiera que no
               aparezca más entre los usuarios activos, lo único que debería
               hacer es desactivarlo.
            </li>
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
               Hacer click en el botón "Eliminar"{" "}
               <button className="btn btn-danger">
                  <FaUserMinus />
                  &nbsp;Eliminar
               </button>{" "}
               que se encuentra debajo de los datos del usuario.
            </li>
            <li>Hacer click en "Aceptar" en la pantalla emergente.</li>
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
               que se encuentra al final de la página y "Aceptar" en la pantalla
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
               que se encuentra al final de la página y en "Aceptar" en la
               pantalla emergente.
            </li>
         </ul>
         <p className="heading-tertiary">Desactivar/Activar un usuario</p>
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
               Ir casi al final de la página donde se encuentra el checkbox
               "Activo" o "Inactivo"{" "}
               <input
                  className="form-checkbox"
                  type="checkbox"
                  name="active"
                  id="active"
               />
               <label className="checkbox-lbl" htmlFor="active">
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
               que se encuentra al final de la página y en "Aceptar" en la
               pantalla emergente.
            </li>
         </ul>
         <p className="heading-tertiary">
            Agregar o modificar barrios y/o localidades
         </p>
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
            <li>
               En la sección de dirección/localidad donde vive hacer click en el
               botón editar{" "}
               <button className="btn btn-mix-secondary">
                  <FaEdit />
               </button>{" "}
               que se encuentra abajo a la derecha de donde se coloca el barrio.
            </li>
            <li>
               Seleccionar la pestaña correspondiente si se desea modificar o
               agregar una localidad o barrio.
            </li>
            <li>
               Modificar el barrio o localidad o agregar uno nuevo haciendo
               click en el botón que dice "Agregar Localidad/Barrio"{" "}
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
               que se encuentra al final de la página y en "Aceptar" en la
               pantalla emergente.
            </li>
         </ul>
         <p className="heading-tertiary">Inscribir un alumno</p>
         <ul>
            <li>
               Desde la página principal ir a "Inscripción" en el menú de la
               izquierda o en el menú de la barra superior de color azul (tres
               líneas) que se encuentra arriba a la derecha.
            </li>
            <li>Buscar el alumno por apellido y/o nombre</li>
            <li>Seleccionar la categoría a la que va a asistir el alumno.</li>
            <li>
               Seleccione el año para el que es la inscripción (en el caso de
               que se quiera inscribir para el año siguiente).
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
            <p className="heading-tertiary">
               Modificar inscripción de un alumno
            </p>
            <li>
               Desde la página principal ir a "Inscripción" en el menú de la
               izquierda o en el menú de la barra superior de color azul (tres
               líneas) que se encuentra arriba a la derecha.
            </li>
         </ul>
         <p className="heading-tertiary">Editar inscripción de un alumno</p>
         <ul>
            <li>
               Desde la página principal ir a "Inscripción" en el menú de la
               izquierda o en el menú de la barra superior de color azul (tres
               líneas) que se encuentra arriba a la derecha.
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
               Buscar la inscripción rellenando los campos necesarios de los
               filtros (Nombre/Apellido/Categoría/Año/Fechas).
            </li>
            <li>
               Hacer click en el botón "Buscar"{" "}
               <button className="btn btn-light">
                  <BiFilterAlt />
                  &nbsp;Buscar
               </button>
            </li>
            <li>
               Localizar la inscripción en la lista de abajo y hacer click en el
               botón editar{" "}
               <button className="btn btn-success">
                  <FaEdit />
               </button>{" "}
               que se encuentra a la derecha del mismo.
            </li>
            <li>Modificar la categoría a la que se le quiere cambiar.</li>
            <li>
               Seleccionar el mes a partir del cual se quiere hacer efectivo el
               cambio (esto es para que se modifique el valor de la cuota
               correspondiente).
            </li>
            <li>
               Hacer click en el botón Guardar Cambios{" "}
               <button className="btn btn-primary">
                  <FiSave />
                  &nbsp;Guardar Cambios
               </button>{" "}
               que se encuentra al final de la página y en "Aceptar" en la
               pantalla emergente.
            </li>
         </ul>
         <p className="heading-tertiary">Eliminar una inscripción</p>
         <ul>
            <li>
               Desde la página principal ir a "Inscripción" en el menú de la
               izquierda o en el menú de la barra superior de color azul (tres
               líneas) que se encuentra arriba a la derecha.
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
               Buscar la inscripción rellenando los campos necesarios de los
               filtros (Nombre/Apellido/Categoría/Año/Fechas).
            </li>
            <li>
               Hacer click en el botón "Buscar"{" "}
               <button className="btn btn-light">
                  <BiFilterAlt />
                  &nbsp;Buscar
               </button>
            </li>
            <li>
               Localizar la inscripción en la lista de abajo y hacer click en el
               botón eliminar{" "}
               <button className="btn btn-danger">
                  <FaTrashAlt />
               </button>{" "}
               que se encuentra a la derecha del mismo.Tener en cuenta que
               cuando se elimina una inscripción, también se elimina el alumno
               de la clase, sus notas y asistencias y las cuotas relacionadas
               con dicha inscripción.
            </li>
            <li>Hacer click en el botón "Aceptar" en la ventana emergente.</li>
         </ul>
         <p className="heading-tertiary">Crear una clase</p>
         <ul>
            <li>
               Desde la página principal ir a "Clases" en el menú de la
               izquierda o en el menú de la barra superior de color azul (tres
               líneas) que se encuentra arriba a la derecha.
            </li>
            <li>
               En la parte inferior de la pantalla, hacer click en el botón
               "Nueva Clase"{" "}
               <button className="btn btn-dark">
                  <FaPlus />
                  &nbsp;Nueva Clase
               </button>
               .
            </li>
            <li>Seleccionar la categoría que va a tener la clase nueva.</li>
            <li>
               Hacer click en el botón "Buscar"{" "}
               <button className="btn btn-light">
                  <BiFilterAlt />
                  &nbsp;Buscar
               </button>
            </li>
            <li>
               Ir a la lista que aparece debajo y agregar los alumnos que irían
               a dicha clase haciendo click en el botón "Agregar"{" "}
               <button className="btn btn-dark">
                  <FaPlus />
                  &nbsp; Agregar
               </button>{" "}
               que se encuentra a la derecha del mismo.
            </li>
            <li>Ir a la pesataña "Clase".</li>
            <li>
               Rellenar los datos de la clase como profesor, aula, días y
               horarios.
            </li>
            <li>
               Solo en el caso de que los días tengan distintos horarios, hacer
               click sobre el checkbox que dice "Mismo Horario"{" "}
               <input className="form-checkbox" type="checkbox" />
               <label className="checkbox-lbl" htmlFor="active">
                  Mismo Horario
               </label>{" "}
               .
            </li>
            <li>Revisar que la lista de alumnos sea la correcta.</li>
            <li>
               Hacer click en el botón Registrar{" "}
               <button className="btn btn-primary">
                  <FiSave />
                  &nbsp;Registrar
               </button>{" "}
               que se encuentra al final de la página y aceptar en la pantalla
               emergente.
            </li>
         </ul>
         <p className="heading-tertiary">
            Editar una clase / Agregar o quitar alumnos de una clase
         </p>
         <ul>
            <li>
               Desde la página principal ir a "Clases" en el menú de la
               izquierda o en el menú de la barra superior de color azul (tres
               líneas) que se encuentra arriba a la derecha.
            </li>
            <li>
               Si no encuentra la clase fácilmente, rellene los campos del
               filtro necesarios en la sección superior y haga click en el botón
               "Buscar"
               <button className="btn btn-light">
                  <BiFilterAlt />
                  &nbsp;Buscar
               </button>
               .
            </li>
            <li>
               Ubique la clase que desea modificar y haga click en "Ver"{" "}
               <button className="btn-text">Ver &rarr;</button> que se encuentra
               a la derecha de dicha clase (Si no encuentra la palabra ver, vaya
               al final de la página y corra la lista hacia la derecha con la
               barra celeste que está debajo de la lista y busque nuevamente la
               clase).
            </li>
            <li>
               Al final de la página haga click en el botón de editar{" "}
               <button className="btn btn-mix-secondary">
                  <FaEdit />
               </button>{" "}
               que se encuentra a la derecha entre el botón de eliminar y
               generar pdf.
            </li>
            <li>Modificar los datos necesrios.</li>
            <li>
               Si se necesita eliminar un alumno de dicha clase, ir al final de
               la página y eliminarlo de la lista de alumnos haciendo click en
               "Eliminar"{" "}
               <button className="btn-danger">
                  <FaTrashAlt />
                  &nbsp; Eliminar
               </button>{" "}
               que se encuentra a la derecha del mismo. .
            </li>
            <li>
               Si se necesita agregar un nuevo alumno, ir a la pestaña "Alumnos"
               y seleccionar el alumno que aparece en la lista con el botón
               "Agregar"{" "}
               <button className="btn btn-dark">
                  <FaPlus />
                  &nbsp; Agregar
               </button>{" "}
               que se encuentra a la derecha del mismo. Si el alumno no aparece
               en la lista, no se encuentra inscripto (Deberá inscribirlo
               previamente).
            </li>
            <li>Si no se encuentra en la pestaña "Clase", selecciónela.</li>
            <li>Vaya al final de la página </li>
            <li>
               Hacer click en el botón Guardar Cambios{" "}
               <button className="btn btn-primary">
                  <FaEdit />
                  &nbsp;Guardar Cambios
               </button>{" "}
               que se encuentra al final de la página y en "Aceptar" en la
               pantalla emergente.
            </li>
         </ul>
         <p className="heading-tertiary">Eliminar una clase</p>
         <ul>
            <li>
               Desde la página principal ir a "Clases" en el menú de la
               izquierda o en el menú de la barra superior de color azul (tres
               líneas) que se encuentra arriba a la derecha.
            </li>
            <li>
               Si no encuentra la clase fácilmente, rellene los campos del
               filtro necesarios en la sección superior y haga click en el botón
               "Buscar"
               <button className="btn btn-light">
                  <BiFilterAlt />
                  &nbsp;Buscar
               </button>
               .
            </li>
            <li>
               Ubique la clase que desea eliminar y haga click en "Ver"{" "}
               <button className="btn-text">Ver &rarr;</button> que se encuentra
               a la derecha de dicha clase (Si no encuentra la palabra ver, vaya
               al final de la página y corra la lista hacia la derecha con la
               barra celeste que está debajo de la lista y busque nuevamente la
               clase).
            </li>
            <li>
               Al final de la página haga click en el botón de eliminar{" "}
               <button className="btn btn-danger">
                  <FaTrashAlt />
               </button>{" "}
               que se encuentra a la derecha. Tenga en cuenta que al eliminar la
               clase, deberá asignar los alumnos que pertenecían a esta a una
               nueva clase.
            </li>
            <li>Haga click en "Aceptar" en la pantalla emergente.</li>
         </ul>
         <p className="heading-tertiary">Agregar/Modificar notas a una clase</p>
         <ul>
            <li>
               Desde la página principal ir a "Clases" en el menú de la
               izquierda o en el menú de la barra superior de color azul (tres
               líneas) que se encuentra arriba a la derecha.
            </li>
            <li>
               Si no encuentra la clase fácilmente, rellene los campos del
               filtro necesarios en la sección superior y haga click en el botón
               "Buscar"
               <button className="btn btn-light">
                  <BiFilterAlt />
                  &nbsp;Buscar
               </button>
               .
            </li>
            <li>
               Ubique la clase a la que desea agregar/modificar las notas y haga
               click en "Ver" <button className="btn-text">Ver &rarr;</button>{" "}
               que se encuentra a la derecha de dicha clase (Si no encuentra la
               palabra ver, vaya al final de la página y corra la lista hacia la
               derecha con la barra celeste que está debajo de la lista y busque
               nuevamente la clase).
            </li>
            <li>
               Vaya al final de la página y haga click en el botón "Notas"{" "}
               <button className="btn btn-primar">
                  <FaPenFancy />
                  &nbsp; Notas
               </button>{" "}
               que está al final a la izquierda.
            </li>
            <li>
               Seleccione la pestaña correspondiente según las notas del
               bimestre que desea agregar/modificar.
            </li>
            <li>
               Si no están cargados los tipos de notas (no hay ningun lugar para
               rellenar con las notas de los alumnos):
               <ul>
                  <li>
                     Haga click en el botón "+ Nota"{" "}
                     <button className="btn btn-dark">
                        <FaPlus />
                        &nbsp; Nota
                     </button>{" "}
                     que está al final entre medio de los botones de "Guardar
                     Cambios" y de generar el pdf.
                  </li>
                  <li>Seleccione el tipo de nota que desea agregar.</li>
                  <li>Haga click en "Aceptar".</li>
               </ul>
            </li>
            <li>
               Rellene los campos de las notas de los alumnos correspondientes.
            </li>
            <li>
               Haga click en el botón "Guardar Cambios"{" "}
               <button className="btn btn-primary">
                  <FiSave />
                  &nbsp;Guardar Cambios
               </button>
               que se encuentra al final de la página y en "Aceptar" en la
               pantalla emergente.
            </li>
         </ul>
         <p className="heading-tertiary">
            Modificar inasistencias en una clase
         </p>
         <ul>
            <li>
               Desde la página principal ir a "Clases" en el menú de la
               izquierda o en el menú de la barra superior de color azul (tres
               líneas) que se encuentra arriba a la derecha.
            </li>
            <li>
               Si no encuentra la clase fácilmente, rellene los campos del
               filtro necesarios en la sección superior y haga click en el botón
               "Buscar"
               <button className="btn btn-light">
                  <BiFilterAlt />
                  &nbsp;Buscar
               </button>
               .
            </li>
            <li>
               Ubique la clase a la que desea agregar/modificar las notas y haga
               click en "Ver" <button className="btn-text">Ver &rarr;</button>{" "}
               que se encuentra a la derecha de dicha clase (Si no encuentra la
               palabra ver, vaya al final de la página y corra la lista hacia la
               derecha con la barra celeste que está debajo de la lista y busque
               nuevamente la clase).
            </li>
            <li>
               Vaya al final de la página y haga click en el botón
               "Inasistencias"{" "}
               <button className="btn btn-primary">
                  <IoCheckmarkCircleSharp />
                  &nbsp; Inasistencias
               </button>{" "}
               que está al final a la izquierda.
            </li>
            <li>
               Seleccione la pestaña correspondiente según las inasistencias del
               bimestre que desea cargar.
            </li>
            <li></li>
         </ul>
      </div>
   );
};

export default Help;
