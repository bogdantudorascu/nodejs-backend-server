import express from "express";
import authenticate from "../middlewares/authenticate";
import locations from "../database/locations";
const router = express.Router();

router.post("/", (req, res) => {
    const { data } = req.body;
    console.log(data)
    locations.insertLocation(data, (errors, location) => {
        if (errors !== null) res.status(500).json(errors);
        else
            res.json({location});
    });
});

router.get("/", (req, res) => {
    locations.getLocations((errors, locations) => {
        console.log(locations)
        if (errors !== null) res.status(500).json(errors);
        else
            res.json({locations});
    });
});

router.put("/", (req, res) => {
    const { data } = req.body;
    locations.updateLocation(data,(errors, affectedRows) => {
        if (errors !== null) res.status(500).json(errors);
        else if(affectedRows === 1){
            res.json({});
        }
        else
            res.status(500).json({errors: "Could not update"});
    });
});

router.get("/:id", (req, res) => {
    const { id } = req.params;
    if(id){
        locations.getlocationById(id, (errors, location) => {
            if (errors !== null) res.status(500).json(errors);
            else
                res.json({location});
        });
    } else res.status(400).json({errors: "Invalid params"})
});

export default router;