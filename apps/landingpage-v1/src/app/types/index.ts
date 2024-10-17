export interface RegistrationFormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }
  

  interface Break {
    start: string; // Start time of the break (e.g., '12:00')
    end: string;   // End time of the break (e.g., '13:00')
  }
  
  interface WorkingHour {
    day: string;         // Day of the week (e.g., 'Monday')
    isDayOn: boolean;    // Whether the day is active
    start: string;       // Start time (e.g., '09:00')
    end: string;         // End time (e.g., '17:00')
    breaks?: Break[];    // Optional array of breaks
  }
  
  export interface CompanyRegistrationFormData {
    name: string;
    address: {
      street: string;
      city: string;
      zip: string;
      country: string;
    };
    category: string;
    workingHours: WorkingHour[]; // Updated to include working hours
  }
  