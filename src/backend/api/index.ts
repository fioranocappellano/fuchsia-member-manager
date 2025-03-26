
import { supabase } from "@/integrations/supabase/client";
import { Member, Game, FAQ, NewFAQ } from "@/frontend/types/api";

// Funzioni di utilità condivise
const handleError = (error: any, message: string): never => {
  console.error(`${message}:`, error);
  throw new Error(`${message}: ${error.message}`);
};

// API per i membri del team
export const membersApi = {
  // Recupera tutti i membri ordinati per posizione
  getAll: async (): Promise<Member[]> => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('position', { ascending: true });

      if (error) throw error;
      
      // Map data per garantire che sia conforme all'interfaccia Member
      return data?.map(item => ({
        id: item.id,
        name: item.name,
        image: item.image,
        role: item.role,
        join_date: item.join_date || undefined,
        achievements: item.achievements || [],
        position: item.position || 0,
        smogon: item.smogon || undefined
      })) || [];
    } catch (error) {
      return handleError(error, "Errore durante il recupero dei membri");
    }
  },

  // Elimina un membro per ID
  delete: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      handleError(error, "Errore durante l'eliminazione del membro");
    }
  },

  // Aggiorna un membro esistente
  update: async (id: string, member: Partial<Member>): Promise<Member> => {
    try {
      const { data, error } = await supabase
        .from('members')
        .update(member)
        .eq('id', id)
        .select();

      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error("Nessun dato restituito dopo l'aggiornamento");
      }

      // Converti la risposta per corrispondere all'interfaccia Member
      return {
        id: data[0].id,
        name: data[0].name,
        image: data[0].image,
        role: data[0].role,
        join_date: data[0].join_date || undefined,
        achievements: data[0].achievements || [],
        position: data[0].position || 0,
        smogon: data[0].smogon || undefined
      };
    } catch (error) {
      return handleError(error, "Errore durante l'aggiornamento del membro");
    }
  },

  // Crea un nuovo membro
  create: async (member: Omit<Member, 'id'>): Promise<Member> => {
    try {
      const { data, error } = await supabase
        .from('members')
        .insert([member])
        .select();

      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error("Nessun dato restituito dopo la creazione");
      }

      // Converti la risposta per corrispondere all'interfaccia Member
      return {
        id: data[0].id,
        name: data[0].name,
        image: data[0].image,
        role: data[0].role,
        join_date: data[0].join_date || undefined,
        achievements: data[0].achievements || [],
        position: data[0].position || 0,
        smogon: data[0].smogon || undefined
      };
    } catch (error) {
      return handleError(error, "Errore durante la creazione del membro");
    }
  },

  // Aggiorna la posizione di due membri
  swapPositions: async (member1: Member, member2: Member): Promise<void> => {
    try {
      // Aggiorna il primo membro
      const { error: error1 } = await supabase
        .from('members')
        .update({ 
          name: member1.name,
          image: member1.image,
          role: member1.role,
          join_date: member1.join_date,
          achievements: member1.achievements,
          position: member1.position,
          smogon: member1.smogon
        })
        .eq('id', member1.id);
        
      if (error1) throw error1;
      
      // Aggiorna il secondo membro
      const { error: error2 } = await supabase
        .from('members')
        .update({ 
          name: member2.name,
          image: member2.image,
          role: member2.role,
          join_date: member2.join_date,
          achievements: member2.achievements,
          position: member2.position,
          smogon: member2.smogon
        })
        .eq('id', member2.id);
        
      if (error2) throw error2;
    } catch (error) {
      handleError(error, "Errore durante lo scambio delle posizioni");
    }
  }
};

// API per i giochi
export const gamesApi = {
  // Recupera tutti i giochi ordinati per posizione
  getAll: async (): Promise<Game[]> => {
    try {
      const { data, error } = await supabase
        .from('best_games')
        .select('*')
        .order('position', { ascending: true });

      if (error) throw error;
      
      // Map data per garantire che sia conforme all'interfaccia Game
      return data?.map(item => ({
        id: item.id,
        tournament: item.tournament,
        phase: item.phase,
        format: item.format,
        players: item.players,
        description_it: item.description_it,
        description_en: item.description_en,
        image_url: item.image_url,
        replay_url: item.replay_url,
        position: item.position || 0,
        created_at: item.created_at,
        updated_at: item.updated_at
      })) || [];
    } catch (error) {
      return handleError(error, "Errore durante il recupero dei giochi");
    }
  },

  // Elimina un gioco per ID
  delete: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('best_games')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      handleError(error, "Errore durante l'eliminazione del gioco");
    }
  },

  // Aggiorna un gioco esistente
  update: async (id: string, game: Partial<Game>): Promise<Game> => {
    try {
      const { data, error } = await supabase
        .from('best_games')
        .update(game)
        .eq('id', id)
        .select();

      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error("Nessun dato restituito dopo l'aggiornamento");
      }

      // Converti la risposta per corrispondere all'interfaccia Game
      return {
        id: data[0].id,
        tournament: data[0].tournament,
        phase: data[0].phase,
        format: data[0].format,
        players: data[0].players,
        description_it: data[0].description_it,
        description_en: data[0].description_en,
        image_url: data[0].image_url,
        replay_url: data[0].replay_url,
        position: data[0].position || 0,
        created_at: data[0].created_at,
        updated_at: data[0].updated_at
      };
    } catch (error) {
      return handleError(error, "Errore durante l'aggiornamento del gioco");
    }
  },

  // Crea un nuovo gioco
  create: async (game: Omit<Game, 'id' | 'created_at' | 'updated_at'>): Promise<Game> => {
    try {
      const { data, error } = await supabase
        .from('best_games')
        .insert([game])
        .select();

      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error("Nessun dato restituito dopo la creazione");
      }

      return {
        id: data[0].id,
        tournament: data[0].tournament,
        phase: data[0].phase,
        format: data[0].format,
        players: data[0].players,
        description_it: data[0].description_it,
        description_en: data[0].description_en,
        image_url: data[0].image_url,
        replay_url: data[0].replay_url,
        position: data[0].position || 0,
        created_at: data[0].created_at,
        updated_at: data[0].updated_at
      };
    } catch (error) {
      return handleError(error, "Errore durante la creazione del gioco");
    }
  },

  // Aggiorna la posizione di due giochi
  swapPositions: async (game1: Game, game2: Game): Promise<void> => {
    try {
      // Aggiorna il primo gioco
      const { error: error1 } = await supabase
        .from('best_games')
        .update({ 
          tournament: game1.tournament,
          phase: game1.phase,
          format: game1.format,
          players: game1.players,
          description_it: game1.description_it,
          description_en: game1.description_en,
          image_url: game1.image_url,
          replay_url: game1.replay_url,
          position: game1.position
        })
        .eq('id', game1.id);
        
      if (error1) throw error1;
      
      // Aggiorna il secondo gioco
      const { error: error2 } = await supabase
        .from('best_games')
        .update({ 
          tournament: game2.tournament,
          phase: game2.phase,
          format: game2.format,
          players: game2.players,
          description_it: game2.description_it,
          description_en: game2.description_en,
          image_url: game2.image_url,
          replay_url: game2.replay_url,
          position: game2.position
        })
        .eq('id', game2.id);
        
      if (error2) throw error2;
    } catch (error) {
      handleError(error, "Errore durante lo scambio delle posizioni");
    }
  }
};

