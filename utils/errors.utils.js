// create error handling for signup and signIn 

  module.exports.signUpErrors = (err) => {
    let errors = { pseudo: '', email: '', password: ''};
  
    if (err.message.includes('pseudo')) {
      errors.pseudo = "Pseudo incorrect ou déjà utilisé.";
    }
    if (err.message.includes('email')) {
      errors.email = "Email incorrect ou existant.";
    }
    if (err.message.includes('password')) {
      errors.password = "Le mot de passe doit faire au minimum 6 caractères.";
    }
  
    if (err.errors) {
      Object.keys(err.errors).forEach((field) => {
        if (field === 'pseudo' && err.errors.pseudo.kind === 'required') {
          errors.pseudo = 'Le pseudo est obligatoire';
        }
        if (field === 'email' && err.errors.email.kind === 'required') {
          errors.email = 'L\'email est obligatoire';
        }
        if (field === 'password' && err.errors.password.kind === 'required') {
          errors.password = 'Le mot de passe est obligatoire';
        }
      });
    }
  
    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('pseudo')) {
      errors.pseudo = "Cet pseudo existe déjà";
    }
    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('email')) {
      errors.email = "Cet email existe déjà";
    }
  
    return errors;
  };
  

module.exports.signInErrors = (err) => {
    let errors = { email: '', password: ''}

    if (err.message.includes("email"))
        errors.email = 'Email inconnu';

    if (err.message.includes("password"))
        errors.password = 'Mot de passe invalide';

}