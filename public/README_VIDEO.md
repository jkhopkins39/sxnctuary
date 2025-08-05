# Hero Background Video Setup

To add a video background to the hero section, place your video files in this directory:

## Required Files:
- `hero-background.mp4` - Main video file (MP4 format)
- `hero-background.webm` - WebM format for better browser compatibility (optional but recommended)

## Video Specifications:
- **Format**: MP4 and/or WebM
- **Resolution**: 1920x1080 or higher (will be scaled to fit full screen)
- **Duration**: 10-30 seconds (will loop automatically)
- **File Size**: Keep under 10MB for optimal loading
- **Content**: Abstract, ambient, or music-related visuals that complement the SXNCTUARY theme
- **Aspect Ratio**: 16:9 or wider recommended (video will be cropped vertically if needed)

## Video Content Ideas:
- Abstract geometric patterns
- Digital glitch effects
- Music visualizations
- Futuristic cityscapes
- Particle effects
- Drum'n'bass inspired visuals

## Display Behavior:
- **Full Screen**: Video extends to the very top (below navbar) and full width
- **Vertical Cropping**: Video will be cropped vertically to maintain aspect ratio
- **Responsive**: Maintains full-screen coverage on all devices
- **Overlay**: Green gradient overlay maintains brand consistency

## Fallback:
If no video is provided, the hero section will display with the existing green gradient background.

## Performance Notes:
- Video is muted and autoplays for better user experience
- Uses `object-fit: cover` to maintain aspect ratio with vertical cropping
- Includes a green overlay to maintain brand consistency
- Video only plays in the hero section, other sections keep the green background
- Full viewport width and height coverage 