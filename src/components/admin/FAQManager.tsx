
import React, { useState } from "react";
import { useFAQManager } from "./faq/useFAQManager";
import FAQManagerHeader from "./faq/FAQManagerHeader";
import FAQList from "./faq/FAQList";
import FAQForm from "./faq/FAQForm";
import { NewFAQ } from "@/frontend/types/api";

const FAQManager = () => {
  const {
    faqs,
    loading,
    editingFAQ,
    reordering,
    dialogOpen,
    setDialogOpen,
    handleEdit,
    handleDelete,
    handleAddFAQ,
    handleUpdate,
    toggleReordering,
    moveItem,
    setEditingFAQ
  } = useFAQManager();

  return (
    <div>
      {!editingFAQ && (
        <FAQManagerHeader
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          reordering={reordering}
          toggleReordering={toggleReordering}
          onAddFAQ={handleAddFAQ}
        />
      )}
      
      <h2 className="text-xl font-bold mb-4 text-white/90 mt-8">
        {reordering ? 'Use arrows to reorder FAQs' : 'Current FAQs'}
      </h2>

      {editingFAQ ? (
        <FAQForm 
          faq={editingFAQ} 
          onSave={handleUpdate} 
          onCancel={() => setEditingFAQ(null)} 
        />
      ) : (
        <FAQList
          faqs={faqs}
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

export default FAQManager;
