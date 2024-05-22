const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const rateLimit = require('express-rate-limit')
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// limit of 10 request per second for one users
const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: 'too many request coming by you  please try again later' 
})
app.use(limiter);

const uri = "mongodb+srv://abuyeahia24:iQykWr4ojEQSIAca@cluster0.l1yuqhx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});

// Schema definition
const sch = {
    id: Number,
    name: String,
    productName: String,
    email: String,
    shippingAddress: String,
    city: String,
    country: String,
    Phone: String,
    totalPrice: Number,
    date: Date

};

const monModel = mongoose.model('NEWCOL', sch);

// Post data
app.post('/post', async (req, res) => {
    console.log('inside post function');

    try {
        const data = new monModel({
            id: req.body.id,
            name: req.body.name,
            productName: req.body.productName,
            email: req.body.email,
            shippingAddress: req.body.shippingAddress,
            city: req.body.city,
            country: req.body.country,
            phone: req.body.phone,
            totalPrice: req.body.totalPrice,
            date: Date.now()
        });
        const val = await data.save();
        res.json(val);
    } catch (error) {
        console.error(error);
        res.status(500).send(' Server Error');
    }
});



// get data product


app.get('/data', async (req, res) => {
    try {
        const data = await monModel.find();
        res.json(data);

    } catch (error) {
        console.log(error);
        res, status(500).send('server Error')
    }
})


// get data how count of product select one person we also can define  unique person my email query

app.get('/user-products', async (req, res) => {
    try {
        const userProductCount = await monModel.aggregate([
            {
                $group: {
                    _id: "$email",  
                    totalProducts: { $sum: 1 }  
                }
            }
        ]);
        res.json(userProductCount);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


// update product

app.put('/update/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const filter = { _id: new ObjectId(id) }; 
        console.log(`Updating document with id: ${filter}`);

        const updateData = {
            id: req.body.id,
            name: req.body.name,
            email: req.body.email,
        };

        const options = { upsert: true }; 

        const result = await monModel.updateOne(filter, updateData, options);
        if (result) {
            res.json(result);
        } else {
            res.status(404).send('Document not found');
        }
    } catch (error) {
        console.error('Error updating data', error);
        res.status(500).send('Internal Server Error');
    }
});


// delete

app.delete('/update/:id', async (req, res) => {
    const id = req.body.id;
    console.log(id);
    const query = { _id: new ObjectId(id) }
    const result = await monModel.deleteOne(query)
    res.send(result);
})









// server setup



app.get('/', (req, res) => {
    res.send('simple run');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
