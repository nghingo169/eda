import React, { useState, useEffect } from 'react';
import PlotlyChart from 'react-plotly.js';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3, 
  ChevronDown, 
  ChevronRight, 
  Clipboard, 
  ClipboardCheck, 
  Database, 
  Info, 
  Layers, 
  LayoutDashboard, 
  LineChart, 
  Music, 
  PieChart, 
  Search, 
  Table,
  TrendingUp,
  Zap
} from 'lucide-react';
import { cn } from '../../lib/utils';
import audioProfileRadar from './data/audio_profile_radar.json';
import categoricalDistributionKey from './data/categorical_distribution_key.json';
import categoricalDistributionMode from './data/categorical_distribution_mode.json';
import distributionOfSongsByArtistCount from './data/distribution_of_songs_by_artist_count.json';
import distributionOfSongsPerArtist from './data/distribution_of_songs_per_artist.json';
import fridayPhenomenon from './data/friday_phenomenon.json';
import hitPredictorsCorrelation from './data/hit_predictors_correlation.json';
import musicFeaturesTrendOverTime from './data/music_features_trend_over_time.json';
import numericalAudioFeaturesDistribution from './data/numerical_audio_features_distribution.json';
import platformAnalysis from './data/platform_analysis.json';
import platformStreamCorrelation from './data/platform_stream_correlation.json';
import seasonalitySongsByMonth from './data/seasonality_songs_by_month.json';
import sonicMoodScatter from './data/sonic_mood_scatter.json';
import topArtistsByStreams from './data/top_artists_by_streams.json';

const SPOTIFY_PLOT_CONFIG_BASE = {
  displayModeBar: false,
  displaylogo: false,
  responsive: true,
} as const;

const normalizeSpotifyPlotLayout = (rawLayout: any) => {
  const layout = rawLayout && typeof rawLayout === 'object' ? { ...rawLayout } : {};
  const margin = layout.margin && typeof layout.margin === 'object' ? { ...layout.margin } : {};
  layout.margin = {
    l: Math.max(56, typeof margin.l === 'number' ? margin.l : 56),
    r: Math.max(24, typeof margin.r === 'number' ? margin.r : 24),
    t: Math.max(30, typeof margin.t === 'number' ? margin.t : 30),
    b: Math.max(64, typeof margin.b === 'number' ? margin.b : 64),
  };

  if (layout.legend?.orientation === 'h') {
    layout.margin.b = Math.max(layout.margin.b, 84);
  }

  for (const [key, value] of Object.entries(layout)) {
    if (!/^xaxis\d*$/.test(key) && !/^yaxis\d*$/.test(key)) continue;
    const axis = value && typeof value === 'object' ? { ...(value as Record<string, any>) } : {};
    const title =
      axis.title && typeof axis.title === 'object'
        ? { ...(axis.title as Record<string, any>) }
        : axis.title !== undefined
          ? { text: axis.title }
          : {};
    axis.automargin = true;
    axis.ticklabelstandoff = typeof axis.ticklabelstandoff === 'number' ? Math.max(axis.ticklabelstandoff, 6) : 6;
    if (title.text !== undefined) {
      const titleObj = title as Record<string, any>;
      titleObj.standoff = typeof titleObj.standoff === 'number' ? Math.max(titleObj.standoff, 18) : 18;
      axis.title = titleObj;
    }
    layout[key] = axis;
  }

  return layout;
};

const Plot = ({ layout, config, className, ...rest }: any) => (
  <div className="w-full rounded-2xl bg-white/80 p-2 pt-3 md:p-3 md:pt-4 ring-1 ring-zinc-200/70">
    <PlotlyChart
      {...rest}
      layout={normalizeSpotifyPlotLayout(layout)}
      config={{ ...SPOTIFY_PLOT_CONFIG_BASE, ...(config ?? {}) }}
      className={cn('w-full', className)}
    />
  </div>
);

const HIT_SONGS_SAMPLES = [
  { id: 648, track: 'MAMIII', artist: 'Karol G, Becky G', streams: '716,591,492', dance: 84, energy: 70 },
  { id: 159, track: 'Under The Influence', artist: 'Chris Brown', streams: '929,964,809', dance: 73, energy: 69 },
  { id: 6, track: 'Ella Baila Sola', artist: 'Eslabon Armado, Peso Pluma', streams: '725,980,112', dance: 67, energy: 76 },
  { id: 555, track: 'Dakiti', artist: 'Bad Bunny, Jhay Cortez', streams: '1,763,363,713', dance: 73, energy: 57 },
  { id: 591, track: 'Before You Go', artist: 'Lewis Capaldi', streams: '1,608,045,237', dance: 45, energy: 60 },
  { id: 41, track: 'Sunflower - Spider-Man: Into the Spider-Verse', artist: 'Post Malone, Swae Lee', streams: '2,808,096,550', dance: 76, energy: 50 },
  { id: 72, track: 'golden hour', artist: 'JVKE', streams: '751,134,527', dance: 51, energy: 59 },
  { id: 725, track: 'Closer', artist: 'The Chainsmokers, Halsey', streams: '2,591,224,264', dance: 75, energy: 52 },
  { id: 442, track: 'Last Christmas', artist: 'Wham!', streams: '1,159,176,109', dance: 74, energy: 65 },
  { id: 195, track: 'Have You Ever Seen The Rain?', artist: 'Creedence Clearwater Revival', streams: '1,145,727,611', dance: 74, energy: 70 },
];

const RAW_DATA_PREVIEW = [
  { track_name: 'Seven (feat. Latto) (Explicit Ver.)', artist_name: 'Latto, Jung Kook', artist_count: 2, released_year: 2023, released_month: 7, released_day: 14, in_spotify_playlists: 553, in_spotify_charts: 147, streams: '141,381,703', in_apple_playlists: 43, bpm: 125, key: 'B', mode: 'Major', danceability: 80, valence: 89, energy: 83, acousticness: 31, instrumentalness: 0, liveness: 8, speechiness: 4 },
  { track_name: 'LALA', artist_name: 'Myke Towers', artist_count: 1, released_year: 2023, released_month: 3, released_day: 23, in_spotify_playlists: 1474, in_spotify_charts: 48, streams: '133,716,286', in_apple_playlists: 48, bpm: 92, key: 'C#', mode: 'Major', danceability: 71, valence: 61, energy: 74, acousticness: 7, instrumentalness: 0, liveness: 10, speechiness: 4 },
  { track_name: 'vampire', artist_name: 'Olivia Rodrigo', artist_count: 1, released_year: 2023, released_month: 6, released_day: 30, in_spotify_playlists: 1397, in_spotify_charts: 113, streams: '140,003,974', in_apple_playlists: 94, bpm: 138, key: 'F', mode: 'Major', danceability: 51, valence: 32, energy: 53, acousticness: 17, instrumentalness: 0, liveness: 31, speechiness: 6 },
  { track_name: 'Cruel Summer', artist_name: 'Taylor Swift', artist_count: 1, released_year: 2019, released_month: 8, released_day: 23, in_spotify_playlists: 7858, in_spotify_charts: 100, streams: '800,840,817', in_apple_playlists: 116, bpm: 170, key: 'A', mode: 'Major', danceability: 55, valence: 58, energy: 72, acousticness: 11, instrumentalness: 0, liveness: 11, speechiness: 15 },
  { track_name: 'WHERE SHE GOES', artist_name: 'Bad Bunny', artist_count: 1, released_year: 2023, released_month: 5, released_day: 18, in_spotify_playlists: 3133, in_spotify_charts: 50, streams: '303,236,322', in_apple_playlists: 84, bpm: 144, key: 'A', mode: 'Minor', danceability: 65, valence: 23, energy: 80, acousticness: 14, instrumentalness: 63, liveness: 11, speechiness: 6 },
  { track_name: 'Sprinter', artist_name: 'Dave, Central Cee', artist_count: 2, released_year: 2023, released_month: 6, released_day: 1, in_spotify_playlists: 2186, in_spotify_charts: 91, streams: '183,706,234', in_apple_playlists: 67, bpm: 141, key: 'C#', mode: 'Major', danceability: 92, valence: 66, energy: 58, acousticness: 19, instrumentalness: 0, liveness: 8, speechiness: 24 },
  { track_name: 'Ella Baila Sola', artist_name: 'Eslabon Armado, Peso Pluma', artist_count: 2, released_year: 2023, released_month: 3, released_day: 16, in_spotify_playlists: 3090, in_spotify_charts: 50, streams: '725,980,112', in_apple_playlists: 34, bpm: 148, key: 'F', mode: 'Minor', danceability: 67, valence: 83, energy: 76, acousticness: 48, instrumentalness: 0, liveness: 8, speechiness: 3 },
  { track_name: 'Columbia', artist_name: 'Quevedo', artist_count: 1, released_year: 2023, released_month: 7, released_day: 7, in_spotify_playlists: 714, in_spotify_charts: 43, streams: '58,149,378', in_apple_playlists: 25, bpm: 100, key: 'F', mode: 'Major', danceability: 67, valence: 26, energy: 71, acousticness: 37, instrumentalness: 0, liveness: 11, speechiness: 4 },
  { track_name: 'fukumean', artist_name: 'Gunna', artist_count: 1, released_year: 2023, released_month: 5, released_day: 15, in_spotify_playlists: 1096, in_spotify_charts: 83, streams: '95,217,315', in_apple_playlists: 60, bpm: 130, key: 'C#', mode: 'Minor', danceability: 85, valence: 22, energy: 62, acousticness: 12, instrumentalness: 0, liveness: 28, speechiness: 9 },
  { track_name: 'La Bebe - Remix', artist_name: 'Peso Pluma, Yng Lvcas', artist_count: 2, released_year: 2023, released_month: 3, released_day: 17, in_spotify_playlists: 2953, in_spotify_charts: 44, streams: '553,634,067', in_apple_playlists: 49, bpm: 170, key: 'D', mode: 'Minor', danceability: 81, valence: 56, energy: 48, acousticness: 21, instrumentalness: 0, liveness: 8, speechiness: 33 },
];

