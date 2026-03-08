import { useState, useEffect } from "react";
import { X, Info, Pencil } from "lucide-react";
import { TapTooltip } from "@/components/ui/tap-tooltip";
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Part {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  minStock: number;
  costPrice: number;
  sellPrice: number;
  supplier: string;
  uom: string;
  description: string;
}

interface EditPartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  part: Part | null;
  categories: string[];
  suppliers: string[];
  onSave: (part: Part) => void;
}

export default function EditPartDialog({
  open,
  onOpenChange,
  part,
  categories,
  suppliers,
  onSave,
}: EditPartDialogProps) {
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
  const [uom, setUom] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (part && open) {
      setName(part.name);
      setSku(part.sku);
      if (categories.includes(part.category)) {
        setCategoryMode("existing");
        setSelectedCategory(part.category);
        setCustomCategory("");
      } else {
        setCategoryMode("custom");
        setCustomCategory(part.category);
        setSelectedCategory("");
      }
      setStock(String(part.stock));
      setMinStock(String(part.minStock));
      setCostPrice(String(part.costPrice));
      setSellPrice(String(part.sellPrice));
      setUom(part.uom || "");
      setDescription(part.description || "");
      if (part.supplier && suppliers.includes(part.supplier)) {
        setSupplierMode("existing");
        setSelectedSupplier(part.supplier);
        setCustomSupplier("");
      } else if (part.supplier) {
        setSupplierMode("custom");
        setCustomSupplier(part.supplier);
        setSelectedSupplier("");
      } else {
        setSupplierMode("existing");
        setSelectedSupplier("");
        setCustomSupplier("");
      }
    }
  }, [part, open, categories, suppliers]);

  const category = categoryMode === "custom" ? customCategory.trim() : selectedCategory;
  const supplier = supplierMode === "custom" ? customSupplier.trim() : selectedSupplier;

  const isValid =
    name.trim() && sku.trim() && category && stock !== "" && minStock !== "" && costPrice !== "" && sellPrice !== "";

  const handleSubmit = () => {
    if (!isValid || !part) return;
    onSave({
      id: part.id,
      name: name.trim(),
      sku: sku.trim(),
      category,
      stock: Number(stock),
      minStock: Number(minStock),
      costPrice: Number(costPrice),
      sellPrice: Number(sellPrice),
      supplier: supplier.trim(),
      uom: uom.trim(),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="w-5 h-5 text-muted-foreground" />
            Edit Part
          </DialogTitle>
          <DialogDescription>Update the details for this spare part.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-part-name">Part Name *</Label>
              <Input
                id="edit-part-name"
                placeholder="e.g. Brake Pads"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-part-sku">SKU *</Label>
              <Input
                id="edit-part-sku"
                placeholder="e.g. BP-FRT-001"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Category *</Label>
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
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
                <SelectItem value="__custom__">+ Add custom category</SelectItem>
              </SelectContent>
            </Select>
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

          <div className="grid grid-cols-2 gap-3 items-end">
            <div className="space-y-1.5">
              <Label htmlFor="edit-part-stock" className="flex items-center gap-1">
                Current Stock *
                <TapTooltip content={<p className="max-w-[200px] text-xs">Stock is managed via movement records. Use the part detail view to record stock changes.</p>}>
                  <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TapTooltip>
              </Label>
              <Input
                id="edit-part-stock"
                type="number"
                min={0}
                placeholder="0"
                value={stock}
                disabled
                className="disabled:opacity-70 disabled:cursor-not-allowed"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-part-min-stock" className="flex items-center gap-1 min-h-[1.25rem]">Min Stock Level *</Label>
              <Input
                id="edit-part-min-stock"
                type="number"
                min={0}
                placeholder="0"
                value={minStock}
                onChange={(e) => setMinStock(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-part-cost">Cost Price ($) *</Label>
              <Input
                id="edit-part-cost"
                type="number"
                min={0}
                step="0.01"
                placeholder="0.00"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-part-sell">Sell Price ($) *</Label>
              <Input
                id="edit-part-sell"
                type="number"
                min={0}
                step="0.01"
                placeholder="0.00"
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
              />
            </div>
          </div>

          {/* UOM */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-part-uom">Unit of Measure</Label>
            <Select value={uom} onValueChange={setUom}>
              <SelectTrigger>
                <SelectValue placeholder="Select UOM" />
              </SelectTrigger>
              <SelectContent>
                {["pc", "set", "pair", "bottle", "litre", "metre", "kg", "box"].map((u) => (
                  <SelectItem key={u} value={u}>{u}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
