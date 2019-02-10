exports.get_locations = (req, res, next) => {
    req.getConnection(function (err, conn) {
        if (err) return next("Cannot Connect");

        var query = conn.query("SELECT * FROM vlocations ", function (err, rows) {
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

exports.add_location = (req,res,next)=>{
    const data = {
        location: req.body.location,
        floor_id: req.body.floor_id
    }
    req.getConnection(function (err, conn) {
        if (err) return next("Cannot Connect");

        conn.query("insert into config_locations (location,floor_id) values (?,?)",[data.location,data.floor_id], function (err, rows) {
            if (err) {
                console.log(err);
                return next("Mysql error, check your query");
            }
            res.send('success');
            res.end();
        });
    });
}


exports.update_location = (req,res,next)=>{
    const data = {
        location_id : req.body.location_id,
        location: req.body.location,
        floor_id: req.body.floor_id
    }
    req.getConnection(function (err, conn) {
        if (err) return next(err);

        conn.query("update config_locations set location = ?,floor_id = ? where location_id = ?",[data.location,data.floor_id,data.location_id], function (err, rows) {
            if (err) {
                return next(err);
            }
            res.send('success');
            res.end();
        });
    });
}

exports.get_table_locations = (req,res,next)=>{
    req.getConnection(function(err, conn) {
        if (err) return next(err);
  
  
        var srchstrlen = req.body["search[value]"].length;
        var strquery = "";
        var columnArray = ['location','floor','location_id'];
        if(srchstrlen>0){
          strquery = `SELECT * FROM vlocations where location like '%${req.body["search[value]"]}%' or floor like '%${req.body["search[value]"]}%' ORDER BY ${columnArray[req.body["order[0][column]"]]} ${req.body["order[0][dir]"]}`;
        }
        else{
          strquery = `SELECT * FROM vlocations ORDER BY ${columnArray[req.body["order[0][column]"]]} ${req.body["order[0][dir]"]}`;
        }
       
        
        var query = conn.query(strquery,[req.session.uid] ,function(err, rows) {
          if (err) {
            console.log(err);
            return next("Mysql error, check your query");
          }
  
          var parsedData = [];
        
          rows.forEach(e => {
            var rowdata = {
              location: e.location,
              floor : e.floor,
              location_id : e.location_id
            };
            parsedData.push(rowdata);
          });
  
          var endIndex = parseInt(req.body.start)+parseInt(req.body.length);
          parsedData = parsedData.slice(req.body.start,endIndex);
  
          var data = {
            draw: req.body.draw,
            data: parsedData,
            recordsTotal: rows.length,
            recordsFiltered: rows.length
          };
          res.send(data);
          res.end();
        });
      });
}