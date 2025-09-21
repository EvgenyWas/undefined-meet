export const asciiLogo = `
88        88                      88               ad88 88                                 88    88b           d88                                
88        88                      88              d8"   ""                                 88    888b         d888                         ,d     
88        88                      88              88                                       88    88\`8b       d8'88                         88     
88        88 8b,dPPYba,   ,adPPYb,88  ,adPPYba, MM88MMM 88 8b,dPPYba,   ,adPPYba,  ,adPPYb,88    88 \`8b     d8' 88  ,adPPYba,  ,adPPYba, MM88MMM  
88        88 88P'   \`"8a a8"    \`Y88 a8P_____88   88    88 88P'   \`"8a a8P_____88 a8"    \`Y88    88  \`8b   d8'  88 a8P_____88 a8P_____88   88     
88        88 88       88 8b       88 8PP"""""""   88    88 88       88 8PP""""""" 8b       88    88   \`8b d8'   88 8PP""""""" 8PP"""""""   88     
Y8a.    .a8P 88       88 "8a,   ,d88 "8b,   ,aa   88    88 88       88 "8b,   ,aa "8a,   ,d88    88    \`888'    88 "8b,   ,aa "8b,   ,aa   88,    
 \`"Y8888Y"'  88       88  \`"8bbdP"Y8  \`"Ybbd8"'   88    88 88       88  \`"Ybbd8"'  \`"8bbdP"Y8    88     \`8'     88  \`"Ybbd8"'  \`"Ybbd8"'   "Y888  
`;

export const manifestItems = [
  'We gather to tame wild algorithms, conquer LeetCode and CSES, and laugh in the face of time limits.',
  'Coffee in one hand, keyboard in the other — we debug, optimize, and celebrate every AC like a victory dance.',
  'Think in 0s and 1s? Love a good DP problem? Welcome home.',
];

export const apiEndpoints = {
  whoAmI: '/api/users/whoami',
};

// https://github.com/jitsi/jitsi-meet/blob/master/config.js
export const jitsiConfig = {
  logoClickUrl: '/',
  defaultLogoUrl: '',
  toolbarButtons: [
    'camera',
    'chat',
    'closedcaptions',
    'desktop',
    'etherpad',
    'feedback',
    'filmstrip',
    'fullscreen',
    'hangup',
    'help',
    'highlight',
    'microphone',
    'noisesuppression',
    'participants-pane',
    'profile',
    'raisehand',
    'select-background',
    'settings',
    'shareaudio',
    'sharedvideo',
    'shortcuts',
    'stats',
    'tileview',
    'toggle-camera',
    'videoquality',
    // 'whiteboard',
  ],
  breakoutRooms: {
    hideAddRoomButton: true,
    hideAutoAssignButton: true,
    hideJoinRoomButton: true,
  },
  disableModeratorIndicator: true,
  startWithAudioMuted: true,
  participantsPane: {
    hideModeratorSettingsTab: true,
  },

  // Settings for the Excalidraw whiteboard integration.
  // whiteboard: {
  //     // Whether the feature is enabled or not.
  //     enabled: true,
  //     // The server used to support whiteboard collaboration.
  //     // https://github.com/jitsi/excalidraw-backend
  //     collabServerBaseUrl: 'https://excalidraw-backend.example.com',
  //     // The user access limit to the whiteboard, introduced as a means
  //     // to control the performance.
  //     userLimit: 25,
  //     // The url for more info about the whiteboard and its usage limitations.
  //     limitUrl: 'https://example.com/blog/whiteboard-limits',
  // },
};
