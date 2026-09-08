/**
 * The parts taxonomy.
 *
 * Two levels: 13 systems, each holding a set of part types. Every part type
 * gets its own page, because a page that answers "what does a clutch release
 * bearing do and when does it fail" is what actually ranks and what an answer
 * engine can quote.
 *
 * Content shape is deliberate for AEO. `summary` is answer-first and written to
 * stand alone as a quotable definition. `symptoms` and `checks` are lists
 * because that is the format assistants and featured snippets lift.
 *
 * Nothing here claims a specific part fits a specific vehicle. Fitment is
 * confirmed by the branch against TecDoc data.
 */

export type Faq = { q: string; a: string }

export type PartType = {
  slug: string
  label: string
  category: string
  /**
   * The form that reads naturally in a sentence, e.g. "needs a new clutch
   * kit". Derived headings are the fastest way to make a templated page sound
   * machine-written, and "signs your Kia Rio needs clutch kits" is exactly
   * that, so every type carries an explicit singular.
   */
  singular: string
  /** Answer-first definition. One or two sentences, quotable on its own. */
  summary: string
  /** What the component does in the system. */
  role: string
  /** Signs it is failing. Written the way a driver would notice them. */
  symptoms: string[]
  /** When it is normally replaced. */
  interval: string
  /** What the counter needs confirmed before an order is placed. */
  checks: string[]
  faqs: Faq[]
}

export type Category = {
  slug: string
  label: string
  icon: string
  image: string
  /** One-line description used on tiles. */
  blurb: string
  /** Answer-first opening for the category page. */
  summary: string
  /** Two or three paragraphs of genuine editorial. */
  intro: string[]
  faqs: Faq[]
}

export const CATEGORIES: Category[] = [
  {
    slug: 'braking',
    label: 'Braking',
    icon: 'Disc',
    image: '/images/parts/pm-brk-1001.webp',
    blurb: 'Pads, shoes, callipers, discs and boosters for reliable stopping power.',
    summary:
      'Braking parts are the friction and hydraulic components that slow the vehicle: pads and shoes that press against discs and drums, callipers and cylinders that apply them, and the booster that multiplies pedal effort.',
    intro: [
      'Braking is the highest-turnover system across the Parts-Mall branch network, and it is the one where fitment errors cost the most. The same vehicle in the same year can leave the factory with two different calliper suppliers, and the pad shape follows the calliper rather than the badge on the bonnet.',
      'Pads and discs wear as a matched pair. Fitting new pads to a disc that is below its minimum thickness, or that has a lip worn into the outer edge, will cost the customer a second visit. Measure the disc rather than trusting the service schedule.',
      'Every Parts-Mall private-brand braking line carries corporation warranty backing, and the supplying branch confirms the terms in writing at dispatch.',
    ],
    faqs: [
      {
        q: 'How often should brake pads be replaced?',
        a: 'There is no fixed interval. Front pads on a car doing mostly city driving typically last 30,000 to 50,000 km, but towing, hills and heavy loads shorten that considerably. Replace them once friction material reaches about 3mm, or sooner if the wear sensor is triggering.',
      },
      {
        q: 'Do brake discs need replacing at the same time as pads?',
        a: 'Not always, but check rather than assume. If the disc is above its stamped minimum thickness, is not scored, and has no lip on the outer edge, it can be reused. If any of those fail, replace discs in axle pairs.',
      },
      {
        q: 'Why does the branch ask which calliper my vehicle has?',
        a: 'Because pad shape follows the calliper, not the model. Manufacturers often source callipers from two suppliers within the same model year. The casting mark on the calliper body settles it in seconds.',
      },
    ],
  },
  {
    slug: 'engine',
    label: 'Engine',
    icon: 'Engine',
    image: '/images/parts/pm-eng-2002.webp',
    blurb: 'Pistons, camshafts, crankshafts, heads and timing for petrol and diesel rebuilds.',
    summary:
      'Engine parts are the internal rotating and reciprocating components that convert combustion into drive: pistons, crankshafts, camshafts, cylinder heads and the timing components that keep them synchronised.',
    intro: [
      'Engine work is where the labour cost dwarfs the parts cost, which changes the buying decision. A piston kit that saves a few hundred rand is a poor trade if it means stripping the engine twice.',
      'Most engine components are supplied to an engine code rather than a model name. A 1.6 Gamma and a 1.6 of another family share a capacity and nothing else. The engine code is stamped on the block and is what the counter needs.',
      'Parts-Mall supplies both private-brand and OEM engine components. For a rebuild that has to last, discuss the application with the branch rather than ordering on capacity alone.',
    ],
    faqs: [
      {
        q: 'What information does the branch need to supply engine parts?',
        a: 'The engine code stamped on the block, not just the model and capacity. Manufacturers use several engine families at the same capacity, and the internals are not interchangeable between them.',
      },
      {
        q: 'Should engine internals be OEM or private brand?',
        a: 'Anything that requires stripping the engine to access favours the strongest available line. The labour cost of doing the job twice is far higher than the difference in parts price.',
      },
    ],
  },
  {
    slug: 'electrical-sensors',
    label: 'Electrical and Sensors',
    icon: 'Lightning',
    image: '/images/parts/pm-els-3001.webp',
    blurb: 'Alternators, sensors, fuses and distributors to keep the electrics running true.',
    summary:
      'Electrical and sensor parts generate, distribute and measure. Alternators charge the battery and run the vehicle, sensors report engine conditions to the ECU, and fuses and distributors protect and direct the current.',
    intro: [
      'Electrical faults are the ones most often misdiagnosed, because a failing sensor and a failing wire produce the same fault code. Reading the code tells you which circuit is unhappy, not which component has failed.',
      'Sensors are the most frequently needed same-day electrical line across the network, because the vehicle usually will not run without them. Branches hold the common crankshaft and camshaft position sensors deliberately for that reason.',
      'Alternators are supplied by output rating as well as by fitment. A 90A and a 110A unit can share mounting points and drive completely different electrical loads.',
    ],
    faqs: [
      {
        q: 'My fault code points at a sensor. Does that mean the sensor has failed?',
        a: 'Not necessarily. A fault code identifies the circuit reporting a problem, which includes the wiring, the connector and the ECU input as well as the sensor itself. Check the connector and loom for corrosion or chafing before replacing the sensor.',
      },
      {
        q: 'How do I know which alternator my vehicle needs?',
        a: 'Output rating in amps, pulley type, and mounting configuration. The rating is usually on a label or stamped on the case. Bring the old unit or its details to the counter.',
      },
    ],
  },
  {
    slug: 'suspension-steering',
    label: 'Suspension and Steering',
    icon: 'SteeringWheel',
    image: '/images/parts/pm-sus-4002.webp',
    blurb: 'Bushings, ball joints, CV joints and steering columns for a controlled ride.',
    summary:
      'Suspension and steering parts locate the wheels and transmit driver input: bushings and ball joints that allow controlled movement, CV joints that deliver drive through a turning wheel, and the steering components that connect the wheel to the road.',
    intro: [
      'Undercar components fail gradually, which is why they are so often found during an unrelated service rather than reported by the driver. A worn bush does not stop the car, it just quietly ruins the tyres and the handling.',
      'These parts work as a system. A worn ball joint accelerates wear on the bush next to it, and a torn CV boot destroys a joint that was otherwise fine. Replacing one component without checking its neighbours usually means going back in.',
      'South African road conditions are hard on this system. Branches in regions with poorer road surfaces carry deeper stock on bushes, ball joints and shock mountings for exactly that reason.',
    ],
    faqs: [
      {
        q: 'How do I know if a CV joint needs replacing?',
        a: 'A rhythmic clicking on full lock, most obvious at low speed in a tight turn, is the classic sign of a worn outer joint. Check the boot first: if it is split and grease has been thrown out, the joint is on borrowed time even if it is still quiet.',
      },
      {
        q: 'Should suspension parts be replaced in pairs?',
        a: 'Yes for anything that affects geometry or ride height. Replacing one side leaves mismatched wear across the axle, which shows up as uneven tyre wear and a car that pulls.',
      },
      {
        q: 'Does the vehicle need alignment after suspension work?',
        a: 'Any component that locates a wheel changes the geometry when replaced. Book alignment as part of the job rather than as an afterthought.',
      },
    ],
  },
  {
    slug: 'filters',
    label: 'Filters',
    icon: 'Funnel',
    image: '/images/parts/pm-fil-5001.webp',
    blurb: 'Air, fuel, oil and cabin filters for routine service work.',
    summary:
      'Filters remove contaminants before they reach something expensive. Oil filters protect bearings, air and fuel filters protect combustion, and cabin filters clean the air entering the passenger compartment.',
    intro: [
      'Filters are the easiest lines to hold on a workshop shelf, because they move steadily rather than in spikes and they are replaced on a schedule regardless of failure.',
      'They are also where the cost of going cheap is least visible and most expensive. A poor oil filter with a failed anti-drainback valve starves the engine on every cold start, and nothing about that shows up until the bearings do.',
      'Parts-Mall filtration lines carrying ISO 9001 and TS 16949 are built to the same automotive quality standard as original equipment production.',
    ],
    faqs: [
      {
        q: 'How often should filters be replaced?',
        a: 'Oil filters at every oil service without exception. Air and fuel filters typically every second service, sooner on dusty routes. Cabin filters roughly annually, and sooner if the vehicle is used on gravel.',
      },
      {
        q: 'Does a dirty air filter really affect fuel consumption?',
        a: 'On a modern injected engine the ECU compensates, so the effect on consumption is smaller than commonly claimed. The real cost is reduced airflow, lost power under load, and abrasive dust reaching the bore if the element is damaged rather than merely dirty.',
      },
    ],
  },
  {
    slug: 'transmission-clutch',
    label: 'Transmission and Clutch',
    icon: 'Gear',
    image: '/images/parts/pm-trn-6001.webp',
    blurb: 'Clutch kits, discs, covers, cables and release bearings.',
    summary:
      'Transmission and clutch parts connect and disconnect engine power from the gearbox. A clutch kit comprises the friction disc, the pressure plate that clamps it, and the release bearing that disengages it.',
    intro: [
      'Clutch work is gearbox-out labour, which is the single most important fact about buying these parts. The bearing is the cheapest item in the kit and the most common reason a clutch job is done twice.',
      'Always replace the kit as a set. Fitting a new disc against a worn pressure plate, or reusing a release bearing because it still turns quietly on the bench, is how a workshop ends up doing the job again under its own warranty.',
      'Check the flywheel while the gearbox is out. A scored or heat-checked surface will destroy a new disc, and it is the only time the flywheel is accessible without repeating the entire strip.',
    ],
    faqs: [
      {
        q: 'What comes in a clutch kit?',
        a: 'A standard three-piece kit contains the friction disc, the pressure plate or cover assembly, and the release bearing. Some applications add a pilot bearing or an alignment tool. Confirm the contents with the branch when ordering.',
      },
      {
        q: 'Can I replace only the clutch disc?',
        a: 'Technically yes, but it is a false economy. The pressure plate and release bearing have worn alongside the disc, and the labour to reach them is identical. Replace all three while the gearbox is out.',
      },
      {
        q: 'How do I know the clutch is failing rather than the gearbox?',
        a: 'A slipping clutch shows rising engine revs without matching acceleration, most obvious under load in a high gear. Difficulty selecting gears or a juddering take-up points at the clutch too. Noise that changes with road speed rather than pedal position is more likely the gearbox.',
      },
    ],
  },
  {
    slug: 'cooling-system',
    label: 'Cooling System',
    icon: 'Thermometer',
    image: '/images/parts/pm-coo-7001.webp',
    blurb: 'Radiators, caps, condensers and fans to keep engines cool.',
    summary:
      'Cooling system parts move heat out of the engine: the radiator that sheds it to the air, the cap that holds system pressure, the fan that maintains airflow when the vehicle is stationary, and the condenser that serves the air conditioning circuit.',
    intro: [
      'Overheating is the fastest way to turn a cheap repair into an engine rebuild, and in South African summer conditions a marginal cooling system will find its limit on the first long climb with a full load.',
      'The radiator cap is the most underrated part in the system. It holds the pressure that raises the coolant boiling point, and a cap that no longer seals will let a perfectly healthy engine boil.',
      'Radiators and condensers sit in the same airflow path. If one has been damaged by road debris, inspect the other before quoting.',
    ],
    faqs: [
      {
        q: 'Why does a radiator cap matter so much?',
        a: 'It maintains system pressure, which raises the boiling point of the coolant well above 100 degrees. A cap that has lost its seal drops that pressure and the coolant boils at a temperature the engine would otherwise handle comfortably.',
      },
      {
        q: 'Can a radiator be repaired instead of replaced?',
        a: 'Older copper and brass cores can sometimes be repaired. Most modern radiators use aluminium cores with plastic end tanks and are replaced rather than repaired, because the failure is usually at the crimp between the two.',
      },
    ],
  },
  {
    slug: 'fuel-system',
    label: 'Fuel System',
    icon: 'GasPump',
    image: '/images/parts/pm-fue-8001.webp',
    blurb: 'Pumps, tanks, caps and senders for reliable fuel delivery.',
    summary:
      'Fuel system parts store and deliver fuel at the pressure the engine requires: the tank that holds it, the pump that pressurises it, the sender that reports level, and the cap that seals the system.',
    intro: [
      'In-tank fuel pumps are cooled and lubricated by the fuel around them, which is why running a vehicle persistently near empty shortens pump life. Customers who habitually run on the last quarter tank are the ones who replace pumps.',
      'Pumps are supplied by pressure and flow specification as well as by physical fitment. A module that bolts in but delivers the wrong pressure will produce running faults that look like an injection problem.',
      'Always replace the fuel filter alongside a pump. Fitting a new pump behind a blocked filter loads it from the first minute.',
    ],
    faqs: [
      {
        q: 'What are the signs of a failing fuel pump?',
        a: 'Extended cranking before starting, loss of power under load or on a climb, and stalling that clears after the vehicle sits. A whine from the tank that is louder than usual is an early warning.',
      },
      {
        q: 'Should the fuel filter be replaced with the pump?',
        a: 'Yes. A restricted filter is often what killed the original pump, and fitting a new pump behind it repeats the failure.',
      },
    ],
  },
  {
    slug: 'body-trim',
    label: 'Body and Trim',
    icon: 'CarProfile',
    image: '/images/parts/pm-bdy-9001.webp',
    blurb: 'Bumpers, panels, mouldings, handles and emblems for exterior repair.',
    summary:
      'Body and trim parts are the external panels, bumpers, mouldings and handles that make up the vehicle body, covering both accident repair and the high-wear items that fail with age.',
    intro: [
      'Body parts are the most variant-sensitive lines in the catalogue. Trim level, facelift year, parking sensor provision and mirror type all change the part, often without changing the model name.',
      'Door handles are the highest-volume trim item across the network. They are a wear item rather than an accident item, and they fail on high-mileage vehicles regardless of condition elsewhere.',
      'Colour-coded parts are generally supplied primed rather than finished. Budget for paint and allow for the time in the quote.',
    ],
    faqs: [
      {
        q: 'Do body panels arrive painted?',
        a: 'Generally no. Panels and bumpers are usually supplied in primer, ready for preparation and paint. Confirm the finish with the branch when quoting so the paint cost is in the customer figure from the start.',
      },
      {
        q: 'Why does the branch ask about trim level for a bumper?',
        a: 'Because bumpers differ by fog lamp provision, parking sensor cut-outs, and facelift year. Two vehicles with the same model name and year can take entirely different bumpers.',
      },
    ],
  },
  {
    slug: 'bearings',
    label: 'Bearings',
    icon: 'CircleDashed',
    image: '/images/parts/pm-bdg-10001.webp',
    blurb: 'Wheel, hub, alternator and starter bearings for smooth rotation.',
    summary:
      'Bearings carry rotating loads with minimal friction. Wheel and hub bearings support the vehicle weight while the wheel turns, and smaller bearings inside alternators and starters support their armatures.',
    intro: [
      'A failing wheel bearing announces itself as a droning hum that changes with road speed and often alters when the vehicle is loaded through a corner. Left long enough it becomes a safety failure rather than a noise complaint.',
      'Modern wheel bearings are frequently supplied as a sealed hub assembly rather than as a separate bearing, sometimes with the ABS sensor ring integrated. Which one applies changes both the price and the labour.',
      'Bearings inside alternators and starters are worth knowing about, because a noisy alternator is often a bearing rather than a failed unit, and a bearing is a fraction of the cost.',
    ],
    faqs: [
      {
        q: 'How do I know which wheel bearing my vehicle takes?',
        a: 'Confirm whether the application uses a separate bearing pressed into the hub or a complete sealed hub assembly, and whether an ABS sensor ring is integrated. These change the part and the labour, and the branch will ask.',
      },
      {
        q: 'What does a failing wheel bearing sound like?',
        a: 'A droning or humming noise that rises and falls with road speed rather than engine speed. It typically changes in volume when the vehicle is loaded through a corner, because cornering shifts load across the axle.',
      },
    ],
  },
  {
    slug: 'gaskets-seals',
    label: 'Gaskets and Seals',
    icon: 'Stack',
    image: '/images/parts/pm-gsk-11001.webp',
    blurb: 'Head gaskets, intake and exhaust gaskets and full gasket kits.',
    summary:
      'Gaskets and seals close the joints between engine components, containing combustion pressure, oil and coolant at the mating faces between the block, head and manifolds.',
    intro: [
      'A head gasket rarely fails on its own. It fails because the engine overheated, or because the head or block face is no longer flat. Fitting a new gasket without addressing the cause produces a repeat failure and an unhappy customer.',
      'Have the head skimmed and checked for flatness whenever it comes off. It is inexpensive relative to the strip, and it is the difference between a repair that lasts and one that does not.',
      'Gasket kits are supplied by engine code. Full sets, head sets and decarbonising sets contain different items, so confirm which the job requires before ordering.',
    ],
    faqs: [
      {
        q: 'What are the signs of a blown head gasket?',
        a: 'White exhaust smoke that smells sweet, coolant loss with no visible external leak, oil that has gone milky, or bubbling in the expansion tank while the engine runs. Combustion gas in the coolant confirms it.',
      },
      {
        q: 'Does the cylinder head need skimming when the gasket is replaced?',
        a: 'Check it every time. Most head gasket failures follow an overheat, and an overheat is what distorts the head. Fitting a new gasket to a warped face repeats the failure.',
      },
    ],
  },
  {
    slug: 'belts-chains',
    label: 'Belts and Chains',
    icon: 'Link',
    image: '/images/parts/pm-blt-12001.webp',
    blurb: 'Chain belts, timing chains and belt covers for correct timing and drive.',
    summary:
      'Belts and chains synchronise the crankshaft with the camshafts so that valves open and close in time with the pistons, and drive the ancillaries such as the alternator and water pump.',
    intro: [
      'On an interference engine, a failed timing component does not leave the vehicle stranded, it destroys the engine. Valves meet pistons and the repair becomes a rebuild.',
      'Timing chains were once considered lifetime components. On many modern engines they are not: chain stretch, worn guides and failing tensioners are common at higher mileage, and a rattle on cold start is the warning.',
      'Replace the tensioner and guides with the chain. They wear together, and the labour to reach them is already spent.',
    ],
    faqs: [
      {
        q: 'How do I know if a timing chain is stretched?',
        a: 'A rattle from the timing cover on cold start that quietens once oil pressure builds is the classic sign. Timing-related fault codes for camshaft and crankshaft correlation confirm it.',
      },
      {
        q: 'Should the tensioner be replaced with the chain?',
        a: 'Yes, along with the guides. They wear as a set, the labour to reach them is identical, and a worn tensioner will shorten the life of a new chain.',
      },
    ],
  },
  {
    slug: 'accessories',
    label: 'Accessories',
    icon: 'Toolbox',
    image: '/images/parts/pm-acc-13001.webp',
    blurb: 'General accessories and fitment hardware to finish the job.',
    summary:
      'Accessories and fitment hardware are the clips, fasteners, brackets and consumables that complete a repair, the items that are trivial individually and hold up a job when they are missing.',
    intro: [
      'Accessory and hardware lines exist because the single-use clip that shattered on removal is what keeps a vehicle on the lift overnight.',
      'Ask the counter about hardware when ordering the main component. Many jobs have a known set of fasteners that should not be reused, and adding them to the same order costs a few rand and saves a return trip.',
    ],
    faqs: [
      {
        q: 'Can I order fitment hardware with the main part?',
        a: 'Yes, and it is worth doing. Tell the counter which job you are doing and they will add the clips and fasteners that are commonly damaged on removal.',
      },
    ],
  },
]

