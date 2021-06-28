const query = {
    createEvent: `INSERT INTO evento SET ?`,
    selectEvents: `select * from evento`,
    editEvent:`UPDATE evento SET ? WHERE id = ?`,
    deleteEvent:`DELETE FROM evento WHERE id = ?`,
    selectLugar: `select * from lugar`,
    selectColor: `select * from color`
};

module.exports = query;