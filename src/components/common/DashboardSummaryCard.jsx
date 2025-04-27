import React from 'react';

const DashboardSummaryCard = ({
  icon,
  title,
  percentChange,
  currentValue,
  targetValue,
  targetLabel,
  color = 'gray',
  showProgressBar = false,
  progress = 0,
  percentChangeSmall = false,
  selected = false,
  onClick,
}) => {
  // Determine color classes
  const colorMap = {
    green: 'text-green-600',
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    red: 'text-red-600',
    gray: 'text-gray-600',
  };
  const accent = colorMap[color] || colorMap.gray;

  // Determine color for percent change
  const isPositive = percentChange >= 0;
  const percentColor = isPositive ? 'text-green-600' : 'text-red-600';

  // Parse targetLabel into label and value
  let targetLabelText = 'Target:';
  let targetValueText = targetValue;
  if (targetLabel) {
    const match = targetLabel.match(/^(Target:?)(.*)$/i);
    if (match) {
      targetLabelText = match[1].replace(':', '').trim() + ':';
      targetValueText = match[2].trim();
    } else {
      targetValueText = targetLabel;
    }
  }

  return (
    <div
      className={`bg-white rounded-xl shadow-sm flex flex-col items-stretch justify-between h-[200px] w-[240px] min-w-[200px] max-w-[260px] p-5 cursor-pointer transition-all duration-150 ${selected ? 'border-2 border-blue-500 shadow-lg' : 'border border-gray-200 hover:border-blue-400'}`}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-pressed={selected}
      style={{ outline: selected ? '2px solid #3b82f6' : 'none' }}
    >
      {/* Top: Icon, Title */}
      <div className="flex flex-col items-start gap-0.5">
        <div className="flex items-center mb-0.5">
          <span className={`mr-2 text-lg ${accent}`}>{icon}</span>
          <h3 className="text-base font-bold leading-tight">{title}</h3>
        </div>
      </div>
      {/* Middle: Percent Change (right aligned above percent completion) and Current Value */}
      <div className="flex flex-col items-end justify-center flex-1 w-full">
        <span className={`font-semibold ${percentColor} ${percentChangeSmall ? 'text-xs' : 'text-sm'} mb-0.5`}>{isPositive ? '+' : '-'}{Math.abs(percentChange)}%</span>
        {showProgressBar ? (
          <>
            <div className="text-lg font-bold mb-1 text-center w-full">{currentValue}%</div>
            <div className="w-full h-2 bg-gray-200 rounded-full mb-1">
              <div
                className={`h-2 rounded-full ${accent} bg-opacity-80 transition-all duration-300`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </>
        ) : (
          <div className="text-3xl font-extrabold mb-1 w-full text-center">{currentValue}%</div>
        )}
      </div>
      {/* Bottom: Target label and value, both left aligned and separated */}
      <div className="mt-auto text-left w-full">
        <div className="text-xs text-gray-500 leading-tight">{targetLabelText}</div>
        <div className="text-sm font-semibold text-gray-800 leading-tight">{targetValueText}</div>
      </div>
    </div>
  );
};

export default DashboardSummaryCard; 