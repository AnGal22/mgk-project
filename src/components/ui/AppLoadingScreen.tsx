import { GooeyLoader } from './loader-10'

type AppLoadingScreenProps = {
  dark?: boolean
  label?: string
}

const AppLoadingScreen = ({ dark = false, label = 'Učitavanje...' }: AppLoadingScreenProps) => {
  return (
    <div className={`flex min-h-screen w-full items-center justify-center ${dark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <div className="flex flex-col items-center gap-6 text-center">
        <GooeyLoader
          className="scale-90 md:scale-100"
          primaryColor={dark ? '#38bdf8' : '#0ea5e9'}
          secondaryColor={dark ? '#7dd3fc' : '#93c5fd'}
          borderColor={dark ? 'rgba(148,163,184,0.35)' : 'rgba(203,213,225,0.9)'}
        />
        <p className={`text-sm font-semibold tracking-[0.18em] uppercase ${dark ? 'text-slate-300' : 'text-slate-500'}`}>{label}</p>
      </div>
    </div>
  )
}

export default AppLoadingScreen
