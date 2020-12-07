import React from "react";
import { Route, Switch } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import Alert from "../Alert";

//Unregister Pages
import Login from "../unregister/Login";

//Register Pages
import Dashboard from "../register/dashboard/Dashboard";
import ChangeCredentials from "../register/admin/users/ChangeCredentials";
import Chat from "../register/groupchat/Chat";
import CommentPost from "../register/groupchat/CommentPost";
import OneClass from "../register/admin/classes/OneClass";
import Attendance from "../register/attendance/Attendance";
import Grades from "../register/grades/Grades";

//Admin Pages
import RegisterUser from "../register/admin/users/RegisterUser";
import Search from "../register/search/Search";
import RegisterInfo from "../register/admin/registerInfo/RegisterInfo";
import Categories from "../register/admin/Categories";
import RegisterClass from "../register/admin/classes/RegisterClass";
import Installments from "../register/admin/Installments";
import EditInstallment from "../register/admin/edit/EditInstallment";
import Classes from "../register/admin/classes/Classes";
import InvoiceGeneration from "../register/admin/invoice/InvoiceGeneration";
import Invoice from "../register/admin/invoice/Invoice";
import Enrollment from "../register/admin/Enrollment";
import EditNeigTowns from "../register/admin/edit/EditNeigTowns";
import EditExpenceType from "../register/admin/edit/EditExpenceType";
import EditGradeTypes from "../register/admin/edit/EditGradeTypes";
import EnrollmentList from "../register/admin/lists/EnrollmentList";
import IncomeList from "../register/admin/lists/IncomeList";
import ExpenceList from "../register/admin/lists/ExpenceList";
import DebtList from "../register/admin/lists/DebtList";
import RegisterList from "../register/admin/lists/RegisterList";

const Routes = () => {
   return (
      <section className="container">
         <Alert type="1" />
         <Switch>
            <Route exact path="/login" component={Login} />
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
               path="/chat/post/:id"
               component={CommentPost}
            />
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
               path="/edit-installment/:id/:year/:number"
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
               component={EditGradeTypes}
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
               path="/expence-list"
               component={ExpenceList}
            />
            <PrivateRoutes
               exact
               types={["Administrador", "Secretaria", "Admin/Profesor"]}
               path="/debt-list"
               component={DebtList}
            />
            <PrivateRoutes
               exact
               types={["Administrador", "Secretaria", "Admin/Profesor"]}
               path="/register-list"
               component={RegisterList}
            />
         </Switch>
      </section>
   );
};

export default Routes;
