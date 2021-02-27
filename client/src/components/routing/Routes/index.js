import React from "react";
import { Switch, Route } from "react-router-dom";

//Unregister Pages
import Login from "../../pages/guest/Login";

//Register Pages
import Dashboard from "../../pages/registered/Dashboard";
import Credentials from "../../pages/registered/admin/users/Credentials";
import Chat from "../../pages/registered/Chat";
import OneClass from "../../pages/registered/admin/classes/OneClass";
import Attendance from "../../pages/registered/Attendance";
import Grades from "../../pages/registered/Grades";

//Admin Pages
import RegisterUser from "../../pages/registered/admin/users/RegisterUser";
import Search from "../../pages/registered/Search";
import RegisterInfo from "../../pages/registered/admin/RegisterInfo";
import Categories from "../../pages/registered/admin/Categories";
import RegisterClass from "../../pages/registered/admin/classes/RegisterClass";
import Installments from "../../pages/registered/admin/Installments";
import EditInstallment from "../../pages/registered/admin/edit/EditInstallment";
import Classes from "../../pages/registered/admin/classes/Classes";
import InvoiceGeneration from "../../pages/registered/admin/invoice/InvoiceGeneration";
import Invoice from "../../pages/registered/admin/invoice/Invoice";
import Enrollment from "../../pages/registered/admin/Enrollment";
import EditNeigTowns from "../../pages/registered/admin/edit/EditNeigTowns";
import EditExpenceType from "../../pages/registered/admin/edit/EditExpenceType";
import EditGradeType from "../../pages/registered/admin/edit/EditGradeType";
import EnrollmentList from "../../pages/registered/admin/lists/EnrollmentList";
import IncomeList from "../../pages/registered/admin/lists/IncomeList";
import TransactionList from "../../pages/registered/admin/lists/TransactionList";
import InstallmentList from "../../pages/registered/admin/lists/InstallmentList";
import RegisterList from "../../pages/registered/admin/lists/RegisterList";
import MentionList from "../../pages/registered/admin/lists/MentionList";

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
               component={Credentials}
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
