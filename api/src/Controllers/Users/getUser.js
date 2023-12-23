const {User}=require('../../database');
const { Op } = require('sequelize');
const { getEmails}= require('../../utils/createSUs')

const getUser = async( page, size, req, res )=>{
    const {email1, email2}=getEmails();
    page = +page;
    size = +size;
    //console.log("page :: " + page);
    //console.log("size :: " + size);
    try {
        const { count, rows } = await User.findAndCountAll({
            where:{
                deleteAt:false,
                email: {
                    [Op.notIn]: [email1, email2] // Lista de correos electrónicos a excluir
                }
            },
            limit: size,
            offset: page * size,
        });

        const auxTotalPages = Math.ceil(count / size);
        const auxPrevPage = page - 1 >= 0 ? page - 1 : -1;
        const auxNextPage = page + 1 < auxTotalPages ? page + 1 : -1;
        const auxHasPrevPage = page - 1 >= 0 ? true : false;
        const auxHasNextPage = page + 1 < auxTotalPages ? true : false;

        return {
            users: rows,
            PaginationData: {
                totalItems: count,
                limit: size,
                totalPages: auxTotalPages,
                currentPage: page,
                hasPrevPage: auxHasPrevPage,
                hasNextPage: auxHasNextPage,
                prevPage: auxPrevPage,
                nextPage: auxNextPage,
            }
        }

        return rows;
        //return users;
    } catch (error) {
        res.status(500).send("getUser not found");
    }
}
module.exports= getUser;
