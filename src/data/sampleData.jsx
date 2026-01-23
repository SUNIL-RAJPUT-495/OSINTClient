
export const sampleChallenges = [
  {
    id: 'ch1',
    roomId: 'room1',
    level: 1,
    title: 'The Digital Footprint',
    description: 'Every online presence leaves traces. Your first task is to find the username of our target.',
    story: `Welcome, Agent. Your first assignment begins now.

We've intercepted communications mentioning a hacker known only by their alias. Intelligence suggests they frequent social media under a specific username.

The only lead we have is this image they posted. Analyze it carefully - the answer lies within.`,
    flag: 'sh4d0whunt3r',
    flagFormat: 'FLAG{username}',
    points: 100,
    hints: [
      'Look at the metadata of images carefully',
      'EXIF data often contains hidden information',
      'The username format follows l33t speak conventions'
    ],
    isActive: true,
  },
  {
    id: 'ch2',
    roomId: 'room1',
    level: 2,
    title: 'Reverse Image Hunt',
    description: 'This image was posted by our target. Find the location where it was taken.',
    story: `Excellent work on finding the username.

Our target posted this landscape photo with the caption "My favorite spot". We need to identify this location to track their movements.

Use reverse image search techniques to find where this photo was taken.`,
    flag: 'copenhagen_denmark',
    flagFormat: 'FLAG{city_country}',
    points: 150,
    hints: [
      'Try Google Images reverse search',
      'TinEye might reveal where this image appears',
      'Look for distinctive landmarks in the background'
    ],
    isActive: true,
  },
  {
    id: 'ch3',
    roomId: 'room1',
    level: 3,
    title: 'The Hidden Profile',
    description: 'Find the email address associated with our target\'s secondary account.',
    story: `We discovered the target maintains multiple online identities.

Cross-reference the username "sh4d0whunt3r" across different platforms. One of their profiles exposes contact information.

Remember: People often reuse usernames across platforms.`,
    flag: 'shadow.hunter@proton.me',
    flagFormat: 'FLAG{email@domain}',
    points: 200,
    hints: [
      'Use tools like namechk.com or knowem.com',
      'Check platforms like GitHub, LinkedIn, Twitter',
      'Some profiles show email in the bio or about section'
    ],
    isActive: true,
  },
  {
    id: 'ch4',
    roomId: 'room1',
    level: 4,
    title: 'Google Dork Master',
    description: 'Use advanced Google search operators to find a specific document.',
    story: `Intelligence reports suggest our target uploaded a sensitive document to a public server.

The document is a PDF file containing the word "classified" and was uploaded to a site ending in .edu

Use Google dork techniques to locate this file.`,
    flag: 'operation_nightfall',
    flagFormat: 'FLAG{document_codename}',
    points: 250,
    hints: [
      'Use site: operator to limit search to .edu domains',
      'filetype:pdf will filter for PDF documents',
      'Combine multiple operators for precision'
    ],
    isActive: true,
  },
  {
    id: 'ch5',
    roomId: 'room1',
    level: 5,
    title: 'Metadata Extraction',
    description: 'Extract hidden metadata from the provided image to find GPS coordinates.',
    story: `Our target made a critical mistake - they uploaded an image without stripping its metadata.

Download the attached image and extract its EXIF data. The GPS coordinates will reveal a meeting location.

Format your answer as: latitude,longitude (rounded to 2 decimal places)`,
    flag: '40.71,-74.01',
    flagFormat: 'FLAG{lat,long}',
    points: 300,
    hints: [
      'Use tools like exiftool or online EXIF viewers',
      'Look for GPSLatitude and GPSLongitude fields',
      'Convert DMS (degrees, minutes, seconds) to decimal if needed'
    ],
    isActive: true,
  },
  {
    id: 'ch6',
    roomId: 'room1',
    level: 6,
    title: 'The Wayback Machine',
    description: 'Find deleted content from our target\'s old website.',
    story: `The target once ran a personal blog that has since been taken down.

Using web archive services, find the title of their first blog post from 2019.

The original domain was: shadowy-thoughts.com`,
    flag: 'first_steps_into_darkness',
    flagFormat: 'FLAG{post_title_with_underscores}',
    points: 350,
    hints: [
      'web.archive.org stores historical snapshots',
      'Try searching for the exact domain',
      'Look at the earliest available snapshot'
    ],
    isActive: true,
  },
  {
    id: 'ch7',
    roomId: 'room1',
    level: 7,
    title: 'Social Engineering Clues',
    description: 'Analyze the target\'s social media to find their pet\'s name.',
    story: `People often use personal information in their passwords and security questions.

Our target frequently posts about their pet on social media. This information could be crucial for further investigation.

Find the name of their pet cat.`,
    flag: 'mr_whiskers',
    flagFormat: 'FLAG{pet_name}',
    points: 400,
    hints: [
      'Check Instagram posts and stories',
      'Look at photo captions and hashtags',
      'Pet names are often in lowercase with underscores'
    ],
    isActive: true,
  },
  {
    id: 'ch8',
    roomId: 'room1',
    level: 8,
    title: 'Domain Investigation',
    description: 'Perform WHOIS lookup to find the registrant organization.',
    story: `Our investigation has uncovered a domain: cyberops-hub.net

This domain appears to be connected to our target's operations. Find the organization name listed in the WHOIS records.`,
    flag: 'shadow_digital_services',
    flagFormat: 'FLAG{organization_name}',
    points: 450,
    hints: [
      'Use whois command or online WHOIS lookup tools',
      'Look for "Registrant Organization" field',
      'Some registrations use privacy protection - look for actual org name'
    ],
    isActive: true,
  },
  {
    id: 'ch9',
    roomId: 'room1',
    level: 9,
    title: 'The Final Connection',
    description: 'Connect all the dots to find the target\'s real identity.',
    story: `You've gathered extensive intelligence throughout this investigation:
- Username: sh4d0whunt3r
- Location: Copenhagen
- Email: shadow.hunter@proton.me
- Pet: Mr. Whiskers
- Organization: Shadow Digital Services

Cross-reference this information to find the target's real first and last name.`,
    flag: 'erik_andersen',
    flagFormat: 'FLAG{firstname_lastname}',
    points: 500,
    hints: [
      'LinkedIn often reveals real names',
      'Company registrations are public records in many countries',
      'Combine multiple data points for verification'
    ],
    isActive: true,
  },
  {
    id: 'ch10',
    roomId: 'room1',
    level: 10,
    title: 'Mission Complete',
    description: 'Compile your final report with the codename of the operation.',
    story: `Outstanding work, Agent.

Your investigation has been thorough and professional. All gathered intelligence has been verified and the target has been identified.

To complete this mission, enter the operation codename that was established at the beginning of this case file. Look back at your notes from Challenge 4.`,
    flag: 'operation_nightfall',
    flagFormat: 'FLAG{codename}',
    points: 250,
    hints: [
      'Review your previous challenges',
      'The answer appeared in Challenge 4',
      'This is a callback to test your documentation'
    ],
    isActive: true,
  },
];

export const sampleRooms = [
  {
    id: 'room1',
    name: 'Shadow Hunter',
    description: 'Track down a mysterious hacker through their digital footprint. 10 progressive OSINT challenges.',
    difficulty: 'Medium',
    category: 'OSINT Investigation',
    challenges: sampleChallenges,
    isActive: true,
    totalPoints: sampleChallenges.reduce((sum, ch) => sum + ch.points, 0),
  },
];

export const defaultSettings = {
  siteName: 'OSINT CTF',
  welcomeMessage: 'Welcome to the OSINT Challenge Platform. Test your open-source intelligence skills.',
  completionMessage: 'Congratulations! You have completed all challenges. Your skills are impressive.',
  maintenanceMode: false,
};