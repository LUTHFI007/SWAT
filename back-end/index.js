const port = 4000;
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

app.use(express.json());
app.use(cors());

//Database Connection With mongoDB
mongoose.connect("mongodb+srv://luthfishaj11:Luthfi007@cluster0.kg0cuar.mongodb.net/SWAT")

//API Creation
app.get('/',(req,res)=>{
    res.send('Express App Is Running')
})

//Image Storage Engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})

//Creating Upload Endpoint For Images
app.use('/images',express.static('upload/images'))

app.post("/upload", upload.fields([{ name: 'image1' }, { name: 'image2' }, { name: 'image3' }, { name: 'image4' }]), (req, res) => {
    const image_urls = {};
    if (req.files) {
        for (const key in req.files) {
            if (Object.hasOwnProperty.call(req.files, key)) {
                if (req.files[key].length > 0) {
                    image_urls[key] = `http://localhost:${port}/images/${req.files[key][0].filename}`;
                }
            }
        }
    }
    res.json({
        success: 1,
        image_urls,
    });
});

//Schema for creating Products
const Product = mongoose.model("Product",{
    id:{
        type: Number,
        required: true,
    },
    name:{
        type: String,
        required: true,
    },
    image1:{
        type: String,
        required: true,
    },
    image2:{
        type: String,
        required: true,
    },
    image3:{
        type: String,
        required: true,
    },
    image4:{
        type: String,
        required: true,
    },
    category:{
        type: String,
        required: true,
    },
    new_price:{
        type: Number,
        required: true,
    },
    old_price:{
        type: Number,
        required: true,
    },
    date:{
        type: Date,
        default: Date.now,
    },
    available:{
        type: Boolean,
        default: true,
    }
})

app.post('/addproduct', async(req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length>0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    }
    else{
        id = 1;
    }
    const product = new Product({
        id: id,
        name: req.body.name,
        image1: req.body.image1,
        image2: req.body.image2,
        image3: req.body.image3,
        image4: req.body.image4,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    });
    console.log(product);
    await product.save();
    console.log('Saved!');
    res.json({
        success: true,
        name: req.body.name,
    })
})

//Creating API for deleting Products
app.post('/removeproduct', async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed!");
    res.json({
        success: true,
        name: req.body.name
    })
})

//Creating API for getting all products
app.get('/allproducts', async(req,res)=>{
    let products = await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
})

// Endpoint for editing products
app.put('/editproduct', async (req, res) => {
    const { id, name, image1, image2, image3, image4, category, new_price, old_price, available } = req.body;

    try {
        let product = await Product.findOne({ id: id });

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Update product fields
        if (name !== undefined) product.name = name;
        if (image1 !== undefined) product.image1 = image1;
        if (image2 !== undefined) product.image2 = image2;
        if (image3 !== undefined) product.image3 = image3;
        if (image4 !== undefined) product.image4 = image4;
        if (category !== undefined) product.category = category;
        if (new_price !== undefined) product.new_price = new_price;
        if (old_price !== undefined) product.old_price = old_price;
        if (available !== undefined) product.available = available;

        await product.save();
        console.log('Product Updated!');
        res.json({
            success: true,
            message: 'Product updated successfully',
            product
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


//Schema Creating For user Model
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
    }
})

//Creating Endpoint For Registering the user
app.post('/signup',async(req,res)=>{
    let check = await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,errors:"Existing User Found With The Same Email Address"})
    }
    let cart = {};
    for (let i = 0; i <300; i++) {
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

    const token = jwt.sign(data,'secret_swat');
    res.json({success:true,token})
})

//Creating Endpoint for user Login
app.post('/login',async(req,res)=>{
    let user = await Users.findOne({email:req.body.email});
    if (user) {
        const passCompare = req.body.password === user.password;
        if (passCompare) {
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_swat');
            res.json({success:true,token});
        }
        else{
            res.json({success:false,errors:"Invalid Password!"});
        }
    }
    else{
        res.json({success:false,errors:"Invalid Email Id!"})
    }
})

//Creating endpoint for New Arrivals Data
app.get('/newarrivals',async (req,res)=>{
    let products = await Product.find({});
    let newarrivals = products.slice(1).slice(-8);
    console.log("New Arrivals Fetched");
    res.send(newarrivals);
})

//Creating endpoint for trending Sports Shoes
app.get('/trendingsports', async (req,res)=>{
    let products = await Product.find({category:"Sports"});
    let trending_sports = products.slice(0,4);
    console.log("Trending in Sports Fetched");
    res.send(trending_sports);
})

//Creating middleware to fetch User

const fetchUser = async (req,res,next)=>{
    const token = req.header('auth-token');
    if (!token){
        res.status(401).send({errors:"Please Authenticate Using Valid Token"})
    }
    else{
        try {
            const data = jwt.verify(token,'secret_swat');
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({errors:"Please Authenticate Using Valid Token"})
        }
    }
}

//Creating endpoint for adding products in cartData
app.post('/addtocart', fetchUser,async (req,res)=>{
    console.log("Added",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] +=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
    res.send("Added.")
})

//Creating endpoint for removing products from cartData
app.post('/removefromcart',fetchUser,async (req,res)=>{
    console.log("Removed",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
    res.send("Removed.")
})

//Creating Endpoint to get cartdata
app.post('/getcart',fetchUser,async (req,res)=>{
    console.log("GetCart");
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})

app.listen(port,(error)=>{
    if(!error){
        console.log("Server Running on Port "+port)
    }
    else{
        console.log("Error : "+error);
    }
})