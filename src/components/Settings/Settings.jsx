import React, { useState } from 'react';
import {
    IconMoon,
    IconSun,
    IconAuto,
    IconUser,
    IconLock,
    IconDatabase,
    IconHelpCircle,
    IconLogout
} from '../common/Icons';
import { showSubtitles } from '../../config/translations';
import { exportAllData } from '../../utils/dataExport';
import './Settings.css';

/**
 * Settings Page - Optimized for Mobile
 */
function Settings({ language, setLanguage, theme, setTheme, onLogout, t }) {
    const showSubs = showSubtitles(language);
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        const result = await exportAllData();
        if (!result.success) {
            alert('Export failed: ' + result.error);
        }
        setIsExporting(false);
    };

    const Section = ({ title, icon: Icon, children, color }) => (
        <div className="settings-section">
            <div className="settings-section-header">
                <Icon size={20} color={color || "var(--color-primary)"} />
                <h3 style={{ color: color || 'inherit' }}>{title}</h3>
            </div>
            <div className="settings-section-content">
                {children}
            </div>
        </div>
    );

    const OptionRow = ({ label, description, action, badge }) => (
        <div className="option-row">
            <div className="option-info">
                <div className="option-label">
                    {label}
                </div>
                {description && <div className="option-description">{description}</div>}
            </div>
            <div className="option-actions">
                {badge && <span className="option-badge">{badge}</span>}
                {action}
            </div>
        </div>
    );

    return (
        <div className="settings-page">
            <h1>
                <span>{t?.settings}</span>
                {showSubs && <span style={{ fontSize: '14px', fontWeight: '400', opacity: 0.7 }}>Settings</span>}
            </h1>

            {/* Appearance Settings */}
            <Section
                title={
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                        <span>{t?.appearance}</span>
                        <span style={{ fontSize: '11px', opacity: 0.7, fontWeight: 'normal' }}>Appearance</span>
                    </div>
                }
                icon={IconSun}
            >
                <OptionRow
                    label={
                        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                            <span>{t?.theme}</span>
                            {showSubs && <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 'normal' }}>Theme</span>}
                        </div>
                    }
                    description="Choose your preferred visual theme"
                    action={
                        <div className="pref-toggle-group">
                            <button className={`pref-btn ${theme === 'light' ? 'active' : ''}`} onClick={() => setTheme('light')} title="Light"><IconSun size={18} /></button>
                            <button className={`pref-btn ${theme === 'dark' ? 'active' : ''}`} onClick={() => setTheme('dark')} title="Dark"><IconMoon size={18} /></button>
                            <button className={`pref-btn ${theme === 'auto' ? 'active' : ''}`} onClick={() => setTheme('auto')} title="System"><IconAuto size={18} /></button>
                        </div>
                    }
                />
                <OptionRow
                    label={
                        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                            <span>{t?.language}</span>
                            {showSubs && <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 'normal' }}>Language</span>}
                        </div>
                    }
                    description="Select your preferred language and subtitle mode"
                    action={
                        <div className="pref-toggle-group-grid">
                            <button className={`pref-btn lang-btn-text ${language === 'ta_mixed' ? 'active' : ''}`} onClick={() => setLanguage('ta_mixed')}>Tamil + English</button>
                            <button className={`pref-btn lang-btn-text ${language === 'ta_only' ? 'active' : ''}`} onClick={() => setLanguage('ta_only')}>Tamil</button>
                            <button className={`pref-btn lang-btn-text ${language === 'tg_mixed' ? 'active' : ''}`} onClick={() => setLanguage('tg_mixed')}>Tanglish</button>
                            <button className={`pref-btn lang-btn-text ${language === 'en_only' ? 'active' : ''}`} onClick={() => setLanguage('en_only')}>English</button>
                        </div>
                    }
                />
            </Section>

            {/* Account Settings (Placeholder) */}
            <Section
                title={
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                        <span>{t?.account}</span>
                        <span style={{ fontSize: '11px', opacity: 0.7, fontWeight: 'normal' }}>Account</span>
                    </div>
                }
                icon={IconUser}
            >
                <OptionRow
                    label={
                        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                            <span>{t?.profile}</span>
                            {showSubs && <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 'normal' }}>Profile</span>}
                        </div>
                    }
                    description={t?.profileDesc}
                    badge={t?.comingSoon}
                    action={<button className="pref-btn" disabled style={{ opacity: 0.5, width: 'auto', padding: '0 12px' }}>Manage</button>}
                />
                <OptionRow
                    label={
                        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                            <span>{t?.security}</span>
                            {showSubs && <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 'normal' }}>Security</span>}
                        </div>
                    }
                    description={t?.securityDesc}
                    badge={t?.comingSoon}
                    action={<button className="pref-btn" disabled style={{ opacity: 0.5, width: 'auto', padding: '0 12px' }}>Update</button>}
                />
            </Section>

            {/* Data Management (Placeholder) */}
            <Section
                title={
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                        <span>{t?.dataBackup}</span>
                        <span style={{ fontSize: '11px', opacity: 0.7, fontWeight: 'normal' }}>Data & Backup</span>
                    </div>
                }
                icon={IconDatabase}
            >
                <OptionRow
                    label={
                        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                            <span>{t?.exportData}</span>
                            {showSubs && <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 'normal' }}>Export Data</span>}
                        </div>
                    }
                    description={t?.exportDesc}
                    action={
                        <button 
                            className="pref-btn" 
                            onClick={handleExport}
                            disabled={isExporting} 
                            style={{ width: 'auto', padding: '0 12px' }}
                        >
                            {isExporting ? 'Exporting...' : 'Export'}
                        </button>
                    }
                />
                <OptionRow
                    label={
                        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                            <span>{t?.cloudSync}</span>
                            {showSubs && <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 'normal' }}>Cloud Sync</span>}
                        </div>
                    }
                    description={t?.syncDesc}
                    badge={t?.comingSoon}
                    action={<button className="pref-btn" disabled style={{ opacity: 0.5, width: 'auto', padding: '0 12px' }}>Sync</button>}
                />
            </Section>

            {/* Session - Logout */}
            <Section
                title={
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                        <span>{t?.session}</span>
                        <span style={{ fontSize: '11px', opacity: 0.7, fontWeight: 'normal' }}>Session</span>
                    </div>
                }
                icon={IconLogout}
                color="var(--color-danger)"
            >
                <OptionRow
                    label={
                        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                            <span style={{ color: 'var(--color-danger)', fontWeight: '600' }}>{t?.signOut}</span>
                            {showSubs && <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 'normal' }}>Sign Out</span>}
                        </div>
                    }
                    description={showSubs ? "End your current session / உங்கள் அமர்வை முடிக்கவும்" : "End your current session"}
                    action={
                        <button className="btn-logout" onClick={onLogout}>
                            <IconLogout size={18} />
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: '1.2' }}>
                                <span>{t?.signOut || 'வெளியேறு'}</span>
                                {showSubs && <span style={{ fontSize: '10px', opacity: 0.8, fontWeight: 'normal' }}>Logout</span>}
                            </div>
                        </button>
                    }
                />
            </Section>

            {/* About */}
            <Section
                title={
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                        <span>{t?.about}</span>
                        <span style={{ fontSize: '11px', opacity: 0.7, fontWeight: 'normal' }}>About</span>
                    </div>
                }
                icon={IconHelpCircle}
            >
                <div className="about-box">
                    <div className="about-app-name">{t?.appNameFull}</div>
                    <div style={{ fontSize: '0.9rem' }}>Version 1.0.0 (Beta)</div>
                    <div style={{ fontSize: '0.8rem', marginTop: '5px' }}>© 2026 PVS Silks</div>
                </div>
            </Section>

        </div>
    );
}

export default Settings;
