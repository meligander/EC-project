import React from "react";
import { Switch } from "react-router-dom";

//Unregister Pages
import Login from "../../unregister/Login";

//Register Pages
import Dashboard from "../../register/Dashboard";
import ChangeCredentials from "../../register/admin/users/ChangeCredentials";
import Chat from "../../register/groupchat/Chat";
import OneClass from "../../register/admin/classes/OneClass";
import Attendance from "../../register/Attendance";
import Grades from "../../register/Grades";

//Admin Pages
import RegisterUser from "../../register/admin/users/RegisterUser";
import Search from "../../register/Search";
import RegisterInfo from "../../register/admin/RegisterInfo";
import Categories from "../../register/admin/Categories";
import RegisterClass from "../../register/admin/classes/RegisterClass";
import Installments from "../../register/admin/Installments";
import EditInstallment from "../../register/admin/edit/EditInstallment";
import Classes from "../../register/admin/classes/Classes";
import InvoiceGeneration from "../../register/admin/invoice/InvoiceGeneration";
import Invoice from "../../register/admin/invoice/Invoice";
import Enrollment from "../../register/admin/Enrollment";
import EditNeigTowns from "../../register/admin/edit/EditNeigTowns";
import EditExpenceType from "../../register/admin/edit/EditExpenceType";
import EditGradeType from "../../register/admin/edit/EditGradeType";
import EnrollmentList from "../../register/admin/lists/EnrollmentList";
import IncomeList from "../../register/admin/lists/IncomeList";
import TransactionList from "../../register/admin/lists/TransactionList";
import InstallmentList from "../../register/admin/lists/InstallmentList";
import RegisterList from "../../register/admin/lists/RegisterList";
import MentionList from "../../register/admin/lists/MentionList";

import PrivateRoutes from "../PrivateRoutes";
import PublicRoutes from "../PublicRoutes";

const Routes = () => {
   return (
      <section className="container">
         <Switch>
            <PublicRoutes exact path="/login" component={Login} />
            <PrivateRoutes
               exact
               types={[]}
               path="/dashboard/:id"
               component={Dashboard}
            />
            <PrivateRoutes
               exact
               path="/register"
               types={["Administrador", "Secretaria", "Admin/Profesor"]}
               component={RegisterUser}
            />
            <PrivateRoutes
               exact
               path="/edit-user/:id"
               types={[]}
               component={RegisterUser}
            />
            <PrivateRoutes
               exact
               types={[]}
               path="/credentials/:id"
               component={ChangeCredentials}
            />
            <PrivateRoutes
               exact
               types={[
                  "Administrador",
                  "Secretaria",
                  "Profesor",
                  "Admin/Profesor",
               ]}
               path="/search"
               component={Search}
            />
            <PrivateRoutes
               exact
               types={["Administrador", "Secretaria", "Admin/Profesor"]}
               path="/cashregister-info"
               component={RegisterInfo}
            />
            <PrivateRoutes
               exact
               types={["Administrador", "Secretaria", "Admin/Profesor"]}
               path="/categories"
               component={Categories}
            />
            <PrivateRoutes exact types={[]} path="/chat/:id" component={Chat} />
            <PrivateRoutes
               exact
               types={[]}
               path="/class/:id"
               component={OneClass}
            />
            <PrivateRoutes
               exact
               types={["Administrador", "Secretaria", "Admin/Profesor"]}
               path="/register-class"
               component={RegisterClass}
            />
            <PrivateRoutes
               exact
               types={["Administrador", "Secretaria", "Admin/Profesor"]}
               path="/edit-class/:id"
               component={RegisterClass}
            />
            <PrivateRoutes
               exact
               types={["Administrador", "Secretaria", "Admin/Profesor"]}
               path="/installments/:studentid"
               component={Installments}
            />
            <PrivateRoutes
               exact
               types={["Administrador", "Secretaria", "Admin/Profesor"]}
               path="/edit-installment/:id"
               component={EditInstallment}
            />
            <PrivateRoutes
               exact
               types={["Administrador", "Secretaria", "Admin/Profesor"]}
               path="/edit-installment/:type/:id"
               component={EditInstallment}
            />
            <PrivateRoutes
               exact
               types={[
                  "Administrador",
                  "Secretaria",
                  "Profesor",
                  "Admin/Profesor",
               ]}
               path="/classes"
               component={Classes}
            />
            <PrivateRoutes
               exact
               types={["Administrador", "Secretaria", "Admin/Profesor"]}
               path="/invoice-generation"
               component={InvoiceGeneration}
            />
            <PrivateRoutes
               exact
               types={["Administrador", "Secretaria", "Admin/Profesor"]}
               path="/invoice/:id"
               component={Invoice}
            />
            <PrivateRoutes
               exact
               types={[
                  "Administrador",
                  "Secretaria",
                  "Profesor",
                  "Admin/Profesor",
               ]}
               path="/attendance/:id"
               component={Attendance}
            />
            <PrivateRoutes
               exact
               types={[
                  "Administrador",
                  "Secretaria",
                  "Profesor",
                  "Admin/Profesor",
               ]}
               path="/grades/:id"
               component={Grades}
            />
            <PrivateRoutes
               exact
               types={["Administrador", "Secretaria", "Admin/Profesor"]}
               path="/enrollment"
               component={Enrollment}
            />
            <PrivateRoutes
               exact
               types={["Administrador", "Secretaria", "Admin/Profesor"]}
               path="/edit-enrollment/:id"
               component={Enrollment}
            />
            <PrivateRoutes
               exact
               types={["Administrador", "Secretaria", "Admin/Profesor"]}
               path="/edit-towns-neighbourhoods"
               component={EditNeigTowns}
            />
            <PrivateRoutes
               exact
               types={["Administrador", "Secretaria", "Admin/Profesor"]}
               path="/edit-expencetypes"
               component={EditExpenceType}
            />
            <PrivateRoutes
               exact
               types={["Administrador", "Secretaria", "Admin/Profesor"]}
               path="/edit-gradetypes"
               component={EditGradeType}
            />
            <PrivateRoutes
               exact
               types={["Administrador", "Secretaria", "Admin/Profesor"]}
               path="/enrollment-list"
               component={EnrollmentList}
            />
            <PrivateRoutes
               exact
               types={["Administrador", "Secretaria", "Admin/Profesor"]}
               path="/income-list"
               component={IncomeList}
            />
            <PrivateRoutes
               exact
               types={["Administrador", "Secretaria", "Admin/Profesor"]}
               path="/transaction-list"
               component={TransactionList}
            />
            <PrivateRoutes
               exact
               types={["Administrador", "Secretaria", "Admin/Profesor"]}
               path="/installment-list"
               component={InstallmentList}
            />
            <PrivateRoutes
               exact
               types={["Administrador", "Secretaria", "Admin/Profesor"]}
               path="/register-list"
               component={RegisterList}
            />
            <PrivateRoutes
               exact
               types={["Administrador", "Secretaria", "Admin/Profesor"]}
               path="/mention-list"
               component={MentionList}
            />
         </Switch>
      </section>
   );
};

export default Routes;
