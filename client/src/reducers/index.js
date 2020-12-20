import { combineReducers } from "redux";
import alert from "./alert";
import user from "./user";
import auth from "./auth";
import navbar from "./navbar";
import classes from "./class";
import grades from "./grade";
import attendance from "./attendance";
import installment from "./installment";
import towns from "./town";
import neighbourhoods from "./neighbourhood";
import registers from "./register";
import categories from "./category";
import expences from "./expence";
import posts from "./post";
import mixvalues from "./mixvalues";
import invoices from "./invoice";
import enrollments from "./enrollment";
import penalty from "./penalty";

export default combineReducers({
   alert,
   attendance,
   auth,
   categories,
   classes,
   installment,
   enrollments,
   expences,
   grades,
   invoices,
   mixvalues,
   navbar,
   neighbourhoods,
   penalty,
   posts,
   registers,
   towns,
   users: user,
});
