const pool = require("../config/dbPostgress");


const raiz = async (req, res) => {
  return res.json({
    status: "Em Construção - API ",
  });
};

const getUsersbyEmail = async (req, res) => {
  console.log("Ping function");
  return res.status(200).json({
    status: "Email",
  });
};

const getUserById = async (req, res) => {
  //obriga enviar o ID
  if (!req.query.id){
    return res.status(400).json({status:"Consulta por ID. Obrigatório passar o ID."});
  }
  var id = req.query.id
  try {
    pool.query(
      `SELECT id,erp_user_code,email FROM USERS WHERE id = '${id}' `,
      (error, result) => {
        //retorna objeto com resultado da query
        if (typeof error != "undefined") {
          //console.log("erro")
          return res.status(400).json({ error });
        }
        //console.log("funcionou")
        return res.status(200).json(result.rows);
      }
    );
  } catch (e) {
    console.log(e)
    return res.status(400).json({e});
  }
};

module.exports = {
  raiz,
  getUserById,
  getUsersbyEmail
};
