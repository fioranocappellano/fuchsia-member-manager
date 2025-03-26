
import React from 'react';
import { Button } from '@/frontend/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface GameManagerHeaderProps {
  onRefresh: () => Promise<void>;
  loading: boolean;
}

const GameManagerHeader: React.FC<GameManagerHeaderProps> = ({
  onRefresh,
  loading
}) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Games Manager</h1>
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={loading}
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
    </div>
  );
};

export default GameManagerHeader;
