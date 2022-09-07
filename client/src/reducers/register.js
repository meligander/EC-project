import {
   REGISTER_LOADED,
   REGISTERS_LOADED,
   REGISTER_CLOSED,
   REGISTER_DELETED,
   REGISTERS_CLEARED,
   REGISTER_ERROR,
   REGISTER_CLEARED,
   REGISTERS_ERROR,
   REGISTERS_PDF_ERROR,
} from "../actions/types";

const initialState = {
   register: null,
   loadingRegister: true,
   registers: [],
   loading: true,
   error: {},
};

export default function (state = initialState, action) {
   const { type, payload } = action;

   switch (type) {
      case REGISTER_LOADED:
         return {
            ...state,
            register: payload,
            loadingRegister: false,
            error: {},
         };
      case REGISTERS_LOADED:
         return {
            ...state,
            registers: payload,
            loading: false,
            error: {},
         };
      case REGISTER_CLEARED:
      case REGISTER_CLOSED:
         return {
            ...state,
            register: null,
            loadingRegister: true,
            error: {},
         };
      case REGISTER_DELETED:
         return {
            ...state,
            registers: state.registers.filter(
               (register) => register._id !== payload
            ),
         };
      case REGISTERS_CLEARED:
         return {
            ...state,
            registers: [],
            loading: true,
            error: {},
         };
      case REGISTER_ERROR:
         return {
            ...state,
            loadingRegister: false,
            error: payload,
         };
      case REGISTERS_ERROR:
         return {
            ...state,
            registers: [],
            loading: false,
            error: payload,
         };
      case REGISTERS_PDF_ERROR:
         return {
            ...state,
            error: payload,
         };
      default:
         return state;
   }
}
