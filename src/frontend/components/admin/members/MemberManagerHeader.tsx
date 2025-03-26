
import { Button } from "@/frontend/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Plus, ListRestart } from "lucide-react";
import AddMemberForm from "@/components/admin/forms/AddMemberForm";

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
  handleAddMember
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Team Members Management</h1>
        <p className="text-gray-400">Add, edit, delete, and reorder team members</p>
      </div>
      
      <div className="flex gap-2">
        <Button 
          onClick={toggleReordering}
          variant={reordering ? "default" : "outline"}
          className={reordering ? "bg-green-600 hover:bg-green-700" : ""}
        >
          <ListRestart className="mr-2 h-4 w-4" />
          {reordering ? "Done Reordering" : "Reorder Members"}
        </Button>
        
        <Button onClick={() => setDialogOpen(true)} className="bg-[#D946EF] hover:bg-[#D946EF]/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-jf-gray border-white/10 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Add New Team Member</h2>
          <AddMemberForm onAddMember={handleAddMember} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MemberManagerHeader;
