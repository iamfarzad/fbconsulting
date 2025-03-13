
/**
 * Persona Management Component
 * A test component for demonstrating the Persona Management MCP
 */

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { usePersonaManagement } from '../../hooks/usePersonaManagement';
import { PersonaType } from '../../protocols/personaManagement';

export const PersonaManagementComponent: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Form state
  const [role, setRole] = useState('');
  const [industry, setIndustry] = useState('');
  const [technicalLevel, setTechnicalLevel] = useState<'beginner' | 'intermediate' | 'expert'>('beginner');
  const [conversationContext, setConversationContext] = useState('');
  
  // Use our persona management hook
  const {
    personaData,
    setCurrentPersona,
    setUserRole,
    setUserIndustry,
    setUserTechnicalLevel,
    setConversationContext,
    setCurrentPage,
    determineOptimalPersona,
    resetPersona,
    isLoading
  } = usePersonaManagement();

  // Set current page when the location changes
  useEffect(() => {
    setCurrentPage(currentPath);
  }, [currentPath, setCurrentPage]);

  // Handle form submissions
  const handleRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserRole(role);
  };

  const handleIndustrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserIndustry(industry);
  };

  const handleTechnicalLevelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserTechnicalLevel(technicalLevel);
  };

  const handleContextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConversationContext(conversationContext);
  };

  const getCurrentPersonaDetails = () => {
    const current = personaData.currentPersona;
    return personaData.personaDefinitions[current];
  };

  return (
    <div className="p-6 bg-white dark:bg-black/80 rounded-lg shadow-md border border-gray-200 dark:border-gray-800 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Persona Management Demo</h2>
      
      {/* Loading state */}
      {isLoading && (
        <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded mb-4">
          Loading persona data...
        </div>
      )}
      
      {/* Current persona display */}
      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
        <h3 className="text-xl font-semibold mb-2">Current Persona: {getCurrentPersonaDetails().name}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-2">{getCurrentPersonaDetails().description}</p>
        <p className="mb-2"><strong>Tone:</strong> {getCurrentPersonaDetails().tone}</p>
        
        <div className="mt-3">
          <h4 className="font-medium mb-1">Focus Areas:</h4>
          <ul className="list-disc pl-5 mb-3">
            {getCurrentPersonaDetails().focusAreas.map((area, index) => (
              <li key={index}>{area}</li>
            ))}
          </ul>
        </div>
        
        <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-3">
          <h4 className="font-medium mb-1">Sample Phrases:</h4>
          <ul className="list-disc pl-5">
            {getCurrentPersonaDetails().samplePhrases.map((phrase, index) => (
              <li key={index} className="italic text-sm">{phrase}</li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Persona selection */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Manually Select Persona</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.keys(personaData.personaDefinitions).map((persona) => (
            <button
              key={persona}
              className={`p-2 rounded-md border transition-colors ${
                personaData.currentPersona === persona
                  ? 'bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-700'
                  : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              onClick={() => setCurrentPersona(persona as PersonaType)}
            >
              {personaData.personaDefinitions[persona as PersonaType].name}
            </button>
          ))}
        </div>
      </div>
      
      {/* User context forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Role form */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold mb-3">User Role</h3>
          <form onSubmit={handleRoleSubmit}>
            <input
              type="text"
              className="w-full p-2 mb-2 border rounded-md"
              placeholder="e.g. CTO, Developer, Product Manager"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
            <div className="flex items-center">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Set Role
              </button>
              <span className="ml-3 text-gray-600 dark:text-gray-400">
                Current: {personaData.userRole || '(not set)'}
              </span>
            </div>
          </form>
        </div>
        
        {/* Industry form */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold mb-3">Industry</h3>
          <form onSubmit={handleIndustrySubmit}>
            <input
              type="text"
              className="w-full p-2 mb-2 border rounded-md"
              placeholder="e.g. Finance, Healthcare, Technology"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            />
            <div className="flex items-center">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Set Industry
              </button>
              <span className="ml-3 text-gray-600 dark:text-gray-400">
                Current: {personaData.userIndustry || '(not set)'}
              </span>
            </div>
          </form>
        </div>
        
        {/* Technical level form */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold mb-3">Technical Level</h3>
          <form onSubmit={handleTechnicalLevelSubmit}>
            <select
              className="w-full p-2 mb-2 border rounded-md"
              value={technicalLevel}
              onChange={(e) => setTechnicalLevel(e.target.value as 'beginner' | 'intermediate' | 'expert')}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
            </select>
            <div className="flex items-center">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Set Level
              </button>
              <span className="ml-3 text-gray-600 dark:text-gray-400">
                Current: {personaData.userTechnicalLevel || '(not set)'}
              </span>
            </div>
          </form>
        </div>
        
        {/* Conversation context form */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold mb-3">Conversation Context</h3>
          <form onSubmit={handleContextSubmit}>
            <textarea
              className="w-full p-2 mb-2 border rounded-md"
              rows={3}
              placeholder="Enter conversation text to analyze for persona determination"
              value={conversationContext}
              onChange={(e) => setConversationContext(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Set Context
            </button>
          </form>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex flex-wrap gap-3 mt-6">
        <button
          onClick={determineOptimalPersona}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Determine Optimal Persona
        </button>
        
        <button
          onClick={resetPersona}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        >
          Reset to Default
        </button>
      </div>
      
      {/* Metadata */}
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-6">
        <p>Current page: {personaData.currentPage || '(not set)'}</p>
        <p>Last updated: {personaData.lastUpdated ? new Date(personaData.lastUpdated).toLocaleString() : 'Never'}</p>
      </div>
    </div>
  );
};
