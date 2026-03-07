import { useState, useEffect } from 'react'

interface Automation {
  id: string
  name: string
  script: string
  target: string
  schedule: string
  method: 'chat' | 'inject'
  enabled: boolean
}

export default function AutomationsPanel() {
  const [automations, setAutomations] = useState<Automation[]>([])
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => {
    window.kagora.getAutomations().then(setAutomations)
  }, [])

  const handleAdd = async (auto: Omit<Automation, 'id'>) => {
    const created = await window.kagora.addAutomation(auto)
    setAutomations(prev => [...prev, created])
    setShowAdd(false)
  }

  const handleToggle = async (id: string, enabled: boolean) => {
    const updated = await window.kagora.updateAutomation(id, { enabled })
    setAutomations(updated)
  }

  const handleRemove = async (id: string) => {
    await window.kagora.removeAutomation(id)
    setAutomations(prev => prev.filter(a => a.id !== id))
  }

  return (
    <div className="settings-panel">
      <div className="settings-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Automations</span>
        <button className="auto-add-btn" onClick={() => setShowAdd(true)}>+ Add</button>
      </div>
      <div className="settings-body" style={{ maxWidth: '100%' }}>
        {automations.length === 0 && !showAdd && (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: 40 }}>
            No automations configured yet.
          </div>
        )}

        {showAdd && (
          <AddForm
            onAdd={handleAdd}
            onCancel={() => setShowAdd(false)}
          />
        )}

        <div className="auto-list">
          {automations.map(auto => (
            <div key={auto.id} className={`auto-card ${auto.enabled ? '' : 'disabled'}`}>
              <div className="auto-card-header">
                <div className="auto-card-title">
                  <span className={`auto-status ${auto.enabled ? 'on' : 'off'}`} />
                  <strong>{auto.name}</strong>
                </div>
                <div className="auto-card-actions">
                  <button
                    className="auto-toggle"
                    onClick={() => handleToggle(auto.id, !auto.enabled)}
                    title={auto.enabled ? 'Disable' : 'Enable'}
                  >
                    {auto.enabled ? 'ON' : 'OFF'}
                  </button>
                  <button
                    className="auto-remove"
                    onClick={() => handleRemove(auto.id)}
                    title="Remove"
                  >
                    x
                  </button>
                </div>
              </div>
              <div className="auto-card-body">
                <div className="auto-field">
                  <span className="auto-label">Script</span>
                  <span className="auto-value mono">{auto.script}</span>
                </div>
                <div className="auto-field">
                  <span className="auto-label">Target</span>
                  <span className="auto-value">{auto.target}</span>
                </div>
                <div className="auto-field">
                  <span className="auto-label">Schedule</span>
                  <span className="auto-value">{auto.schedule}</span>
                </div>
                <div className="auto-field">
                  <span className="auto-label">Method</span>
                  <span className="auto-value">
                    {auto.method === 'chat' ? 'Chat API' : 'Terminal Inject'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AddForm({ onAdd, onCancel }: {
  onAdd: (auto: Omit<Automation, 'id'>) => void
  onCancel: () => void
}) {
  const [name, setName] = useState('')
  const [script, setScript] = useState('')
  const [target, setTarget] = useState('')
  const [schedule, setSchedule] = useState('')
  const [method, setMethod] = useState<'chat' | 'inject'>('inject')

  const canSubmit = name && script && target && schedule

  return (
    <div className="auto-add-form">
      <h4>New Automation</h4>
      <input placeholder="Name (e.g. Heartbeat Check)" value={name} onChange={e => setName(e.target.value)} autoFocus />
      <input placeholder="Script path (e.g. ~/scripts/heartbeat.py)" value={script} onChange={e => setScript(e.target.value)} />
      <input placeholder="Target agent ID (e.g. shrimp)" value={target} onChange={e => setTarget(e.target.value)} />
      <input placeholder="Schedule (e.g. Every 3 hours)" value={schedule} onChange={e => setSchedule(e.target.value)} />
      <div className="auto-method-row">
        <label>
          <input type="radio" name="method" checked={method === 'inject'} onChange={() => setMethod('inject')} />
          Terminal Inject
        </label>
        <label>
          <input type="radio" name="method" checked={method === 'chat'} onChange={() => setMethod('chat')} />
          Chat API
        </label>
      </div>
      <div className="dialog-actions">
        <button onClick={onCancel}>Cancel</button>
        <button className="primary" disabled={!canSubmit} onClick={() => onAdd({ name, script, target, schedule, method, enabled: true })}>
          Add
        </button>
      </div>
    </div>
  )
}
