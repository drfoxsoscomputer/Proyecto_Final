const getUser = require('../../Controllers/Users/getUser')

const getUserHandler = async(req, res)=>{
    const {
        page = 0,
        size = 20
    } = req.query;

    //console.log("page :: " + page);
    //console.log("size :: " + size);

    try {
        const user = await getUser(page, size);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({error: error.message})
    }
}
module.exports=getUserHandler;
