import { supabase } from '../config/supabaseClient';

export const exportAllData = async () => {
    try {
        const tables = [
            'customers', 'items', 'invoices', 'invoice_items',
            'organization_profile', 'coolie_settings', 'coolie_customers', 'coolie_bills'
        ];
        const exportData = {
            export_date: new Date().toISOString(),
            app: 'Elvan Niril',
            data: {}
        };

        for (const table of tables) {
            const { data, error } = await supabase.from(table).select('*');
            if (error) {
                console.warn(`Skipping table ${table}:`, error.message);
                exportData.data[table] = { error: error.message };
            } else {
                exportData.data[table] = data;
            }
        }

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        
        const dateStr = new Date().toISOString().split('T')[0];
        link.download = `elvan_niril_full_backup_${dateStr}.json`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        return { success: true };
    } catch (error) {
        console.error('Export failed:', error);
        return { success: false, error: error.message };
    }
};
