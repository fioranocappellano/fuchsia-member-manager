
import React, { useState } from 'react';
import { useGameManager } from '@/frontend/hooks/games/useGameManager';
import GameManagerHeader from '@/frontend/components/admin/games/GameManagerHeader';
import GameList from '@/frontend/components/admin/games/GameList';
import GameEditForm from '@/frontend/components/admin/games/GameEditForm';
import { Game } from '@/frontend/types/api';

/**
 * GameManager component for managing games in the admin panel
 */
const GameManager = () => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const {
    games,
    loading,
    error,
    createGame,
    updateGame,
    deleteGame,
    updatePosition: updateGamePosition,
    refresh
  } = useGameManager();

  // Handler for updating a game's position in the list
  const handlePositionChange = async (index: number, direction: 'up' | 'down') => {
    const game = games[index];
    if (game?.id) {
      await updateGamePosition(game.id, direction);
    }
  };

  return (
    <div className="space-y-6">
      <GameManagerHeader 
        onRefresh={refresh} 
        loading={loading} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Games List</h2>
          <GameList 
            games={games}
            loading={loading}
            error={error}
            onSelect={setSelectedGame}
            onDelete={deleteGame}
            onPositionChange={handlePositionChange}
          />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-lg font-medium">
            {selectedGame ? 'Edit Game' : 'Add New Game'}
          </h2>
          <GameEditForm 
            game={selectedGame}
            onSave={async (game) => {
              if (selectedGame) {
                await updateGame(game);
              } else {
                await createGame(game);
              }
              setSelectedGame(null);
            }}
            onCancel={() => setSelectedGame(null)}
          />
        </div>
      </div>
    </div>
  );
};

export default GameManager;
