export interface ServiceEntry {
  name: string;
  category: string;
  emoji: string;
  color: string;
  domain?: string;
}

export const SERVICES: ServiceEntry[] = [
  // 🎬 Streaming
  { name: 'Netflix', category: 'Streaming', emoji: '🎬', color: '#e50914', domain: 'netflix.com' },
  { name: 'HBO Max', category: 'Streaming', emoji: '🎬', color: '#7033ff', domain: 'hbomax.com' },
  { name: 'Disney+', category: 'Streaming', emoji: '🎬', color: '#0f3fa8', domain: 'disneyplus.com' },
  { name: 'Amazon Prime Video', category: 'Streaming', emoji: '🎬', color: '#00a8e1', domain: 'primevideo.com' },
  { name: 'Apple TV+', category: 'Streaming', emoji: '🎬', color: '#888888', domain: 'apple.com' },
  { name: 'Paramount+', category: 'Streaming', emoji: '🎬', color: '#0064ff', domain: 'paramountplus.com' },
  { name: 'SkyShowtime', category: 'Streaming', emoji: '🎬', color: '#ff5500', domain: 'skyshowtime.com' },
  { name: 'Filmin', category: 'Streaming', emoji: '🎬', color: '#e8324a', domain: 'filmin.es' },
  { name: 'Mubi', category: 'Streaming', emoji: '🎬', color: '#02b0e1', domain: 'mubi.com' },
  { name: 'Movistar+', category: 'Streaming', emoji: '🎬', color: '#019df4', domain: 'movistarplus.es' },
  { name: 'Rakuten TV', category: 'Streaming', emoji: '🎬', color: '#bf0000', domain: 'rakuten.tv' },
  { name: 'Crunchyroll', category: 'Streaming', emoji: '🎬', color: '#f47521', domain: 'crunchyroll.com' },
  { name: 'YouTube Premium', category: 'Streaming', emoji: '▶️', color: '#ff0000', domain: 'youtube.com' },
  { name: 'Twitch Turbo', category: 'Streaming', emoji: '🎮', color: '#9146ff', domain: 'twitch.tv' },

  // 🎵 Música
  { name: 'Spotify Premium', category: 'Música', emoji: '🎵', color: '#1db954', domain: 'spotify.com' },
  { name: 'Spotify Familia', category: 'Música', emoji: '🎵', color: '#1db954', domain: 'spotify.com' },
  { name: 'Apple Music', category: 'Música', emoji: '🎵', color: '#fc3c44', domain: 'music.apple.com' },
  { name: 'Amazon Music', category: 'Música', emoji: '🎵', color: '#00a8e1', domain: 'amazon.com' },
  { name: 'Tidal', category: 'Música', emoji: '🎵', color: '#00ffff', domain: 'tidal.com' },
  { name: 'Deezer', category: 'Música', emoji: '🎵', color: '#a238ff', domain: 'deezer.com' },
  { name: 'YouTube Music', category: 'Música', emoji: '🎵', color: '#ff0000', domain: 'youtube.com' },
  { name: 'SoundCloud Go+', category: 'Música', emoji: '🎵', color: '#ff5500', domain: 'soundcloud.com' },

  // 🤖 IA
  { name: 'ChatGPT Plus', category: 'IA', emoji: '🤖', color: '#74aa9c', domain: 'openai.com' },
  { name: 'Claude Pro', category: 'IA', emoji: '🤖', color: '#d97706', domain: 'anthropic.com' },
  { name: 'Gemini Advanced', category: 'IA', emoji: '🤖', color: '#4285f4', domain: 'google.com' },
  { name: 'Copilot Pro', category: 'IA', emoji: '🤖', color: '#0078d4', domain: 'microsoft.com' },
  { name: 'Notion AI', category: 'IA', emoji: '📝', color: '#ffffff', domain: 'notion.so' },
  { name: 'Midjourney', category: 'IA', emoji: '🎨', color: '#000000', domain: 'midjourney.com' },

  // 💼 Trabajo
  { name: 'Microsoft 365', category: 'Trabajo', emoji: '💼', color: '#0078d4', domain: 'microsoft.com' },
  { name: 'Google Workspace', category: 'Trabajo', emoji: '💼', color: '#4285f4', domain: 'google.com' },
  { name: 'Notion', category: 'Trabajo', emoji: '📝', color: '#ffffff', domain: 'notion.so' },
  { name: 'Slack', category: 'Trabajo', emoji: '💼', color: '#4a154b', domain: 'slack.com' },
  { name: 'Zoom', category: 'Trabajo', emoji: '📹', color: '#2d8cff', domain: 'zoom.us' },
  { name: 'Adobe Creative Cloud', category: 'Trabajo', emoji: '🎨', color: '#ff0000', domain: 'adobe.com' },
  { name: 'Figma', category: 'Trabajo', emoji: '🎨', color: '#f24e1e', domain: 'figma.com' },
  { name: 'Canva Pro', category: 'Trabajo', emoji: '🎨', color: '#7d2ae8', domain: 'canva.com' },
  { name: 'Dropbox', category: 'Trabajo', emoji: '☁️', color: '#0061ff', domain: 'dropbox.com' },
  { name: '1Password', category: 'Trabajo', emoji: '🔑', color: '#1a8cff', domain: '1password.com' },
  { name: 'LastPass', category: 'Trabajo', emoji: '🔑', color: '#d72b2b', domain: 'lastpass.com' },
  { name: 'Dashlane', category: 'Trabajo', emoji: '🔑', color: '#0e1e4a', domain: 'dashlane.com' },

  // 🔒 Seguridad
  { name: 'NordVPN', category: 'Seguridad', emoji: '🔒', color: '#4687ff', domain: 'nordvpn.com' },
  { name: 'ExpressVPN', category: 'Seguridad', emoji: '🔒', color: '#da3940', domain: 'expressvpn.com' },
  { name: 'Surfshark', category: 'Seguridad', emoji: '🔒', color: '#1bc5c5', domain: 'surfshark.com' },
  { name: 'Malwarebytes', category: 'Seguridad', emoji: '🛡️', color: '#00adef', domain: 'malwarebytes.com' },
  { name: 'Norton', category: 'Seguridad', emoji: '🛡️', color: '#ffd800', domain: 'norton.com' },
  { name: 'Avast', category: 'Seguridad', emoji: '🛡️', color: '#e0510f', domain: 'avast.com' },
  { name: 'Kaspersky', category: 'Seguridad', emoji: '🛡️', color: '#05ab6b', domain: 'kaspersky.com' },

  // ☁️ Almacenamiento
  { name: 'iCloud+', category: 'Almacenamiento', emoji: '☁️', color: '#3693f2', domain: 'apple.com' },
  { name: 'Google One', category: 'Almacenamiento', emoji: '☁️', color: '#4285f4', domain: 'google.com' },
  { name: 'OneDrive', category: 'Almacenamiento', emoji: '☁️', color: '#0078d4', domain: 'microsoft.com' },
  { name: 'Mega', category: 'Almacenamiento', emoji: '☁️', color: '#d9272e', domain: 'mega.nz' },

  // 🎮 Gaming
  { name: 'PlayStation Plus', category: 'Gaming', emoji: '🎮', color: '#003087', domain: 'playstation.com' },
  { name: 'Xbox Game Pass', category: 'Gaming', emoji: '🎮', color: '#107c10', domain: 'xbox.com' },
  { name: 'Nintendo Switch Online', category: 'Gaming', emoji: '🎮', color: '#e60012', domain: 'nintendo.com' },
  { name: 'EA Play', category: 'Gaming', emoji: '🎮', color: '#ff4747', domain: 'ea.com' },
  { name: 'Ubisoft+', category: 'Gaming', emoji: '🎮', color: '#0070d1', domain: 'ubisoft.com' },
  { name: 'GeForce Now', category: 'Gaming', emoji: '🎮', color: '#76b900', domain: 'nvidia.com' },
  { name: 'Steam', category: 'Gaming', emoji: '🎮', color: '#1b2838', domain: 'steampowered.com' },

  // 📚 Educación
  { name: 'Kindle Unlimited', category: 'Educación', emoji: '📚', color: '#ff9900', domain: 'amazon.com' },
  { name: 'Audible', category: 'Educación', emoji: '🎧', color: '#f8991c', domain: 'audible.com' },
  { name: 'Duolingo Plus', category: 'Educación', emoji: '📚', color: '#58cc02', domain: 'duolingo.com' },
  { name: 'Babbel', category: 'Educación', emoji: '📚', color: '#ef4923', domain: 'babbel.com' },
  { name: 'Coursera', category: 'Educación', emoji: '📚', color: '#0056d2', domain: 'coursera.org' },
  { name: 'LinkedIn Learning', category: 'Educación', emoji: '📚', color: '#0a66c2', domain: 'linkedin.com' },
  { name: 'Skillshare', category: 'Educación', emoji: '📚', color: '#00e07f', domain: 'skillshare.com' },
  { name: 'MasterClass', category: 'Educación', emoji: '📚', color: '#1a1a1a', domain: 'masterclass.com' },
  { name: 'Scribd', category: 'Educación', emoji: '📚', color: '#1e7fc7', domain: 'scribd.com' },
  { name: 'Blinkist', category: 'Educación', emoji: '📚', color: '#00c1c8', domain: 'blinkist.com' },

  // 🏋️ Salud
  { name: 'Gimnasio', category: 'Salud', emoji: '🏋️', color: '#ff6b00' },
  { name: 'Peloton', category: 'Salud', emoji: '🚴', color: '#cc1f3e', domain: 'onepeloton.com' },
  { name: 'Strava', category: 'Salud', emoji: '🏃', color: '#fc4c02', domain: 'strava.com' },
  { name: 'Apple Fitness+', category: 'Salud', emoji: '🏋️', color: '#fc3c44', domain: 'apple.com' },
  { name: 'Calm', category: 'Salud', emoji: '🧘', color: '#4a86e8', domain: 'calm.com' },
  { name: 'Headspace', category: 'Salud', emoji: '🧘', color: '#ff712b', domain: 'headspace.com' },

  // 🛒 Compras
  { name: 'Amazon Prime', category: 'Compras', emoji: '📦', color: '#ff9900', domain: 'amazon.com' },

  // 📱 Apps
  { name: 'Tinder Gold', category: 'Apps', emoji: '💛', color: '#fd267a', domain: 'tinder.com' },
  { name: 'Bumble Premium', category: 'Apps', emoji: '🐝', color: '#fdcf4f', domain: 'bumble.com' },
  { name: 'Twitter/X Premium', category: 'Apps', emoji: '🐦', color: '#000000', domain: 'x.com' },
  { name: 'Reddit Premium', category: 'Apps', emoji: '🤖', color: '#ff4500', domain: 'reddit.com' },
];

/** Returns the Google favicon URL for a domain (very reliable, no API key needed) */
export function getLogoUrl(domain?: string): string | null {
  if (!domain) return null;
  // Use Google's S2 favicon service - cached worldwide, always works
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

/** Find a service by name */
export function findService(name: string): ServiceEntry | undefined {
  return SERVICES.find(s => s.name === name);
}
