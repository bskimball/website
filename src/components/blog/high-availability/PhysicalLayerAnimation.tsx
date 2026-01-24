import { useState, useEffect } from 'react'
import { Server, HardDrive, Router, ArrowDownUp, Activity } from 'lucide-react'

const PhysicalLayerAnimation = () => {
  const [activePath, setActivePath] = useState<'A' | 'B' | 'BOTH'>('BOTH')

  // Toggle paths every few seconds to simulate load balancing / failover testing
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePath((prev) =>
        prev === 'BOTH' ? 'A' : prev === 'A' ? 'B' : 'BOTH',
      )
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full my-8 border border-primary/20 bg-card/50 rounded-lg overflow-hidden relative font-mono text-xs">
      {/* Header Annotation */}
      <div className="absolute top-0 left-0 p-2 text-[10px] text-muted-foreground tracking-widest border-b border-r border-primary/10 rounded-br-lg bg-background/80 backdrop-blur-sm z-10">
        FIG 3.1 // PHYSICAL STACK
      </div>

      {/* Main Container */}
      <div className="p-8 pt-12 relative min-h-[400px] flex flex-col justify-between gap-8">
        {/* SVG Overlay for Cables */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-60">
          <defs>
            <marker
              id="dot-blue"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="4"
              markerHeight="4"
            >
              <circle cx="5" cy="5" r="5" className="fill-blue-500" />
            </marker>
            <marker
              id="dot-orange"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="4"
              markerHeight="4"
            >
              <circle cx="5" cy="5" r="5" className="fill-orange-500" />
            </marker>
            <marker
              id="arrow-start"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" className="fill-orange-500" />
            </marker>
            <marker
              id="arrow-end"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" className="fill-orange-500" />
            </marker>
            <marker
              id="arrow-start-yellow"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" className="fill-yellow-500" />
            </marker>
            <marker
              id="arrow-end-yellow"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" className="fill-yellow-500" />
            </marker>
          </defs>

          {/* Connection Lines Logic - Simplified for visual clarity */}
          {/* We draw lines between the centers of the implied grid cells */}

          {/* Switch to Proxy */}
          {/* Left Vertical - Blue */}
          <ConnectionLine
            x1="30%"
            y1="12%"
            x2="30%"
            y2="32%"
            active={activePath !== 'B'}
            color="text-blue-500"
          />
          {/* Right Vertical - Green */}
          <ConnectionLine
            x1="70%"
            y1="12%"
            x2="70%"
            y2="32%"
            active={activePath !== 'A'}
            color="text-green-500"
          />
          {/* Cross - Orange */}
          <ConnectionLine
            x1="30%"
            y1="12%"
            x2="70%"
            y2="32%"
            active={activePath !== 'B'}
            dashed
            color="text-orange-500"
          />
          <ConnectionLine
            x1="70%"
            y1="12%"
            x2="30%"
            y2="32%"
            active={activePath !== 'A'}
            dashed
            color="text-orange-500"
          />

          {/* Proxy to Compute */}
          {/* Left Vertical - Blue */}
          <ConnectionLine
            x1="30%"
            y1="32%"
            x2="30%"
            y2="52%"
            active={activePath !== 'B'}
            color="text-blue-500"
          />
          {/* Right Vertical - Green */}
          <ConnectionLine
            x1="70%"
            y1="32%"
            x2="70%"
            y2="52%"
            active={activePath !== 'A'}
            color="text-green-500"
          />
          {/* Cross - Orange */}
          <ConnectionLine
            x1="30%"
            y1="32%"
            x2="70%"
            y2="52%"
            active={activePath !== 'B'}
            dashed
            color="text-orange-500"
          />
          <ConnectionLine
            x1="70%"
            y1="32%"
            x2="30%"
            y2="52%"
            active={activePath !== 'A'}
            dashed
            color="text-orange-500"
          />

          {/* Compute to Storage */}
          {/* Left Vertical - Blue */}
          <ConnectionLine
            x1="30%"
            y1="52%"
            x2="30%"
            y2="72%"
            active={activePath !== 'B'}
            color="text-blue-500"
          />
          {/* Right Vertical - Green */}
          <ConnectionLine
            x1="70%"
            y1="52%"
            x2="70%"
            y2="72%"
            active={activePath !== 'A'}
            color="text-green-500"
          />
          {/* Cross - Orange */}
          <ConnectionLine
            x1="30%"
            y1="52%"
            x2="70%"
            y2="72%"
            active={activePath !== 'B'}
            dashed
            color="text-orange-500"
          />
          <ConnectionLine
            x1="70%"
            y1="52%"
            x2="30%"
            y2="72%"
            active={activePath !== 'A'}
            dashed
            color="text-orange-500"
          />

          {/* Storage to Disk Arrays */}
          {/* Left Vertical - Blue */}
          <ConnectionLine
            x1="30%"
            y1="72%"
            x2="30%"
            y2="90%"
            active={activePath !== 'B'}
            color="text-blue-500"
          />
          {/* Right Vertical - Green */}
          <ConnectionLine
            x1="70%"
            y1="72%"
            x2="70%"
            y2="90%"
            active={activePath !== 'A'}
            color="text-green-500"
          />

          {/* Storage Replication (Horizontal) - Yellow */}
          <ConnectionLine
            x1="30%"
            y1="90%"
            x2="70%"
            y2="90%"
            active={activePath === 'BOTH'}
            dashed
            color="text-yellow-500"
            arrow
            width="4"
          />

          {/* Proxy Sync (Horizontal) - Yellow */}
          <ConnectionLine
            x1="30%"
            y1="32%"
            x2="70%"
            y2="32%"
            active={activePath === 'BOTH'}
            dashed
            color="text-yellow-500"
            arrow
            width="4"
          />
        </svg>

        {/* Layer 1: Core Network */}
        <div className="flex justify-around items-center z-10 relative">
          <DeviceNode
            icon={<ArrowDownUp className="w-5 h-5" />}
            label="CORE_SW_A"
            active={activePath !== 'B'}
            color="text-blue-500"
            borderColor="border-blue-500"
            bgColor="bg-blue-500/10"
          />
          <div className="text-xs text-muted-foreground uppercase tracking-widest hidden sm:block">
            Network Layer
          </div>
          <DeviceNode
            icon={<ArrowDownUp className="w-5 h-5" />}
            label="CORE_SW_B"
            active={activePath !== 'A'}
            color="text-green-500"
            borderColor="border-green-500"
            bgColor="bg-green-500/10"
          />
        </div>

        {/* Layer 2: Proxies */}
        <div className="flex justify-around items-center z-10 relative">
          <DeviceNode
            icon={<Router className="w-5 h-5" />}
            label="PROXY_01"
            active={activePath !== 'B'}
            color="text-blue-500"
            borderColor="border-blue-500"
            bgColor="bg-blue-500/10"
          />
          <div className="text-xs text-muted-foreground uppercase tracking-widest hidden sm:block">
            Routing Layer
          </div>
          <DeviceNode
            icon={<Router className="w-5 h-5" />}
            label="PROXY_02"
            active={activePath !== 'A'}
            color="text-green-500"
            borderColor="border-green-500"
            bgColor="bg-green-500/10"
          />
        </div>

        {/* Layer 3: Compute */}
        <div className="flex justify-around items-center z-10 relative">
          <DeviceNode
            icon={<Server className="w-5 h-5" />}
            label="HOST_NODE_01"
            active={activePath !== 'B'}
            isCompute
            color="text-blue-500"
            borderColor="border-blue-500"
            bgColor="bg-blue-500/10"
          />
          <div className="text-xs text-muted-foreground uppercase tracking-widest hidden sm:block">
            Compute Cluster
          </div>
          <DeviceNode
            icon={<Server className="w-5 h-5" />}
            label="HOST_NODE_02"
            active={activePath !== 'A'}
            isCompute
            color="text-green-500"
            borderColor="border-green-500"
            bgColor="bg-green-500/10"
          />
        </div>

        {/* Layer 4: SAN Switches */}
        <div className="flex justify-around items-center z-10 relative">
          <DeviceNode
            icon={<Activity className="w-5 h-5" />}
            label="SAN_SW_A"
            active={activePath !== 'B'}
            color="text-blue-500"
            borderColor="border-blue-500"
            bgColor="bg-blue-500/10"
          />
          <div className="text-xs text-muted-foreground uppercase tracking-widest hidden sm:block">
            Fabric Layer
          </div>
          <DeviceNode
            icon={<Activity className="w-5 h-5" />}
            label="SAN_SW_B"
            active={activePath !== 'A'}
            color="text-green-500"
            borderColor="border-green-500"
            bgColor="bg-green-500/10"
          />
        </div>

        {/* Layer 5: Storage Arrays */}
        <div className="flex justify-around items-center z-10 relative">
          <DeviceNode
            icon={<HardDrive className="w-5 h-5" />}
            label="ARRAY_01"
            active={activePath !== 'B'}
            color="text-blue-500"
            borderColor="border-blue-500"
            bgColor="bg-blue-500/10"
          />
          <div className="text-xs text-muted-foreground uppercase tracking-widest hidden sm:block">
            Storage Layer
          </div>
          <DeviceNode
            icon={<HardDrive className="w-5 h-5" />}
            label="ARRAY_02"
            active={activePath !== 'A'}
            color="text-green-500"
            borderColor="border-green-500"
            bgColor="bg-green-500/10"
          />
        </div>
      </div>

      {/* Legend / Status */}
      <div className="absolute bottom-2 right-2 flex gap-4 text-[10px] text-muted-foreground bg-background/80 p-1 px-2 rounded border border-primary/10">
        <div className="flex items-center gap-1">
          <div
            className={`w-2 h-2 rounded-full ${activePath !== 'B' ? 'bg-blue-500 animate-pulse' : 'bg-muted'}`}
          ></div>
          SIDE A
        </div>
        <div className="flex items-center gap-1">
          <div
            className={`w-2 h-2 rounded-full ${activePath !== 'A' ? 'bg-green-500 animate-pulse' : 'bg-muted'}`}
          ></div>
          SIDE B
        </div>
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full bg-orange-500`}></div>
          CROSS-CONNECT
        </div>
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full bg-yellow-500`}></div>
          REPLICATION
        </div>
      </div>
    </div>
  )
}

