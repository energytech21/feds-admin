exports.render = (req, res, next) => {
    res.render('../views/admin-config-alarm/config-alarm', { title: 'Alarm Configurations' });
}

exports.get_config = (req, res, next) => {
    req.getConnection((err, conn) => {
        conn.query("select * from config_alarm", (err, result) => {
            res.send(result);
            res.end();
        })
    })
}

exports.post_config = (req, res, next) => {
    req.getConnection((err, conn) => {
        var config = {
            type: req.body.type,
            lvl1 : req.body.lvl1,
            lvl2 : req.body.lvl2,
            lvl3 : req.body.lvl3
        }
        conn.beginTransaction((err) => {
            conn.query("update config_alarm set level1_threshold = ?, level2_threshold = ? , level3_threshold = ? where sensor_type = ?", [
                config.lvl1,config.lvl2,config.lvl3,config.type], (err, result) => {
                if (err) {
                    console.log(err);
                    conn.rollback();
                    res.send(err);
                    res.end();
                }
                else {
                    conn.commit();
                    res.send("success");
                    res.end();
                }
            });
        });
    })
}