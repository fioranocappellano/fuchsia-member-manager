
import React from "react";
import { Award, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddMemberForm from "../forms/AddMemberForm";

interface MemberManagerHeaderProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  reordering: boolean;
  toggleReordering: () => void;
  handleAddMember: () => void;
}

const MemberManagerHeader: React.FC<MemberManagerHeaderProps> = ({
  dialogOpen,
  setDialogOpen,
  reordering,
  toggleReordering,
  handleAddMember,
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <Award size={24} className="text-[#D946EF]" /> Team Members Management
      </h2>
      <div className="flex gap-3">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-[#D946EF] hover:bg-[#D946EF]/90 text-white font-medium shadow-md shadow-[#D946EF]/20 hover:shadow-lg hover:shadow-[#D946EF]/30 transition-all duration-200"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-jf-dark border-[#D946EF]/20 text-jf-light">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-[#D946EF]" /> Add New Team Member
              </DialogTitle>
            </DialogHeader>
            <AddMemberForm onAddMember={() => {
              handleAddMember();
              setDialogOpen(false);
            }} />
          </DialogContent>
        </Dialog>
        <Button 
          onClick={toggleReordering}
          className={`${reordering ? 'bg-blue-600 hover:bg-blue-700' : 'bg-black/30 hover:bg-black/50'} 
            border border-white/10 text-white transition-all duration-200`}
          disabled={dialogOpen}
        >
          {reordering ? 'Done Reordering' : 'Reorder Members'}
        </Button>
      </div>
    </div>
  );
};

export default MemberManagerHeader;
