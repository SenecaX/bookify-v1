export interface Appointment {
    customerId: string;
    providerId: string;
    serviceId: string;
    dateTime: Date;
    endTime?: Date; 
    status: 'Booked' | 'Completed' | 'Cancelled';
    rescheduleHistory?: Array<{
      oldDateTime: Date;
      newDateTime: Date;
      rescheduleTimestamp: Date;
    }>;
    cancellationReason?: string;
    review?: {
      rating?: number;  // 1-5
      comment?: string;
    };
  }

  export interface BlockedTime {
    providerId: string;
    start: Date;
    end: Date;
    reason: string;
  }

  export const mockBlockedTimes: BlockedTime[] = [
    { providerId: 'provider1', start: new Date('2024-10-25T09:00:00'), end: new Date('2024-10-25T11:00:00'), reason: 'Personal Time' },
    { providerId: 'provider1', start: new Date('2024-10-26T14:00:00'), end: new Date('2024-10-26T15:00:00'), reason: 'Vacation' },
  ];

  export const mockCompanyData = {
    workingHours: [
      { day: 'Monday', isDayOn: true, start: '09:00', end: '17:00', breaks: [{ start: '12:00', end: '13:00' }] },
      { day: 'Tuesday', isDayOn: true, start: '09:00', end: '17:00', breaks: [{ start: '12:00', end: '13:00' }] },
      { day: 'Wednesday', isDayOn: true, start: '09:00', end: '17:00', breaks: [{ start: '12:00', end: '13:00' }] },
      { day: 'Thursday', isDayOn: true, start: '09:00', end: '17:00', breaks: [{ start: '12:00', end: '15:00' }] },
      { day: 'Friday', isDayOn: true, start: '09:00', end: '17:00', breaks: [{ start: '12:00', end: '13:00' }] },
      { day: 'Saturday', isDayOn: false, start: '09:00', end: '17:00', breaks: [{ start: '12:00', end: '13:00' }] },  // Off day
      { day: 'Sunday', isDayOn: false, start: '09:00', end: '14:00', breaks: [{ start: '12:00', end: '13:00' }] },  // Off day
    ],
    holidays: [
      { date: new Date('2024-12-25'), description: 'Christmas Day', category: 'national' },
      { date: new Date('2024-01-01'), description: 'New Year\'s Day', category: 'national' }
    ]
  };

  
  const mockAppointments: Appointment[] = [
    {
      customerId: 'customer1',
      providerId: 'provider1',
      serviceId: 'service1',
      dateTime: new Date('2024-10-15T09:00:00'),  // Start time
      endTime: new Date('2024-10-15T10:00:00'), // End time (1 hour duration)
      status: 'Booked',
    },
    {
      customerId: 'customer2',
      providerId: 'provider1',
      serviceId: 'service2',
      dateTime: new Date('2024-10-15T10:00:00'),  // Start time
      endTime: new Date('2024-10-15T11:00:00'), // End time (1 hour duration)
      status: 'Booked',
    },
    {
      customerId: 'customer3',
      providerId: 'provider1',
      serviceId: 'service1',
      dateTime: new Date('2024-10-15T11:30:00'),  // Start time
      endTime: new Date('2024-10-15T12:30:00'), // End time (1 hour duration)
      status: 'Booked',
    },
    {
      customerId: 'customer4',
      providerId: 'provider1',
      serviceId: 'service2',
      dateTime: new Date('2024-10-15T13:00:00'),  // Start time
      endTime: new Date('2024-10-15T14:00:00'), // End time (1 hour duration)
      status: 'Booked',
    },
    {
      customerId: 'customer5',
      providerId: 'provider1',
      serviceId: 'service1',
      dateTime: new Date('2024-10-15T14:30:00'),  // Start time
      endTime: new Date('2024-10-15T15:30:00'), // End time (1 hour duration)
      status: 'Booked',
    },
  
    {
      customerId: 'customer6',
      providerId: 'provider1',
      serviceId: 'service2',
      dateTime: new Date('2024-10-16T14:00:00'),  // Start time
      endTime: new Date('2024-10-16T15:00:00'), // End time (1 hour duration)
      status: 'Booked',
    },
    {
      customerId: 'customer7',
      providerId: 'provider1',
      serviceId: 'service2',
      dateTime: new Date('2024-10-17T09:00:00'),  // Start time
      endTime: new Date('2024-10-17T10:00:00'), // End time (1 hour duration)
      status: 'Booked',
    },
    {
      customerId: 'customer8',
      providerId: 'provider1',
      serviceId: 'service1',
      dateTime: new Date('2024-10-23T10:30:00'),  // Start time
      endTime: new Date('2024-10-23T11:30:00'), // End time (1 hour duration)
      status: 'Booked',
    },
    {
      customerId: 'customer9',
      providerId: 'provider1',
      serviceId: 'service1',
      dateTime: new Date('2024-10-25T09:30:00'),  // Start time
      endTime: new Date('2024-10-25T10:30:00'), // End time (1 hour duration)
      status: 'Cancelled',
      cancellationReason: 'Provider unavailable',
    },
    {
      customerId: 'customer10',
      providerId: 'provider1',
      serviceId: 'service2',
      dateTime: new Date('2024-10-26T10:00:00'),  // Start time
      endTime: new Date('2024-10-26T11:00:00'), // End time (1 hour duration)
      status: 'Booked',
    },
  ];
  
  
  export default mockAppointments;
  