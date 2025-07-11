import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import './App.css';

// TreeNode class
class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;

  constructor(val: number, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

// BST Builder functions
function buildBST(arr: number[]): TreeNode | null {
  if (!arr || arr.length === 0) return null;
  
  let root: TreeNode | null = null;
  for (const val of arr) {
    root = insertBST(root, val);
  }
  return root;
}

function insertBST(root: TreeNode | null, val: number): TreeNode {
  if (!root) return new TreeNode(val);
  
  if (val < root.val) {
    root.left = insertBST(root.left, val);
  } else {
    root.right = insertBST(root.right, val);
  }
  return root;
}

// Tree analysis functions
function getTreeHeight(root: TreeNode | null): number {
  if (!root) return 0;
  return 1 + Math.max(getTreeHeight(root.left), getTreeHeight(root.right));
}

function countNodes(root: TreeNode | null): number {
  if (!root) return 0;
  return 1 + countNodes(root.left) + countNodes(root.right);
}

function isBalanced(root: TreeNode | null): boolean {
  function checkBalance(node: TreeNode | null): number {
    if (!node) return 0;
    
    const leftHeight = checkBalance(node.left);
    if (leftHeight === -1) return -1;
    
    const rightHeight = checkBalance(node.right);
    if (rightHeight === -1) return -1;
    
    if (Math.abs(leftHeight - rightHeight) > 1) return -1;
    
    return Math.max(leftHeight, rightHeight) + 1;
  }
  
  return checkBalance(root) !== -1;
}

function inorderTraversal(root: TreeNode | null): number[] {
  if (!root) return [];
  return [...inorderTraversal(root.left), root.val, ...inorderTraversal(root.right)];
}

// Generate Mermaid diagram
function generateMermaidDiagram(root: TreeNode | null): string {
  if (!root) return "graph TD\n    Empty[\"Empty Tree\"]";
  
  const lines = ["graph TD"];
  const visited = new Set<number>();
  
  function traverse(node: TreeNode | null) {
    if (!node) return;
    
    if (!visited.has(node.val)) {
      visited.add(node.val);
      lines.push(`    ${node.val}["${node.val}"]`);
    }
    
    if (node.left) {
      lines.push(`    ${node.val} --> ${node.left.val}`);
      traverse(node.left);
    }
    
    if (node.right) {
      lines.push(`    ${node.val} --> ${node.right.val}`);
      traverse(node.right);
    }
  }
  
  traverse(root);
  return lines.join('\n');
}

interface TreeStats {
  height: number;
  nodeCount: number;
  balanced: boolean;
  inorder: number[];
}

const App: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [treeStats, setTreeStats] = useState<TreeStats | null>(null);
  const [inputArray, setInputArray] = useState<number[]>([]);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Mermaid
    mermaid.initialize({ 
      startOnLoad: false,
      theme: 'default',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis'
      }
    });
  }, []);

  const clearMessages = () => {
    setMessage(null);
  };

  const showError = (text: string) => {
    setMessage({ type: 'error', text });
  };

  const showSuccess = (text: string) => {
    setMessage({ type: 'success', text });
  };

  const visualizeTree = () => {
    const inputValue = input.trim();
    
    if (!inputValue) {
      showError('Please enter some numbers!');
      return;
    }
    
    try {
      const numbers = inputValue.split(',').map(s => {
        const num = parseInt(s.trim());
        if (isNaN(num)) {
          throw new Error(`"${s.trim()}" is not a valid number`);
        }
        return num;
      });
      
      if (numbers.length === 0) {
        showError('Please enter at least one number.');
        return;
      }
      
      // Build BST
      const root = buildBST(numbers);
      
      // Calculate tree properties
      const height = getTreeHeight(root);
      const nodeCount = countNodes(root);
      const balanced = isBalanced(root);
      const inorder = inorderTraversal(root);
      
      setTreeStats({
        height,
        nodeCount,
        balanced,
        inorder
      });
      setInputArray(numbers);
      
      // Generate and display Mermaid diagram
      const mermaidCode = generateMermaidDiagram(root);
      
      // Set the result state first to ensure the DOM element is rendered
      setShowResult(true);
      
      // Use setTimeout to ensure the DOM is updated before rendering Mermaid
      setTimeout(() => {
        if (mermaidRef.current) {
          const uniqueId = `mermaid-${Date.now()}`;
          
          // Use mermaid.render instead of mermaid.init
          mermaid.render(uniqueId, mermaidCode).then((result) => {
            if (mermaidRef.current) {
              mermaidRef.current.innerHTML = result.svg;
            }
          }).catch((error) => {
            console.error('Mermaid rendering error:', error);
            if (mermaidRef.current) {
              mermaidRef.current.innerHTML = `<pre>${mermaidCode}</pre>`;
            }
          });
        }
      }, 0);
      
      showSuccess('Tree visualization generated successfully!');
      
    } catch (error) {
      showError(`Error: ${(error as Error).message}`);
    }
  };

  const clearVisualization = () => {
    setInput('');
    setShowResult(false);
    setTreeStats(null);
    setInputArray([]);
    clearMessages();
  };

  const loadExample = () => {
    setInput('8,4,2,1,3,6,5,7,12,10,9,11,14,13,15');
    clearMessages();
  };

  const setInputValue = (value: string) => {
    setInput(value);
    clearMessages();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      visualizeTree();
    }
  };

  const examples = [
    { name: 'Balanced Tree', values: '8,4,2,1,3,6,5,7,12,10,9,11,14,13,15' },
    { name: 'Perfect Tree', values: '4,2,6,1,3,5,7' },
    { name: 'Right Skewed', values: '1,2,3,4,5,6,7' },
    { name: 'Left Skewed', values: '7,6,5,4,3,2,1' }
  ];

  return (
    <div className="container">
      <div className="header">
        <h1>🌳 Interactive BST Visualizer</h1>
        <p>Create beautiful Binary Search Tree visualizations from your own data</p>
      </div>

      <div className="content">
        <div className="input-section">
          <div className="input-group">
            <label htmlFor="arrayInput">Enter Numbers (separated by commas):</label>
            <input 
              type="text" 
              id="arrayInput" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., 8,4,2,1,3,6,5,7,12,10,9,11,14,13,15" 
            />
          </div>
          
          <div className="button-group">
            <button className="btn-primary" onClick={visualizeTree}>🌳 Visualize Tree</button>
            <button className="btn-secondary" onClick={clearVisualization}>🗑️ Clear</button>
            <button className="btn-success" onClick={loadExample}>📝 Load Example</button>
          </div>

          {message && (
            <div className={message.type}>
              {message.text}
            </div>
          )}
        </div>

        <div className="examples">
          <h4>📚 Example Arrays to Try:</h4>
          {examples.map((example, index) => (
            <div 
              key={index}
              className="example-item" 
              onClick={() => setInputValue(example.values)}
            >
              <strong>{example.name}:</strong> {example.values}
            </div>
          ))}
        </div>

        {showResult && treeStats && (
          <div className="visualization-section">
            <div className="tree-info">
              <div className="info-card">
                <h4>Tree Height</h4>
                <div className="value">{treeStats.height}</div>
              </div>
              <div className="info-card">
                <h4>Total Nodes</h4>
                <div className="value">{treeStats.nodeCount}</div>
              </div>
              <div className="info-card">
                <h4>Is Balanced</h4>
                <div className="value">{treeStats.balanced ? 'Yes' : 'No'}</div>
              </div>
            </div>

            <div className="mermaid" ref={mermaidRef}>
              {/* Mermaid diagram will be inserted here */}
            </div>

            <div className="info-section">
              <h3>📊 Tree Information</h3>
              <p><strong>Input Array:</strong> {inputArray.join(', ')}</p>
              <p><strong>Inorder Traversal (sorted):</strong> {treeStats.inorder.join(', ')}</p>
            </div>
          </div>
        )}

        <div className="info-section">
          <h3>🎯 How to Use This Visualizer</h3>
          <ul>
            <li><strong>Enter Numbers:</strong> Type numbers separated by commas in the input field above</li>
            <li><strong>Click Visualize:</strong> Press the "Visualize Tree" button to generate your BST</li>
            <li><strong>Interactive Diagram:</strong> You can zoom and pan the generated tree diagram</li>
            <li><strong>Try Examples:</strong> Click on any example above to load it automatically</li>
            <li><strong>BST Rules:</strong> Left children are smaller, right children are larger than their parent</li>
          </ul>
        </div>

        <div className="info-section">
          <h3>🧠 Understanding Binary Search Trees</h3>
          <ul>
            <li><strong>BST Property:</strong> For any node, all values in the left subtree are smaller, and all values in the right subtree are larger</li>
            <li><strong>Insertion Order Matters:</strong> The same numbers in different order create different tree shapes</li>
            <li><strong>Balanced vs Skewed:</strong> Balanced trees have better performance than skewed (linear) trees</li>
            <li><strong>Inorder Traversal:</strong> Always produces a sorted sequence for a valid BST</li>
            <li><strong>Tree Height:</strong> The longest path from root to leaf; affects search performance</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
