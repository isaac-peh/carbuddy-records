import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddPartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: string[];
  suppliers: string[];
  onAdd: (part: {
    name: string;
    sku: string;
    category: string;
    stock: number;
    minStock: number;
    costPrice: number;
    sellPrice: number;
    supplier: string;
  }) => void;
}

export default function AddPartDialog({ open, onOpenChange, categories, onAdd }: AddPartDialogProps) {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [categoryMode, setCategoryMode] = useState<"existing" | "custom">("existing");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [stock, setStock] = useState("");
  const [minStock, setMinStock] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [supplier, setSupplier] = useState("");

  const category = categoryMode === "custom" ? customCategory.trim() : selectedCategory;

  const isValid =
    name.trim() &&
    sku.trim() &&
    category &&
    stock !== "" &&
    minStock !== "" &&
    costPrice !== "" &&
    sellPrice !== "";

  const resetForm = () => {
    setName("");
    setSku("");
    setCategoryMode("existing");
    setSelectedCategory("");
    setCustomCategory("");
    setStock("");
    setMinStock("");
    setCostPrice("");
    setSellPrice("");
    setSupplier("");
  };

  const handleSubmit = () => {
    if (!isValid) return;
    onAdd({
      name: name.trim(),
      sku: sku.trim(),
      category,
      stock: Number(stock),
      minStock: Number(minStock),
      costPrice: Number(costPrice),
      sellPrice: Number(sellPrice),
      supplier: supplier.trim(),
    });
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); onOpenChange(v); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Part</DialogTitle>
          <DialogDescription>Fill in the details for the new spare part.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Name & SKU */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="part-name">Part Name *</Label>
              <Input id="part-name" placeholder="e.g. Brake Pads" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="part-sku">SKU *</Label>
              <Input id="part-sku" placeholder="e.g. BP-FRT-001" value={sku} onChange={(e) => setSku(e.target.value)} />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label>Category *</Label>
            <div className="flex gap-2">
              <Select
                value={categoryMode === "existing" ? selectedCategory : "__custom__"}
                onValueChange={(val) => {
                  if (val === "__custom__") {
                    setCategoryMode("custom");
                    setSelectedCategory("");
                  } else {
                    setCategoryMode("existing");
                    setSelectedCategory(val);
                    setCustomCategory("");
                  }
                }}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                  <SelectItem value="__custom__">+ Add custom category</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {categoryMode === "custom" && (
              <Input
                placeholder="Enter new category name"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="mt-1.5"
                autoFocus
              />
            )}
          </div>

          {/* Stock */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="part-stock">Current Stock *</Label>
              <Input id="part-stock" type="number" min={0} placeholder="0" value={stock} onChange={(e) => setStock(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="part-min-stock">Min Stock Level *</Label>
              <Input id="part-min-stock" type="number" min={0} placeholder="0" value={minStock} onChange={(e) => setMinStock(e.target.value)} />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="part-cost">Cost Price ($) *</Label>
              <Input id="part-cost" type="number" min={0} step="0.01" placeholder="0.00" value={costPrice} onChange={(e) => setCostPrice(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="part-sell">Sell Price ($) *</Label>
              <Input id="part-sell" type="number" min={0} step="0.01" placeholder="0.00" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} />
            </div>
          </div>

          {/* Supplier */}
          <div className="space-y-1.5">
            <Label htmlFor="part-supplier">Supplier</Label>
            <Input id="part-supplier" placeholder="e.g. AutoParts SG" value={supplier} onChange={(e) => setSupplier(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => { resetForm(); onOpenChange(false); }}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!isValid}>Add Part</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
