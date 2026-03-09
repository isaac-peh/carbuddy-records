import { mockInvoices } from './invoicesData';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalVisits: number;
  totalSpent: number;
  outstandingBalance: number;
  firstVisitDate: string;
  lastVisitDate: string;
  vehicles: {
    plate: string;
    make: string;
    model: string;
    year: string;
    type: string;
    visitCount: number;
    lastServiceDate: string;
  }[];
  invoiceHistory: string[];
  loyaltyStatus: 'VIP' | 'Regular' | 'New';
  notes?: string;
}

function aggregateCustomers(): Customer[] {
  const customerMap = new Map<string, Customer>();

  // Group invoices by customer name
  mockInvoices.forEach(invoice => {
    const key = invoice.customer;
    
    if (!customerMap.has(key)) {
      const vehicles = mockInvoices
        .filter(inv => inv.customer === key)
        .map(inv => {
          const [make, model, year] = inv.vehicle.split(' ');
          return {
            plate: inv.plateNumber,
            make,
            model: model || '',
            year: year || '',
            type: inv.vehicleType,
            visitCount: 0,
            lastServiceDate: inv.date
          };
        });

      // Remove duplicates and count visits per vehicle
      const uniqueVehicles = vehicles.reduce((acc, vehicle) => {
        const existing = acc.find(v => v.plate === vehicle.plate);
        if (existing) {
          existing.visitCount++;
          if (new Date(vehicle.lastServiceDate) > new Date(existing.lastServiceDate)) {
            existing.lastServiceDate = vehicle.lastServiceDate;
          }
        } else {
          acc.push({ ...vehicle, visitCount: 1 });
        }
        return acc;
      }, [] as typeof vehicles);

      customerMap.set(key, {
        id: key.toLowerCase().replace(/\s+/g, '-'),
        name: key,
        email: invoice.email,
        phone: invoice.phone,
        totalVisits: 0,
        totalSpent: 0,
        outstandingBalance: 0,
        firstVisitDate: invoice.date,
        lastVisitDate: invoice.date,
        vehicles: uniqueVehicles,
        invoiceHistory: [],
        loyaltyStatus: 'New',
        notes: undefined
      });
    }

    const customer = customerMap.get(key)!;
    customer.totalVisits++;
    customer.totalSpent += invoice.grandTotal;
    customer.invoiceHistory.push(invoice.id);

    // Calculate outstanding balance
    if (invoice.status === 'Pending' || invoice.status === 'Overdue') {
      customer.outstandingBalance += invoice.grandTotal;
    }

    // Update date ranges
    if (new Date(invoice.date) < new Date(customer.firstVisitDate)) {
      customer.firstVisitDate = invoice.date;
    }
    if (new Date(invoice.date) > new Date(customer.lastVisitDate)) {
      customer.lastVisitDate = invoice.date;
    }
  });

  // Calculate loyalty status and add sample notes
  const customers = Array.from(customerMap.values()).map(customer => {
    if (customer.totalSpent > 1000) {
      customer.loyaltyStatus = 'VIP';
    } else if (customer.totalVisits >= 3) {
      customer.loyaltyStatus = 'Regular';
    }

    // Add sample notes for specific customers
    if (customer.name === 'David Ng') {
      customer.notes = 'Prefers BMW OEM parts only. Always schedules appointments in advance.';
    } else if (customer.name === 'Sarah Lim') {
      customer.notes = 'Fleet manager for company vehicles. Bulk discount applied.';
    }

    return customer;
  });

  return customers.sort((a, b) => b.totalSpent - a.totalSpent);
}

export const mockCustomers = aggregateCustomers();