	
const handleSignIn = (req,res,database,bcrypt)=>{
	const {email,password} = req.body;
	if(!validateData(email,password)){
		return res.status(400).json("Revisa tu email y password")
	}
	database
	.columns('user.email','userpassword.passwordHash')
	.select()
	.from('user')
	.where('email',email)
	.innerJoin('userpassword', 'user.id', 'userpassword.userId')
	.then(data=>{
		const esValido = bcrypt.compareSync(password, data[0].passwordHash);
			if(esValido){
				return database.select('*').from('user').where('email','=',email)
				.then(user=>{
					res.status(200).json(user[0]);
				})
				.catch(error=>{
					res.status(400).json('No se ha podido hacer login')
				})
			}
		res.status(400).json('Error, revisa email o contraseña')
	})
	.catch(error=>{
		res.status(400).json('Revisa tu usuario y/o contraseña')
	})
}

const handleSignIn2= (req,res,database,bcrypt) =>{
	const {email,password} = req.body;

}

const validateData=(email,password)=>{
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const emailValido= emailRegEx.test(String(email).toLowerCase());
    const passwordRegEx=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;
/*	
    /^
  	(?=.*\d)          // should contain at least one digit
  	(?=.*[a-z])       // should contain at least one lower case
  	(?=.*[A-Z])       // should contain at least one upper case
  	[a-zA-Z0-9]{8,}   // should contain at least 8 from the mentioned characters
	$/;
*/
	const passwordValido = passwordRegEx.test(String(password))
	if(passwordValido && emailValido){
		console.log('em',emailValido)
		console.log('ps',passwordValido)
		return true;
	}
	return false;
}

module.exports = {
	handleSignIn: handleSignIn
}
