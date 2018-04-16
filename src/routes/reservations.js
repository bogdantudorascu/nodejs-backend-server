import express from "express";
import authenticate from "../middlewares/authenticate";
import reservations from "../database/reservations";
import moment from "moment"
import jwt from "jsonwebtoken";
import locations from "../database/locations";
const router = express.Router();

router.post("/", (req, res) => {
    const { data } = req.body;
    console.log(data)
    const date = moment(data.date);
    if(date.isValid()) {
        data.date = date.format("YYYY/MM/DD");
        reservations.insert_reservation(data, (errors, reservation) => {
            console.log(reservation)
            if (errors !== null) res.status(500).json(errors);
            else
                res.json({reservation});
        });
    }
    else res.status(400).json({errors: "Invalid format"})
});

router.get("/:id", (req, res) => {
    const { id } = req.params;
    if(id){
        reservations.getReservationById(id, (errors, reservation) => {
            if (errors !== null) res.status(500).json(errors);
            else
                res.json({reservation});
        });
    } else res.status(400).json({errors: "Invalid params"})
});

router.put("/", (req, res) => {
    const { data } = req.body;
    const date = moment(data.date);
    if(date.isValid()) {
        data.date = date.format("YYYY/MM/DD");
        reservations.updateReservation(data,(errors, affectedRows) => {
            if (errors !== null) res.status(500).json(errors);
            else if(affectedRows === 1){
                res.json({});
            }
            else
                res.status(500).json({errors: "Could not update"});
        });
    }
    else res.status(400).json({errors: "Invalid format"})
});

router.get("/all/:offset", (req, res) => {
    const { offset } = req.params;
    console.log("Offset is"+offset);
    reservations.getReservations(offset, (errors, reservations) => {
        console.log(reservations)
        if (errors !== null) res.status(500).json(errors);
        else
            res.json({reservations});
    });
});

export default router;