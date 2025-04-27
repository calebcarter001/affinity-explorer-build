import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiMapPin } from 'react-icons/fi';
import { BsPinAngle } from 'react-icons/bs';
import { useClickAway } from 'react-use';
import Tooltip from './Tooltip';

const validateCollection = (collection) => {
  if (!collection || typeof collection !== 'object') return false;
  if (typeof collection.id !== 'string') return false;
  if (typeof collection.name !== 'string') return false;
  if (!Array.isArray(collection.affinities)) return false;
  return true;
};

const AddToCollectionIcon = ({ affinity, userCollections, onAdd, className = '' }) => {
  const [open, setOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  if (!affinity || typeof affinity.id !== 'string') {
    console.error('AddToCollectionIcon: Invalid affinity object');
    return null;
  }

  if (!Array.isArray(userCollections)) {
    console.error('AddToCollectionIcon: userCollections must be an array');
    return null;
  }

  useClickAway(dropdownRef, () => setOpen(false));

  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8, // 8px gap
        left: rect.left + window.scrollX
      });
    }
  }, [open]);

  const handleIconClick = (e) => {
    e.stopPropagation();
    setOpen((prev) => !prev);
  };

  const handleSelect = (collection) => {
    if (!validateCollection(collection)) {
      console.error('AddToCollectionIcon: Invalid collection object');
      return;
    }

    const affinityId = String(affinity.id);
    if (collection.affinities.some(a => String(a.id) === affinityId)) return;
    
    onAdd(collection, affinity);
    setOpen(false);
  };

  // Filter out invalid collections
  const validCollections = userCollections.filter(validateCollection);

  return (
    <>
      <div className={`relative inline-block ${className}`}>
        <Tooltip content="Add to Collection" placement="top">
          <button
            ref={buttonRef}
            type="button"
            className="p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Add to Collection"
            onClick={handleIconClick}
          >
            <BsPinAngle className="w-5 h-5 text-gray-500" />
          </button>
        </Tooltip>
      </div>
      {open && createPortal(
        <div
          ref={dropdownRef}
          className="fixed z-[9999] w-56 bg-white border border-gray-200 rounded shadow-lg"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`
          }}
        >
          <div className="p-2 text-xs text-gray-500 border-b">Add to Collection</div>
          {validCollections.length === 0 ? (
            <div className="p-4 text-gray-400 text-sm">No collections found.<br/>Create one in the Library.</div>
          ) : (
            <ul>
              {validCollections.map((collection) => {
                const affinityId = String(affinity.id);
                const alreadyIn = collection.affinities.some(a => String(a.id) === affinityId);
                return (
                  <li key={collection.id}>
                    <button
                      className={`w-full text-left px-4 py-2 hover:bg-blue-50 ${alreadyIn ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'}`}
                      disabled={alreadyIn}
                      onClick={() => handleSelect(collection)}
                    >
                      {collection.name}
                      {alreadyIn && <span className="ml-2 text-xs">(Already added)</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>,
        document.body
      )}
    </>
  );
};

export default AddToCollectionIcon; 