import React from 'react';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const VastuIndicator = ({ score }) => {
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreIcon = (score) => {
    if (score >= 90) return CheckCircle;
    if (score >= 70) return AlertTriangle;
    return XCircle;
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    return 'Needs Improvement';
  };

  const Icon = getScoreIcon(score);

  return (
    <div className="flex items-center space-x-3">
      <div className="text-sm text-gray-400">Vastu Compliance:</div>
      <div className="flex items-center space-x-2">
        <Icon className={`w-5 h-5 ${getScoreColor(score)}`} />
        <span className={`font-semibold ${getScoreColor(score)}`}>
          {score}%
        </span>
        <span className="text-sm text-gray-400">
          ({getScoreLabel(score)})
        </span>
      </div>
    </div>
  );
};

export default VastuIndicator;