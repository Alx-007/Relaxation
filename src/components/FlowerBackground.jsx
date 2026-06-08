import React, { memo } from 'react'

const Butterfly = memo(({ x, y, scale = 1, rotation = 0, opacity = 0.22, color = '#c084fc', color2 = '#e879f9' }) => (
  <g transform={`translate(${x},${y}) rotate(${rotation}) scale(${scale})`} opacity={opacity}>
    {/* Upper wings */}
    <path d="M0,-2 C-8,-22 -38,-32 -40,-14 C-41,-3 -25,8 0,2 Z" fill={color} />
    <path d="M0,-2 C8,-22 38,-32 40,-14 C41,-3 25,8 0,2 Z" fill={color} />
    {/* Lower wings */}
    <path d="M0,2 C-7,12 -24,22 -20,29 C-15,34 -4,26 0,10 Z" fill={color2} />
    <path d="M0,2 C7,12 24,22 20,29 C15,34 4,26 0,10 Z" fill={color2} />
    {/* Wing shimmer */}
    <path d="M0,-1 C-5,-14 -25,-20 -27,-10 C-28,-3 -17,5 0,1 Z" fill="white" opacity="0.2" />
    <path d="M0,-1 C5,-14 25,-20 27,-10 C28,-3 17,5 0,1 Z" fill="white" opacity="0.2" />
    {/* Body */}
    <ellipse cx="0" cy="6" rx="2" ry="9" fill="#6d28d9" opacity="0.85" />
    <circle cx="0" cy="-3" r="2.5" fill="#6d28d9" opacity="0.85" />
    {/* Antennae */}
    <path d="M-1,-5 Q-6,-14 -12,-19" stroke="#7c3aed" strokeWidth="0.9" fill="none" strokeLinecap="round" />
    <circle cx="-12" cy="-19" r="1.8" fill="#a855f7" />
    <path d="M1,-5 Q6,-14 12,-19" stroke="#7c3aed" strokeWidth="0.9" fill="none" strokeLinecap="round" />
    <circle cx="12" cy="-19" r="1.8" fill="#a855f7" />
  </g>
))

const BranchFlower = ({ cx, cy, r = 7, color = '#e879f9' }) => (
  <g>
    {[0, 72, 144, 216, 288].map((deg, i) => {
      const rad = (deg * Math.PI) / 180
      const px = cx + Math.cos(rad) * r * 0.65
      const py = cy + Math.sin(rad) * r * 0.65
      return (
        <ellipse
          key={i}
          cx={px} cy={py}
          rx={r * 0.58} ry={r * 0.32}
          fill={color}
          transform={`rotate(${deg} ${px} ${py})`}
        />
      )
    })}
    <circle cx={cx} cy={cy} r={r * 0.28} fill="#fdf4ff" opacity="0.9" />
  </g>
)

const BranchBottomLeft = memo(({ opacity = 0.2 }) => (
  <g opacity={opacity}>
    {/* Main stem */}
    <path
      d="M-10,910 C20,860 50,800 70,758 C90,718 95,688 85,658 C78,638 62,626 58,605"
      stroke="#9f7aea" strokeWidth="3" fill="none" strokeLinecap="round"
    />
    {/* Branch right */}
    <path
      d="M70,758 C92,738 118,718 132,698 C146,680 150,658 140,643"
      stroke="#9f7aea" strokeWidth="2" fill="none" strokeLinecap="round"
    />
    {/* Branch left */}
    <path
      d="M48,804 C28,788 8,778 -8,762"
      stroke="#9f7aea" strokeWidth="1.8" fill="none" strokeLinecap="round"
    />
    {/* Sub-branch from mid */}
    <path
      d="M75,693 C55,678 38,663 28,648"
      stroke="#9f7aea" strokeWidth="1.5" fill="none" strokeLinecap="round"
    />
    {/* Leaves */}
    <path d="M70,760 Q84,748 79,736 Q68,743 70,760 Z" fill="#bbf7d0" opacity="0.65" />
    <path d="M64,708 Q50,698 52,686 Q65,692 64,708 Z" fill="#bbf7d0" opacity="0.65" />
    <path d="M132,700 Q143,686 137,676 Q126,683 132,700 Z" fill="#bbf7d0" opacity="0.55" />
    <path d="M42,806 Q28,800 30,788 Q42,793 42,806 Z" fill="#bbf7d0" opacity="0.55" />
    {/* Flowers at tips */}
    <BranchFlower cx={58} cy={604} r={10} color="#c084fc" />
    <BranchFlower cx={140} cy={642} r={9} color="#e879f9" />
    <BranchFlower cx={-8} cy={760} r={8} color="#a855f7" />
    <BranchFlower cx={27} cy={647} r={8} color="#c084fc" />
    {/* Buds */}
    <ellipse cx="82" cy="645" rx="4" ry="7" fill="#e879f9" opacity="0.65" transform="rotate(-20 82 645)" />
    <ellipse cx="113" cy="670" rx="3.5" ry="6" fill="#c084fc" opacity="0.6" transform="rotate(15 113 670)" />
    <ellipse cx="20" cy="792" rx="3" ry="5.5" fill="#a855f7" opacity="0.6" transform="rotate(30 20 792)" />
  </g>
))

