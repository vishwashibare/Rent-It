// this is schema file
const User = require('../models/user');
const carschema = require('../models/cars')


// rendering register page
module.exports.registerEJS = (req,res)=>{
    res.render('./views/Users/register');
}

module.exports.registerDataInsert = async (req, res, next) => {
    try {
        // storing data in the variable 
        const { email, username, password } = req.body;
        // inserting data in the database
        const user = new User({ email, username });
        // below code is for storing password in user collection/document (always use it for hashing)
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            res.redirect('/car/allcars');
        })
    } catch (e) {
        res.redirect('/register');
    }
    console.log("registered");
}

// rendering login page
module.exports.userLoginEJS = (req, res) => {
    res.render('./views/home.ejs');
}

// checking is the user is correct or not
module.exports.CheckLoginEJS = (req, res) => {
    const redirectUrl = req.session.returnTo || '/car/allcars';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.Logout = (req, res) => {
    req.logout(req.user, err => {
        if(err) return next(err);
        res.redirect('/car/allcars');
      });
}

// when you press on Rent car button
module.exports.mycars = async(req,res)=>{

    // this is for adding data in reqFrom
    const car = await carschema.findById(req.params.id).populate({path : "author",populate : {path:"reqFrom"}});
    const carOwner = await User.findById(car.author._id).populate('reqFrom');
    const currentUserId = req.user._id;
    const carID = req.params.id // person who owns the car



    carOwner.reqFrom.push({userId : currentUserId,carId : carID});
    await carOwner.save();
    let isrequestAccepted = false;
    carOwner.reqFrom.map((requests)=>{
      if(requests.userId==currentUserId && requests.carId==carID){
        isrequestAccepted = requests.isRequesteAccepted;
      }
    })
    // res.send(carOwner);

    // adding data in rented car
    const currentuser = await User.findById(req.user);
    currentuser.rentedcar.push(car);
    await currentuser.save();
    const current = await User.findById(req.user).populate('rentedcar')
   // res.send(carOwner);
    res.redirect('/car/allcars');
}


