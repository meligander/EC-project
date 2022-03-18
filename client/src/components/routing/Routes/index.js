import React from "react";
import { connect } from "react-redux";
import { Switch, Route, withRouter } from "react-router-dom";

//Unregister Pages
import Login from "../../pages/guest/Login";

//Register Pages
import Dashboard from "../../pages/registered/Dashboard";
import Credentials from "../../pages/registered/admin/users/Credentials";
import SingleClass from "../../pages/registered/admin/classes/SingleClass";
import Attendance from "../../pages/registered/Attendance";
import Grades from "../../pages/registered/Grades";
import Observations from "../../pages/registered/Observations";

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
import WithdrawalList from "../../pages/registered/admin/lists/WithdrawalList";
import RegisterByMonth from "../../pages/registered/admin/lists/RegisterByMonth";

import PrivateRoutes from "../PrivateRoutes";
import PublicRoutes from "../PublicRoutes";
import NotFound from "../../layouts/NotFound";

const Routes = ({ location, global: { navbar, footer } }) => {
   return (
      <section
         style={{
            minHeight: `calc(100vh - ${footer}px - ${navbar}px)`,
            justifyContent: `${
               location.pathname === "/login" ? "center" : "stretch"
            }`,
         }}
         className="container"
      >
         <Switch>
            <PublicRoutes exact path="/login" component={Login} />
            <PrivateRoutes
               exact
               types={[]}
               path="/index/dashboard/:user_id"
               component={Dashboard}
            />
            <PrivateRoutes
               exact
               path="/index/dashboard/:user_id/:class_id"
               types={[]}
               component={Dashboard}
            />
            <PrivateRoutes
               exact
               path="/user/edit/:user_id"
               types={[]}
               component={RegisterUser}
            />

            <PrivateRoutes
               exact
               types={[]}
               path="/user/credentials/:user_id"
               component={Credentials}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "teacher", "admin&teacher"]}
               path="/user/search"
               component={Search}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "admin&teacher"]}
               path="/register/info"
               component={RegisterInfo}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "admin&teacher"]}
               path="/index/categories"
               component={Categories}
            />
            <PrivateRoutes
               exact
               types={[]}
               path="/class/single/:class_id"
               component={SingleClass}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "admin&teacher"]}
               path="/class/register"
               component={RegisterClass}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "admin&teacher"]}
               path="/class/edit/:class_id"
               component={RegisterClass}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "admin&teacher"]}
               path="/index/installments/:user_id"
               component={Installments}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "admin&teacher"]}
               path="/index/installment/:type/:item_id"
               component={EditInstallment}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "teacher", "admin&teacher"]}
               path="/class/all"
               component={Classes}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "admin&teacher"]}
               path="/invoice/register"
               component={InvoiceGeneration}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "admin&teacher"]}
               path="/invoice/single/:invoice_id"
               component={Invoice}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "teacher", "admin&teacher"]}
               path="/class/attendances/:class_id"
               component={Attendance}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "teacher", "admin&teacher"]}
               path="/class/grades/:class_id"
               component={Grades}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "teacher", "admin&teacher"]}
               path="/class/observations/:class_id"
               component={Observations}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "admin&teacher"]}
               path="/enrollment/register"
               component={Enrollment}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "admin&teacher"]}
               path="/enrollment/edit/:enrollment_id"
               component={Enrollment}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "admin&teacher"]}
               path="/user/towns-neighbourhoods/edit"
               component={EditNeigTowns}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "admin&teacher"]}
               path="/register/expencetypes/edit"
               component={EditExpenceType}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "admin&teacher"]}
               path="/class/gradetypes/edit"
               component={EditGradeType}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "admin&teacher"]}
               path="/enrollment/list"
               component={EnrollmentList}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "admin&teacher"]}
               path="/register/income/list"
               component={IncomeList}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "admin&teacher"]}
               path="/register/transaction/list"
               component={TransactionList}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "admin&teacher"]}
               path="/index/installment/list"
               component={InstallmentList}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "admin&teacher"]}
               path="/register/list"
               component={RegisterList}
            />
            <PrivateRoutes
               exact
               types={["admin", "admin&teacher"]}
               path="/register/monthly-list"
               component={RegisterByMonth}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "admin&teacher"]}
               path="/index/mentions-list"
               component={MentionList}
            />
            <PrivateRoutes
               exact
               types={["admin", "secretary", "admin&teacher"]}
               path="/register/withdrawal/list"
               component={WithdrawalList}
            />
            <Route component={NotFound} />
         </Switch>
      </section>
   );
};

const mapStateToProps = (state) => ({
   global: state.global,
});

export default connect(mapStateToProps)(withRouter(Routes));