const BranchTopRight = memo(({ opacity = 0.2 }) => (
  // Mirror of bottom-left, rotated 180° around the viewBox center (720, 450)
  <g opacity={opacity} transform="rotate(180, 720, 450)">
    <path
      d="M-10,910 C20,860 50,800 70,758 C90,718 95,688 85,658 C78,638 62,626 58,605"
      stroke="#9f7aea" strokeWidth="3" fill="none" strokeLinecap="round"
    />
    <path
      d="M70,758 C92,738 118,718 132,698 C146,680 150,658 140,643"
      stroke="#9f7aea" strokeWidth="2" fill="none" strokeLinecap="round"
    />
    <path
      d="M48,804 C28,788 8,778 -8,762"
      stroke="#9f7aea" strokeWidth="1.8" fill="none" strokeLinecap="round"
    />
    <path
      d="M75,693 C55,678 38,663 28,648"
      stroke="#9f7aea" strokeWidth="1.5" fill="none" strokeLinecap="round"
    />
    <path d="M70,760 Q84,748 79,736 Q68,743 70,760 Z" fill="#bbf7d0" opacity="0.65" />
    <path d="M64,708 Q50,698 52,686 Q65,692 64,708 Z" fill="#bbf7d0" opacity="0.65" />
    <path d="M132,700 Q143,686 137,676 Q126,683 132,700 Z" fill="#bbf7d0" opacity="0.55" />
    <path d="M42,806 Q28,800 30,788 Q42,793 42,806 Z" fill="#bbf7d0" opacity="0.55" />
    <BranchFlower cx={58} cy={604} r={10} color="#c084fc" />
    <BranchFlower cx={140} cy={642} r={9} color="#e879f9" />
    <BranchFlower cx={-8} cy={760} r={8} color="#a855f7" />
    <BranchFlower cx={27} cy={647} r={8} color="#c084fc" />
    <ellipse cx="82" cy="645" rx="4" ry="7" fill="#e879f9" opacity="0.65" transform="rotate(-20 82 645)" />
    <ellipse cx="113" cy="670" rx="3.5" ry="6" fill="#c084fc" opacity="0.6" transform="rotate(15 113 670)" />
    <ellipse cx="20" cy="792" rx="3" ry="5.5" fill="#a855f7" opacity="0.6" transform="rotate(30 20 792)" />
  </g>
))

const BranchTopLeft = memo(({ opacity = 0.16 }) => (
  <g opacity={opacity}>
    {/* Short branch going down-right from top-left */}
    <path
      d="M-5,-10 C15,30 35,60 55,80 C70,96 85,100 95,110"
      stroke="#9f7aea" strokeWidth="2.5" fill="none" strokeLinecap="round"
    />
    <path
      d="M40,65 C55,55 72,50 85,55"
      stroke="#9f7aea" strokeWidth="1.8" fill="none" strokeLinecap="round"
    />
    <path
      d="M60,84 C65,70 75,62 88,60"
      stroke="#9f7aea" strokeWidth="1.5" fill="none" strokeLinecap="round"
    />
    <path d="M42,67 Q30,58 32,46 Q44,52 42,67 Z" fill="#bbf7d0" opacity="0.6" />
    <path d="M62,86 Q50,80 52,68 Q64,74 62,86 Z" fill="#bbf7d0" opacity="0.6" />
    <BranchFlower cx={95} cy={110} r={9} color="#e879f9" />
    <BranchFlower cx={85} cy={55} r={8} color="#c084fc" />
    <BranchFlower cx={88} cy={59} r={7} color="#a855f7" />
    <ellipse cx="70" cy="98" rx="3.5" ry="6" fill="#e879f9" opacity="0.6" transform="rotate(20 70 98)" />
  </g>
))

