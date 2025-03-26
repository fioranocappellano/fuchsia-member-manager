
import React, { useState } from 'react';
import { useGameManager } from '@/frontend/hooks/useGameManager';
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
    createGame,
    updateGame,
    deleteGame,
    updatePosition,
    refresh
  } = useGameManager();

  // Handler for updating a game's position in the list
  const handlePositionChange = async (index: number, direction: 'up' | 'down') => {
    if (index >= 0 && index < games.length) {
      const game = games[index];
      if (game?.id) {
        await updatePosition(game.id, direction);
      }
    }
  };

  // Form submission handler
  const handleSave = async (formData: any) => {
    if (selectedGame) {
      // Update existing game
      await updateGame({
        ...formData,
        id: selectedGame.id,
        position: selectedGame.position
      });
    } else {
      // Create new game
      await createGame({
        ...formData,
        position: games.length + 1
      });
    }
    setSelectedGame(null);
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
            reordering={false}
            onEdit={setSelectedGame}
            onDelete={deleteGame}
            onMoveItem={async (id, direction) => {
              // Convert numeric index to ID
              const gameId = typeof id === 'number' ? games[id]?.id : id;
              if (gameId) {
                await handlePositionChange(games.findIndex(g => g.id === gameId), direction);
              }
            }}
          />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-lg font-medium">
            {selectedGame ? 'Edit Game' : 'Add New Game'}
          </h2>
          <GameEditForm 
            game={selectedGame}
            onSave={handleSave}
            onCancel={() => setSelectedGame(null)}
          />
        </div>
      </div>
    </div>
  );
};

export default GameManager;
