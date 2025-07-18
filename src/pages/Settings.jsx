import React, { useState } from 'react';
import styled from 'styled-components';
import { FiSave, FiMoon, FiSun, FiDownload, FiUser, FiKey, FiSettings } from 'react-icons/fi';
import { useAppContext } from '../contexts/AppContext';
import { useLocation } from 'react-router-dom';
import ExportConfiguration from '../components/tabs/ExportConfiguration';
import SearchableDropdown from '../components/common/SearchableDropdown';

const Settings = () => {
  const { theme, toggleTheme } = useAppContext();
  const location = useLocation();
  
  // Check if we should start on export tab (from URL params)
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'preferences';
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [preferences, setPreferences] = useState({
    defaultView: 'grid',
    resultsPerPage: '10',
    emailNotifications: true,
    statusUpdates: true
  });
  
  // Export configuration state
  const [exportConfig, setExportConfig] = useState({
    level: 'property',
    affinities: [],
    sentiments: [],
    destinationInsights: {
      themes: {
        nanoThemes: [],
        subThemes: [],
        attributes: {
          timeNeeded: false,
          intensity: false,
          emotions: false,
          price: false
        }
      },
      nuances: {
        destination: [],
        conventionalLodging: [],
        vacationRental: []
      },
      related: {
        similarDestinations: [],
        tags: []
      }
    },
    lastMile: {
      transportation: [],
      accessibility: []
    }
  });
  
  const tabs = [
    { id: 'preferences', label: 'Preferences', icon: FiSettings },
    { id: 'account', label: 'Account', icon: FiUser },
    { id: 'export', label: 'Export Data', icon: FiDownload }
  ];
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences({
      ...preferences,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Normally this would save to backend
    alert('Settings saved successfully!');
  };
  
  return (
    <SettingsContainer>
      <SettingsHeader>
        <h1>Settings</h1>
        <p>Customize your Affinity Explorer experience</p>
      </SettingsHeader>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6 bg-white rounded-lg rounded-b-none overflow-hidden">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-6 py-4 border-b-2 font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'export' && (
          <ExportConfiguration />
        )}
        
        {activeTab === 'preferences' && (
          <SettingsGrid>
            <SettingsCard>
              <h2>User Preferences</h2>
          
          <SettingsForm onSubmit={handleSubmit}>
            <FormGroup>
              <FormLabel>Default View:</FormLabel>
              <SearchableDropdown
                options={[
                  { value: 'grid', label: 'Grid View' },
                  { value: 'list', label: 'List View' }
                ]}
                value={{ value: preferences.defaultView, label: preferences.defaultView === 'grid' ? 'Grid View' : 'List View' }}
                onChange={(option) => setPreferences({ ...preferences, defaultView: option?.value || 'grid' })}
                placeholder="Select view..."
                className="w-48"
                noOptionsMessage="No view options found"
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel>Results Per Page:</FormLabel>
              <SearchableDropdown
                options={[
                  { value: '10', label: '10' },
                  { value: '25', label: '25' },
                  { value: '50', label: '50' },
                  { value: '100', label: '100' }
                ]}
                value={{ value: preferences.resultsPerPage, label: preferences.resultsPerPage }}
                onChange={(option) => setPreferences({ ...preferences, resultsPerPage: option?.value || '10' })}
                placeholder="Select page size..."
                className="w-48"
                noOptionsMessage="No options found"
              />
            </FormGroup>
            
            <CheckboxGroup>
              <CheckboxItem>
                <Checkbox 
                  type="checkbox" 
                  id="emailNotifications" 
                  name="emailNotifications"
                  checked={preferences.emailNotifications}
                  onChange={handleChange}
                />
                <CheckboxLabel htmlFor="emailNotifications">
                  Enable email notifications
                </CheckboxLabel>
              </CheckboxItem>
              
              <CheckboxItem>
                <Checkbox 
                  type="checkbox" 
                  id="statusUpdates" 
                  name="statusUpdates"
                  checked={preferences.statusUpdates}
                  onChange={handleChange}
                />
                <CheckboxLabel htmlFor="statusUpdates">
                  Receive updates when affinities change status
                </CheckboxLabel>
              </CheckboxItem>
            </CheckboxGroup>
            
            <ButtonRow>
              <SaveButton type="submit">
                <FiSave /> Save Preferences
              </SaveButton>
            </ButtonRow>
          </SettingsForm>
        </SettingsCard>
        
        <SettingsCard>
          <h2>Account Information</h2>
          
          <AccountInfo>
            <InfoItem>
              <InfoLabel>Username:</InfoLabel>
              <InfoValue>calcarter</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Email:</InfoLabel>
              <InfoValue>calcarter@expediagroup.com</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Role:</InfoLabel>
              <InfoValue>Admin</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Account Created:</InfoLabel>
              <InfoValue>January 15, 2023</InfoValue>
            </InfoItem>
          </AccountInfo>
          
          <ButtonRow>
            <LinkButton disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>Change Password</LinkButton>
            <LinkButton disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>Edit Profile</LinkButton>
          </ButtonRow>
        </SettingsCard>
      </SettingsGrid>
        )}
        
        {activeTab === 'account' && (
          <SettingsGrid>
            <SettingsCard>
              <h2>Account Information</h2>
              
              <AccountInfo>
                <InfoItem>
                  <InfoLabel>Username:</InfoLabel>
                  <InfoValue>calcarter</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Email:</InfoLabel>
                  <InfoValue>calcarter@expediagroup.com</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Role:</InfoLabel>
                  <InfoValue>Admin</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Account Created:</InfoLabel>
                  <InfoValue>January 15, 2023</InfoValue>
                </InfoItem>
              </AccountInfo>
              
              <ButtonRow>
                <LinkButton disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>Change Password</LinkButton>
                <LinkButton disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>Edit Profile</LinkButton>
              </ButtonRow>
            </SettingsCard>
          </SettingsGrid>
        )}
      </div>
    </SettingsContainer>
  );
};

const SettingsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SettingsHeader = styled.div`
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--secondary-color);
  }
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SettingsCard = styled.div`
  background-color: var(--card-bg-light);
  border-radius: 8px;
  padding: 1.5rem;
  
  .dark & {
    background-color: var(--card-bg-dark);
  }
  
  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
  }
`;

const SettingsForm = styled.form``;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background-color: var(--card-bg-light);
  
  .dark & {
    background-color: #374151;
    border-color: #4b5563;
    color: var(--light-text);
  }
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const CheckboxItem = styled.div`
  display: flex;
  align-items: center;
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  cursor: pointer;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #3451c4;
  }
`;

const AccountInfo = styled.div`
  margin-bottom: 1.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  margin-bottom: 0.75rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.div`
  width: 150px;
  font-weight: 500;
`;

const InfoValue = styled.div`
  color: var(--secondary-color);
`;

const LinkButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(74, 108, 247, 0.1);
  }
`;

export default Settings; 