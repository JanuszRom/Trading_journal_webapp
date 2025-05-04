import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const TradeService = {
  getAllTrades: async () => {
    try {
      const response = await axios.get(`${API_URL}/trades`);
      return response.data;
    } catch (error) {
      console.error("Error fetching trades:", error);
      throw error;
    }
  },

  getTrade: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/trades/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching trade ${id}:`, error);
      throw error;
    }
  },

  createTrade: async (tradeData) => {
    try {
      // Create FormData for file uploads
      const formData = new FormData();
      
      // Add trade data to formData
      Object.keys(tradeData).forEach(key => {
        if (key !== 'screenshots') {
          formData.append(key, tradeData[key]);
        }
      });
      
      // Add screenshots if any
      if (tradeData.screenshots) {
        tradeData.screenshots.forEach(file => {
          formData.append('screenshots', file);
        });
      }
      
      const response = await axios.post(`${API_URL}/trades`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error("Error creating trade:", error);
      throw error;
    }
  },

  updateTrade: async (id, tradeData) => {
    try {
      // Create FormData for file uploads
      const formData = new FormData();
      
      // Add trade data to formData
      Object.keys(tradeData).forEach(key => {
        if (key !== 'screenshots') {
          formData.append(key, tradeData[key]);
        }
      });
      
      // Add new screenshots if any
      if (tradeData.screenshots) {
        tradeData.screenshots.forEach(file => {
          formData.append('screenshots', file);
        });
      }
      
      const response = await axios.put(`${API_URL}/trades/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error updating trade ${id}:`, error);
      throw error;
    }
  },

  deleteTrade: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/trades/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting trade ${id}:`, error);
      throw error;
    }
  },
  uploadScreenshot: async (tradeId, file) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('screenshot', file);
      
      const response = await axios.post(`${API_URL}/trades/${tradeId}/screenshots`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error uploading screenshot for trade ${tradeId}:`, error);
      throw error;
    }
  },


  deleteScreenshot: async (screenshotId) => {
    try {
      const response = await axios.delete(`${API_URL}/screenshots/${screenshotId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting screenshot ${screenshotId}:`, error);
      throw error;
    }
  },

  downloadExcel: () => {
    window.open(`${API_URL}/export/excel`, '_blank');
  }
};

export default TradeService;