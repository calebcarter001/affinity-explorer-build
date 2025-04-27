import React from 'react';
import { FiCheck, FiClock, FiAlertCircle } from 'react-icons/fi';

const LifecycleDetailTable = ({ selectedLifecycle, handleExportJSON }) => (
  <div className="mt-8">
    <h3 className="text-xl font-bold mb-4">
      Lifecycle Stages: {selectedLifecycle.name}
    </h3>
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Stage</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Last Updated</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Owner</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {selectedLifecycle.stages.map((stage, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{stage.name}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    stage.status === 'complete' ? 'bg-green-100 text-green-800' :
                    stage.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    <span className="mr-1">
                      {stage.status === 'complete' ? <FiCheck /> :
                       stage.status === 'in-progress' ? <FiClock /> :
                       <FiAlertCircle />}
                    </span>
                    {stage.status === 'complete' ? 'Complete' :
                     stage.status === 'in-progress' ? 'In Progress' :
                     'Not Started'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{stage.lastUpdated}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{stage.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
        <button
          onClick={handleExportJSON}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white focus:outline-none"
        >
          Export JSON
        </button>
        <button
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white focus:outline-none"
        >
          Export to Confluence
        </button>
      </div>
    </div>
  </div>
);

export default LifecycleDetailTable; 