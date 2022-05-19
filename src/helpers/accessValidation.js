require("dotenv/config");
const pool = require("../config/dbPostgress");
//
module.exports = async function accessValidation(req) {
  try {
    const response = await pool.query(
      `select
      u.isAdmin,p.id
    from
      users u
      left join permissions p on (
        u.id = p.id_user
        and p.delet = false
        and  p.method = '${req.method.toLowerCase()}'
        and p.endpoint = '${req.endPoint.toLowerCase()}'
      )
    where
      u.delet = false
      and u.id = '${req.userId}'`
    );
    if (response.rows[0]) {
      if (response.rows[0].isadmin) {
        //se admin sempre permitido
        return true;
      } else if (response.rows[0].id) {
        //se possui id na tabela permissions permite
        return true;
      } else {
        return false;
      }
    }
    return false;
  } catch (e) {
    return false;
  }
};
