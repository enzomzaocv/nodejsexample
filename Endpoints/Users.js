function handleUsers(req,res,database){
	database.select('*').from('user').then(data => res.json(data));
}

module.exports ={
	handleUsers: handleUsers
}