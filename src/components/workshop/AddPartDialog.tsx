import { useState } from "react";
import { X, Info } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
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

export default function AddPartDialog({ open, onOpenChange, categories, suppliers, onAdd }: AddPartDialogProps) {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [categoryMode, setCategoryMode] = useState<"existing" | "custom">("existing");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [stock, setStock] = useState("");
  const [minStock, setMinStock] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [supplierMode, setSupplierMode] = useState<"existing" | "custom">("existing");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [customSupplier, setCustomSupplier] = useState("");

  const category = categoryMode === "custom" ? customCategory.trim() : selectedCategory;

  const isValid =
    name.trim() &&
    sku.trim() &&
    category &&
    stock !== "" &&
    minStock !== "" &&
    costPrice !== "" &&
    sellPrice !== "";

  const supplier = supplierMode === "custom" ? customSupplier.trim() : selectedSupplier;

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
    setSupplierMode("existing");
    setSelectedSupplier("");
    setCustomSupplier("");
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
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
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
          <div className="grid grid-cols-2 gap-3 items-end">
            <div className="space-y-1.5">
              <Label htmlFor="part-stock" className="flex items-center gap-1">
                Current Stock *
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-[200px] text-xs">Stock is managed via movement records. Use the part detail view to record stock changes.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input id="part-stock" type="number" min={0} placeholder="0" value={stock} disabled className="disabled:opacity-70 disabled:cursor-not-allowed" />
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
            <Label>Supplier</Label>
            <div className="relative">
              <Select
                value={supplierMode === "existing" ? selectedSupplier : "__custom__"}
                onValueChange={(val) => {
                  if (val === "__custom__") {
                    setSupplierMode("custom");
                    setSelectedSupplier("");
                  } else {
                    setSupplierMode("existing");
                    setSelectedSupplier(val);
                    setCustomSupplier("");
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                  <SelectItem value="__custom__">+ Add custom supplier</SelectItem>
                </SelectContent>
              </Select>
              {(selectedSupplier || supplierMode === "custom") && (
                <button
                  type="button"
                  className="absolute right-8 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => {
                    setSupplierMode("existing");
                    setSelectedSupplier("");
                    setCustomSupplier("");
                  }}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            {supplierMode === "custom" && (
              <Input
                placeholder="Enter supplier name"
                value={customSupplier}
                onChange={(e) => setCustomSupplier(e.target.value)}
                className="mt-1.5"
                autoFocus
              />
            )}
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
