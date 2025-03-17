# Forest Fire Simulation

A dynamic forest fire simulation built with p5.js that models the spread of wildfires with realistic particle effects.

![aeddd7e0-be03-42ae-a955-64dff41b64b0](https://github.com/user-attachments/assets/405962ae-7c7d-4673-a289-da2398cb2d0a)


## Features

- **Realistic Fire Spread**: Watch as flames spread from tree to tree, influenced by wind direction and strength
- **Particle Effects**: Visualize flames and smoke using a particle system
- **Wind Dynamics**: Adjust wind direction and strength to see how it affects fire behavior
- **Natural Regeneration**: Observe the forest lifecycle as it regenerates over time
- **Interactive Controls**: Start fires, reset the forest, and adjust environmental conditions

## How It Works

The simulation uses a cellular automaton approach on a grid where each cell can be in one of four states:

- **Empty**: No vegetation
- **Tree**: Healthy tree that can catch fire
- **Burning**: Tree that is currently on fire
- **Burnt**: Charred remains of a tree

The fire spreads according to these rules:
1. Fire spreads to adjacent trees with a probability influenced by wind direction and strength
2. Burning trees emit flame and smoke particles
3. Trees burn for a set duration before becoming burnt
4. Burnt areas slowly regenerate into empty spaces
5. New trees gradually grow in empty spaces
6. Random lightning strikes can ignite new fires

## Controls

- **Start Fire**: Ignites a random tree in the forest
- **Reset Forest**: Regenerates the entire forest to its initial state
- **Wind Direction Slider**: Adjusts the direction of wind (0-360 degrees)
- **Wind Strength Slider**: Controls the strength of wind (0-10)

## Technical Details

The simulation combines multiple techniques:
- **Cellular Automaton**: For forest growth and fire spread mechanics
- **Particle System**: For visual flame and smoke effects
- **Vector Physics**: For wind influence on particles and fire spread
- **Probability Models**: For natural phenomena like lightning strikes and tree growth

## Installation

1. Clone this repository or download the files
2. Open `index.html` in a web browser
3. Alternatively, you can run this on any web server

## Requirements

- A modern web browser with JavaScript enabled
- No additional libraries needed besides p5.js (included via CDN)

## Usage

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Forest Fire Simulation</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js"></script>
  <style>
    body {
      margin: 0;
      padding: 20px;
      background-color: #222;
    }
  </style>
</head>
<body>
  <script src="forest-fire-simulation.js"></script>
</body>
</html>
```

## Customization

You can modify these constants in the code to change the simulation behavior:

```javascript
// Simulation constants
const GRID_SIZE = 80;       // Size of the grid
const CELL_SIZE = 6;        // Size of each cell in pixels

// Forest parameters
const GROWTH_PROBABILITY = 0.00002;    // Chance for a new tree to grow
const LIGHTNING_PROBABILITY = 0.000005; // Chance for lightning to strike
const FIRE_SPREAD_PROBABILITY = 0.15;   // Base chance for fire to spread
const BURN_TIME = 300;                  // How long a tree burns before turning to ash
```

## License

This project is released under the MIT License.

## Credits

Created by [Your Name]

## Future Enhancements

- Add terrain features like rivers that act as natural firebreaks
- Implement different vegetation types with varying flammability
- Add firefighting mechanics to combat the spread
- Include weather patterns that affect fire behavior
- Add data visualization for forest coverage and fire spread statistics
