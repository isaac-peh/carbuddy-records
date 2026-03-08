import { useState } from "react";
import { Tags, Plus, Pencil, Trash2, Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ManageCategoriesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: string[];
  defaultCategories: string[];
  onRenameCategory: (oldName: string, newName: string) => void;
  onDeleteCategory: (name: string) => void;
  onAddCategory: (name: string) => void;
  getPartCountForCategory: (category: string) => number;
}

export default function ManageCategoriesDialog({
  open,
  onOpenChange,
  categories,
  defaultCategories,
  onRenameCategory,
  onDeleteCategory,
  onAddCategory,
  getPartCountForCategory,
}: ManageCategoriesDialogProps) {
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleAdd = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) return;
    onAddCategory(trimmed);
    setNewCategory("");
  };

  const handleAddKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  const startEditing = (category: string) => {
    setEditingCategory(category);
    setEditValue(category);
  };

  const cancelEditing = () => {
    setEditingCategory(null);
    setEditValue("");
  };

  const confirmEdit = () => {
    const trimmed = editValue.trim();
    if (!trimmed || !editingCategory) return;
    if (trimmed === editingCategory) {
      cancelEditing();
      return;
    }
    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase() && c !== editingCategory)) return;
    onRenameCategory(editingCategory, trimmed);
    cancelEditing();
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      confirmEdit();
    }
    if (e.key === "Escape") {
      cancelEditing();
    }
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      onDeleteCategory(deleteTarget);
      setDeleteDialogOpen(false);
      setTimeout(() => setDeleteTarget(null), 200);
    }
  };

  const deleteTargetCount = deleteTarget ? getPartCountForCategory(deleteTarget) : 0;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Tags className="w-5 h-5 text-muted-foreground" />
              Manage Categories
            </DialogTitle>
            <DialogDescription>
              Add, rename, or remove part categories. Changes apply to all existing parts.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            {/* Add new category */}
            <div className="flex gap-2">
              <Input
                placeholder="New category name..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={handleAddKeyDown}
                className="text-sm"
              />
              <Button
                size="sm"
                className="gap-1.5 shrink-0"
                disabled={!newCategory.trim() || categories.some((c) => c.toLowerCase() === newCategory.trim().toLowerCase())}
                onClick={handleAdd}
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </Button>
            </div>

            {/* Category list */}
            <div className="flex flex-col gap-1 max-h-[320px] overflow-y-auto -mx-1 px-1">
            {categories.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">No categories yet</p>
            )}
            {categories.map((category) => {
              const partCount = getPartCountForCategory(category);
              const isDefault = defaultCategories.includes(category);
              const isEditing = editingCategory === category;

              return (
                <div
                  key={category}
                  className="flex items-center gap-2 py-1.5 px-2 rounded-md group hover:bg-secondary/50 transition-colors"
                >
                  {isEditing ? (
                    <>
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleEditKeyDown}
                        className="h-8 text-sm flex-1"
                        autoFocus
                      />
                      <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={confirmEdit}>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={cancelEditing}>
                        <X className="w-3.5 h-3.5 text-muted-foreground" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="text-sm font-medium flex-1 truncate">{category}</span>
                      <Badge variant="secondary" className="text-[10px] px-1.5 h-5 shrink-0 font-normal">
                        {partCount} {partCount === 1 ? "part" : "parts"}
                      </Badge>
                      {isDefault && (
                        <Badge variant="outline" className="text-[10px] px-1.5 h-5 shrink-0 font-normal text-muted-foreground">
                          Default
                        </Badge>
                      )}
                      <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-muted-foreground hover:text-accent-foreground"
                          onClick={() => startEditing(category)}
                        >
                          <Pencil className="w-3 h-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setDeleteTarget(category)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => { if (!v) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deleteTarget}"?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTargetCount > 0
                ? `${deleteTargetCount} ${deleteTargetCount === 1 ? "part is" : "parts are"} currently using this category. They will be moved to "Others".`
                : "No parts are using this category. It will be permanently removed."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