const TOP_10_METRICS = {
  acousticness: [
    { name: 'The Night We Met', artist: 'Lord Huron', val: '97%', streams: '1.41B' },
    { name: 'Sweet Nothing', artist: 'Taylor Swift', val: '97%', streams: '186M' },
    { name: 'What Was I Made For?', artist: 'Billie Eilish', val: '96%', streams: '30.5M' },
    { name: 'LA FAMA', artist: 'The Weeknd, ROSALÍA', val: '95%', streams: '374M' },
    { name: 'When I Was Your Man', artist: 'Bruno Mars', val: '94%', streams: '1.66B' },
    { name: 'Boyfriends', artist: 'Harry Styles', val: '94%', streams: '137M' },
    { name: 'lovely', artist: 'Billie Eilish, Khalid', val: '93%', streams: '2.35B' },
    { name: 'Miserable Man', artist: 'David Kushner', val: '93%', streams: '124M' },
    { name: 'All of Me', artist: 'John Legend', val: '92%', streams: '2.08B' },
    { name: 'The Joker And The Queen', artist: 'Ed Sheeran, Taylor Swift', val: '92%', streams: '146M' },
  ],
  bpm: [
    { name: 'Lover', artist: 'Taylor Swift', val: '206', streams: '882M' },
    { name: "We Don't Talk About Bruno", artist: 'Encanto Cast', val: '206', streams: '432M' },
    { name: 'Last Night', artist: 'Morgan Wallen', val: '204', streams: '429M' },
    { name: 'Until I Found You', artist: 'Stephen Sanchez', val: '202', streams: '726M' },
    { name: "It's the Most Wonderful Time", artist: 'Andy Williams', val: '202', streams: '663M' },
    { name: 'O.O', artist: 'NMIXX', val: '200', streams: '135M' },
    { name: 'People', artist: 'Libianca', val: '198', streams: '373M' },
    { name: 'La Corriente', artist: 'Bad Bunny', val: '196', streams: '479M' },
    { name: 'Un Finde', artist: 'Big One, FMK', val: '192', streams: '142M' },
    { name: 'Chale', artist: 'Eden Muñoz', val: '189', streams: '299M' },
  ],
  danceability: [
    { name: 'Peru', artist: 'Ed Sheeran, Fireboy DML', val: '96%', streams: '261M' },
    { name: 'Players', artist: 'Coi Leray', val: '95%', streams: '335M' },
    { name: 'The Real Slim Shady', artist: 'Eminem', val: '95%', streams: '1.42B' },
    { name: 'CAIRO', artist: 'Karol G', val: '95%', streams: '294M' },
    { name: 'Super Freaky Girl', artist: 'Nicki Minaj', val: '95%', streams: '428M' },
    { name: 'Starlight', artist: 'Dave', val: '95%', streams: '229M' },
    { name: 'Ai Preto', artist: 'L7nnon', val: '95%', streams: '176M' },
    { name: 'Slut Me Out', artist: 'NLE Choppa', val: '94%', streams: '190M' },
    { name: 'Gol Bolinha, Gol Quadrado 2', artist: 'Mc Pedrinho', val: '93%', streams: '11.9M' },
    { name: 'Shorty Party', artist: 'Cartel De Santa', val: '93%', streams: '162M' },
  ],
  energy: [
    { name: "I'm Good (Blue)", artist: 'Bebe Rexha, David Guetta', val: '97%', streams: '1.10B' },
    { name: 'Murder In My Mind', artist: 'Kordhell', val: '97%', streams: '448M' },
    { name: 'Tô Preocupado', artist: 'dennis, MC Kevin o Chris', val: '96%', streams: '111M' },
    { name: 'That That', artist: 'PSY, Suga', val: '96%', streams: '212M' },
    { name: 'Bombonzinho', artist: 'Israel & Rodolffo', val: '95%', streams: '263M' },
    { name: 'Idol', artist: 'YOASOBI', val: '94%', streams: '143M' },
    { name: 'Hype Boy', artist: 'NewJeans', val: '94%', streams: '363M' },
    { name: 'KICK BACK', artist: 'Kenshi Yonezu', val: '94%', streams: '210M' },
    { name: 'Merry Christmas', artist: 'Ed Sheeran, Elton John', val: '94%', streams: '135M' },
    { name: 'Every Angel is Terrifying', artist: 'The Weeknd', val: '94%', streams: '37.3M' },
  ],
  appleCharts: [
    { name: 'Last Last', artist: 'Burna Boy', val: '275', streams: '293M' },
    { name: 'Mary On A Cross', artist: 'Ghost', val: '266', streams: '387M' },
    { name: 'Seven (feat. Latto)', artist: 'Latto, Jung Kook', val: '263', streams: '141M' },
    { name: 'What Was I Made For?', artist: 'Billie Eilish', val: '227', streams: '30.5M' },
    { name: 'Ella Baila Sola', artist: 'Eslabon Armado', val: '222', streams: '725M' },
    { name: 'Flowers', artist: 'Miley Cyrus', val: '215', streams: '1.31B' },
    { name: 'Sprinter', artist: 'Dave, Central Cee', val: '213', streams: '183M' },
    { name: 'Cupid - Twin Ver.', artist: 'Fifty Fifty', val: '212', streams: '496M' },
    { name: 'fukumean', artist: 'Gunna', val: '210', streams: '95.2M' },
    { name: 'vampire', artist: 'Olivia Rodrigo', val: '207', streams: '140M' },
  ],
  applePlaylists: [
    { name: 'Blinding Lights', artist: 'The Weeknd', val: '672', streams: '3.70B' },
    { name: 'One Kiss', artist: 'Calvin Harris, Dua Lipa', val: '537', streams: '1.89B' },
    { name: 'Dance Monkey', artist: 'Tones and I', val: '533', streams: '2.86B' },
    { name: "Don't Start Now", artist: 'Dua Lipa', val: '532', streams: '2.30B' },
    { name: 'STAY', artist: 'The Kid Laroi, Justin Bieber', val: '492', streams: '2.66B' },
    { name: 'Señorita', artist: 'Shawn Mendes, Camila Cabello', val: '453', streams: '2.48B' },
    { name: 'Someone You Loved', artist: 'Lewis Capaldi', val: '440', streams: '2.88B' },
    { name: 'Watermelon Sugar', artist: 'Harry Styles', val: '437', streams: '2.32B' },
    { name: 'One Dance', artist: 'Drake, WizKid', val: '433', streams: '2.71B' },
    { name: 'As It Was', artist: 'Harry Styles', val: '403', streams: '2.51B' },
  ],
  deezerCharts: [
    { name: 'Flowers', artist: 'Miley Cyrus', val: '58', streams: '1.31B' },
    { name: 'As It Was', artist: 'Harry Styles', val: '46', streams: '2.51B' },
    { name: "I'm Good (Blue)", artist: 'Bebe Rexha, David Guetta', val: '45', streams: '1.10B' },
    { name: 'Calm Down', artist: 'Rema, Selena Gomez', val: '38', streams: '899M' },
    { name: 'Dance The Night', artist: 'Dua Lipa', val: '38', streams: '127M' },
    { name: "I Ain't Worried", artist: 'OneRepublic', val: '37', streams: '1.08B' },
    { name: 'Cold Heart - PNAU Remix', artist: 'Dua Lipa, Elton John', val: '37', streams: '1.60B' },
    { name: 'STAY', artist: 'The Kid Laroi, Justin Bieber', val: '31', streams: '2.66B' },
    { name: 'Shakira: Bzrp Sessions', artist: 'Shakira, Bizarrap', val: '29', streams: '721M' },
    { name: 'Heat Waves', artist: 'Glass Animals', val: '28', streams: '2.55B' },
  ],
  deezerPlaylists: [
    { name: 'Smells Like Teen Spirit', artist: 'Nirvana', val: '12,367', streams: '1.69B' },
    { name: 'Get Lucky', artist: 'Daft Punk', val: '8,215', streams: '933M' },
    { name: 'The Scientist', artist: 'Coldplay', val: '7,827', streams: '1.60B' },
    { name: 'Numb', artist: 'Linkin Park', val: '7,341', streams: '1.36B' },
    { name: 'Shape of You', artist: 'Ed Sheeran', val: '6,808', streams: '3.56B' },
    { name: 'In The End', artist: 'Linkin Park', val: '6,808', streams: '1.62B' },
    { name: 'Creep', artist: 'Radiohead', val: '6,807', streams: '1.27B' },
    { name: "Sweet Child O' Mine", artist: "Guns N' Roses", val: '6,720', streams: '1.55B' },
    { name: 'Still D.R.E.', artist: 'Dr. Dre, Snoop Dogg', val: '6,591', streams: '1.21B' },
    { name: "Can't Hold Us", artist: 'Macklemore & Ryan Lewis', val: '6,551', streams: '1.95B' },
  ],
  shazamCharts: [
    { name: 'Makeba', artist: 'Jain', val: '1,451', streams: '165M' },
    { name: 'Daylight', artist: 'David Kushner', val: '1,281', streams: '387M' },
    { name: 'What Was I Made For?', artist: 'Billie Eilish', val: '1,173', streams: '30.5M' },
    { name: 'MONTAGEM - FR PUNK', artist: 'Ayparia', val: '1,170', streams: '58M' },
    { name: 'Barbie World', artist: 'Nicki Minaj, Ice Spice', val: '1,133', streams: '65M' },
    { name: 'Popular', artist: 'The Weeknd, Madonna', val: '1,093', streams: '115M' },
    { name: 'Flowers', artist: 'Miley Cyrus', val: '1,021', streams: '1.31B' },
    { name: 'fukumean', artist: 'Gunna', val: '953', streams: '95.2M' },
    { name: 'The Next Episode', artist: 'Dr. Dre, Snoop Dogg', val: '953', streams: '843M' },
    { name: 'vampire', artist: 'Olivia Rodrigo', val: '949', streams: '140M' },
  ],
  spotifyCharts: [
    { name: 'Seven (feat. Latto)', artist: 'Latto, Jung Kook', val: '147', streams: '141M' },
    { name: 'As It Was', artist: 'Harry Styles', val: '130', streams: '2.51B' },
    { name: 'Flowers', artist: 'Miley Cyrus', val: '115', streams: '1.31B' },
    { name: 'vampire', artist: 'Olivia Rodrigo', val: '113', streams: '140M' },
    { name: 'I Wanna Be Yours', artist: 'Arctic Monkeys', val: '110', streams: '1.29B' },
    { name: 'What Was I Made For?', artist: 'Billie Eilish', val: '104', streams: '30.5M' },
    { name: 'Dance The Night', artist: 'Dua Lipa', val: '101', streams: '127M' },
    { name: 'Cruel Summer', artist: 'Taylor Swift', val: '100', streams: '800M' },
    { name: 'Daylight', artist: 'David Kushner', val: '98', streams: '387M' },
    { name: 'Sprinter', artist: 'Dave, Central Cee', val: '91', streams: '183M' },
  ],
  spotifyPlaylists: [
    { name: 'Get Lucky', artist: 'Daft Punk', val: '52,898', streams: '933M' },
    { name: 'Mr. Brightside', artist: 'The Killers', val: '51,979', streams: '1.80B' },
    { name: 'Wake Me Up', artist: 'Avicii', val: '50,887', streams: '1.97B' },
    { name: 'Smells Like Teen Spirit', artist: 'Nirvana', val: '49,991', streams: '1.69B' },
    { name: 'Take On Me', artist: 'a-ha', val: '44,927', streams: '1.47B' },
    { name: 'Blinding Lights', artist: 'The Weeknd', val: '43,899', streams: '3.70B' },
    { name: 'One Dance', artist: 'Drake, WizKid', val: '43,257', streams: '2.71B' },
    { name: 'Somebody That I Used To Know', artist: 'Gotye', val: '42,798', streams: '1.45B' },
    { name: 'Everybody Wants To Rule The World', artist: 'Tears For Fears', val: '41,751', streams: '1.20B' },
    { name: "Sweet Child O' Mine", artist: "Guns N' Roses", val: '41,231', streams: '1.55B' },
  ],
  instrumentalness: [
    { name: 'Alien Blues', artist: 'Vundabar', val: '91%', streams: '370M' },
    { name: 'METAMORPHOSIS', artist: 'INTERWORLD', val: '90%', streams: '357M' },
    { name: 'Poland', artist: 'Lil Yachty', val: '83%', streams: '115M' },
    { name: 'Forever', artist: 'Labrinth', val: '72%', streams: '282M' },
    { name: 'WHERE SHE GOES', artist: 'Bad Bunny', val: '63%', streams: '303M' },
    { name: 'Freaks', artist: 'Surf Curse', val: '63%', streams: '824M' },
    { name: 'Static', artist: 'Steve Lacy', val: '63%', streams: '202M' },
    { name: 'B.O.T.A.', artist: 'Interplanetary Criminal', val: '61%', streams: '244M' },
    { name: 'Makeba', artist: 'Jain', val: '51%', streams: '165M' },
    { name: 'Link Up', artist: 'Metro Boomin, Don Toliver', val: '51%', streams: '32.7M' },
  ],
  liveness: [
    { name: 'Vai Lá Em Casa', artist: 'Marília Mendonça', val: '97%', streams: '263M' },
    { name: 'Bombonzinho', artist: 'Israel & Rodolffo', val: '92%', streams: '263M' },
    { name: 'Seu Brilho Sumiu', artist: 'Israel & Rodolffo', val: '91%', streams: '138M' },
    { name: 'Mal Feito', artist: 'Marília Mendonça', val: '90%', streams: '291M' },
    { name: 'Still With You', artist: 'Jung Kook', val: '83%', streams: '38.4M' },
    { name: 'Erro Gostoso', artist: 'Simone Mendes', val: '80%', streams: '153M' },
    { name: 'Oi Balde', artist: 'Zé Neto & Cristiano', val: '80%', streams: '145M' },
    { name: 'Happy Xmas (War Is Over)', artist: 'John Lennon', val: '77%', streams: '460M' },
    { name: 'Eu Gosto Assim', artist: 'Gustavo Mioto', val: '72%', streams: '222M' },
    { name: 'Good Days', artist: 'SZA', val: '72%', streams: '826M' },
  ],
  speechiness: [
    { name: 'Cartão B', artist: 'MC Caverinha', val: '64%', streams: '71.5M' },
    { name: 'On BS', artist: 'Drake, 21 Savage', val: '59%', streams: '170M' },
    { name: 'Area Codes', artist: 'Kaliii', val: '49%', streams: '113M' },
    { name: 'Limbo', artist: 'Freddie Dredd', val: '46%', streams: '199M' },
    { name: 'Savior', artist: 'Kendrick Lamar', val: '46%', streams: '86.1M' },
    { name: 'California Breeze', artist: 'Lil Baby', val: '46%', streams: '85.5M' },
    { name: 'Baile no Morro', artist: 'Mc Vitin Da Igrejinha', val: '45%', streams: '129M' },
    { name: 'Caile', artist: 'Luar La L', val: '45%', streams: '273M' },
    { name: 'Love Yourself', artist: 'Justin Bieber', val: '44%', streams: '2.12B' },
    { name: 'Casei Com a Putaria', artist: 'MC Ryan SP', val: '44%', streams: '187M' },
  ],
  streams: [
    { name: 'Blinding Lights', artist: 'The Weeknd', val: '3.70B', streams: '3.70B' },
    { name: 'Shape of You', artist: 'Ed Sheeran', val: '3.56B', streams: '3.56B' },
    { name: 'Someone You Loved', artist: 'Lewis Capaldi', val: '2.88B', streams: '2.88B' },
    { name: 'Dance Monkey', artist: 'Tones and I', val: '2.86B', streams: '2.86B' },
    { name: 'Sunflower', artist: 'Post Malone, Swae Lee', val: '2.80B', streams: '2.80B' },
    { name: 'One Dance', artist: 'Drake, WizKid', val: '2.71B', streams: '2.71B' },
    { name: 'STAY', artist: 'The Kid Laroi, Justin Bieber', val: '2.66B', streams: '2.66B' },
    { name: 'Believer', artist: 'Imagine Dragons', val: '2.59B', streams: '2.59B' },
    { name: 'Closer', artist: 'The Chainsmokers, Halsey', val: '2.59B', streams: '2.59B' },
    { name: 'Starboy', artist: 'The Weeknd, Daft Punk', val: '2.56B', streams: '2.56B' },
  ],
  valence: [
    { name: 'Zona De Perigo', artist: 'Leo Santana', val: '97%', streams: '134M' },
    { name: 'Doja', artist: 'Central Cee', val: '97%', streams: '482M' },
    { name: "There's Nothing Holdin' Me Back", artist: 'Shawn Mendes', val: '97%', streams: '1.71B' },
    { name: 'En El Radio Un Cochinero', artist: 'Victor Cibrian', val: '97%', streams: '164M' },
    { name: 'JGL', artist: 'Luis R Conriquez', val: '97%', streams: '323M' },
    { name: 'SABOR FRESA', artist: 'Fuerza Regida', val: '96%', streams: '78.3M' },
    { name: 'TQM', artist: 'Fuerza Regida', val: '96%', streams: '176M' },
    { name: '(It Goes Like) Nanana', artist: 'Peggy Gou', val: '96%', streams: '57.8M' },
    { name: 'Rara Vez', artist: 'Taiu, Milo j', val: '96%', streams: '248M' },
    { name: 'Tere Vaaste', artist: 'Sachin-Jigar', val: '96%', streams: '54.2M' },
  ],
};

const FEATURE_SCHEMA = [
  { id: 0, name: 'track_name', type: 'Categorical', desc: 'Name of the song' },
  { id: 1, name: 'artist(s)_name', type: 'Categorical', desc: 'Name of the artist(s) of the song' },
  { id: 2, name: 'artist_count', type: 'Numerical', desc: 'Number of artists contributing to the song' },
  { id: 3, name: 'released_year', type: 'Numerical', desc: 'Year when the song was released' },
  { id: 4, name: 'released_month', type: 'Numerical', desc: 'Month when the song was released' },
  { id: 5, name: 'released_day', type: 'Numerical', desc: 'Day of the month when the song was released' },
  { id: 6, name: 'in_spotify_playlists', type: 'Numerical', desc: 'Number of Spotify playlists the song is included in' },
  { id: 7, name: 'in_spotify_charts', type: 'Numerical', desc: 'Presence and rank of the song on Spotify charts' },
  { id: 8, name: 'streams', type: 'Numerical', desc: 'Total number of streams on Spotify' },
  { id: 9, name: 'in_apple_playlists', type: 'Numerical', desc: 'Number of Apple Music playlists the song is included in' },
  { id: 10, name: 'in_apple_charts', type: 'Numerical', desc: 'Presence and rank of the song on Apple Music charts' },
  { id: 11, name: 'in_deezer_playlists', type: 'Numerical', desc: 'Number of Deezer playlists the song is included in' },
  { id: 12, name: 'in_deezer_charts', type: 'Numerical', desc: 'Presence and rank of the song on Deezer charts' },
  { id: 13, name: 'in_shazam_charts', type: 'Numerical', desc: 'Presence and rank of the song on Shazam charts' },
  { id: 14, name: 'bpm', type: 'Numerical', desc: 'Beats per minute, a measure of song tempo' },
  { id: 15, name: 'key', type: 'Categorical', desc: 'Key of the song' },
  { id: 16, name: 'mode', type: 'Categorical', desc: 'Mode of the song (major or minor)' },
  { id: 17, name: 'danceability_%', type: 'Numerical', desc: 'Percentage indicating how suitable the song is for dancing' },
  { id: 18, name: 'valence_%', type: 'Numerical', desc: 'Positivity of the song\'s musical content' },
  { id: 19, name: 'energy_%', type: 'Numerical', desc: 'Perceived energy level of the song' },
  { id: 20, name: 'acousticness_%', type: 'Numerical', desc: 'Amount of acoustic sound in the song' },
  { id: 21, name: 'instrumentalness_%', type: 'Numerical', desc: 'Amount of instrumental content in the song' },
  { id: 22, name: 'liveness_%', type: 'Numerical', desc: 'Presence of live performance elements' },
  { id: 23, name: 'speechiness_%', type: 'Numerical', desc: 'Amount of spoken words in the song' },
];

