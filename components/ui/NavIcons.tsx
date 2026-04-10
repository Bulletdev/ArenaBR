// Ícones SVG — prostaff-analytics-hub + inline SVG (zero Lucide)
import type { CSSProperties } from "react"

type IconProps = { size?: number; className?: string; style?: CSSProperties }

// ─── prostaff-analytics-hub/public/dashboard-icons/ ───────────

export function IconTrophy({ size = 16, className, style }: IconProps) {
  return (
    <svg fill="currentColor" width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M21.619 27.683c-3.48-1.853-4.866-5.206-1.11-5.883-1.97-0.43-2.848-1.156-1.465-2.264 0.983-0.446 1.908-1.101 2.753-1.932 0.415 0.298 0.801 0.626 1.152 0.981-0.256 0.261-0.521 0.515-0.795 0.762l1.011 1.847c4.937-4.49 7.251-11.202 6.866-17.783l-1.708 0.496c0.028 0.475 0.039 0.949 0.035 1.421h-1.597c0.044-0.611 0.067-1.232 0.067-1.861h-0.634c-0.175-0.852-4.679-1.535-10.211-1.535s-10.036 0.683-10.211 1.535h-0.633c0 0.629 0.023 1.25 0.067 1.861h-1.618c-0.008-0.497 0-0.994 0.024-1.491l-1.673-0.391c-0.533 6.656 2.060 13.135 6.831 17.748l0.976-1.847c-0.262-0.217-0.514-0.441-0.757-0.67 0.365-0.382 0.768-0.733 1.204-1.051 0.84 0.821 1.757 1.468 2.731 1.911 1.384 1.108 0.505 1.834-1.465 2.264 3.755 0.676 2.37 4.029-1.11 5.882-1.51 0.262-2.448 0.627-2.448 1.032 0 0.795 3.618 1.44 8.081 1.44s8.081-0.645 8.081-1.44c0-0.405-0.937-0.77-2.446-1.032zM15.985 2.35c4.046 0 7.345 0.496 7.518 1.117v0c0.002 0.008 0.004 0.017 0.006 0.025s0.002 0.017 0.002 0.026c0 0.141-0.161 0.276-0.457 0.402-0.084 0.036-0.18 0.071-0.285 0.105-0.132 0.043-0.28 0.084-0.444 0.123s-0.341 0.077-0.533 0.113c-0.038 0.007-0.077 0.014-0.117 0.021-0.079 0.014-0.16 0.028-0.243 0.042-0.042 0.007-0.084 0.013-0.126 0.020-0.213 0.033-0.438 0.064-0.675 0.093-0.047 0.006-0.095 0.011-0.143 0.017-0.338 0.039-0.698 0.074-1.077 0.104-0.216 0.017-0.439 0.033-0.667 0.047-0.342 0.021-0.696 0.038-1.060 0.051-0.546 0.020-1.115 0.030-1.7 0.030s-1.153-0.010-1.7-0.030c-0.364-0.013-0.718-0.030-1.060-0.051-0.228-0.014-0.45-0.030-0.667-0.047-0.379-0.030-0.739-0.065-1.077-0.104-0.048-0.006-0.096-0.011-0.143-0.017-0.237-0.029-0.462-0.060-0.675-0.093-0.043-0.007-0.085-0.013-0.126-0.020-0.083-0.014-0.164-0.027-0.243-0.042-0.039-0.007-0.078-0.014-0.117-0.021-0.192-0.036-0.37-0.074-0.533-0.113s-0.311-0.081-0.444-0.123c-0.106-0.034-0.201-0.069-0.286-0.105-0.295-0.125-0.457-0.261-0.457-0.402 0-0.009 0.001-0.017 0.002-0.026s0.003-0.017 0.006-0.025v0c0.173-0.621 3.473-1.117 7.518-1.117zM28.272 7.001c-0.349 3.72-1.731 7.248-4.058 10.159-0.34-0.378-0.712-0.732-1.114-1.058 1.735-2.332 2.985-5.503 3.486-9.101h1.686zM5.383 7.001c0.503 3.61 1.759 6.79 3.503 9.125-0.435 0.358-0.836 0.749-1.196 1.168-2.412-2.899-3.684-6.53-4.015-10.293h1.708z" />
    </svg>
  )
}

