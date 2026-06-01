/**
 * Default Data for Elvan Kananam
 * 
 * Pre-defined items and customers for quick selection
 */

// Default item names for billing
export const defaultItems = [
    { id: 1, name: 'ஒண்டி தடை செய்ய கூலி' },
    { id: 2, name: 'ஜரி தடை செய்ய கூலி' },
    { id: 3, name: 'மூன்று இழை சப்புரி செய்ய கூலி' },
];

// Default customers with their cities
export const defaultCustomers = [
    {
        id: 1,
        name: 'சுந்தரி சில்க்ஸ் இந்தியா',
        city: 'திருச்சேறை, கும்பகோணம்',
        displayName: 'சுந்தரி சில்க்ஸ் இந்தியா - திருச்சேறை'
    },
    {
        id: 2,
        name: 'சுந்தரி சில்க்ஸ் இந்தியா',
        city: 'முள்ளிப்பட்டு',
        displayName: 'சுந்தரி சில்க்ஸ் இந்தியா - முள்ளிப்பட்டு'
    },
];

export default { defaultItems, defaultCustomers };
