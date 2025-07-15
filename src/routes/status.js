const mongoose = require("mongoose");

module.exports = (app, client) => {
  app.get('/api/status', async (req, res) => {
    try {
      const mongoState = mongoose.connection.readyState;
      const mongoStatus = ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoState] || 'unknown';

      res.status(200).json({
        status: 'ok',
        serverTime: new Date(),
        mongoStatus,
        dashboardStatus: "online",
        apiStatus: "online",
      });
    } catch (error) {
      console.error("Status check error:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to retrieve system status.",
        error: error.message,
      });
    }
  });
};


