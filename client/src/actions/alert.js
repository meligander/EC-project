import { v4 as uuidv4 } from "uuid";
import store from "../utils/store";

import { ALERT_REMOVED, ALERT_REPLACED, ALERT_SETTED } from "./types";

export const setAlert =
   (msg, alertType, type = "2") =>
   (dispatch) => {
      const id = uuidv4();

      const exists = store.getState().alert.find((item) => item.msg === msg);

      if (exists) clearTimeout(exists.timer);

      const timer = setTimeout(
         () =>
            dispatch({
               type: ALERT_REMOVED,
               payload: id,
            }),
         5000
      );

      dispatch({
         type: exists ? ALERT_REPLACED : ALERT_SETTED,
         payload: {
            id,
            alertType,
            msg,
            type,
            ...(exists && { oldId: exists.id }),
            timer,
         },
      });
   };
