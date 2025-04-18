import React from 'react';
import styled from 'styled-components';

/**
 * Overlay for mobile navigation
 */
const MobileNavOverlay = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return <Overlay onClick={onClose} />;
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: var(--z-modal-backdrop);
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

export default MobileNavOverlay; 