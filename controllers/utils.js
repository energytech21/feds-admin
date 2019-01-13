exports.get_locations = (req, res, next) => {
    req.getConnection(function (err, conn) {
        if (err) return next("Cannot Connect");

        var query = conn.query("SELECT * FROM config_locations ", function (err, rows) {
            if (err) {
                console.log(err);
                return next("Mysql error, check your query");
            }

            res.send(rows);
            res.end();
        });
    });
}

exports.save_EQ = (req, res, next) => {

    req.getConnection(function (err, conn) {
        if (err) return next("Cannot Connect");

        var data = {
            x: req.body.x,
            y: req.body.y,
            z: req.body.z
        }
        var query = conn.query("update config_alarm set level1_threshold = ?, level2_threshold =? ,level3_threshold = ? where sensor_type = ?",[data.x, data.y, data.z, 'earth_def'], function (err, rows) {
            if (err) {
                console.log(err);
                return next("Mysql error, check your query");
            }

            res.send('success');
            res.end();
        });
    });
}

exports.get_EQ = (req, res, next) => {

    req.getConnection(function (err, conn) {
        if (err) return next("Cannot Connect");

        var query = conn.query("SELECT * from config_alarm where sensor_type = 'earth_def' ", function (err, rows) {
            if (err) {
                console.log(err);
                return next("Mysql error, check your query");
            }

            res.send(rows);
            res.end();
        });
    });
}


exports.save_evac = (req, res, next) => {

    req.getConnection(function (err, conn) {
        if (err) return next("Cannot Connect");

        conn.query("update config_alarm_messages set message=? where alarm_type = 'evac' ",[req.body.evacNotice], function (err, rows) {
            if (err) {
                console.log(err);
                return next("Mysql error, check your query");
            }

            res.send('success');
            res.end();
        });
    });
}

exports.get_evac = (req, res, next) => {

    req.getConnection(function (err, conn) {
        if (err) return next("Cannot Connect");

        conn.query("select * from config_alarm_messages where alarm_type = 'evac' ",[req.body.evacNotice], function (err, rows) {
            if (err) {
                console.log(err);
                return next("Mysql error, check your query");
            }

            res.send(rows);
            res.end();
        });
    });
}


