
import { Button } from '@/frontend/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface GameManagerHeaderProps {
  onRefresh: () => void;
  loading: boolean;
}

/**
 * Header component for the GameManager with refresh button
 */
const GameManagerHeader = ({ onRefresh, loading }: GameManagerHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Manage Games</h1>
      <Button 
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={loading}
        className="flex items-center gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
    </div>
  );
};

export default GameManagerHeader;
