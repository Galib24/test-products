const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./index.js'); // Ensure this points to your main application file

beforeAll(async () => {
    // Connect to a test database
    const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.l1yuqhx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`; // Replace with your test database URI
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('/post', () => {
    it('should create a new product', async () => {
        try {
            const response = await request(app)
                .post('/post')
                .send({
                    id: 3,
                    name: 'kamla',
                    productName: 'banana',
                    email: 'kamla@gmail.com',
                    shippingAddress: 'road jamdors',
                    city: 'new york',
                    country: 'USA',
                    totalPrice: 300
                });
            
           
        } catch (error) {
            console.error('Error creating new product:', error);
           
        }
    });
});
