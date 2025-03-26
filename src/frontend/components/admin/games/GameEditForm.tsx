
import { useForm } from 'react-hook-form';
import { Button } from '@/frontend/components/ui/button';
import { Input } from '@/frontend/components/ui/input';
import { Textarea } from '@/frontend/components/ui/textarea';
import { Game } from '@/frontend/types/api';
import { Select } from '@/frontend/components/ui/select';

type GameFormData = Omit<Game, 'id' | 'created_at' | 'position'>;

interface GameEditFormProps {
  game: Game | null;
  onSave: (game: GameFormData) => Promise<void>;
  onCancel: () => void;
}

/**
 * Form component for creating or editing a game
 */
const GameEditForm = ({ game, onSave, onCancel }: GameEditFormProps) => {
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors, isSubmitting } 
  } = useForm<GameFormData>({
    defaultValues: game ? {
      tournament: game.tournament,
      phase: game.phase,
      format: game.format,
      players: game.players,
      replay_url: game.replay_url,
      image_url: game.image_url,
      winner: game.winner,
      stats: game.stats,
      description_en: game.description_en,
      description_it: game.description_it,
    } : {
      tournament: '',
      phase: '',
      format: '',
      players: [],
      replay_url: '',
      image_url: '',
      winner: '',
      stats: '',
      description_en: '',
      description_it: '',
    }
  });

  const onSubmit = async (data: GameFormData) => {
    try {
      // Ensure players is an array
      const formattedData = {
        ...data,
        players: Array.isArray(data.players) 
          ? data.players 
          : data.players.toString().split(',').map(p => p.trim())
      };
      
      await onSave(formattedData);
      reset();
    } catch (error) {
      console.error('Error saving game:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="tournament" className="block text-sm font-medium">
          Tournament
        </label>
        <Input
          id="tournament"
          {...register('tournament', { required: 'Tournament is required' })}
          error={errors.tournament?.message}
        />
        {errors.tournament && (
          <p className="text-red-500 text-sm">{errors.tournament.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="phase" className="block text-sm font-medium">
          Phase
        </label>
        <Input
          id="phase"
          {...register('phase', { required: 'Phase is required' })}
          error={errors.phase?.message}
        />
        {errors.phase && (
          <p className="text-red-500 text-sm">{errors.phase.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="format" className="block text-sm font-medium">
          Format
        </label>
        <Input
          id="format"
          {...register('format', { required: 'Format is required' })}
          error={errors.format?.message}
        />
        {errors.format && (
          <p className="text-red-500 text-sm">{errors.format.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="players" className="block text-sm font-medium">
          Players (comma-separated)
        </label>
        <Input
          id="players"
          {...register('players', { required: 'Players are required' })}
          error={errors.players?.message}
        />
        {errors.players && (
          <p className="text-red-500 text-sm">{errors.players.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="replay_url" className="block text-sm font-medium">
          Replay URL
        </label>
        <Input
          id="replay_url"
          {...register('replay_url', { required: 'Replay URL is required' })}
          error={errors.replay_url?.message}
        />
        {errors.replay_url && (
          <p className="text-red-500 text-sm">{errors.replay_url.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="image_url" className="block text-sm font-medium">
          Image URL
        </label>
        <Input
          id="image_url"
          {...register('image_url')}
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="winner" className="block text-sm font-medium">
          Winner
        </label>
        <Input
          id="winner"
          {...register('winner', { required: 'Winner is required' })}
          error={errors.winner?.message}
        />
        {errors.winner && (
          <p className="text-red-500 text-sm">{errors.winner.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="stats" className="block text-sm font-medium">
          Stats
        </label>
        <Input
          id="stats"
          {...register('stats')}
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="description_en" className="block text-sm font-medium">
          Description (English)
        </label>
        <Textarea
          id="description_en"
          {...register('description_en', { required: 'English description is required' })}
          error={errors.description_en?.message}
          rows={4}
        />
        {errors.description_en && (
          <p className="text-red-500 text-sm">{errors.description_en.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="description_it" className="block text-sm font-medium">
          Description (Italian)
        </label>
        <Textarea
          id="description_it"
          {...register('description_it', { required: 'Italian description is required' })}
          error={errors.description_it?.message}
          rows={4}
        />
        {errors.description_it && (
          <p className="text-red-500 text-sm">{errors.description_it.message}</p>
        )}
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            onCancel();
            reset();
          }}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : game ? 'Update Game' : 'Add Game'}
        </Button>
      </div>
    </form>
  );
};

export default GameEditForm;
