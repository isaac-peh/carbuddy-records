import { format } from "date-fns";

interface PartLine {
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
}

interface LabourLine {
  description: string;
  pricingMode: "hourly" | "flat";
  hours: number;
  rate: number;
}

interface PrintableInvoiceProps {
  invoiceNumber: string;
  serviceDate?: Date;
  serviceTypes: string[];
  technician: string;
  customerName: string;
  phone: string;
  email: string;
  vehicle: {
    plateNumber: string;
    vin: string;
    make: string;
    model: string;
    vehicleType: string;
  } | null;
  odometer: string;
  parts: PartLine[];
  labour: LabourLine[];
  partsTotal: number;
  labourTotal: number;
  subtotal: number;
  discountValue: number;
  grandTotal: number;
  discountMode: "value" | "percent";
  discountRaw: number;
  remarks: string;
}

export default function PrintableInvoice({
  invoiceNumber,
  serviceDate,
  serviceTypes,
  technician,
  customerName,
  phone,
  email,
  vehicle,
  odometer,
  parts,
  labour,
  partsTotal,
  labourTotal,
  subtotal,
  discountValue,
  grandTotal,
  discountRaw,
  discountMode,
  remarks,
}: PrintableInvoiceProps) {
  const formattedDate = serviceDate ? format(serviceDate, "dd MMM yyyy") : "—";
  const hasDiscount = discountValue > 0;

  return (
    <div className="print-invoice hidden print:block w-full max-w-[210mm] mx-auto bg-white text-black text-[11px] leading-relaxed p-[15mm]">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black">Your Workshop</h1>
          <p className="text-[10px] text-gray-500 mt-1">
            123 Workshop Street, Singapore 123456<br />
            Tel: +65 6123 4567 · workshop@example.com
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold tracking-tight text-black">INVOICE</p>
          <table className="text-[10px] text-right ml-auto mt-1">
            <tbody>
              <tr>
                <td className="pr-3 text-gray-500">Invoice #</td>
                <td className="font-mono font-semibold">{invoiceNumber}</td>
              </tr>
              <tr>
                <td className="pr-3 text-gray-500">Date</td>
                <td className="font-semibold">{formattedDate}</td>
              </tr>
              {serviceTypes.length > 0 && (
                <tr>
                  <td className="pr-3 text-gray-500">Service</td>
                  <td className="font-semibold">{serviceTypes.join(", ")}</td>
                </tr>
              )}
              {technician && (
                <tr>
                  <td className="pr-3 text-gray-500">Technician</td>
                  <td className="font-semibold">{technician}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bill To + Vehicle */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        {(customerName || phone || email) && (
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Bill To</p>
            {customerName && <p className="font-semibold text-sm text-black">{customerName}</p>}
            {phone && <p className="text-gray-600">{phone}</p>}
            {email && <p className="text-gray-600">{email}</p>}
          </div>
        )}
        {vehicle && (
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Vehicle</p>
            <p className="font-mono font-semibold text-sm text-black">{vehicle.plateNumber}</p>
            {(vehicle.make || vehicle.model) && (
              <p className="text-gray-600">
                {[vehicle.make, vehicle.model].filter(Boolean).join(" ")}
                {vehicle.vehicleType && ` · ${vehicle.vehicleType}`}
              </p>
            )}
            {vehicle.vin && <p className="text-gray-600 font-mono text-[10px]">VIN: {vehicle.vin}</p>}
            {odometer && <p className="text-gray-600">Odometer: {Number(odometer).toLocaleString()} km</p>}
          </div>
        )}
      </div>

      {/* Line Items Table */}
      {(parts.length > 0 || labour.length > 0) && (
        <table className="w-full border-collapse mb-6">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="text-left py-2 font-bold text-[10px] uppercase tracking-wider text-gray-500">Description</th>
              <th className="text-center py-2 font-bold text-[10px] uppercase tracking-wider text-gray-500 w-16">Qty</th>
              <th className="text-right py-2 font-bold text-[10px] uppercase tracking-wider text-gray-500 w-24">Unit Price</th>
              <th className="text-right py-2 font-bold text-[10px] uppercase tracking-wider text-gray-500 w-24">Total</th>
            </tr>
          </thead>
          <tbody>
            {parts.length > 0 && (
              <>
                <tr>
                  <td colSpan={4} className="pt-3 pb-1 text-[9px] font-bold uppercase tracking-widest text-gray-400">
                    Parts & Materials
                  </td>
                </tr>
                {parts.map((p, i) => (
                  <tr key={`p-${i}`} className="border-b border-gray-200">
                    <td className="py-1.5">
                      {p.name}
                      <span className="text-gray-400 ml-2 text-[10px]">({p.sku})</span>
                    </td>
                    <td className="text-center py-1.5">{p.quantity}</td>
                    <td className="text-right py-1.5">${p.unitPrice.toFixed(2)}</td>
                    <td className="text-right py-1.5 font-semibold">${(p.quantity * p.unitPrice).toFixed(2)}</td>
                  </tr>
                ))}
              </>
            )}
            {labour.length > 0 && (
              <>
                <tr>
                  <td colSpan={4} className="pt-3 pb-1 text-[9px] font-bold uppercase tracking-widest text-gray-400">
                    Labour & Services
                  </td>
                </tr>
                {labour.filter(l => l.description).map((l, i) => {
                  const total = l.pricingMode === "flat" ? l.rate : l.hours * l.rate;
                  const qtyLabel = l.pricingMode === "flat" ? "1" : `${l.hours}h`;
                  const rateLabel = l.pricingMode === "flat" ? `$${l.rate.toFixed(2)}` : `$${l.rate.toFixed(2)}/hr`;
                  return (
                    <tr key={`l-${i}`} className="border-b border-gray-200">
                      <td className="py-1.5">{l.description}</td>
                      <td className="text-center py-1.5">{qtyLabel}</td>
                      <td className="text-right py-1.5">{rateLabel}</td>
                      <td className="text-right py-1.5 font-semibold">${total.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </>
            )}
          </tbody>
        </table>
      )}

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between py-1 text-gray-600">
            <span>Parts Subtotal</span>
            <span>${partsTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1 text-gray-600">
            <span>Labour Subtotal</span>
            <span>${labourTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1 border-t border-gray-300 mt-1 pt-1 font-semibold text-black">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {hasDiscount && (
            <div className="flex justify-between py-1 text-gray-600">
              <span>Discount {discountMode === "percent" ? `(${discountRaw}%)` : ""}</span>
              <span>-${discountValue.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between py-2 border-t-2 border-black mt-1 pt-2 font-bold text-base text-black">
            <span>Total Due</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {remarks && (
        <div className="border-t border-gray-200 pt-4 mb-6">
          <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Notes</p>
          <p className="text-gray-600 whitespace-pre-line">{remarks}</p>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-300 pt-4 text-center text-[10px] text-gray-400">
        <p className="font-medium text-gray-500">Thank you for your business</p>
        <p className="mt-1">This is a computer-generated invoice. No signature is required.</p>
      </div>
    </div>
  );
}
