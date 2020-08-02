const Clarifai = require('clarifai');
const app = new Clarifai.App({apiKey:'apikey'});

const handleApiCall=(req,res)=>{
	const {imageurl} = req.body;
	if(!imageurl){
		return response.status(400).json("Hubo un error, revisa la url de la imagen");
	}
	//Respuesta Clarifai
	// En {id: Clarifai.GENERAL_MODEL... reemplazamos GENERAL_MODEL por el model que realmente vamos a utilizar
	app.models
	.predict('a403429f2ddf4b49b307e318f00e528b',imageurl)
	.then(response => {
	    // There was a successful response
	    res.status(200).json(response);
	})
	.catch(error => {
	    // There was an error
		response.status(400).json("Error, no es posible trabajar con la api");
	});
}

function handleImage(req,res,database){
	const {id} = req.body;
	database('user').where({id:id}).increment('entries', 1)
	.then( data =>{
		console.log(data)
		if(data){
			res.status(200).json(data);
		}else{
			res.status(400).json('error');
		}
	}).catch(error => res.status(400).json('error'));
}

module.exports={
	handleImage : handleImage,
	handleApiCall: handleApiCall
}