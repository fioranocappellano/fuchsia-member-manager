import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  tournament: z.string().min(2, { message: "Tournament name must be at least 2 characters." }),
  phase: z.string().min(2, { message: "Phase must be at least 2 characters." }),
  format: z.string().min(2, { message: "Format must be at least 2 characters." }),
  players: z.string().min(2, { message: "Players must be at least 2 characters." }),
  description_it: z.string().min(10, { message: "Italian description must be at least 10 characters." }),
  description_en: z.string().min(10, { message: "English description must be at least 10 characters." }),
  image_url: z.string().url({ message: "Please enter a valid URL for the image." }),
  replay_url: z.string().url({ message: "Please enter a valid URL for the replay." }),
});

type FormValues = z.infer<typeof formSchema>;

interface AddGameFormProps {
  onAddGame: () => void;
}

const AddGameForm: React.FC<AddGameFormProps> = ({ onAddGame }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tournament: "",
      phase: "",
      format: "",
      players: "",
      description_it: "",
      description_en: "",
      image_url: "",
      replay_url: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      
      // Get the highest position value to place the new game at the end
      const { data: gamesData, error: gamesError } = await supabase
        .from('best_games')
        .select('position')
        .order('position', { ascending: false })
        .limit(1);
      
      if (gamesError) {
        throw gamesError;
      }
      
      // Calculate the next position (highest + 1) or start at 0 if no games exist
      const nextPosition = gamesData && gamesData.length > 0 && gamesData[0].position !== null 
        ? Number(gamesData[0].position) + 1 
        : 0;
      
      // Add the game with the calculated position
      const { error } = await supabase
        .from('best_games')
        .insert([
          {
            ...values,
            position: nextPosition
          }
        ]);
      
      if (error) throw error;
      
      toast({
        title: "Game added",
        description: "The game has been added successfully",
      });
      
      form.reset();
      onAddGame();
    } catch (error) {
      console.error("Error adding game:", error);
      toast({
        title: "Error adding game",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="tournament"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Tournament</FormLabel>
                <FormControl>
                  <Input placeholder="Tournament Name" className="bg-black/40 border-white/10 text-white" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phase"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Phase</FormLabel>
                <FormControl>
                  <Input placeholder="Phase" className="bg-black/40 border-white/10 text-white" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="format"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Format</FormLabel>
                <FormControl>
                  <Input placeholder="Format" className="bg-black/40 border-white/10 text-white" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="players"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Players</FormLabel>
                <FormControl>
                  <Input placeholder="Players" className="bg-black/40 border-white/10 text-white" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="Image URL" className="bg-black/40 border-white/10 text-white" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="replay_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Replay URL</FormLabel>
                <FormControl>
                  <Input placeholder="Replay URL" className="bg-black/40 border-white/10 text-white" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="description_it"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Description (IT)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Italian Description"
                    className="bg-black/40 border-white/10 text-white min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description_en"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Description (EN)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="English Description"
                    className="bg-black/40 border-white/10 text-white min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={loading} className="bg-[#D946EF] hover:bg-[#D946EF]/90 text-white">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            "Add Game"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AddGameForm;
