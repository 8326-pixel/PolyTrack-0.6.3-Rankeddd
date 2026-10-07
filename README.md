# PolyTrack 0.6.3 Ranked

A community edition of PolyTrack 0.6.3 with Ranked, events, replays, Extra Tracks, customization, and cross-network multiplayer.

## Play

**Production:** https://rankeddd-vu65.vercel.app/

**Source:** https://github.com/8326-pixel/PolyTrack-0.6.3-Rankeddd

The production site is a static Vercel deployment. It does not require a build server at runtime.

## Features

- Official, community, event, custom, and Extra Tracks
- Ranked and Event leaderboards
- Personal-best replays and supported ghost racing
- Racer Studio customization
- Cross-network multiplayer using WebRTC with TURN fallback
- Saved progress through browser storage and the connected ranked services

## Multiplayer

Use the in-game multiplayer Host/Join flow. The custom build uses the community Firebase/WebRTC signaling path rather than forcing the first-party Kodub multiplayer socket.

The connection UI reports whether the match used a direct connection or a relay. Direct WebRTC can fail on restrictive networks, so the TURN broker is used as a fallback.

## Controls

Use the controls shown in-game for driving. Leaderboards support the keyboard shortcuts shown by the game, and Racer Studio supports Shift+1 through Shift+4 for its tabs.

## Deployment

The Vercel deployment is intentionally static:

- Framework: Other
- Build command: `true`
- Install command: `true`
- Output directory: `.`

The WASM asset is served with the correct `application/wasm` content type.

## Important note

PolyTrack was created by Kodub. This repository is a community edition and is not the official PolyTrack website.

Community tracks remain credited to their respective creators.
