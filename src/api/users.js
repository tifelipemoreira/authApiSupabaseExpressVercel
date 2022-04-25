const users = async (req, res) => {
    console.log('Ping function')
      return res.status(200).json({
        status: 'OK',
      })
  }
  const users2 = async (req, res) => {
    console.log('Ping function')
      return res.status(200).json({
        status: 'OK 2',
      })
  }
  module.exports = {
    users,
    users2

}
