import React, { useState, useEffect, useCallback } from 'react';
import { FiLayers, FiEdit2, FiTrash2, FiX, FiChevronLeft, FiPlus, FiRefreshCw } from 'react-icons/fi';
import { useToast } from '../../contexts/ToastContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCollections, updateFavorites, deleteCollection, updateCollection, createCollection, getAffinities, clearCollectionsCache } from '../../services/apiService';
import EmptyStateStyled from '../common/EmptyStateStyled';
import CreateCollectionModal from './CreateCollectionModal';
import { useAuth } from '../../contexts/AuthContext';
import AffinityCard from '../common/AffinityCard';
import ModernCard from '../common/ModernCard';

const AffinityCollections = ({ selectedCollectionId }) => {
  const showToast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
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
  const [userCollections, setUserCollections] = useState([]);
  const [selectedCollectionIdFromNav, setSelectedCollectionIdFromNav] = useState(selectedCollectionId ? String(selectedCollectionId) : null);

  const loadCollections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCollections(user?.email);
      setCollections(data);
    } catch (error) {
      setError('Failed to load collections. Please try again.');
      showToast.error('Failed to load collections');
    } finally {
      setLoading(false);
    }
  }, [user?.email, showToast]);

  const loadAvailableAffinities = useCallback(async () => {
    setLoadingAffinities(true);
    try {
      const response = await getAffinities();
      setAvailableAffinities(response.data);
    } catch (error) {
      showToast.error('Failed to load affinities');
    } finally {
    setLoadingAffinities(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  // Initialize userCollections when collections are loaded
  useEffect(() => {
    if (collections.length > 0) {
      setUserCollections(collections);
    }
  }, [collections]);

  useEffect(() => {
    if (selectedCollectionId) {
      setSelectedCollectionIdFromNav(String(selectedCollectionId));
    }
  }, [selectedCollectionId]);

  useEffect(() => {
    if (selectedCollectionIdFromNav && collections.length > 0 && !loading) {
      const collection = collections.find(c => String(c.id) === String(selectedCollectionIdFromNav));
      if (collection) {
        setSelectedCollection(collection);
        setSelectedCollectionIdFromNav(null); // Clear after use
      } else {
        setSelectedCollection(null);
        showToast.warning(`Collection with ID ${selectedCollectionIdFromNav} not found`);
        navigate('/affinities', { state: { view: 'collections' }, replace: true });
      }
    }
  }, [selectedCollectionIdFromNav, collections, loading, showToast, navigate]);

  const handleEditClick = useCallback((collection) => {
    try {
      if (!collection || !collection.id) {
        showToast.error('Invalid collection data');
        return;
      }
      
      console.log('Collection being edited:', {
        id: collection.id,
        name: collection.name,
        affinities: collection.affinities
      });
      
      setIsEditing(true);
      setLoadingAffinities(true);
      
      // Load affinities first
      getAffinities()
        .then((response) => {
          setAvailableAffinities(response.data);
          setEditingCollection(collection);
          
          // Initialize form state with the collection's data
          // Ensure we're using the correct affinity IDs format
          const affinityIds = collection.affinities.map(a => a.id.toString());
          
          const newFormState = {
            id: collection.id,
            name: collection.name,
            description: collection.description || '',
            affinityIds: affinityIds
          };
          
          console.log('Setting initial form state:', newFormState);
          setEditForm(newFormState);
        })
        .catch((error) => {
          console.error('Failed to load affinities:', error);
          showToast.error('Failed to load affinities');
        })
        .finally(() => {
          setLoadingAffinities(false);
        });
    } catch (error) {
      console.error('Edit error:', error);
      showToast.error('Failed to edit collection');
      setIsEditing(false);
    }
  }, [showToast]);

  // Add effect to monitor editForm changes
  useEffect(() => {
    if (editForm.affinityIds) {
      console.log('EditForm state updated:', {
        ...editForm,
        affinityIds: editForm.affinityIds.map(id => String(id))
      });
    }
  }, [editForm]);

  // Add effect to monitor availableAffinities changes
  useEffect(() => {
    if (availableAffinities.length > 0) {
      console.log('Available affinities:', availableAffinities.map(a => ({ id: a.id, name: a.name })));
    }
  }, [availableAffinities]);

  const handleDelete = useCallback(async (collection) => {
    try {
      if (!collection || !collection.id) {
        showToast.error('Invalid collection data');
        return;
      }
      setOperationLoading(prev => ({ ...prev, delete: true }));
      await deleteCollection(collection.id, user?.email);
      showToast.success('Collection deleted successfully');
      clearCollectionsCache();
      loadCollections();
      if (selectedCollection?.id === collection.id) {
        setSelectedCollection(null);
      }
    } catch (error) {
      showToast.error('Failed to delete collection');
    } finally {
      setOperationLoading(prev => ({ ...prev, delete: false }));
    }
  }, [loadCollections, selectedCollection, showToast, user]);

  const handleAffinityToggle = useCallback((affinity) => {
    try {
      if (!affinity || !affinity.id) {
        console.error('Invalid affinity:', affinity);
        return;
      }
      
      // Ensure we're working with string IDs
      const affinityId = affinity.id.toString();
      
      // Get current affinities from the editing collection
      const currentAffinities = editingCollection?.affinities || [];
      const currentIds = editForm.affinityIds || currentAffinities.map(a => String(a.id));
      
      console.log('Toggle called for affinity:', {
        id: affinityId,
        name: affinity.name,
        type: affinity.type,
        currentIds: currentIds,
        currentAffinities: currentAffinities.map(a => ({ id: a.id, name: a.name }))
      });

      // Check if the ID exists in any format
      const isSelected = currentIds.some(id => String(id) === affinityId);
      console.log('Is affinity currently selected?', isSelected);

      setEditForm(prev => {
        const newIds = isSelected
          ? prev.affinityIds.filter(id => String(id) !== affinityId)
          : [...(prev.affinityIds || currentIds), affinityId];
        
        console.log('Updated affinity IDs:', {
          before: prev.affinityIds,
          after: newIds,
          added: !isSelected,
          removed: isSelected,
          totalAffinities: newIds.length
        });
        
        return {
          ...prev,
          affinityIds: newIds
        };
      });
    } catch (error) {
      console.error('Toggle error:', error);
      showToast.error('Failed to update affinity selection');
    }
  }, [editForm.affinityIds, editingCollection, showToast]);

  const handleEditSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      if (!editForm.id || !editForm.name) {
        showToast.error('Invalid form data');
        return;
      }
      
      console.log('Submitting edit form:', {
        ...editForm,
        affinityIds: editForm.affinityIds.map(id => String(id))
      });
      
      setOperationLoading(prev => ({ ...prev, edit: true }));
      
      // Ensure all affinity IDs are strings and unique
      const normalizedAffinityIds = [...new Set(editForm.affinityIds.map(id => String(id)))];
      
      console.log('Normalized affinity IDs for submission:', normalizedAffinityIds);
      
      const updatedCollection = await updateCollection(editForm.id, {
        name: editForm.name,
        description: editForm.description,
        affinityIds: normalizedAffinityIds
      }, user?.email);
      
      console.log('Collection updated successfully:', updatedCollection);
      
      showToast.success('Collection updated successfully');
      setIsEditing(false);
      setEditingCollection(null);
      clearCollectionsCache();
      loadCollections();
      
      if (selectedCollection?.id === updatedCollection.id) {
        setSelectedCollection(updatedCollection);
      }
    } catch (error) {
      console.error('Submit error:', error);
      showToast.error('Failed to update collection');
    } finally {
      setOperationLoading(prev => ({ ...prev, edit: false }));
    }
  }, [editForm, loadCollections, selectedCollection, showToast, user]);

  const handleCreateSubmit = useCallback(async (formData) => {
    try {
      if (!formData.name) {
        showToast.error('Collection name is required');
        return;
      }
      setOperationLoading(prev => ({ ...prev, create: true }));
      await createCollection({
        ...formData,
        ownerId: user?.email
      });
      showToast.success('Collection created successfully');
      setIsCreateModalOpen(false);
      clearCollectionsCache();
      loadCollections();
    } catch (error) {
      showToast.error('Failed to create collection');
    } finally {
      setOperationLoading(prev => ({ ...prev, create: false }));
    }
  }, [loadCollections, showToast, user]);

  const handleCollectionClick = useCallback((collection) => {
    try {
      if (!collection || !collection.id) {
        showToast.error('Invalid collection data');
        return;
      }
      
      console.log('Collection clicked:', {
        id: collection.id,
        name: collection.name,
        affinities: collection.affinities
      });
      
      setSelectedCollection(collection);
      setIsEditing(false); // Close edit mode if open
      
      // Update URL with the selected collection ID
      navigate('/affinities', { 
        state: { 
          view: 'collections',
          selectedCollectionId: collection.id 
        },
        replace: true
      });
    } catch (error) {
      console.error('Collection click error:', error);
      showToast.error('Failed to select collection');
    }
  }, [navigate, showToast]);

  const handleToggleFavorite = useCallback(async (collection, e) => {
    e.stopPropagation(); // Prevent collection click from firing
    try {
      if (!collection || !collection.id) {
        showToast.error('Invalid collection data');
        return;
      }
      
      setOperationLoading(prev => ({ ...prev, toggleFavorite: true }));
      
      // Optimistically update UI
      const updatedCollections = collections.map(c => 
        c.id === collection.id ? { ...c, isFavorite: !c.isFavorite } : c
      );
      setCollections(updatedCollections);
      
      // Update backend
      await updateFavorites(collection.id, !collection.isFavorite, user?.email);
      showToast.success(`Collection ${!collection.isFavorite ? 'added to' : 'removed from'} favorites`);
      
      // Update selected collection if it's the one being toggled
      if (selectedCollection?.id === collection.id) {
        setSelectedCollection(prev => ({ ...prev, isFavorite: !prev.isFavorite }));
      }
    } catch (error) {
      // Revert on failure
      loadCollections();
      showToast.error('Failed to update favorites');
    } finally {
      setOperationLoading(prev => ({ ...prev, toggleFavorite: false }));
    }
  }, [collections, loadCollections, selectedCollection, showToast, user]);

  const handleRetry = useCallback(() => {
    setError(null);
    loadCollections();
  }, [loadCollections]);

  const handleAddToCollection = async (collection, affinity) => {
    try {
      if (!user?.email) {
        showToast.error('Please log in to add to collections');
        return;
      }

      // Optimistically update UI
      setUserCollections(prev => prev.map(c =>
        c.id === collection.id && !c.affinities.some(a => a.id === affinity.id)
          ? { ...c, affinities: [...c.affinities, affinity] }
          : c
      ));

      const updatedAffinityIds = [...collection.affinities.map(a => a.id), affinity.id];
      await updateCollection(collection.id, { affinityIds: updatedAffinityIds }, user?.email);
      showToast.success(`Added to collection: ${collection.name}`);
      clearCollectionsCache();
      loadCollections(); // Refresh collections after successful update
    } catch (err) {
      console.error('Failed to add to collection:', err);
      // Revert optimistic update
      setUserCollections(prev => prev.map(c =>
        c.id === collection.id
          ? { ...c, affinities: c.affinities.filter(a => a.id !== affinity.id) }
          : c
      ));
      showToast.error('Failed to add to collection');
    }
  };

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
            <ModernCard
              key={collection.id}
              onClick={() => handleCollectionClick(collection)}
              selected={selectedCollection?.id === collection.id}
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
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">{collection.description || 'No description'}</p>
              <div className="text-sm text-gray-500 mt-2">
                {collection.affinities?.length || 0} affinities
              </div>
            </ModernCard>
          ))}
        </div>
      </div>

      {/* Collection Detail/Edit - Right Side */}
      <div className="md:col-span-2">
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
                      {availableAffinities.map(affinity => {
                        const isSelected = editForm.affinityIds?.includes(affinity.id);
                        
                        return (
                          <div key={affinity.id} className="flex items-center p-2 hover:bg-gray-50">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleAffinityToggle(affinity)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 text-sm text-gray-700">
                              {affinity.name}
                            </label>
                          </div>
                        );
                      })}
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
                    className={`px-4 py-2 text-white rounded-md ${
                      editForm.affinityIds.length === 0 || operationLoading.edit
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                    disabled={editForm.affinityIds.length === 0 || operationLoading.edit}
                    title={editForm.affinityIds.length === 0 ? 'Select at least one affinity' : ''}
                  >
                    {operationLoading.edit ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : selectedCollection ? (
          <ModernCard>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">{selectedCollection.name}</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditClick(selectedCollection)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiEdit2 size={20} />
                </button>
              </div>
            </div>

            <p className="text-gray-600 mb-6">{selectedCollection.description || 'No description provided.'}</p>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Affinities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedCollection.affinities && selectedCollection.affinities.length > 0 ? (
                  selectedCollection.affinities.map((affinity) => (
                    <AffinityCard
                      key={affinity.id}
                      affinity={affinity}
                      userCollections={userCollections}
                      onAddToCollection={(collection) => handleAddToCollection(collection, affinity)}
                      className="h-full"
                    />
                  ))
                ) : (
                  <div className="col-span-2 text-center text-gray-500 p-4 bg-gray-50 rounded-lg">
                    <p>No affinities in this collection</p>
                    <button
                      onClick={() => handleEditClick(selectedCollection)}
                      className="mt-2 text-blue-500 hover:text-blue-600"
                    >
                      Add affinities
                    </button>
                  </div>
                )}
              </div>
            </div>
          </ModernCard>
        ) : (
          <ModernCard>
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a collection to view details
            </div>
          </ModernCard>
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