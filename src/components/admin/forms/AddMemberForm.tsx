
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Award, User, Calendar, ListChecks, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";

const AddMemberForm = ({ onAddMember }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm({
    defaultValues: {
      name: "",
      image: "",
      role: "",
      joinDate: "",
      achievements: ""
    }
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const achievementsArray = values.achievements
        .split("\n")
        .map((a) => a.trim())
        .filter((a) => a);

      // Get the maximum position value to place the new member at the end
      const { data: maxPositionData } = await supabase
        .from('members')
        .select('position')
        .order('position', { ascending: false })
        .limit(1);

      const maxPosition = maxPositionData && maxPositionData.length > 0 
        ? (maxPositionData[0].position || 0) 
        : 0;

      const { data, error } = await supabase.from("members").insert({
        name: values.name,
        image: values.image,
        role: values.role,
        join_date: values.joinDate,
        achievements: achievementsArray,
        position: maxPosition + 1, // Set the position to be after the current last item
      }).select();

      if (error) throw error;

      toast({
        title: "Membro aggiunto",
        description: "Il membro è stato aggiunto con successo",
      });

      form.reset();

      if (onAddMember && data) {
        onAddMember(data[0]);
      }
    } catch (error) {
      console.error("Error adding member:", error);
      toast({
        title: "Errore nell'aggiunta del membro",
        description: error.message || "Si è verificato un problema durante l'aggiunta del membro",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border border-white/10 bg-black/40 backdrop-blur-sm shadow-xl mb-8 overflow-hidden transition-all duration-300 hover:shadow-[#D946EF]/10">
      <CardHeader className="bg-gradient-to-r from-[#D946EF]/20 to-transparent border-b border-white/10 px-6 py-4">
        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
          <Award size={18} className="text-[#D946EF]" /> Aggiungi Nuovo Membro
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
                      <User size={14} className="text-[#D946EF]" /> Nome
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        required 
                        placeholder="Inserisci nome del membro" 
                        className="bg-black/60 border-white/10 text-white"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
                      <Image size={14} className="text-[#D946EF]" /> URL Immagine
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        required 
                        placeholder="Inserisci URL immagine" 
                        className="bg-black/60 border-white/10 text-white"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-300">
                      Ruolo
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        required 
                        placeholder="Inserisci ruolo" 
                        className="bg-black/60 border-white/10 text-white"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="joinDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
                      <Calendar size={14} className="text-[#D946EF]" /> Data Ingresso
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="es. Settembre 2015" 
                        className="bg-black/60 border-white/10 text-white"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="achievements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
                    <ListChecks size={14} className="text-[#D946EF]" /> Risultati (uno per riga)
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      required 
                      placeholder="Inserisci ogni risultato su una nuova riga" 
                      className="min-h-[120px] bg-black/60 border-white/10 text-white"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-[#D946EF] hover:bg-[#D946EF]/90 text-white font-medium py-3 rounded-lg shadow-lg shadow-[#D946EF]/20 flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-xl hover:shadow-[#D946EF]/30"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              ) : (
                <Plus size={18} />
              )}
              <span>Aggiungi Membro</span>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddMemberForm;
