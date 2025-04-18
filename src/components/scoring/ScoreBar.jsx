import React from 'react';
import styled from 'styled-components';

/**
 * Score visualization bar component
 */
const ScoreBar = ({ 
  score, 
  maxScore = 10,
  showValue = true,
  height = 'medium',
  animate = true,
  ...props 
}) => {
  const percentage = (score / maxScore) * 100;
  
  return (
    <ScoreBarContainer {...props}>
      <BarTrack height={height}>
        <BarFill 
          percentage={percentage} 
          animate={animate}
          score={score}
        />
      </BarTrack>
      {showValue && <ScoreValue>{score.toFixed(1)}</ScoreValue>}
    </ScoreBarContainer>
  );
};

const ScoreBarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
`;

const BarTrack = styled.div`
  flex: 1;
  background-color: ${props => props.theme === 'dark' ? '#374151' : '#e5e7eb'};
  border-radius: 9999px;
  overflow: hidden;
  
  ${props => {
    switch(props.height) {
      case 'small':
        return 'height: 6px;';
      case 'large':
        return 'height: 12px;';
      default: // medium
        return 'height: 8px;';
    }
  }}
`;

const getColorFromScore = (score) => {
  if (score >= 8) return 'var(--success-color)';
  if (score >= 6) return 'var(--primary-color)';
  if (score >= 4) return 'var(--warning-color)';
  return 'var(--danger-color)';
};

const BarFill = styled.div`
  height: 100%;
  width: ${props => props.percentage}%;
  background-color: ${props => getColorFromScore(props.score)};
  border-radius: 9999px;
  transition: ${props => props.animate ? 'width 1s ease-in-out' : 'none'};
`;

const ScoreValue = styled.div`
  min-width: 3rem;
  font-weight: var(--font-weight-semibold);
  text-align: right;
`;

export default ScoreBar; 