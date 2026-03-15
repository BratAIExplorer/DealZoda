'use client'

import { useEffect, useState } from 'react'

interface DealScoreBadgeProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

function getScoreColor(score: number): string {
  if (score >= 90) return '#10B981'
  if (score >= 70) return '#60A5FA'
  if (score >= 50) return '#F59E0B'
  return '#EF4444'
}

function getScoreLabel(score: number): string {
  if (score >= 90) return 'EXCEPTIONAL'
  if (score >= 70) return 'GOOD DEAL'
  if (score >= 50) return 'MODERATE'
  return 'NOT A DEAL'
}

export default function DealScoreBadge({ score, size = 'md', animated = false }: DealScoreBadgeProps) {
  // Avoid SSR/client mismatch — only show animated counter after mount
  const [mounted, setMounted] = useState(false)
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score)

  useEffect(() => {
    setMounted(true)
    if (!animated) return

    // Count up from 0 to score over 1.8s
    const duration = 1800
    const steps = 60
    const increment = score / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= score) {
        setDisplayScore(score)
        clearInterval(timer)
      } else {
        setDisplayScore(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [animated, score])

  const color = getScoreColor(score)
  const label = getScoreLabel(score)

  const radius = size === 'lg' ? 44 : size === 'md' ? 34 : 24
  const circumference = 2 * Math.PI * radius
  const strokeDash = (score / 100) * circumference
  const gap = circumference - strokeDash
  const svgSize = size === 'lg' ? 110 : size === 'md' ? 86 : 60
  const cx = svgSize / 2
  const fontSize = size === 'lg' ? '28' : size === 'md' ? '22' : '14'
  const labelFontSize = size === 'lg' ? '9' : size === 'md' ? '7' : '5'

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <div className="relative" style={{ width: svgSize, height: svgSize }}>
        <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
          {/* Background ring */}
          <circle cx={cx} cy={cx} r={radius} fill="none"
            stroke="rgba(255,255,255,0.08)" strokeWidth={size === 'lg' ? 8 : 6} />
          {/* Score arc */}
          <circle cx={cx} cy={cx} r={radius} fill="none"
            stroke={color}
            strokeWidth={size === 'lg' ? 8 : 6}
            strokeLinecap="round"
            strokeDasharray={`${strokeDash} ${gap}`}
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: 'center',
              filter: `drop-shadow(0 0 6px ${color})`,
              transition: mounted ? 'stroke-dasharray 1.8s ease-out' : 'none',
            }}
          />
          {/* Score number */}
          <text x={cx} y={cx + 2} textAnchor="middle" dominantBaseline="middle"
            fill={color} fontSize={fontSize} fontWeight="800"
            fontFamily="var(--font-display)">
            {displayScore}
          </text>
          <text x={cx} y={cx + parseFloat(fontSize) * 0.85} textAnchor="middle"
            dominantBaseline="middle" fill="rgba(255,255,255,0.4)"
            fontSize={labelFontSize} fontFamily="var(--font-body)">
            /100
          </text>
        </svg>
      </div>
      {size !== 'sm' && (
        <span className="text-xs font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full"
          style={{ color, background: `${color}18`, border: `1px solid ${color}40` }}>
          {label}
        </span>
      )}
    </div>
  )
}
