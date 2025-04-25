import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { performanceDataShape } from '../../types/affinityTypes';

const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
};

const formatCurrency = (num) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
};

const formatPercentage = (num) => {
  return `${num.toFixed(2)}%`;
};

const calculateMetrics = (performance) => {
  const ctr = (performance.clicks / performance.impressions) * 100;
  const conversionRate = (performance.transactions / performance.clicks) * 100;
  const avgGpPerTransaction = performance.gpNet / performance.transactions;

  return {
    ctr: isNaN(ctr) ? 0 : ctr,
    conversionRate: isNaN(conversionRate) ? 0 : conversionRate,
    avgGpPerTransaction: isNaN(avgGpPerTransaction) ? 0 : avgGpPerTransaction
  };
};

const calculatePercentageChange = (current, previous) => {
  if (!previous || previous === 0) return null;
  return ((current - previous) / previous) * 100;
};

const MetricChange = ({ change }) => {
  if (change === null) return null;
  
  const isPositive = change > 0;
  return (
    <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
      {isPositive ? <FiArrowUp className="mr-1" /> : <FiArrowDown className="mr-1" />}
      <span>{formatPercentage(Math.abs(change))}</span>
    </div>
  );
};

const PeriodLabel = ({ year, quarter }) => (
  <span className="text-sm text-gray-500">
    {quarter ? `Q${quarter} ${year}` : year}
  </span>
);

const PerformanceMetrics = ({ performance, comparisonPerformance }) => {
  const metrics = useMemo(() => calculateMetrics(performance), [performance]);
  const comparisonMetrics = useMemo(
    () => comparisonPerformance ? calculateMetrics(comparisonPerformance) : null,
    [comparisonPerformance]
  );

  const changes = useMemo(() => {
    if (!comparisonMetrics) return null;
    return {
      ctr: calculatePercentageChange(metrics.ctr, comparisonMetrics.ctr),
      conversionRate: calculatePercentageChange(metrics.conversionRate, comparisonMetrics.conversionRate),
      avgGpPerTransaction: calculatePercentageChange(metrics.avgGpPerTransaction, comparisonMetrics.avgGpPerTransaction)
    };
  }, [metrics, comparisonMetrics]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
      <div className="space-y-6">
        {/* CTR Metric */}
        <div>
          <p className="text-sm text-gray-500">Click-through Rate (CTR)</p>
          <div className="flex items-baseline space-x-3">
            <div>
              <p className="text-lg font-medium">
                {formatPercentage(metrics.ctr)}
              </p>
              <PeriodLabel year={performance.year} quarter={performance.quarter} />
            </div>
            {comparisonMetrics && (
              <div className="flex items-baseline space-x-2">
                <div className="text-gray-500">
                  <p className="text-sm">
                    {formatPercentage(comparisonMetrics.ctr)}
                  </p>
                  <PeriodLabel 
                    year={comparisonPerformance.year} 
                    quarter={comparisonPerformance.quarter} 
                  />
                </div>
                {changes && <MetricChange change={changes.ctr} />}
              </div>
            )}
          </div>
        </div>

        {/* Conversion Rate Metric */}
        <div>
          <p className="text-sm text-gray-500">Conversion Rate</p>
          <div className="flex items-baseline space-x-3">
            <div>
              <p className="text-lg font-medium">
                {formatPercentage(metrics.conversionRate)}
              </p>
              <PeriodLabel year={performance.year} quarter={performance.quarter} />
            </div>
            {comparisonMetrics && (
              <div className="flex items-baseline space-x-2">
                <div className="text-gray-500">
                  <p className="text-sm">
                    {formatPercentage(comparisonMetrics.conversionRate)}
                  </p>
                  <PeriodLabel 
                    year={comparisonPerformance.year} 
                    quarter={comparisonPerformance.quarter} 
                  />
                </div>
                {changes && <MetricChange change={changes.conversionRate} />}
              </div>
            )}
          </div>
        </div>

        {/* Average GP per Transaction Metric */}
        <div>
          <p className="text-sm text-gray-500">Average GP per Transaction</p>
          <div className="flex items-baseline space-x-3">
            <div>
              <p className="text-lg font-medium">
                {formatCurrency(metrics.avgGpPerTransaction)}
              </p>
              <PeriodLabel year={performance.year} quarter={performance.quarter} />
            </div>
            {comparisonMetrics && (
              <div className="flex items-baseline space-x-2">
                <div className="text-gray-500">
                  <p className="text-sm">
                    {formatCurrency(comparisonMetrics.avgGpPerTransaction)}
                  </p>
                  <PeriodLabel 
                    year={comparisonPerformance.year} 
                    quarter={comparisonPerformance.quarter} 
                  />
                </div>
                {changes && <MetricChange change={changes.avgGpPerTransaction} />}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

PerformanceMetrics.propTypes = {
  performance: PropTypes.shape({
    id: PropTypes.string.isRequired,
    affinityId: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
    clicks: PropTypes.number.isRequired,
    impressions: PropTypes.number.isRequired,
    transactions: PropTypes.number.isRequired,
    gpNet: PropTypes.number.isRequired,
    dateCreated: PropTypes.string.isRequired,
    lastUpdatedDate: PropTypes.string.isRequired,
    affinityName: PropTypes.string.isRequired,
    quarter: PropTypes.number
  }).isRequired,
  comparisonPerformance: PropTypes.shape({
    id: PropTypes.string.isRequired,
    affinityId: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
    clicks: PropTypes.number.isRequired,
    impressions: PropTypes.number.isRequired,
    transactions: PropTypes.number.isRequired,
    gpNet: PropTypes.number.isRequired,
    dateCreated: PropTypes.string.isRequired,
    lastUpdatedDate: PropTypes.string.isRequired,
    affinityName: PropTypes.string.isRequired,
    quarter: PropTypes.number
  })
};

export default PerformanceMetrics; 