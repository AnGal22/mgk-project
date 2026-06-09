const facts = [
  'Jeste li znali da je tehniku konzerviranja hrane izumio Nicolas Francois Appert još davne 1809. godine',
  'Prvu praktičnu limenku za konzerviranje hrane patentirao je Peter Durand 1810. godine',
  'Konzervirana hrana sa niskim udjelom kiseline u limenkama ima rok trajanja i do 5 godina.',
  'Najstarija pronađena limenka bila je stara 109 godina i mikrobiološki sigurna za jelo.',
  'Vojni i specijalni obroci u limenkama mogu trajati 10+ godina.',
  'Limenka je najpraktičnija inovacija u povijesti pakiranja.',
  'Limenka je simbol kružne ekonomije.',
  'Limenka se može reciklirati beskonačno mnogo puta bez gubitka kvalitete materijala.',
  'Limenka kao idealno rješenje – otporna, trajna i 100% se reciklira.',
  'Limenke su „heroji održivosti“.',
]

const TextTile = ({ text }: { text: string }) => {
  return (
    <div
      className="flex min-h-12 items-center whitespace-nowrap px-8 leading-none text-[1.7rem] font-medium tracking-[0.08em] text-black md:min-h-14 md:px-10 md:text-[1.9rem]"
      style={{ fontFamily: '"Chelsea Market", system-ui, sans-serif' }}
    >
      {text}
    </div>
  )
}

const Cans = () => {
  const rows = [facts, facts, facts]

  return (
    <div className="can-strip bg-black/10 text-black backdrop-blur-sm" aria-hidden="true">
      <div className="can-track">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="can-row" aria-hidden={rowIndex > 0 ? 'true' : undefined}>
            {row.map((fact, index) => (
              <TextTile key={`${rowIndex}-${index}`} text={fact} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Cans
