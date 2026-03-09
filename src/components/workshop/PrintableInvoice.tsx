import { format } from "date-fns";
import { createPortal } from "react-dom";

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
  let rowIndex = 0;

  return (
    <div
      className="print-invoice hidden print:block w-full max-w-[210mm] mx-auto bg-white text-black text-[11px] leading-relaxed p-[15mm]"
      style={{ fontFamily: "'system-ui', sans-serif" }}
    >
      {/* Top accent bar */}
      <div className="w-full h-[10px] bg-[#111827] rounded-t-sm -mt-[2mm] mb-6" />

      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#111827] tracking-tight">Your Workshop</h1>
          <p className="text-[10px] text-[#6B7280] mt-1 leading-snug">
            123 Workshop Street, Singapore 123456<br />
            Tel: +65 6123 4567 · workshop@example.com
          </p>
        </div>
        <div className="text-right">
          <span className="inline-block bg-[#111827] text-white px-4 py-1 rounded text-sm font-bold tracking-widest">
            INVOICE
          </span>
          <table className="text-[10px] text-right ml-auto mt-3">
            <tbody>
              <tr>
                <td className="pr-3 text-[#6B7280] py-0.5">Invoice #</td>
                <td className="font-mono font-semibold text-[#111827]">{invoiceNumber}</td>
              </tr>
              <tr>
                <td className="pr-3 text-[#6B7280] py-0.5">Date</td>
                <td className="font-semibold text-[#111827]">{formattedDate}</td>
              </tr>
              {serviceTypes.length > 0 && (
                <tr>
                  <td className="pr-3 text-[#6B7280] py-0.5">Service</td>
                  <td className="font-semibold text-[#111827]">{serviceTypes.join(", ")}</td>
                </tr>
              )}
              {technician && (
                <tr>
                  <td className="pr-3 text-[#6B7280] py-0.5">Technician</td>
                  <td className="font-semibold text-[#111827]">{technician}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bill To + Vehicle */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {(customerName || phone || email) && (
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4">
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#6B7280] mb-2">Bill To</p>
            {customerName && <p className="font-semibold text-sm text-[#111827]">{customerName}</p>}
            {phone && <p className="text-[#4B5563] text-[11px] mt-0.5">{phone}</p>}
            {email && <p className="text-[#4B5563] text-[11px] mt-0.5">{email}</p>}
          </div>
        )}
        {vehicle && (
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4">
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#6B7280] mb-2">Vehicle</p>
            <span className="inline-block border-2 border-[#111827] rounded px-2 py-0.5 font-mono font-bold text-sm text-[#111827]">
              {vehicle.plateNumber}
            </span>
            {(vehicle.make || vehicle.model) && (
              <p className="text-[#4B5563] text-[11px] mt-2">
                {[vehicle.make, vehicle.model].filter(Boolean).join(" ")}
                {vehicle.vehicleType && <span className="text-[#9CA3AF]"> · {vehicle.vehicleType}</span>}
              </p>
            )}
            {vehicle.vin && <p className="text-[#9CA3AF] font-mono text-[10px] mt-0.5">VIN: {vehicle.vin}</p>}
            {odometer && <p className="text-[#4B5563] text-[11px] mt-0.5">Odometer: {Number(odometer).toLocaleString()} km</p>}
          </div>
        )}
      </div>

      {/* Line Items Table */}
      {(parts.length > 0 || labour.length > 0) && (
        <table className="w-full border-collapse mb-8">
          <thead>
            <tr className="bg-[#111827]">
              <th className="text-left py-2.5 px-3 font-bold text-[9px] uppercase tracking-widest text-white">Description</th>
              <th className="text-center py-2.5 px-3 font-bold text-[9px] uppercase tracking-widest text-white w-16">Qty</th>
              <th className="text-right py-2.5 px-3 font-bold text-[9px] uppercase tracking-widest text-white w-24">Unit Price</th>
              <th className="text-right py-2.5 px-3 font-bold text-[9px] uppercase tracking-widest text-white w-24">Total</th>
            </tr>
          </thead>
          <tbody>
            {parts.length > 0 && (
              <>
                <tr>
                  <td colSpan={4} className="bg-[#F3F4F6] px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-[#6B7280]">
                    Parts &amp; Materials
                  </td>
                </tr>
                {parts.map((p, i) => {
                  const isEven = rowIndex % 2 === 0;
                  rowIndex++;
                  return (
                    <tr key={`p-${i}`} className={isEven ? "bg-white" : "bg-[#F9FAFB]"} style={{ borderBottom: "1px solid #E5E7EB" }}>
                      <td className="py-2 px-3 text-[11px] text-[#111827]">
                        {p.name}
                        <span className="text-[9px] text-[#9CA3AF] ml-1">({p.sku})</span>
                      </td>
                      <td className="text-center py-2 px-3 text-[11px] text-[#4B5563]">{p.quantity}</td>
                      <td className="text-right py-2 px-3 text-[11px] text-[#4B5563]">${p.unitPrice.toFixed(2)}</td>
                      <td className="text-right py-2 px-3 text-[11px] font-semibold text-[#111827]">${(p.quantity * p.unitPrice).toFixed(2)}</td>
                    </tr>
                  );
                })}
              </>
            )}
            {labour.length > 0 && (
              <>
                <tr>
                  <td colSpan={4} className="bg-[#F3F4F6] px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-[#6B7280]">
                    Labour &amp; Services
                  </td>
                </tr>
                {labour.filter(l => l.description).map((l, i) => {
                  const total = l.pricingMode === "flat" ? l.rate : l.hours * l.rate;
                  const qtyLabel = l.pricingMode === "flat" ? "1" : `${l.hours}h`;
                  const rateLabel = l.pricingMode === "flat" ? `$${l.rate.toFixed(2)}` : `$${l.rate.toFixed(2)}/hr`;
                  const isEven = rowIndex % 2 === 0;
                  rowIndex++;
                  return (
                    <tr key={`l-${i}`} className={isEven ? "bg-white" : "bg-[#F9FAFB]"} style={{ borderBottom: "1px solid #E5E7EB" }}>
                      <td className="py-2 px-3 text-[11px] text-[#111827]">{l.description}</td>
                      <td className="text-center py-2 px-3 text-[11px] text-[#4B5563]">{qtyLabel}</td>
                      <td className="text-right py-2 px-3 text-[11px] text-[#4B5563]">{rateLabel}</td>
                      <td className="text-right py-2 px-3 text-[11px] font-semibold text-[#111827]">${total.toFixed(2)}</td>
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
        <div className="w-72">
          <div className="flex justify-between py-1.5 text-[11px] text-[#6B7280]">
            <span>Parts Subtotal</span>
            <span>${partsTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1.5 text-[11px] text-[#6B7280]">
            <span>Labour Subtotal</span>
            <span>${labourTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1.5 text-[11px] font-medium text-[#111827]" style={{ borderTop: "1px solid #E5E7EB" }}>
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {hasDiscount && (
            <div className="flex justify-between py-1.5 text-[11px] text-[#059669]">
              <span>Discount {discountMode === "percent" ? `(${discountRaw}%)` : ""}</span>
              <span>-${discountValue.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between items-center bg-[#111827] text-white rounded px-4 py-3 mt-2">
            <span className="text-sm font-semibold">Total Due</span>
            <span className="text-2xl font-black">${grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {remarks && (
        <div className="mb-8">
          <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded p-3">
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#92400E] mb-1">Notes</p>
            <p className="text-[11px] text-[#78350F] whitespace-pre-line">{remarks}</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ borderTop: "2px solid #111827" }} className="pt-4">
        {/* Row 1 — sign-off */}
        <div className="flex justify-between items-center">
          <p className="font-semibold text-[11px] text-[#111827]">Thank you for your business.</p>
          <p className="text-[10px] text-[#9CA3AF]">This is a computer-generated invoice.</p>
        </div>
        {/* Row 2 — Powered by Mobilis */}
        <div className="mt-3 pt-3 text-center" style={{ borderTop: "1px solid #E5E7EB" }}>
          <p className="text-[9px] text-[#D1D5DB]">Powered by Mobilis · mobilis.com</p>
        </div>
      </div>
    </div>
  );
}
