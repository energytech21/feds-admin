exports.page = (req,res,next)=>{

    if (req.session.uname){
        res.setHeader('Cache-Control', 'no-cache, no-store');
        res.render('../views/admin-account-mgt/acc-mgt',{title:"Accounts Management",sessionID: req.session.uid });
    }
    else{
        res.redirect('/');
    }
};

exports.update_status = (req,res,next)=>{
    
    req.getConnection((err, conn) => {
        if (err) return next("Cannot Connect");
        var user_id = req.body.user_id;
        var status_id = req.body.status_id;
        conn.beginTransaction((err) => {
            if(status_id != 4){
            conn.query("update user_users set status_id = ? where users_id = ?", [status_id,user_id], (err, result) => {
                if (err) return next("CONNECTION ERROR CHECK QUERY");

                conn.commit(function (err) {
                    if (err) {
                        return conn.rollback(function () {
                            throw err;
                        });
                    }
                    res.send('success');
                    res.end();
                });
            });
            }
            else{
                conn.query("delete from user_users where users_id = ?", [user_id], (err, result) => {
                    if (err) return next("CONNECTION ERROR CHECK QUERY");
    
                    conn.commit(function (err) {
                        if (err) {
                            return conn.rollback(function () {
                                throw err;
                            });
                        }
                        
                        res.send('success');
                        res.end();          
                    });
                });
            }
        });

    });
};      
