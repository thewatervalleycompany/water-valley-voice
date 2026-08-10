export interface Episode {
  slug: string;
  number: string;
  part?: string;
  label: string;
  kicker: string;
  title: string;
  seoTitle: string;
  teaser: string;
  metaDescription: string;
  playerTitle: string;
  playerSrc: string;
  publishedDate: string;
  duration: string;
  durationLabel: string;
  guests: string[];
  podbeanUrl: string;
  audioUrl: string;
  description: string[];
}

export const episodes: Episode[] = [
  {
    slug: "episode-1",
    number: "01",
    label: "Episode 1",
    kicker: "The origin story",
    title: "From Mud Lake to Million-Dollar Waterfronts: The Water Valley Story",
    seoTitle: "Episode 1: The Water Valley Story | Water Valley Voice",
    teaser:
      "A sweeping origin story about Martin Lind’s belief that empty fields and gravel pits could become a valley of water, homes, golf, and community.",
    metaDescription:
      "Hear Martin Lind tell the Water Valley origin story—from gravel pits and bold engineering to lakes, golf, neighborhoods, and a lasting family legacy.",
    playerTitle: "E1: From Mud Lake to Million-Dollar Waterfronts: The Water Valley Story",
    playerSrc:
      "https://www.podbean.com/player-v2/?i=52war-1afb28c-pb&from=pb6admin&pbad=0&share=1&download=1&rtl=0&fonts=Arial&skin=f6f6f6&font-color=auto&logo_link=episode_page&btn-skin=8bbb4e",
    publishedDate: "2026-06-26",
    duration: "PT30M51S",
    durationLabel: "30 min 51 sec",
    guests: ["Martin Lind"],
    podbeanUrl: "https://watervalleyvoice.podbean.com/e/watervalleyvoice-e1-p1-audio/",
    audioUrl: "https://mcdn.podbean.com/mf/web/defsfpcd7zqrep8u/E1_p1_V3.mp3",
    description: [
      "Imagine driving by a stretch of empty fields and gravel pits and seeing not a problem, but a promise. In this episode, Marissa sits down with her father, Martin Lind, and we move through time—from a dusty auction day when a young farmer ran out of luck to the stubborn, joyful building of an entire valley of water, homes, and community. Martin tells the story in his own voice: the risk of going broke, the odd partnerships, the relentless belief that those ugly mining holes could become shimmering lakes.",
      "You’ll hear the gritty details—how a chance transaction with Kodak and an aggressive market created the urgency to mine millions of yards of earth, how a $65,000 waterfront lot that once seemed impossible sold and became worth millions, and how the team learned to sculpt lakes so they looked like nature had carved them ages ago. This is a tale about engineering and tenacity: the flood that ripped through a fairway before the grass had grown, and the 2013 Front Range catastrophe that washed out entire towns but left Water Valley untouched because of foresight and tireless civil work.",
      "Interwoven with the big moves are the small, unforgettable moments—a baby in a car seat on a dusty road, Tim McGraw and Faith Hill hitting the first balls on the new golf course, a white pelican circling during the groundbreaking as if it were all planned. You’ll laugh at the nicknames, feel the sting of the 2008 recession when the team traded dreams for a jet to stay afloat, and shake your head at the serendipity that linked Martin with Fred Funk, the unlikely architect whose passion and small stature belied grand golf-design ideas.",
      "Listen as Martin explains Rain Dance—the high, dry canvas they called ‘worthless’ until someone joked that they would need to do a rain dance to move water uphill—and Cascadia, the vision of cascading ponds and preserved western heritage. You’ll learn why they left wide fairways along the river, why pelicans became part of the landscape, and how orchard plots, recessed sidewalks, and community design choices were made to honor Windsor’s past while building for the future.",
      "This episode is more than a business case study; it’s a human story of stubborn optimism, creative problem-solving, and family legacy. From dirt and gravel to championship golf and thriving neighborhoods, Martin’s recollections are full of tension, humor, and quiet pride. Whether you live in a lake house or just love a good origin story, this conversation pulls you into the slow, spectacular alchemy of turning a valley into a life.",
      "Join us to hear how Water Valley was named, how Pelican Lakes got its birds, why engineering won the day against a 500-year flood, and what the future holds—Cascadia, community farms, trails, and a continuing commitment to craft places that feel like they were always meant to be. By the end, you’ll understand why this was never just land and water, but a vision passed from father to daughter—and out into a whole town.",
    ],
  },
  {
    slug: "episode-1-part-2",
    number: "01",
    part: "Part 2",
    label: "Episode 1 · Part 2",
    kicker: "The people shaping Water Valley",
    title: "Introduction to Mandy, Chris, Kurt, and Ryan",
    seoTitle: "E1 Part 2: Mandy, Chris, Kurt & Ryan | Water Valley Voice",
    teaser:
      "Meet four leaders whose stories, careers, and creativity continue to shape the Water Valley Company and the Northern Colorado community.",
    metaDescription:
      "Meet Mandy Oberholzer, Chris Williamson, Kurt Hinkle, and Ryan Bach and hear how their careers, creativity, and relationships help shape Water Valley.",
    playerTitle: "E1 Part 2: Introduction to Mandy, Chris, Kurt, and Ryan",
    playerSrc:
      "https://www.podbean.com/player-v2/?i=n79rk-1b0f75c-pb&from=pb6admin&pbad=0&share=1&download=1&rtl=0&fonts=Arial&skin=f6f6f6&font-color=auto&logo_link=episode_page&btn-skin=8bbb4e",
    publishedDate: "2026-07-13",
    duration: "PT44M46S",
    durationLabel: "44 min 46 sec",
    guests: ["Mandy Oberholzer", "Chris Williamson", "Kurt Hinkle", "Ryan Bach"],
    podbeanUrl: "https://watervalleyvoice.podbean.com/e/episode1_part2/",
    audioUrl: "https://mcdn.podbean.com/mf/web/6ic9uxtnfvfhewzh/E1_p2.mp3",
    description: [
      "In this episode of Water Valley Voice, host Marissa Donahoo sits down with several of the people whose stories and careers have helped shape the Water Valley Company and the Northern Colorado community.",
      "Mandy Oberholzer shares her journey from South Africa to Colorado and discusses her evolving role creating unforgettable events, hospitality offerings, and the new Signature Experience. PGA Director of Golf Chris Williamson explores what makes RainDance National, Pelican Lakes, and The Falls unique while sharing his vision for the future of golf at Water Valley. Kurt Hinkle reflects on his Windsor roots and his path from journalism and marketing to membership and tournament sales. Colorado Eagles President Ryan Bach recounts his remarkable evolution from the team’s inaugural goaltender to a leader responsible for building a successful organization and world-class fan experience.",
      "Together, their conversations offer an inside look at the people, creativity, culture, and long-standing relationships driving Water Valley forward—and the ambitious experiences still to come.",
    ],
  },
  {
    slug: "episode-1-part-3",
    number: "01",
    part: "Part 3",
    label: "Episode 1 · Part 3",
    kicker: "Family, hospitality, and community",
    title: "Family, Fairways & Flavor: Inside Windsor’s Grainhouse, Sandbar and Ted’s",
    seoTitle: "E1 Part 3: Grainhouse, Sandbar & Ted’s | Water Valley Voice",
    teaser:
      "Go behind the menus to meet the people who make Water Valley’s restaurants feel like home—and hear how grit, chance, and community shaped each place.",
    metaDescription:
      "Meet the people behind Windsor’s Grainhouse, Sandbar, Ted’s Backyard, and the Lodge and hear how food, family, and community shape Water Valley hospitality.",
    playerTitle: "E1 Part3: Family, Fareways & Flavor: Inside Windsor’s Grainhouse, Sandbar and Ted’s",
    playerSrc:
      "https://www.podbean.com/player-v2/?i=46vsa-1b221ba-pb&from=pb6admin&pbad=0&share=1&download=1&rtl=0&fonts=Arial&skin=f6f6f6&font-color=auto&logo_link=episode_page&btn-skin=8bbb4e",
    publishedDate: "2026-07-29",
    duration: "PT25M43S",
    durationLabel: "25 min 43 sec",
    guests: ["Jesse Wilson", "Shane Stringer", "Wyatt", "Taylor"],
    podbeanUrl: "https://watervalleyvoice.podbean.com/e/e1p3/",
    audioUrl: "https://mcdn.podbean.com/mf/web/m54qqu6ewra6z6pe/E1_p3_edited_85ln7.mp3",
    description: [
      "Step into Water Valley through the voices of the people who make its restaurants hum. In this episode, we move beyond menus and into stories: Jesse Wilson welcomes guests into the Grainhouse with a proud, kid-friendly roar; Shane Stringer reflects on the Sandbar’s convertible energy—golf carts-as-booths, simulators and long-time staff; Wyatt walks us through the rebirth of Ted’s Backyard as the neighborhood’s go-to family grill; and Taylor, at only 26, reveals the Lodge’s gentle balance of fine dining and casual, sunset-lit moments. Each leader traces a path shaped by grit, chance and community.",
      "Listen as Jesse remembers starting as a dishwasher at 14 and building a place where every table looks like a family reunion. Hear the small, startling moments—a friend offering a job on the golf course, a grain bin turned restaurant—and how those chances turned into a Grain House that grew $600,000 in its first year and is on track for $1 million. Then meet Shane, whose 25 years in service whisper through the Sandbar’s remodels and long-tenured staff; his stories reveal why the bar feels like coming home and why winter is his next challenge to conquer.",
      "Wyatt’s account brings the new Ted’s Backyard to life: lakes, patios, a tractor spraying water, ducks and a menu made from scratch. He paints a portrait of a place built for growing families—where kids bike over for milkshakes and neighbors spill onto patios—and explains how the restaurant’s heart is its people and their paychecks and smiles. Taylor closes the circle with the Lodge’s skyline and small theatrical touches—the guides who lead your dining experience, the burrata you must try, and a team pushing guests to taste something new. Her quick rise is a hopeful note about youthful leadership and the possibilities in Windsor.",
      "Running through every conversation is a single thread: staff as family. Managers from every venue return to that same refrain—long-serving bartenders, servers who stay a decade, kitchens that mentor like kin. Together they show a hospitality model rooted less in slick branding and more in human connection: mentoring new cooks, hosting private breakfasts, reviving wedding events, and welcoming out-of-state golfers who stumbled on something special.",
      "Against the backdrop of COVID’s shakeups and rapid neighborhood growth, these leaders sketch plans for the future—more music, events, weddings, and a continued focus on authentic, scratch-made food. Whether it’s the novelty of a grain bin restaurant or the simple joy of baby ducklings beside your table, this episode invites listeners to meet the people behind the places and to feel the pulse of a community being shaped, one meal and one story at a time.",
    ],
  },
];

export const latestEpisode = episodes.at(-1)!;

export const episodePath = (episode: Episode) => `/episodes/${episode.slug}`;
