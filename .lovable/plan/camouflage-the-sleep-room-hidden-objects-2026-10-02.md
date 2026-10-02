# Camouflage the Sleep Room hidden objects

## What will change
- Replace the Sleep Room’s emoji-like hidden objects with cohesive illustrated object art that matches the room’s soft 3D storybook style.
- Tint and position each object so it feels integrated with the nearby bedding, wall, furniture, or floor rather than floating above the scene.
- Remove sticker-like outlines, glows, and hard shadows before discovery; use subtle contact shading, lower contrast, and surface-aware rotation instead.
- Keep each object clearly confirmed after it is found, without changing the current item list, counts, sounds, reset flow, or the Sleepover Friends game.

## Technical details
- Add local transparent image assets for the unique Sleep Room object types and reuse them for repeated items.
- Extend hidden-object data with per-placement blending and perspective settings.
- Preserve accessible tap targets separately from the visible illustrated object so camouflage never makes the game hard to operate.
- Verify the full Sleep Room game on desktop and phone-sized layouts, including found states and completion.
