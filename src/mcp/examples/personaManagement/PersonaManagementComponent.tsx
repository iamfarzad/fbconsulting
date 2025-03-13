
/**
 * Persona Management Component
 * A test component for demonstrating the Persona Management MCP
 */

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { usePersonaManagement } from '../../hooks/usePersonaManagement';
import { CurrentPersonaDisplay } from './components/CurrentPersonaDisplay';
import { PersonaSelectorGrid } from './components/PersonaSelectorGrid';
import { UserContextForm } from './components/UserContextForm';
import { TechnicalLevelSelector } from './components/TechnicalLevelSelector';
import { ConversationContextForm } from './components/ConversationContextForm';
import { ActionButtons } from './components/ActionButtons';
import { MetadataDisplay } from './components/MetadataDisplay';

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
    setConversationContext: updateConversationContext,
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
    updateConversationContext(conversationContext);
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
      <CurrentPersonaDisplay 
        currentPersona={personaData.currentPersona} 
        personaDefinitions={personaData.personaDefinitions} 
      />
      
      {/* Persona selection */}
      <PersonaSelectorGrid
        currentPersona={personaData.currentPersona}
        personaDefinitions={personaData.personaDefinitions}
        setCurrentPersona={setCurrentPersona}
      />
      
      {/* User context forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Role form */}
        <UserContextForm
          title="User Role"
          value={role}
          currentValue={personaData.userRole}
          onChange={setRole}
          onSubmit={handleRoleSubmit}
          placeholder="e.g. CTO, Developer, Product Manager"
        />
        
        {/* Industry form */}
        <UserContextForm
          title="Industry"
          value={industry}
          currentValue={personaData.userIndustry}
          onChange={setIndustry}
          onSubmit={handleIndustrySubmit}
          placeholder="e.g. Finance, Healthcare, Technology"
        />
        
        {/* Technical level form */}
        <TechnicalLevelSelector
          technicalLevel={technicalLevel}
          currentLevel={personaData.userTechnicalLevel}
          onChange={setTechnicalLevel}
          onSubmit={handleTechnicalLevelSubmit}
        />
        
        {/* Conversation context form */}
        <ConversationContextForm
          conversationContext={conversationContext}
          onChange={setConversationContext}
          onSubmit={handleContextSubmit}
        />
      </div>
      
      {/* Actions */}
      <ActionButtons
        determineOptimalPersona={determineOptimalPersona}
        resetPersona={resetPersona}
      />
      
      {/* Metadata */}
      <MetadataDisplay
        currentPage={personaData.currentPage}
        lastUpdated={personaData.lastUpdated}
      />
    </div>
  );
};