/** Helper that keeps the 50 part-type definitions readable. */
const pt = (
  slug: string,
  label: string,
  category: string,
  summary: string,
  role: string,
  symptoms: string[],
  interval: string,
  checks: string[],
  faqs: Faq[],
): Omit<PartType, 'singular'> => ({
  slug,
  label,
  category,
  summary,
  role,
  symptoms,
  interval,
  checks,
  faqs,
})

/**
 * Natural singular forms. Where a component is genuinely sold and fitted as a
 * set, the phrase says so rather than pretending otherwise.
 */
const SINGULARS: Record<string, string> = {
  'brake-pads': 'set of brake pads',
  'brake-shoes': 'set of brake shoes',
  callipers: 'brake calliper',
  'discs-rotors': 'brake disc',
  boosters: 'brake booster',
  pistons: 'piston set',
  camshafts: 'camshaft',
  crankshafts: 'crankshaft',
  'cylinder-heads': 'cylinder head',
  'timing-chains': 'timing chain',
  alternators: 'alternator',
  sensors: 'engine sensor',
  fuses: 'fuse or relay',
  distributors: 'distributor',
  bushings: 'set of bushings',
  'ball-joints': 'ball joint',
  'cv-joints': 'CV joint',
  'steering-columns': 'steering column coupler',
  'air-filters': 'air filter',
  'fuel-filters': 'fuel filter',
  'cabin-filters': 'cabin filter',
  'oil-filters': 'oil filter',
  'clutch-kits': 'clutch kit',
  'clutch-discs-covers': 'clutch disc and cover',
  'clutch-cables': 'clutch cable',
  'clutch-release-bearings': 'clutch release bearing',
  radiators: 'radiator',
  'radiator-caps': 'radiator cap',
  condensers: 'condenser',
  'fans-motors': 'cooling fan',
  'fuel-pumps': 'fuel pump',
  'fuel-tanks': 'fuel tank',
  'fuel-caps': 'fuel cap',
  'fuel-senders': 'fuel sender',
  bumpers: 'bumper',
  'body-panels': 'body panel',
  'body-mouldings': 'body moulding',
  'door-handles': 'door handle',
  emblems: 'badge',
  'wheel-bearings': 'wheel bearing',
  'hub-bearings': 'hub bearing assembly',
  'alternator-bearings': 'alternator bearing',
  'starter-bearings': 'starter bearing',
  'cylinder-head-gaskets': 'head gasket',
  'intake-exhaust-gaskets': 'manifold gasket',
  'gasket-kits': 'gasket kit',
  'chain-belts': 'drive belt',
  'timing-chains-assemblies': 'timing chain kit',
  'belt-covers': 'belt cover',
  'general-accessories': 'fitment hardware',
}

