import { useState, useEffect } from 'react'

interface Settings {
  adminName: string
  defaultShell: string
  terminalFontSize: number
  clearChatOnExit: boolean
}

interface SettingsPanelProps {
  onSettingsChange?: (settings: Settings) => void
}

export default function SettingsPanel({ onSettingsChange }: SettingsPanelProps) {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    window.kagora.getSettings().then(setSettings)
  }, [])

  const handleSave = async () => {
    if (!settings) return
    const updated = await window.kagora.updateSettings(settings)
    setSettings(updated)
    onSettingsChange?.(updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!settings) return null

  return (
    <div className="settings-panel">
      <div className="settings-header">Settings</div>
      <div className="settings-body">
        <div className="settings-section">
          <h4>General</h4>
          <label className="settings-field">
            <span>Admin Name</span>
            <input
              value={settings.adminName}
              onChange={e => setSettings({ ...settings, adminName: e.target.value })}
              placeholder="Your display name in chat"
            />
          </label>
          <label className="settings-field">
            <span>Default Shell</span>
            <input
              value={settings.defaultShell}
              onChange={e => setSettings({ ...settings, defaultShell: e.target.value })}
              placeholder="Leave empty for default (Git Bash)"
            />
          </label>
        </div>

        <div className="settings-section">
          <h4>Terminal</h4>
          <label className="settings-field">
            <span>Font Size</span>
            <div className="settings-range-row">
              <input
                type="range"
                min={10}
                max={24}
                value={settings.terminalFontSize}
                onChange={e => setSettings({ ...settings, terminalFontSize: Number(e.target.value) })}
              />
              <span className="settings-range-value">{settings.terminalFontSize}px</span>
            </div>
          </label>
        </div>

        <div className="settings-section">
          <h4>Chat</h4>
          <label className="settings-field toggle">
            <span>Clear chat history on exit</span>
            <button
              className={`toggle-btn ${settings.clearChatOnExit ? 'on' : ''}`}
              onClick={() => setSettings({ ...settings, clearChatOnExit: !settings.clearChatOnExit })}
            >
              <span className="toggle-knob" />
            </button>
          </label>
        </div>

        <div className="settings-actions">
          <button className="primary" onClick={handleSave}>
            {saved ? 'Saved!' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
