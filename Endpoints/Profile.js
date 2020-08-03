const handleProfile = (req,res,database) =>{
	const {id} = req.params;
	database('users').where({id:id}).select('*')
	.then(data =>{
		if(data.length){
			res.status(200).json(data[0])
		}else{
			res.status(400).json("error")		
		}
	}) 
	.catch(error => res.status(400).json("error"));
}

module.exports={
	handleProfile: handleProfile
}