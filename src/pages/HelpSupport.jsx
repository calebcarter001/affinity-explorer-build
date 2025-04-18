import React, { useState } from 'react';
import styled from 'styled-components';
import { FiChevronDown, FiChevronUp, FiMessageCircle, FiHelpCircle, FiBook } from 'react-icons/fi';

const HelpSupport = () => {
  const [expandedFaq, setExpandedFaq] = useState(1);
  
  const toggleFaq = (id) => {
    if (expandedFaq === id) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(id);
    }
  };
  
  return (
    <HelpContainer>
      <HelpHeader>
        <h1>Help & Support</h1>
        <p>Find answers to common questions and get assistance</p>
      </HelpHeader>
      
      <HelpGrid>
        <FaqSection>
          <h2>Frequently Asked Questions</h2>
          
          <FaqList>
            <FaqItem>
              <FaqQuestion 
                expanded={expandedFaq === 1}
                onClick={() => toggleFaq(1)}
              >
                <QuestionText>What are affinities?</QuestionText>
                <ExpandIcon>
                  {expandedFaq === 1 ? <FiChevronUp /> : <FiChevronDown />}
                </ExpandIcon>
              </FaqQuestion>
              {expandedFaq === 1 && (
                <FaqAnswer>
                  Affinities are scored attributes that represent different aspects or characteristics of properties and destinations. They help match travelers with the right accommodations based on their preferences. Affinities are developed through a rigorous research and validation process to ensure accuracy and relevance.
                </FaqAnswer>
              )}
            </FaqItem>
            
            <FaqItem>
              <FaqQuestion 
                expanded={expandedFaq === 2}
                onClick={() => toggleFaq(2)}
              >
                <QuestionText>How are affinity scores calculated?</QuestionText>
                <ExpandIcon>
                  {expandedFaq === 2 ? <FiChevronUp /> : <FiChevronDown />}
                </ExpandIcon>
              </FaqQuestion>
              {expandedFaq === 2 && (
                <FaqAnswer>
                  Affinity scores are calculated using a combination of first-party data, external sources, human verification, and algorithmic processing. The specific formula varies by affinity type. Each affinity undergoes a multi-stage validation process that includes data collection, sentiment analysis, competitive benchmarking, and manual review by subject matter experts. Scores are regularly audited and adjusted to maintain accuracy.
                </FaqAnswer>
              )}
            </FaqItem>
            
            <FaqItem>
              <FaqQuestion 
                expanded={expandedFaq === 3}
                onClick={() => toggleFaq(3)}
              >
                <QuestionText>How do I implement affinities in my product?</QuestionText>
                <ExpandIcon>
                  {expandedFaq === 3 ? <FiChevronUp /> : <FiChevronDown />}
                </ExpandIcon>
              </FaqQuestion>
              {expandedFaq === 3 && (
                <FaqAnswer>
                  Refer to the Implementation Guide section for detailed steps on how to integrate affinities into your product using our APIs. The guide provides comprehensive instructions for selecting appropriate affinities, requesting API access, implementing API calls, and testing your integration. You can also contact our implementation team for personalized assistance with your specific use case.
                </FaqAnswer>
              )}
            </FaqItem>
            
            <FaqItem>
              <FaqQuestion 
                expanded={expandedFaq === 4}
                onClick={() => toggleFaq(4)}
              >
                <QuestionText>Can I suggest new affinities?</QuestionText>
                <ExpandIcon>
                  {expandedFaq === 4 ? <FiChevronUp /> : <FiChevronDown />}
                </ExpandIcon>
              </FaqQuestion>
              {expandedFaq === 4 && (
                <FaqAnswer>
                  Yes, we welcome suggestions for new affinities. You can submit ideas through the "Suggest an Affinity" form in the Affinity Library section. Our team reviews all suggestions and evaluates them based on potential user value, market demand, and feasibility of implementation. If your suggestion is selected for development, you'll be notified and can track its progress through the Lifecycle Tracker.
                </FaqAnswer>
              )}
            </FaqItem>
            
            <FaqItem>
              <FaqQuestion 
                expanded={expandedFaq === 5}
                onClick={() => toggleFaq(5)}
              >
                <QuestionText>How often are affinity scores updated?</QuestionText>
                <ExpandIcon>
                  {expandedFaq === 5 ? <FiChevronUp /> : <FiChevronDown />}
                </ExpandIcon>
              </FaqQuestion>
              {expandedFaq === 5 && (
                <FaqAnswer>
                  Affinity scores are updated on a rolling basis. High-volume properties and popular affinities are updated weekly, while others are updated monthly. When significant changes occur to a property (such as renovations or new amenities), we prioritize updating those scores. You can see the last update date for any affinity score through the API or in the Scoring Explorer interface.
                </FaqAnswer>
              )}
            </FaqItem>
          </FaqList>
        </FaqSection>
        
        <SupportOptionsSection>
          <h2>Contact Support</h2>
          
          <SupportCard>
            <SupportIcon><FiMessageCircle /></SupportIcon>
            <SupportContent>
              <SupportTitle>Live Chat</SupportTitle>
              <SupportDescription>
                Chat with our support team for immediate assistance with your questions. Available Monday-Friday, 9am-5pm ET.
              </SupportDescription>
              <SupportButton>Start Chat</SupportButton>
            </SupportContent>
          </SupportCard>
          
          <SupportCard>
            <SupportIcon><FiHelpCircle /></SupportIcon>
            <SupportContent>
              <SupportTitle>Support Ticket</SupportTitle>
              <SupportDescription>
                Submit a detailed support request and receive a response within 24 hours. Best for complex issues that require investigation.
              </SupportDescription>
              <SupportButton>Submit Ticket</SupportButton>
            </SupportContent>
          </SupportCard>
          
          <SupportCard>
            <SupportIcon><FiBook /></SupportIcon>
            <SupportContent>
              <SupportTitle>Documentation</SupportTitle>
              <SupportDescription>
                Browse our comprehensive documentation for detailed information about all features and functionalities.
              </SupportDescription>
              <SupportButton>View Docs</SupportButton>
            </SupportContent>
          </SupportCard>
        </SupportOptionsSection>
      </HelpGrid>
      
      <ResourcesSection>
        <h2>Additional Resources</h2>
        
        <ResourcesGrid>
          <ResourceCard>
            <ResourceTitle>Getting Started Guide</ResourceTitle>
            <ResourceDescription>
              A comprehensive introduction to Affinity Explorer for new users.
            </ResourceDescription>
            <ResourceLink>View Guide →</ResourceLink>
          </ResourceCard>
          
          <ResourceCard>
            <ResourceTitle>Video Tutorials</ResourceTitle>
            <ResourceDescription>
              Step-by-step video guides for using key features and tools.
            </ResourceDescription>
            <ResourceLink>Watch Videos →</ResourceLink>
          </ResourceCard>
          
          <ResourceCard>
            <ResourceTitle>API Reference</ResourceTitle>
            <ResourceDescription>
              Technical documentation for developers implementing the Affinity API.
            </ResourceDescription>
            <ResourceLink>Read Docs →</ResourceLink>
          </ResourceCard>
          
          <ResourceCard>
            <ResourceTitle>Release Notes</ResourceTitle>
            <ResourceDescription>
              Stay updated on the latest features, improvements, and bug fixes.
            </ResourceDescription>
            <ResourceLink>View Updates →</ResourceLink>
          </ResourceCard>
        </ResourcesGrid>
      </ResourcesSection>
    </HelpContainer>
  );
};

const HelpContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const HelpHeader = styled.div`
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

const HelpGrid = styled.div`
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 1.5rem;
  margin-bottom: 3rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const FaqSection = styled.section`
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
  }
`;

const FaqList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FaqItem = styled.div`
  background-color: var(--card-bg-light);
  border-radius: 8px;
  overflow: hidden;
  
  .dark & {
    background-color: var(--card-bg-dark);
  }
`;

const FaqQuestion = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  background-color: ${props => props.expanded ? 'rgba(74, 108, 247, 0.1)' : 'transparent'};
  border: none;
  text-align: left;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
  }
`;

const QuestionText = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
`;

const ExpandIcon = styled.div`
  font-size: 1.25rem;
  color: var(--secondary-color);
`;

const FaqAnswer = styled.div`
  padding: 0 1.25rem 1.25rem;
  color: var(--secondary-color);
  line-height: 1.6;
`;

const SupportOptionsSection = styled.section`
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
  }
  
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SupportCard = styled.div`
  display: flex;
  gap: 1.25rem;
  background-color: var(--card-bg-light);
  border-radius: 8px;
  padding: 1.5rem;
  
  .dark & {
    background-color: var(--card-bg-dark);
  }
`;

const SupportIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: rgba(74, 108, 247, 0.1);
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const SupportContent = styled.div`
  flex: 1;
`;

const SupportTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const SupportDescription = styled.p`
  font-size: 0.875rem;
  color: var(--secondary-color);
  margin-bottom: 1rem;
  line-height: 1.6;
`;

const SupportButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #3451c4;
  }
`;

const ResourcesSection = styled.section`
  margin-bottom: 2rem;
  
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
  }
`;

const ResourcesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const ResourceCard = styled.div`
  background-color: var(--card-bg-light);
  border-radius: 8px;
  padding: 1.5rem;
  
  .dark & {
    background-color: var(--card-bg-dark);
  }
`;

const ResourceTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
`;

const ResourceDescription = styled.p`
  font-size: 0.875rem;
  color: var(--secondary-color);
  margin-bottom: 1rem;
  line-height: 1.6;
`;

const ResourceLink = styled.a`
  color: var(--primary-color);
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

export default HelpSupport; 