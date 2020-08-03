function handleUsers(req,res,database){
	database.select('*').from('users').then(data => res.json(data));
}

module.exports ={
	handleUsers: handleUsers
}