const RAW_PART_TYPES = [
  // ── Braking ───────────────────────────────────────────────────────────────
  pt(
    'brake-pads',
    'Brake Pads',
    'braking',
    'Brake pads are the replaceable friction blocks that press against the brake disc to slow the wheel. They are a wear item and the most frequently replaced braking component, worn down over the life of the vehicle.',
    'The calliper squeezes a pair of pads against each face of the spinning disc. Friction converts the vehicle’s momentum into heat, which the disc then sheds into the airflow.',
    [
      'A high-pitched squeal that stops when you brake, from the wear indicator',
      'A grinding or metallic scraping sound, which means the friction material is gone',
      'Longer stopping distances or a pedal that needs more effort',
      'Visible friction material thinner than about 3mm through the wheel',
    ],
    'Typically 30,000 to 50,000 km on the front axle, but towing, hills and heavy city traffic shorten that substantially. Judge on measured thickness rather than distance.',
    [
      'Which calliper the vehicle has, from the casting mark on the body',
      'Disc diameter, measured rather than assumed',
      'Whether the vehicle has a wear sensor, and which side it runs on',
      'Whether you need the fitting kit of shims and clips',
    ],
    [
      {
        q: 'How long do brake pads last?',
        a: 'Front pads commonly last 30,000 to 50,000 km in mixed driving. Rear pads usually last considerably longer. Load, terrain and driving style matter more than the number, so measure the remaining friction material rather than working to a fixed interval.',
      },
      {
        q: 'Should brake pads be replaced in pairs?',
        a: 'Always across the axle, never one wheel. Uneven friction between left and right will pull the vehicle under braking, which is a safety problem rather than a comfort one.',
      },
      {
        q: 'Do new pads need bedding in?',
        a: 'Yes. Use moderate braking for the first few hundred kilometres to transfer an even layer of friction material onto the disc. Hard stops from high speed on fresh pads cause uneven deposits and juddering.',
      },
    ],
  ),
  pt(
    'brake-shoes',
    'Brake Shoes',
    'braking',
    'Brake shoes are the curved friction components used in drum brakes. They press outward against the inside of the drum to slow the wheel, and are most commonly found on the rear axle of smaller and older vehicles.',
    'A wheel cylinder pushes the shoes outward against the inner surface of the rotating drum. Drum brakes are self-energising, so the rotation helps press the shoes harder against the drum.',
    [
      'A handbrake that pulls further up the travel than it used to',
      'A scraping noise from the rear that changes with road speed',
      'The vehicle pulling to one side under braking',
      'Reduced rear braking effect, often noticed as a longer pedal',
    ],
    'Rear shoes typically outlast front pads by a wide margin, often 60,000 to 100,000 km. Inspect them whenever the drums are off.',
    [
      'Drum internal diameter, since drums wear oversize and worn drums need matched shoes',
      'Whether the vehicle uses a leading or trailing shoe arrangement',
      'Condition of the wheel cylinders, which often leak by the time shoes are due',
      'Whether the fitting kit of springs and adjusters is needed',
    ],
    [
      {
        q: 'Should the drums be replaced with the shoes?',
        a: 'Measure the drum against its stamped maximum diameter. Drums wear oversize and develop a lip, and fitting new shoes into a worn drum gives poor contact and a soft pedal.',
      },
      {
        q: 'Why replace the springs and adjusters too?',
        a: 'They fatigue with heat cycling. A weak return spring leaves the shoe in light contact with the drum, which causes drag, overheating and premature wear on parts you have just fitted.',
      },
    ],
  ),
  pt(
    'callipers',
    'Callipers',
    'braking',
    'A brake calliper is the hydraulic clamp that holds the brake pads and presses them against the disc. It converts brake fluid pressure into the clamping force that slows the vehicle, and can be fixed or sliding.',
    'Fluid pressure from the master cylinder acts on one or more pistons inside the calliper. The pistons push the pads against the disc, and on a sliding calliper the body itself moves on guide pins to apply the outer pad.',
    [
      'The vehicle pulling to one side under braking',
      'One wheel noticeably hotter than the others after a drive',
      'Uneven pad wear between the inner and outer pad',
      'Visible fluid weeping around the piston seal or bleed nipple',
      'A binding brake that does not release fully',
    ],
    'Callipers are not a scheduled item. They are replaced on failure, most often seizure of the piston or guide pins, or when a seal begins to leak.',
    [
      'Left or right side, since callipers are handed',
      'The calliper manufacturer, from the casting mark',
      'Piston count and disc diameter',
      'Whether the vehicle has an electric parking brake on that axle',
    ],
    [
      {
        q: 'What causes a brake calliper to seize?',
        a: 'Corrosion on the piston or guide pins, usually after moisture has entered past a perished seal or boot. Brake fluid absorbs water over time, which is why fluid changes matter more than most owners realise.',
      },
      {
        q: 'Should callipers be replaced in pairs?',
        a: 'It is strongly advised on the same axle. A new calliper on one side and a tired one on the other gives uneven clamping force, which pulls the vehicle under braking.',
      },
      {
        q: 'Why does an electric parking brake change the part?',
        a: 'Callipers with an integrated electric parking brake contain a motor and gearbox and are a different part entirely. They also need the piston wound back electronically rather than by hand.',
      },
    ],
  ),
  pt(
    'discs-rotors',
    'Discs and Rotors',
    'braking',
    'Brake discs, also called rotors, are the metal discs that rotate with the wheel and provide the friction surface the pads clamp onto. They absorb braking heat and shed it into the airflow.',
    'The disc is bolted to the hub and turns with the wheel. Pads clamp both faces, converting momentum into heat. Ventilated discs use internal vanes to pump air through the disc and improve heat dissipation.',
    [
      'A pulsing or juddering pedal under braking, which indicates thickness variation',
      'A pronounced lip on the outer edge of the disc',
      'Deep scoring or grooves in the friction face',
      'Blue heat discolouration or visible hairline cracking',
    ],
    'Often every second pad change, but the decision is made on measurement. Replace once the disc reaches the minimum thickness stamped on its hub face.',
    [
      'Diameter and thickness, measured on the vehicle',
      'Whether the disc is solid or ventilated',
      'Number of stud holes and the centre bore',
      'Whether an ABS ring or a parking brake drum is integrated',
    ],
    [
      {
        q: 'Can brake discs be skimmed instead of replaced?',
        a: 'Only if skimming leaves the disc above its stamped minimum thickness, and that is often not the case on modern discs which start relatively thin. Measure before deciding, because a disc skimmed below minimum overheats and cracks.',
      },
      {
        q: 'What causes a juddering brake pedal?',
        a: 'Almost always thickness variation across the disc, sometimes from uneven pad material deposits rather than true warping. Either way the disc surface is no longer parallel and the pads grab unevenly through each rotation.',
      },
      {
        q: 'Do discs have to be replaced in pairs?',
        a: 'Yes, across the axle. Different friction surfaces left and right produce uneven braking and pull.',
      },
    ],
  ),
  pt(
    'boosters',
    'Brake Boosters',
    'braking',
    'A brake booster, or servo, multiplies the force applied to the brake pedal using engine vacuum, so that normal pedal effort produces enough hydraulic pressure to stop the vehicle.',
    'A diaphragm inside the booster has engine vacuum on one side and atmospheric pressure on the other when the pedal is pressed. The pressure difference adds force to the pushrod that drives the master cylinder.',
    [
      'A brake pedal that has become noticeably hard to press',
      'Much longer stopping distances with no fluid loss',
      'A hissing noise from behind the pedal when braking',
      'The engine idling roughly or stalling when the brake is applied',
    ],
    'Not a scheduled item. Replaced on failure, which is usually a perished diaphragm or a failed check valve.',
    [
      'Whether the fault is the booster or the vacuum supply, which is the more common cause',
      'Booster diameter and whether it is a single or tandem unit',
      'Master cylinder mounting pattern and pushrod length',
      'Whether the vehicle uses a vacuum pump rather than manifold vacuum',
    ],
    [
      {
        q: 'How do I test a brake booster?',
        a: 'With the engine off, pump the pedal several times to exhaust the stored vacuum, then hold the pedal down and start the engine. The pedal should sink slightly as vacuum builds. If it does not move, the booster or its vacuum supply is at fault.',
      },
      {
        q: 'Why does the engine stall when I brake?',
        a: 'Usually a ruptured booster diaphragm drawing unmetered air into the inlet manifold, which upsets the fuel mixture. It is a vacuum leak that only appears when the pedal is pressed.',
      },
    ],
  ),

  // ── Engine ────────────────────────────────────────────────────────────────
  pt(
    'pistons',
    'Pistons',
    'engine',
    'Pistons are the cylindrical components that move up and down inside the engine bores, transferring the force of combustion to the crankshaft through the connecting rods.',
    'Combustion pressure above the piston drives it down the bore. The connecting rod converts that linear motion into rotation at the crankshaft. Piston rings seal combustion pressure and control oil on the bore wall.',
    [
      'Blue exhaust smoke, indicating oil passing the rings',
      'Loss of compression on one or more cylinders',
      'A knocking noise that is loudest under load',
      'Excessive oil consumption with no external leak',
    ],
    'Not a wear item in normal service. Replaced during a rebuild, after overheating damage, or following ring or bore wear.',
    [
      'Engine code stamped on the block, never just the capacity',
      'Oversize required, if the bores have been machined',
      'Whether rings and gudgeon pins are included',
      'Compression height and pin diameter for the specific application',
    ],
    [
      {
        q: 'What information is needed to order pistons?',
        a: 'The engine code from the block and the oversize required. Capacity alone is not enough, because manufacturers run several engine families at the same capacity with entirely different internals.',
      },
      {
        q: 'Do pistons come with rings?',
        a: 'It varies by line and application. Confirm with the branch whether rings and gudgeon pins are included so nothing is missing when the engine is on the bench.',
      },
    ],
  ),
  pt(
    'camshafts',
    'Camshafts',
    'engine',
    'The camshaft is the rotating shaft whose lobes open the engine’s valves in the correct sequence and for the correct duration, timed to the crankshaft.',
    'Driven by the timing chain or belt at half crankshaft speed on a four-stroke engine, the cam lobes act on followers or rockers to push the valves open. Valve springs close them again.',
    [
      'A ticking or tapping from the top of the engine',
      'Rough running or misfire on specific cylinders',
      'Loss of power across the rev range',
      'Camshaft correlation fault codes',
    ],
    'Not a scheduled item. Replaced after lobe wear, oil starvation damage, or as part of a rebuild.',
    [
      'Engine code, and whether the engine is a single or twin cam design',
      'Inlet or exhaust camshaft, since they differ',
      'Whether variable valve timing hardware is fitted',
      'The condition of the followers, which usually need replacing alongside',
    ],
    [
      {
        q: 'What causes camshaft lobe wear?',
        a: 'Oil starvation is the usual cause, whether from extended service intervals, a low oil level, or a blocked oil feed. The lobe and its follower wear together, which is why both are replaced.',
      },
      {
        q: 'Do the followers need replacing with the camshaft?',
        a: 'Yes. A worn follower will destroy a new lobe quickly, because the two surfaces have bedded to each other and the wear pattern will not match.',
      },
    ],
  ),
  pt(
    'crankshafts',
    'Crankshafts',
    'engine',
    'The crankshaft converts the up-and-down movement of the pistons into the rotation that drives the vehicle. It runs in main bearings within the engine block and carries counterweights to balance the load.',
    'Connecting rods attach to offset journals on the crankshaft, so each downward piston stroke turns the shaft. The crankshaft then drives the flywheel, the timing system and the ancillary belt.',
    [
      'A deep knocking from the bottom of the engine, worst under load',
      'Low oil pressure, particularly when hot',
      'Metallic particles in the oil or filter',
      'Crankshaft position sensor faults caused by a damaged reluctor ring',
    ],
    'Not a wear item in normal service. Replaced after bearing failure, oil starvation, or during a major rebuild.',
    [
      'Engine code from the block',
      'Undersize required, if journals have been reground',
      'Whether main and big-end bearing shells are supplied with it',
      'Reluctor ring type, which must match the crankshaft sensor',
    ],
    [
      {
        q: 'Can a crankshaft be reground instead of replaced?',
        a: 'Often yes, if the journals are within regrind limits and there is no cracking. Regrinding requires matched undersize bearing shells, so order those together.',
      },
      {
        q: 'What causes crankshaft bearing failure?',
        a: 'Loss of oil pressure or contaminated oil. Both let the journal contact the shell directly instead of riding on a film of oil, and the damage follows quickly.',
      },
    ],
  ),
  pt(
    'cylinder-heads',
    'Cylinder Heads',
    'engine',
    'The cylinder head sits on top of the engine block and contains the valves, valve seats and usually the camshafts. It forms the top of the combustion chamber and carries the inlet and exhaust ports, sealed by the head gasket below it.',
    'The head seals against the block through the head gasket, containing combustion pressure. It houses the valvetrain that admits air and fuel and releases exhaust gas, and carries coolant passages that manage combustion heat.',
    [
      'White sweet-smelling exhaust smoke',
      'Coolant loss with no visible external leak',
      'Oil that has turned milky',
      'Bubbling in the expansion tank while the engine runs',
      'Overheating that returns after the cooling system has been checked',
    ],
    'Not a scheduled item. Replaced after overheating distortion, cracking, or valve seat damage that cannot be machined out.',
    [
      'Engine code from the block',
      'Whether the head is supplied bare or assembled with valves and cams',
      'Whether the head bolts are single-use and need replacing',
      'That the block face has been checked for flatness',
    ],
    [
      {
        q: 'Does a new cylinder head come with valves fitted?',
        a: 'It depends on the line. Heads are supplied both bare and fully assembled. Confirm which you are getting, because the difference in bench time is significant.',
      },
      {
        q: 'Do head bolts need replacing?',
        a: 'On most modern engines yes. Torque-to-yield bolts stretch permanently when tightened and cannot reliably be reused. Order them with the head or gasket set.',
      },
    ],
  ),
  pt(
    'timing-chains',
    'Timing Chains',
    'engine',
    'A timing chain synchronises the crankshaft with the camshafts so the valves open and close in the correct relationship to piston position. It runs in engine oil and is tensioned hydraulically.',
    'The chain links the crankshaft sprocket to the camshaft sprockets. A hydraulic tensioner takes up slack and guides control the chain path. Correct timing keeps valves clear of pistons and combustion efficient.',
    [
      'A rattle from the timing cover on cold start that quietens as oil pressure builds',
      'Camshaft and crankshaft correlation fault codes',
      'Rough running or a loss of power',
      'A rattle that returns under sudden throttle changes',
    ],
    'Once treated as lifetime components, but chain stretch and guide wear are common at higher mileage on many modern engines. Investigate any cold-start rattle immediately.',
    [
      'Engine code from the block',
      'Whether the kit includes tensioner, guides and sprockets',
      'Whether the engine is an interference design',
      'Whether the front crankshaft seal and cover gasket are needed',
    ],
    [
      {
        q: 'What happens if a timing chain fails?',
        a: 'On an interference engine, valves and pistons collide and the engine is destroyed. That is why a cold-start rattle should be investigated straight away rather than monitored.',
      },
      {
        q: 'Should the tensioner and guides be replaced with the chain?',
        a: 'Yes. They wear as a set and the labour to reach them is already spent. A worn tensioner will let a new chain slap and stretch early.',
      },
    ],
  ),

  // ── Electrical and sensors ────────────────────────────────────────────────
  pt(
    'alternators',
    'Alternators',
    'electrical-sensors',
    'The alternator generates the electricity that runs the vehicle while the engine is running and recharges the battery. Without it the vehicle runs only until the battery is flat, usually within an hour or two.',
    'Driven by the ancillary belt, the alternator produces alternating current which internal diodes rectify to direct current. A voltage regulator holds output at roughly 14 volts under varying load and engine speed.',
    [
      'A battery warning light while driving',
      'Dimming headlights, especially at idle',
      'A flat battery that returns after charging',
      'A whining or grinding noise that follows engine speed',
      'A burning smell from the drive belt area',
    ],
    'Not a scheduled item. Replaced on failure, most often worn brushes, failed diodes, or a collapsed bearing.',
    [
      'Output rating in amps, from the label or case stamping',
      'Pulley type, whether solid or a one-way clutch pulley',
      'Mounting configuration and plug type',
      'Whether the vehicle has a smart charging system managed by the ECU',
    ],
    [
      {
        q: 'How do I test whether the alternator is charging?',
        a: 'Measure battery voltage with the engine running. Roughly 13.8 to 14.4 volts indicates it is charging. A reading at or below resting battery voltage of about 12.6 volts means it is not.',
      },
      {
        q: 'Why does the alternator amp rating matter?',
        a: 'It must meet the vehicle’s electrical load. Fitting a lower-rated unit than specified leaves the battery undercharged whenever demand is high, which shortens battery life and creates intermittent faults.',
      },
      {
        q: 'Can a noisy alternator just need a bearing?',
        a: 'Frequently, yes. A whine or growl that follows engine speed is often the bearing rather than the windings, and a bearing costs a fraction of a replacement unit.',
      },
    ],
  ),
  pt(
    'sensors',
    'Engine Sensors',
    'electrical-sensors',
    'Engine sensors measure conditions such as crankshaft position, camshaft position, air flow, temperature and oxygen content, and report them to the ECU so it can control fuelling and ignition.',
    'Each sensor converts a physical condition into an electrical signal. The ECU uses those signals to decide injector timing, ignition timing and fuelling. A sensor giving implausible data will cause the ECU to run a default strategy.',
    [
      'The engine warning light with a related fault code',
      'A vehicle that cranks but will not start, often a crankshaft position sensor',
      'Rough idle, hesitation or stalling',
      'Poor fuel consumption with no other symptom',
      'Intermittent cutting out that clears after the engine cools',
    ],
    'Not scheduled. Replaced on failure. Crankshaft and camshaft position sensors are the most commonly needed same-day electrical lines.',
    [
      'The exact sensor and its location, since engines carry several similar-looking sensors',
      'Connector type and pin count',
      'Engine code, because sensors differ across engine families',
      'That the wiring and connector have been checked before condemning the sensor',
    ],
    [
      {
        q: 'My fault code names a sensor. Is the sensor definitely faulty?',
        a: 'No. The code identifies the circuit reporting implausible data, which includes the wiring, connector and ECU input. Inspect the connector for corrosion and the loom for chafing before replacing the sensor.',
      },
      {
        q: 'Why will the engine not start when the crankshaft sensor fails?',
        a: 'The ECU uses crankshaft position to time ignition and injection. Without that signal it does not know where the pistons are, so it will not fire the injectors or coils at all.',
      },
    ],
  ),
  pt(
    'fuses',
    'Fuses and Relays',
    'electrical-sensors',
    'Fuses protect electrical circuits by failing deliberately when current exceeds a safe level. Relays let a small switch control a high-current circuit such as a fuel pump or headlights.',
    'A fuse contains a thin element that melts and breaks the circuit under excessive current, protecting the wiring from overheating. A relay uses a low-current coil to close a set of high-current contacts.',
    [
      'A single electrical component that has stopped working entirely',
      'A fuse that blows again immediately after replacement, indicating a short',
      'A clicking from the relay box with no result',
      'Intermittent operation of a circuit, often a failing relay',
    ],
    'Not scheduled. Replaced when they fail. A fuse that blows repeatedly is reporting a fault elsewhere and should not simply be uprated.',
    [
      'Correct amperage rating, which must never be increased',
      'Physical fuse type, whether standard, mini or cartridge',
      'Relay pin configuration and coil voltage',
      'Whether the circuit has been checked for a short before refitting',
    ],
    [
      {
        q: 'Why does my fuse keep blowing?',
        a: 'A repeatedly blowing fuse is reporting a short or an overload in the circuit it protects. Fitting a higher-rated fuse removes the protection and puts the wiring at risk of a fire. Find the fault instead.',
      },
      {
        q: 'Can I fit a higher amperage fuse?',
        a: 'No. The rating is chosen to protect the wiring in that circuit. A higher-rated fuse lets the wiring, rather than the fuse, become the weakest point.',
      },
    ],
  ),
  pt(
    'distributors',
    'Distributors and Ignition',
    'electrical-sensors',
    'A distributor routes high-voltage current from the ignition coil to the correct spark plug at the correct moment. It is found on older engines; modern engines use coil-on-plug systems instead, with no moving distributor cap.',
    'A rotor arm turning inside the distributor cap passes high-tension current to each plug lead in firing order. Timing is set by the distributor’s position relative to the camshaft drive.',
    [
      'Misfire under load or at higher revs',
      'Difficult starting, especially in damp weather',
      'Rough idle or backfiring',
      'Visible tracking marks or carbon lines inside the cap',
    ],
    'Caps and rotor arms are wear items on distributor engines, commonly replaced at major service intervals along with leads and plugs.',
    [
      'Engine code and the number of cylinders',
      'Whether cap, rotor arm or the complete distributor is required',
      'Lead set type and length',
      'Whether the ignition timing will need resetting after fitting',
    ],
    [
      {
        q: 'Why does my car misfire in the rain?',
        a: 'Moisture on a cracked distributor cap or perished leads lets high-tension current track to earth instead of reaching the plug. It is one of the clearest signs the cap and leads are due.',
      },
      {
        q: 'Should the cap, rotor and leads be replaced together?',
        a: 'Yes. They form the high-tension circuit and age together. Replacing one and leaving the others usually means returning to the job shortly afterwards.',
      },
    ],
  ),

  // ── Suspension and steering ───────────────────────────────────────────────
  pt(
    'bushings',
    'Suspension Bushings',
    'suspension-steering',
    'Suspension bushings are the rubber or polyurethane mountings between suspension components and the vehicle body. They allow controlled movement while absorbing vibration and road noise, and perish with age and mileage.',
    'Each bush lets a suspension arm pivot through its arc while resisting movement in other directions. That resistance is what holds wheel geometry steady under braking and cornering.',
    [
      'A knocking or clunking over bumps',
      'Vague or wandering steering',
      'Uneven or feathered tyre wear',
      'Visible cracking, splitting or displacement of the rubber',
      'Alignment that will not hold its settings',
    ],
    'Not a scheduled item, but they perish with age and heat as well as with mileage. Inspect at every major service and whenever alignment will not hold.',
    [
      'Which arm or mounting the bush belongs to, since a single arm may use several',
      'Whether the bush is supplied separately or only as part of a complete arm',
      'Rubber or polyurethane, since polyurethane changes ride and noise',
      'That alignment is booked for after fitting',
    ],
    [
      {
        q: 'Can worn bushes cause uneven tyre wear?',
        a: 'Yes, and it is one of the most common causes. A worn bush lets wheel geometry shift under load, so the tyre scrubs rather than rolls, which shows as feathered or one-sided wear.',
      },
      {
        q: 'Are bushings sold separately or only with the arm?',
        a: 'It depends on the application. Some are pressed-in items available on their own; on others the manufacturer supplies only a complete arm. The branch will confirm which applies.',
      },
      {
        q: 'Is alignment needed after replacing bushes?',
        a: 'Yes. Any component that locates a wheel changes the geometry when replaced, and skipping alignment undoes the benefit of the repair.',
      },
    ],
  ),
  pt(
    'ball-joints',
    'Ball Joints',
    'suspension-steering',
    'A ball joint is the pivoting connection between the suspension arm and the wheel hub. It allows the wheel to steer and to move up and down while keeping it located.',
    'A ball and socket enclosed in a grease-filled rubber boot carries vehicle weight while permitting movement in several planes. The boot keeps grease in and water and grit out.',
    [
      'A knocking from the front over bumps or on turning',
      'Vague steering or a wandering feel at speed',
      'Uneven tyre wear on the inner or outer shoulder',
      'A split or perished boot with grease thrown around the area',
      'Play felt when the wheel is rocked with the vehicle raised',
    ],
    'Not scheduled. Replaced when play develops or when the boot has split and grease has been lost. A split boot means failure is coming even if there is no play yet.',
    [
      'Upper or lower joint, and left or right',
      'Whether it is supplied separately or only with a complete arm',
      'Taper size and thread',
      'That alignment is booked for after fitting',
    ],
    [
      {
        q: 'What happens if a ball joint fails completely?',
        a: 'The suspension arm separates from the hub and the wheel collapses inward. It is one of the few suspension failures that causes immediate loss of control, which is why any detected play should be dealt with promptly.',
      },
      {
        q: 'Does a split boot mean the joint needs replacing?',
        a: 'In practice yes. Once the boot splits, grease escapes and water and grit enter. The joint may still feel tight, but its life is now short.',
      },
    ],
  ),
  pt(
    'cv-joints',
    'CV Joints',
    'suspension-steering',
    'A constant velocity joint transmits drive from the gearbox to the wheel at a steady speed while the wheel steers and moves up and down. Front-wheel-drive vehicles use one at each end of each driveshaft.',
    'The joint allows the driveshaft to turn through an angle without the speed fluctuation a simple universal joint would produce. A rubber boot retains the specialised grease and excludes contamination.',
    [
      'A rhythmic clicking on full lock at low speed, typically the outer joint',
      'A vibration or shudder under acceleration, typically the inner joint',
      'Grease thrown around the inside of the wheel arch',
      'A split or perished CV boot',
    ],
    'Not scheduled. Boot condition determines joint life, so inspect boots at every service. A joint with an intact boot commonly outlasts the vehicle.',
    [
      'Inner or outer joint, and which side',
      'Whether the joint is supplied alone or as a complete driveshaft',
      'Spline count and shaft diameter',
      'Whether ABS provision is integrated into the joint',
    ],
    [
      {
        q: 'What does a failing CV joint sound like?',
        a: 'A rhythmic clicking or knocking on full lock at low speed, for example when turning into a parking bay. It comes from the outer joint and gets louder as wear progresses.',
      },
      {
        q: 'Can I just replace the CV boot?',
        a: 'Yes, if you catch it before contamination reaches the joint. Once grit has entered and the joint has run dry, replacing the boot alone only delays the inevitable.',
      },
      {
        q: 'Is it better to replace the joint or the whole driveshaft?',
        a: 'A complete shaft is often barely more expensive once labour is counted, and it replaces both joints and both boots at once. Ask the branch to price both ways.',
      },
    ],
  ),
  pt(
    'steering-columns',
    'Steering Columns and Couplers',
    'suspension-steering',
    'The steering column connects the steering wheel to the steering rack, using universal joints and a flexible coupler to route the shaft around the engine bay while transmitting driver input.',
    'Rotation from the steering wheel passes down the column through one or more joints to the rack pinion. The column also carries the ignition switch, indicator stalks and often collapses in a frontal impact.',
    [
      'A knocking or notchy feel through the steering wheel',
      'Free play at the wheel before the road wheels respond',
      'A clunk from the bulkhead area when turning',
      'Stiffness or binding at certain steering angles',
    ],
    'Not scheduled. Couplers and universal joints are replaced when play or notchiness develops.',
    [
      'Whether the coupler, a joint, or the complete column is required',
      'Spline count at both ends',
      'Whether the vehicle has electric power steering integrated into the column',
      'Steering wheel and road wheels must be centred before removal',
    ],
    [
      {
        q: 'What causes play in the steering wheel?',
        a: 'Worn column universal joints or a perished flexible coupler are common causes, along with wear in the rack itself or in the track rod ends. Have the whole path checked rather than replacing one component on a guess.',
      },
      {
        q: 'Why does electric power steering change the part?',
        a: 'On many vehicles the assist motor and torque sensor are built into the column, which makes it a different and more expensive assembly that may also need coding after fitting.',
      },
    ],
  ),

  // ── Filters ───────────────────────────────────────────────────────────────
  pt(
    'air-filters',
    'Air Filters',
    'filters',
    'An air filter removes dust and grit from the air entering the engine, protecting the bores, rings and airflow sensor from abrasive contamination.',
    'Incoming air passes through a pleated paper or synthetic element that traps particles before the air reaches the throttle body and cylinders.',
    [
      'Reduced power under load, particularly on climbs',
      'A visibly dirty or clogged element on inspection',
      'Airflow sensor fault codes caused by a damaged element',
      'A whistling or roaring intake noise',
    ],
    'Typically every second service, and more often on gravel or dusty routes. Inspect rather than working to distance alone.',
    [
      'Engine code, because the same model may have several intake variants',
      'Element shape, whether panel, round or conical',
      'Whether the vehicle is used on gravel, which shortens the interval',
    ],
    [
      {
        q: 'Can I clean an air filter instead of replacing it?',
        a: 'Tapping loose dust out of a paper element buys a little time, but it does not restore the element and compressed air will damage the paper. Standard paper filters are replacement items.',
      },
      {
        q: 'How often should the air filter be changed on dusty roads?',
        a: 'Considerably more often than the service schedule suggests. On regular gravel use, inspect at every oil service and replace whenever the element is visibly loaded.',
      },
    ],
  ),
  pt(
    'fuel-filters',
    'Fuel Filters',
    'filters',
    'A fuel filter removes rust, dirt and water from fuel before it reaches the injectors, protecting the injection system from contamination and wear.',
    'Fuel passes through a fine filter medium that traps particles. Diesel filters usually add a water separator, because water in a diesel injection system causes rapid damage.',
    [
      'Loss of power under load or on a climb',
      'Hesitation or surging at steady speed',
      'Difficult starting or extended cranking',
      'Stalling that clears after the vehicle stands',
    ],
    'Typically every second service on petrol, and more frequently on diesel where water separation matters. Always replace alongside a fuel pump.',
    [
      'Petrol or diesel, since the filters are not interchangeable',
      'Whether the filter is inline or in-tank',
      'Whether a water sensor is integrated into the housing',
      'Correct sealing washers, which should not be reused',
    ],
    [
      {
        q: 'What happens if the fuel filter is never changed?',
        a: 'It gradually restricts flow, which starves the engine under load and forces the fuel pump to work harder against the restriction. The pump usually fails before the driver notices the filter.',
      },
      {
        q: 'Why do diesel fuel filters need draining?',
        a: 'Diesel filters separate water from the fuel and collect it in a bowl. If it is not drained, water passes through to the injection system, where it causes corrosion and rapid wear.',
      },
    ],
  ),
  pt(
    'cabin-filters',
    'Cabin and Aircon Filters',
    'filters',
    'A cabin filter cleans the air entering the passenger compartment through the ventilation and air conditioning system, trapping dust, pollen and road grime.',
    'Air drawn in by the blower passes through a pleated element before reaching the vents. Activated carbon versions also absorb odours.',
    [
      'Reduced airflow from the vents at all fan speeds',
      'A musty or stale smell when the fan is switched on',
      'Windows misting more readily than they used to',
      'A visibly dirty element on inspection',
    ],
    'Roughly annually, and more often on dusty or gravel routes. It is among the most commonly overlooked service items.',
    [
      'Element dimensions and the filter location, which is often behind the glovebox',
      'Standard or activated carbon',
      'Whether the vehicle has one or two elements',
    ],
    [
      {
        q: 'Why does my air conditioning smell musty?',
        a: 'Usually a saturated cabin filter combined with moisture on the evaporator. Replacing the filter is the first step, and treating the evaporator deals with what remains.',
      },
      {
        q: 'Does a blocked cabin filter affect the air conditioning?',
        a: 'Yes. It restricts airflow across the evaporator, which reduces cooling performance and makes the system work harder for the same result.',
      },
    ],
  ),
  pt(
    'oil-filters',
    'Oil Filters',
    'filters',
    'An oil filter removes metal particles and combustion by-products from engine oil before it reaches the bearings, protecting the engine from abrasive wear.',
    'Oil from the pump passes through the filter medium before reaching the oil galleries. A bypass valve maintains flow if the filter blocks, and an anti-drainback valve keeps oil in the filter when the engine stops.',
    [
      'There are rarely direct symptoms, which is why the filter is replaced on schedule',
      'A rattle on cold start can indicate a failed anti-drainback valve',
      'Low oil pressure warnings if the filter is severely blocked',
    ],
    'At every oil service without exception. It is the least expensive insurance against bearing wear in the entire service.',
    [
      'Engine code, since the same model may use several filters',
      'Whether the application uses a spin-on canister or a cartridge element',
      'That the correct sealing ring is supplied with a cartridge',
    ],
    [
      {
        q: 'Can I reuse an oil filter for a second service?',
        a: 'No. The medium is loaded with the contaminants it captured, and a blocked filter opens its bypass valve, which then sends unfiltered oil straight to the bearings.',
      },
      {
        q: 'Why does a cheap oil filter matter?',
        a: 'The valves inside it do the work you never see. A failed anti-drainback valve lets oil drain back to the sump when the engine stops, so the next cold start runs briefly without oil pressure.',
      },
    ],
  ),

  // ── Transmission and clutch ───────────────────────────────────────────────
  pt(
    'clutch-kits',
    'Clutch Kits',
    'transmission-clutch',
    'A clutch kit is the matched set of parts that connects and disconnects engine power from the gearbox in a manual vehicle. A standard kit contains the friction disc, the pressure plate and the release bearing.',
    'The pressure plate clamps the friction disc against the flywheel, locking engine and gearbox together. Pressing the pedal moves the release bearing against the pressure plate fingers, releasing that clamp so gears can be changed.',
    [
      'Engine revs rising without matching acceleration, most obvious under load in a high gear',
      'A clutch pedal that bites very high or very low in its travel',
      'Difficulty selecting gears, particularly first and reverse',
      'A burning smell after hill starts or heavy traffic',
      'Judder as the clutch takes up',
    ],
    'Not a fixed interval. Life depends heavily on use, and a clutch in stop-start city traffic or towing work will wear far faster than one on open roads.',
    [
      'Engine code and gearbox type, since a model may use several clutch sizes',
      'Disc diameter and spline count',
      'Whether the flywheel is solid or dual-mass',
      'Whether a concentric slave cylinder is fitted, which is replaced at the same time',
      'Flywheel surface condition while the gearbox is out',
    ],
    [
      {
        q: 'What is included in a clutch kit?',
        a: 'A standard three-piece kit contains the friction disc, the pressure plate or cover assembly, and the release bearing. Some applications also include a pilot bearing or an alignment tool. Confirm contents with the branch when ordering.',
      },
      {
        q: 'Can I replace only the clutch disc?',
        a: 'It is possible but rarely sensible. The pressure plate and release bearing have worn alongside the disc and the labour to reach them is identical, so replacing all three is the only version of the job you do once.',
      },
      {
        q: 'Should the flywheel be replaced or machined with a new clutch?',
        a: 'Inspect it while the gearbox is out, because that is the only time it is accessible. A scored or heat-checked surface will destroy a new disc. Solid flywheels can often be machined; dual-mass flywheels are measured for free play and replaced rather than machined.',
      },
      {
        q: 'How long does a clutch last?',
        a: 'There is no reliable figure, because driving style dominates. Vehicles used mainly in heavy traffic, on hills, or for towing may need a clutch at well under half the mileage of one used mostly on open roads.',
      },
    ],
  ),
  pt(
    'clutch-discs-covers',
    'Clutch Discs and Covers',
    'transmission-clutch',
    'The clutch disc is the friction plate that transmits engine torque to the gearbox input shaft. The cover, or pressure plate, is the spring assembly that clamps it against the flywheel.',
    'The disc sits between the flywheel and the pressure plate, splined to the gearbox input shaft. Diaphragm springs in the cover provide clamping force, and releasing that force disconnects the drive.',
    [
      'Slipping under load with rising revs and no acceleration',
      'Judder or shudder as the clutch engages',
      'A high or inconsistent bite point',
      'Difficulty engaging gears',
    ],
    'Replaced together as part of a clutch job rather than individually. Life depends on use rather than on a set interval.',
    [
      'Disc diameter and spline count',
      'Whether the disc is sprung or rigid hub',
      'Cover clamp load matched to the application',
      'Whether the release bearing is being replaced at the same time, which it should be',
    ],
    [
      {
        q: 'Can the disc and cover be replaced without the release bearing?',
        a: 'They can, but it is the classic false economy. The bearing is the cheapest item in the assembly and the most common reason a clutch job has to be repeated.',
      },
      {
        q: 'What causes clutch judder?',
        a: 'Contamination of the friction surface by oil from a leaking rear main or gearbox input seal, a distorted flywheel face, or worn engine and gearbox mountings. Fitting a new disc without finding the cause repeats the fault.',
      },
    ],
  ),
  pt(
    'clutch-cables',
    'Clutch Cables',
    'transmission-clutch',
    'A clutch cable mechanically connects the clutch pedal to the release mechanism on vehicles that do not use a hydraulic system. It transmits pedal movement to the release fork.',
    'Pressing the pedal pulls the inner cable through its outer sheath, moving the release fork which pushes the release bearing against the pressure plate.',
    [
      'A clutch pedal that has become heavy or notchy',
      'A bite point that keeps changing or moves lower over time',
      'A pedal that stays on the floor after being pressed',
      'Complete loss of clutch operation from a snapped cable',
    ],
    'Not scheduled. Replaced when the cable frays, stretches beyond adjustment, or snaps. Cables typically give warning through a heavier pedal.',
    [
      'Cable length and end fitting type, which vary within a model range',
      'Whether the vehicle is left or right hand drive',
      'Whether the application has automatic or manual adjustment',
      'Whether a new cable will need adjusting after fitting',
    ],
    [
      {
        q: 'Can a clutch cable be adjusted instead of replaced?',
        a: 'Adjustment compensates for normal stretch and clutch wear, and is the right first step. Once the adjuster reaches the end of its travel, or the inner cable has begun to fray, replacement is the only fix.',
      },
      {
        q: 'What are the warning signs before a clutch cable snaps?',
        a: 'A pedal that has become progressively heavier or notchy, and a bite point that keeps needing adjustment. Both mean the cable is fraying inside its sheath.',
      },
    ],
  ),
  pt(
    'clutch-release-bearings',
    'Clutch Release Bearings',
    'transmission-clutch',
    'The clutch release bearing, also called the thrust bearing, presses against the pressure plate fingers when the clutch pedal is pressed, releasing the clamp so gears can be changed.',
    'It allows the non-rotating release fork to act on the rotating pressure plate. On many modern vehicles it is combined with the slave cylinder as a concentric unit inside the bellhousing.',
    [
      'A rumbling or whirring noise that appears when the pedal is pressed and stops when released',
      'A grinding felt through the pedal',
      'Noise at idle in neutral that changes when the pedal is touched',
      'Difficulty disengaging the clutch fully',
    ],
    'Replaced as part of every clutch kit without exception. It is the least expensive item in the assembly and the most common cause of a repeated clutch job.',
    [
      'Whether the application uses a conventional bearing or a concentric slave cylinder',
      'Bearing outside diameter and guide sleeve type',
      'That it is being replaced alongside the disc and cover',
    ],
    [
      {
        q: 'Why does the release bearing have to be replaced with the clutch?',
        a: 'Because it has worn alongside the disc and cover, and reaching it means removing the gearbox. Reusing a bearing that still turns quietly on the bench is the single most common reason a workshop repeats a clutch job under its own warranty.',
      },
      {
        q: 'What does a failing release bearing sound like?',
        a: 'A rumbling or whirring that appears as the pedal goes down and disappears when it is released. If the noise is present with the pedal up and changes when pressed, suspect the gearbox input shaft bearing instead.',
      },
    ],
  ),

  // ── Cooling ───────────────────────────────────────────────────────────────
  pt(
    'radiators',
    'Radiators',
    'cooling-system',
    'The radiator transfers heat from the engine coolant to the air passing through it, keeping the engine within its operating temperature range.',
    'Hot coolant from the engine flows through a core of narrow tubes and fins. Airflow from vehicle movement or the cooling fan carries the heat away, and the cooled coolant returns to the engine.',
    [
      'The temperature gauge reading higher than normal, especially in traffic or on climbs',
      'Coolant loss with visible staining or crust around the core or end tanks',
      'Steam or a sweet smell from the engine bay',
      'Visible damage to the core fins from road debris',
      'Coolant that looks rusty or has debris in it',
    ],
    'Not scheduled. Replaced after damage, internal blockage or a leak, most commonly at the crimp between an aluminium core and a plastic end tank.',
    [
      'Engine code and whether the vehicle has air conditioning',
      'Manual or automatic transmission, since automatics often route cooler lines through the radiator',
      'Core dimensions and inlet and outlet positions',
      'Whether the condenser has also been damaged, since they share airflow',
    ],
    [
      {
        q: 'Can a radiator be repaired rather than replaced?',
        a: 'Older copper and brass cores can often be repaired. Most modern radiators use aluminium cores with plastic end tanks and are replaced instead, because the usual failure point is the crimp joint between the two.',
      },
      {
        q: 'Why does the branch ask whether the vehicle has air conditioning?',
        a: 'Because air-conditioned vehicles frequently use a different radiator specification and a different fan arrangement to cope with the additional heat load from the condenser sitting in the same airflow.',
      },
    ],
  ),
  pt(
    'radiator-caps',
    'Radiator Caps',
    'cooling-system',
    'A radiator cap seals the cooling system and holds it at a set pressure, which raises the boiling point of the coolant well above 100 degrees. It is a small part with a large influence on overheating.',
    'A spring-loaded valve holds pressure until it reaches the cap’s rating, then vents to the expansion tank. A second valve lets coolant return as the system cools.',
    [
      'Overheating with no visible leak and a healthy radiator',
      'Coolant loss into the expansion tank with none returning',
      'Boiling or bubbling in the expansion tank',
      'A collapsed radiator hose after the engine cools',
    ],
    'Inexpensive and easily overlooked. Worth replacing whenever the cooling system is opened, and always when investigating unexplained overheating.',
    [
      'The correct pressure rating, which is stamped on the original cap',
      'Cap type and neck size, since they are not universal',
      'Whether the cap sits on the radiator or on the expansion tank',
    ],
    [
      {
        q: 'Can a faulty radiator cap cause overheating?',
        a: 'Yes, and it is one of the most commonly missed causes. Without correct system pressure the coolant boils at a temperature the engine would otherwise handle without difficulty.',
      },
      {
        q: 'Does the pressure rating matter?',
        a: 'Very much. Too low and the coolant boils early. Too high and you risk stressing hoses, the radiator core and the heater matrix. Always match the original rating.',
      },
    ],
  ),
  pt(
    'condensers',
    'Condensers',
    'cooling-system',
    'The air conditioning condenser sheds heat from the refrigerant after it leaves the compressor, converting it from a hot gas back into a liquid. It sits in front of the radiator in the airflow.',
    'High-pressure refrigerant gas passes through the condenser core, where airflow removes heat and the gas condenses to liquid before continuing to the expansion valve and evaporator.',
    [
      'Air conditioning that blows cool rather than cold, worst in slow traffic',
      'Visible damage or bent fins on the front face',
      'Oily residue around the core or connections, indicating a refrigerant leak',
      'High-pressure faults reported during air conditioning diagnosis',
    ],
    'Not scheduled. Replaced after impact damage from road debris, corrosion, or a leak. Its exposed position makes it vulnerable.',
    [
      'Whether the receiver drier is integrated or separate, since it is replaced with the condenser',
      'Refrigerant type used by the system',
      'Core dimensions and connection positions',
      'Whether the radiator behind it has also been damaged',
    ],
    [
      {
        q: 'Should the receiver drier be replaced with the condenser?',
        a: 'Yes. Once the system has been opened to atmosphere the drier has absorbed moisture and can no longer protect the system. On many vehicles it is integrated into the condenser anyway.',
      },
      {
        q: 'Why is my air conditioning worse in traffic?',
        a: 'At low speed the condenser depends entirely on the cooling fan for airflow. A blocked or damaged condenser, or a fan that is not running, shows up first in slow traffic and improves once the vehicle is moving.',
      },
    ],
  ),
  pt(
    'fans-motors',
    'Cooling Fans and Motors',
    'cooling-system',
    'The cooling fan draws air through the radiator and condenser when the vehicle is stationary or moving too slowly for natural airflow to do the job.',
    'An electric motor drives the fan, switched by a temperature sensor or controlled by the ECU. Many vehicles run the fan whenever air conditioning is switched on, regardless of engine temperature.',
    [
      'Overheating in traffic that clears once the vehicle is moving',
      'Air conditioning that only cools properly at road speed',
      'The fan audibly not running when the engine is hot',
      'A fan that runs constantly from key-on, indicating a failed switch or relay',
    ],
    'Not scheduled. Replaced on motor failure, or when a resistor pack, relay or switch fails.',
    [
      'Whether the fault is the motor, the resistor pack, the relay or the switch',
      'Whether the fan is supplied with the shroud as an assembly',
      'Single or twin fan configuration',
      'Connector type and number of speeds',
    ],
    [
      {
        q: 'Why does the car only overheat in traffic?',
        a: 'Because at low speed there is no natural airflow through the radiator and the fan is doing all the work. Overheating that clears once you are moving points squarely at the fan circuit.',
      },
      {
        q: 'Is it the fan motor or the switch?',
        a: 'Bridging the switch or applying power directly to the motor separates the two in a minute. A motor that runs when powered directly means the fault is in the switch, relay or wiring.',
      },
    ],
  ),

  // ── Fuel system ───────────────────────────────────────────────────────────
  pt(
    'fuel-pumps',
    'Fuel Pumps',
    'fuel-system',
    'The fuel pump delivers fuel from the tank to the engine at the pressure the injection system requires. Most modern vehicles use an electric pump mounted inside the fuel tank, cooled by the fuel around it.',
    'An electric motor drives an impeller that draws fuel through a strainer and pushes it up the fuel line to the rail. Surrounding fuel cools and lubricates the motor, which is why running low on fuel shortens pump life.',
    [
      'Extended cranking before the engine starts',
      'Loss of power under load or on a climb',
      'Stalling that clears after the vehicle stands for a while',
      'A whine from the tank area that is louder than usual',
      'The engine cranking normally but not firing at all',
    ],
    'Not scheduled. Replaced on failure. Life is shortened considerably by habitually running the tank near empty.',
    [
      'Whether a pump alone or a complete module with sender and strainer is required',
      'Required pressure and flow rating for the application',
      'Engine code, since pressure differs between petrol and diesel and across variants',
      'That the fuel filter is replaced at the same time',
    ],
    [
      {
        q: 'What are the signs of a failing fuel pump?',
        a: 'Extended cranking before starting, hesitation or power loss under load, and stalling that clears once the vehicle has stood. A tank whine louder than normal often precedes all of them.',
      },
      {
        q: 'Does running the tank low damage the fuel pump?',
        a: 'Yes. The pump is cooled and lubricated by the fuel around it, so running persistently near empty makes it run hotter and wear faster. It is one of the most avoidable causes of pump failure.',
      },
      {
        q: 'Should the fuel filter be replaced with the pump?',
        a: 'Always. A restricted filter is frequently what killed the original pump, and fitting a new pump behind it loads the new unit from the first minute.',
      },
    ],
  ),
  pt(
    'fuel-tanks',
    'Fuel Tanks',
    'fuel-system',
    'The fuel tank stores fuel and houses the pump, level sender and associated plumbing. Tanks are made from moulded plastic or pressed steel depending on the application.',
    'The tank holds fuel and manages vapour through a venting system. Baffles inside limit fuel movement under braking and cornering so the pump pickup stays submerged.',
    [
      'A fuel smell around the vehicle or a visible leak',
      'Physical damage from an impact or grounding',
      'Corrosion on steel tanks, particularly around the seams',
      'Fuel level readings that behave erratically',
    ],
    'Not scheduled. Replaced after impact damage, corrosion or a leak.',
    [
      'Tank capacity and whether the vehicle is two or four wheel drive, which often changes tank shape',
      'Steel or plastic construction',
      'Whether the sender and pump transfer across or are supplied with it',
      'Correct straps, seals and mounting hardware',
    ],
    [
      {
        q: 'Can a leaking fuel tank be repaired?',
        a: 'Steel tanks can sometimes be repaired professionally after proper purging, which is specialist work. Plastic tanks are generally replaced, because a reliable repair is difficult and the consequences of failure are severe.',
      },
      {
        q: 'Does the fuel pump transfer to a new tank?',
        a: 'Usually yes, if it is in good order. Since the tank is already out and access is free, it is worth inspecting the pump and strainer at the same time.',
      },
    ],
  ),
  pt(
    'fuel-caps',
    'Fuel Caps',
    'fuel-system',
    'The fuel cap seals the filler neck, containing fuel vapour and keeping contamination out. On modern vehicles it forms part of the sealed evaporative emissions system.',
    'The cap seals against the filler neck and often includes a pressure relief valve. The evaporative system monitors that seal, which is why a loose or perished cap sets a fault code.',
    [
      'The engine warning light with an evaporative system fault code',
      'A fuel smell around the filler area',
      'A cap that no longer clicks when tightened',
      'A perished or hardened seal',
    ],
    'Not scheduled, but the seal perishes with age and heat. Among the cheapest causes of a warning light.',
    [
      'Whether the cap is locking or non-locking',
      'Thread type and diameter, which vary within a model range',
      'Whether the vehicle needs a vented or sealed cap',
    ],
    [
      {
        q: 'Can a loose fuel cap trigger the engine warning light?',
        a: 'Yes, and it is one of the most common causes. The evaporative system tests itself for leaks, and a cap that is loose or has a perished seal fails that test and sets a fault code.',
      },
      {
        q: 'Will the warning light clear on its own after tightening the cap?',
        a: 'Often it will, after the system has completed several successful self-tests over a few drive cycles. If it persists, the seal itself has likely failed.',
      },
    ],
  ),
  pt(
    'fuel-senders',
    'Fuel Senders',
    'fuel-system',
    'The fuel sender measures how much fuel is in the tank and reports it to the gauge. It uses a float on an arm connected to a variable resistor.',
    'As the fuel level changes the float arm moves, altering resistance in the sender. The instrument cluster converts that resistance into the reading shown on the gauge.',
    [
      'A fuel gauge that reads permanently full or empty',
      'A needle that jumps around erratically',
      'A gauge that stops updating at a certain level',
      'A low fuel warning that never illuminates, or never goes out',
    ],
    'Not scheduled. Replaced when the resistive track wears or the float fails.',
    [
      'Whether the sender is separate or part of the complete pump module',
      'Resistance range, which differs between manufacturers',
      'Tank shape and arm length for the specific application',
    ],
    [
      {
        q: 'Why does my fuel gauge read incorrectly?',
        a: 'Most often a worn resistive track inside the sender, which is why the gauge frequently misreads around a particular level where the wiper spends most of its time. A float that has taken on fuel will read permanently low.',
      },
      {
        q: 'Is the sender replaced separately from the pump?',
        a: 'It depends on the vehicle. On many applications the sender and pump form one module and are supplied together. The branch will confirm which applies.',
      },
    ],
  ),

  // ── Body and trim ─────────────────────────────────────────────────────────
  pt(
    'bumpers',
    'Bumpers',
    'body-trim',
    'A bumper is the moulded front or rear covering that absorbs minor impacts and carries lamps, sensors and grilles. Most modern bumpers are plastic covers over an internal reinforcement bar, not a structural part itself.',
    'The visible cover manages airflow and appearance while an internal beam and crush cans absorb impact energy. The cover also mounts fog lamps, parking sensors and cameras.',
    [
      'Impact damage, cracking or deformation',
      'Broken mounting tabs causing sagging or misalignment',
      'Faded or heavily stone-chipped finish',
      'Damaged sensor housings after a knock',
    ],
    'Not a wear item. Replaced after impact damage or when mounting points have broken beyond repair.',
    [
      'Front or rear, and the exact model year including facelift',
      'Trim level, since fog lamp and grille provision differ',
      'Parking sensor and camera cut-outs',
      'Whether the part is supplied primed or unpainted',
      'Whether brackets and absorbers are included',
    ],
    [
      {
        q: 'Do bumpers come painted?',
        a: 'Generally no. Bumpers are usually supplied in primer ready for preparation and paint. Confirm the finish when quoting so the paint cost is in the customer figure from the start.',
      },
      {
        q: 'Why does trim level matter for a bumper?',
        a: 'Because fog lamp provision, grille shape, parking sensor cut-outs and facelift changes all alter the moulding. Two vehicles with the same model name and year can take completely different bumpers.',
      },
    ],
  ),
  pt(
    'body-panels',
    'Body Panels',
    'body-trim',
    'Body panels are the structural and cosmetic outer sections of the vehicle body, including doors, wings, bonnets and tailgates.',
    'Panels form the visible shape of the vehicle and, in the case of structural panels, contribute to body rigidity and crash performance.',
    [
      'Accident damage, dents or creasing',
      'Rust perforation, most commonly along lower edges and wheel arches',
      'Damaged or distorted mounting points',
      'Panel gaps that cannot be adjusted out',
    ],
    'Not a wear item. Replaced after accident damage or corrosion.',
    [
      'Exact model year and whether pre or post facelift',
      'Left or right hand drive, which changes some panels',
      'Whether the panel is supplied primed',
      'Provision for mirrors, trim, sensors and mouldings',
    ],
    [
      {
        q: 'Are body panels supplied ready to fit?',
        a: 'They arrive as bare or primed steel and require preparation, paint and often the transfer of trim, handles and wiring from the old panel. Allow for that in the quote.',
      },
      {
        q: 'Why does the branch need the exact build year?',
        a: 'Because facelifts change panel shape and mounting points, often mid model year. A panel that is right for the model name can still be wrong for the specific vehicle.',
      },
    ],
  ),
  pt(
    'body-mouldings',
    'Body Mouldings',
    'body-trim',
    'Body mouldings are the plastic or rubber strips fitted along doors, sills and wheel arches to protect paintwork from impacts and to finish the vehicle’s appearance.',
    'Mouldings take minor knocks in car parks and shield paint edges from stone chips. They are usually clipped or bonded to the panel.',
    [
      'Mouldings that have come loose or detached',
      'Faded, chalky or cracked plastic',
      'Missing clips causing rattles or lifted edges',
      'Corrosion appearing on the panel beneath a lifted moulding',
    ],
    'Not scheduled. Replaced when damaged, faded, or lost.',
    [
      'Exact position on the vehicle, since front and rear doors differ',
      'Left or right side',
      'Whether the moulding is colour-coded, textured or chrome',
      'Whether the clips are supplied or ordered separately',
    ],
    [
      {
        q: 'Do mouldings come with fitting clips?',
        a: 'Not always. Clips are frequently a separate line and are usually single-use, so ask the counter to add them to the same order rather than discovering they are missing on the job.',
      },
      {
        q: 'Can a faded moulding be restored instead of replaced?',
        a: 'Trim restorers can improve lightly faded plastic for a time. Once the surface is chalky or cracked, replacement is the only lasting fix.',
      },
    ],
  ),
  pt(
    'door-handles',
    'Door Handles',
    'body-trim',
    'A door handle is the external or internal lever that operates the door latch. External handles are a high-wear item and one of the most frequently replaced trim components.',
    'The handle pulls a rod or cable that releases the latch. Many external handles also house the lock barrel or a keyless entry sensor.',
    [
      'A handle that has snapped or cracked, often at the pivot',
      'A door that will not open from outside but opens from inside',
      'A handle that feels loose or has excessive travel',
      'Keyless entry that no longer responds on one door',
    ],
    'Not scheduled, but a genuine wear item. Failures rise sharply on higher-mileage vehicles, particularly on the driver’s door.',
    [
      'Which door, and inner or outer handle',
      'Whether the handle is colour-coded or black',
      'Whether it houses a lock barrel or a keyless sensor',
      'Whether the vehicle has keyless entry, which changes the part',
    ],
    [
      {
        q: 'Why do door handles break so often?',
        a: 'They are operated many times a day, are usually moulded plastic, and sit in full sun. Heat cycling makes the plastic brittle over time, and the driver’s door fails first because it is used most.',
      },
      {
        q: 'Does the new handle come with a lock barrel?',
        a: 'Usually not, and if it does the key will differ. The original barrel is normally transferred so the vehicle keeps one key. Confirm with the branch when ordering.',
      },
    ],
  ),
  pt(
    'emblems',
    'Emblems and Badges',
    'body-trim',
    'Emblems and badges are the manufacturer and model identifiers fitted to the exterior of the vehicle, usually attached with adhesive or clips.',
    'Badges identify the make, model and sometimes the trim or engine variant. Some front badges also conceal radar or camera housings.',
    [
      'A badge that has come loose or been lost',
      'Faded, peeling or discoloured finish',
      'Damage following a respray or accident repair',
    ],
    'Not a wear item. Replaced when lost, damaged or during cosmetic restoration.',
    [
      'Exact model and trim designation',
      'Position on the vehicle, since front and rear badges differ',
      'Finish, whether chrome, gloss black or colour-coded',
      'Whether new adhesive pads or clips are required',
    ],
    [
      {
        q: 'How are badges attached?',
        a: 'Most use double-sided automotive adhesive, some use clips through the panel. Adhesive-mounted badges need the old adhesive removed and the surface cleaned before fitting a new one.',
      },
      {
        q: 'Will a new badge match the faded ones on my car?',
        a: 'A new badge will usually look brighter than surrounding badges that have aged in the sun. If appearance matters, replacing the set gives a consistent result.',
      },
    ],
  ),

  // ── Bearings ──────────────────────────────────────────────────────────────
  pt(
    'wheel-bearings',
    'Wheel Bearings',
    'bearings',
    'A wheel bearing supports the vehicle’s weight while allowing the wheel to rotate with minimal friction. It is a safety-critical component and a common source of driving noise, usually a droning hum that changes with speed.',
    'The bearing sits between the stationary hub carrier and the rotating wheel hub, carrying both vertical load and cornering forces while keeping the wheel accurately located.',
    [
      'A droning or humming that rises and falls with road speed',
      'Noise that changes in volume when the vehicle is loaded through a corner',
      'Play felt when the wheel is rocked with the vehicle raised',
      'ABS warning lights, where the sensor ring is integrated',
      'A vibration through the floor or steering at speed',
    ],
    'Not scheduled. Replaced when noise or play develops. Water ingress and impact damage from potholes are common causes.',
    [
      'Whether the application uses a pressed-in bearing or a complete sealed hub assembly',
      'Whether an ABS sensor ring is integrated',
      'Front or rear, and driven or non-driven',
      'Whether a new hub nut is required, since these are usually single-use',
    ],
    [
      {
        q: 'What does a bad wheel bearing sound like?',
        a: 'A droning or humming that follows road speed rather than engine speed. The giveaway is that it changes as you load the axle through a corner, because cornering shifts weight across the bearings.',
      },
      {
        q: 'How do I know which wheel the noise is coming from?',
        a: 'Gently swerving side to side at moderate speed loads each side in turn. The noise typically gets louder when weight moves onto the failing bearing, which is the opposite side to the direction of the turn.',
      },
      {
        q: 'Is it safe to drive with a noisy wheel bearing?',
        a: 'Not for long. A bearing that has started to break up can seize or allow the hub to move enough to affect steering and braking. Treat a droning bearing as a job to book immediately.',
      },
    ],
  ),
  pt(
    'hub-bearings',
    'Hub Bearings and Assemblies',
    'bearings',
    'A hub bearing assembly combines the wheel bearing, hub flange and often the ABS sensor ring into a single sealed unit that bolts to the suspension upright.',
    'The assembly carries the wheel and its loads on a pre-sealed bearing that requires no adjustment or packing. Many include the magnetic encoder ring the ABS sensor reads.',
    [
      'Droning or humming that varies with road speed',
      'ABS or traction control warning lights',
      'Play at the wheel when rocked',
      'A grinding or rumbling from one corner',
    ],
    'Not scheduled. Replaced as a complete unit when noise, play or an ABS fault develops.',
    [
      'Number of stud holes and the bolt pattern',
      'Whether an ABS encoder is integrated, and its orientation',
      'Front or rear, and driven or non-driven',
      'Correct torque specification, which is critical on these assemblies',
    ],
    [
      {
        q: 'Why does a failed hub bearing trigger the ABS light?',
        a: 'Because on many assemblies the magnetic encoder ring the ABS sensor reads is built into the bearing seal. As the bearing fails, that ring is damaged or the gap changes, and the sensor signal becomes unreliable.',
      },
      {
        q: 'Can the bearing be replaced separately from the hub?',
        a: 'On a sealed hub assembly, no. It is supplied and replaced as one unit, which is more expensive as a part but considerably quicker to fit and needs no press work.',
      },
    ],
  ),
  pt(
    'alternator-bearings',
    'Alternator Bearings',
    'bearings',
    'Alternator bearings support the rotor shaft inside the alternator. They are a common cause of alternator noise and can often be replaced instead of the complete unit.',
    'A bearing at each end of the rotor allows it to spin at high speed under belt tension. Heat and continuous high rotational speed make them a wear point.',
    [
      'A whine or growl that follows engine speed',
      'A rumbling from the alternator that persists with the belt removed and the pulley spun by hand',
      'Roughness or play felt when turning the pulley by hand',
      'A squeal that changes with electrical load',
    ],
    'Not scheduled. Replaced when noise develops, frequently as a cheaper alternative to a complete alternator.',
    [
      'Alternator make and part number, since bearings are specific to the unit',
      'Front and rear bearing sizes, which usually differ',
      'Whether the unit uses a one-way clutch pulley that should be checked at the same time',
    ],
    [
      {
        q: 'Can I replace just the alternator bearing instead of the whole alternator?',
        a: 'Often yes, and it is a fraction of the cost. If the charging output is correct and the noise is mechanical, a bearing replacement is usually the right repair. Bring the alternator details to the counter.',
      },
      {
        q: 'How do I know the noise is the alternator and not the belt?',
        a: 'Remove the belt and spin the alternator pulley by hand. Roughness or rumble points at the bearings. If it spins smoothly and quietly, look at the belt, tensioner or another driven component.',
      },
    ],
  ),
  pt(
    'starter-bearings',
    'Starter Bearings and Bushes',
    'bearings',
    'Starter bearings and bushes support the armature shaft inside the starter motor, keeping it centred as it spins the engine during starting.',
    'The armature spins at high speed under considerable load for short bursts. Bushes at each end keep it aligned, and wear there lets the armature contact the field windings.',
    [
      'A grinding or whirring during cranking',
      'A starter that engages intermittently',
      'Slow cranking with a healthy battery',
      'Visible wear or scoring on the armature shaft',
    ],
    'Not scheduled. Replaced during starter overhaul, often alongside brushes and the solenoid contacts.',
    [
      'Starter make and part number',
      'Whether the repair kit includes brushes and solenoid contacts',
      'Whether overhaul or replacement is the better value for the application',
    ],
    [
      {
        q: 'Is it worth overhauling a starter rather than replacing it?',
        a: 'It often is, particularly where brushes and bushes are the only worn items. Compare the kit price against a replacement unit with the branch, because on some applications a new starter is barely more.',
      },
      {
        q: 'What causes starter bushes to wear?',
        a: 'Repeated high-load starting, heat, and contamination. Vehicles doing many short journeys with frequent starts wear them faster than those doing long runs.',
      },
    ],
  ),

  // ── Gaskets and seals ─────────────────────────────────────────────────────
  pt(
    'cylinder-head-gaskets',
    'Cylinder Head Gaskets',
    'gaskets-seals',
    'The cylinder head gasket seals the joint between the engine block and the cylinder head, containing combustion pressure while keeping oil and coolant passages separate.',
    'It must hold combustion pressure in each cylinder while sealing coolant and oil galleries that pass between block and head, through constant heat cycling and expansion.',
    [
      'White sweet-smelling exhaust smoke',
      'Coolant loss with no external leak',
      'Oil that has turned milky or a mayonnaise deposit under the oil cap',
      'Bubbling in the expansion tank with the engine running',
      'Overheating that returns after the cooling system is repaired',
    ],
    'Not scheduled. Replaced after failure, which is almost always a consequence of overheating or a distorted mating face.',
    [
      'Engine code from the block',
      'Gasket thickness or grade, where the manufacturer supplies several',
      'That the head has been checked for flatness and skimmed if needed',
      'Whether head bolts are torque-to-yield and therefore single-use',
    ],
    [
      {
        q: 'What causes a head gasket to fail?',
        a: 'Overheating is the overwhelming cause. It distorts the head, which breaks the seal. Fitting a new gasket without finding out why the engine overheated is how the same failure happens again.',
      },
      {
        q: 'Does the head need skimming when the gasket is replaced?',
        a: 'Check it every time. Since most failures follow an overheat, and an overheat is what warps the head, a flatness check is the difference between a repair that lasts and one that does not.',
      },
      {
        q: 'Do head bolts need to be replaced?',
        a: 'On most modern engines, yes. Torque-to-yield bolts are designed to stretch permanently as they are tightened and cannot be reliably reused.',
      },
    ],
  ),
  pt(
    'intake-exhaust-gaskets',
    'Intake and Exhaust Gaskets',
    'gaskets-seals',
    'Intake and exhaust gaskets seal the manifolds to the cylinder head, keeping unmetered air out of the intake and exhaust gas inside the exhaust system.',
    'The intake gasket maintains a sealed path for metered air. The exhaust gasket must hold a gas-tight seal under extreme heat cycling and vibration.',
    [
      'A ticking or blowing noise from the manifold area, loudest on cold start',
      'Rough idle or a lean running fault code, from an intake leak',
      'A smell of exhaust gas in the engine bay or cabin',
      'Soot deposits around the manifold joint',
    ],
    'Not scheduled. Replaced whenever a manifold is removed, and when a leak develops.',
    [
      'Engine code from the block',
      'Intake or exhaust, since they are different materials',
      'Whether the manifold studs and nuts should be replaced, as they corrode badly',
      'Whether the manifold face needs checking for flatness',
    ],
    [
      {
        q: 'What does an exhaust manifold leak sound like?',
        a: 'A rhythmic ticking or puffing that is loudest on cold start and often quietens as the metal expands and partially closes the gap. It usually rises with engine speed.',
      },
      {
        q: 'Can an intake leak cause a fault code?',
        a: 'Yes. Air entering after the airflow sensor is unmetered, so the mixture runs lean and the ECU logs a lean running or fuel trim fault.',
      },
    ],
  ),
  pt(
    'gasket-kits',
    'Gasket Kits',
    'gaskets-seals',
    'A gasket kit is a matched set of gaskets and seals for a specific engine, supplied for a defined scope of work such as a head overhaul or a full rebuild.',
    'Kits group every gasket and seal needed for a given job so nothing is missing mid-strip. Contents differ significantly between head sets, decarbonising sets and full sets.',
    [
      'Not a diagnostic item. Ordered when the scope of an engine job is known',
      'Oil or coolant leaks at multiple joints suggest a wider overhaul',
    ],
    'Ordered by job rather than by interval. Confirm the scope before ordering so the kit matches the work.',
    [
      'Engine code from the block',
      'Which kit type the job needs: head set, decarbonising set or full set',
      'Whether head bolts are included or ordered separately',
      'Whether crankshaft and camshaft oil seals are in the kit',
    ],
    [
      {
        q: 'What is the difference between a head set and a full gasket set?',
        a: 'A head set covers the cylinder head and its immediate joints. A full set adds sump, timing cover and crankshaft seals for a complete strip. Ordering the wrong one stops the job halfway.',
      },
      {
        q: 'Are head bolts included in a gasket kit?',
        a: 'Usually not. They are commonly a separate line and, on torque-to-yield applications, are single-use. Ask the counter to add them.',
      },
    ],
  ),

  // ── Belts and chains ──────────────────────────────────────────────────────
  pt(
    'chain-belts',
    'Drive Belts',
    'belts-chains',
    'The drive belt, also called the auxiliary or serpentine belt, transfers power from the crankshaft to the alternator, water pump, power steering pump and air conditioning compressor.',
    'A single ribbed belt routed around several pulleys, held at correct tension by a spring-loaded or manually adjusted tensioner.',
    [
      'A squeal on start-up or when steering at full lock',
      'Visible cracking, glazing or missing ribs',
      'The battery warning light, if the belt is slipping on the alternator',
      'Overheating, if the belt drives the water pump',
      'A chirping that follows engine speed',
    ],
    'Inspect at every service and replace at manufacturer intervals or on visible cracking. It is inexpensive relative to what it drives.',
    [
      'Engine code and whether the vehicle has air conditioning, which changes belt length',
      'Number of ribs and overall length',
      'Whether the tensioner and idler pulleys should be replaced at the same time',
    ],
    [
      {
        q: 'What happens if the drive belt breaks?',
        a: 'You lose everything it drives at once: charging, power steering assistance and, on many engines, the water pump. If the water pump is belt-driven the engine will overheat within minutes, so stop rather than continue.',
      },
      {
        q: 'Should the tensioner be replaced with the belt?',
        a: 'It is strongly advised. A weak tensioner lets a new belt slip and squeal, and the labour to reach it is already spent while the belt is off.',
      },
    ],
  ),
  pt(
    'timing-chains-assemblies',
    'Timing Chain Assemblies',
    'belts-chains',
    'A timing chain assembly is the complete set of chain, tensioner, guides and sprockets that keeps the crankshaft and camshafts synchronised.',
    'The chain drives the camshafts from the crankshaft. The hydraulic tensioner maintains correct tension and the guides control the chain path so it does not slap or jump a tooth.',
    [
      'A rattle from the timing cover on cold start',
      'Camshaft and crankshaft correlation fault codes',
      'Rough running, misfire or loss of power',
      'A rattle on sudden throttle changes',
    ],
    'Not a fixed interval on most engines, but chain stretch and guide wear are common at higher mileage. Any cold-start rattle should be investigated immediately.',
    [
      'Engine code from the block',
      'Whether the kit includes tensioner, guides and sprockets',
      'Whether the engine is an interference design',
      'Whether the timing cover gasket and front crankshaft seal are needed',
    ],
    [
      {
        q: 'Should the whole timing kit be replaced or just the chain?',
        a: 'Replace the assembly. Chain, guides and tensioner wear together, and the labour to reach them is identical, so fitting a new chain against worn guides simply brings the next failure forward.',
      },
      {
        q: 'What does a stretched timing chain sound like?',
        a: 'A rattle from the front of the engine on cold start, before oil pressure fills the tensioner. It typically quietens after a few seconds, which is exactly why it gets ignored.',
      },
    ],
  ),
  pt(
    'belt-covers',
    'Belt Covers',
    'belts-chains',
    'Belt covers are the plastic or metal shields that protect timing belts and chains from dirt, water and road debris, and prevent contact with other components.',
    'The cover encloses the timing drive, keeping contamination away from the belt and retaining oil where the cover forms part of a sealed timing case.',
    [
      'Cracked, broken or missing cover sections',
      'Rattling or buzzing from the timing area',
      'Debris or water visibly reaching the belt',
      'Oil leaks where the cover forms part of the seal',
    ],
    'Not a wear item. Replaced when damaged, or when broken during another timing job.',
    [
      'Engine code, and upper or lower cover section',
      'Whether the cover is supplied with its seals and fasteners',
      'Whether the cover is structural or purely a shield',
    ],
    [
      {
        q: 'Does a missing belt cover matter?',
        a: 'Yes. It keeps grit, water and oil off the belt. Running without one significantly shortens belt life and risks debris getting between belt and sprocket, which can jump the timing.',
      },
      {
        q: 'Do belt covers come with new fasteners?',
        a: 'Not always. The mounting bolts and any seals are frequently separate lines, so ask the counter to include them when ordering.',
      },
    ],
  ),

  // ── Accessories ───────────────────────────────────────────────────────────
  pt(
    'general-accessories',
    'General Accessories and Hardware',
    'accessories',
    'General accessories and fitment hardware are the clips, fasteners, brackets and consumables that complete a repair, the small items that hold up a job when they are missing.',
    'These are the single-use clips, trim fasteners, sealing washers and brackets that are damaged on removal and are not supplied with the main component.',
    [
      'Broken clips or fasteners found during a strip',
      'Rattles or loose trim after a repair',
      'Missing hardware preventing a job from being completed',
    ],
    'Ordered alongside the main component for the job rather than held against a schedule.',
    [
      'Which job is being done, so the counter can advise on commonly damaged hardware',
      'Vehicle make and model for clip and fastener types',
      'Quantity required, since these are usually single-use',
    ],
    [
      {
        q: 'Can fitment hardware be ordered with the main part?',
        a: 'Yes, and it is worth doing every time. Tell the counter which job you are doing and they will add the clips and fasteners that are commonly destroyed on removal.',
      },
      {
        q: 'Why can trim clips not be reused?',
        a: 'Most are designed to deform as they lock into place and to break rather than release when removed. A reused clip rarely holds properly, which is where the rattle comes from.',
      },
    ],
  ),
]

