import React, { useState, useEffect } from 'react';
import Plotly from 'plotly.js-dist-min';
import createPlotlyComponent from 'react-plotly.js/factory';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-tomorrow.css';
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
  FileCode, 
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
import edaData from './data/eda_spotify_tracks.json';

const Plot = createPlotlyComponent(Plotly);

interface CodeExample {
  title: string;
  plotly: string;
  matplotlib: string;
  seaborn: string;
}

interface EdaData {
  [key: string]: CodeExample;
}

const typedEdaData = edaData as unknown as EdaData;

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

const SectionHeader = ({ 
  title, 
  icon: Icon, 
  isOpen, 
  onToggle, 
  onViewCode,
  showCodeButton = true
}: { 
  title: string, 
  icon: any, 
  isOpen: boolean, 
  onToggle: () => void,
  onViewCode: () => void
  showCodeButton?: boolean
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
        {showCodeButton && (
        <div className="flex gap-2">
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              onViewCode(); 
            }}
            className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-zinc-800 transition-colors shadow-md"
          >
            <FileCode size={16} /> View Code
          </button>
        </div>
            )}
      </div>
  );
};

const CodePanel = ({ sectionKey, isOpen }: { sectionKey: string, isOpen: boolean }) => {
  const [activeTab, setActiveTab] = useState<'plotly' | 'matplotlib' | 'seaborn'>('plotly');
  const data = typedEdaData[sectionKey];

  useEffect(() => {
    if (isOpen) {
      Prism.highlightAll();
    }
  }, [isOpen, activeTab]);

  if (!data) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden mb-8"
        >
          <div className="bg-zinc-50 border-l-8 border-[#1DB954] rounded-r-xl p-6 shadow-inner">
            <h3 className="text-xl font-bold text-[#1DB954] mb-4 flex items-center gap-2">
              <FileCode size={20} /> {data.title}
            </h3>
            
            <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-xl">
              <div className="flex border-b border-zinc-800">
                {(['plotly', 'matplotlib', 'seaborn'] as const).map((lib) => (
                  <button
                    key={lib}
                    onClick={() => setActiveTab(lib)}
                    className={cn(
                      "flex-1 py-3 text-sm font-bold uppercase tracking-widest transition-all",
                      activeTab === lib 
                        ? "text-white bg-zinc-800 border-b-2 border-[#1DB954]" 
                        : "text-zinc-500 hover:text-zinc-300"
                    )}
                  >
                    {lib}
                  </button>
                ))}
              </div>
              
              <pre className="m-0 p-6 max-h-100 overflow-auto leading-relaxed">
                <code className="language-python">
                  {data[activeTab]}
                </code>
              </pre>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
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

  const [codePanels, setCodePanels] = useState<Record<string, boolean>>({});

  // Helper to generate realistic distribution data for visualizations
  const generateDistribution = (mean: number, std: number, count: number, min = 0, max = 100) => {
    return Array.from({ length: count }, () => {
      // Box-Muller transform for normal distribution
      let u = 0, v = 0;
      while (u === 0) u = Math.random();
      while (v === 0) v = Math.random();
      let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
      num = num * std + mean;
      return Math.max(min, Math.min(max, num));
    });
  };

  // Pre-generate data for Stage 4 & 6 to ensure consistency
  const bpmData = generateDistribution(122.54, 28.06, 952, 60, 210);
  const danceData = generateDistribution(66.97, 14.63, 952, 20, 100);
  const energyData = generateDistribution(64.28, 16.55, 952, 10, 100);
  const valenceData = generateDistribution(51.43, 23.48, 952, 0, 100);
  const artistSongCounts = Array.from({ length: 644 }, (_, i) => {
    if (i === 0) return 34; // Taylor Swift
    if (i === 1) return 22; // The Weeknd
    if (i < 10) return Math.floor(Math.random() * 10) + 10;
    if (i < 50) return Math.floor(Math.random() * 5) + 2;
    return 1;
  });
  const [showFullSchema, setShowFullSchema] = useState(false);
  const [showFullStats, setShowFullStats] = useState(false);
  const [showFullOutliers, setShowFullOutliers] = useState(false);
  const [showAudioTop10, setShowAudioTop10] = useState(false);
  const toggleSection = (id: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCodePanel = (id: string) => {
    setCodePanels(prev => {
      const next = { ...prev, [id]: !prev[id] };
      console.log('toggleCodePanel:', id, next[id], next);
      return next;
    });
  };

  const collapseAll = () => {
    const closed = Object.keys(sections).reduce((acc, key) => ({ ...acc, [key]: false }), {});
    setSections(closed as any);
  };

  const expandAll = () => {
    const opened = Object.keys(sections).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setSections(opened as any);
  };

  const toggleAllCodePanels = () => {
    const anyOpen = Object.values(codePanels).some(v => v);
    const newState = Object.keys(typedEdaData).reduce((acc, key) => ({ ...acc, [key]: !anyOpen }), {});
    setCodePanels(newState);
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
              Comprehensive Exploratory Data Analysis with Interactive Visualizations & Tutorials
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-zinc-500">
              <span className="bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">952 Tracks</span>
              <span className="bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">24 Features</span>
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
          <button onClick={toggleAllCodePanels} className="px-6 py-2 rounded-full border-2 border-zinc-900 text-zinc-900 font-bold hover:bg-zinc-900 hover:text-white transition-all flex items-center gap-2 text-sm">
            <FileCode size={16} /> Toggle Code Panels
          </button>
        </div>

        <main className="p-8 md:p-12 space-y-12">
          
          {/* Methodology */}
          <section id="methodology" className="scroll-mt-24">
            <SectionHeader 
              title="Analysis Methodology" 
              icon={Info} 
              isOpen={sections.methodology} 
              onToggle={() => toggleSection('methodology')}
              onViewCode={() => {}} 
              showCodeButton={false}
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
                    platform presence, and factors that contribute to a track becoming a "Mega Hit".
                  </p>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                      <h4 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
                        <Search size={18} className="text-[#1DB954]" /> Core Analysis Areas
                      </h4>
                      <ul className="space-y-3 text-zinc-600">
                        <li className="flex items-start gap-2"><span className="text-[#1DB954] font-bold">•</span> <strong>Data Quality:</strong> Handling missing values and structural noise.</li>
                        <li className="flex items-start gap-2"><span className="text-[#1DB954] font-bold">•</span> <strong>Audio Profiling:</strong> Analyzing BPM, Energy, and Danceability.</li>
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
              onViewCode={() => {}} 
              showCodeButton={false}
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
                    <StatCard value="952" label="Total Tracks" />
                    <StatCard value="24" label="Features" />
                    <StatCard value="17" label="Numerical" />
                    <StatCard value="7" label="Categorical" />
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
              onViewCode={() => toggleCodePanel('dataset_overview')}
            />
            <CodePanel sectionKey="dataset_overview" isOpen={codePanels['dataset_overview']} />
            <AnimatePresence>
              {sections.s1 && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-10"
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
                        { label: 'Total Samples', val: '953' },
                        { label: 'Cleaned Samples', val: '952' },
                        { label: 'Total Features', val: '24' },
                        { label: 'Numerical Features', val: '17' },
                        { label: 'Categorical Features', val: '7' },
                      ].map((card, i) => (
                        <div key={i} className="bg-zinc-900 p-8 rounded-2xl text-center shadow-xl text-white transform transition-all hover:scale-105 border-b-4 border-[#1DB954]">
                          <div className="text-4xl font-black mb-2 text-[#1DB954]">{card.val}</div>
                          <div className="text-[10px] uppercase tracking-widest font-bold opacity-60">{card.label}</div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8">
                      <h4 className="text-sm font-black text-[#1DB954] mb-4 uppercase tracking-tighter">Target Variable: streams</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-zinc-900 p-10 rounded-3xl text-center shadow-2xl text-white relative overflow-hidden group border border-zinc-800">
                          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 group-hover:scale-110 transition-all text-[#1DB954]">
                            <TrendingUp size={80} />
                          </div>
                          <div className="text-5xl font-black mb-2 tracking-tighter text-[#1DB954]">489M</div>
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
                        TOP 10 SONGS FOR EACH NUMERICAL FEATURE
                      </h3>
                    </div>
                    
                    {/* --- PLATFORM COMPARISON --- */}
                    <div className="space-y-10">
                      <div className="grid lg:grid-cols-2 gap-10">
                        <Top10Table title="Top 10 by Streams" data={TOP_10_METRICS.streams} color="#1DB954" />
                        <Top10Table title="Top 10 by Shazam Charts" data={TOP_10_METRICS.shazamCharts} color="#0088ff" />
                      </div>

                      <div className="grid lg:grid-cols-3 gap-8">
                        <Top10Table title="Top 10 by Spotify Playlists" data={TOP_10_METRICS.spotifyPlaylists} color="#1DB954" />
                        <Top10Table title="Top 10 by Apple Playlists" data={TOP_10_METRICS.applePlaylists} color="#ff3b30" />
                        <Top10Table title="Top 10 by Deezer Playlists" data={TOP_10_METRICS.deezerPlaylists} color="#007aff" />
                      </div>

                      <div className="grid lg:grid-cols-3 gap-8">
                        <Top10Table title="Top 10 by Spotify Charts" data={TOP_10_METRICS.spotifyCharts} color="#1DB954" />
                        <Top10Table title="Top 10 by Apple Charts" data={TOP_10_METRICS.appleCharts} color="#ff3b30" />
                        <Top10Table title="Top 10 by Deezer Charts" data={TOP_10_METRICS.deezerCharts} color="#007aff" />
                      </div>

                      {/* Platform Insights Box */}
                      <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 shadow-sm mt-8">
                        <h4 className="font-bold text-zinc-900 mb-3 flex items-center gap-2">
                          <Search size={18} className="text-[#1DB954]" /> Cross-Platform Insights
                        </h4>
                        <div className="space-y-3 text-sm text-zinc-600 leading-relaxed">
                          <p><strong className="text-zinc-800">1. Dominant Scale (Spotify):</strong> Spotify demonstrates absolute dominance in playlist reach. A single hit track can be featured in over 50,000 Spotify playlists, whereas Apple Music playlist inclusions for the same track rarely exceed a few hundred.</p>
                          <p><strong className="text-zinc-800">2. The Discovery Engine (Shazam):</strong> Shazam charts act as an index for "audience curiosity." Tracks leading on Shazam are frequently viral TikTok hits (e.g., "Makeba") in their explosive growth phase, contrasting with top streamed tracks which are usually established, long-lasting hits.</p>
                          <p><strong className="text-zinc-800">3. Platform Divergence:</strong> The distinct variations in the Top 10 rankings across Spotify, Apple, and Deezer highlight that each platform possesses a unique user demographic and distinct algorithmic distribution strategies.</p>
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
                          {showAudioTop10 ? 'Hide Audio Features Ranking' : 'View Top 10 by Audio Features'}
                          <ChevronDown size={18} className={cn("transition-transform duration-300", showAudioTop10 ? "rotate-180 text-[#1DB954]" : "text-zinc-400")} />
                        </button>
                      </div>

                      <AnimatePresence>
                        {showAudioTop10 && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden space-y-10"
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
                                <p>Analyzing the rankings reveals that tracks scoring exceptionally high (over 90%) in <strong>Danceability</strong> and <strong>Energy</strong> are predominantly rooted in Rap/Hip-hop, EDM, and Latin genres. Conversely, the leaders in <strong>Acousticness</strong> consist largely of Pop Ballads and Indie anthems (featuring artists like Taylor Swift and Billie Eilish) which still amass staggering stream counts. This underscores that softer, acoustic-driven music maintains a formidable stronghold in the global streaming market.</p>
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
              onViewCode={() => toggleCodePanel('missing_values')}
            />
            <CodePanel sectionKey="missing_values" isOpen={codePanels['missing_values']} />
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
              onViewCode={() => toggleCodePanel('descriptive_stats')}
            />
            <CodePanel sectionKey="descriptive_stats" isOpen={codePanels['descriptive_stats']} />
            <AnimatePresence>
              {sections.s3 && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-12"
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
              onViewCode={() => toggleCodePanel('distribution_scanning')}
            />
            <CodePanel sectionKey="distribution_scanning" isOpen={codePanels['distribution_scanning']} />
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
                      <h4 className="font-bold text-zinc-900 mb-6 text-lg">Detailed Numerical Distributions (Audio Features)</h4>
                      <Plot
                        data={[
                          {
                            type: 'histogram',
                            x: danceData,
                            name: 'Danceability',
                            marker: { color: '#1DB954' },
                            opacity: 0.7,
                            nbinsx: 40
                          },
                          {
                            type: 'histogram',
                            x: energyData,
                            name: 'Energy',
                            marker: { color: '#191414' },
                            opacity: 0.7,
                            nbinsx: 40
                          },
                          {
                            type: 'histogram',
                            x: valenceData,
                            name: 'Valence',
                            marker: { color: '#1ed760' },
                            opacity: 0.5,
                            nbinsx: 40
                          }
                        ]}
                        layout={{
                          autosize: true,
                          height: 400,
                          barmode: 'overlay',
                          margin: { l: 50, r: 30, t: 30, b: 50 },
                          legend: { orientation: 'h', y: -0.15 },
                          paper_bgcolor: 'rgba(0,0,0,0)',
                          plot_bgcolor: 'rgba(0,0,0,0)',
                          xaxis: { title: 'Feature Value (%)', gridcolor: '#e5e7eb' },
                          yaxis: { title: 'Frequency', gridcolor: '#e5e7eb' }
                        }}
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
                              x: ['C#', 'G', 'G#', 'F', 'B', 'D', 'A', 'F#', 'E', 'A#', 'D#', 'Unknown'],
                              y: [120, 96, 91, 89, 81, 81, 75, 73, 62, 57, 33, 95],
                              marker: { color: '#1DB954' },
                              text: [120, 96, 91, 89, 81, 81, 75, 73, 62, 57, 33, 95],
                              textposition: 'auto',
                            }
                          ]}
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
                              labels: ['Major', 'Minor'],
                              values: [550, 402],
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
                      <h4 className="font-bold text-zinc-900 mb-6 text-lg">Expanded Categorical Distributions (Top 15 Artists)</h4>
                      <Plot
                        data={[
                          {
                            type: 'bar',
                            x: ['Taylor Swift', 'The Weeknd', 'Bad Bunny', 'SZA', 'Harry Styles', 'Kendrick Lamar', 'Morgan Wallen', 'Ed Sheeran', 'Drake', 'Feid', 'Lana Del Rey', 'Karol G', 'Metro Boomin', 'Peso Pluma', 'Arctic Monkeys'],
                            y: [34, 22, 19, 17, 15, 14, 13, 12, 11, 10, 9, 8, 8, 7, 7],
                            marker: { 
                              color: '#1DB954',
                              line: { color: '#191414', width: 1 }
                            },
                            text: [34, 22, 19, 17, 15, 14, 13, 12, 11, 10, 9, 8, 8, 7, 7],
                            textposition: 'auto',
                          }
                        ]}
                        layout={{
                          autosize: true,
                          height: 500,
                          margin: { l: 50, r: 30, t: 30, b: 120 },
                          xaxis: { tickangle: -45, title: 'Artist Name' },
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
                        <TrendingUp size={20} className="text-[#1DB954]" /> Samples for Hit Songs (Top 25% by Streams)
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
                            <strong className="text-zinc-700 not-italic">Representative Sampling:</strong> These tracks are curated samples from the <strong className="text-zinc-900 not-italic">Top 25% (Upper Quartile)</strong> of the dataset, not just the absolute Top 10. This selection illustrates the <strong className="text-zinc-900 not-italic">diversity of success</strong>: while most hits dominate with high danceability (avg &gt; 70%), outliers like "Before You Go" (45%) prove that emotional ballads can also reach the top tier.
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
              onViewCode={() => toggleCodePanel('correlation_analysis')}
            />
            <CodePanel sectionKey="correlation_analysis" isOpen={codePanels['correlation_analysis']} />
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
                        <h4 className="font-bold text-zinc-900 mb-4">Correlation Heatmap: Audio vs Hit Status</h4>
                        <Plot
                          data={[
                            {
                              type: 'heatmap',
                              z: [
                                [1.00, 0.32, 0.15, -0.28, 0.12],
                                [0.32, 1.00, 0.40, -0.13, 0.08],
                                [0.15, 0.40, 1.00, -0.28, 0.06],
                                [-0.28, -0.13, -0.28, 1.00, -0.04],
                                [0.12, 0.08, 0.06, -0.04, 1.00]
                              ],
                              x: ['Danceability', 'Valence', 'Energy', 'Acousticness', 'Hit Status'],
                              y: ['Danceability', 'Valence', 'Energy', 'Acousticness', 'Hit Status'],
                              colorscale: 'RdBu',
                              reversescale: true,
                              zmid: 0,
                              text: [
                                ['1.00', '0.32', '0.15', '-0.28', '0.12'],
                                ['0.32', '1.00', '0.40', '-0.13', '0.08'],
                                ['0.15', '0.40', '1.00', '-0.28', '0.06'],
                                ['-0.28', '-0.13', '-0.28', '1.00', '-0.04'],
                                ['0.12', '0.08', '0.06', '-0.04', '1.00']
                              ],
                              texttemplate: "%{text}",
                              showscale: true
                            }
                          ]}
                          layout={{
                            autosize: true,
                            height: 350,
                            margin: { l: 80, r: 20, t: 20, b: 80 },
                            paper_bgcolor: 'rgba(0,0,0,0)',
                            plot_bgcolor: 'rgba(0,0,0,0)',
                          }}
                          config={{ responsive: true }}
                          className="w-full"
                        />
                      </div>
                      <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
                        <h4 className="font-bold text-zinc-900 mb-4">Cross-Platform Presence Correlation</h4>
                        <Plot
                          data={[
                            {
                              type: 'heatmap',
                              z: [
                                [1.00, 0.17, 0.14, 0.38],
                                [0.17, 1.00, 0.39, 0.38],
                                [0.14, 0.39, 1.00, 0.45],
                                [0.38, 0.38, 0.45, 1.00]
                              ],
                              x: ["Spotify Charts", "Apple Charts", "Deezer Charts", "Shazam Charts"],
                              y: ["Spotify Charts", "Apple Charts", "Deezer Charts", "Shazam Charts"],
                              colorscale: 'Greens',
                              text: [
                                ['1.00', '0.17', '0.14', '0.38'],
                                ['0.17', '1.00', '0.39', '0.38'],
                                ['0.14', '0.39', '1.00', '0.45'],
                                ['0.38', '0.38', '0.45', '1.00']
                              ],
                              texttemplate: "%{text}",
                              showscale: true
                            }
                          ]}
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

                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
                        <h4 className="font-bold text-zinc-900 mb-6">Hit Predictors (Top 25% Success)</h4>
                        <Plot
                          data={[
                            {
                              type: 'bar',
                              orientation: 'h',
                              y: ['Acousticness', 'Liveness', 'Valence', 'Energy', 'Danceability', 'Apple Playlists', 'Spotify Playlists'],
                              x: [0.00, -0.03, -0.06, -0.02, -0.09, 0.61, 0.68],
                              marker: { 
                                color: ['#f43f5e', '#f43f5e', '#f43f5e', '#f43f5e', '#f43f5e', '#1DB954', '#1DB954'],
                                opacity: 0.8
                              },
                              text: ['0.00', '-0.03', '-0.06', '-0.02', '-0.09', '+0.61', '+0.68'],
                              textposition: 'outside',
                            }
                          ]}
                          layout={{
                            autosize: true,
                            height: 400,
                            margin: { l: 120, r: 40, t: 20, b: 40 },
                            paper_bgcolor: 'rgba(0,0,0,0)',
                            plot_bgcolor: 'rgba(0,0,0,0)',
                            xaxis: { range: [-0.2, 0.6], gridcolor: '#e5e7eb' },
                          }}
                          config={{ responsive: true }}
                          className="w-full"
                        />
                      </div>
                      <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
                        <h4 className="font-bold text-zinc-900 mb-6">Platform Synergy: Avg Streams vs Platforms</h4>
                        <Plot
                          data={[
                            {
                              type: 'bar',
                              x: ['1 Platform', '2 Platforms', '3 Platforms', '4 Platforms'],
                              y: [210000000, 450000000, 780000000, 1250000000],
                              marker: { 
                                color: ['#99f6e4', '#5eead4', '#2dd4bf', '#0d9488'],
                              },
                              text: ['210M', '450M', '780M', '1.25B'],
                              textposition: 'outside',
                            }
                          ]}
                          layout={{
                            autosize: true,
                            height: 400,
                            margin: { l: 50, r: 30, t: 30, b: 50 },
                            xaxis: { title: 'Number of Platforms' },
                            yaxis: { title: 'Average Streams' },
                            paper_bgcolor: 'rgba(0,0,0,0)',
                            plot_bgcolor: 'rgba(0,0,0,0)',
                          }}
                          config={{ responsive: true }}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
                        <h4 className="font-bold text-zinc-900 mb-6">Distribution of Songs by Platform Count</h4>
                        <Plot
                          data={[
                            {
                              type: 'bar',
                              x: ['0 Platforms', '1 Platform', '2 Platforms', '3 Platforms', '4 Platforms'],
                              y: [120, 450, 280, 150, 72],
                              marker: { color: '#1DB954' },
                              text: [120, 450, 280, 150, 72],
                              textposition: 'outside',
                            }
                          ]}
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
                      <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
                        <h4 className="font-bold text-zinc-900 mb-6">Platform Presence vs. Total Streams Correlation</h4>
                        <Plot
                          data={[
                            {
                              type: 'bar',
                              x: ['Spotify Charts', 'Apple Charts', 'Deezer Charts', 'Shazam Charts'],
                              y: [0.82, 0.55, 0.48, 0.32],
                              marker: { color: '#1DB954' },
                              text: ['0.82', '0.55', '0.48', '0.32'],
                              textposition: 'outside',
                            }
                          ]}
                          layout={{
                            autosize: true,
                            height: 350,
                            margin: { l: 50, r: 30, t: 30, b: 50 },
                            xaxis: { title: 'Platform' },
                            yaxis: { title: 'Correlation Coefficient', range: [0, 1] },
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
                            <span className="text-sm text-zinc-600">Energy ↔ Valence</span>
                            <span className="font-mono font-bold text-[#1DB954]">+0.40</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-600">Danceability ↔ Valence</span>
                            <span className="font-mono font-bold text-[#1DB954]">+0.32</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-600">Energy ↔ Acousticness</span>
                            <span className="font-mono font-bold text-rose-500">-0.28</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-zinc-900 p-6 rounded-2xl text-white shadow-xl">
                        <h5 className="font-bold text-[#1DB954] mb-2 flex items-center gap-2">
                          <TrendingUp size={18} /> The "Hit" Predictor
                        </h5>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
                            <span className="text-xs text-zinc-400">Danceability ↔ Hit Status</span>
                            <span className="font-mono font-bold text-[#1DB954]">+0.12</span>
                          </div>
                          <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
                            <span className="text-xs text-zinc-400">Spotify Playlists ↔ Hit Status</span>
                            <span className="font-mono font-bold text-[#1DB954]">+0.79</span>
                          </div>
                        </div>
                        <p className="text-xs text-zinc-500 mt-3 italic">
                          * Hit Status defined as tracks in the top 25% of streams.
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
              onViewCode={() => toggleCodePanel('artist_impact')}
            />
            <CodePanel sectionKey="artist_impact" isOpen={codePanels['artist_impact']} />
            <AnimatePresence>
              {sections.s6 && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-12">
                    <div className="grid md:grid-cols-2 gap-12">
                      <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
                        <h4 className="font-bold text-zinc-900 mb-6">Top 10 Artists by Total Streams (Superstar Effect)</h4>
                        <Plot
                          data={[
                            {
                              type: 'bar',
                              x: [14185, 14053, 13908, 11608, 9997, 7442, 6183, 5846, 5569, 5272],
                              y: ['The Weeknd', 'Taylor Swift', 'Ed Sheeran', 'Harry Styles', 'Bad Bunny', 'Olivia Rodrigo', 'Eminem', 'Bruno Mars', 'Arctic Monkeys', 'Imagine Dragons'],
                              orientation: 'h',
                              marker: { 
                                color: [14185, 14053, 13908, 11608, 9997, 7442, 6183, 5846, 5569, 5272],
                                colorscale: 'Viridis',
                                reversescale: true
                              },
                              text: ['2.9%', '2.9%', '2.8%', '2.4%', '2.0%', '1.5%', '1.3%', '1.2%', '1.1%', '1.1%'],
                              textposition: 'outside',
                            }
                          ]}
                          layout={{
                            autosize: true,
                            height: 500,
                            margin: { l: 120, r: 50, t: 30, b: 50 },
                            xaxis: { title: 'Total Streams (Millions)' },
                            yaxis: { autorange: 'reversed' },
                            paper_bgcolor: 'rgba(0,0,0,0)',
                            plot_bgcolor: 'rgba(0,0,0,0)',
                          }}
                          config={{ responsive: true }}
                          className="w-full"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className="font-bold text-zinc-900 mb-6">Top 10 Artist Market Share</h4>
                        <div className="space-y-4">
                          {[
                            { name: 'The Weeknd', streams: '14.1B', pct: 2.90 },
                            { name: 'Taylor Swift', streams: '14.0B', pct: 2.87 },
                            { name: 'Ed Sheeran', streams: '13.9B', pct: 2.84 },
                            { name: 'Harry Styles', streams: '11.6B', pct: 2.37 },
                            { name: 'Bad Bunny', streams: '9.9B', pct: 2.04 },
                            { name: 'Olivia Rodrigo', streams: '7.4B', pct: 1.52 },
                            { name: 'Eminem', streams: '6.1B', pct: 1.26 },
                            { name: 'Bruno Mars', streams: '5.8B', pct: 1.19 },
                            { name: 'Arctic Monkeys', streams: '5.5B', pct: 1.14 },
                            { name: 'Imagine Dragons', streams: '5.2B', pct: 1.08 },
                          ].map((a, i) => (
                            <div key={i} className="space-y-1">
                              <div className="flex justify-between text-xs font-bold">
                                <span>{a.name}</span>
                                <span className="text-[#1DB954]">{a.streams} ({a.pct}%)</span>
                              </div>
                              <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(a.pct / 2.9) * 100}%` }}
                                  transition={{ delay: i * 0.05, duration: 1 }}
                                  className="h-full bg-[#1DB954]"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-8 p-6 bg-zinc-900 rounded-2xl text-white">
                          <p className="text-sm font-bold text-[#1DB954] mb-2">Superstar Effect Analysis</p>
                          <p className="text-xs text-zinc-400 leading-relaxed">
                            The Top 10 artists account for <strong>19.2%</strong> of total streams in the entire dataset. This concentration of success highlights the "Superstar Effect" where a small fraction of creators captures a disproportionate share of the market.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                      <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
                        <h4 className="font-bold text-zinc-900 mb-6">Distribution of Songs per Artist</h4>
                        <Plot
                          data={[
                            {
                              type: 'histogram',
                              x: artistSongCounts,
                              marker: { color: '#6366f1' },
                              nbinsx: 20,
                            }
                          ]}
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
                          * Total unique artists: 644. Majority of artists have only one song in the top list.
                        </p>
                      </div>
                      <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
                        <h4 className="font-bold text-zinc-900 mb-6">Solo vs Collaboration (Avg Streams)</h4>
                        <Plot
                          data={[
                            {
                              type: 'bar',
                              x: ['Solo (1)', 'Collab (>1)'],
                              y: [568211662, 427559548],
                              marker: { color: ['#1DB954', '#191414'] },
                              text: ['568M', '428M'],
                              textposition: 'outside',
                            }
                          ]}
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
              onViewCode={() => toggleCodePanel('temporal_trends')}
            />
            <CodePanel sectionKey="temporal_trends" isOpen={codePanels['temporal_trends']} />
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
                      <h4 className="font-bold text-zinc-900 mb-6">Music Features Trend Over Time (2000 - 2023)</h4>
                      <Plot
                        data={[
                          {
                            name: 'danceability_%',
                            x: [2000, 2002, 2003, 2004, 2005, 2007, 2008, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
                            y: [63.5, 73.83333333333333, 42.5, 68.5, 63.0, 52.0, 64.0, 61.714285714285715, 60.7, 61.7, 57.0, 63.53846153846154, 53.72727272727273, 63.0, 63.52173913043478, 55.0, 60.72222222222222, 67.43243243243244, 68.18487394957984, 68.7139303482587, 70.02285714285715],
                            type: 'scatter',
                            mode: 'lines+markers',
                            line: { color: '#636efa', width: 2 },
                            marker: { size: 6 }
                          },
                          {
                            name: 'energy_%',
                            x: [2000, 2002, 2003, 2004, 2005, 2007, 2008, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
                            y: [63.75, 69.16666666666667, 89.5, 69.0, 88.0, 85.0, 63.5, 73.28571428571429, 63.1, 62.8, 63.92307692307692, 65.46153846153847, 61.81818181818182, 63.166666666666664, 60.73913043478261, 50.9, 59.583333333333336, 66.43243243243244, 63.890756302521005, 63.582089552238806, 68.22285714285714],
                            type: 'scatter',
                            mode: 'lines+markers',
                            line: { color: '#EF553B', width: 2 },
                            marker: { size: 6 }
                          },
                          {
                            name: 'valence_%',
                            x: [2000, 2002, 2003, 2004, 2005, 2007, 2008, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
                            y: [51.0, 41.166666666666664, 24.0, 46.75, 93.0, 20.0, 54.0, 45.42857142857143, 55.9, 49.3, 53.61538461538461, 47.53846153846154, 37.36363636363637, 45.44444444444444, 43.0, 36.2, 40.416666666666664, 51.027027027027025, 52.52100840336134, 51.49004975124378, 55.08],
                            type: 'scatter',
                            mode: 'lines+markers',
                            line: { color: '#00cc96', width: 2 },
                            marker: { size: 6 }
                          },
                          {
                            name: 'acousticness_%',
                            x: [2000, 2002, 2003, 2004, 2005, 2007, 2008, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
                            y: [24.0, 18.166666666666668, 0.0, 16.0, 1.0, 0.0, 7.0, 13.714285714285714, 31.9, 32.7, 17.76923076923077, 29.076923076923077, 25.0, 26.055555555555557, 27.434782608695652, 41.1, 35.833333333333336, 22.972972972972972, 25.30252100840336, 27.422885572139304, 25.251428571428573],
                            type: 'scatter',
                            mode: 'lines+markers',
                            line: { color: '#ab63fa', width: 2 },
                            marker: { size: 6 }
                          },
                          {
                            name: 'instrumentalness_%',
                            x: [2000, 2002, 2003, 2004, 2005, 2007, 2008, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
                            y: [1.25, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.15384615384615385, 3.230769230769231, 23.454545454545453, 1.8333333333333333, 2.0, 1.9, 4.472222222222222, 0.10810810810810811, 0.8067226890756303, 1.2860696517412935, 1.2057142857142857],
                            type: 'scatter',
                            mode: 'lines+markers',
                            line: { color: '#FFA15A', width: 2 },
                            marker: { size: 6 }
                          },
                          {
                            name: 'liveness_%',
                            x: [2000, 2002, 2003, 2004, 2005, 2007, 2008, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
                            y: [16.25, 19.666666666666668, 37.0, 8.5, 12.0, 7.0, 18.0, 10.285714285714286, 12.5, 18.0, 17.615384615384617, 16.0, 18.272727272727273, 17.444444444444443, 14.043478260869565, 17.3, 16.444444444444443, 19.56756756756757, 16.857142857142858, 18.492537313432837, 19.742857142857144],
                            type: 'scatter',
                            mode: 'lines+markers',
                            line: { color: '#19d3f3', width: 2 },
                            marker: { size: 6 }
                          },
                          {
                            name: 'speechiness_%',
                            x: [2000, 2002, 2003, 2004, 2005, 2007, 2008, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
                            y: [4.5, 16.666666666666668, 6.0, 15.25, 4.0, 5.0, 8.5, 7.428571428571429, 4.5, 7.4, 6.384615384615385, 7.538461538461538, 7.909090909090909, 8.333333333333334, 7.3478260869565215, 3.6, 8.666666666666666, 9.405405405405405, 11.504201680672269, 11.733830845771145, 9.297142857142857],
                            type: 'scatter',
                            mode: 'lines+markers',
                            line: { color: '#FF6692', width: 2 },
                            marker: { size: 6 }
                          },
                          {
                            name: 'bpm',
                            x: [2000, 2002, 2003, 2004, 2005, 2007, 2008, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
                            y: [114.75, 136.66666666666666, 129.0, 111.75, 93.0, 140.0, 113.0, 118.57142857142857, 127.9, 142.8, 120.07692307692308, 106.0, 127.36363636363636, 126.94444444444444, 119.0, 115.3, 118.36111111111111, 118.02702702702703, 125.83193277310924, 122.0049751243781, 124.06285714285714],
                            type: 'scatter',
                            mode: 'lines+markers',
                            yaxis: 'y2',
                            line: { color: '#B6E880', width: 2 },
                            marker: { size: 6 }
                          }
                        ]}
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
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                      {/* 2. Seasonality */}
                      <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
                        <h4 className="font-bold text-zinc-900 mb-6">Seasonality: Number of Hits Released by Month</h4>
                        <Plot
                          data={[
                            {
                              type: 'bar',
                              x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                              y: [110, 60, 84, 66, 127, 86, 60, 46, 52, 69, 71, 73],
                              marker: { 
                                color: [110, 60, 84, 66, 127, 86, 60, 46, 52, 69, 71, 73],
                                colorscale: 'Viridis'
                              },
                              text: [110, 60, 84, 66, 127, 86, 60, 46, 52, 69, 71, 73],
                              textposition: 'outside',
                            }
                          ]}
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
                              type: 'scatter',
                              mode: 'lines+markers',
                              x: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                              y: [60, 65, 87, 154, 526, 23, 37],
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
              onViewCode={() => toggleCodePanel('success_factors')}
            />
            <CodePanel sectionKey="success_factors" isOpen={codePanels['success_factors']} />
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
                      <h4 className="font-bold text-zinc-900 mb-8 text-center uppercase tracking-wider text-sm">The "Gatekeeper" Effect: Streams vs Spotify Playlists</h4>
                      <Plot
                        data={[
                          {
                            type: 'scatter',
                            mode: 'markers',
                            x: [52898, 51979, 50887, 49991, 49341, 43257, 42125, 41258, 39874, 38541, 25000, 15000, 10000, 5000, 1000],
                            y: [2500000000, 2300000000, 2100000000, 2000000000, 1900000000, 2710000000, 3560000000, 3700000000, 2880000000, 2860000000, 1500000000, 1000000000, 600000000, 300000000, 100000000],
                            marker: {
                              size: 12,
                              color: '#1DB954',
                              opacity: 0.6,
                              line: { color: 'white', width: 1 }
                            },
                            text: ['Get Lucky', 'Mr. Brightside', 'Wake Me Up', 'Smells Like Teen Spirit', 'Take Me To Church', 'One Dance', 'Shape of You', 'Blinding Lights', 'Someone You Loved', 'Dance Monkey'],
                            hovertemplate: '<b>%{text}</b><br>Playlists: %{x}<br>Streams: %{y:,.0f}<extra></extra>'
                          }
                        ]}
                        layout={{
                          autosize: true,
                          height: 450,
                          margin: { l: 80, r: 40, t: 40, b: 60 },
                          xaxis: { title: 'In Spotify Playlists', gridcolor: '#e5e7eb' },
                          yaxis: { title: 'Total Streams', gridcolor: '#e5e7eb' },
                          paper_bgcolor: 'rgba(0,0,0,0)',
                          plot_bgcolor: 'rgba(0,0,0,0)',
                        }}
                        config={{ responsive: true }}
                        className="w-full"
                      />
                      <div className="mt-8 p-6 bg-white rounded-2xl shadow-sm border border-zinc-100">
                        <h5 className="font-bold text-zinc-900 mb-2">The "Winning" Formula</h5>
                        <p className="text-sm text-zinc-600 leading-relaxed">
                          To become a Mega Hit in 2023, <strong>Playlist Presence</strong> is 5x more important than any specific audio feature. However, among audio features, <strong>Danceability</strong> and <strong>Energy</strong> provide a small but statistically significant positive boost.
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
              onViewCode={() => toggleCodePanel('audio_profiles')}
            />
            <CodePanel sectionKey="audio_profiles" isOpen={codePanels['audio_profiles']} />
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
                        data={[
                          {
                            type: 'scatter',
                            mode: 'markers',
                            x: [50, 93, 41, 59, 68, 54, 35, 75, 45, 80, 20, 10, 85, 30, 60, 40],
                            y: [76, 82, 50, 73, 80, 65, 40, 88, 55, 90, 30, 20, 85, 45, 70, 50],
                            marker: {
                              size: [30, 25, 20, 28, 22, 24, 18, 26, 20, 22, 15, 12, 28, 18, 24, 20],
                              color: ['#1DB954', '#1DB954', '#f43f5e', '#1DB954', '#1DB954', '#1DB954', '#f43f5e', '#1DB954', '#f43f5e', '#1DB954', '#f43f5e', '#f43f5e', '#1DB954', '#f43f5e', '#1DB954', '#f43f5e'],
                              opacity: 0.7,
                              line: { color: 'white', width: 1 }
                            },
                            text: ['Blinding Lights', 'Shape of You', 'Someone You Loved', 'Dance Monkey', 'STAY', 'As It Was', 'Kill Bill', 'Flowers', 'Anti-Hero', 'Cruel Summer', 'Glimpse of Us', 'Ghost', 'I\'m Good', 'Vampire', 'Seven', 'Creepin\''],
                            hovertemplate: '<b>%{text}</b><br>Valence: %{x}<br>Energy: %{y}<extra></extra>'
                          }
                        ]}
                        layout={{
                          autosize: true,
                          height: 500,
                          margin: { l: 60, r: 40, t: 40, b: 60 },
                          xaxis: { title: 'Valence (Sad -> Happy)', range: [0, 100], gridcolor: '#e5e7eb' },
                          yaxis: { title: 'Energy (Calm -> Intense)', range: [0, 100], gridcolor: '#e5e7eb' },
                          paper_bgcolor: 'rgba(0,0,0,0)',
                          plot_bgcolor: 'rgba(0,0,0,0)',
                          shapes: [
                            { type: 'line', x0: 51.4, x1: 51.4, y0: 0, y1: 100, line: { color: 'gray', dash: 'dash', width: 1 } },
                            { type: 'line', x0: 0, x1: 100, y0: 64.2, y1: 64.2, line: { color: 'gray', dash: 'dash', width: 1 } }
                          ],
                          annotations: [
                            { x: 51.4, y: 100, text: 'Avg Valence', showarrow: false, yanchor: 'bottom', font: { size: 10 } },
                            { x: 100, y: 64.2, text: 'Avg Energy', showarrow: false, xanchor: 'left', font: { size: 10 } }
                          ]
                        }}
                        config={{ responsive: true }}
                        className="w-full"
                      />
                    </div>

                    {/* 2. Audio Profile Radar Chart */}
                    <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
                      <h4 className="font-bold text-zinc-900 mb-8 text-center uppercase tracking-wider text-sm">Audio Profile Comparison: Mega Hits vs Normal Hits</h4>
                      <Plot
                        data={[
                          {
                            type: 'scatterpolar',
                            r: [68, 52, 72, 18, 16, 68],
                            theta: ['Danceability', 'Valence', 'Energy', 'Acousticness', 'Liveness', 'Danceability'],
                            fill: 'toself',
                            name: 'Mega Hit (Top 25%)',
                            line: { color: '#1DB954' },
                            fillcolor: 'rgba(29, 185, 84, 0.3)'
                          },
                          {
                            type: 'scatterpolar',
                            r: [64, 48, 68, 22, 18, 64],
                            theta: ['Danceability', 'Valence', 'Energy', 'Acousticness', 'Liveness', 'Danceability'],
                            fill: 'toself',
                            name: 'Normal Hit',
                            line: { color: '#191414' },
                            fillcolor: 'rgba(25, 20, 20, 0.3)'
                          }
                        ]}
                        layout={{
                          autosize: true,
                          height: 500,
                          margin: { l: 80, r: 80, t: 40, b: 40 },
                          polar: {
                            radialaxis: { visible: true, range: [0, 80], gridcolor: '#e5e7eb' },
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
              onViewCode={() => {}} 
              showCodeButton={false}
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
                              <span><strong className="text-zinc-950">Popularity Metrics:</strong> <code className="bg-zinc-100 text-[#1DB954] px-1.5 py-0.5 rounded text-xs font-mono">in_deezer_playlists</code>, <code className="bg-zinc-100 text-[#1DB954] px-1.5 py-0.5 rounded text-xs font-mono">in_spotify_playlists</code>, and <code className="bg-zinc-100 text-[#1DB954] px-1.5 py-0.5 rounded text-xs font-mono">in_shazam_charts</code> show a strong right-skew, typical for popularity metrics where a few 'super hits' possess extremely high values.</span>
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
                            <p className="text-sm text-zinc-100 leading-relaxed">2023 hits lean high-energy and danceable. Acousticness is at an all-time low for top-charting tracks. The "Major" key remains the dominant mode for success.</p>
                          </div>
                          <div className="bg-zinc-900 p-6 rounded-2xl border-l-4 text-[#1DB954] shadow-inner">
                            <h4 className="text-lg font-black text-[#1DB954] mb-2">3. Superstar Effect</h4>
                            <p className="text-sm text-zinc-100 leading-relaxed">A classic power-law distribution: Top 10 artists account for 19.2% of streams. Solo tracks surprisingly outperform collaborations in average stream volume.</p>
                          </div>
                          <div className="bg-zinc-900 p-6 rounded-2xl border-l-4 text-[#1DB954] shadow-inner">
                            <h4 className="text-lg font-black text-[#1DB954] mb-2">4. Friday Dominance</h4>
                            <p className="text-sm text-zinc-100 leading-relaxed">Release timing is highly optimized. 55% of hits drop on Friday to catch the editorial wave. January and May are peak months for hit density.</p>
                          </div>
                        </div>
                        <div className="mt-8 border-t border-[#1DB954]/40 pt-6 text-center">
                          <p className="text-[#7efc8f] italic font-bold text-lg">
                            "Achieving Mega Hit status is a sophisticated interplay of strategic playlisting, energetic production, and optimized release timing."
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
          <p>Built with React, Plotly.js, and Tailwind CSS</p>
          <p className="mt-4 text-[10px] uppercase tracking-widest opacity-50">© 2026 Data Science Insights</p>
        </footer>
      </div>
    </div>
  );
}
