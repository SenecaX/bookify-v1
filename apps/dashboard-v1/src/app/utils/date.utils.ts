// utils.ts (example file)
export const formatAddress = (address: { street: string, city: string, zip: string, country: string } | undefined) => {
    if (!address) return 'N/A'; // Handle case where address is undefined
    const { street, city, zip, country } = address;
    return [street, city, zip, country].filter(Boolean).join(', '); // Join parts with commas, ignoring empty values
  };
  