

## Plan: Add Tooltip on Service Type for Multi-Service Records

### Context
Currently `serviceType` is a single string. To demonstrate the "+N more" and tooltip behavior, we need to either change the data model to support multiple services or simulate it. Since the plan already includes showing "+N more services", the data model should support arrays.

### Changes (single file: `src/components/ServiceRecordTable.tsx`)

1. **Import Tooltip components** from `@/components/ui/tooltip` (`Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider`)

2. **Update data model** -- Add an optional `serviceTypes?: string[]` field to `ServiceRecord` for records with multiple services. Update 1-2 sample records to include multiple service types (e.g., `serviceTypes: ["Scheduled Maintenance", "Brake Inspection", "Tire Rotation"]`)

3. **Add tooltip to the service type label in Row 4 (Variant D)** -- When `record.serviceTypes` exists and has more than 1 entry:
   - Display: `{primaryService} +{N} more` as the label
   - Wrap it in a `Tooltip` that on hover shows a list of all services
   - The tooltip content lists each service type (e.g., bullet list or comma-separated)
   - When only 1 service, render the label normally without tooltip

4. **Wrap the component (or relevant section) in `TooltipProvider`** to enable tooltip functionality

