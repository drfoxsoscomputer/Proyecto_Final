const {userCreate, userwithPass, userWithPassLogin} = require('../../Controllers/Users/userLogin')

const userLogHandler = async(req,res)=>{
    const {email, password, nickname, given_name, picture, sub}=req.body;
    try{
        if(email && sub && !password){
            try {
                const send = await userCreate(email, password, nickname, given_name, picture, sub);
                res.status(201).json(send);
            } catch (error) {
                res.status(400).json({error: error.message})
            }
        
       
        }else if(email && password){
           try {
            const send = await userwithPass(email, password);
            res.status(201).json(send);
           } catch (error) {
            res.status(400).json({error:error.message})
           }
        }
    }catch(error){
         res.status(400).json({error:error.message});
    }   
}

const loginUserHand = async (req, res)=>{
    const {email, password}=req.body;
    try {
        const send = await userWithPassLogin(email, password);
            res.status(201).json(send);
    } catch (error) {
        res.status(400).json({error:error.message});
    }

}

module.exports = {
    userLogHandler,
    loginUserHand
};