export const PART_TYPES: PartType[] = RAW_PART_TYPES.map((t) => ({
  ...t,
  singular: SINGULARS[t.slug] ?? t.label.toLowerCase(),
}))

export const CERTIFICATIONS = [
  { label: 'ISO 9001', detail: 'Quality management. PMC and Car-Dex lines.' },
  { label: 'TS 16949', detail: 'Automotive quality standard. PMC and Car-Dex lines.' },
  { label: 'ISO 14001', detail: 'Environmental management. Dashi line.' },
  { label: 'TecDoc', detail: 'Verified parts-data supplier since 2013.' },
]

export type Brand = {
  slug: string
  label: string
  tier: 'private' | 'oem'
  note: string
  /** Real logo, sourced directly from Parts-Mall Corporation's own site.
   * Left unset for brands with no discoverable official logo asset — those
   * fall back to the typographic treatment rather than an invented mark. */
  logo?: string
}

export const BRANDS: Brand[] = [
  { slug: 'pmc', label: 'PMC', tier: 'private', note: 'Parts-Mall’s flagship line for fast-moving replacement parts.', logo: '/images/brands/pmc-official.jpg' },
  { slug: 'car-dex', label: 'CAR-DEX', tier: 'private', note: 'Suspension parts for Korean vehicle applications.', logo: '/images/brands/car-dex-official.jpg' },
  { slug: 'dashi', label: 'DASHI', tier: 'private', note: 'Reconditioned electrical and replacement components.', logo: '/images/brands/dashi-official.jpg' },
  { slug: 'ex-trim-car-body-parts', label: 'EX-TRIM CAR BODY PARTS', tier: 'private', note: 'Body panels and exterior replacement parts.', logo: '/images/brands/ex-trim-official.png' },
  { slug: 'parts-mall-essence', label: 'PARTS-MALL ESSENCE', tier: 'private', note: 'Premium Parts-Mall line for selected replacement parts.', logo: '/images/brands/pmc-essence-official.jpg' },
  { slug: 'wingster', label: 'Wingster', tier: 'private', note: 'Friction and braking components for demanding use.', logo: '/images/brands/wingster-official.png' },
  { slug: 'a-gist', label: 'A-GIST', tier: 'private', note: 'Premium replacement parts for Korean vehicle applications.', logo: '/images/brands/a-gist-official.png' },
  { slug: 'mando', label: 'MANDO', tier: 'private', note: 'Korean automotive replacement parts.', logo: '/images/brands/mando-official.png' },
]

// ── Lookups ────────────────────────────────────────────────────────────────

export function getCategory(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug)
}

export function getPartType(slug: string) {
  return PART_TYPES.find((t) => t.slug === slug)
}

export function typesInCategory(slug: string) {
  return PART_TYPES.filter((t) => t.category === slug)
}

/** The category a part type belongs to. */
export function categoryOfType(typeSlug: string) {
  const type = getPartType(typeSlug)
  return type ? getCategory(type.category) : undefined
}
