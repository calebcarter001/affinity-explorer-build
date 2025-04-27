import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { getAffinities } from '../../services/apiService';
import { useToast } from '../../contexts/ToastContext';

// Validation constants
const CONSTRAINTS = {
  MIN_NAME_LENGTH: 3,
  MAX_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_AFFINITIES: 50
};

const CreateCollectionModal = ({ isOpen, onClose, onSubmit }) => {
  const showToast = useToast();
  const [form, setForm] = useState({
    name: '',
    description: '',
    affinityIds: []
  });
  const [errors, setErrors] = useState({});
  const [availableAffinities, setAvailableAffinities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadAvailableAffinities();
      // Reset form and errors when modal opens
      setForm({
        name: '',
        description: '',
        affinityIds: []
      });
      setErrors({});
    }
  }, [isOpen]);

  const loadAvailableAffinities = async () => {
    setLoading(true);
    try {
      const response = await getAffinities();
      setAvailableAffinities(response.data);
    } catch (error) {
      console.error('Error loading affinities:', error);
      showToast.error('Failed to load affinities');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (form.name.length < CONSTRAINTS.MIN_NAME_LENGTH) {
      newErrors.name = `Name must be at least ${CONSTRAINTS.MIN_NAME_LENGTH} characters`;
    } else if (form.name.length > CONSTRAINTS.MAX_NAME_LENGTH) {
      newErrors.name = `Name cannot exceed ${CONSTRAINTS.MAX_NAME_LENGTH} characters`;
    }
    
    // Description validation
    if (form.description && form.description.length > CONSTRAINTS.MAX_DESCRIPTION_LENGTH) {
      newErrors.description = `Description cannot exceed ${CONSTRAINTS.MAX_DESCRIPTION_LENGTH} characters`;
    }
    
    // Affinities validation
    if (form.affinityIds.length > CONSTRAINTS.MAX_AFFINITIES) {
      newErrors.affinities = `Cannot select more than ${CONSTRAINTS.MAX_AFFINITIES} affinities`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAffinityToggle = (affinity) => {
    if (!affinity || !affinity.id) {
      console.error('Invalid affinity:', affinity);
      return;
    }

    const affinityId = String(affinity.id);
    
    setForm(prev => {
      const currentIds = (prev.affinityIds || []).map(id => String(id));
      const isSelected = currentIds.includes(affinityId);
      
      // Check max affinities limit before adding
      if (!isSelected && currentIds.length >= CONSTRAINTS.MAX_AFFINITIES) {
        showToast.error(`Cannot select more than ${CONSTRAINTS.MAX_AFFINITIES} affinities`);
        return prev;
      }
      
      const newIds = isSelected
        ? currentIds.filter(id => id !== affinityId)
        : [...currentIds, affinityId];
      
      return {
        ...prev,
        affinityIds: newIds
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast.error('Please fix the errors before submitting');
      return;
    }
    
    // Ensure all IDs are strings
    const normalizedForm = {
      ...form,
      affinityIds: form.affinityIds.map(id => String(id))
    };
    
    onSubmit(normalizedForm);
    
    // Reset form
    setForm({
      name: '',
      description: '',
      affinityIds: []
    });
    setErrors({});
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
                onChange={(e) => {
                  setForm(prev => ({ ...prev, name: e.target.value }));
                  setErrors(prev => ({ ...prev, name: null }));
                }}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => {
                  setForm(prev => ({ ...prev, description: e.target.value }));
                  setErrors(prev => ({ ...prev, description: null }));
                }}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={3}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Affinities {form.affinityIds.length > 0 && `(${form.affinityIds.length}/${CONSTRAINTS.MAX_AFFINITIES})`}
              </label>
              {loading ? (
                <div className="text-sm text-gray-500">Loading affinities...</div>
              ) : availableAffinities.length > 0 ? (
                <div className={`max-h-48 overflow-y-auto border rounded-md p-2 ${
                  errors.affinities ? 'border-red-500' : 'border-gray-300'
                }`}>
                  {availableAffinities.map(affinity => (
                    <div key={affinity.id} className="flex items-center p-2 hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={form.affinityIds.includes(String(affinity.id))}
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
              {errors.affinities && (
                <p className="mt-1 text-sm text-red-500">{errors.affinities}</p>
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
              className={`px-4 py-2 text-white rounded-md ${
                form.name.trim() && form.affinityIds.length > 0
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              disabled={!form.name.trim() || form.affinityIds.length === 0}
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