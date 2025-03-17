import { DialogClose, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter } from "../ui/dialog";
import { Trash2 } from "lucide-react";
import { ContactSchema } from "@/schemas/Contact";

export default function DeleteContactButton({
  contact,
  handleDelete,
  isDeleting,
}: {
  contact: ContactSchema;
  handleDelete: (contactId: string) => Promise<void>;
  isDeleting: boolean;
}) {

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Contact</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {contact.first_name}{" "}
            {contact.last_name}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={() =>
              contact.contact_id && handleDelete(contact.contact_id)
            }
            disabled={isDeleting || !contact.contact_id}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
