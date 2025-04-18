import React, { useState } from 'react';
import styled from 'styled-components';
import { FiSave, FiMoon, FiSun } from 'react-icons/fi';
import { useAppContext } from '../contexts/AppContext';

const Settings = () => {
  const { theme, toggleTheme } = useAppContext();
  
  const [preferences, setPreferences] = useState({
    defaultView: 'grid',
    resultsPerPage: '10',
    emailNotifications: true,
    statusUpdates: true
  });
  
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
      
      <SettingsGrid>
        <SettingsCard>
          <h2>User Preferences</h2>
          
          <SettingsForm onSubmit={handleSubmit}>
            <FormGroup>
              <FormLabel>Default View:</FormLabel>
              <FormSelect 
                name="defaultView"
                value={preferences.defaultView}
                onChange={handleChange}
              >
                <option value="grid">Grid View</option>
                <option value="list">List View</option>
              </FormSelect>
            </FormGroup>
            
            <FormGroup>
              <FormLabel>Results Per Page:</FormLabel>
              <FormSelect 
                name="resultsPerPage"
                value={preferences.resultsPerPage}
                onChange={handleChange}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </FormSelect>
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
          <h2>Appearance</h2>
          
          <ThemeSection>
            <ThemeTitle>Theme Mode</ThemeTitle>
            <ThemeButtons>
              <ThemeButton 
                active={theme === 'light'} 
                onClick={() => theme !== 'light' && toggleTheme()}
              >
                <FiSun /> Light Mode
              </ThemeButton>
              <ThemeButton 
                active={theme === 'dark'} 
                onClick={() => theme !== 'dark' && toggleTheme()}
              >
                <FiMoon /> Dark Mode
              </ThemeButton>
            </ThemeButtons>
          </ThemeSection>
          
          <ColorSection>
            <ColorTitle>Accent Color</ColorTitle>
            <ColorOptions>
              <ColorOption color="#4a6cf7" active />
              <ColorOption color="#10b981" />
              <ColorOption color="#f59e0b" />
              <ColorOption color="#ef4444" />
              <ColorOption color="#8b5cf6" />
            </ColorOptions>
          </ColorSection>
        </SettingsCard>
        
        <SettingsCard>
          <h2>Account Information</h2>
          
          <AccountInfo>
            <InfoItem>
              <InfoLabel>Username:</InfoLabel>
              <InfoValue>johndoe</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Email:</InfoLabel>
              <InfoValue>john.doe@example.com</InfoValue>
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
            <LinkButton>Change Password</LinkButton>
            <LinkButton>Edit Profile</LinkButton>
          </ButtonRow>
        </SettingsCard>
        
        <SettingsCard>
          <h2>API Access</h2>
          
          <ApiInfo>
            <ApiKeySection>
              <ApiKeyLabel>Your API Key:</ApiKeyLabel>
              <ApiKeyDisplay>
                ••••••••••••••••••••••••••••••
                <ShowButton>Show</ShowButton>
              </ApiKeyDisplay>
            </ApiKeySection>
            
            <ApiStats>
              <ApiStatItem>
                <ApiStatLabel>Requests Today:</ApiStatLabel>
                <ApiStatValue>156</ApiStatValue>
              </ApiStatItem>
              <ApiStatItem>
                <ApiStatLabel>Monthly Limit:</ApiStatLabel>
                <ApiStatValue>10,000</ApiStatValue>
              </ApiStatItem>
              <ApiStatItem>
                <ApiStatLabel>Last Request:</ApiStatLabel>
                <ApiStatValue>10 minutes ago</ApiStatValue>
              </ApiStatItem>
            </ApiStats>
          </ApiInfo>
          
          <ButtonRow>
            <LinkButton>Regenerate API Key</LinkButton>
            <LinkButton>View API Documentation</LinkButton>
          </ButtonRow>
        </SettingsCard>
      </SettingsGrid>
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

const ThemeSection = styled.div`
  margin-bottom: 2rem;
`;

const ThemeTitle = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const ThemeButtons = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ThemeButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background-color: ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'inherit'};
  border: 1px solid ${props => props.active ? 'var(--primary-color)' : 'var(--border-color)'};
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  .dark & {
    border-color: ${props => props.active ? 'var(--primary-color)' : '#374151'};
  }
  
  &:hover:not(:disabled) {
    background-color: ${props => props.active ? 'var(--primary-color)' : props.theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
  }
`;

const ColorSection = styled.div``;

const ColorTitle = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const ColorOptions = styled.div`
  display: flex;
  gap: 1rem;
`;

const ColorOption = styled.button`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: ${props => props.color};
  border: 3px solid ${props => props.active ? 'white' : 'transparent'};
  box-shadow: ${props => props.active ? '0 0 0 2px var(--primary-color)' : 'none'};
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
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

const ApiInfo = styled.div`
  margin-bottom: 1.5rem;
`;

const ApiKeySection = styled.div`
  margin-bottom: 1.5rem;
`;

const ApiKeyLabel = styled.div`
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const ApiKeyDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${props => props.theme === 'dark' ? '#111827' : '#f9fafb'};
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-family: monospace;
`;

const ShowButton = styled.button`
  color: var(--primary-color);
  background: transparent;
  font-size: 0.875rem;
  font-weight: 500;
`;

const ApiStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const ApiStatItem = styled.div``;

const ApiStatLabel = styled.div`
  font-size: 0.75rem;
  color: var(--secondary-color);
  margin-bottom: 0.25rem;
`;

const ApiStatValue = styled.div`
  font-weight: 600;
`;

export default Settings; 