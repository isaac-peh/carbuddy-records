import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
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

interface Service {
  id: string;
  name: string;
  description: string;
  flatPrice: number | null;
  hourlyRate: number | null;
}

interface EditServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service | null;
  onSave: (service: Service) => void;
}

export default function EditServiceDialog({ open, onOpenChange, service, onSave }: EditServiceDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [flatPrice, setFlatPrice] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");

  useEffect(() => {
    if (service) {
      setName(service.name);
      setDescription(service.description);
      setFlatPrice(service.flatPrice != null ? String(service.flatPrice) : "");
      setHourlyRate(service.hourlyRate != null ? String(service.hourlyRate) : "");
    }
  }, [service]);

  const isValid = name.trim() && (flatPrice !== "" || hourlyRate !== "");

  const handleSubmit = () => {
    if (!isValid || !service) return;
    onSave({
      ...service,
      name: name.trim(),
      description: description.trim(),
      flatPrice: flatPrice !== "" ? Number(flatPrice) : null,
      hourlyRate: hourlyRate !== "" ? Number(hourlyRate) : null,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="w-5 h-5 text-muted-foreground" />
            Edit Service
          </DialogTitle>
          <DialogDescription>Update this labour or workmanship charge.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="edit-svc-name">Service Name *</Label>
            <Input id="edit-svc-name" placeholder="e.g. Brake Pad Replacement (Labor)" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-svc-desc">Description</Label>
            <Input id="edit-svc-desc" placeholder="e.g. Remove caliper, swap pads, bleed if needed" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-svc-flat">Flat Price ($)</Label>
              <Input id="edit-svc-flat" type="number" min={0} step="0.01" placeholder="0.00" value={flatPrice} onChange={(e) => setFlatPrice(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-svc-hourly">Hourly Rate ($/hr)</Label>
              <Input id="edit-svc-hourly" type="number" min={0} step="0.01" placeholder="0.00" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">Provide at least one pricing option.</p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!isValid}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
