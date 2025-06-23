import React, { useState } from 'react';
import NuanceCard from './NuanceCard';

const NuancesTab = ({ nuances, selectedDestination, onEvidenceClick }) => {
  const [activeSubTab, setActiveSubTab] = useState('general');

  // Clickable insight component
  const ClickableInsight = ({ children, context, className = "", as = "span" }) => {
    const Component = as;
    return (
      <Component
        className={`cursor-pointer hover:text-blue-600 hover:underline transition-colors ${className}`}
        onClick={(e) => {
          e.stopPropagation();
          if (onEvidenceClick) {
            onEvidenceClick(context);
          }
        }}
        title={`Click to view evidence for ${context.field}`}
      >
        {children}
      </Component>
    );
  };

  if (!nuances) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">No nuances data available for this destination.</div>
      </div>
    );
  }

  const destinationNuancesCount = nuances.destination_nuances?.length || 0;
  const hotelExpectationsCount = nuances.hotel_expectations?.length || 0;
  const vacationRentalExpectationsCount = nuances.vacation_rental_expectations?.length || 0;
  const totalNuances = destinationNuancesCount + hotelExpectationsCount + vacationRentalExpectationsCount;

  // Sub-tab configuration
  const subTabs = [
    {
      id: 'general',
      label: 'General',
      icon: '🎯',
      count: destinationNuancesCount,
      description: 'Fun experiences, activities, entertainment'
    },
    {
      id: 'lodging',
      label: 'Conventional Lodging',
      icon: '🏨',
      count: hotelExpectationsCount,
      description: 'Hotel amenities and expectations'
    },
    {
      id: 'rental',
      label: 'Vacation Rental',
      icon: '🏡',
      count: vacationRentalExpectationsCount,
      description: 'Vacation rental specific features'
    }
  ];

  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case 'general':
        return (
          <div className="space-y-4">
            {destinationNuancesCount > 0 ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <ClickableInsight
                      as="h3"
                      className="text-lg font-semibold text-gray-900 flex items-center"
                      context={{
                        type: 'nuances',
                        field: 'Destination Nuances Section',
                        value: 'Fun experiences, activities, entertainment',
                        section: 'destination_nuances'
                      }}
                    >
                      🎯 Destination Nuances ({destinationNuancesCount})
                    </ClickableInsight>
                    <p className="text-sm text-gray-600 mt-1">
                      Fun experiences, activities, and entertainment insights
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {nuances.destination_nuances.map((nuance, index) => (
                    <NuanceCard 
                      key={index}
                      nuance={nuance}
                      type="destination"
                      onEvidenceClick={onEvidenceClick}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-2">No general destination nuances available.</div>
                <div className="text-sm text-gray-400">
                  General nuances cover fun experiences, activities, and entertainment insights.
                </div>
              </div>
            )}
          </div>
        );

      case 'lodging':
        return (
          <div className="space-y-4">
            {hotelExpectationsCount > 0 ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <ClickableInsight
                      as="h3"
                      className="text-lg font-semibold text-gray-900 flex items-center"
                      context={{
                        type: 'nuances',
                        field: 'Hotel Expectations Section',
                        value: 'Conventional lodging amenities',
                        section: 'hotel_expectations'
                      }}
                    >
                      🏨 Conventional Lodging Expectations ({hotelExpectationsCount})
                    </ClickableInsight>
                    <p className="text-sm text-gray-600 mt-1">
                      Hotel amenities, services, and guest expectations
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {nuances.hotel_expectations.map((nuance, index) => (
                    <NuanceCard 
                      key={index}
                      nuance={nuance}
                      type="hotel"
                      onEvidenceClick={onEvidenceClick}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-2">No conventional lodging expectations available.</div>
                <div className="text-sm text-gray-400">
                  This section covers hotel amenities, services, and guest expectations.
                </div>
              </div>
            )}
          </div>
        );

      case 'rental':
        return (
          <div className="space-y-4">
            {vacationRentalExpectationsCount > 0 ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <ClickableInsight
                      as="h3"
                      className="text-lg font-semibold text-gray-900 flex items-center"
                      context={{
                        type: 'nuances',
                        field: 'Vacation Rental Expectations Section',
                        value: 'Vacation rental specific features',
                        section: 'vacation_rental_expectations'
                      }}
                    >
                      🏡 Vacation Rental Expectations ({vacationRentalExpectationsCount})
                    </ClickableInsight>
                    <p className="text-sm text-gray-600 mt-1">
                      Vacation rental specific features, amenities, and guest expectations
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {nuances.vacation_rental_expectations.map((nuance, index) => (
                    <NuanceCard 
                      key={index}
                      nuance={nuance}
                      type="vacation_rental"
                      onEvidenceClick={onEvidenceClick}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-2">No vacation rental expectations available.</div>
                <div className="text-sm text-gray-400">
                  This section covers vacation rental specific features and amenities.
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
        <nav className="flex space-x-1" aria-label="Nuance Categories">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${
                activeSubTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              <span className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium ${
                activeSubTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Sub-Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {renderSubTabContent()}
      </div>

      {/* Summary Footer */}
      {totalNuances > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              <strong className="text-gray-900">{totalNuances}</strong> total nuances across all categories
            </div>
            <div className="flex items-center gap-4">
              {destinationNuancesCount > 0 && (
                <span>🎯 {destinationNuancesCount} general</span>
              )}
              {hotelExpectationsCount > 0 && (
                <span>🏨 {hotelExpectationsCount} lodging</span>
              )}
              {vacationRentalExpectationsCount > 0 && (
                <span>🏡 {vacationRentalExpectationsCount} rental</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {totalNuances === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-2">No nuances available for this destination.</div>
          <div className="text-sm text-gray-400">
            Nuances provide detailed insights about destination experiences, hotel expectations, and vacation rental features.
          </div>
        </div>
      )}
    </div>
  );
};

export default NuancesTab; 