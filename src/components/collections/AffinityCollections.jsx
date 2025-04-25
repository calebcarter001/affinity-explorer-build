import React, { useState, useEffect, useCallback } from 'react';
import { FiStar, FiLayers, FiEdit2, FiTrash2, FiX, FiChevronLeft, FiPlus, FiRefreshCw } from 'react-icons/fi';
import { useToast } from '../../contexts/ToastContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCollections, updateFavorites, deleteCollection, updateCollection, createCollection, getAffinities, clearCollectionsCache } from '../../services/apiService';
import EmptyStateStyled from '../common/EmptyStateStyled';
import CreateCollectionModal from './CreateCollectionModal';

const AffinityCollections = ({ selectedCollectionId }) => {
  const showToast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCollection, setEditingCollection] = useState(null);
  const [editForm, setEditForm] = useState({ id: null, name: '', description: '', affinityIds: [] });
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [availableAffinities, setAvailableAffinities] = useState([]);
  const [loadingAffinities, setLoadingAffinities] = useState(false);
  const [error, setError] = useState(null);
  const [operationLoading, setOperationLoading] = useState({
    edit: false,
    delete: false,
    create: false,
    toggleFavorite: false
  });

  const loadCollections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading collections...');
      const data = await getCollections();
      console.log('Collections loaded:', data.length);
      setCollections(data);
    } catch (error) {
      console.error('Error loading collections:', error);
      setError('Failed to load collections. Please try again.');
      showToast('error', 'Failed to load collections');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const loadAvailableAffinities = useCallback(async () => {
    setLoadingAffinities(true);
    try {
      console.log('Loading available affinities...');
      const response = await getAffinities();
      console.log('Available affinities loaded:', response.data.length);
      setAvailableAffinities(response.data);
    } catch (error) {
      console.error('Error loading affinities:', error);
      showToast('error', 'Failed to load affinities');
    } finally {
    setLoadingAffinities(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  useEffect(() => {
    if (selectedCollectionId && collections.length > 0 && !loading) {
      console.log('Attempting to select collection:', selectedCollectionId);
      console.log('Available collections:', collections.map(c => ({ id: c.id, name: c.name })));
      
      const collection = collections.find(c => c.id === selectedCollectionId);
      if (collection) {
        console.log('Found collection to select:', collection.name);
        setSelectedCollection(collection);
      } else {
        console.log('Collection not found with ID:', selectedCollectionId);
        setSelectedCollection(null);
        showToast('warning', `Collection with ID ${selectedCollectionId} not found`);
      }
    } else if (!selectedCollectionId) {
      setSelectedCollection(null);
    }
  }, [selectedCollectionId, collections, loading, showToast]);

  const handleEditClick = useCallback((collection) => {
    try {
      if (!collection || !collection.id) {
        console.error('Invalid collection data for editing:', collection);
        showToast('error', 'Invalid collection data');
        return;
      }
      
      console.log('Editing collection:', collection.name, 'ID:', collection.id);
      setEditingCollection(collection);
      setEditForm({
        id: collection.id,
        name: collection.name,
        description: collection.description,
        affinityIds: collection.affinities.map(a => a.id)
      });
      setIsEditing(true);
      loadAvailableAffinities();
    } catch (error) {
      console.error('Error handling edit click:', error);
      showToast('error', 'Failed to edit collection');
    }
  }, [loadAvailableAffinities, showToast]);

  const handleDelete = useCallback(async (collection) => {
    try {
      if (!collection || !collection.id) {
        console.error('Invalid collection data for deletion:', collection);
        showToast('error', 'Invalid collection data');
        return;
      }
      
      console.log('Deleting collection:', collection.name, 'ID:', collection.id);
      setOperationLoading(prev => ({ ...prev, delete: true }));
      
      await deleteCollection(collection.id);
      showToast('success', 'Collection deleted successfully');
      
      clearCollectionsCache();
      
      loadCollections();
      
      if (selectedCollection?.id === collection.id) {
        setSelectedCollection(null);
      }
      } catch (error) {
      console.error('Error deleting collection:', error);
        showToast('error', 'Failed to delete collection');
    } finally {
      setOperationLoading(prev => ({ ...prev, delete: false }));
    }
  }, [loadCollections, selectedCollection, showToast]);

  const handleAffinityToggle = useCallback((affinity) => {
    try {
      if (!affinity || !affinity.id) {
        console.error('Invalid affinity data for toggle:', affinity);
        return;
      }
      
      console.log('Toggling affinity:', affinity.name, 'ID:', affinity.id);
    setEditForm(prev => {
        const affinityIds = prev.affinityIds || [];
        const isSelected = affinityIds.includes(affinity.id);
      return {
        ...prev,
          affinityIds: isSelected
            ? affinityIds.filter(id => id !== affinity.id)
            : [...affinityIds, affinity.id]
      };
    });
    } catch (error) {
      console.error('Error toggling affinity:', error);
      showToast('error', 'Failed to update affinity selection');
    }
  }, [showToast]);

  const handleEditSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      if (!editForm.id || !editForm.name) {
        console.error('Invalid edit form data:', editForm);
        showToast('error', 'Invalid form data');
        return;
      }
      
      console.log('Submitting edit for collection:', editForm.name, 'ID:', editForm.id);
      setOperationLoading(prev => ({ ...prev, edit: true }));
      
      const updatedCollection = await updateCollection(editForm.id, {
        name: editForm.name,
        description: editForm.description,
        affinityIds: editForm.affinityIds
      });
      
      showToast('success', 'Collection updated successfully');
      setEditingCollection(null);
      
      clearCollectionsCache();
      
      loadCollections();
      
      if (selectedCollection?.id === updatedCollection.id) {
        setSelectedCollection(updatedCollection);
      }
    } catch (error) {
      console.error('Error updating collection:', error);
      showToast('error', 'Failed to update collection');
    } finally {
      setOperationLoading(prev => ({ ...prev, edit: false }));
    }
  }, [editForm, loadCollections, selectedCollection, showToast]);

  const handleCreateSubmit = useCallback(async (formData) => {
    try {
      if (!formData.name) {
        console.error('Invalid create form data:', formData);
        showToast('error', 'Collection name is required');
        return;
      }
      
      console.log('Creating new collection:', formData.name);
      setOperationLoading(prev => ({ ...prev, create: true }));
      
      await createCollection({
        name: formData.name,
        description: formData.description,
        affinityIds: formData.affinityIds || []
      });
      
      showToast('success', 'Collection created successfully');
      setIsCreateModalOpen(false);
      
      clearCollectionsCache();
      
      loadCollections();
    } catch (error) {
      console.error('Error creating collection:', error);
      showToast('error', 'Failed to create collection');
    } finally {
      setOperationLoading(prev => ({ ...prev, create: false }));
    }
  }, [loadCollections, showToast]);

  const handleCollectionClick = useCallback((collection) => {
    try {
      if (!collection || !collection.id) {
        console.error('Invalid collection data for click:', collection);
        showToast('error', 'Invalid collection data');
        return;
      }
      
      console.log('Collection clicked:', collection.name, 'ID:', collection.id);
      setSelectedCollection(collection);
      
      // Update URL with the selected collection ID
      navigate('/affinities', { 
        state: { 
          view: 'collections',
          selectedCollectionId: collection.id 
        } 
      });
    } catch (error) {
      console.error('Error handling collection click:', error);
      showToast('error', 'Failed to select collection');
    }
  }, [navigate, showToast]);

  const handleToggleFavorite = useCallback(async (collection, e) => {
    e.stopPropagation(); // Prevent collection click from firing
    try {
      if (!collection || !collection.id) {
        console.error('Invalid collection data for favorite toggle:', collection);
        showToast('error', 'Invalid collection data');
        return;
      }
      
      console.log('Toggling favorite for collection:', collection.name, 'ID:', collection.id);
      setOperationLoading(prev => ({ ...prev, toggleFavorite: true }));
      
      // Optimistically update UI
      const updatedCollections = collections.map(c => 
        c.id === collection.id ? { ...c, isFavorite: !c.isFavorite } : c
      );
      setCollections(updatedCollections);
      
      // Update backend
      await updateFavorites(collection.id, !collection.isFavorite);
      showToast('success', `Collection ${!collection.isFavorite ? 'added to' : 'removed from'} favorites`);
      
      // Update selected collection if it's the one being toggled
      if (selectedCollection?.id === collection.id) {
        setSelectedCollection(prev => ({ ...prev, isFavorite: !prev.isFavorite }));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert on failure
      loadCollections();
      showToast('error', 'Failed to update favorites');
    } finally {
      setOperationLoading(prev => ({ ...prev, toggleFavorite: false }));
    }
  }, [collections, loadCollections, selectedCollection, showToast]);

  const handleRetry = useCallback(() => {
    console.log('Retrying to load collections');
    setError(null);
    loadCollections();
  }, [loadCollections]);

  if (loading) {
    return <div className="p-4">Loading collections...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={handleRetry}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center mx-auto"
        >
          <FiRefreshCw className="mr-2" /> Retry
        </button>
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <EmptyStateStyled
        icon={<FiLayers size={40} />}
        title="No Collections Found"
        description="Create your first collection to organize your affinities"
        actionButton={
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Collection
          </button>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Collections List - Left Side */}
      <div className="md:col-span-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Collections</h2>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={operationLoading.create}
          >
            {operationLoading.create ? 'Creating...' : <><FiPlus className="inline mr-1" /> New</>}
          </button>
        </div>

        <div className="space-y-3">
          {collections.map(collection => (
            <div
              key={collection.id}
              onClick={() => handleCollectionClick(collection)}
              className={`p-4 bg-white rounded-lg shadow cursor-pointer transition-all ${
                selectedCollection?.id === collection.id ? 'border-2 border-blue-500' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FiLayers className="text-blue-500 mr-2" size={20} />
                  <h3 className="font-semibold">{collection.name}</h3>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(collection);
                    }}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-400"
                    disabled={operationLoading.edit}
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(collection);
                    }}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-400"
                    disabled={operationLoading.delete}
                  >
                    <FiTrash2 size={16} />
                  </button>
                  <button
                    onClick={(e) => handleToggleFavorite(collection, e)}
                    className={`p-1 rounded-full hover:bg-gray-100 transition-colors ${
                      collection.isFavorite ? 'text-yellow-500' : 'text-gray-400'
                    }`}
                    disabled={operationLoading.toggleFavorite}
                  >
                    <FiStar size={16} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">{collection.description || 'No description'}</p>
              <div className="text-sm text-gray-500 mt-2">
                {collection.affinities?.length || 0} affinities
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Collection Detail/Edit - Right Side */}
      <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
        {isEditing ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Edit Collection</h2>
                <button
                onClick={() => setIsEditing(false)}
                className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={20} />
                </button>
              </div>

            <form onSubmit={handleEditSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Affinities
                  </label>
                  {loadingAffinities ? (
                    <div className="text-sm text-gray-500">Loading affinities...</div>
                  ) : availableAffinities.length > 0 ? (
                    <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md p-2">
                      {availableAffinities.map(affinity => (
                        <div key={affinity.id} className="flex items-center p-2 hover:bg-gray-50">
                          <input
                            type="checkbox"
                            checked={editForm.affinityIds.includes(affinity.id)}
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

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    disabled={operationLoading.edit}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                    disabled={operationLoading.edit}
                  >
                    {operationLoading.edit ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
                </div>
              </form>
            </div>
        ) : selectedCollection ? (
                <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">{selectedCollection.name}</h2>
                <div className="flex space-x-2">
                  <button
                  onClick={() => handleEditClick(selectedCollection)}
                  className="text-gray-500 hover:text-gray-700"
                  >
                  <FiEdit2 size={20} />
                  </button>
                  <button
                  onClick={(e) => handleToggleFavorite(selectedCollection, e)}
                  className={`${
                    selectedCollection.isFavorite ? 'text-yellow-500' : 'text-gray-400'
                  }`}
                  >
                  <FiStar size={20} />
                  </button>
                </div>
              </div>

            <p className="text-gray-600 mb-6">{selectedCollection.description}</p>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Affinities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedCollection.affinities?.length > 0 ? 
                  selectedCollection.affinities.map((affinity) => (
                      <div 
                      key={affinity.id}
                        className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleCollectionClick(affinity)}
                      >
                        <h4 className="font-semibold">{affinity.name}</h4>
                        <p className="text-sm text-gray-600">{affinity.description}</p>
                      </div>
                    )) : 
                    <div className="col-span-2 text-center text-gray-500">
                      No affinities in this collection
                    </div>
                  }
                </div>
              </div>
            </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a collection to view details
          </div>
        )}
      </div>

      <CreateCollectionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
      />
    </div>
  );
};

export default AffinityCollections; 