
import React, { useState } from "react";
import { useMemberManager } from "./members/useMemberManager";
import MemberManagerHeader from "./members/MemberManagerHeader";
import MemberList from "./members/MemberList";
import MemberEditForm from "./members/MemberEditForm";
import { Member } from "@/frontend/types/api";

const MemberManager = () => {
  // Local state for UI
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [reordering, setReordering] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    members,
    loading,
    handleDelete,
    handleUpdate,
    handleAddMember,
    handleEdit,
    moveItem
  } = useMemberManager();

  // Handler functions to map to expected props
  const onEdit = (member: Member) => {
    if (handleEdit) {
      handleEdit(member);
    } else {
      setEditingMember(member);
    }
  };
  
  const onDelete = handleDelete;
  
  const onUpdate = async (memberData: Partial<Member>) => {
    if (editingMember && editingMember.id) {
      await handleUpdate({
        ...memberData,
        id: editingMember.id
      });
    }
    setEditingMember(null);
  };
  
  const onAddMember = () => {
    if (handleAddMember) {
      handleAddMember();
    } else {
      setDialogOpen(true);
    }
  };
  
  const toggleReordering = () => setReordering(prev => !prev);
  
  const onMoveItem = async (id: string, direction: 'up' | 'down') => {
    if (moveItem) {
      await moveItem(id, direction);
    } else {
      console.log("Move member not implemented:", id, direction);
    }
  };

  return (
    <div>
      {!editingMember && (
        <MemberManagerHeader
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          reordering={reordering}
          toggleReordering={toggleReordering}
          handleAddMember={onAddMember}
        />
      )}
      
      <h2 className="text-xl font-bold mb-4 text-white/90 mt-8">
        {reordering ? 'Use arrows to reorder members' : 'Current Team Members'}
      </h2>

      {editingMember ? (
        <MemberEditForm 
          member={editingMember} 
          onSave={onUpdate} 
          onCancel={() => setEditingMember(null)} 
        />
      ) : (
        <MemberList
          members={members}
          loading={loading}
          reordering={reordering}
          onEdit={onEdit}
          onDelete={onDelete}
          onMoveItem={onMoveItem}
        />
      )}
    </div>
  );
};

export default MemberManager;