export function IconRoster({ size = 16, className, style }: IconProps) {
  return (
    <svg fill="currentColor" width={size} height={size} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M256.495,96.434c26.632,0,48.213-21.597,48.213-48.205C304.708,21.58,283.128,0,256.495,0c-26.65,0-48.222,21.58-48.222,48.229C208.274,74.837,229.846,96.434,256.495,96.434z"/>
      <path d="M298.267,119.279h-42.271h-42.271c-23.362,0-48.779,25.418-48.779,48.788v162.058c0,11.685,9.463,21.156,21.148,21.156c5.743,0,0,0,14.756,0l8.048,138.206c0,12.434,10.078,22.513,22.513,22.513c5.244,0,14.923,0,24.585,0c9.671,0,19.35,0,24.593,0c12.434,0,22.513-10.078,22.513-22.513l8.04-138.206c14.764,0,9.013,0,14.764,0c11.676,0,21.148-9.471,21.148-21.156V168.067C347.054,144.697,321.636,119.279,298.267,119.279z"/>
      <path d="M104.141,149.083c23.262,0,42.105-18.85,42.105-42.104c0-23.262-18.843-42.112-42.105-42.112c-23.27,0-42.104,18.851-42.104,42.112C62.037,130.232,80.871,149.083,104.141,149.083z"/>
      <path d="M408.716,149.083c23.27,0,42.104-18.85,42.104-42.104c0-23.262-18.834-42.112-42.104-42.112c-23.253,0-42.104,18.851-42.104,42.112C366.612,130.232,385.463,149.083,408.716,149.083z"/>
      <path d="M137.257,169.024h-33.548h-36.92c-20.398,0-42.595,22.213-42.595,42.612v141.526c0,10.212,8.264,18.476,18.468,18.476c5.018,0,0,0,12.884,0l7.024,120.704c0,10.852,8.805,19.658,19.666,19.658c4.577,0,13.024,0,21.473,0c8.439,0,16.895,0,21.472,0c10.861,0,19.666-8.805,19.666-19.658l7.016-120.704v-6.849c-8.98-8.856-14.606-21.082-14.606-34.664V169.024z"/>
      <path d="M445.211,169.024h-36.928h-33.54v161.101c0,13.582-5.626,25.808-14.615,34.664v6.849l7.017,120.704c0,10.852,8.814,19.658,19.674,19.658c4.578,0,13.025,0,21.464,0c8.456,0,16.904,0,21.481,0c10.862,0,19.659-8.805,19.659-19.658l7.032-120.704c12.883,0,7.865,0,12.883,0c10.204,0,18.468-8.265,18.468-18.476V211.636C487.806,191.237,465.61,169.024,445.211,169.024z"/>
    </svg>
  )
}

export function IconScouting({ size = 16, className, style }: IconProps) {
  return (
    <svg fill="currentColor" width={size} height={size} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M184.297,115.479c21.824,6.823,39.669,20.913,52.011,39.309l1.722-9.817c6.339-30.336-7.542-63.542-38.33-73.158c-30.788-9.608-61.109,9.791-73.166,38.339l-2.944,6.372c10.286-3.554,21.005-5.477,31.859-5.477C165.148,111.047,174.865,112.544,184.297,115.479z"/>
      <path d="M60.34,321.976l60.356-60.348C87.365,261.628,60.34,288.646,60.34,321.976z"/>
      <path d="M275.676,154.755c12.359-18.362,30.204-32.452,52.028-39.276c9.432-2.936,19.132-4.432,28.832-4.432c10.854,0,21.591,1.923,31.875,5.494l-2.943-6.388c-12.058-28.548-42.378-47.947-73.167-38.339c-30.772,9.616-44.669,42.822-38.331,73.158L275.676,154.755z"/>
      <path d="M391.304,201.272c-56.175,0-103.369,38.365-116.848,90.318c-2.642-1.439-5.469-2.542-8.446-3.337c1.723-6.589,3.948-12.969,6.64-19.115l0.134,0.811c20.085-45.538,65.625-77.439,118.522-77.439c25.972,0,50.172,7.718,70.475,20.954l-12.593-27.318c-19.584-46.391-68.852-77.925-118.89-62.296c-36.993,11.556-58.951,44.101-63.718,80.208c-3.294-1.27-6.84-2.007-10.586-2.007c-3.729,0-7.292,0.736-10.57,2.007c-4.766-36.107-26.725-68.651-63.734-80.208c-50.021-15.628-99.29,15.905-118.89,62.296l-12.576,27.318c20.302-13.236,44.502-20.954,70.474-20.954c52.881,0,98.436,31.901,118.506,77.439l0.15-0.811c2.693,6.146,4.918,12.526,6.64,19.115c-2.976,0.794-5.82,1.898-8.462,3.337c-13.48-51.953-60.658-90.318-116.833-90.318C54.035,201.272,0,255.315,0,321.976c0,66.653,54.035,120.696,120.696,120.696c53.751,0,99.273-35.137,114.893-83.694c5.937,3.671,12.911,5.82,20.403,5.82c7.51,0,14.466-2.149,20.42-5.82c15.62,48.558,61.142,83.694,114.892,83.694C457.966,442.672,512,388.63,512,321.976C512,255.315,457.966,201.272,391.304,201.272z M120.696,403.739c-45.154,0-81.763-36.609-81.763-81.763s36.609-81.762,81.763-81.762c45.171,0,81.763,36.608,81.763,81.762S165.867,403.739,120.696,403.739z M391.304,403.739c-45.171,0-81.762-36.609-81.762-81.763s36.592-81.762,81.762-81.762c45.155,0,81.764,36.608,81.764,81.762S436.459,403.739,391.304,403.739z"/>
      <path d="M330.948,321.976l60.356-60.348C357.957,261.628,330.948,288.646,330.948,321.976z"/>
    </svg>
  )
}

