
import React from "react";
import { useGameManager } from "./games/useGameManager";
import GameManagerHeader from "./games/GameManagerHeader";
import GameList from "./games/GameList";
import GameEditForm from "./games/GameEditForm";

const GameManager = () => {
  const {
    games,
    loading,
    editingGame,
    reordering,
    dialogOpen,
    setDialogOpen,
    handleEdit,
    handleDelete,
    handleUpdate,
    handleAddGame,
    toggleReordering,
    moveItem,
    setEditingGame
  } = useGameManager();

  return (
    <div>
      {!editingGame && (
        <GameManagerHeader
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          reordering={reordering}
          toggleReordering={toggleReordering}
          handleAddGame={handleAddGame}
        />
      )}
      
      <h2 className="text-xl font-bold mb-4 text-white/90 mt-8">
        {reordering ? 'Use arrows to reorder games' : 'Current Games'}
      </h2>

      {editingGame ? (
        <GameEditForm 
          game={editingGame} 
          onSave={handleUpdate} 
          onCancel={() => setEditingGame(null)} 
        />
      ) : (
        <GameList
          games={games}
          loading={loading}
          reordering={reordering}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onMoveItem={moveItem}
        />
      )}
    </div>
  );
};

export default GameManager;
