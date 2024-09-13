const port = process.env.PORT || 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const Stripe = require("stripe");
const stripe = Stripe("sk_test_51PvOql02k1yCOeuvPvB7F3USBJUYJRSGAqKvxOnxa0jIdN5RJrzlAtE3PIVAob0apLqUHiaoVhq7HBOFlQ9zedsS000Dps62l4");
const fs = require('fs');    // some changes

app.use(express.json());
app.use(cors());

//checkout api
app.post("/create-checkout-session",async(req,res)=>{
    const {products , cart_items} = req.body;
    console.log("items",cart_items)

    try{
        const lineItems = products.map((product,index)=>{
            return{
                price_data:{
                    currency:"inr",
                    product_data:{
                        name:product.name
                    },
                    unit_amount: product.new_price * 100,
                },
                quantity:cart_items[product.id],
        };
        });
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items:lineItems,
            mode:"payment",
            success_url:"https://e-commerce-front-0j6w.onrender.com/success",
            cancel_url:"http://localhost:3000/cancel",
        });
        res.json({ id: session.id });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create Stripe session' });
    }
});


app.listen(7000,()=>{
    console.log("server start");
})

// Database Connection with MongoDB
// mongoose.connect(process.env.MONGO_URL || "mongodb+srv://kritikumari36312:backend_server@cluster0.n3rzche.mongodb.net/e-commerce", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// }).then(() => console.log("MongoDB connected"))
// .catch(err => console.log("MongoDB connection error:", err));


// some changes
mongoose.connect(process.env.MONGO_URL || "mongodb+srv://kritikumari36312:backend_server@cluster0.n3rzche.mongodb.net/e-commerce")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("MongoDB connection error:", err));



// API Creation
app.get("/",(req,res)=>{
    res.send("Express App is Running")
})

app.listen(port,(error)=>{
    if(!error){
        console.log("Server Running on Port "+port)
    }
    else{
        console.log("Error : "+error)
    }
})



//some changes
const uploadDir = './upload/images';
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir,{recursive:true});
}

// Image Storage Engine
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage: storage });

// Serve static files from the upload directory
app.use('/images', express.static(path.join(__dirname, 'upload/images')));

// Determine the base URL dynamically
const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://e-commerce-backend-c6zo.onrender.com' 
    : `http://localhost:${port}`;

// Upload endpoint for images
app.post('/upload', upload.single('product'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: 0, message: 'No file uploaded' });
    }

    res.json({
        success: 1,
        image_url: `${baseUrl}/images/${req.file.filename}`
    });
});

// Start the server
// app.listen(port, () => console.log(`Server running on port ${port}`));


// Image Storage Engine
// const storage = multer.diskStorage({
//     destination: './upload/images',
//     filename:(req,file,cb)=>{
//         return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
//     }
// })
// const upload = multer({storage:storage})

// // Creating Upload Endpoint for images
// app.use('/images',express.static('upload/images'))

// // Determine the base URL dynamically
// const baseUrl = process.env.NODE_ENV === 'production' 
//   ? 'https://e-commerce-backend-c6zo.onrender.com' 
//   : `http://localhost:${port}`;

// app.post('/upload',upload.single('product'),async(req,res)=>{
//     res.json({
//         success:1,
//         image_url:`${baseUrl}/images/${req.file.filename}`
//     })
// })

// Schema for Creating Products
const Product = mongoose.model("Product",{
    id:{
        type:Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String, 
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    avilable:{
        type:Boolean,
        default:true,
    },
})

app.post('/addproduct',async(req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length>0){
        let last_product_array = products.slice(-1);
        let last_product =last_product_array[0];
        id=last_product.id+1;
    }
    else{
        id=1;
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    })
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success:true,
        name:req.body.name,
    })
})

// Creating API for deleting Products
app.post('/removeproduct',async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success:true,
        name:req.body.name
    })
})  

//Creating API for getting all products
app.get('/allproducts',async(req,res)=>{
    let products = await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
})

// Shema creating for user model
const Users = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    },
})

// Creating Endpoint for registring the user
app.post('/signup',async (req,res)=>{
    let check=await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,errors:"Existing User found with same email address"})
    }
    let cart = {};
    for(let i=0;i<300;i++){
        cart[i]=0;
    }
    const user = new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })
    await user.save();

    const data = {
        user:{
            id:user.id
        }
    }

    const token = jwt.sign(data,'secret_ecom');
    res.json({success:true,token})
})

// Creating Endpoint for user login
app.post('/login',async (req,res)=>{
    let user=await Users.findOne({email:req.body.email});
    if(user){
        const passCompare = req.body.password === user.password;
        if(passCompare){
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom');
            res.json({success:true,token})
        }
        else{
            res.json({success:false,errors:"Wrong Password"});
        }
    } 
    else{
        res.json({success:false,errors:"Wrong Email Id"});
    }
})

// Creating endpoint for newcollection data
app.get('/newcollections',async (req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("NewCollection Fetched");
    res.send(newcollection);
})

// Creating endpoint for newcollection data
app.get('/popularinwomen',async (req,res)=>{
    let products = await Product.find({category:"women"});
    let popular_in_women = products.slice(0,4);
    console.log("Popular in Women Fetched");
    res.send(popular_in_women);
})

// Creating middelware to fetch user
const fetchUser = async (req,res,next)=>{
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({errors:"Please authenticate using valid token"})
    }
    else{
        try{
            const data = jwt.verify(token,'secret_ecom');
            req.user = data.user;
            next();
        }catch(error) {
            res.status(401).send({errors:"Please authenticate using valid token"})
        }
    }
}

// Creating endpoint for adding products in cartdata
app.post('/addtocart',fetchUser,async (req,res)=>{
    console.log("added",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Added")
})

// Creating endpoint for remove product from cartdata
app.post('/removefromcart',fetchUser,async (req,res)=>{
    console.log("removed",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Removed")
})

// Creating endpoint to get cartdata
app.post('/getcart',fetchUser,async (req,res)=>{
    console.log("getcart");
    let userData=await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})

// app.post('/clearcart', fetchUser, async (req, res) => {
//     try {
//         // let userData = await Users.findOne({ _id: req.user.id });
        
//         // Set all cart items to 0
//         // Object.keys(userData.cartData).forEach(itemId => {
//         //     userData.cartData[itemId] = 0;
//         // });

//         // Update the cartData in the database
//         await Users.findOneAndUpdate(
//             { _id: req.user.id }, 
//             { cartData: {} }
//         );
        
//         res.send("Cart cleared successfully");
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Error clearing the cart");
//     }
// });
