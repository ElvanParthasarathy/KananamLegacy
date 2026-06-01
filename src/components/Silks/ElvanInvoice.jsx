import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabaseClient';
import { IconPrinter, IconEdit, IconArrowLeft } from '../common/Icons';
import { numberToWords } from '../../utils/numberToWords';
import './elvan-invoice.css';

function ElvanInvoice({ data, onEdit, onBack }) {
    const [fullData, setFullData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [orgProfile, setOrgProfile] = useState(null);

    useEffect(() => {
        loadOrgProfile();
        if (data) {
            loadFullData(data);
        }
    }, [data]);

    async function loadOrgProfile() {
        const { data, error } = await supabase
            .from('organization_profile')
            .select('*')
            .limit(1)
            .single();
        if (data) {
            setOrgProfile(data);
        }
    }

    async function loadFullData(partialData) {
        setLoading(true);

        // Standardize Data Structure
        let standardized = { ...partialData };

        try {
            // 1. Map Keys if coming from DB row directly
            if (partialData.invoice_number && !partialData.billNo) {
                standardized.billNo = partialData.invoice_number;
            }
            if (partialData.sub_total && !partialData.subTotal) {
                standardized.subTotal = partialData.sub_total;
            }

            // 2. Fetch Full Customer Details if missing or incomplete
            if ((!partialData.customerDetails || !partialData.customerDetails.address_line1) && partialData.customer_id) {
                const { data: cust } = await supabase
                    .from('customers')
                    .select('*')
                    .eq('id', partialData.customer_id)
                    .single();

                if (cust) {
                    standardized.customerDetails = cust;
                }
            } else if (partialData.customers) {
                // If we have partial customer data from join, try to use it, but prefer fetch
                // (Already handled by above check if customer_id exists)
            }

            // 3. Fetch Items if missing
            if (!partialData.items || partialData.items.length === 0) {
                if (partialData.id) {
                    const { data: invItems } = await supabase
                        .from('invoice_items')
                        .select('*')
                        .eq('invoice_id', partialData.id);

                    if (invItems) {
                        standardized.items = invItems.map(item => ({
                            name: item.description,
                            quantity: item.quantity,
                            rate: item.rate,
                            amount: item.amount,
                            hsn: item.hsn_code || '5007'
                        }));
                    }
                }
            }

            setFullData(standardized);

        } catch (error) {
            console.error("Error loading invoice preview data:", error);
            // Fallback to partial data to show *something*
            setFullData(standardized);
        } finally {
            setLoading(false);
        }
    }


    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#eef2f5' }}>
                <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                    Loading Invoice...
                </div>
            </div>
        );
    }

    if (!fullData) return <div className="p-4">No Data Available</div>;

    const { billNo, date, customerDetails, items = [], subTotal = 0 } = fullData;

    // Tax Calculation from Org Profile (defaults to 2.5% each)
    const { cgst_rate = 2.5, sgst_rate = 2.5 } = orgProfile || {};
    const cgstAmount = subTotal * (parseFloat(cgst_rate) / 100);
    const sgstAmount = subTotal * (parseFloat(sgst_rate) / 100);
    const totalTax = cgstAmount + sgstAmount;

    // Exact total before rounding
    const exactTotal = subTotal + totalTax;
    // Final rounded amount
    const finalAmount = Math.round(exactTotal);
    // Round off difference
    const roundOff = finalAmount - exactTotal;

    const amountInWords = numberToWords(finalAmount);

    return (
        <div style={{ backgroundColor: '#eef2f5', minHeight: '100vh', padding: '20px' }}>
            {/* Toolbar */}
            <div className="no-print" style={{
                maxWidth: '210mm',
                margin: '0 auto 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'white',
                padding: '10px 20px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={onBack} title="Back" style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#555' }}>
                        <IconArrowLeft size={20} />
                    </button>
                    <span style={{ fontWeight: 600, color: '#333' }}>Invoice Preview (Elvan Kananam)</span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn btn-secondary" onClick={onEdit} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px' }}>
                        <IconEdit size={16} /> Edit
                    </button>
                    <button className="btn btn-primary" onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px' }}>
                        <IconPrinter size={16} /> Print
                    </button>
                </div>
            </div>

            {/* Invoice Component */}
            <div className="elvan-invoice-wrapper">

                {/* Vazhga Header */}
                <div className="elvan-top-motto">
                    <span>வாழ்க வையகம்!</span>
                    {/* Placeholder for Guru Image - user provided image had one, using placeholder/logo or just space if asset not available. 
                        User provided an uploaded image, we can try to use logo or just leave space. 
                        Ideally we'd have that specific image. For now, I'll center the logo or leave it blank as "Elvan Guru" asset isn't here. 
                        Wait, the logo in the image is separate. I will just keep the text for now.
                    */}
                    <span>வாழ்க வளமுடன்!</span>
                </div>

                <div className="elvan-content-border">
                    {/* Header */}
                    <div className="elvan-header">
                        <div className="elvan-logo-section" style={{ alignItems: 'center' }}>
                            {orgProfile?.logo ? (
                                <img src={orgProfile.logo} alt="Logo" className="elvan-logo" style={{ maxHeight: '140px', maxWidth: '140px', objectFit: 'contain' }} />
                            ) : (
                                <img src="/handloom-logo.png" alt="Sri Jaipriya Silks" className="elvan-logo" style={{ display: 'none' }} onError={(e) => e.target.style.display = 'none'} />
                            )}
                            <div className="elvan-company-details">
                                <h1>{orgProfile?.organization_name || 'Sri Jaipriya Silks'}</h1>
                                <h2>{orgProfile?.marketing_title || 'Handloom Silk Sarees & Rawsilk'}</h2>
                                <p>{orgProfile?.address_line1 || '6/606, First Street, Sivasakthi Nagar'}</p>
                                <p>{orgProfile?.city || 'Arani'} - {orgProfile?.pincode || '632317'}, {orgProfile?.state || 'Tamil Nadu'}</p>
                                <p>GSTIN: {orgProfile?.gstin || '33ASSPV0378E1ZD'}</p>
                                <p>{orgProfile?.phone || '8144604797, 9360779191'}</p>
                                <p><a href={orgProfile?.email ? `mailto:${orgProfile.email}` : "mailto:srijaipriyasilks@gmail.com"}>
                                    {orgProfile?.email || 'srijaipriyasilks@gmail.com'}
                                </a></p>
                            </div>
                        </div>
                        <div className="elvan-invoice-meta">
                            {/* Top right of header */}
                            <div className="elvan-tax-invoice-label">TAX INVOICE</div>

                            {/* Bottom right of header */}
                            <div className="elvan-invoice-number-large">
                                Invoice# <span>{billNo}</span>
                            </div>
                        </div>
                    </div>

                    {/* Info Strip */}
                    <div className="elvan-info-strip">
                        <div className="elvan-info-left">
                            <div className="elvan-info-row">
                                <span className="elvan-info-label">Invoice Date</span>
                                <span className="elvan-info-value">: {date ? date.split('-').reverse().join('/') : ''}</span>
                            </div>
                            <div className="elvan-info-row">
                                <span className="elvan-info-label">Terms</span>
                                <span className="elvan-info-value">: Due on Receipt</span>
                            </div>
                            <div className="elvan-info-row">
                                <span className="elvan-info-label">Due Date</span>
                                <span className="elvan-info-value">: {date ? date.split('-').reverse().join('/') : ''}</span>
                            </div>
                        </div>
                        <div className="elvan-info-right">
                            <div className="elvan-info-row">
                                <span className="elvan-info-label">Place of Supply</span>
                                <span className="elvan-info-value">: Tamil Nadu (33)</span>
                            </div>
                        </div>
                    </div>

                    {/* Bill To */}
                    <div className="elvan-bill-to-section">
                        <div className="elvan-bill-to-label">Bill To</div>
                        <div className="elvan-customer-name">{customerDetails?.company_name || customerDetails?.name || 'Unknown Merchant'}</div>
                        <div className="elvan-customer-address">
                            {customerDetails?.address_line1}, {customerDetails?.city ? customerDetails.city : ''}, {customerDetails?.pincode ? `PIN CODE ${customerDetails.pincode}` : ''}
                        </div>
                        <div className="elvan-customer-address">India</div>
                        {customerDetails?.gstin && <div className="elvan-customer-address">GSTIN {customerDetails.gstin}</div>}
                    </div>

                    {/* Item Table */}
                    <table className="elvan-items-table">
                        <thead>
                            <tr>
                                <th className="col-no">No.</th>
                                <th className="col-item">Items & Description</th>
                                <th className="col-qty">Quantity</th>
                                <th className="col-rate">Rate</th>
                                <th className="col-amount">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length > 0 ? items.map((item, index) => (
                                <tr key={index}>
                                    <td className="col-no">{index + 1}</td>
                                    <td className="col-item">
                                        <div className="item-main-name">{item.name?.split('/')[0]}</div>
                                        {/* Display Tamil name if available */}
                                        {item.name?.includes('/') && <div className="item-sub-desc">{item.name.split('/')[1]}</div>}
                                    </td>
                                    <td className="col-qty">{item.quantity !== undefined ? parseFloat(item.quantity).toFixed(2) : '0.00'}</td>
                                    <td className="col-rate">{item.rate !== undefined ? parseFloat(item.rate).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}</td>
                                    <td className="col-amount">{item.amount !== undefined ? parseFloat(item.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan="5" className="text-center p-4">No Items</td></tr>
                            )}
                        </tbody>
                    </table>

                    {/* Footer Grid (Totals left/right) */}
                    <div className="elvan-footer-grid">
                        <div className="elvan-footer-left">
                            <div>
                                <div style={{ fontSize: '13px', marginBottom: '5px' }}>Total Items: {items.reduce((sum, i) => sum + (parseFloat(i.quantity) || 0), 0).toFixed(2)}</div>
                                <div style={{ fontSize: '13px', marginBottom: '5px' }}>Total In Words</div>
                                <div className="elvan-total-words">
                                    Indian Rupee {amountInWords} Only
                                </div>
                            </div>

                            <div className="elvan-notes">
                                <h4>Notes</h4>
                                <p>Thanks for shopping with us! Visit Again!</p>
                            </div>
                        </div>

                        <div className="elvan-footer-right">
                            <div className="elvan-totals-row">
                                <span className="elvan-totals-label">Sub Total</span>
                                <span className="elvan-totals-value">{subTotal?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="elvan-totals-row">
                                <span className="elvan-totals-label">CGST ({orgProfile?.cgst_rate || '2.5'}%)</span>
                                <span className="elvan-totals-value">{cgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="elvan-totals-row">
                                <span className="elvan-totals-label">SGST ({orgProfile?.sgst_rate || '2.5'}%)</span>
                                <span className="elvan-totals-value">{sgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="elvan-totals-row">
                                <span className="elvan-totals-label elvan-total-final">Total</span>
                                <span className="elvan-totals-value elvan-total-final">₹{finalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="elvan-totals-row">
                                <span className="elvan-totals-label" style={{ border: 'none', color: '#00a651', fontWeight: 700 }}>Balance Due</span>
                                <span className="elvan-totals-value elvan-balance-due">₹{finalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                    </div>

                    {/* Signatures */}
                    <div className="elvan-signatures">
                        <div className="elvan-sig-block">
                            <div className="elvan-sig-title" style={{ marginTop: '0' }}>Buyer's Signature</div>
                            {/* Empty space above for signature */}
                        </div>

                        <div className="elvan-sig-block" style={{ textAlign: 'center' }}>
                            {/*  "VANITHASREE P" is in strict text on right side in image. */}
                        </div>

                        <div className="elvan-sig-block" style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '10px' }}>VANITHASREE P</div>
                            <div className="elvan-authorized">For {orgProfile?.organization_name || 'SRI JAIPRIYA SILKS'}</div>
                            {/* <div className="elvan-sig-title">Authorized Signature</div> - Image says "For SRI JAIPRIYA SILKS" then implies signature logic */}
                        </div>
                    </div>

                </div>

                {/* Branding Footer */}
                <div className="elvan-branding-footer">
                    Crafted with ease using <span style={{ fontWeight: 600, color: '#333' }}>Elvan Kananam</span>
                </div>
            </div>
        </div>
    );
}

export default ElvanInvoice;
