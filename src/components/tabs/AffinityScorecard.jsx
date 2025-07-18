import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faBullseye, 
  faSearch, 
  faBalanceScale,
  faMousePointer,
  faShoppingCart,
  faChartBar,
  faExclamationTriangle,
  faCheckCircle,
  faArrowUp,
  faArrowDown,
  faClock
} from '@fortawesome/free-solid-svg-icons';

const AffinityScorecard = () => {
  const [scorecardData, setScorecardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('2024-03-20');

  // Mock data for the scorecard
  const mockScorecardData = {
    coverage: {
      tagCoverage: { value: 87, target: 85, alert: null },
      scoreCoverage: { value: 92, target: 90, alert: null }
    },
    accuracy: {
      f1Score: { value: 0.82, target: 0.8, alert: -0.7 }
    },
    explainability: {
      anchorAvailability: { value: 98, target: 95, alert: null },
      traceScoreCompleteness: { value: 96, target: 100, alert: -95 }
    },
    scoreFreshness: {
      dataLag: { value: 12, target: 24, alert: 24, unit: 'days' }
    },
    engagement: {
      ctrTillDate: { value: 3.2, trend: 'positive' },
      msvTillDate: { value: 2.8, trend: 'positive' },
      impressions: { value: 45.2, trend: 'positive', unit: 'M' }
    },
    conversion: {
      cvrTillDate: { value: 1.2, trend: 'above_baseline' }
    },
    stability: {
      scoreDrift: { value: 3.2, target: 5, alert: 10 }
    }
  };

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setScorecardData(mockScorecardData);
      setLoading(false);
    };

    loadData();
  }, []);

  const getStatusColor = (value, target, alert) => {
    if (alert && value <= alert) return 'text-red-500';
    if (target && value >= target) return 'text-green-500';
    return 'text-yellow-500';
  };

  const getProgressColor = (value, target, alert) => {
    if (alert && value <= alert) return 'bg-red-500';
    if (target && value >= target) return 'bg-green-500';
    return 'bg-yellow-500';
  };

  const MetricCard = ({ title, icon, children, iconColor = 'text-blue-500' }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <FontAwesomeIcon icon={icon} className={`text-xl ${iconColor}`} />
      </div>
      {children}
    </div>
  );

  const ProgressBar = ({ value, target, alert, color }) => {
    const percentage = Math.min((value / 100) * 100, 100);
    return (
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div 
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

  const TrendIndicator = ({ trend }) => {
    if (trend === 'positive') {
      return <FontAwesomeIcon icon={faArrowUp} className="text-green-500 ml-2" />;
    } else if (trend === 'negative') {
      return <FontAwesomeIcon icon={faArrowDown} className="text-red-500 ml-2" />;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 mb-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Affinity Scorecard</h1>
        <p className="text-blue-100">Performance metrics and quality indicators</p>
        <p className="text-sm text-blue-200 mt-2">Last updated: {lastUpdated}</p>
      </div>

      {/* Top Row - Core Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Coverage */}
        <MetricCard title="Coverage" icon={faChartBar} iconColor="text-blue-500">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Tag Coverage:</span>
                <span className="font-semibold text-green-600">{scorecardData.coverage.tagCoverage.value}%</span>
              </div>
              <ProgressBar 
                value={scorecardData.coverage.tagCoverage.value}
                target={scorecardData.coverage.tagCoverage.target}
                color="bg-green-500"
              />
              <div className="text-xs text-gray-500">
                Target: ≥{scorecardData.coverage.tagCoverage.target}%
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Score Coverage:</span>
                <span className="font-semibold text-green-600">{scorecardData.coverage.scoreCoverage.value}%</span>
              </div>
              <ProgressBar 
                value={scorecardData.coverage.scoreCoverage.value}
                target={scorecardData.coverage.scoreCoverage.target}
                color="bg-green-500"
              />
            </div>
          </div>
        </MetricCard>

        {/* Accuracy */}
        <MetricCard title="Accuracy" icon={faBullseye} iconColor="text-green-500">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {scorecardData.accuracy.f1Score.value}
            </div>
            <div className="text-sm text-gray-600 mb-2">F1 Score</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="h-2 rounded-full bg-green-500"
                style={{ width: `${(scorecardData.accuracy.f1Score.value / 1) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500">
              Target: F1 ≥0.8 | Alert: &lt;0.7
            </div>
          </div>
        </MetricCard>

        {/* Explainability & Traceability */}
        <MetricCard title="Explainability & Traceability" icon={faSearch} iconColor="text-purple-500">
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Anchor Availability:</span>
                <span className="font-semibold text-green-600">{scorecardData.explainability.anchorAvailability.value}%</span>
              </div>
              <ProgressBar 
                value={scorecardData.explainability.anchorAvailability.value}
                color="bg-green-500"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Trace Score Completeness:</span>
                <span className="font-semibold text-yellow-600">{scorecardData.explainability.traceScoreCompleteness.value}%</span>
              </div>
              <ProgressBar 
                value={scorecardData.explainability.traceScoreCompleteness.value}
                color="bg-yellow-500"
              />
              <div className="text-xs text-red-500">Alert: &lt;95%</div>
            </div>
          </div>
        </MetricCard>

        {/* Score Freshness */}
        <MetricCard title="Score Freshness" icon={faClock} iconColor="text-gray-600">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {scorecardData.scoreFreshness.dataLag.value}
            </div>
            <div className="text-sm text-gray-600 mb-2">Data Lag (days)</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="h-2 rounded-full bg-yellow-500"
                style={{ width: `${Math.max(0, 100 - (scorecardData.scoreFreshness.dataLag.value / scorecardData.scoreFreshness.dataLag.target) * 100)}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500">
              Target: &lt;{scorecardData.scoreFreshness.dataLag.target}d | Alert: &gt;{scorecardData.scoreFreshness.dataLag.alert}d
            </div>
          </div>
        </MetricCard>
      </div>

      {/* Bottom Row - Impact Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Engagement Impact */}
        <MetricCard title="Engagement Impact" icon={faMousePointer} iconColor="text-blue-500">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">CTR till date:</span>
                <div className="flex items-center">
                  <span className="font-semibold text-green-600">{scorecardData.engagement.ctrTillDate.value}%</span>
                  <TrendIndicator trend={scorecardData.engagement.ctrTillDate.trend} />
                </div>
              </div>
              <ProgressBar value={scorecardData.engagement.ctrTillDate.value * 10} color="bg-green-500" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">MSV till date:</span>
                <div className="flex items-center">
                  <span className="font-semibold text-green-600">{scorecardData.engagement.msvTillDate.value}%</span>
                  <TrendIndicator trend={scorecardData.engagement.msvTillDate.trend} />
                </div>
              </div>
              <ProgressBar value={scorecardData.engagement.msvTillDate.value * 10} color="bg-green-500" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Impressions:</span>
                <div className="flex items-center">
                  <span className="font-semibold text-green-600">{scorecardData.engagement.impressions.value}{scorecardData.engagement.impressions.unit}</span>
                  <TrendIndicator trend={scorecardData.engagement.impressions.trend} />
                </div>
              </div>
              <ProgressBar value={Math.min(scorecardData.engagement.impressions.value, 100)} color="bg-green-500" />
            </div>
            <div className="flex items-center text-sm text-green-600">
              <FontAwesomeIcon icon={faArrowUp} className="mr-1" />
              Positive engagement trend
            </div>
          </div>
        </MetricCard>

        {/* Conversion Impact */}
        <MetricCard title="Conversion Impact" icon={faShoppingCart} iconColor="text-green-500">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              +{scorecardData.conversion.cvrTillDate.value}
            </div>
            <div className="text-sm text-gray-600 mb-2">CVR till date (bps)</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="h-2 rounded-full bg-green-500"
                style={{ width: `${Math.min(scorecardData.conversion.cvrTillDate.value * 20, 100)}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-center text-sm text-green-600">
              <FontAwesomeIcon icon={faArrowUp} className="mr-1" />
              Above baseline performance
            </div>
          </div>
        </MetricCard>

        {/* Score Stability */}
        <MetricCard title="Score Stability" icon={faBalanceScale} iconColor="text-purple-500">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {scorecardData.stability.scoreDrift.value}%
            </div>
            <div className="text-sm text-gray-600 mb-2">Score Drift</div>
            <div className="text-xs text-gray-500 mb-2">Properties with score change of ±50</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="h-2 rounded-full bg-green-500"
                style={{ width: `${Math.max(0, 100 - (scorecardData.stability.scoreDrift.value / scorecardData.stability.scoreDrift.target) * 100)}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500">
              Target: ≤{scorecardData.stability.scoreDrift.target}% | Alert: &gt;{scorecardData.stability.scoreDrift.alert}%
            </div>
          </div>
        </MetricCard>
      </div>
    </div>
  );
};

export default AffinityScorecard;
