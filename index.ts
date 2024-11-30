import app from './src/app';
import mongoConnection from './src/config/dbConfig';

(async () => {
  try {
    // Connect to MongoDB
    await mongoConnection.connect();
    console.log('Database connection established');

    // Find an available port starting from the default port (5000)
    const port = process.env.PORT || 3000;

    // Start the server
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1);
  }
})();
