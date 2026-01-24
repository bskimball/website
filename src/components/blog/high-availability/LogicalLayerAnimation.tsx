import { useState, useEffect } from 'react'
import {
  User,
  Globe,
  Server,
  Database,
  AlertCircle,
  XCircle,
} from 'lucide-react'

const LogicalLayerAnimation = () => {
  const [stepIndex, setStepIndex] = useState(0)
  // Cycle: OK -> A_DOWN -> OK -> B_DOWN
  const steps = ['ALL_OK', 'APP_A_DOWN', 'ALL_OK', 'APP_B_DOWN'] as const
  const status = steps[stepIndex]

  // Automatically cycle status every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full my-8 border border-primary/20 bg-card/50 rounded-lg overflow-hidden relative font-mono text-xs select-none">
      {/* Header Annotation */}
      <div className="absolute top-0 left-0 p-2 text-[10px] text-muted-foreground tracking-widest border-b border-r border-primary/10 rounded-br-lg bg-background/80 backdrop-blur-sm z-10">
        FIG 3.2 // LOGICAL FLOW
      </div>

      <div className="p-8 pt-16 flex flex-col items-center gap-12 relative min-h-[400px]">
        {/* The Flow Visualization */}
        <div className="w-full max-w-3xl relative grid grid-cols-4 items-center z-10 min-h-[200px]">
          {/* SVG Connection Layer - Spans the entire grid */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible -z-10"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* 1. User (12.5%, 50%) -> NET (37.5%, 50%) */}
            <line
              x1="12.5"
              y1="50"
              x2="37.5"
              y2="50"
              stroke="currentColor"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              className="text-muted-foreground/20"
            />
            {/* Animated Flow Segment for User -> NET */}
            <line
              x1="12.5"
              y1="50"
              x2="37.5"
              y2="50"
              stroke="var(--color-primary)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              strokeDasharray="4 4"
              className="opacity-50 animate-dash"
            />

            {/* 2. NET (37.5, 50) -> APP A (62.5, 25) */}
            <path
              d="M 37.5 50 C 50 50, 50 25, 62.5 25"
              fill="none"
              stroke="currentColor"
              vectorEffect="non-scaling-stroke"
              className="text-muted-foreground/20"
            />
            <path
              d="M 37.5 50 C 50 50, 50 25, 62.5 25"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              strokeDasharray="4 4"
              className={`transition-all duration-500 text-green-500 ${status !== 'APP_A_DOWN' ? 'animate-dash opacity-100' : 'opacity-0'}`}
            />

            {/* 3. NET (37.5, 50) -> APP B (62.5, 75) */}
            <path
              d="M 37.5 50 C 50 50, 50 75, 62.5 75"
              fill="none"
              stroke="currentColor"
              vectorEffect="non-scaling-stroke"
              className="text-muted-foreground/20"
            />
            <path
              d="M 37.5 50 C 50 50, 50 75, 62.5 75"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              strokeDasharray="4 4"
              className={`transition-all duration-500 text-blue-500 ${status !== 'APP_B_DOWN' ? 'animate-dash opacity-100' : 'opacity-0'}`}
            />

            {/* 4. APP A (62.5, 25) -> DB (87.5, 50) */}
            <path
              d="M 62.5 25 C 75 25, 75 50, 87.5 50"
              fill="none"
              stroke="currentColor"
              vectorEffect="non-scaling-stroke"
              className="text-muted-foreground/20"
            />
            <path
              d="M 62.5 25 C 75 25, 75 50, 87.5 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              strokeDasharray="4 4"
              className={`transition-all duration-500 text-green-500 ${status !== 'APP_A_DOWN' ? 'animate-dash opacity-100' : 'opacity-0'}`}
            />

            {/* 5. APP B (62.5, 75) -> DB (87.5, 50) */}
            <path
              d="M 62.5 75 C 75 75, 75 50, 87.5 50"
              fill="none"
              stroke="currentColor"
              vectorEffect="non-scaling-stroke"
              className="text-muted-foreground/20"
            />
            <path
              d="M 62.5 75 C 75 75, 75 50, 87.5 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              strokeDasharray="4 4"
              className={`transition-all duration-500 text-blue-500 ${status !== 'APP_B_DOWN' ? 'animate-dash opacity-100' : 'opacity-0'}`}
            />
          </svg>

          {/* 1. User (Col 1 - Center 12.5%) */}
          <div className="flex flex-col items-center gap-2 justify-self-center z-20 bg-background">
            <div className="w-12 h-12 rounded-full border border-primary bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <span className="text-muted-foreground font-bold">USER</span>
          </div>

          {/* Connection: User -> NET_00 */}
          {/* REMOVED: Replaced by SVG line above */}

          {/* 2. NET_00 (Col 2 - Center 37.5%) */}
          <div className="flex flex-col items-center gap-2 justify-self-center z-20 bg-background p-2 rounded-lg border border-border">
            <div className="w-12 h-12 rounded-lg border border-primary bg-primary/5 flex items-center justify-center">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <span className="text-muted-foreground font-bold">NET_00</span>
          </div>

          {/* Connection: NET_00 -> Apps */}
          {/* REMOVED: Replaced by SVG paths above */}

          {/* 3. App Servers (Col 3 - Center 62.5%) */}
          <div className="relative h-full w-full flex flex-col justify-between items-center py-4 z-20 min-h-[200px]">
            {/* APP 01 - Top (Aligns with 25% Y) */}
            <div className="absolute top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
              <div
                className={`
                relative flex items-center justify-center w-12 h-12 rounded-lg border transition-all duration-500 bg-background shadow-sm
                ${
                  status === 'APP_A_DOWN'
                    ? 'border-destructive/50 grayscale opacity-70'
                    : 'border-green-500/50'
                }
              `}
              >
                <Server
                  className={`w-6 h-6 ${status === 'APP_A_DOWN' ? 'text-destructive' : 'text-green-500'}`}
                />
                {status === 'APP_A_DOWN' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
                    <XCircle className="text-destructive w-8 h-8" />
                  </div>
                )}
              </div>
              <span className="text-[10px] font-bold">APP_01</span>
            </div>

            {/* APP 02 - Bottom (Aligns with 75% Y) */}
            <div className="absolute top-[75%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
              <div
                className={`
                relative flex items-center justify-center w-12 h-12 rounded-lg border transition-all duration-500 bg-background shadow-sm
                ${
                  status === 'APP_B_DOWN'
                    ? 'border-destructive/50 grayscale opacity-70'
                    : 'border-blue-500/50'
                }
              `}
              >
                <Server
                  className={`w-6 h-6 ${status === 'APP_B_DOWN' ? 'text-destructive' : 'text-blue-500'}`}
                />
                {status === 'APP_B_DOWN' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
                    <XCircle className="text-destructive w-8 h-8" />
                  </div>
                )}
              </div>
              <span className="text-[10px] font-bold">APP_02</span>
            </div>
          </div>

          {/* Connection: Apps -> DB */}
          {/* REMOVED: Replaced by SVG paths above */}

          {/* 4. Database (Col 4 - Center 87.5%) */}
          <div className="flex flex-col items-center gap-2 justify-self-center z-20 bg-background p-2 rounded-lg border border-border">
            <div className="w-12 h-12 rounded-lg border border-primary bg-primary/5 flex items-center justify-center">
              <Database className="w-6 h-6 text-primary" />
            </div>
            <span className="text-muted-foreground font-bold">SQL_CLUST</span>
            <div className="flex gap-1 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse delay-75"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse delay-150"></div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-3xl text-[10px] text-muted-foreground grid grid-cols-2 gap-4 border-t border-border pt-4">
          <div>
            <span className="font-bold block mb-1">
              STATUS:{' '}
              {status === 'ALL_OK' ? 'NORMAL_OPERATION' : 'FAILOVER_ACTIVE'}
            </span>
            <p>
              Traffic automatically routes to healthy nodes via VIP health
              checks.
            </p>
          </div>
          <div className="text-right">
            <span className="font-bold block mb-1">REDUNDANCY: N+1</span>
            <p>Capacity maintained during single node failure.</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes flow-right {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-flow-right {
          animation: flow-right 1.5s linear infinite;
        }
        @keyframes dash {
          to {
            stroke-dashoffset: -20;
          }
        }
        .animate-dash {
          animation: dash 1s linear infinite;
        }
        .animate-dash-fast {
          animation: dash 0.5s linear infinite;
        }
      `}</style>
    </div>
  )
}

export default LogicalLayerAnimation
