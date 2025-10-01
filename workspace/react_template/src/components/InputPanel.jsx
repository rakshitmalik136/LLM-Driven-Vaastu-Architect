import React, { useState } from 'react';
import { Send, Mic, Sparkles, RotateCcw } from 'lucide-react';
import { useDesign } from '../context/DesignContext';
import LLMService from '../services/LLMService';
import VastuEngine from '../engine/VastuEngine';

const InputPanel = ({ setVastuScore } = {}) => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestions] = useState([
    "Create a 3-bedroom house with Vastu-compliant layout",
    "Design a living room with proper Vastu directions",
    "Add a kitchen in the southeast corner",
    "Place the main entrance facing east"
  ]);
  
  const { state, dispatch } = useDesign();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);
    
    try {
      // Process with LLM Service
      const designCommand = await LLMService.processDesignRequest(input, state);
      
      // Execute design command
      if (designCommand.type === 'ADD_ROOM') {
        dispatch({
          type: 'ADD_ROOM',
          payload: designCommand.data
        });
      } else if (designCommand.type === 'ADD_FURNITURE') {
        dispatch({
          type: 'ADD_FURNITURE',
          payload: designCommand.data
        });
      }

      // Update Vastu compliance
      const vastuAnalysis = VastuEngine.analyzeDesign(state);
      dispatch({
        type: 'UPDATE_VASTU_SCORE',
        payload: vastuAnalysis
      });
      setVastuScore && setVastuScore(vastuAnalysis.score);

      setInput('');
    } catch (error) {
      console.error('Error processing design request:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  return (
    <div className="h-full flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">AI Design Assistant</h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-sm text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Local LLM Ready</span>
          </div>
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Suggestions */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded-full text-gray-300 hover:text-white transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="flex-1 mb-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your design in natural language... (e.g., 'Create a 2-bedroom apartment with Vastu-compliant layout')"
            className="w-full h-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:border-blue-500 transition-colors"
            disabled={isProcessing}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Voice Input"
            >
              <Mic className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="AI Suggestions"
            >
              <Sparkles className="w-5 h-5" />
            </button>
          </div>

          <button
            type="submit"
            disabled={!input.trim() || isProcessing}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg flex items-center space-x-2 transition-colors"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Generate</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputPanel;