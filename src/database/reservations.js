import connections from '../connections';

export default {
    insert_reservation(data, callback) {
        connections.getConnection((error, connection) => {
            let errors = {};
            if (error) {
                errors["global"] = "Connection: "+error;
                callback(errors, null)
            } else
                connection.query("INSERT INTO reservations SET ?", data, function(err,results,fields){
                    connection.release();
                    if(err){
                        errors["global"] = "Query: "+err;
                        callback(errors, null)
                    } else
                        callback(null, results.insertId)
                });
        });
    },
    getReservations(offset,callback) {
        connections.getConnection((error, connection) => {
            let errors = {};
            if (error) {
                errors["global"] = "Connection: "+error;
                callback(errors, null)
            } else {
                let query = "SELECT reservations.id, reservations.date, reservations.paid, reservations.name, locations.name AS location FROM reservations INNER JOIN locations ON reservations.location_id = locations.id ORDER BY date ASC LIMIT 20";
                if (offset !== "undefined") query += " OFFSET "+connection.escape(offset);
                const q = connection.query(query, function (err, results, fields) {
                    connection.release();
                    if (err) {
                        errors["global"] = "Query: " + err;
                        callback(errors, null)
                    } else
                        callback(null, results)
                });
                console.log(q.sql);
            }
        });
    },
    updateReservation(data, callback) {
        connections.getConnection((error, connection) => {
            let errors = {};
            if (error) {
                errors["global"] = "Connection: "+error;
                callback(errors, null)
            } else {
                const q = connection.query("UPDATE reservations SET name = ?, date = ?, paid = ?, location_id = ? WHERE id = ?", [data.name,data.date,data.paid,data.locationId, data.id], function (err, results, fields) {
                    connection.release();
                    if (err) {
                        errors["global"] = "Query: " + err;
                        callback(errors, null)
                    } else
                        callback(null, results.affectedRows)
                });
                console.log(q.sql);
            }
        });
    },
    getReservationById(id, callback) {
        connections.getConnection((error, connection) => {
            let errors = {};
            if (error) {
                errors["global"] = "Connection: "+error;
                callback(errors, null)
            } else
                connection.query("SELECT * FROM reservations WHERE id = ?", id, function(err,results,fields){
                    connection.release();
                    if(err){
                        errors["global"] = "Query: "+err;
                        callback(errors, null)
                    } else
                        callback(null, results)
                });
        });
    }
}