const BranchBottomRight = memo(({ opacity = 0.16 }) => (
  <g opacity={opacity} transform="translate(1440, 900) scale(-1,-1)">
    <path
      d="M-5,-10 C15,30 35,60 55,80 C70,96 85,100 95,110"
      stroke="#9f7aea" strokeWidth="2.5" fill="none" strokeLinecap="round"
    />
    <path
      d="M40,65 C55,55 72,50 85,55"
      stroke="#9f7aea" strokeWidth="1.8" fill="none" strokeLinecap="round"
    />
    <path
      d="M60,84 C65,70 75,62 88,60"
      stroke="#9f7aea" strokeWidth="1.5" fill="none" strokeLinecap="round"
    />
    <path d="M42,67 Q30,58 32,46 Q44,52 42,67 Z" fill="#bbf7d0" opacity="0.6" />
    <path d="M62,86 Q50,80 52,68 Q64,74 62,86 Z" fill="#bbf7d0" opacity="0.6" />
    <BranchFlower cx={95} cy={110} r={9} color="#c084fc" />
    <BranchFlower cx={85} cy={55} r={8} color="#e879f9" />
    <BranchFlower cx={88} cy={59} r={7} color="#a855f7" />
    <ellipse cx="70" cy="98" rx="3.5" ry="6" fill="#c084fc" opacity="0.6" transform="rotate(20 70 98)" />
  </g>
))

const BUTTERFLIES = [
  { x: 220,  y: 140,  scale: 1.3,  rotation: -12, opacity: 0.22, color: '#c084fc', color2: '#e879f9' },
  { x: 480,  y: 80,   scale: 0.9,  rotation: 18,  opacity: 0.18, color: '#a855f7', color2: '#c084fc' },
  { x: 700,  y: 200,  scale: 1.1,  rotation: -25, opacity: 0.2,  color: '#e879f9', color2: '#c084fc' },
  { x: 950,  y: 110,  scale: 0.85, rotation: 10,  opacity: 0.17, color: '#c084fc', color2: '#a855f7' },
  { x: 1180, y: 190,  scale: 1.2,  rotation: -8,  opacity: 0.21, color: '#a855f7', color2: '#e879f9' },
  { x: 340,  y: 340,  scale: 0.75, rotation: 30,  opacity: 0.16, color: '#e879f9', color2: '#c084fc' },
  { x: 600,  y: 420,  scale: 1.0,  rotation: -20, opacity: 0.19, color: '#c084fc', color2: '#e879f9' },
  { x: 820,  y: 360,  scale: 0.8,  rotation: 15,  opacity: 0.17, color: '#a855f7', color2: '#c084fc' },
  { x: 1050, y: 440,  scale: 1.1,  rotation: -35, opacity: 0.2,  color: '#e879f9', color2: '#a855f7' },
  { x: 160,  y: 530,  scale: 0.9,  rotation: 22,  opacity: 0.18, color: '#c084fc', color2: '#e879f9' },
  { x: 440,  y: 620,  scale: 1.2,  rotation: -10, opacity: 0.22, color: '#a855f7', color2: '#e879f9' },
  { x: 760,  y: 560,  scale: 0.7,  rotation: 40,  opacity: 0.15, color: '#e879f9', color2: '#c084fc' },
  { x: 1220, y: 520,  scale: 1.0,  rotation: -18, opacity: 0.19, color: '#c084fc', color2: '#a855f7' },
  { x: 290,  y: 730,  scale: 0.85, rotation: 25,  opacity: 0.17, color: '#a855f7', color2: '#c084fc' },
  { x: 650,  y: 780,  scale: 1.1,  rotation: -30, opacity: 0.2,  color: '#e879f9', color2: '#c084fc' },
  { x: 970,  y: 720,  scale: 0.9,  rotation: 12,  opacity: 0.18, color: '#c084fc', color2: '#e879f9' },
]

export default memo(function FlowerBackground() {
  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="bgGrad" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#f9f0ff" />
            <stop offset="60%" stopColor="#f3e8ff" />
            <stop offset="100%" stopColor="#ede9fe" />
          </radialGradient>
          <radialGradient id="glowTop" cx="50%" cy="0%" r="50%">
            <stop offset="0%" stopColor="#e9d5ff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#f3e8ff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1440" height="900" fill="url(#bgGrad)" />
        <ellipse cx="720" cy="0" rx="800" ry="300" fill="url(#glowTop)" />

        {/* Branches with flowers in the corners */}
        <BranchBottomLeft opacity={0.22} />
        <BranchTopRight opacity={0.22} />
        <BranchTopLeft opacity={0.18} />
        <BranchBottomRight opacity={0.18} />

        {/* Butterflies */}
        {BUTTERFLIES.map((b, i) => (
          <Butterfly key={i} {...b} />
        ))}

        {/* Decorative dots */}
        {[...Array(25)].map((_, i) => (
          <circle
            key={`dot-${i}`}
            cx={(i * 58 + 40) % 1440}
            cy={(i * 83 + 60) % 900}
            r={1 + (i % 3) * 0.5}
            fill="#c084fc"
            opacity={0.07 + (i % 4) * 0.025}
          />
        ))}
      </svg>
    </div>
  )
})
