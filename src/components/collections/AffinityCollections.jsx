import React, { useState, useEffect } from 'react';
import { FiStar, FiLayers, FiEdit2, FiTrash2, FiX, FiChevronLeft, FiPlus } from 'react-icons/fi';
import { useToast } from '../../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';
import { getCollections, updateFavorites, deleteCollection, updateCollection, createCollection, getAffinities } from '../../services/apiService';
import EmptyStateStyled from '../common/EmptyStateStyled';
import CreateCollectionModal from './CreateCollectionModal';

const AffinityCollections = ({ selectedCollectionName }) => {
  const showToast = useToast();
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCollection, setEditingCollection] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', affinities: [] });
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [availableAffinities, setAvailableAffinities] = useState([]);
  const [loadingAffinities, setLoadingAffinities] = useState(false);

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    if (selectedCollectionName) {
      const collection = collections.find(c => c.name === selectedCollectionName);
      if (collection) {
        setSelectedCollection(collection);
      }
    } else {
      setSelectedCollection(null);
    }
  }, [selectedCollectionName, collections]);

  const fetchCollections = async () => {
    try {
      const data = await getCollections();
      setCollections(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching collections:', error);
      showToast('error', 'Failed to load collections');
      setLoading(false);
    }
  };

  const fetchAvailableAffinities = async () => {
    setLoadingAffinities(true);
    try {
      const response = await getAffinities();
      setAvailableAffinities(response.data || []);
    } catch (error) {
      console.error('Error fetching affinities:', error);
      showToast('error', 'Failed to load affinities');
      setAvailableAffinities([]);
    }
    setLoadingAffinities(false);
  };

  const handleFavoriteToggle = async (collection) => {
    try {
      // Optimistic update
      const updatedCollections = collections.map(c => 
        c.name === collection.name 
          ? { ...c, isFavorite: !c.isFavorite }
          : c
      );
      setCollections(updatedCollections);

      await updateFavorites(collection.name, !collection.isFavorite);
      showToast('success', `${collection.name} ${!collection.isFavorite ? 'added to' : 'removed from'} favorites`);
    } catch (error) {
      // Revert on failure
      setCollections(collections);
      showToast('error', 'Failed to update favorite status');
    }
  };

  const handleDelete = async (collection) => {
    if (window.confirm(`Are you sure you want to delete "${collection.name}"?`)) {
      try {
        await deleteCollection(collection.name);
        setCollections(collections.filter(c => c.name !== collection.name));
        showToast('success', `${collection.name} deleted successfully`);
      } catch (error) {
        showToast('error', 'Failed to delete collection');
      }
    }
  };

  const handleEdit = (collection) => {
    setEditingCollection(collection);
    setEditForm({
      name: collection.name,
      description: collection.description || '',
      affinities: collection.affinities || []
    });
    fetchAvailableAffinities();
  };

  const handleAffinityToggle = (affinity) => {
    setEditForm(prev => {
      const isSelected = prev.affinities.some(a => a.name === affinity.name);
      return {
        ...prev,
        affinities: isSelected
          ? prev.affinities.filter(a => a.name !== affinity.name)
          : [...prev.affinities, affinity]
      };
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedCollection = await updateCollection(editingCollection.name, editForm);
      setCollections(collections.map(c => 
        c.name === editingCollection.name ? updatedCollection : c
      ));
      setEditingCollection(null);
      showToast('success', 'Collection updated successfully');
    } catch (error) {
      showToast('error', 'Failed to update collection');
    }
  };

  const handleCollectionClick = (collection) => {
    setSelectedCollection(collection);
  };

  const handleCreateSubmit = async (formData) => {
    try {
      const newCollection = await createCollection(formData);
      setCollections([...collections, newCollection]);
      setIsCreateModalOpen(false);
      showToast('success', 'Collection created successfully');
    } catch (error) {
      showToast('error', 'Failed to create collection');
    }
  };

  const handleEditClick = (collection) => {
    setIsEditing(true);
    setEditingCollection(collection);
    setEditForm({
      name: collection.name,
      description: collection.description || '',
      affinities: collection.affinities || []
    });
    fetchAvailableAffinities();
  };

  const handleEditSubmitClick = async () => {
    try {
      const updatedCollection = await updateCollection(editForm.id, editForm);
      setCollections(collections.map(c => 
        c.id === updatedCollection.id ? updatedCollection : c
      ));
      setSelectedCollection(updatedCollection);
      setIsEditing(false);
      setEditForm(null);
      showToast('success', 'Collection updated successfully');
    } catch (error) {
      showToast('error', 'Failed to update collection');
    }
  };

  const handleDeleteCollection = async (id) => {
    try {
      await deleteCollection(id);
      setCollections(collections.filter(c => c.id !== id));
      if (selectedCollection?.id === id) {
        setSelectedCollection(null);
        setIsEditing(false);
        setEditForm(null);
      }
      showToast('success', 'Collection deleted successfully');
    } catch (error) {
      showToast('error', 'Failed to delete collection');
    }
  };

  if (loading) {
    return <div className="p-4">Loading collections...</div>;
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
    <div className="flex h-full">
      {/* Collections List - Left Side */}
      <div className="w-1/3 border-r border-gray-200 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Collections</h2>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-blue-500"
          >
            <FiPlus size={20} />
          </button>
        </div>
        <div className="space-y-4">
          {collections.map((collection) => (
            <div
              key={collection.name}
              onClick={() => handleCollectionClick(collection)}
              className={`bg-white rounded-lg shadow-sm p-4 cursor-pointer transition-all
                ${selectedCollection?.name === collection.name ? 'border-2 border-blue-500' : 'border border-gray-200'}`}
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
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(collection);
                    }}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-400"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">{collection.description || 'No description'}</p>
              <div className="text-sm text-gray-500 mt-2">
                {Array.isArray(collection.affinities) ? collection.affinities.length : 0} affinities
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Collection Detail/Edit - Right Side */}
      <div className="flex-1 p-4 overflow-y-auto">
        {selectedCollection ? (
          editingCollection?.name === selectedCollection.name ? (
            // Edit Form
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Edit Collection</h2>
                <button
                  onClick={() => setEditingCollection(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={20} />
                </button>
              </div>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            checked={editForm.affinities.some(a => a.name === affinity.name)}
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
                    onClick={() => setEditingCollection(null)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          ) : (
            // Collection Detail View
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{selectedCollection.name}</h2>
                  <p className="text-gray-600">{selectedCollection.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(selectedCollection);
                    }}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400"
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(selectedCollection)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Affinities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.isArray(selectedCollection.affinities) && selectedCollection.affinities.length > 0 ? 
                    selectedCollection.affinities.map((affinity, index) => (
                      <div 
                        key={index}
                        className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 cursor-pointer"
                        onClick={() => navigate('/affinities', { state: { selectedAffinity: affinity.name } })}
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
          )
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