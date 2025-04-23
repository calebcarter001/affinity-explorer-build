import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { getAffinities } from '../../services/apiService';
import { useToast } from '../../contexts/ToastContext';

const CreateCollectionModal = ({ isOpen, onClose, onSubmit }) => {
  const showToast = useToast();
  const [form, setForm] = useState({
    name: '',
    description: '',
    affinityIds: []
  });
  const [availableAffinities, setAvailableAffinities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadAvailableAffinities();
    }
  }, [isOpen]);

  const loadAvailableAffinities = async () => {
    setLoading(true);
    try {
      const response = await getAffinities();
      setAvailableAffinities(response.data);
    } catch (error) {
      console.error('Error loading affinities:', error);
      showToast('error', 'Failed to load affinities');
    } finally {
      setLoading(false);
    }
  };

  const handleAffinityToggle = (affinity) => {
    setForm(prev => {
      const affinityIds = prev.affinityIds || [];
      const isSelected = affinityIds.includes(affinity.id);
      return {
        ...prev,
        affinityIds: isSelected
          ? affinityIds.filter(id => id !== affinity.id)
          : [...affinityIds, affinity.id]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({
      name: '',
      description: '',
      affinityIds: []
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Create New Collection</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Affinities
              </label>
              {loading ? (
                <div className="text-sm text-gray-500">Loading affinities...</div>
              ) : availableAffinities.length > 0 ? (
                <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md p-2">
                  {availableAffinities.map(affinity => (
                    <div key={affinity.id} className="flex items-center p-2 hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={form.affinityIds.includes(affinity.id)}
                        onChange={() => handleAffinityToggle(affinity)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-700">
                        {affinity.name}
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500">No affinities available</div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Create Collection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCollectionModal; 