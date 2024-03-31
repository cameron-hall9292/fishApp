


const LocalStrategy = require('passport-local').Strategy

const bcrypt = require('bcrypt');


  async function initialize(){
    const authenticateUser = async (email, password, done) => {
        const user = await users.findOne({email: email});

        console.log(user);
        //.then((user) =>  {
       
        if (user == null) {
            return done(null, false, {message: "No user with that email"
        })
    
    }


        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null,user)
            }
            else {
                return done(null, false, {message: "password incorrect"})
            }

        
        } catch(error){

            return done(error);

        }

       
    }
    
    

    passport.use(new LocalStrategy({ usernameField: 'email'}, 
    authenticateUser))
    passport.serializeUser((user, done) => done(null,user.id));

    passport.deserializeUser((id, done) => {
        return done(null,getUserById(id))
    })

}

module.exports = initialize