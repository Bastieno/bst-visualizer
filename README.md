# BST Visualizer - React Edition

An interactive Binary Search Tree (BST) visualizer built with React and TypeScript. This application allows you to create beautiful visualizations of binary search trees from your own data.

## Features

- 🌳 **Interactive Tree Visualization**: Create BST diagrams using Mermaid.js
- 📊 **Tree Analytics**: View tree height, node count, and balance status
- 🎯 **Multiple Examples**: Pre-loaded examples for different tree types
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ⚡ **Real-time Updates**: Instant visualization as you input data

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd bst-visualizer
```

1. Install dependencies:

```bash
npm install
```

1. Start the development server:

```bash
npm start
```

1. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Deployment to GitHub Pages

This project is configured for easy deployment to GitHub Pages:

1. Build the project:

```bash
npm run build
```

1. Deploy to GitHub Pages:

```bash
npm run deploy
```

Make sure to update the `homepage` field in `package.json` with your GitHub Pages URL.

## How to Use

1. **Enter Numbers**: Type comma-separated numbers in the input field
2. **Visualize**: Click the "Visualize Tree" button to generate your BST
3. **Explore Examples**: Click on any example to load it automatically
4. **Analyze**: View tree statistics including height, node count, and balance status

## Example Inputs

- **Balanced Tree**: `8,4,2,1,3,6,5,7,12,10,9,11,14,13,15`
- **Perfect Tree**: `4,2,6,1,3,5,7`
- **Right Skewed**: `1,2,3,4,5,6,7`
- **Left Skewed**: `7,6,5,4,3,2,1`

## Understanding BSTs

- **BST Property**: For any node, all values in the left subtree are smaller, and all values in the right subtree are larger
- **Insertion Order Matters**: The same numbers in different order create different tree shapes
- **Balanced vs Skewed**: Balanced trees have better performance than skewed (linear) trees
- **Inorder Traversal**: Always produces a sorted sequence for a valid BST

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Mermaid.js** - Diagram generation
- **CSS3** - Styling and animations
- **GitHub Pages** - Hosting

## Project Structure

```ts
src/
├── App.tsx          # Main application component
├── App.css          # Application styles
├── index.tsx        # React entry point
├── index.css        # Global styles
public/
├── index.html       # HTML template
package.json         # Dependencies and scripts
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run deploy` - Deploys to GitHub Pages

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Mermaid.js for the beautiful diagram rendering
- React team for the excellent framework
- The open-source community for inspiration and tools
