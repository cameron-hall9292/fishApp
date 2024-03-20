//test out bcrypt to see how it works



const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

let myHash = 0;




//hash and salt password

const hashPass = async () => {

const hashedPassw = await new Promise((resolve, reject) => {

    bcrypt.hash(myPlaintextPassword, saltRounds,  function(err, hash) {
        if (err) reject(err);
        else {
            resolve(hash);
            myHash = hash;
            console.log(myHash);
        }
    })
});
   
      return hashedPassw;
};   


//compare password to hash to check for match



const comparePass = async () => {

    await bcrypt.compare(someOtherPlaintextPassword, myHash, function(err, result) {
        if (err) console.log(err);
       
        else {
            
            if (result == false) console.log("password does not match");
            else if (result == true) console.log("password match");
          
            return result;
        }
    });



}

hashPass()
    .then(()  => {
        comparePass();


});









