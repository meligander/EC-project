import React from "react";
import { Switch, Route } from "react-router-dom";

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
import NotFound from "../../layouts/NotFound";

const Routes = () => {
   return (
      <section className="container">
         <Switch>
            <PublicRoutes exact path="/login" component={Login} />
            <PrivateRoutes
               exact
               types={[]}
               path="/dashboard/:user_id"
               component={Dashboard}
            />
            <PrivateRoutes
               exact
               path="/register"
               types={["admin", "secretary", "admin&teacher"]}
               component={RegisterUser}
            />
            <PrivateRoutes
               exact
               path="/edit-user/:user_id"
               types={[]}
               component={RegisterUser}
            />
            <PrivateRoutes
               exact
               types={[]}
               path="/credentials/:user_id"
               component={ChangeCredentials}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "teacher", "admin&teacher"]}
               path="/search"
               component={Search}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "admin&teacher"]}
               path="/cashregister-info"
               component={RegisterInfo}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "admin&teacher"]}
               path="/categories"
               component={Categories}
            />
            <PrivateRoutes
               exact
               types={[]}
               path="/chat/:class_id"
               component={Chat}
            />
            <PrivateRoutes
               exact
               types={[]}
               path="/class/:class_id"
               component={OneClass}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "admin&teacher"]}
               path="/register-class"
               component={RegisterClass}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "admin&teacher"]}
               path="/edit-class/:class_id/:category_id"
               component={RegisterClass}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "admin&teacher"]}
               path="/installments/:user_id"
               component={Installments}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "admin&teacher"]}
               path="/edit-installment/:type/:installment_id"
               component={EditInstallment}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "teacher", "admin&teacher"]}
               path="/classes"
               component={Classes}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "admin&teacher"]}
               path="/invoice-generation"
               component={InvoiceGeneration}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "admin&teacher"]}
               path="/invoice/:invoice_id"
               component={Invoice}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "teacher", "admin&teacher"]}
               path="/attendances/:class_id"
               component={Attendance}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "teacher", "admin&teacher"]}
               path="/grades/:class_id"
               component={Grades}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "admin&teacher"]}
               path="/enrollment"
               component={Enrollment}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "admin&teacher"]}
               path="/edit-enrollment/:enrollment_id"
               component={Enrollment}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "admin&teacher"]}
               path="/edit-towns-neighbourhoods"
               component={EditNeigTowns}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "admin&teacher"]}
               path="/edit-expencetypes"
               component={EditExpenceType}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "admin&teacher"]}
               path="/edit-gradetypes"
               component={EditGradeType}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "admin&teacher"]}
               path="/enrollment-list"
               component={EnrollmentList}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "admin&teacher"]}
               path="/income-list"
               component={IncomeList}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "admin&teacher"]}
               path="/transaction-list"
               component={TransactionList}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "admin&teacher"]}
               path="/installment-list"
               component={InstallmentList}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "admin&teacher"]}
               path="/register-list"
               component={RegisterList}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "admin&teacher"]}
               path="/mention-list"
               component={MentionList}
            />
            <Route component={NotFound} />
         </Switch>
      </section>
   );
};

export default Routes;
