import { Router } from "express";
import { handleLocation } from "@/handlers/locations";
import { createRouter } from "@/utils/create";
import { authenticate } from "@/middleware/auth";

const { WH_LOCATION_SECRET } = process.env;

export default createRouter((router: Router) => {
    router.post("/location", authenticate({secret: WH_LOCATION_SECRET! }), handleLocation);
});
