import { Router } from "express";
import { handleLocation, handleScaleTeam } from "../handlers/index.js";
import { createRouter } from "../utils/create.js";
import { authenticate } from "../middleware/auth.js";

const { WH_LOCATION_SECRET, WH_SCALETEAM_CREATE_SECRET } = process.env;

export default createRouter((router: Router) => {
  router.post(
    "/location",
    authenticate({ secret: WH_LOCATION_SECRET! }),
    handleLocation
  );
  router.post(
    "/scale-team",
    authenticate({ secret: WH_SCALETEAM_CREATE_SECRET! }),
    handleScaleTeam
  );
});
