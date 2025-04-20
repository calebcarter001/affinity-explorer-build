import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
});

export const getAffinityStats = async () => {
  try {
    const response = await api.get('/affinities/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching affinity stats:', error);
    throw error;
  }
};

export const getRecentActivity = async () => {
  try {
    const response = await api.get('/affinities/activity');
    return response.data;
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    throw error;
  }
};

export const createAffinity = async (affinityData) => {
  try {
    const response = await api.post('/affinities', affinityData);
    return response.data;
  } catch (error) {
    console.error('Error creating affinity:', error);
    throw error;
  }
};

export const updateAffinity = async (id, affinityData) => {
  try {
    const response = await api.put(`/affinities/${id}`, affinityData);
    return response.data;
  } catch (error) {
    console.error('Error updating affinity:', error);
    throw error;
  }
};

export const deleteAffinity = async (id) => {
  try {
    await api.delete(`/affinities/${id}`);
  } catch (error) {
    console.error('Error deleting affinity:', error);
    throw error;
  }
}; 