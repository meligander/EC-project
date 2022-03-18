import { v4 as uuidv4 } from "uuid";

import { ALERT_REMOVED, ALERT_SETTED } from "./types";

export const setAlert =
   (msg, alertType, type = "2") =>
   (dispatch) => {
      const id = uuidv4();
      dispatch({
         type: ALERT_SETTED,
         payload: {
            id,
            alertType,
            msg,
            type,
         },
      });

      setTimeout(
         () =>
            dispatch({
               type: ALERT_REMOVED,
               payload: id,
            }),
         4000
      );
   };
