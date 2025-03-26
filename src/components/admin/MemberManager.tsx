
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
    error,
    createMember,
    updateMember,
    deleteMember,
    changePosition, // Use the function that exists in the hook
    refresh
  } = useMemberManager();

  // Handler functions to map to expected props
  const handleEdit = (member: Member) => setEditingMember(member);
  const handleDelete = deleteMember;
  
  const handleUpdate = async (member: Partial<Member>) => {
    if (editingMember) {
      await updateMember({
        ...member,
        id: editingMember.id
      });
    }
    setEditingMember(null);
  };
  
  const handleAddMember = () => setDialogOpen(true);
  
  const toggleReordering = () => setReordering(prev => !prev);
  
  const moveItem = async (id: string, direction: 'up' | 'down') => {
    await changePosition(id, direction);
  };

  return (
    <div>
      {!editingMember && (
        <MemberManagerHeader
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          reordering={reordering}
          toggleReordering={toggleReordering}
          handleAddMember={handleAddMember}
        />
      )}
      
      <h2 className="text-xl font-bold mb-4 text-white/90 mt-8">
        {reordering ? 'Use arrows to reorder members' : 'Current Team Members'}
      </h2>

      {editingMember ? (
        <MemberEditForm 
          member={editingMember} 
          onSave={handleUpdate} 
          onCancel={() => setEditingMember(null)} 
        />
      ) : (
        <MemberList
          members={members}
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

export default MemberManager;