export function IconPerson({ size = 16, className, style }: IconProps) {
  return (
    <svg fill="currentColor" width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z" />
    </svg>
  )
}

export function IconAnalytics({ size = 16, className, style }: IconProps) {
  return (
    <svg fill="currentColor" width={size} height={size} viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M746.667 106.667H1173.33V1493.33H746.667V106.667ZM533.333 533.333H106.667V1493.33H533.333V533.333ZM1920 1706.67H0V1824H1920V1706.67ZM1813.33 746.667H1386.67V1493.33H1813.33V746.667Z" />
    </svg>
  )
}

export function IconStrategy({ size = 16, className, style }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M12 2v20" /><path d="M2 12h20" /><circle cx="12" cy="12" r="4" />
      <path d="m4.93 4.93 4.24 4.24" /><path d="m14.83 9.17 4.24-4.24" />
      <path d="m14.83 14.83 4.24 4.24" /><path d="m9.17 14.83-4.24 4.24" />
    </svg>
  )
}

export function IconTacticalBoard({ size = 16, className, style }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" /><path d="M9 21V9" />
      <circle cx="7" cy="6" r="1" fill="currentColor" />
      <circle cx="12" cy="6" r="1" fill="currentColor" />
      <circle cx="17" cy="6" r="1" fill="currentColor" />
      <circle cx="7" cy="12" r="1" fill="currentColor" />
      <circle cx="17" cy="17" r="1" fill="currentColor" />
    </svg>
  )
}

export function IconTrendingUp({ size = 16, className, style }: IconProps) {
  return (
    <svg fill="currentColor" width={size} height={size} viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M50.1,30.56a1.16,1.16,0,0,1-2,.82L42.73,26,30.32,36.65a3.39,3.39,0,0,1-4.92,0l-7.49-8.54L4.57,39.81a1.13,1.13,0,0,1-1.64,0l-.59-.59a1.13,1.13,0,0,1,0-1.64L15.46,19.68a3.39,3.39,0,0,1,4.92,0l7.49,7.49,7.61-8.78-4.92-4.45a1.26,1.26,0,0,1,.82-2.11H47.76A2.35,2.35,0,0,1,50,14.3Z" />
    </svg>
  )
}

export function IconBarChart({ size = 16, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width={size} height={size} xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <line x1="12" y1="20" x2="12" y2="10" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <line x1="18" y1="20" x2="18" y2="4" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <line x1="6" y1="20" x2="6" y2="16" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconCalendar({ size = 16, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width={size} height={size} xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth={2} />
      <path d="M16 2V6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 2V6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 10H21" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconShield({ size = 16, className, style }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  )
}

// ─── Inline SVG simples (sem equivalente no prostaff) ─────────

export function IconChevronDown({ size = 16, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export function IconMenu({ size = 20, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

export function IconClose({ size = 20, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

export function IconDollarSign({ size = 16, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}

export function IconSwords({ size = 16, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
      <line x1="13" y1="19" x2="19" y2="13" />
      <line x1="16" y1="16" x2="20" y2="20" />
      <line x1="19" y1="21" x2="21" y2="19" />
      <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" />
      <line x1="5" y1="14" x2="9" y2="18" />
      <line x1="7" y1="17" x2="3" y2="21" />
    </svg>
  )
}

export function IconUserPlus({ size = 16, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="22" y1="11" x2="16" y2="11" />
    </svg>
  )
}
