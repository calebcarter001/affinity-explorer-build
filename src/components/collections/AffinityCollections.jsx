import React, { useState, useEffect } from 'react';
import { FiPlus, FiLayers, FiEdit2, FiTrash2, FiX, FiAlertCircle, FiSearch, FiCheck, FiPackage } from 'react-icons/fi';
import { getAffinities } from '../../services/apiService';

const AffinityCollections = ({ selectedCollectionName }) => {
  const [collections, setCollections] = useState([
    {
      id: 1,
      name: 'Summer Getaway Collection',
      description: 'Perfect for summer vacation properties',
      affinities: ['Beach Access', 'Pool', 'Outdoor Dining', 'Air Conditioning', 'BBQ'],
      createdAt: '2024-03-20',
      lastUpdated: '2024-03-20'
    },
    {
      id: 2,
      name: 'Urban Exploration Bundle',
      description: 'City-centered properties with cultural access',
      affinities: ['City Center', 'Public Transport', 'Cultural Sites'],
      createdAt: '2024-03-19',
      lastUpdated: '2024-02-15'
    },
    {
      id: 3,
      name: 'Family Trip Essentials',
      description: 'Family-friendly properties with kid amenities',
      affinities: ['Kid-Friendly', 'Safety Features', 'Entertainment', 'Kitchen'],
      createdAt: '2024-03-18',
      lastUpdated: '2024-03-18'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [editingCollection, setEditingCollection] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState(null);
  const [availableAffinities, setAvailableAffinities] = useState([]);
  const [affinitySearchTerm, setAffinitySearchTerm] = useState('');
  const [isLoadingAffinities, setIsLoadingAffinities] = useState(false);
  const [showAffinitySearch, setShowAffinitySearch] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);

  useEffect(() => {
    const loadAffinities = async () => {
      setIsLoadingAffinities(true);
      try {
        const data = await getAffinities();
        setAvailableAffinities(data);
      } catch (err) {
        console.error('Failed to load affinities:', err);
      } finally {
        setIsLoadingAffinities(false);
      }
    };

    if (showAffinitySearch) {
      loadAffinities();
    }
  }, [showAffinitySearch]);

  useEffect(() => {
    if (selectedCollectionName) {
      const collection = collections.find(c => c.name === selectedCollectionName);
      if (collection) {
        setSelectedCollection(collection);
      }
    }
  }, [selectedCollectionName, collections]);

  const handleCreateCollection = () => {
    setModalMode('create');
    setEditingCollection({
      name: '',
      description: '',
      affinities: []
    });
    setIsModalOpen(true);
  };

  const handleEditCollection = (collection) => {
    setModalMode('edit');
    setEditingCollection({ ...collection });
    setIsModalOpen(true);
  };

  const handleSaveCollection = () => {
    if (editingCollection.name.trim()) {
      if (modalMode === 'create') {
        setCollections(prev => [...prev, {
          id: Date.now(),
          ...editingCollection,
          createdAt: new Date().toISOString().split('T')[0]
        }]);
      } else {
        setCollections(prev => prev.map(c => 
          c.id === editingCollection.id ? editingCollection : c
        ));
      }
      setIsModalOpen(false);
      setEditingCollection(null);
      setShowAffinitySearch(false);
      setAffinitySearchTerm('');
    }
  };

  const handleDeletePrompt = (collection) => {
    setCollectionToDelete(collection);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setCollections(prev => prev.filter(c => c.id !== collectionToDelete.id));
    setIsDeleteModalOpen(false);
    setCollectionToDelete(null);
  };

  const handleAddAffinity = (affinity) => {
    if (!editingCollection.affinities.includes(affinity.name)) {
      setEditingCollection(prev => ({
        ...prev,
        affinities: [...prev.affinities, affinity.name]
      }));
    }
  };

  const filteredAffinities = availableAffinities.filter(affinity => {
    const searchTerm = affinitySearchTerm.toLowerCase();
    return (
      affinity.name.toLowerCase().includes(searchTerm) ||
      affinity.definition.toLowerCase().includes(searchTerm) ||
      affinity.category.toLowerCase().includes(searchTerm)
    );
  });

  const handleCollectionClick = (collection) => {
    setSelectedCollection(collection);
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">My Collections</h2>
          <button
            onClick={handleCreateCollection}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus /> New Collection
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collections Grid */}
        <div className={`${selectedCollection ? 'lg:col-span-2' : 'lg:col-span-3'} grid grid-cols-1 md:grid-cols-2 gap-4`}>
          {collections.map(collection => (
            <div 
              key={collection.id} 
              onClick={() => handleCollectionClick(collection)}
              className={`bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all cursor-pointer border ${
                selectedCollection?.id === collection.id ? 'border-blue-500' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FiLayers className="text-blue-500" />
                  <h3 className="font-semibold text-lg">{collection.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    className="text-gray-500 hover:text-blue-600 p-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditCollection(collection);
                    }}
                  >
                    <FiEdit2 />
                  </button>
                  <button 
                    className="text-gray-500 hover:text-red-600 p-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePrompt(collection);
                    }}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{collection.description}</p>
              
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Affinities ({collection.affinities.length})</div>
                <div className="flex flex-wrap gap-2">
                  {collection.affinities.slice(0, 3).map((affinity, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                    >
                      {affinity}
                    </span>
                  ))}
                  {collection.affinities.length > 3 && (
                    <span className="px-2 py-1 bg-gray-50 text-gray-600 text-sm rounded-full">
                      +{collection.affinities.length - 3} more
                    </span>
                  )}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm text-gray-500">
                  Last Updated: {collection.lastUpdated}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Collection Details Panel */}
        {selectedCollection && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <FiPackage className="text-blue-500 text-xl" />
                  <h3 className="text-xl font-bold">{selectedCollection.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedCollection(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                  <p className="text-gray-600">{selectedCollection.description}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Affinities</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex flex-wrap gap-2">
                      {selectedCollection.affinities.map((affinity, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                        >
                          {affinity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Created</span>
                    <span>{selectedCollection.createdAt}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Last Updated</span>
                    <span>{selectedCollection.lastUpdated}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Total Affinities</span>
                    <span>{selectedCollection.affinities.length}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditCollection(selectedCollection)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <FiEdit2 /> Edit Collection
                  </button>
                  <button
                    onClick={() => handleDeletePrompt(selectedCollection)}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:text-red-700"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Collection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {modalMode === 'create' ? 'Create New Collection' : 'Edit Collection'}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setShowAffinitySearch(false);
                  setAffinitySearchTerm('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collection Name
                </label>
                <input
                  type="text"
                  value={editingCollection?.name || ''}
                  onChange={(e) => setEditingCollection(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Enter collection name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editingCollection?.description || ''}
                  onChange={(e) => setEditingCollection(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Enter collection description"
                  rows={3}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Affinities
                  </label>
                  <button
                    onClick={() => setShowAffinitySearch(!showAffinitySearch)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {showAffinitySearch ? 'Hide Search' : 'Add Affinities'}
                  </button>
                </div>

                {showAffinitySearch && (
                  <div className="mb-3">
                    <div className="relative">
                      <input
                        type="text"
                        value={affinitySearchTerm}
                        onChange={(e) => setAffinitySearchTerm(e.target.value)}
                        placeholder="Search affinities..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                      <div className="absolute left-3 top-2.5 text-gray-400">
                        <FiSearch />
                      </div>
                    </div>

                    {isLoadingAffinities ? (
                      <div className="text-center py-4 text-gray-500">Loading affinities...</div>
                    ) : (
                      <div className="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                        {filteredAffinities.map(affinity => (
                          <button
                            key={affinity.id}
                            onClick={() => handleAddAffinity(affinity)}
                            className={`w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center justify-between ${
                              editingCollection.affinities.includes(affinity.name)
                                ? 'text-gray-400'
                                : 'text-gray-700'
                            }`}
                            disabled={editingCollection.affinities.includes(affinity.name)}
                          >
                            <div>
                              <div className="font-medium">{affinity.name}</div>
                              <div className="text-sm text-gray-500">{affinity.category}</div>
                            </div>
                            {editingCollection.affinities.includes(affinity.name) && (
                              <FiCheck className="text-green-500" />
                            )}
                          </button>
                        ))}
                        {filteredAffinities.length === 0 && (
                          <div className="p-3 text-center text-gray-500">
                            No matching affinities found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg min-h-[100px]">
                  {editingCollection?.affinities.map((affinity, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded-full flex items-center gap-1"
                    >
                      {affinity}
                      <button
                        onClick={() => setEditingCollection(prev => ({
                          ...prev,
                          affinities: prev.affinities.filter((_, i) => i !== index)
                        }))}
                        className="text-blue-700 hover:text-blue-900"
                      >
                        <FiX size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setShowAffinitySearch(false);
                  setAffinitySearchTerm('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCollection}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {modalMode === 'create' ? 'Create Collection' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4 text-red-600">
              <FiAlertCircle size={24} />
              <h3 className="text-lg font-semibold">Delete Collection</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete "{collectionToDelete?.name}"? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete Collection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AffinityCollections; 