const DESCRIPTIVE_STATS = [
  { feature: 'acousticness_%', mean: '27.08', median: '18.00', std: '26.00', min: '0.00', max: '97.00' },
  { feature: 'artist_count', mean: '1.56', median: '1.00', std: '0.89', min: '1.00', max: '8.00' },
  { feature: 'bpm', mean: '122.55', median: '121.00', std: '28.07', min: '65.00', max: '206.00' },
  { feature: 'danceability_%', mean: '66.98', median: '69.00', std: '14.63', min: '23.00', max: '96.00' },
  { feature: 'energy_%', mean: '64.27', median: '66.00', std: '16.56', min: '9.00', max: '97.00' },
  { feature: 'in_apple_charts', mean: '51.96', median: '38.50', std: '50.63', min: '0.00', max: '275.00' },
  { feature: 'in_apple_playlists', mean: '67.87', median: '34.00', std: '86.47', min: '0.00', max: '672.00' },
  { feature: 'in_deezer_charts', mean: '2.67', median: '0.00', std: '6.04', min: '0.00', max: '58.00' },
  { feature: 'in_deezer_playlists', mean: '385.54', median: '44.00', std: '1131.08', min: '0.00', max: '12367.00' },
  { feature: 'in_shazam_charts', mean: '56.91', median: '2.00', std: '157.51', min: '0.00', max: '1451.00' },
  { feature: 'in_spotify_charts', mean: '12.02', median: '3.00', std: '19.58', min: '0.00', max: '147.00' },
  { feature: 'in_spotify_playlists', mean: '5202.57', median: '2216.50', std: '7901.40', min: '31.00', max: '52898.00' },
  { feature: 'instrumentalness_%', mean: '1.58', median: '0.00', std: '8.41', min: '0.00', max: '91.00' },
  { feature: 'liveness_%', mean: '18.21', median: '12.00', std: '13.72', min: '3.00', max: '97.00' },
  { feature: 'released_day', mean: '13.94', median: '13.00', std: '9.20', min: '1.00', max: '31.00' },
  { feature: 'released_month', mean: '6.04', median: '6.00', std: '3.56', min: '1.00', max: '12.00' },
  { feature: 'released_year', mean: '2018.29', median: '2022.00', std: '11.01', min: '1930.00', max: '2023.00' },
  { feature: 'speechiness_%', mean: '10.14', median: '6.00', std: '9.92', min: '2.00', max: '64.00' },
  { feature: 'streams', mean: '514.14M', median: '290.53M', std: '566.86M', min: '2.76K', max: '3.70B' },
  { feature: 'valence_%', mean: '51.41', median: '51.00', std: '23.48', min: '4.00', max: '97.00' },
];

const OUTLIER_ANALYSIS = [
  { feature: 'in_deezer_playlists', count: 154, percentage: '16.18', severity: 'High' },
  { feature: 'released_year', count: 150, percentage: '15.76', severity: 'High' },
  { feature: 'in_shazam_charts', count: 145, percentage: '15.23', severity: 'High' },
  { feature: 'in_deezer_charts', count: 143, percentage: '15.02', severity: 'High' },
  { feature: 'speechiness_%', count: 136, percentage: '14.29', severity: 'High' },
  { feature: 'in_spotify_playlists', count: 109, percentage: '11.45', severity: 'High' },
  { feature: 'instrumentalness_%', count: 87, percentage: '9.14', severity: 'Medium' },
  { feature: 'in_apple_playlists', count: 78, percentage: '8.19', severity: 'Medium' },
  { feature: 'in_spotify_charts', count: 78, percentage: '8.19', severity: 'Medium' },
  { feature: 'streams', count: 74, percentage: '7.77', severity: 'Medium' },
  { feature: 'liveness_%', count: 44, percentage: '4.62', severity: 'Low' },
  { feature: 'artist_count', count: 27, percentage: '2.84', severity: 'Low' },
  { feature: 'in_apple_charts', count: 9, percentage: '0.95', severity: 'Low' },
  { feature: 'bpm', count: 5, percentage: '0.53', severity: 'Low' },
  { feature: 'energy_%', count: 4, percentage: '0.42', severity: 'Low' },
  { feature: 'danceability_%', count: 3, percentage: '0.32', severity: 'Low' },
  { feature: 'acousticness_%', count: 0, percentage: '0.00', severity: 'Low' },
  { feature: 'released_day', count: 0, percentage: '0.00', severity: 'Low' },
  { feature: 'released_month', count: 0, percentage: '0.00', severity: 'Low' },
  { feature: 'valence_%', count: 0, percentage: '0.00', severity: 'Low' },
];

// Hard-coded from notebook export in data folder:
// - streams_distribution_by_artist_count_boxplot.json (median/IQR by artist_count)
// - average_streams_solo_vs_collaboration_bar.json (mean streams by group)
const ARTIST_COUNT_STREAMS_SUMMARY = [
  { artistCount: 1, n: 586, q1: 167419464.25, median: 333619963.0, q3: 795335524.0 },
  { artistCount: 2, n: 254, q1: 112704676.25, median: 249408543.5, q3: 607761907.5 },
  { artistCount: 3, n: 85, q1: 121189256.0, median: 231332117.0, q3: 436695353.0 },
  { artistCount: 4, n: 15, q1: 112710236.5, median: 159240673.0, q3: 380316239.5 },
  { artistCount: 5, n: 5, q1: 54225632.0, median: 133753727.0, q3: 223582566.0 },
  { artistCount: 6, n: 3, q1: 61106170.5, median: 120847157.0, q3: 130517087.5 },
  { artistCount: 7, n: 2, q1: 292230117.25, median: 339060067.5, q3: 385890017.75 },
  { artistCount: 8, n: 2, q1: 148171793.25, median: 173221173.5, q3: 198270553.75 },
] as const;

const SOLO_VS_COLLABORATION_MEAN_STREAMS = [
  { group: 'Solo', meanStreams: 568211662.2098976 },
  { group: 'Collaboration', meanStreams: 427559547.77868855 },
] as const;

type PlotFigure = {
  data: any[];
  layout?: Record<string, any>;
};

type TopMetricItem = {
  name: string;
  artist: string;
  val: string;
  streams: string;
};

type ArtistMarketShare = {
  name: string;
  streams: string;
  pct: number;
};

type CollaborationBucket = {
  count: number;
  tracks: number;
};

const RAW_TRACK_COUNT = 953;
const CLEAN_TRACK_COUNT = 952;
const FEATURE_COUNTS = FEATURE_SCHEMA.reduce(
  (counts, feature) => {
    if (feature.type === 'Numerical') {
      counts.numerical += 1;
    } else {
      counts.categorical += 1;
    }
    return counts;
  },
  { numerical: 0, categorical: 0 }
);

const STREAMS_MEAN = 514.14 * 1_000_000;
const TOTAL_DATASET_STREAMS = STREAMS_MEAN * CLEAN_TRACK_COUNT;

const toFigure = (figure: unknown) => figure as PlotFigure;
const toCompactBillions = (value: number) => `${(value / 1_000_000_000).toFixed(1)}B`;
const toPercent = (value: number, total: number, digits = 1) => `${((value / total) * 100).toFixed(digits)}%`;
const formatFieldLabel = (label: string) =>
  label
    .replace(/^in_/, '')
    .replace(/_%$/, ' %')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\bBpm\b/g, 'BPM');

const numericalAudioFigure = toFigure(numericalAudioFeaturesDistribution);
const AUDIO_DISTRIBUTION_FEATURES = [
  'Danceability %',
  'Energy %',
  'Valence %',
  'Acousticness %',
  'Instrumentalness %',
  'Liveness %',
  'Speechiness %',
];
const audioDistributionTraces = numericalAudioFigure.data
  .filter((trace) => AUDIO_DISTRIBUTION_FEATURES.includes(trace.name))
  .map((trace) => ({
    ...trace,
    opacity: 0.7,
    nbinsx: 40,
  }));

const audioDistributionFacetTraces = audioDistributionTraces.map((trace, idx) => {
  const panel = idx + 1;
  return {
    ...trace,
    xaxis: panel === 1 ? 'x' : `x${panel}`,
    yaxis: panel === 1 ? 'y' : `y${panel}`,
    showlegend: false,
  };
});

