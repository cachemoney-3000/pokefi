// ─── Cache ────────────────────────────────────────────────────────────────────
export const CACHE_KEY    = 'pokemonCache';
export const CACHE_TTL    = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
export const INITIAL_COUNT = 20;
export const BATCH_SIZE   = 50;

// ─── Colors ───────────────────────────────────────────────────────────────────
export const COLOR_SURFACE          = '#1c1c1e';
export const COLOR_TEXT_DARK        = '#111';
export const FALLBACK_ACCENT_COLOR  = '#A8A77A';

export const TYPE_COLOR_MAP = {
	normal:   '#A8A77A',
	fire:     '#EE8130',
	water:    '#6390F0',
	electric: '#f2ab0c',
	grass:    '#7AC74C',
	ice:      '#96D9D6',
	fighting: '#C22E28',
	poison:   '#A33EA1',
	ground:   '#E2BF65',
	flying:   '#A98FF3',
	psychic:  '#F95587',
	bug:      '#A6B91A',
	rock:     '#B6A136',
	ghost:    '#735797',
	dragon:   '#6F35FC',
	dark:     '#705746',
	steel:    '#B7B7CE',
	fairy:    '#D685AD',
};

export const GENRE_COLOR_MAP = {
	'pop':         '#A8A77A',
	'hard-rock':   '#EE8130',
	'edm':         '#6390F0',
	'dance':       '#f2ab0c',
	'indie':       '#7AC74C',
	'chill':       '#96D9D6',
	'work-out':    '#C22E28',
	'metal':       '#A33EA1',
	'hip-hop':     '#E2BF65',
	'r-n-b':       '#A98FF3',
	'trip-hop':    '#F95587',
	'reggae':      '#A6B91A',
	'punk-rock':   '#B6A136',
	'classical':   '#735797',
	'soundtracks': '#6F35FC',
	'blues':       '#705746',
	'metalcore':   '#B7B7CE',
	'folk':        '#D685AD',
};

// Maps each Pokémon type to a verified Spotify genre seed
export const TYPE_GENRE_MAP = {
	normal:   'pop',
	fire:     'hard-rock',
	water:    'edm',
	electric: 'dance',
	grass:    'indie',
	ice:      'chill',
	fighting: 'work-out',
	poison:   'metal',
	ground:   'hip-hop',
	flying:   'r-n-b',
	psychic:  'trip-hop',
	bug:      'reggae',
	rock:     'punk-rock',
	ghost:    'classical',
	dragon:   'soundtracks',
	dark:     'blues',
	steel:    'metalcore',
	fairy:    'folk',
};

export const DEFAULT_GENRE = 'pop';

// ─── Generations ──────────────────────────────────────────────────────────────
export const GENERATION_RANGES = [
	{ maxId: 151, label: 'Gen I'   },
	{ maxId: 251, label: 'Gen II'  },
	{ maxId: 386, label: 'Gen III' },
	{ maxId: 493, label: 'Gen IV'  },
	{ maxId: 649, label: 'Gen V'   },
	{ maxId: 721, label: 'Gen VI'  },
	{ maxId: 809, label: 'Gen VII' },
	{ maxId: 905, label: 'Gen VIII'},
];
export const GEN_FALLBACK_LABEL = 'Gen IX';

// ID ceiling above which animated GIFs are not available
export const GIF_MAX_POKEMON_ID = 649;

// ─── Stats ────────────────────────────────────────────────────────────────────
export const BST_CEILING          = 720; // reference ceiling for the strength bar (legendary tier)
export const STAT_MAX             = 255; // highest possible single stat value
export const HEIGHT_WEIGHT_DIVISOR = 10; // PokéAPI stores height/weight in decimetres/hectograms
export const STAT_FALLBACK        = '—';

export const STAT_DISPLAY_NAMES = {
	'special-attack':  'Sp. Atk',
	'special-defense': 'Sp. Def',
};

// ─── Sprite URLs ──────────────────────────────────────────────────────────────
export const SPRITE_BASE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

// ─── Sprite dimensions (px) ───────────────────────────────────────────────────
export const SPRITE_SIZE_PX              = 96;
export const SPRITE_CONTAINER_HEIGHT_PX  = 64;
export const SPRITE_TOP_OFFSET_PX        = -48;
export const HP_BADGE_SIZE_PX            = 56;

// ─── Strings ──────────────────────────────────────────────────────────────────
export const ELLIPSIS          = '…';
export const ARTIST_SEPARATOR  = ', ';

// ─── Layout ───────────────────────────────────────────────────────────────────
export const POPUP_MAX_HEIGHT           = '90vh';
export const TABLET_BREAKPOINT_PX       = 1024;

export const TRACK_NAME_MAX_CHARS_MOBILE  = 38;
export const TRACK_NAME_MAX_CHARS_DESKTOP = 52;
export const ARTIST_MAX_CHARS_MOBILE      = 40;
export const ARTIST_MAX_CHARS_DESKTOP     = 55;
