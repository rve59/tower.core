import { useState } from 'react'
import { Terminal, Play, Save, ChevronRight, Database, Code, Split, MessageSquare } from 'lucide-react'
import { WorkspaceArea } from '../layout/WorkspaceArea'
import { ContentPane } from '../layout/ContentPane'
import { ForensicDiscourse } from '../slots/ForensicDiscourse'

import { useWorkspaceStore } from '../../stores/workspace.store'

export function CypherSandboxView() {
  const { selectedFiling } = useWorkspaceStore()
  const [query, setQuery] = useState('MATCH (n:Transactions) WHERE n.price > 1000 RETURN n LIMIT 10')
  const [results, setResults] = useState<any[]>([])
  const [isExecuting, setIsExecuting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [queryStats, setQueryStats] = useState<{ durationMs?: number, totalProcessed?: number } | null>(null)
  
  // Discourse State
  const [showDiscourse, setShowDiscourse] = useState(true)
  const [isProcessingDiscourse, setIsProcessingDiscourse] = useState(false)
  const [discourseHistory, setDiscourseHistory] = useState<any[]>([
    {
      role: 'model',
      content: 'I have analyzed the current query context. Looking for transactions with price > 1000 across the selected filing.',
      timestamp: new Date().toISOString()
    }
  ])

  const handleExecute = async () => {
    if (!selectedFiling) {
      setError("Please select a filing from the sidebar first.")
      return
    }

    setIsExecuting(true)
    setError(null)
    setQueryStats(null)
    
    const startTime = performance.now()
    
    try {
      const response = await fetch(`/v1/validations/cypher/test?filing_id=${selectedFiling.id}&query=${encodeURIComponent(query)}`, {
        method: 'POST'
      })
      
      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.detail || 'Execution failed')
      }
      
      const data = await response.json()
      setResults(data.results || [])
      
      const endTime = performance.now()
      setQueryStats({ 
        durationMs: Math.round(endTime - startTime),
        totalProcessed: data.metadata?.total_processed || data.results?.length || 0
      })

      // Auto-update discourse with execution results
      if (data.results?.length > 0) {
        setDiscourseHistory(prev => [...prev, {
          role: 'model',
          content: `Executed query successfully. Found ${data.results.length} records matching the criteria. I am monitoring for authorization patterns.`,
          timestamp: new Date().toISOString()
        }])
      }
    } catch (err: any) {
      console.error("Cypher Execution Error:", err)
      setError(err.message)
    } finally {
      setIsExecuting(false)
    }
  }

  const handleSendMessage = async (message: string) => {
    setIsProcessingDiscourse(true)
    
    // Optimistic Update
    const userMsg = { role: 'user', content: message, timestamp: new Date().toISOString() };
    setDiscourseHistory(prev => [...prev, userMsg]);

    try {
      // In a real implementation, this would call the /v1/audit/discourse endpoint
      // For this demo, we simulate a response
      setTimeout(() => {
        const agentMsg = {
          role: 'model',
          content: `Analyzing "${message}" against the currently loaded filing ${selectedFiling?.id || 'Context'}. Based on the transaction data, I've identified a product mismatch in Rule F.25.18.`,
          timestamp: new Date().toISOString()
        };
        setDiscourseHistory(prev => [...prev, agentMsg]);
        setIsProcessingDiscourse(false);
      }, 1500);
    } catch (err) {
      setIsProcessingDiscourse(false);
    }
  }

  return (
    <div data-region="cypher-sandbox" className="flex flex-col flex-1 overflow-hidden h-full">
      <WorkspaceArea>
        <div className="flex flex-1 h-full overflow-hidden">
          {/* Main Workspace Area */}
          <div className="flex-1 flex flex-col h-full overflow-hidden border-r border-[#222]">
            <ContentPane>
              <div className="flex-1 flex flex-col gap-6 p-6 overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Cypher Rule Sandbox</h2>
                    <p className="text-sm text-[var(--color-text-secondary)]">Test FERC graph rules against the LadybugDB test environment.</p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setShowDiscourse(!showDiscourse)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        showDiscourse ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-[#1a1a1a] text-gray-400 border border-[#333]'
                      }`}
                    >
                      <MessageSquare size={16} />
                      {showDiscourse ? 'Hide Discourse' : 'Show Discourse'}
                    </button>
                    <button 
                      onClick={handleExecute}
                      disabled={isExecuting}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50 shadow-lg shadow-blue-900/20"
                    >
                      <Play size={16} />
                      {isExecuting ? 'Executing...' : 'Run Query'}
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[var(--color-panel-bg)] border border-[var(--color-border-subtle)] hover:bg-[var(--color-border-subtle)] text-[var(--color-text-primary)] rounded-md text-sm font-medium transition-colors">
                      <Save size={16} />
                      Promote
                    </button>
                  </div>
                </div>

                {/* Query Statistics */}
                {queryStats && (
                  <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] rounded-lg border border-blue-500/20">
                     <div className="flex items-center gap-4 text-sm">
                       <div className="flex flex-col">
                         <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Execution Time</span>
                         <span className="text-green-400 font-mono font-medium">
                           {(() => {
                             const ms = queryStats.durationMs || 0;
                             const m = Math.floor(ms / 60000);
                             const s = Math.floor((ms % 60000) / 1000);
                             const msec = ms % 1000;
                             return `${m}min ${s}sec ${msec}msec`;
                           })()}
                         </span>
                       </div>
                       <div className="w-px h-8 bg-[#30363d] mx-2"></div>
                       <div className="flex flex-col">
                         <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Rows Returned</span>
                         <span className="text-blue-400 font-mono font-medium">{results.length.toLocaleString()}</span>
                       </div>
                       <div className="w-px h-8 bg-[#30363d] mx-2"></div>
                       <div className="flex flex-col">
                         <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Rows Processed</span>
                         <span className="text-purple-400 font-mono font-medium">
                           {queryStats.totalProcessed?.toLocaleString() || '0'}
                         </span>
                       </div>
                     </div>
                     <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                       <Database size={14} className="text-blue-500" />
                       Ladybug Engine
                     </div>
                  </div>
                )}

                {/* Editor Area */}
                <div className="flex flex-col flex-none h-[300px] bg-[#0d1117] rounded-lg border border-[#30363d] overflow-hidden shadow-2xl">
                  <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      <Code size={14} className="text-blue-400" />
                      Cypher Sandbox Editor
                    </div>
                  </div>
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 bg-transparent p-4 font-mono text-sm text-blue-300 outline-none resize-none"
                    spellCheck={false}
                  />
                </div>

                {/* Results Area */}
                <div className="flex-1 flex flex-col min-h-[400px] bg-[#0d1117] rounded-lg border border-[#30363d] overflow-hidden">
                  <div className="flex items-center px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      <Terminal size={14} className="text-green-500" />
                      Execution Results
                    </div>
                  </div>
                  
                  {results.length > 0 ? (
                    <div className="flex-1 overflow-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#161b22] sticky top-0">
                          <tr>
                            {Object.keys(results[0]).map(key => (
                              <th key={key} className="px-4 py-2 font-bold text-gray-500 border-b border-[#30363d] uppercase tracking-wider">{key}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#30363d]">
                          {results.map((row, i) => (
                            <tr key={i} className="hover:bg-[#161b22] transition-colors">
                              {Object.values(row).map((val: any, j) => (
                                <td key={j} className="px-4 py-3 text-gray-300 font-mono">
                                  {typeof val === 'number' ? val.toLocaleString() : String(val)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-600 gap-3">
                      {error ? (
                        <div className="flex flex-col items-center gap-2 max-w-md text-center p-6">
                          <div className="text-red-500 font-bold uppercase tracking-widest text-[10px]">Execution Error</div>
                          <p className="text-xs text-red-400 bg-red-900/10 p-4 rounded-lg border border-red-500/20 font-mono">{error}</p>
                        </div>
                      ) : (
                        <>
                          <Database size={48} strokeWidth={1} className="opacity-20" />
                          <p className="text-sm font-medium opacity-50">Execute query to populate results.</p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </ContentPane>
          </div>

          {/* Right Side: Discourse Panel */}
          {showDiscourse && (
            <div className="w-[450px] flex-none h-full shadow-2xl">
              <ForensicDiscourse 
                ruleId="F.25.18" 
                discourse={discourseHistory}
                onSendMessage={handleSendMessage}
                isProcessing={isProcessingDiscourse}
              />
            </div>
          )}
        </div>
      </WorkspaceArea>
    </div>
  )
}
