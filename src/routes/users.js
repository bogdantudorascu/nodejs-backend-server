import express from "express";
import authenticate from "../middlewares/authenticate";
import userFunctions from "../database/users";
import bcrypt from "bcrypt";
const router = express.Router();

router.use(authenticate);

router.get("/search", (req, res) => {
    res.json({
        books: [
            {
                goodreadsId: 1,
                title: "1984",
                authors: "Orwell",
                covers: [
                    "https://images.gr-assets.com/books/1348990566l/5470.jpg",
                    "https://images.gr-assets.com/books/1504611957l/9577857.jpg"
                ],
                pages: 198
            },
            {
                goodreadsId: 2,
                title: "Three Men in a Boat",
                authors: "Jerome K. Jerome",
                covers: [
                    "https://images.gr-assets.com/books/1392791656l/4921.jpg",
                    "https://images.gr-assets.com/books/1312036878l/627830.jpg"
                ],
                pages: 256
            }
        ]
    });
});

router.get("/current_user", (req, res) => {
    const { email } = req;
    console.log("Got a req"+email);
    userFunctions.getUserByEmail(email, (errors, results) => {
        if (errors !== null) res.status(500).json({ errors });
        else if (results.length > 0) {
            const user = {
                email: results[0].email,
                confirmed: !!results[0].confirmed,
                username: results[0].username,
                admin: !!results[0].admin
            };
            res.json({ user });
        } else {
            res.status(400).json({ errors: { global: "User not found" } });
        }
    });
});


export default router;
