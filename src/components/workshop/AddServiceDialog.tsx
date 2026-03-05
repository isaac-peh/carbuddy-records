import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (service: {
    name: string;
    description: string;
    flatPrice: number | null;
    hourlyRate: number | null;
  }) => void;
}

export default function AddServiceDialog({ open, onOpenChange, onAdd }: AddServiceDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [flatPrice, setFlatPrice] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");

  const isValid = name.trim() && (flatPrice !== "" || hourlyRate !== "");

  const resetForm = () => {
    setName("");
    setDescription("");
    setFlatPrice("");
    setHourlyRate("");
  };

  const handleSubmit = () => {
    if (!isValid) return;
    onAdd({
      name: name.trim(),
      description: description.trim(),
      flatPrice: flatPrice !== "" ? Number(flatPrice) : null,
      hourlyRate: hourlyRate !== "" ? Number(hourlyRate) : null,
    });
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); onOpenChange(v); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-muted-foreground" />
            Add New Service
          </DialogTitle>
          <DialogDescription>Define a labour or workmanship charge.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="svc-name">Service Name *</Label>
            <Input id="svc-name" placeholder="e.g. Brake Pad Replacement (Labor)" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="svc-desc">Description</Label>
            <Input id="svc-desc" placeholder="e.g. Remove caliper, swap pads, bleed if needed" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="svc-flat">Flat Price ($)</Label>
              <Input id="svc-flat" type="number" min={0} step="0.01" placeholder="0.00" value={flatPrice} onChange={(e) => setFlatPrice(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="svc-hourly">Hourly Rate ($/hr)</Label>
              <Input id="svc-hourly" type="number" min={0} step="0.01" placeholder="0.00" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">Provide at least one pricing option. You can set both if the service supports either billing method.</p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => { resetForm(); onOpenChange(false); }}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!isValid}>Add Service</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
