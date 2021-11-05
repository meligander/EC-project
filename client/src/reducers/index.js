import { combineReducers } from "redux";
import alert from "./alert";
import user from "./user";
import auth from "./auth";
import classes from "./class";
import grades from "./grade";
import attendances from "./attendance";
import installments from "./installment";
import towns from "./town";
import neighbourhoods from "./neighbourhood";
import registers from "./register";
import categories from "./category";
import expences from "./expence";
import posts from "./post";
import mixvalues from "./mixvalues";
import invoices from "./invoice";
import enrollments from "./enrollment";
import penalties from "./penalty";

export default combineReducers({
   alert,
   attendances,
   auth,
   categories,
   classes,
   installments,
   enrollments,
   expences,
   grades,
   invoices,
   mixvalues,
   neighbourhoods,
   penalties,
   posts,
   registers,
   towns,
   users: user,
});
