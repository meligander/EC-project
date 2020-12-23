import {
   REGISTER_LOADED,
   REGISTERS_LOADED,
   REGISTER_CLOSED,
   REGISTER_DELETED,
   REGISTERS_CLEARED,
   REGISTER_ERROR,
} from "../actions/types";

const initialState = {
   loading: true,
   register: null,
   registers: [],
   loadingRegisters: true,
   error: {},
};

export default function (state = initialState, action) {
   const { type, payload } = action;

   switch (type) {
      case REGISTER_LOADED:
         return {
            ...state,
            register: payload,
            loading: false,
            error: {},
         };
      case REGISTERS_LOADED:
         return {
            ...state,
            registers: payload,
            loadingRegisters: false,
         };
      case REGISTER_CLOSED:
         return state;
      case REGISTER_DELETED:
         return {
            ...state,
            registers: state.registers.filter(
               (register) => register._id !== payload
            ),
         };
      case REGISTERS_CLEARED:
         return initialState;
      case REGISTER_ERROR:
         return {
            ...state,
            register: null,
            registers: [],
            loading: false,
            loadingRegisters: false,
            error: payload,
         };
      default:
         return state;
   }
}
