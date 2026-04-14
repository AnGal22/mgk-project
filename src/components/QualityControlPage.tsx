type QualityControlPageProps = {
  lang: 'hr' | 'en'
}

const QualityControlPage = ({ lang }: QualityControlPageProps) => {
  const text = {
    hr: {
      eyebrow: 'Kontrola kvalitete',
      title: 'Kontrola kvalitete',
      intro:
        'Cjelokupni tehnološki proces, od pripreme u pogonu Limotiska do finalizacije u pogonu Metalne ambalaže, pod stalnim je nadzorom službe Kontrole kvalitete. Sustav je postavljen prema procesnom pristupu sukladno normi ISO 9001:2015.',
      processTitle: 'Proizvodnja MGK-pack',
      processIntro:
        'Tehnološki proces unutar Društva strukturiran je kroz dvije primarne proizvodne cjeline: pripremnu fazu u RJ Limotisak (Pogon litografije) i završnu fazu u pogonu za proizvodnju metalne ambalaže.',
      processBlocks: [
        {
          title: 'RJ Limotisak / Pogon litografije',
          body: 'Tehnološki proces unutar RJ Limotisak strukturiran je kroz dvije ključne faze: zaštitno lakiranje i višebojni UV offset tisak.',
          points: [
            'Faza lakiranja – provodi se na automatiziranoj liniji lakiranja gdje se na aluminijski ili bijeli lim nanosi zaštitni sloj laka putem valjkastih sustava. Finalizacija ovog sloja odvija se kroz tunelsko sušenje, čime se postiže potrebna čvrstoća i kemijska otpornost nanosa.',
            'Faza tiska – na linijama za tisak izvodi se automatizirani postupak otiskivanja uz primjenu UV boja na dva agregata. U ovom procesu koristi se isključivo UV sustav za trenutačnu polimerizaciju, odnosno sušenje, koji osigurava visoku preciznost i kvalitetu otiska.',
          ],
        },
        {
          title: 'Pogon za proizvodnju metalne ambalaže',
          body: 'Nakon završetka faze lakiranja i tiska, obrađeni lim se upućuje u pogon Proizvodnje metalne ambalaže, gdje se vrši finalna konverzija materijala u gotove proizvode. Ovisno o specifikacijama proizvoda i zahtjevima kupaca, proces se odvija na visokoproduktivnim automatskim linijama.',
          points: [
            'Duboko izvlačenje – primjenjuje se za izradu dvodijelnih limenki i Twist Off zatvarača, gdje se preciznim alatima vrši deformacija lima u željeni oblik.',
            'Formiranje i zavarivanje – za trodijelnu ambalažu proces obuhvaća strojno formiranje tijela limenke uz primjenu elektrootpornog zavarivanja bočnog šava, čime se osigurava hermetičnost i strukturalni integritet ambalaže.',
          ],
        },
      ],
      qualityTitle: 'Kontrola kvalitete',
      qualityPoints: [
        {
          title: 'Ulazna kontrola i laboratorijska ispitivanja',
          body: 'Prije početka proizvodnje provodi se rigorozna ulazna kontrola sirovina – bijelog i aluminijskog lima te lakova – prema normi EN 10202. Obavlja se kemijska kontrola materijala i ispitivanje uzoraka kako bi se osiguralo da sirovine zadovoljavaju standarde za upotrebu u prehrambenoj industriji.',
        },
        {
          title: 'Procesna i fazna kontrola',
          body: 'Tijekom faza lakiranja i tiska, kao i tijekom strojnog oblikovanja ambalaže, provode se kontinuirane fazne kontrole. Nadzire se kvaliteta nanosa laka i adhezija, preciznost dimenzija proizvoda prema radnim uputama te parametri zavarivanja i hermetičnosti prilikom formiranja limenki.',
        },
        {
          title: 'Izlazna kontrola',
          body: 'Finalni proizvodi prolaze završnu izlaznu kontrolu, u kojoj se provodi klasifikacija grešaka i provjerava funkcionalnost ambalaže na temelju rezultata testova. Kao ključni dio procesne i izlazne kontrole, redovito se provode testovi sterilizacije u laboratorijskim uvjetima kako bi se simulirali stvarni uvjeti obrade kod krajnjeg kupca i potvrdila termokemijska otpornost primijenjenih lakova na sadržaj. Cilj je osigurati da ambalaža zadrži funkcionalnost i estetska svojstva čak i pod ekstremnim utjecajem temperature i agresivnog sadržaja. Svi rezultati ispitivanja dokumentiraju se u izlaznim zapisima, čime se osigurava potpuna sljedivost procesa.',
        },
      ],
      isoTitle: 'ISO 9001:2015',
      isoBody:
        'Cjelokupni sustav upravljanja i proizvodne logike društva MGK-pack certificiran je prema međunarodnoj normi ISO 9001:2015. To jamči da su svi procesi – od nabave sirovine do isporuke finalne ambalaže – strogo standardizirani, mjerljivi i podložni kontinuiranom unaprjeđenju.',
    },
    en: {
      eyebrow: 'Quality Control',
      title: 'Quality Control',
      intro:
        'The entire technological process, from preparation in the lithography plant to finalization in the metal packaging plant, is under continuous supervision by the Quality Control department. The system is based on a process-oriented approach in accordance with ISO 9001:2015.',
      processTitle: 'MGK-pack Production',
      processIntro:
        'The technological process within the company is structured into two primary production units: the preparatory phase in the Sheet Metal Printing Department (Lithography Plant) and the final phase in the metal packaging production plant.',
      processBlocks: [
        {
          title: 'Sheet Metal Printing Department / Lithography Plant',
          body: 'The technological process within the lithography department is structured through two key phases: protective lacquering and multicolour UV offset printing.',
          points: [
            'Lacquering phase – carried out on an automated lacquering line where a protective lacquer layer is applied to aluminium or white sheet metal by means of roller systems. This layer is finalized through tunnel drying, ensuring the required coating strength and chemical resistance.',
            'Printing phase – an automated printing process is performed on printing lines using UV inks on two units. Only a UV system for instant polymerization and drying is used in this process, ensuring high printing precision and quality.',
          ],
        },
        {
          title: 'Metal Packaging Production Plant',
          body: 'After the lacquering and printing phases are completed, the processed sheet metal is transferred to the metal packaging production plant, where the material is finally converted into finished products. Depending on product specifications and customer requirements, the process is carried out on highly productive automatic lines.',
          points: [
            'Deep drawing – used for the production of two-piece cans and Twist Off caps, where the sheet metal is precisely deformed into the desired shape using dedicated tooling.',
            'Forming and welding – for three-piece packaging, the process includes mechanical forming of the can body with resistance welding of the side seam, ensuring hermetic sealing and structural integrity of the packaging.',
          ],
        },
      ],
      qualityTitle: 'Quality Control',
      qualityPoints: [
        {
          title: 'Incoming inspection and laboratory testing',
          body: 'Before production begins, rigorous incoming inspection of raw materials – white and aluminium sheet metal as well as lacquers – is carried out in accordance with EN 10202. Chemical control of materials and sample testing are performed to ensure that all raw materials meet standards for use in the food industry.',
        },
        {
          title: 'In-process and phase control',
          body: 'During lacquering and printing, as well as during the machine forming of packaging, continuous in-process inspections are carried out. The quality of lacquer application and adhesion, dimensional accuracy according to work instructions, and welding and hermetic sealing parameters during can forming are constantly monitored.',
        },
        {
          title: 'Final inspection',
          body: 'Finished products undergo final outgoing inspection, where defect classification and packaging functionality are checked on the basis of test results. As a key part of process and final inspection, sterilization tests are regularly performed under laboratory conditions in order to simulate real processing conditions at the customer’s site and confirm the thermo-chemical resistance of the applied lacquers. The goal is to ensure that the packaging retains both functionality and aesthetic quality even under extreme temperature exposure and aggressive contents. All test results are documented in outgoing quality records, ensuring full process traceability.',
        },
      ],
      isoTitle: 'ISO 9001:2015',
      isoBody:
        'The complete management system and production logic of MGK-pack are certified according to the international ISO 9001:2015 standard. This ensures that all processes – from raw material procurement to the delivery of finished packaging – are strictly standardized, measurable and subject to continuous improvement.',
    },
  }[lang]

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f4faff_0%,#e7f3fb_38%,#d7eaf7_100%)] px-4 pt-28 pb-16 text-slate-800 md:px-6 md:pt-32">
      <div className="mx-auto max-w-6xl space-y-6 md:space-y-8">
        <section className="rounded-[2rem] border border-[#c7dff0] bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(232,243,251,0.9))] p-8 shadow-[0_24px_70px_rgba(70,118,163,0.10)] backdrop-blur md:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4f83ab]">{text.eyebrow}</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-tight text-[#173f63] md:text-5xl">{text.title}</h1>
          <p className="mt-5 max-w-4xl text-base leading-relaxed text-[#4d6f8e] md:text-lg">{text.intro}</p>
        </section>

        <section className="rounded-[2rem] border border-[#c7dff0] bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(232,243,251,0.92))] p-8 shadow-[0_24px_70px_rgba(70,118,163,0.10)] backdrop-blur md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5a88ad]">{text.qualityTitle}</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#173f63] md:text-4xl">{text.qualityTitle}</h2>

          <div className="mt-8 grid gap-4 md:gap-5">
            {text.qualityPoints.map((item, index) => (
              <article key={item.title} className="rounded-2xl border border-[#d6e5f1] bg-white/82 p-5 shadow-sm md:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#d8ecfb] text-sm font-bold text-[#215078]">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#173f63] md:text-xl">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-[#355a79] md:text-base">{item.body}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <div className="lg:col-span-2 rounded-[2rem] border border-[#c7dff0] bg-white/80 p-6 shadow-[0_20px_50px_rgba(70,118,163,0.10)] backdrop-blur md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5a88ad]">{text.processTitle}</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#173f63] md:text-4xl">{text.processTitle}</h2>
            <p className="mt-4 max-w-4xl text-base leading-relaxed text-[#4d6f8e] md:text-lg">{text.processIntro}</p>
          </div>
          {text.processBlocks.map((block) => (
            <article key={block.title} className="rounded-[2rem] border border-[#c7dff0] bg-white/80 p-6 shadow-[0_20px_50px_rgba(70,118,163,0.10)] backdrop-blur md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5a88ad]">{text.processTitle}</p>
              <h2 className="mt-3 text-2xl font-bold text-[#173f63] md:text-3xl">{block.title}</h2>
              <p className="mt-4 text-sm leading-7 text-[#4d6f8e] md:text-base">{block.body}</p>
              <ul className="mt-6 space-y-4">
                {block.points.map((point) => (
                  <li key={point} className="rounded-2xl border border-[#d6e5f1] bg-[#f8fcff] p-4 text-sm leading-7 text-[#355a79] md:text-base">
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-[#c7dff0] bg-white/80 p-8 shadow-[0_20px_50px_rgba(70,118,163,0.10)] backdrop-blur md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5a88ad]">Certification</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#173f63] md:text-4xl">{text.isoTitle}</h2>
            <p className="mt-4 text-base leading-relaxed text-[#4d6f8e] md:text-lg">{text.isoBody}</p>
          </div>

          <div className="flex items-center justify-center rounded-[2rem] border border-[#c7dff0] bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(232,243,251,0.92))] p-8 shadow-[0_20px_50px_rgba(70,118,163,0.10)] backdrop-blur md:p-10">
            <img
              src="/ISO 9001 certification logo close-up.webp"
              alt="ISO 9001 certification"
              className="h-28 w-auto object-contain md:h-36"
              loading="lazy"
              decoding="async"
            />
          </div>
        </section>
      </div>
    </main>
  )
}

export default QualityControlPage
