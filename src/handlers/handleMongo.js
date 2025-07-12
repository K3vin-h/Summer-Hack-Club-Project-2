const mongoose = require('mongoose');

module.exports = async (client) => {
    client.logger.info('MongoDB connecting....');
    try {
        await mongoose.connect(process.env.MongoString,).then(() => {
            client.logger.info('MongoDB connected successfully.');
        })
    } catch (error) {
        client.logger.error('Failed to connect to MongoDB:', error);
    }

    mongoose.connection.on('connected', () => {
        client.logger.info('MongoDB connection established.');
    });

    mongoose.connection.on('error', (err) => {
        client.logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
        client.logger.warn('MongoDB connection disconnected.');
    });
}