const audioDistributionFacetLayout = (() => {
  const panelCount = Math.max(1, audioDistributionTraces.length);
  const columns = 3;
  const rows = Math.ceil(panelCount / columns);
  const layout: Record<string, any> = {
    autosize: true,
    height: 220 * rows + 160,
    barmode: 'overlay',
    grid: { rows, columns, pattern: 'independent' },
    margin: { l: 42, r: 20, t: 36, b: 62 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    annotations: audioDistributionTraces.map((trace, idx) => ({
      xref: idx === 0 ? 'x domain' : `x${idx + 1} domain`,
      yref: idx === 0 ? 'y domain' : `y${idx + 1} domain`,
      x: 0.5,
      y: 1.08,
      text: `<b>${trace.name}</b>`,
      showarrow: false,
      font: { size: 12, color: '#18181b' },
    })),
  };

  for (let i = 1; i <= panelCount; i++) {
    const xKey = i === 1 ? 'xaxis' : `xaxis${i}`;
    const yKey = i === 1 ? 'yaxis' : `yaxis${i}`;
    layout[xKey] = { title: 'Value (%)', gridcolor: '#e5e7eb', zeroline: false };
    layout[yKey] = { title: 'Frequency', gridcolor: '#e5e7eb', zeroline: false };
  }
  return layout;
})();

const keyDistributionTrace = toFigure(categoricalDistributionKey).data[0];
const modeDistributionTrace = toFigure(categoricalDistributionMode).data[0];
const artistCountDistributionTrace = toFigure(distributionOfSongsByArtistCount).data[0];
const songsPerArtistDistributionTrace = toFigure(distributionOfSongsPerArtist).data[0];
const UNIQUE_ARTIST_COUNT = songsPerArtistDistributionTrace.x.length;

const platformAnalysisFigure = toFigure(platformAnalysis);
const platformHeatmapTrace = {
  ...platformAnalysisFigure.data[0],
  x: platformAnalysisFigure.data[0].x.map((label: string) => formatFieldLabel(label)),
  y: platformAnalysisFigure.data[0].y.map((label: string) => formatFieldLabel(label)),
};
const platformCountDistributionTrace = platformAnalysisFigure.data[1];
const platformCountDistributionNonZero = {
  ...platformCountDistributionTrace,
  x: platformCountDistributionTrace.x.filter((count: number) => count > 0),
  y: platformCountDistributionTrace.y.filter((_: number, idx: number) => platformCountDistributionTrace.x[idx] > 0),
};
const platformStreamCorrelationTrace = {
  ...toFigure(platformStreamCorrelation).data[0],
  y: toFigure(platformStreamCorrelation).data[0].y.map((label: string) => formatFieldLabel(label)),
  marker: { color: '#1DB954' },
};

const hitPredictorTraces = toFigure(hitPredictorsCorrelation).data.map((trace, index) => ({
  ...trace,
  name: index === 0 ? 'Negative Correlation' : 'Positive Correlation',
  y: trace.y.map((label: string) => formatFieldLabel(label)),
  marker: { color: index === 0 ? '#f43f5e' : '#1DB954' },
}));

const topArtistsRawTrace = toFigure(topArtistsByStreams).data[0];
const topArtistsTrace = {
  ...topArtistsRawTrace,
  x: topArtistsRawTrace.x.map((value: number) => value / 1_000_000_000),
  marker: {
    color: topArtistsRawTrace.x.map((value: number) => value / 1_000_000_000),
    colorscale: 'Viridis',
    reversescale: true,
  },
  text: topArtistsRawTrace.x.map((value: number) => toPercent(value, TOTAL_DATASET_STREAMS)),
};

const topArtistMarketShare: ArtistMarketShare[] = topArtistsRawTrace.y.map((name: string, index: number) => {
  const streams = topArtistsRawTrace.x[index] as number;
  return {
    name,
    streams: toCompactBillions(streams),
    pct: Number(((streams / TOTAL_DATASET_STREAMS) * 100).toFixed(2)),
  };
});

const top10ArtistsShare = topArtistMarketShare.reduce((sum: number, artist: ArtistMarketShare) => sum + artist.pct, 0);

const playlistTop10Series: { key: string; label: string; color: string; items: TopMetricItem[] }[] = [
  { key: 'spotify', label: 'Spotify', color: '#1DB954', items: TOP_10_METRICS.spotifyPlaylists },
  { key: 'apple', label: 'Apple', color: '#ff3b30', items: TOP_10_METRICS.applePlaylists },
  { key: 'deezer', label: 'Deezer', color: '#007aff', items: TOP_10_METRICS.deezerPlaylists },
];

const chartTop10Series: { key: string; label: string; color: string; items: TopMetricItem[] }[] = [
  { key: 'spotify', label: 'Spotify', color: '#1DB954', items: TOP_10_METRICS.spotifyCharts },
  { key: 'apple', label: 'Apple', color: '#ff3b30', items: TOP_10_METRICS.appleCharts },
  { key: 'deezer', label: 'Deezer', color: '#007aff', items: TOP_10_METRICS.deezerCharts },
];

const buildCrossPlatformTop10Rows = (series: { key: string; label: string; items: TopMetricItem[] }[]) => {
  const rankMap = new Map<string, { name: string; artist: string; ranks: Record<string, number | null> }>();
  for (const s of series) {
    s.items.forEach((item, idx) => {
      const k = `${item.name}::${item.artist}`;
      if (!rankMap.has(k)) {
        rankMap.set(k, { name: item.name, artist: item.artist, ranks: {} });
      }
      rankMap.get(k)!.ranks[s.key] = idx + 1;
    });
  }

  const rows = Array.from(rankMap.values()).map((r) => ({
    ...r,
    presentOn: series.reduce((n, s) => n + (r.ranks[s.key] ? 1 : 0), 0),
    bestRank: Math.min(...series.map((s) => r.ranks[s.key] ?? 999)),
  }));

  return rows.sort((a, b) => b.presentOn - a.presentOn || a.bestRank - b.bestRank).slice(0, 15);
};

const playlistTop10ComparisonRows = buildCrossPlatformTop10Rows(playlistTop10Series);
const chartTop10ComparisonRows = buildCrossPlatformTop10Rows(chartTop10Series);

const musicFeatureTrendTraces = toFigure(musicFeaturesTrendOverTime).data;
const seasonalityTrace = toFigure(seasonalitySongsByMonth).data[0];
const fridayPhenomenonTrace = toFigure(fridayPhenomenon).data[0];

const sonicMoodTraces = toFigure(sonicMoodScatter).data.map((trace) => ({
  ...trace,
  marker: {
    ...trace.marker,
    sizemode: 'diameter',
    sizeref: 2,
    opacity: 0.65,
    line: { color: 'white', width: 1 },
  },
}));

const audioProfileTraces = toFigure(audioProfileRadar).data.map((trace) => ({
  ...trace,
  theta: trace.theta.map((label: string) => formatFieldLabel(label)),
  fillcolor: trace.name === 'Mega Hit (Top Quartile)' ? 'rgba(29, 185, 84, 0.28)' : 'rgba(25, 20, 20, 0.24)',
}));

const collaborationDistribution: CollaborationBucket[] = artistCountDistributionTrace.x.map((count: number, index: number) => ({
  count,
  tracks: artistCountDistributionTrace.y[index] as number,
}));

const soloTracks = collaborationDistribution.find((item: CollaborationBucket) => item.count === 1)?.tracks ?? 0;
const duoTracks = collaborationDistribution.find((item: CollaborationBucket) => item.count === 2)?.tracks ?? 0;
const groupTracks = collaborationDistribution
  .filter((item: CollaborationBucket) => item.count >= 3)
  .reduce((sum: number, item: CollaborationBucket) => sum + item.tracks, 0);
const collaborativeTracks = duoTracks + groupTracks;

// --- Components ---

const StatCard = ({ value, label, color = 'spotify' }: { value: string | number, label: string, color?: 'spotify' | 'teal' | 'orange' }) => {
  const colorClasses = {
    spotify: 'from-zinc-900 to-zinc-800 border-b-4 border-[#1DB954]',
    teal: 'from-teal-900 to-teal-800 border-b-4 border-teal-400',
    orange: 'from-orange-900 to-orange-800 border-b-4 border-orange-400',
  };

  return (
    <div className={cn("bg-linear-to-br p-6 rounded-xl text-center shadow-lg transition-transform hover:scale-105", colorClasses[color])}>
      <div className="text-3xl font-bold text-[#1DB954] mb-1">{value}</div>
      <div className="text-sm text-zinc-300 uppercase tracking-wider">{label}</div>
    </div>
  );
};

const Top10Table = ({ title, data, color = '#1DB954', unit = '' }: { title: string, data: any[], color?: string, unit?: string }) => (
  <div className="space-y-4">
    <h4 className="font-black text-zinc-800 flex items-center gap-2 text-lg uppercase tracking-tighter">
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div> {title}
    </h4>
    <div className="overflow-hidden rounded-2xl border border-zinc-200 shadow-lg bg-white">
      <table className="w-full text-sm text-left">
        <thead className="bg-zinc-900 text-white border-b border-zinc-800">
          <tr>
            <th className="p-4 font-bold uppercase text-[10px] tracking-widest">Track Name</th>
            <th className="p-4 font-bold uppercase text-[10px] tracking-widest text-right">Value</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {data.map((s, i) => (
            <tr key={i} className="hover:bg-zinc-50 transition-colors group">
              <td className="p-4">
                <div className="font-bold text-zinc-800 group-hover:text-[#1DB954] transition-colors truncate max-w-50" title={s.name}>
                  {s.name}
                </div>
                <div className="text-[10px] text-zinc-400 truncate max-w-50">{s.artist}</div>
              </td>
              <td className="p-4 text-right">
                <div className="font-mono font-bold" style={{ color }}>{s.val}{unit}</div>
                <div className="text-[9px] text-zinc-400 uppercase tracking-tighter">{s.streams} streams</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const RankComparisonTable = ({
  title,
  rows,
  series,
}: {
  title: string;
  rows: { name: string; artist: string; ranks: Record<string, number | null>; presentOn: number }[];
  series: { key: string; label: string; color: string }[];
}) => (
  <div className="space-y-4">
    <h4 className="font-black text-zinc-900 text-lg">{title}</h4>
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-zinc-900 text-white">
            <tr>
              <th className="px-4 py-3 text-[10px] uppercase tracking-widest">Song</th>
              {series.map((s) => (
                <th key={s.key} className="px-3 py-3 text-center text-[10px] uppercase tracking-widest">
                  {s.label} Rank
                </th>
              ))}
              <th className="px-3 py-3 text-center text-[10px] uppercase tracking-widest">Coverage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rows.map((row) => (
              <tr key={`${row.name}-${row.artist}`} className="hover:bg-zinc-50">
                <td className="px-4 py-3">
                  <div className="font-semibold text-zinc-900 truncate max-w-64" title={row.name}>
                    {row.name}
                  </div>
                  <div className="text-[11px] text-zinc-500 truncate max-w-64">{row.artist}</div>
                </td>
                {series.map((s) => {
                  const rank = row.ranks[s.key];
                  return (
                    <td key={`${row.name}-${s.key}`} className="px-3 py-3 text-center">
                      {rank ? (
                        <span className="inline-flex min-w-9 items-center justify-center rounded-full px-2 py-1 text-xs font-bold text-white" style={{ backgroundColor: s.color }}>
                          #{rank}
                        </span>
                      ) : (
                        <span className="text-zinc-400">-</span>
                      )}
                    </td>
                  );
                })}
                <td className="px-3 py-3 text-center font-mono text-xs text-zinc-700">{row.presentOn}/3</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const SectionHeader = ({ 
  title, 
  icon: Icon, 
  isOpen, 
  onToggle, 
}: { 
  title: string, 
  icon: any, 
  isOpen: boolean, 
  onToggle: () => void,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b-4 border-[#1DB954] pb-2">
      <div 
        className="flex items-center gap-3 cursor-pointer group flex-1" 
        onClick={onToggle}
      >
        <div className="bg-[#1DB954] p-2 rounded-lg text-black group-hover:scale-110 transition-transform">
          <Icon size={24} />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 group-hover:text-[#1DB954] transition-colors flex items-center gap-2">
          {title}
          {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </h2>
      </div>
      </div>
  );
};

export default function SpotifyEDA({ onBack }: { onBack: () => void }) {
  const [sections, setSections] = useState({
    methodology: true,
    overview: true,
    s1: true,
    s2: true,
    s3: true,
    s4: true,
    s5: true,
    s6: true,
    s7: true,
    s8: true,
    s9: true,
    summary: true,
  });

  const [showFullSchema, setShowFullSchema] = useState(false);
  const [showFullStats, setShowFullStats] = useState(false);
  const [showFullOutliers, setShowFullOutliers] = useState(false);
  const [showPlatformPlaylistTop10, setShowPlatformPlaylistTop10] = useState(false);
  const [showPlatformChartTop10, setShowPlatformChartTop10] = useState(false);
  const [showAudioTop10, setShowAudioTop10] = useState(false);
  const toggleSection = (id: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const collapseAll = () => {
    const closed = Object.keys(sections).reduce((acc, key) => ({ ...acc, [key]: false }), {});
    setSections(closed as any);
  };

  const expandAll = () => {
    const opened = Object.keys(sections).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setSections(opened as any);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#1DB954] to-zinc-900 p-4 md:p-8 font-sans selection:bg-[#1DB954] selection:text-black">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        
        {/* Header */}
        <header className="bg-zinc-950 text-white p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#1DB954] blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#1DB954] blur-[120px] rounded-full"></div>
          </div>
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative z-10"
          >
            <div className="inline-block bg-[#1DB954] text-black p-3 rounded-2xl mb-4 shadow-lg shadow-[#1DB954]/20">
              <Music size={40} strokeWidth={3} />
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-2 text-[#1DB954]">
              SPOTIFY TOP SONGS 2023
            </h1>
            <p className="text-xl text-zinc-400 font-medium max-w-2xl mx-auto">
              Exploratory data analysis with interactive visualizations and practical interpretation.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-zinc-500">
              <span className="bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">{CLEAN_TRACK_COUNT} Tracks</span>
              <span className="bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">{FEATURE_SCHEMA.length} Features</span>
              <span className="bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">Source: Kaggle</span>
            </div>
          </motion.div>
        </header>

        {/* Control Bar */}
        <div className="bg-zinc-50 border-b border-zinc-200 px-8 py-4 flex flex-wrap justify-center gap-4 sticky top-0 z-50 shadow-sm">
          <button onClick={onBack} className="px-6 py-2 rounded-full border-2 border-zinc-400 text-zinc-600 font-bold hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all flex items-center gap-2 text-sm">
            <ArrowLeft size={16} /> Home
          </button>
          <button onClick={collapseAll} className="px-6 py-2 rounded-full border-2 border-[#1DB954] text-[#1DB954] font-bold hover:bg-[#1DB954] hover:text-white transition-all flex items-center gap-2 text-sm">
            <Layers size={16} /> Collapse All
          </button>
          <button onClick={expandAll} className="px-6 py-2 rounded-full border-2 border-[#1DB954] text-[#1DB954] font-bold hover:bg-[#1DB954] hover:text-white transition-all flex items-center gap-2 text-sm">
            <LayoutDashboard size={16} /> Expand All
          </button>
        </div>

        <main className="p-8 md:p-10 space-y-10">
          
          {/* Methodology */}
          <section id="methodology" className="scroll-mt-24">
            <SectionHeader 
              title="Analysis Methodology" 
              icon={Info} 
              isOpen={sections.methodology} 
              onToggle={() => toggleSection('methodology')}
            />
            <AnimatePresence>
              {sections.methodology && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-zinc-600 mb-6 text-lg leading-relaxed">
                    This report explores the "Top Spotify Songs 2023" dataset, focusing on audio characteristics, 
                    platform presence and factors that contribute to a track becoming a "Mega Hit".
                  </p>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                      <h4 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
                        <Search size={18} className="text-[#1DB954]" /> Core Analysis Areas
                      </h4>
                      <ul className="space-y-3 text-zinc-600">
                        <li className="flex items-start gap-2"><span className="text-[#1DB954] font-bold">•</span> <strong>Data Quality:</strong> Handling missing values and structural noise.</li>
                        <li className="flex items-start gap-2"><span className="text-[#1DB954] font-bold">•</span> <strong>Audio Profiling:</strong> Analyzing BPM, Energy and Danceability.</li>
                        <li className="flex items-start gap-2"><span className="text-[#1DB954] font-bold">•</span> <strong>Platform Impact:</strong> Correlation between playlist presence and streams.</li>
                        <li className="flex items-start gap-2"><span className="text-[#1DB954] font-bold">•</span> <strong>Temporal Trends:</strong> Seasonality and evolution of music features.</li>
                      </ul>
                    </div>
                    <div className="bg-[#1DB954]/5 p-6 rounded-2xl border border-[#1DB954]/20 flex flex-col justify-center">
                      <div className="text-[#1DB954] font-black text-4xl mb-2">💡 KEY PRINCIPLE</div>
                      <p className="text-zinc-700 font-medium italic">
                        "Distribution strategy (playlists) often outweighs musicality (audio features) in predicting streaming success."
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Overview */}
          <section id="overview" className="scroll-mt-24">
            <SectionHeader 
              title="Dataset Overview" 
              icon={LayoutDashboard} 
              isOpen={sections.overview} 
              onToggle={() => toggleSection('overview')}
            />
            <AnimatePresence>
              {sections.overview && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard value={CLEAN_TRACK_COUNT} label="Total Tracks" />
                    <StatCard value={FEATURE_SCHEMA.length} label="Features" />
                    <StatCard value={FEATURE_COUNTS.numerical} label="Numerical" />
                    <StatCard value={FEATURE_COUNTS.categorical} label="Categorical" />
                  </div>
                  
                  {/* Feature Dictionary Section */}
                  <div className="mt-12 space-y-6">
                    <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                      <h4 className="text-sm font-black text-zinc-800 uppercase tracking-tighter flex items-center gap-2">
                        <Clipboard size={16} className="text-[#1DB954]" /> Feature Dictionary
                      </h4>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        {FEATURE_SCHEMA.length} Total Features
                      </span>
                    </div>
                    
                    <div className="bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-zinc-800">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-zinc-800/50 text-[10px] uppercase tracking-widest text-zinc-400 font-black">
                              <th className="px-6 py-4 border-b border-zinc-800">#</th>
                              <th className="px-6 py-4 border-b border-zinc-800">Feature Name</th>
                              <th className="px-6 py-4 border-b border-zinc-800 text-center">Type</th>
                              <th className="px-6 py-4 border-b border-zinc-800">Description</th>
                            </tr>
                          </thead>
                          <tbody className="text-sm">
                            {(showFullSchema ? FEATURE_SCHEMA : FEATURE_SCHEMA.slice(0, 5)).map((f, idx) => (
                              <tr key={f.id} className="group hover:bg-zinc-800/30 transition-colors border-b border-zinc-800/50 last:border-0">
                                <td className="px-6 py-4 text-zinc-500 font-mono text-xs">{f.id}</td>
                                <td className="px-6 py-4 font-bold text-white group-hover:text-[#1DB954] transition-colors">{f.name}</td>
                                <td className="px-6 py-4 text-center">
                                  <span className={cn(
                                    "px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter",
                                    f.type === 'Numerical' ? "bg-[#1DB954]/10 text-[#1DB954] border border-[#1DB954]/20" : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                  )}>
                                    {f.type === 'Numerical' ? 'Num' : 'Cat'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-zinc-400 text-xs leading-relaxed">{f.desc}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="p-4 bg-zinc-800/20 flex justify-center border-t border-zinc-800">
                        <button 
                          onClick={() => setShowFullSchema(!showFullSchema)}
                          className="flex items-center gap-2 text-[#1DB954] hover:text-white text-xs font-black uppercase tracking-widest transition-all group"
                        >
                          {showFullSchema ? 'Collapse Schema' : 'View Full Schema (24 Features)'}
                          <ChevronDown size={16} className={cn("transition-transform duration-300", showFullSchema ? "rotate-180" : "group-hover:translate-y-1")} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Stage 1: Data Acquisition */}
          <section id="s1" className="scroll-mt-24">
            <SectionHeader 
              title="Stage 1: Data Acquisition & Overview" 
              icon={Database} 
              isOpen={sections.s1} 
              onToggle={() => toggleSection('s1')}
            />
            <AnimatePresence>
              {sections.s1 && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-8"
                >
                  {/* Dataset Overview Section (Matching Image Style) */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b-2 border-indigo-100 pb-2">
                      <h3 className="text-2xl font-bold text-zinc-800 flex items-center gap-2">
                        Dataset Overview
                      </h3>
                      <ChevronDown size={24} className="text-zinc-400" />
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                      {[
                        { label: 'Total Samples', val: String(RAW_TRACK_COUNT) },
                        { label: 'Cleaned Samples', val: String(CLEAN_TRACK_COUNT) },
                        { label: 'Total Features', val: String(FEATURE_SCHEMA.length) },
                        { label: 'Numerical Features', val: String(FEATURE_COUNTS.numerical) },
                        { label: 'Categorical Features', val: String(FEATURE_COUNTS.categorical) },
                      ].map((card, i) => (
                        <div key={i} className="bg-zinc-900 p-8 rounded-2xl text-center shadow-xl text-white transform transition-all hover:scale-105 border-b-4 border-[#1DB954]">
                          <div className="text-4xl font-black mb-2 text-[#1DB954]">{card.val}</div>
                          <div className="text-[10px] uppercase tracking-widest font-bold opacity-60">{card.label}</div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8">
                      <h4 className="text-sm font-black text-[#1DB954] mb-4 uppercase tracking-tighter">Target Variable: Streams</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-zinc-900 p-10 rounded-3xl text-center shadow-2xl text-white relative overflow-hidden group border border-zinc-800">
                          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 group-hover:scale-110 transition-all text-[#1DB954]">
                            <TrendingUp size={80} />
                          </div>
                          <div className="text-5xl font-black mb-2 tracking-tighter text-[#1DB954]">514M</div>
                          <div className="text-xs uppercase tracking-widest font-bold opacity-50">Average Streams per Track</div>
                        </div>
                        <div className="bg-[#1DB954] p-10 rounded-3xl text-center shadow-2xl text-black relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 group-hover:scale-110 transition-all">
                            <Music size={80} />
                          </div>
                          <div className="text-5xl font-black mb-2 tracking-tighter">3.7B</div>
                          <div className="text-xs uppercase tracking-widest font-bold opacity-80">Max Streams (Blinding Lights)</div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Top 10 Songs Section */}
                  <div className="space-y-12">
                    {/* Raw Data Preview */}
                    <div className="space-y-6 pt-10 border-t border-zinc-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-zinc-900 p-2 rounded-lg text-white">
                            <Table size={20} />
                          </div>
                          <div>
                            <h3 className="text-lg font-black text-zinc-900 uppercase tracking-tighter">Raw Data Preview</h3>
                            <p className="text-xs text-zinc-500 font-medium">Head of the dataset (First 10 rows)</p>
                          </div>
                        </div>
                        <div className="bg-zinc-100 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-500">
                          10 Rows × 24 Columns
                        </div>
                      </div>

                      <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse min-w-300">
                            <thead>
                              <tr className="bg-zinc-50 text-[10px] uppercase tracking-widest text-zinc-500 font-black border-b border-zinc-200">
                                <th className="px-4 py-3">Track Name</th>
                                <th className="px-4 py-3">Artist(s)</th>
                                <th className="px-4 py-3 text-center">Year</th>
                                <th className="px-4 py-3 text-right">Streams</th>
                                <th className="px-4 py-3 text-center">BPM</th>
                                <th className="px-4 py-3 text-center">Key</th>
                                <th className="px-4 py-3 text-center">Dance%</th>
                                <th className="px-4 py-3 text-center">Energy%</th>
                                <th className="px-4 py-3 text-center">Acoustic%</th>
                                <th className="px-4 py-3 text-center">Speech%</th>
                              </tr>
                            </thead>
                            <tbody className="text-[11px]">
                              {RAW_DATA_PREVIEW.map((row, idx) => (
                                <tr key={idx} className="hover:bg-zinc-50/50 transition-colors border-b border-zinc-100 last:border-0">
                                  <td className="px-4 py-3 font-bold text-zinc-900 truncate max-w-50">{row.track_name}</td>
                                  <td className="px-4 py-3 text-zinc-600 truncate max-w-37.5">{row.artist_name}</td>
                                  <td className="px-4 py-3 text-center text-zinc-500">{row.released_year}</td>
                                  <td className="px-4 py-3 text-right font-mono font-bold text-[#1DB954]">{row.streams}</td>
                                  <td className="px-4 py-3 text-center text-zinc-500">{row.bpm}</td>
                                  <td className="px-4 py-3 text-center">
                                    <span className="bg-zinc-100 px-2 py-0.5 rounded text-[9px] font-bold">{row.key} {row.mode}</span>
                                  </td>
                                  <td className="px-4 py-3 text-center text-zinc-600">{row.danceability}%</td>
                                  <td className="px-4 py-3 text-center text-zinc-600">{row.energy}%</td>
                                  <td className="px-4 py-3 text-center text-zinc-600">{row.acousticness}%</td>
                                  <td className="px-4 py-3 text-center text-zinc-600">{row.speechiness}%</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-10 border-t border-zinc-100">
                      <div className="bg-[#1DB954] p-2 rounded-lg text-black">
                        <Zap size={24} />
                      </div>
                      <h3 className="text-2xl font-black text-zinc-900 tracking-tight">
                        Top 10 Songs by Numerical Feature
                      </h3>
                    </div>
                    
                    {/* --- PLATFORM COMPARISON --- */}
                    <div className="space-y-10">
                      <div className="grid lg:grid-cols-2 gap-10">
                        <Top10Table title="Top 10 by Streams" data={TOP_10_METRICS.streams} color="#1DB954" />
                        <Top10Table title="Top 10 by Shazam Charts" data={TOP_10_METRICS.shazamCharts} color="#0088ff" />
                      </div>

                      <div className="space-y-4 pt-2 border-t border-zinc-200">
                        <button
                          onClick={() => setShowPlatformPlaylistTop10((v) => !v)}
                          className="flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-zinc-800 transition-colors shadow-lg group"
                        >
                          <Layers size={18} className={showPlatformPlaylistTop10 ? "text-[#1DB954]" : "text-zinc-400"} />
                          {showPlatformPlaylistTop10 ? 'Hide Playlist Top 10 by Platform' : 'Show Playlist Top 10 by Platform'}
                          <ChevronDown size={18} className={cn("transition-transform duration-300", showPlatformPlaylistTop10 ? "rotate-180 text-[#1DB954]" : "text-zinc-400")} />
                        </button>
                        <AnimatePresence>
                          {showPlatformPlaylistTop10 && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden space-y-6"
                            >
                              <RankComparisonTable title="Top 10 Comparison by Platform (Playlists)" rows={playlistTop10ComparisonRows} series={playlistTop10Series} />
                              <div className="grid lg:grid-cols-3 gap-8">
                                <Top10Table title="Top 10 by Spotify Playlists" data={TOP_10_METRICS.spotifyPlaylists} color="#1DB954" />
                                <Top10Table title="Top 10 by Apple Playlists" data={TOP_10_METRICS.applePlaylists} color="#ff3b30" />
                                <Top10Table title="Top 10 by Deezer Playlists" data={TOP_10_METRICS.deezerPlaylists} color="#007aff" />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="space-y-4 pt-2 border-t border-zinc-200">
                        <button
                          onClick={() => setShowPlatformChartTop10((v) => !v)}
                          className="flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-zinc-800 transition-colors shadow-lg group"
                        >
                          <Layers size={18} className={showPlatformChartTop10 ? "text-[#1DB954]" : "text-zinc-400"} />
                          {showPlatformChartTop10 ? 'Hide Chart Top 10 by Platform' : 'Show Chart Top 10 by Platform'}
                          <ChevronDown size={18} className={cn("transition-transform duration-300", showPlatformChartTop10 ? "rotate-180 text-[#1DB954]" : "text-zinc-400")} />
                        </button>
                        <AnimatePresence>
                          {showPlatformChartTop10 && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden space-y-6"
                            >
                              <RankComparisonTable title="Top 10 Comparison by Platform (Charts)" rows={chartTop10ComparisonRows} series={chartTop10Series} />
                              <div className="grid lg:grid-cols-3 gap-8">
                                <Top10Table title="Top 10 by Spotify Charts" data={TOP_10_METRICS.spotifyCharts} color="#1DB954" />
                                <Top10Table title="Top 10 by Apple Charts" data={TOP_10_METRICS.appleCharts} color="#ff3b30" />
                                <Top10Table title="Top 10 by Deezer Charts" data={TOP_10_METRICS.deezerCharts} color="#007aff" />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Platform Insights Box */}
                      <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 shadow-sm mt-8">
                        <h4 className="font-bold text-zinc-900 mb-3 flex items-center gap-2">
                          <Search size={18} className="text-[#1DB954]" /> Cross-Platform Insights
                        </h4>
                        <div className="space-y-3 text-sm text-zinc-600 leading-relaxed">
                          <p><strong className="text-zinc-800">1. Dominant Scale (Spotify):</strong> Spotify demonstrates absolute dominance in playlist reach. A single hit track can be featured in over 50,000 Spotify playlists, whereas Apple Music playlist inclusions for the same track rarely exceed a few hundred.</p>
                          <p><strong className="text-zinc-800">2. The Discovery Engine (Shazam):</strong> Shazam charts act as an index for "audience curiosity." Tracks leading on Shazam are frequently viral TikTok hits (e.g., "Makeba") in their explosive growth phase, contrasting with top streamed tracks which are usually established, long-lasting hits.</p>
                          <p><strong className="text-zinc-800">3. Platform Divergence:</strong> Differences in Top 10 rankings across Spotify, Apple and Deezer suggest each platform serves different audiences and recommendation dynamics.</p>
                        </div>
                      </div>
                    </div>

                    {/* --- AUDIO FEATURES (COLLAPSIBLE) --- */}

                    <div className="mt-12 pt-8 border-t border-zinc-200">
                      <div className="flex justify-center mb-8">
                        <button 
                          onClick={() => setShowAudioTop10(!showAudioTop10)}
                          className="flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-zinc-800 transition-colors shadow-lg group"
                        >
                          <Music size={18} className={showAudioTop10 ? "text-[#1DB954]" : "text-zinc-400"} />
                          {showAudioTop10 ? 'Hide Audio Feature Rankings' : 'View Top 10 by Audio Feature'}
                          <ChevronDown size={18} className={cn("transition-transform duration-300", showAudioTop10 ? "rotate-180 text-[#1DB954]" : "text-zinc-400")} />
                        </button>
                      </div>

                      <AnimatePresence>
                        {showAudioTop10 && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden space-y-8"
                          >
                            <div className="grid lg:grid-cols-2 gap-10">
                              <Top10Table title="Top 10 by BPM" data={TOP_10_METRICS.bpm} color="#f59e0b" />
                              <Top10Table title="Top 10 by Danceability %" data={TOP_10_METRICS.danceability} color="#10b981" />
                            </div>

                            <div className="grid lg:grid-cols-2 gap-10">
                              <Top10Table title="Top 10 by Energy %" data={TOP_10_METRICS.energy} color="#ef4444" />
                              <Top10Table title="Top 10 by Valence %" data={TOP_10_METRICS.valence} color="#8b5cf6" />
                            </div>

                            <div className="grid lg:grid-cols-2 gap-10">
                              <Top10Table title="Top 10 by Acousticness %" data={TOP_10_METRICS.acousticness} color="#6366f1" />
                              <Top10Table title="Top 10 by Instrumentalness %" data={TOP_10_METRICS.instrumentalness} color="#ec4899" />
                            </div>

                            <div className="grid lg:grid-cols-2 gap-10">
                              <Top10Table title="Top 10 by Liveness %" data={TOP_10_METRICS.liveness} color="#f43f5e" />
                              <Top10Table title="Top 10 by Speechiness %" data={TOP_10_METRICS.speechiness} color="#06b6d4" />
                            </div>

                            {/* Audio Features Insights Box */}
                            <div className="bg-[#1DB954]/10 p-6 rounded-2xl border border-[#1DB954]/20 shadow-sm mt-8">
                              <h4 className="font-bold text-zinc-900 mb-3 flex items-center gap-2">
                                <Zap size={18} className="text-[#1DB954]" /> Audio Feature Insights
                              </h4>
                              <div className="space-y-2 text-sm text-zinc-700 leading-relaxed">
                                <p>Analyzing the rankings reveals that tracks scoring exceptionally high (over 90%) in <strong>Danceability</strong> and <strong>Energy</strong> are predominantly rooted in Rap/Hip-hop, EDM and Latin genres. Conversely, the leaders in <strong>Acousticness</strong> consist largely of Pop Ballads and Indie anthems (featuring artists like Taylor Swift and Billie Eilish) which still amass staggering stream counts. This underscores that softer, acoustic-driven music maintains a formidable stronghold in the global streaming market.</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Stage 2: Preprocessing */}
          <section id="s2" className="scroll-mt-24">
            <SectionHeader 
              title="Stage 2: Preprocessing & Noise" 
              icon={Zap} 
              isOpen={sections.s2} 
              onToggle={() => toggleSection('s2')}
            />
            <AnimatePresence>
              {sections.s2 && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <h4 className="font-bold text-zinc-900 mb-4">Missing Values Distribution</h4>
                      <Plot
                        data={[
                          {
                            type: 'bar',
                            x: ['key', 'in_shazam_charts', 'streams (noise)'],
                            y: [95, 50, 1],
                            marker: { color: ['#1DB954', '#191414', '#e11d48'] },
                            text: ['9.97%', '5.25%', '0.10%'],
                            textposition: 'outside',
                          }
                        ]}
                        layout={{
                          autosize: true,
                          height: 350,
                          margin: { l: 40, r: 20, t: 20, b: 40 },
                          paper_bgcolor: 'rgba(0,0,0,0)',
                          plot_bgcolor: 'rgba(0,0,0,0)',
                          xaxis: { gridcolor: '#f3f4f6' },
                          yaxis: { gridcolor: '#f3f4f6' },
                        }}
                        config={{ displayModeBar: false, responsive: true }}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="bg-zinc-50 p-5 rounded-xl border border-zinc-100">
                        <h5 className="font-bold text-zinc-800 mb-2">Cleaning Strategy</h5>
                        <ul className="text-sm text-zinc-600 space-y-2">
                          <li className="flex gap-2"><strong>1.</strong> Coerced <code>streams</code> to numeric, dropping 1 corrupted row.</li>
                          <li className="flex gap-2"><strong>2.</strong> Filled <code>key</code> missing values with "Unknown".</li>
                          <li className="flex gap-2"><strong>3.</strong> Filled <code>in_shazam_charts</code> with 0.</li>
                        </ul>
                      </div>
                      <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100">
                        <h5 className="font-bold text-emerald-800 mb-1">Result</h5>
                        <p className="text-sm text-emerald-700">Dataset cleaned. Final sample count: <strong>952 tracks</strong>.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Stage 3: Descriptive Statistics & Outliers */}
          <section id="s3" className="scroll-mt-24">
            <SectionHeader 
              title="Stage 3: Descriptive Statistics & Outliers" 
              icon={TrendingUp} 
              isOpen={sections.s3} 
              onToggle={() => toggleSection('s3')}
            />
            <AnimatePresence>
              {sections.s3 && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-8"
                >
                  {/* Descriptive Stats Table */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                      <h4 className="text-sm font-black text-zinc-800 uppercase tracking-tighter flex items-center gap-2">
                        <Clipboard size={16} className="text-[#1DB954]" /> Descriptive Statistics
                      </h4>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        {DESCRIPTIVE_STATS.length} Numerical Features
                      </span>
                    </div>
                    
                    <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-zinc-200">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-zinc-900 text-[10px] uppercase tracking-widest text-zinc-400 font-black">
                              <th className="px-4 py-4 whitespace-nowrap">Feature</th>
                              <th className="px-4 py-4 text-right whitespace-nowrap">Mean</th>
                              <th className="px-4 py-4 text-right whitespace-nowrap">50% (Med)</th>
                              <th className="px-4 py-4 text-right whitespace-nowrap">Std Dev</th>
                              <th className="px-4 py-4 text-right whitespace-nowrap">Min</th>
                              <th className="px-4 py-4 text-right whitespace-nowrap">Max</th>
                            </tr>
                          </thead>
                          <tbody className="text-xs">
                            {(showFullStats ? DESCRIPTIVE_STATS : DESCRIPTIVE_STATS.slice(0, 5)).map((s, idx) => (
                              <tr key={idx} className="group hover:bg-zinc-50 transition-colors border-b border-zinc-100 last:border-0">
                                <td className="px-4 py-4 font-bold text-zinc-800 group-hover:text-[#1DB954] transition-colors whitespace-nowrap">{s.feature}</td>
                                <td className="px-4 py-4 text-right font-mono text-zinc-600 whitespace-nowrap">{s.mean}</td>
                                <td className="px-4 py-4 text-right font-mono text-zinc-900 font-bold whitespace-nowrap">{s.median}</td>
                                <td className="px-4 py-4 text-right font-mono text-zinc-500 whitespace-nowrap">{s.std}</td>
                                <td className="px-4 py-4 text-right font-mono text-zinc-500 whitespace-nowrap">{s.min}</td>
                                <td className="px-4 py-4 text-right font-mono text-zinc-500 whitespace-nowrap">{s.max}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="p-4 bg-zinc-50 flex justify-center border-t border-zinc-100">
                        <button 
                          onClick={() => setShowFullStats(!showFullStats)}
                          className="flex items-center gap-2 text-[#1DB954] hover:text-zinc-900 text-xs font-black uppercase tracking-widest transition-all group"
                        >
                          {showFullStats ? 'Collapse Stats' : 'View All Statistics'}
                          <ChevronDown size={16} className={cn("transition-transform duration-300", showFullStats ? "rotate-180" : "group-hover:translate-y-1")} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Outlier Analysis Section */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                      <h4 className="text-sm font-black text-zinc-800 uppercase tracking-tighter flex items-center gap-2">
                        <Zap size={16} className="text-amber-500" /> Automated Outlier Analysis (IQR)
                      </h4>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        Detected Outliers
                      </span>
                    </div>

                    <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-zinc-200">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-zinc-900 text-[10px] uppercase tracking-widest text-zinc-400 font-black">
                              <th className="px-4 py-4 whitespace-nowrap">Feature</th>
                              <th className="px-4 py-4 text-center whitespace-nowrap">Outliers Count</th>
                              <th className="px-4 py-4 text-center whitespace-nowrap">Percentage (%)</th>
                              <th className="px-4 py-4 text-center whitespace-nowrap">Severity</th>
                            </tr>
                          </thead>
                          <tbody className="text-xs">
                            {(showFullOutliers ? OUTLIER_ANALYSIS : OUTLIER_ANALYSIS.slice(0, 5)).map((o, idx) => (
                              <tr key={idx} className="group hover:bg-zinc-50 transition-colors border-b border-zinc-100 last:border-0">
                                <td className="px-4 py-4 font-bold text-zinc-800 group-hover:text-amber-500 transition-colors whitespace-nowrap">{o.feature}</td>
                                <td className="px-4 py-4 text-center font-mono text-zinc-900 font-bold whitespace-nowrap">{o.count}</td>
                                <td className="px-4 py-4 text-center font-mono text-zinc-600 whitespace-nowrap">{o.percentage}%</td>
                                <td className="px-4 py-4 text-center whitespace-nowrap">
                                  <span className={cn(
                                    "px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter",
                                    o.severity === 'High' ? "bg-red-100 text-red-600 border border-red-200" : 
                                    o.severity === 'Medium' ? "bg-amber-100 text-amber-600 border border-amber-200" : 
                                    "bg-blue-100 text-blue-600 border border-blue-200"
                                  )}>
                                    {o.severity}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="p-4 bg-zinc-50 flex justify-center border-t border-zinc-100">
                        <button 
                          onClick={() => setShowFullOutliers(!showFullOutliers)}
                          className="flex items-center gap-2 text-amber-500 hover:text-zinc-900 text-xs font-black uppercase tracking-widest transition-all group"
                        >
                          {showFullOutliers ? 'Collapse Analysis' : 'View Full Outlier Analysis'}
                          <ChevronDown size={16} className={cn("transition-transform duration-300", showFullOutliers ? "rotate-180" : "group-hover:translate-y-1")} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
                      <h4 className="font-bold text-zinc-900 mb-6 flex items-center gap-2">
                        <Search size={20} className="text-[#1DB954]" /> Statistical Insights
                      </h4>
                      <div className="space-y-4">
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-zinc-100 flex items-start gap-4">
                          <div className="w-1.5 h-12 bg-[#1DB954] rounded-full shrink-0" />
                          <div>
                            <div className="text-[#1DB954] font-black text-[10px] uppercase tracking-widest mb-1">High Variance</div>
                            <p className="text-xs text-zinc-600 leading-relaxed">Features like <code>in_spotify_playlists</code> show massive standard deviation, indicating a power-law distribution where a few tracks dominate.</p>
                          </div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-zinc-100 flex items-start gap-4">
                          <div className="w-1.5 h-12 bg-[#1DB954] rounded-full shrink-0" />
                          <div>
                            <div className="text-[#1DB954] font-black text-[10px] uppercase tracking-widest mb-1">Skewness</div>
                            <p className="text-xs text-zinc-600 leading-relaxed">Most platform-specific metrics are heavily right-skewed (Mean &gt; Median), typical for popularity-based data.</p>
                          </div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-zinc-100 flex items-start gap-4">
                          <div className="w-1.5 h-12 bg-[#1DB954] rounded-full shrink-0" />
                          <div>
                            <div className="text-[#1DB954] font-black text-[10px] uppercase tracking-widest mb-1">Outlier Density</div>
                            <p className="text-xs text-zinc-600 leading-relaxed">Deezer and Shazam metrics show the highest percentage of outliers, suggesting niche popularity spikes in specific regions.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-zinc-900 p-8 rounded-3xl shadow-xl border border-zinc-800">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="bg-[#1DB954]/20 p-2 rounded-xl text-[#1DB954]">
                          <AlertTriangle size={20} />
                        </div>
                        <h4 className="font-black text-white uppercase tracking-tighter text-lg">Outlier Interpretation: The "Mega Hit" Phenomenon</h4>
                      </div>
                      
                      <div className="space-y-6 text-zinc-400 text-sm leading-relaxed border-l-4 border-[#1DB954] pl-5">
                        
                        {/* Point 1 */}
                        <div className="space-y-3">
                          <strong className="text-white text-base tracking-wide">1. The Power-Law Distribution:</strong>
                          <ul className="space-y-2 ml-2">
                            <li className="flex items-start gap-2">
                              <span className="text-[#1DB954] mt-0.5 font-bold">•</span>
                              <span><strong>Statistical Reality:</strong> Features with "High" severity outliers (e.g., 10-16% in Playlists) are typically treated as noise in standard data analysis.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-[#1DB954] mt-0.5 font-bold">•</span>
                              <span><strong>Industry Dynamics:</strong> The music market heavily favors the <em>Pareto principle</em> (the 80/20 rule), where a tiny fraction of tracks dominates global consumption.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-[#1DB954] mt-0.5 font-bold">•</span>
                              <span><strong>The "Mega Hits":</strong> These mathematical anomalies are actually global anthems (e.g., "Blinding Lights", "Shape of You") commanding a disproportionate share of total listenership.</span>
                            </li>
                          </ul>
                        </div>

                        {/* Point 2 */}
                        <div className="space-y-3">
                          <strong className="text-white text-base tracking-wide">2. Catalog Anomalies:</strong>
                          <ul className="space-y-2 ml-2">
                            <li className="flex items-start gap-2">
                              <span className="text-[#1DB954] mt-0.5 font-bold">•</span>
                              <span><strong>Historical Data:</strong> Outliers in the <code className="bg-zinc-800 text-[#1DB954] px-1.5 py-0.5 rounded text-xs font-mono">released_year</code> feature date back to the 1930s-1980s.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-[#1DB954] mt-0.5 font-bold">•</span>
                              <span><strong>Timeless Appeal:</strong> They represent legendary catalog hits rather than incorrect data entries.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-[#1DB954] mt-0.5 font-bold">•</span>
                              <span><strong>Modern Resurgence:</strong> These older tracks frequently experience massive revival waves, fueled by TikTok trends and algorithmic streaming recommendations.</span>
                            </li>
                          </ul>
                        </div>

                        {/* Actionable Insight */}
                        <div className="mt-8 italic font-medium text-zinc-300 bg-[#1DB954]/10 border border-[#1DB954]/20 p-5 rounded-xl">
                          <span className="font-black text-[#1DB954] not-italic mr-2 uppercase tracking-widest text-xs">💡 Actionable Insight:</span> 
                          Unlike typical data cleaning workflows, we strictly <strong className="text-white">MUST NOT</strong> remove or cap these outliers. Truncating them would mean erasing the very pinnacle of success we are attempting to decode in this dataset.
                        </div>

                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Stage 4: Distribution Analysis */}
          <section id="s4" className="scroll-mt-24">
            <SectionHeader 
              title="Stage 4: Distribution Analysis" 
              icon={LayoutDashboard} 
              isOpen={sections.s4} 
              onToggle={() => toggleSection('s4')}
            />
            <AnimatePresence>
              {sections.s4 && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-8">
                    <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
                      <h4 className="font-bold text-zinc-900 mb-2 text-lg">Audio Feature Distributions</h4>
                      <p className="text-xs text-zinc-500 mb-6">
                        Distribution of key audio features across tracks.
                      </p>
                      <Plot
                        data={audioDistributionFacetTraces as any[]}
                        layout={audioDistributionFacetLayout}
                        config={{ responsive: true }}
                        className="w-full"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
                        <h4 className="font-bold text-zinc-900 mb-6 text-lg">Key Distribution</h4>
                        <Plot
                          data={[
                            {
                              type: 'bar',
                              x: keyDistributionTrace.x,
                              y: keyDistributionTrace.y,
                              marker: { color: '#1DB954' },
                              text: keyDistributionTrace.y,
                              textposition: 'auto',
                            }
                          ] as any[]}
                          layout={{
                            autosize: true,
                            height: 350,
                            margin: { l: 40, r: 20, t: 20, b: 40 },
                            paper_bgcolor: 'rgba(0,0,0,0)',
                            plot_bgcolor: 'rgba(0,0,0,0)',
                          }}
                          config={{ responsive: true }}
                          className="w-full"
                        />
                      </div>
                      <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
                        <h4 className="font-bold text-zinc-900 mb-6 text-lg">Mode Distribution</h4>
                        <Plot
                          data={[
                            {
                              type: 'pie',
                              labels: modeDistributionTrace.x,
                              values: modeDistributionTrace.y,
                              marker: { colors: ['#1DB954', '#191414'] },
                              hole: 0.4,
                            }
                          ]}
                          layout={{
                            autosize: true,
                            height: 350,
                            margin: { l: 20, r: 20, t: 20, b: 20 },
                            paper_bgcolor: 'rgba(0,0,0,0)',
                            showlegend: true,
                            legend: { orientation: 'h', x: 0.5, xanchor: 'center', y: -0.1 }
                          }}
                          config={{ responsive: true }}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
                      <h4 className="font-bold text-zinc-900 mb-6 text-lg">Distribution of Songs by Artist Count</h4>
                      <Plot
                        data={[
                          {
                            type: 'bar',
                            x: artistCountDistributionTrace.x,
                            y: artistCountDistributionTrace.y,
                            marker: { 
                              color: '#1DB954',
                              line: { color: '#191414', width: 1 }
                            },
                            text: artistCountDistributionTrace.y,
                            textposition: 'auto',
                          }
                        ] as any[]}
                        layout={{
                          autosize: true,
                          height: 420,
                          margin: { l: 50, r: 30, t: 30, b: 50 },
                          xaxis: { title: 'Number of Credited Artists' },
                          yaxis: { title: 'Number of Tracks' },
                          paper_bgcolor: 'rgba(0,0,0,0)',
                          plot_bgcolor: 'rgba(0,0,0,0)',
                        }}
                        config={{ responsive: true }}
                        className="w-full"
                      />
                    </div>

                    <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
                      <h4 className="font-bold text-zinc-900 mb-6 text-lg flex items-center gap-2">
                        <TrendingUp size={20} className="text-[#1DB954]" /> Sample Hit Songs (Top-Quartile Streams)
                      </h4>
                      <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-zinc-900 text-[10px] uppercase tracking-widest text-zinc-400 font-black">
                              <th className="px-6 py-4">ID</th>
                              <th className="px-6 py-4">Track Name</th>
                              <th className="px-6 py-4">Artist(s)</th>
                              <th className="px-6 py-4 text-right">Streams</th>
                              <th className="px-6 py-4 text-center">Dance %</th>
                              <th className="px-6 py-4 text-center">Energy %</th>
                            </tr>
                          </thead>
                          <tbody className="text-xs">
                            {HIT_SONGS_SAMPLES.map((song, idx) => (
                              <tr key={idx} className="group hover:bg-zinc-50 transition-colors border-b border-zinc-100 last:border-0">
                                <td className="px-6 py-4 font-mono text-zinc-400">{song.id}</td>
                                <td className="px-6 py-4 font-bold text-zinc-800 group-hover:text-[#1DB954] transition-colors">{song.track}</td>
                                <td className="px-6 py-4 text-zinc-600">{song.artist}</td>
                                <td className="px-6 py-4 text-right font-mono font-bold text-zinc-900">{song.streams}</td>
                                <td className="px-6 py-4 text-center">
                                  <div className="flex flex-col items-center gap-1">
                                    <span className="font-mono text-zinc-600">{song.dance}%</span>
                                    <div className="w-12 h-1 bg-zinc-100 rounded-full overflow-hidden">
                                      <div className="h-full bg-[#1DB954]" style={{ width: `${song.dance}%` }} />
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <div className="flex flex-col items-center gap-1">
                                    <span className="font-mono text-zinc-600">{song.energy}%</span>
                                    <div className="w-12 h-1 bg-zinc-100 rounded-full overflow-hidden">
                                      <div className="h-full bg-amber-500" style={{ width: `${song.energy}%` }} />
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-6 bg-zinc-100/50 p-4 rounded-2xl border border-zinc-200">
                        <p className="text-xs text-zinc-500 italic flex items-start gap-2">
                          <Info size={14} className="mt-0.5 shrink-0 text-[#1DB954]" />
                          <span>
                            <strong className="text-zinc-700 not-italic">Representative Sampling:</strong> These tracks are curated from the <strong className="text-zinc-900 not-italic">top quartile by streams</strong>, not just the absolute Top 10. This highlights <strong className="text-zinc-900 not-italic">different paths to success</strong>: while many hits cluster at high danceability (avg &gt; 70%), outliers like "Before You Go" (45%) show emotional ballads can still break through.
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Stage 5: Correlation Analysis */}
          <section id="s5" className="scroll-mt-24">
            <SectionHeader 
              title="Stage 5: Correlation Analysis" 
              icon={Layers} 
              isOpen={sections.s5} 
              onToggle={() => toggleSection('s5')}
            />
            <AnimatePresence>
              {sections.s5 && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-12">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
                        <h4 className="font-bold text-zinc-900 mb-4">Hit Predictors (Top-Quartile Songs)</h4>
                        <Plot
                          data={hitPredictorTraces as any[]}
                          layout={{
                            autosize: true,
                            height: 400,
                            margin: { l: 130, r: 40, t: 20, b: 40 },
                            barmode: 'relative',
                            xaxis: { range: [-0.2, 0.75], gridcolor: '#e5e7eb' },
                            legend: { orientation: 'h', y: -0.15 },
                            paper_bgcolor: 'rgba(0,0,0,0)',
                            plot_bgcolor: 'rgba(0,0,0,0)',
                          }}
                          config={{ responsive: true }}
                          className="w-full"
                        />
                      </div>
                      <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
                        <h4 className="font-bold text-zinc-900 mb-4">Cross-Platform Presence Correlation Matrix</h4>
                        <Plot
                          data={[
                            {
                              ...platformHeatmapTrace,
                              colorscale: 'Greens',
                              texttemplate: '%{z:.2f}',
                              showscale: true,
                            }
                          ] as any[]}
                          layout={{
                            autosize: true,
                            height: 350,
                            margin: { l: 100, r: 20, t: 20, b: 100 },
                            paper_bgcolor: 'rgba(0,0,0,0)',
                            plot_bgcolor: 'rgba(0,0,0,0)',
                          }}
                          config={{ responsive: true }}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-zinc-200">
                      <h4 className="text-sm font-black uppercase tracking-widest text-zinc-700">Song Coverage by Platform</h4>
                      <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
                        <h5 className="font-bold text-zinc-900 mb-6">Distribution of Songs by Platform Count</h5>
                        <Plot
                          data={[
                            {
                              ...platformCountDistributionNonZero,
                              x: platformCountDistributionNonZero.x.map((count: number) => `${count} Platform${count === 1 ? '' : 's'}`),
                              marker: { color: '#1DB954' },
                              text: platformCountDistributionNonZero.y,
                              textposition: 'outside',
                            }
                          ] as any[]}
                          layout={{
                            autosize: true,
                            height: 350,
                            margin: { l: 50, r: 30, t: 30, b: 50 },
                            xaxis: { title: 'Number of Platforms' },
                            yaxis: { title: 'Song Count' },
                            paper_bgcolor: 'rgba(0,0,0,0)',
                            plot_bgcolor: 'rgba(0,0,0,0)',
                          }}
                          config={{ responsive: true }}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-black uppercase tracking-widest text-zinc-700">Platform Presence vs Total Streams</h4>
                      <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100"> 
                        <h5 className="font-bold text-zinc-900 mb-6">Correlation Strength by Platform Metric</h5>
                        <Plot
                          data={[platformStreamCorrelationTrace] as any[]}
                          layout={{
                            autosize: true,
                            height: 350,
                            margin: { l: 140, r: 30, t: 30, b: 50 },
                            xaxis: { title: 'Correlation Coefficient', range: [-0.1, 0.85], gridcolor: '#e5e7eb' },
                            yaxis: { title: 'Platform Metric' },
                            paper_bgcolor: 'rgba(0,0,0,0)',
                            plot_bgcolor: 'rgba(0,0,0,0)',
                          }}
                          config={{ responsive: true }}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col justify-center space-y-6">
                      <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                        <h5 className="font-bold text-zinc-900 mb-3">Strongest Relationships</h5>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-600">Spotify Charts ↔ Deezer Charts</span>
                            <span className="font-mono font-bold text-[#1DB954]">+0.46</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-600">Spotify Charts ↔ Shazam Charts</span>
                            <span className="font-mono font-bold text-[#1DB954]">+0.40</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-600">Deezer Charts ↔ Shazam Charts</span>
                            <span className="font-mono font-bold text-[#1DB954]">+0.32</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-zinc-900 p-6 rounded-2xl text-white shadow-xl">
                        <h5 className="font-bold text-[#1DB954] mb-2 flex items-center gap-2">
                          <TrendingUp size={18} /> Hit Predictor
                        </h5>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
                            <span className="text-xs text-zinc-400">Spotify Playlists ↔ Hit Status</span>
                            <span className="font-mono font-bold text-[#1DB954]">+0.68</span>
                          </div>
                          <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
                            <span className="text-xs text-zinc-400">Apple Playlists ↔ Hit Status</span>
                            <span className="font-mono font-bold text-[#1DB954]">+0.61</span>
                          </div>
                          <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
                            <span className="text-xs text-zinc-400">Artist Count ↔ Hit Status</span>
                            <span className="font-mono font-bold text-rose-400">-0.15</span>
                          </div>
                        </div>
                        <p className="text-xs text-zinc-500 mt-3 italic">
                          * Hit status = tracks in the top quartile of streams.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Stage 6: Artist Impact & Superstar Effect */}
          <section id="s6" className="scroll-mt-24">
            <SectionHeader 
              title="Stage 6: Artist Impact & Superstar Effect" 
              icon={PieChart} 
              isOpen={sections.s6} 
              onToggle={() => toggleSection('s6')}
            />
            <AnimatePresence>
              {sections.s6 && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-12">
                    <div className="space-y-6">
                      <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
                        <h4 className="font-bold text-zinc-900 mb-6">Top 10 Artists by Total Streams</h4>
                        <Plot
                          data={[topArtistsTrace] as any[]}
                          layout={{
                            autosize: true,
                            height: 500,
                            margin: { l: 120, r: 50, t: 30, b: 50 },
                            xaxis: { title: 'Total Streams (Billions)', gridcolor: '#e5e7eb' },
                            yaxis: { autorange: 'reversed' },
                            paper_bgcolor: 'rgba(0,0,0,0)',
                            plot_bgcolor: 'rgba(0,0,0,0)',
                          }}
                          config={{ responsive: true }}
                          className="w-full"
                        />
                      </div>
                      <div className="bg-zinc-900 p-6 rounded-2xl text-white">
                        <p className="text-sm font-bold text-[#1DB954] mb-2">Superstar Effect</p>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          The Top 10 artists account for <strong>{top10ArtistsShare.toFixed(1)}%</strong> of total streams in the dataset.
                          This concentration of success highlights the "Superstar Effect" where a small fraction of creators captures a disproportionate share of the market.
                        </p>
                        <div className="mt-4 grid md:grid-cols-3 gap-3 text-xs">
                          {topArtistMarketShare.slice(0, 3).map((artist) => (
                            <div key={artist.name} className="rounded-xl border border-zinc-700 bg-zinc-800/70 p-3">
                              <div className="font-semibold text-zinc-100 truncate">{artist.name}</div>
                              <div className="text-[#1DB954] font-mono mt-1">{artist.streams} ({artist.pct}%)</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                      <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
                        <h4 className="font-bold text-zinc-900 mb-6">Distribution of Songs per Artist</h4>
                        <Plot
                          data={[
                            {
                              ...songsPerArtistDistributionTrace,
                              marker: { color: '#6366f1' },
                              nbinsx: 20,
                            }
                          ] as any[]}
                          layout={{
                            autosize: true,
                            height: 350,
                            margin: { l: 50, r: 30, t: 30, b: 50 },
                            xaxis: { title: 'Number of Songs Released by Artist' },
                            yaxis: { title: 'Number of Artists' },
                            paper_bgcolor: 'rgba(0,0,0,0)',
                            plot_bgcolor: 'rgba(0,0,0,0)',
                          }}
                          config={{ responsive: true }}
                          className="w-full"
                        />
                        <p className="mt-4 text-xs text-zinc-500 italic">
                          * Total unique artists: {UNIQUE_ARTIST_COUNT}. Majority of artists have only one song in the top list.
                        </p>
                      </div>
                      <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
                        <h4 className="font-bold text-zinc-900 mb-6">Collaboration Mix</h4>
                        <div className="space-y-5">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm font-bold">
                              <span>Solo tracks</span>
                              <span className="text-[#1DB954]">{soloTracks} ({toPercent(soloTracks, CLEAN_TRACK_COUNT)})</span>
                            </div>
                            <div className="h-2 rounded-full bg-zinc-100 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(soloTracks / CLEAN_TRACK_COUNT) * 100}%` }}
                                transition={{ duration: 0.8 }}
                                className="h-full bg-[#1DB954]"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm font-bold">
                              <span>2-artist collabs</span>
                              <span className="text-zinc-900">{duoTracks} ({toPercent(duoTracks, CLEAN_TRACK_COUNT)})</span>
                            </div>
                            <div className="h-2 rounded-full bg-zinc-100 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(duoTracks / CLEAN_TRACK_COUNT) * 100}%` }}
                                transition={{ duration: 0.8, delay: 0.05 }}
                                className="h-full bg-zinc-900"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm font-bold">
                              <span>3+ artist collabs</span>
                              <span className="text-amber-600">{groupTracks} ({toPercent(groupTracks, CLEAN_TRACK_COUNT)})</span>
                            </div>
                            <div className="h-2 rounded-full bg-zinc-100 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(groupTracks / CLEAN_TRACK_COUNT) * 100}%` }}
                                transition={{ duration: 0.8, delay: 0.1 }}
                                className="h-full bg-amber-500"
                              />
                            </div>
                          </div>
                          <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-zinc-600 leading-relaxed">
                            Solo records dominate the dataset, while collaborations still represent a meaningful <strong className="text-zinc-900">{toPercent(collaborativeTracks, CLEAN_TRACK_COUNT)}</strong> of tracks. The structure is broad, but not collaboration-heavy enough to make multi-artist credits the default pattern.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                      <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
                        <h4 className="font-bold text-zinc-900 mb-6">Streams by Artist Count (Median & IQR)</h4>
                        <Plot
                          data={[
                            {
                              type: 'box',
                              name: 'Streams',
                              boxpoints: false,
                              x: ARTIST_COUNT_STREAMS_SUMMARY.map((d) => `${d.artistCount} artist${d.artistCount > 1 ? 's' : ''}`),
                              q1: ARTIST_COUNT_STREAMS_SUMMARY.map((d) => d.q1),
                              median: ARTIST_COUNT_STREAMS_SUMMARY.map((d) => d.median),
                              q3: ARTIST_COUNT_STREAMS_SUMMARY.map((d) => d.q3),
                              marker: { color: '#1DB954' },
                              line: { color: '#191414', width: 1.4 },
                              customdata: ARTIST_COUNT_STREAMS_SUMMARY.map((d) => [d.n, d.q3 - d.q1]),
                              hovertemplate:
                                '<b>%{x}</b><br>Q1: %{q1:,}<br>Median: %{median:,}<br>Q3: %{q3:,}<br>IQR: %{customdata[1]:,.0f}<br>n: %{customdata[0]}<extra></extra>',
                            },
                          ] as any[]}
                          layout={{
                            autosize: true,
                            height: 390,
                            margin: { l: 64, r: 24, t: 20, b: 72 },
                            yaxis: { title: 'Streams' },
                            xaxis: { title: 'Artist Count', tickangle: -18 },
                            paper_bgcolor: 'rgba(0,0,0,0)',
                            plot_bgcolor: 'rgba(0,0,0,0)',
                          }}
                          className="w-full"
                        />
                      </div>

                      <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
                        <h4 className="font-bold text-zinc-900 mb-6">Mean Streams: Solo vs Collaboration</h4>
                        <Plot
                          data={[
                            {
                              type: 'bar',
                              x: SOLO_VS_COLLABORATION_MEAN_STREAMS.map((d) => d.group),
                              y: SOLO_VS_COLLABORATION_MEAN_STREAMS.map((d) => d.meanStreams),
                              marker: {
                                color: SOLO_VS_COLLABORATION_MEAN_STREAMS.map((d) =>
                                  d.group === 'Solo' ? '#1DB954' : '#191414'
                                ),
                              },
                              text: SOLO_VS_COLLABORATION_MEAN_STREAMS.map(
                                (d) => `${(d.meanStreams / 1_000_000).toFixed(1)}M`
                              ),
                              textposition: 'outside',
                              hovertemplate: '<b>%{x}</b><br>Mean streams: %{y:,}<extra></extra>',
                            },
                          ] as any[]}
                          layout={{
                            autosize: true,
                            height: 390,
                            margin: { l: 64, r: 24, t: 20, b: 64 },
                            yaxis: { title: 'Mean Streams' },
                            xaxis: { title: 'Song Type' },
                            paper_bgcolor: 'rgba(0,0,0,0)',
                            plot_bgcolor: 'rgba(0,0,0,0)',
                          }}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Stage 7: Temporal Trends & Seasonality */}
          <section id="s7" className="scroll-mt-24">
            <SectionHeader 
              title="Stage 7: Temporal Trends & Seasonality" 
              icon={LineChart} 
              isOpen={sections.s7} 
              onToggle={() => toggleSection('s7')}
            />
            <AnimatePresence>
              {sections.s7 && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-16 py-8">
                    {/* 1. Music Features Trend */}
                    <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
                      <h4 className="font-bold text-zinc-900 mb-3">Audio Feature Trends by Release Year (2000 - 2023)</h4>
                      <Plot
                        data={musicFeatureTrendTraces as any[]}
                        layout={{
                          autosize: true,
                          height: 500,
                          margin: { l: 60, r: 60, t: 20, b: 60 },
                          xaxis: { title: 'Year', gridcolor: '#f3f4f6' },
                          yaxis: { title: 'Average Value (%)', gridcolor: '#f3f4f6', range: [0, 100] },
                          yaxis2: {
                            title: 'BPM',
                            overlaying: 'y',
                            side: 'right',
                            range: [80, 160],
                            showgrid: false
                          },
                          legend: { orientation: 'h', y: 1.1 },
                          hovermode: 'x unified',
                          paper_bgcolor: 'rgba(0,0,0,0)',
                          plot_bgcolor: 'rgba(0,0,0,0)',
                        }}
                        config={{ responsive: true }}
                        className="w-full"
                      />
                      <p className="mt-3 text-xs text-zinc-500">
                        Note: Year refers to each song&apos;s release year in the dataset catalog, not only songs released in 2023.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                      {/* 2. Seasonality */}
                      <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
                        <h4 className="font-bold text-zinc-900 mb-6">Seasonality: Number of Hits Released by Month</h4>
                        <Plot
                          data={[
                            {
                              ...seasonalityTrace,
                              marker: { 
                                color: seasonalityTrace.y,
                                colorscale: 'Viridis'
                              },
                              text: seasonalityTrace.y,
                              textposition: 'outside',
                            }
                          ] as any[]}
                          layout={{
                            autosize: true,
                            height: 400,
                            margin: { l: 50, r: 30, t: 30, b: 50 },
                            xaxis: { title: 'Month' },
                            yaxis: { title: 'Number of Songs' },
                            paper_bgcolor: 'rgba(0,0,0,0)',
                            plot_bgcolor: 'rgba(0,0,0,0)',
                          }}
                          config={{ responsive: true }}
                          className="w-full"
                        />
                      </div>

                      {/* 3. Friday Phenomenon */}
                      <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
                        <h4 className="font-bold text-zinc-900 mb-6">The Friday Phenomenon: Release Volume by Day</h4>
                        <Plot
                          data={[
                            {
                              ...fridayPhenomenonTrace,
                              line: { color: '#1DB954', width: 4 },
                              marker: { size: 10, color: '#191414' },
                              fill: 'tozeroy',
                              fillcolor: 'rgba(29, 185, 84, 0.1)'
                            }
                          ]}
                          layout={{
                            autosize: true,
                            height: 400,
                            margin: { l: 50, r: 30, t: 30, b: 50 },
                            xaxis: { title: 'Day of the Week' },
                            yaxis: { title: 'Total Tracks Released' },
                            paper_bgcolor: 'rgba(0,0,0,0)',
                            plot_bgcolor: 'rgba(0,0,0,0)',
                          }}
                          config={{ responsive: true }}
                          className="w-full"
                        />
                        <div className="mt-6 p-4 bg-zinc-900 rounded-xl text-white">
                          <p className="text-xs text-zinc-400 leading-relaxed">
                            Industry standard: Most tracks are released on <strong>Friday</strong> to maximize chart impact during the weekend.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Stage 8: Success Factors */}
          <section id="s8" className="scroll-mt-24">
            <SectionHeader 
              title="Stage 8: Success Factors" 
              icon={BarChart3} 
              isOpen={sections.s8} 
              onToggle={() => toggleSection('s8')}
            />
            <AnimatePresence>
              {sections.s8 && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-12 py-8">
                    {/* 1. The "Gatekeeper" Effect */}
                    <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
                      <h4 className="font-bold text-zinc-900 mb-8 text-center uppercase tracking-wider text-sm">The "Gatekeeper" Effect: Playlist Reach vs Streams</h4>
                      <Plot
                        data={[platformStreamCorrelationTrace] as any[]}
                        layout={{
                          autosize: true,
                          height: 450,
                          margin: { l: 160, r: 40, t: 40, b: 60 },
                          xaxis: { title: 'Correlation with Streams', range: [-0.1, 0.85], gridcolor: '#e5e7eb' },
                          yaxis: { title: 'Platform Metric', gridcolor: '#e5e7eb' },
                          paper_bgcolor: 'rgba(0,0,0,0)',
                          plot_bgcolor: 'rgba(0,0,0,0)',
                        }}
                        config={{ responsive: true }}
                        className="w-full"
                      />
                      <div className="mt-8 p-6 bg-white rounded-2xl shadow-sm border border-zinc-100">
                        <h5 className="font-bold text-zinc-900 mb-2">The "Winning" Formula</h5>
                        <p className="text-sm text-zinc-600 leading-relaxed">
                          Playlist reach is the dominant success signal: <strong>Spotify playlists (0.79)</strong>, <strong>Apple playlists (0.77)</strong>,= and <strong>Deezer playlists (0.60)</strong> all correlate far more strongly with streams than chart counts. Shazam presence is nearly neutral, so discovery alone is not enough without sustained playlist support.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Stage 9: Audio Profile & Sonic Mood */}
          <section id="s9" className="scroll-mt-24">
            <SectionHeader 
              title="Stage 9: Audio Profile & Sonic Mood" 
              icon={Music} 
              isOpen={sections.s9} 
              onToggle={() => toggleSection('s9')}
            />
            <AnimatePresence>
              {sections.s9 && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-12 py-8">
                    {/* 1. Sonic Mood Bubble Plot */}
                    <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
                      <h4 className="font-bold text-zinc-900 mb-8 text-center uppercase tracking-wider text-sm">The Sonic Mood of 2023: Energy vs. Valence</h4>
                      <Plot
                        data={sonicMoodTraces as any[]}
                        layout={{
                          autosize: true,
                          height: 500,
                          margin: { l: 60, r: 40, t: 40, b: 60 },
                          xaxis: { title: 'Valence (Sad -> Happy)', range: [0, 100], gridcolor: '#e5e7eb' },
                          yaxis: { title: 'Energy (Calm -> Intense)', range: [0, 100], gridcolor: '#e5e7eb' },
                          paper_bgcolor: 'rgba(0,0,0,0)',
                          plot_bgcolor: 'rgba(0,0,0,0)',
                          shapes: [
                            { type: 'line', x0: 51.41, x1: 51.41, y0: 0, y1: 100, line: { color: 'gray', dash: 'dash', width: 1 } },
                            { type: 'line', x0: 0, x1: 100, y0: 64.27, y1: 64.27, line: { color: 'gray', dash: 'dash', width: 1 } }
                          ],
                          annotations: [
                            { x: 51.41, y: 100, text: 'Avg Valence', showarrow: false, yanchor: 'bottom', font: { size: 10 } },
                            { x: 100, y: 64.27, text: 'Avg Energy', showarrow: false, xanchor: 'left', font: { size: 10 } }
                          ]
                        }}
                        config={{ responsive: true }}
                        className="w-full"
                      />
                    </div>

                    {/* 2. Audio Profile Radar Chart */}
                    <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
                      <h4 className="font-bold text-zinc-900 mb-2 text-center uppercase tracking-wider text-sm">Audio Profile Comparison: Mega Hits vs Normal Hits</h4>
                      <p className="mb-4 text-center text-xs text-zinc-500">
                        Note: Each spoke represents one audio feature (% scale). Farther from the center means a higher average value.
                      </p>
                      <Plot
                        data={audioProfileTraces as any[]}
                        layout={{
                          autosize: true,
                          height: 500,
                          margin: { l: 80, r: 80, t: 40, b: 40 },
                          polar: {
                            radialaxis: {
                              visible: true,
                              range: [0, 80],
                              gridcolor: '#e5e7eb',
                              showticklabels: false,
                              ticks: '',
                            },
                            angularaxis: { gridcolor: '#e5e7eb' }
                          },
                          paper_bgcolor: 'rgba(0,0,0,0)',
                          plot_bgcolor: 'rgba(0,0,0,0)',
                          showlegend: true,
                          legend: { orientation: 'h', y: -0.1 }
                        }}
                        config={{ responsive: true }}
                        className="w-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Key Insights */}
          <section id="summary" className="scroll-mt-24">
            <SectionHeader 
              title="Key Insights" 
              icon={Clipboard} 
              isOpen={sections.summary} 
              onToggle={() => toggleSection('summary')}
            />
            <AnimatePresence>
              {sections.summary && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-8"
                >
                  
                  {/* Part 1: Dataset Characteristics (Spotify Light Theme) */}
                  <div className="bg-white text-zinc-700 p-8 md:p-10 rounded-[40px] border-l-12 border-[#1DB954] shadow-2xl relative overflow-hidden mb-12">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#1DB954] opacity-5 blur-[100px] rounded-full pointer-events-none"></div>
                    
                    <h3 className="text-2xl font-black text-black mb-8 flex items-center gap-3 border-b border-zinc-100 pb-4 relative z-10">
                      <Database size={24} className="text-[#1DB954]"/> Dataset Characteristics
                    </h3>

                    <div className="grid md:grid-cols-2 gap-x-12 gap-y-10 relative z-10">
                      
                      {/* Item 1 */}
                      <div className="space-y-3">
                        <h4 className="text-[#1DB954] font-black text-xl tracking-tight uppercase">1. Total Samples & Features</h4>
                        <ul className="space-y-2 text-sm ml-1">
                           <li className="flex items-start gap-2">
                              <span className="text-[#1DB954] mt-1 text-xs">►</span>
                              <span>The initial dataset contained <strong className="text-zinc-950">953 songs and 24 features</strong>. After initial cleaning, 952 samples remained due to one corrupted record in <code className="bg-zinc-100 text-[#1DB954] px-1.5 py-0.5 rounded text-xs font-mono">streams</code> being dropped.</span>
                           </li>
                        </ul>
                      </div>

                      {/* Item 2 */}
                      <div className="space-y-3">
                        <h4 className="text-[#1DB954] font-black text-xl tracking-tight uppercase">2. Missing Values</h4>
                        <ul className="space-y-2 text-sm ml-1">
                           <li className="flex items-start gap-2">
                              <span className="text-[#1DB954] mt-1 text-xs">►</span>
                              <span><strong className="text-zinc-950">Initial Dataset:</strong> Handled missing data during preprocessing to ensure model stability.</span>
                           </li>
                           <li className="flex items-start gap-2">
                              <span className="text-[#1DB954] mt-1 text-xs">►</span>
                              <span><code className="bg-zinc-100 text-[#1DB954] px-1.5 py-0.5 rounded text-xs font-mono">key</code> : 95 missing values (9.97%). Handled by filling with 'Unknown'.</span>
                           </li>
                           <li className="flex items-start gap-2">
                              <span className="text-[#1DB954] mt-1 text-xs">►</span>
                              <span><code className="bg-zinc-100 text-[#1DB954] px-1.5 py-0.5 rounded text-xs font-mono">in_shazam_charts</code> : 50 missing values (5.25%). Handled by filling with 0.</span>
                           </li>
                        </ul>
                      </div>

                      {/* Item 3 */}
                      <div className="space-y-3">
                        <h4 className="text-[#1DB954] font-black text-xl tracking-tight uppercase">3. Outliers & Data Skewness</h4>
                        <ul className="space-y-2 text-sm ml-1">
                           <li className="flex items-start gap-2">
                              <span className="text-[#1DB954] mt-1 text-xs shrink-0">►</span>
                              <span><strong className="text-zinc-950">Not Errors:</strong> Several numerical features exhibit a high number of 'outliers' according to the IQR method. These are often characteristics of the data's inherent right-skewed distribution.</span>
                           </li>
                           <li className="flex items-start gap-2">
                              <span className="text-[#1DB954] mt-1 text-xs shrink-0">►</span>
                              <span><strong className="text-zinc-950">Popularity Metrics:</strong> <code className="bg-zinc-100 text-[#1DB954] px-1.5 py-0.5 rounded text-xs font-mono">in_deezer_playlists</code>, <code className="bg-zinc-100 text-[#1DB954] px-1.5 py-0.5 rounded text-xs font-mono">in_spotify_playlists</code> and <code className="bg-zinc-100 text-[#1DB954] px-1.5 py-0.5 rounded text-xs font-mono">in_shazam_charts</code> show a strong right-skew, typical for popularity metrics where a few 'super hits' possess extremely high values.</span>
                           </li>
                           <li className="flex items-start gap-2">
                              <span className="text-[#1DB954] mt-1 text-xs shrink-0">►</span>
                              <span><strong className="text-zinc-950">Other Features:</strong> <code className="bg-zinc-100 text-[#1DB954] px-1.5 py-0.5 rounded text-xs font-mono">released_year</code> outliers reflect older tracks (1930-2000), while <code className="bg-zinc-100 text-[#1DB954] px-1.5 py-0.5 rounded text-xs font-mono">speechiness_%</code> outliers naturally occur in rap/spoken-word tracks.</span>
                           </li>
                        </ul>
                      </div>

                      {/* Item 4 */}
                      <div className="space-y-3">
                        <h4 className="text-[#1DB954] font-black text-xl tracking-tight uppercase">4. Correlations</h4>
                        <ul className="space-y-2 text-sm ml-1">
                           <li className="flex items-start gap-2">
                              <span className="text-[#1DB954] mt-1 text-xs">►</span>
                              <span><strong className="text-zinc-950">Playlist Impact:</strong> Strong positive correlations exist between <code className="bg-zinc-100 text-[#1DB954] px-1.5 py-0.5 rounded text-xs font-mono">streams</code> and playlist inclusions.</span>
                           </li>
                           <li className="flex items-start gap-2">
                              <span className="text-[#1DB954] mt-1 text-xs">►</span>
                              <span><strong className="text-zinc-950">Key Drivers:</strong> Notably high with <code className="bg-zinc-100 text-[#1DB954] px-1.5 py-0.5 rounded text-xs font-mono">in_spotify_playlists</code> (r=0.79) and <code className="bg-zinc-100 text-[#1DB954] px-1.5 py-0.5 rounded text-xs font-mono">in_apple_playlists</code> (r=0.77), indicating their significant impact on a song's success.</span>
                           </li>
                           <li className="flex items-start gap-2">
                              <span className="text-[#1DB954] mt-1 text-xs">►</span>
                              <span><strong className="text-zinc-950">Audio Features:</strong> Generally show low to moderate correlations compared to distribution metrics.</span>
                           </li>
                        </ul>
                      </div>

                    </div>
                  </div>

                  {/* Executive Summary (Part 2) */}
                      <div className="mt-10 p-8 rounded-3xl border border-[#1DB954]/30 bg-linear-to-br from-[#0f172a] to-[#02040c] text-white shadow-2xl">
                        <h3 className="text-3xl font-black text-[#1DB954] mb-6 uppercase tracking-tight">Executive Summary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-zinc-900 p-6 rounded-2xl border-l-4 border-[#1DB954] shadow-inner">
                            <h4 className="text-lg font-black text-[#1DB954] mb-2">1. Playlist Power</h4>
                            <p className="text-sm text-zinc-100 leading-relaxed">Spotify and Apple playlists are the ultimate gatekeepers. Correlation with streams (r ≈ 0.79) dwarfs all other metrics. Multi-platform presence is non-negotiable for hits.</p>
                          </div>
                          <div className="bg-zinc-900 p-6 rounded-2xl border-l-4 border-[#1DB954] shadow-inner">
                            <h4 className="text-lg font-black text-[#1DB954] mb-2">2. Sonic Mood</h4>
                            <p className="text-sm text-zinc-100 leading-relaxed">Mega Hits and normal hits share very similar audio profiles. Major mode still dominates, but distribution support matters more than any radical sonic difference.</p>
                          </div>
                          <div className="bg-zinc-900 p-6 rounded-2xl border-l-4 text-[#1DB954] shadow-inner">
                            <h4 className="text-lg font-black text-[#1DB954] mb-2">3. Superstar Effect</h4>
                            <p className="text-sm text-zinc-100 leading-relaxed">A classic power-law distribution: the top 10 artists account for {top10ArtistsShare.toFixed(1)}% of streams. Collaborations are common, but solo tracks still dominate the chart population.</p>
                          </div>
                          <div className="bg-zinc-900 p-6 rounded-2xl border-l-4 text-[#1DB954] shadow-inner">
                            <h4 className="text-lg font-black text-[#1DB954] mb-2">4. Friday Dominance</h4>
                            <p className="text-sm text-zinc-100 leading-relaxed">Release timing is highly optimized. 55% of hits drop on Friday to catch the editorial wave. January and May are peak months for hit density.</p>
                          </div>
                        </div>
                        <div className="mt-8 border-t border-[#1DB954]/40 pt-6 text-center">
                          <p className="text-[#7efc8f] italic font-bold text-lg">
                            "Achieving Mega Hit status is a sophisticated interplay of strategic playlisting, energetic production and optimized release timing"
                          </p>
                        </div>
                      </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

        </main>

        {/* Footer */}
        <footer className="bg-zinc-50 border-t border-zinc-200 p-10 text-center text-zinc-500 text-sm">
          <div className="flex justify-center gap-6 mb-4">
            <Music size={20} />
            <TrendingUp size={20} />
            <BarChart3 size={20} />
          </div>
          <p className="font-bold text-zinc-900 mb-1">Spotify Top Songs 2023 — EDA Report</p>
          <p>Built with React, Plotly.js and Tailwind CSS</p>
          <p className="mt-4 text-[10px] uppercase tracking-widest opacity-50">© 2026 Data Science Insights</p>
        </footer>
      </div>
    </div>
  );
}
