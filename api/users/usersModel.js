const db = require('../../data/dbConfig')

async function getAll(){
    return db('users')
}

async function getBy(filter){
    return db('users').where(filter)
}

async function getById(id){
    return db('users').where({id}).first()
}

async function add(user){
    const newUserId = await db('users').insert(user)
    return db('users').where({id:newUserId}).first()
}

module.exports = {
    getAll,
    getBy,
    getById,
    add
}
