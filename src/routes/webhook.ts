import { Router } from "express";
import { 
  handleScaleTeam, 
  handleWHFreezeUser, 
  handleWHFreezeFreeze, 
  handleWHPaceUser 
} from "../handlers/index.js";
import { createRouter } from "../utils/create.js";
import { authenticate } from "../middleware/auth.js";
import { handleTransaction } from '../handlers/transaction.js';

const { WH_SCALETEAM_CREATE_SECRET, WH_TRANSACTION_CREATE_SECRET, WH_FREEZE_USER_SECRET, WH_FREEZE_FREEZE_SECRET, WH_PACE_USER_SECRET } = process.env;

export default createRouter((router: Router) => {
  router.post(
    "/transaction", 
    authenticate({ secret: WH_TRANSACTION_CREATE_SECRET! }),
    handleTransaction
  );
  // router.post(
  //   "/location",
  //   authenticate({ secret: WH_LOCATION_SECRET! }),
  //   handleLocation
  // );
  router.post(
    "/scale-team",
    authenticate({ secret: WH_SCALETEAM_CREATE_SECRET! }),
    handleScaleTeam
  );

  router.post(
    "/freeze/user",
    authenticate({ secret: WH_FREEZE_USER_SECRET! }),
    handleWHFreezeUser
  );

  router.post(
    "/freeze/freeze",
    authenticate({ secret: WH_FREEZE_FREEZE_SECRET! }),
    handleWHFreezeFreeze
  );

  router.post(
    "/pace/user",
    authenticate({ secret: WH_PACE_USER_SECRET! }),
    handleWHPaceUser
  );
});
