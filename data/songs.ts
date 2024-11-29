export interface Song {
    id: string;
    title: string;
    artist: string;
    audioSrc: string;
    imageSrc: string;
  }
  
  export const songs: Song[] = [
    {
      id: '1',
      title: 'Sunny Day',
      artist: 'Happy Band',
      audioSrc: '/audio/sunny-day.mp3',
      imageSrc: '/images/sunny-day.jpg',
    },
    {
      id: '2',
      title: 'Rainy Night',
      artist: 'Melancholy Group',
      audioSrc: '/audio/rainy-night.mp3',
      imageSrc: '/images/rainy-night.jpg',
    },
    {
      id: '3',
      title: 'Starry Sky',
      artist: 'Dreamy Duo',
      audioSrc: '/audio/starry-sky.mp3',
      imageSrc: '/images/starry-sky.jpg',
    },
  ];
  
  