const DeviceNode = ({
  icon,
  label,
  active,
  isCompute = false,
  color = 'text-primary',
  borderColor = 'border-primary',
  bgColor = 'bg-primary/10',
}: {
  icon: React.ReactNode
  label: string
  active: boolean
  isCompute?: boolean
  color?: string
  borderColor?: string
  bgColor?: string
}) => {
  return (
    <div
      className={`
      relative flex flex-col items-center gap-2 p-3 rounded-md border transition-all duration-500 z-20 bg-background
      ${
        active
          ? `${borderColor} shadow-[0_0_15px_-3px_currentColor] ${color}`
          : 'border-muted-foreground/20 text-muted-foreground opacity-50 grayscale'
      }
    `}
    >
      <div
        className={`
        p-2 rounded-full border transition-all duration-500
        ${active ? `${borderColor} ${bgColor}` : 'border-muted bg-muted/10'}
      `}
      >
        {icon}
      </div>
      <span className="text-[10px] tracking-widest font-bold">{label}</span>
      {isCompute && active && (
        <div
          className={`absolute -top-1 -right-1 w-2 h-2 rounded-full animate-ping bg-current`}
        />
      )}
    </div>
  )
}

const ConnectionLine = ({
  x1,
  y1,
  x2,
  y2,
  active,
  dashed = false,
  color = 'text-primary',
  arrow = false,
  width = '2',
}: {
  x1: string
  y1: string
  x2: string
  y2: string
  active: boolean
  dashed?: boolean
  color?: string
  arrow?: boolean
  width?: string
}) => {
  const isYellow = color.includes('yellow')
  const startMarker = isYellow
    ? 'url(#arrow-start-yellow)'
    : 'url(#arrow-start)'
  const endMarker = isYellow ? 'url(#arrow-end-yellow)' : 'url(#arrow-end)'

  return (
    <>
      {/* Background Line */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="currentColor"
        strokeWidth="1"
        className="text-muted-foreground/20"
        strokeDasharray={dashed ? '4 4' : ''}
        markerStart={arrow ? startMarker : undefined}
        markerEnd={arrow ? endMarker : undefined}
      />
      {/* Active Flow Line */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="currentColor"
        strokeWidth={active ? width : '0'}
        className={`transition-all duration-500 ${color} ${active ? 'opacity-60' : 'opacity-0'}`}
        strokeDasharray={dashed ? '4 4' : '4 4'} // Always dash the flow for effect
      />
      {/* Moving Particles */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="currentColor"
        strokeWidth={active ? width : '0'}
        strokeDasharray="4 6"
        className={`transition-all duration-500 ${color} ${active ? 'opacity-100 animate-dash' : 'opacity-0'}`}
      />
    </>
  )
}

export default PhysicalLayerAnimation
