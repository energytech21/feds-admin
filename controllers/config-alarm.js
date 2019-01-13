exports.render = (req, res, next) => {
    res.render('../views/admin-config-alarm/config-alarm', { title: 'Alarm Configurations' });
}