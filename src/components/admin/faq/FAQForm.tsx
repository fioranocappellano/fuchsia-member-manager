
import React from "react";
import { FAQ } from "@/frontend/types/api";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Save, X } from "lucide-react";

interface FAQFormProps {
  faq?: FAQ;
  initialData?: FAQ;
  onSave: (values: any) => void;
  onCancel: () => void;
}

const FAQForm: React.FC<FAQFormProps> = ({ faq, initialData, onSave, onCancel }) => {
  const data = faq || initialData;
  
  const form = useForm({
    defaultValues: {
      question_it: data?.question_it || "",
      question_en: data?.question_en || "",
      answer_it: data?.answer_it || "",
      answer_en: data?.answer_en || "",
      is_active: data?.is_active !== undefined ? data.is_active : true,
    }
  });

  return (
    <div className="bg-black/30 border border-white/10 rounded-lg p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="question_it"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Domanda (IT)</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      rows={3}
                      placeholder="Inserisci la domanda in italiano" 
                      className="bg-black/50 border-white/10 text-white"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="question_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Question (EN)</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      rows={3}
                      placeholder="Enter the question in English" 
                      className="bg-black/50 border-white/10 text-white"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="answer_it"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Risposta (IT)</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      rows={6}
                      placeholder="Inserisci la risposta in italiano" 
                      className="bg-black/50 border-white/10 text-white"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="answer_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Answer (EN)</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      rows={6}
                      placeholder="Enter the answer in English" 
                      className="bg-black/50 border-white/10 text-white"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/10 p-4 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel className="text-white">Active</FormLabel>
                  <div className="text-gray-400 text-sm">
                    Make this FAQ visible to users
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel} className="border-white/10 text-white hover:bg-black/50">
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button type="submit" className="bg-[#D946EF] hover:bg-[#D946EF]/90 text-white">
              <Save className="mr-2 h-4 w-4" /> Save FAQ
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FAQForm;
