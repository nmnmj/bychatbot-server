const { createClient } = require('redis');
require('dotenv').config();

const redisClient = createClient({
  url: process.env.REDIS_SERVICE_URL
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err));

const connectRedis = async () => {
  await redisClient.connect();
  console.log('Redis Connected');
};

module.exports = { redisClient, connectRedis };

// import { createClient } from 'redis'; // Importing redis client from 'redis' package
// import dotenv from 'dotenv'; // To handle environment variables
// dotenv.config(); // Load environment variables from .env

// const serviceUri = process.env.REDIS_SERVICE_URL; // Get Redis service URL from env
// const redisClient = createClient({
//   url: serviceUri,
// });

// // Log Redis connection success
// redisClient.on('connect', () => {
//   console.log('Redis connected successfully');
// });

// // Log Redis errors
// redisClient.on('error', (err) => {
//   console.error('Redis Client Error:', err);
// });

// // Function to connect to Redis
// const connectRedis = async () => {
//   try {
//     await redisClient.connect();
//     console.log('Redis Connected');
//   } catch (error) {
//     console.error('Failed to connect to Redis:', error);
//   }
// };

// export { redisClient, connectRedis }; // Export the client and connection function