// API per le FAQ
export const faqApi = {
  // Recupera tutte le FAQ ordinate per posizione
  getAll: async (): Promise<FAQ[]> => {
    try {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .order("position", { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      return handleError(error, "Errore durante il recupero delle FAQ");
    }
  },

  // Crea una nuova FAQ
  create: async (faq: NewFAQ): Promise<void> => {
    try {
      const { error } = await supabase.from("faqs").insert([faq]);
      if (error) throw error;
    } catch (error) {
      handleError(error, "Errore durante l'aggiunta della FAQ");
    }
  },

  // Aggiorna una FAQ esistente
  update: async (id: string, faq: Partial<FAQ>): Promise<void> => {
    try {
      const { error } = await supabase
        .from("faqs")
        .update(faq)
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      handleError(error, "Errore durante l'aggiornamento della FAQ");
    }
  },

  // Elimina una FAQ per ID
  delete: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase.from("faqs").delete().eq("id", id);
      if (error) throw error;
    } catch (error) {
      handleError(error, "Errore durante l'eliminazione della FAQ");
    }
  },

  // Attiva/disattiva una FAQ
  toggleActive: async (id: string, isActive: boolean): Promise<void> => {
    try {
      const { error } = await supabase
        .from("faqs")
        .update({ is_active: !isActive })
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      handleError(error, "Errore durante l'attivazione/disattivazione della FAQ");
    }
  },

  // Sposta una FAQ verso l'alto
  moveUp: async (faqToUpdate: FAQ, prevFaq: FAQ): Promise<void> => {
    try {
      await Promise.all([
        supabase.from("faqs").update({ position: faqToUpdate.position }).eq("id", faqToUpdate.id),
        supabase.from("faqs").update({ position: prevFaq.position }).eq("id", prevFaq.id)
      ]);
    } catch (error) {
      handleError(error, "Errore durante lo spostamento della FAQ verso l'alto");
    }
  },

  // Sposta una FAQ verso il basso
  moveDown: async (faqToUpdate: FAQ, nextFaq: FAQ): Promise<void> => {
    try {
      await Promise.all([
        supabase.from("faqs").update({ position: faqToUpdate.position }).eq("id", faqToUpdate.id),
        supabase.from("faqs").update({ position: nextFaq.position }).eq("id", nextFaq.id)
      ]);
    } catch (error) {
      handleError(error, "Errore durante lo spostamento della FAQ verso il basso");
    }
  }
};

// API per l'autenticazione
export const authApi = {
  // Verifica se l'utente è un amministratore
  checkIsAdmin: async (userId: string): Promise<boolean> => {
    if (!userId) {
      console.log("Nessun ID utente fornito a checkIsAdmin");
      return false;
    }
    
    try {
      console.log("Verifica dello stato di amministratore per l'ID utente:", userId);
      
      // Ottieni il record dell'amministratore
      const { data, error } = await supabase
        .from('admins')
        .select('is_active')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error("Errore durante la verifica dello stato di amministratore:", error);
        return false;
      }
      
      const isUserAdmin = data?.is_active === true;
      console.log("Risultato della verifica dell'amministratore:", isUserAdmin, data);
      
      return isUserAdmin;
    } catch (error) {
      console.error("Eccezione in checkIsAdmin:", error);
      return false;
    }
  },

  // Esegui il logout
  signOut: async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      handleError(error, "Errore durante il logout");
    }
  },

  // Ottieni la sessione corrente
  getSession: async () => {
    try {
      return await supabase.auth.getSession();
    } catch (error) {
      return handleError(error, "Errore durante il recupero della sessione");
    }
  },

  // Reimposta la password
  resetPassword: async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });
      
      if (error) throw error;
      
      return { success: true };
    } catch (error: any) {
      console.error("Errore durante l'invio del reset della password:", error);
      return { success: false, error };
    }
  }
};
