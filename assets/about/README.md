The About me card uses GitHub's supported `<picture>` element to select a layout:

- Up to 600px: Kirby below the text, separated by a horizontal border.
- 601–1199px: Kirby to the right, separated by a vertical border.
- 1200px and above: the same two-column layout at desktop proportions.

Each layout has a light and dark version. The card is an SVG image because GitHub
strips CSS from README HTML. The native text remains available in the expandable
text version for selecting, copying, and screen readers.

At 768–991px, a portrait tablet variant accounts for the width occupied by
GitHub's profile sidebar, so the text stays readable beside the image.

To edit the copy, update the text version in the root README, then run:

```sh
node .github/scripts/render-about.mjs
```

`kirby.gif` is the original animation previously linked by the README:
https://giffiles.alphacoders.com/163/163814.gif
It is embedded in each SVG so GitHub can display the animation without external
image requests from inside the SVG.
