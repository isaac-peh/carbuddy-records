export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  isActive: boolean;
  linkedItemsCount: number;
  totalPurchased: number;
}

export const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'AutoParts Asia Sdn Bhd',
    contactPerson: 'Richard Tan',
    email: 'richard.tan@autopartsasia.com.my',
    phone: '+60 3-2162 8888',
    address: '15, Jalan Industri USJ 1/9, 47600 Subang Jaya, Selangor',
    notes: 'Main supplier for Japanese car parts. Net 30 payment terms.',
    isActive: true,
    linkedItemsCount: 12,
    totalPurchased: 45280
  },
  {
    id: '2',
    name: 'SG Lubricants Direct',
    contactPerson: 'Michelle Wong',
    email: 'michelle@sglubricants.sg',
    phone: '+65 6234 5678',
    address: '123 Tuas South Avenue 3, Singapore 637084',
    notes: 'Bulk oil supplier. Weekly delivery schedule on Tuesdays.',
    isActive: true,
    linkedItemsCount: 8,
    totalPurchased: 32150
  },
  {
    id: '3',
    name: 'Continental Tyres Distributor',
    contactPerson: 'Ahmad Rahman',
    email: 'ahmad@contidist.com.my',
    phone: '+60 12-345 6789',
    address: '88, Jalan Ampang, 50450 Kuala Lumpur',
    notes: 'Authorized Continental dealer. 10% trade discount on bulk orders.',
    isActive: true,
    linkedItemsCount: 6,
    totalPurchased: 28900
  },
  {
    id: '4',
    name: 'Bosch Authorised Distributor SG',
    contactPerson: 'David Lee',
    email: 'david.lee@boschsg.com',
    phone: '+65 6891 2345',
    address: '456 Jurong East Street 31, Singapore 609517',
    notes: 'Premium parts supplier. Same-day delivery for urgent orders.',
    isActive: true,
    linkedItemsCount: 15,
    totalPurchased: 52700
  },
  {
    id: '5',
    name: 'Universal Auto Tools Supply',
    contactPerson: 'Sarah Lim',
    email: 'sarah@uatools.com',
    phone: '+60 17-888 9999',
    address: '99, Jalan Puchong, 47100 Puchong, Selangor',
    notes: 'Tools and equipment supplier. Annual maintenance contracts available.',
    isActive: true,
    linkedItemsCount: 9,
    totalPurchased: 18650
  },
  {
    id: '6',
    name: 'European Car Specialists',
    contactPerson: 'Hans Mueller',
    email: 'hans@eurospec.com.my',
    phone: '+60 3-7956 4433',
    address: '23A, Jalan SS2/75, 47300 Petaling Jaya, Selangor',
    notes: 'Specializes in BMW, Mercedes, Audi parts. Import lead time 2-3 weeks.',
    isActive: false,
    linkedItemsCount: 4,
    totalPurchased: 15200
  },
  {
    id: '7',
    name: 'Genuine Parts Warehouse',
    contactPerson: 'Jennifer Ng',
    email: 'jennifer@gpwarehouse.sg',
    phone: '+65 6445 7788',
    address: '678 Woodlands Industrial Park E5, Singapore 757848',
    notes: 'OEM parts supplier. Credit terms: 45 days.',
    isActive: true,
    linkedItemsCount: 11,
    totalPurchased: 39400
  },
  {
    id: '8',
    name: 'Budget Auto Supply Co',
    contactPerson: 'Robert Chen',
    email: 'robert@budgetauto.my',
    phone: '+60 16-222 3333',
    address: '12, Jalan Kenari 19A, Bandar Puchong Jaya, 47100 Puchong',
    notes: 'Aftermarket parts supplier. Cash on delivery only.',
    isActive: false,
    linkedItemsCount: 3,
    totalPurchased: 8900
  }
];