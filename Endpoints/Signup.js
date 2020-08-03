const handleSignUp = (req,res,database,bcrypt)=>{
	const {nombre, email, password}= req.body;
	if(!validateData(email,password,nombre)){
		return res.status(400).json("Revisa tus datos")
	}
	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(password, salt);

	database.transaction(trx => {
		let password ={passwordhash:hash};
	  	database.insert({nombre: nombre, email: email, joined: new Date()}).into('users').returning('id')
	  	.transacting(trx)
		    .then(id => {
		      password.userid= id[0];
		      return database('userpassword').insert(password).returning('userid').transacting(trx);
		    })
	    	.then(trx.commit)
	    	.catch(trx.rollback);
	})
	.then(function(inserts) {
	  res.status(200).json(inserts[0]);
	})
	.catch(function(error) {
		res.status(400).json('No se ha podido registrar el usuario');
	});
}

const validateData=(email,password,username)=>{
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const passwordRegEx=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;
    const usernameRegEx =/^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
/*	Especificaciones password regular expresion
    /^
  	(?=.*\d)          // should contain at least one digit
  	(?=.*[a-z])       // should contain at least one lower case
  	(?=.*[A-Z])       // should contain at least one upper case
  	[a-zA-Z0-9]{8,}   // should contain at least 8 from the mentioned characters
	$/;
*/
/*	Especificaciones username regular expresion
	/^
	(?=.{8,20}$)  		// username is 8-20 characters long
	(?![_.])	  		// no _ or . at the beginning
	(?!.*[_.]{2})		// no __ or _. or ._ or .. inside
	[a-zA-Z0-9._]		// allowed characters
	+
	(?<![_.])			// no _ or . at the end
	$/
*/
    const emailValido= emailRegEx.test(String(email).toLowerCase());
	const passwordValido = passwordRegEx.test(String(password));
	const usernameValido = usernameRegEx.test(String(username));
	if(passwordValido && emailValido && usernameValido){
		return true;
	}
	return false;
}

module.exports={
	handleSignUp: handleSignUp
}