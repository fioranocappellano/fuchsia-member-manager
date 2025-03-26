
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NewFAQ } from "@/frontend/types/api";

interface AddFAQFormProps {
  onAddFAQ: (data: NewFAQ) => Promise<void>;
  onCancel: () => void;
}

const AddFAQForm: React.FC<AddFAQFormProps> = ({ onAddFAQ, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<NewFAQ>({
    defaultValues: {
      question_en: "",
      question_it: "",
      answer_en: "",
      answer_it: "",
      position: 0,
      is_active: true
    }
  });

  const onSubmit = async (data: NewFAQ) => {
    await onAddFAQ(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="question_en">Question (English)</Label>
          <Input 
            id="question_en"
            {...register("question_en", { required: "English question is required" })}
          />
          {errors.question_en && (
            <p className="text-sm text-red-500">{errors.question_en.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="question_it">Question (Italian)</Label>
          <Input 
            id="question_it"
            {...register("question_it", { required: "Italian question is required" })}
          />
          {errors.question_it && (
            <p className="text-sm text-red-500">{errors.question_it.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="answer_en">Answer (English)</Label>
          <Textarea 
            id="answer_en"
            rows={4}
            {...register("answer_en", { required: "English answer is required" })}
          />
          {errors.answer_en && (
            <p className="text-sm text-red-500">{errors.answer_en.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="answer_it">Answer (Italian)</Label>
          <Textarea 
            id="answer_it"
            rows={4}
            {...register("answer_it", { required: "Italian answer is required" })}
          />
          {errors.answer_it && (
            <p className="text-sm text-red-500">{errors.answer_it.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Add FAQ
        </Button>
      </div>
    </form>
  );
};

export default AddFAQForm;
