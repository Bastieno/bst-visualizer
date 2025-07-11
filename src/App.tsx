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
  const [message, setMessage] = useState<{ type: 'error'; text: string } | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mermaidCode, setMermaidCode] = useState<string>('');
  const [showMobileModal, setShowMobileModal] = useState<boolean>(false);
  
  const desktopMermaidRef = useRef<HTMLDivElement>(null);
  const mobileMermaidRef = useRef<HTMLDivElement>(null);
  const [currentMermaidRef, setCurrentMermaidRef] = useState(desktopMermaidRef);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile && showResult) {
        setShowMobileModal(true);
        setCurrentMermaidRef(mobileMermaidRef);
      } else {
        setShowMobileModal(false);
        setCurrentMermaidRef(desktopMermaidRef);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [showResult]);

  useEffect(() => {
    // Initialize Mermaid with better configuration
    mermaid.initialize({ 
      startOnLoad: false,
      theme: 'default',
      themeVariables: {
        primaryColor: '#667eea',
        primaryTextColor: '#2d3748',
        primaryBorderColor: '#e2e8f0',
        lineColor: '#a0aec0',
        secondaryColor: '#f7fafc',
        tertiaryColor: '#edf2f7'
      },
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis',
        padding: 20
      },
      securityLevel: 'loose'
    });
  }, []);

  // Effect to render Mermaid diagram when showResult and mermaidCode change
  useEffect(() => {
    const renderMermaidDiagram = async () => {
      if (!showResult || !mermaidCode) {
        return;
      }

      // Wait for the ref to be available
      let attempts = 0;
      const maxAttempts = 10;
      
      const waitForRef = () => {
        if (currentMermaidRef.current) {
          performRender();
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(waitForRef, 50);
        } else {
          console.error('Mermaid ref not available after maximum attempts');
          setIsLoading(false);
        }
      };

      const performRender = async () => {
        try {
          if (!currentMermaidRef.current) return;
          
          // Clear previous content
          currentMermaidRef.current.innerHTML = '';
          
          // Create a unique ID for this render
          const uniqueId = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          
          console.log('Attempting to render mermaid diagram...');
          console.log('Mermaid code:', mermaidCode);
          
          // Use mermaid.render with proper error handling
          const { svg } = await mermaid.render(uniqueId, mermaidCode);
          
          if (currentMermaidRef.current && svg) {
            currentMermaidRef.current.innerHTML = svg;
            console.log('Mermaid diagram rendered successfully');
          } else {
            throw new Error('SVG generation failed');
          }
        } catch (error) {
          console.error('Mermaid rendering error:', error);
          if (currentMermaidRef.current) {
            // Fallback: show a simple text representation
            currentMermaidRef.current.innerHTML = `
              <div style="padding: 20px; text-align: center; color: #4a5568;">
                <div style="font-size: 1.2em; margin-bottom: 16px; color: #2d3748;">
                  <strong>🌳 Tree Structure Generated</strong>
                </div>
                <div style="background: #f7fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
                  <p style="margin-bottom: 8px; font-weight: 600;">Tree successfully built with ${treeStats?.nodeCount || 0} nodes</p>
                  <p style="font-size: 0.9em; color: #718096;">Visualization rendering temporarily unavailable</p>
                  <p style="font-size: 0.8em; color: #a0aec0; margin-top: 8px;">Debug: ${mermaidCode.substring(0, 100)}...</p>
                </div>
              </div>
            `;
          }
        }
        setIsLoading(false);
      };

      waitForRef();
    };

    if (showResult && mermaidCode) {
      renderMermaidDiagram();
    }
  }, [showResult, mermaidCode, treeStats?.nodeCount, currentMermaidRef]);

  useEffect(() => {
    if (showMobileModal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [showMobileModal]);

  const clearMessages = () => {
    setMessage(null);
  };

  const showError = (text: string) => {
    setMessage({ type: 'error', text });
  };


  const processVisualization = async (inputValue: string) => {
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
      
      setIsLoading(true);
      clearMessages();
      
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
      const generatedMermaidCode = generateMermaidDiagram(root);
      console.log('Generated Mermaid code:', generatedMermaidCode);
      
      // Set the mermaid code and result state - useEffect will handle rendering
      setMermaidCode(generatedMermaidCode);
      setShowResult(true);
      
      // The useEffect hook now handles showing the mobile modal automatically
      // based on the window size and whether there is a result to show.
      
      // Set loading to false after a short delay to ensure DOM is ready
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
      
    } catch (error) {
      showError(`Error: ${(error as Error).message}`);
      setIsLoading(false);
    }
  };

  const visualizeTree = () => {
    const inputValue = input.trim();
    
    if (!inputValue) {
      showError('Please enter some numbers!');
      return;
    }
    
    processVisualization(inputValue);
  };

  const clearVisualization = () => {
    setInput('');
    setShowResult(false);
    setTreeStats(null);
    setInputArray([]);
    setIsLoading(false);
    setMermaidCode('');
    setShowMobileModal(false);
    clearMessages();
  };

  const closeMobileModal = () => {
    setShowMobileModal(false);
  };

  const loadExample = () => {
    const exampleValue = '8,4,2,1,3,6,5,7,12,10,9,11,14,13,15';
    setInput(exampleValue);
    clearMessages();
    processVisualization(exampleValue);
  };

  const setInputValue = (value: string) => {
    setInput(value);
    clearMessages();
    processVisualization(value);
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
        <p>
          Create beautiful Binary Search Tree visualizations from your own data
        </p>
      </div>

      <div className="main-content">
        <div className="left-panel">
          <div className="input-section">
            <div className="input-group">
              <label htmlFor="arrayInput">
                Enter Numbers (separated by commas):
              </label>
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
              <button
                className="modern-button btn-primary"
                onClick={visualizeTree}
              >
                Visualize Tree
              </button>
              <button
                className="modern-button btn-secondary"
                onClick={clearVisualization}
              >
                Clear
              </button>
              <button
                className="modern-button btn-success"
                onClick={loadExample}
              >
                Quick Example
              </button>
            </div>

            {message && <div className={message.type}>{message.text}</div>}
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

          <div className="info-section">
            <h3>🎯 How to Use This Visualizer</h3>
            <ul>
              <li>
                <strong>Enter Numbers:</strong> Type numbers separated by commas
                in the input field above
              </li>
              <li>
                <strong>Click Visualize:</strong> Press the "Visualize Tree"
                button to generate your BST
              </li>
              <li>
                <strong>Interactive Examples:</strong> Click on any example
                above to load and visualize it instantly
              </li>
              <li>
                <strong>BST Rules:</strong> Left children are smaller, right
                children are larger than their parent
              </li>
            </ul>
          </div>

          <div className="info-section">
            <h3>🧠 Understanding Binary Search Trees</h3>
            <ul>
              <li>
                <strong>BST Property:</strong> For any node, all values in the
                left subtree are smaller, and all values in the right subtree
                are larger
              </li>
              <li>
                <strong>Insertion Order Matters:</strong> The same numbers in
                different order create different tree shapes
              </li>
              <li>
                <strong>Balanced vs Skewed:</strong> Balanced trees have better
                performance than skewed (linear) trees
              </li>
              <li>
                <strong>Inorder Traversal:</strong> Always produces a sorted
                sequence for a valid BST
              </li>
              <li>
                <strong>Tree Height:</strong> The longest path from root to
                leaf; affects search performance
              </li>
            </ul>
          </div>
        </div>

        <div className="right-panel">
          <div className="visualization-container">
            {isLoading && (
              <div className="loading-overlay">
                <div className="loading-spinner"></div>
                <p>Generating your tree visualization...</p>
              </div>
            )}

            {!showResult && (
              <div className="empty-state">
                <div className="empty-state-icon">🌱</div>
                <h3>Ready to Visualize</h3>
                <p>Enter numbers or click an example to see your BST</p>
              </div>
            )}

            {showResult && treeStats && (
              <>
                <div className="tree-stats">
                  <div className="stat-card">
                    <h4>Tree Height</h4>
                    <div className="value">{treeStats.height}</div>
                  </div>
                  <div className="stat-card">
                    <h4>Total Nodes</h4>
                    <div className="value">{treeStats.nodeCount}</div>
                  </div>
                  <div className="stat-card">
                    <h4>Is Balanced</h4>
                    <div className="value">{treeStats.balanced ? 'Yes' : 'No'}</div>
                  </div>
                </div>

                <div className="mermaid-container">
                  <div className="mermaid" ref={desktopMermaidRef}>
                    {/* Mermaid diagram will be inserted here */}
                  </div>
                </div>

                <div className="tree-info-text">
                  <p><strong>Input Array:</strong> {inputArray.join(', ')}</p>
                  <p><strong>Inorder Traversal (sorted):</strong> {treeStats.inorder.join(', ')}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {showMobileModal && (
        <div className="mobile-modal-overlay">
          <div className="mobile-modal-content">
            <div className="mobile-modal-header">
              <h3>Tree Visualization</h3>
              <button
                className="mobile-modal-close-btn"
                onClick={closeMobileModal}
              >
                &times;
              </button>
            </div>
            <div className="mobile-modal-body">
              <div
                className="visualization-container"
                style={{ height: "100%" }}
              >
                {showResult && treeStats && (
                  <>
                    <div className="tree-stats">
                      <div className="stat-card">
                        <h4>Tree Height</h4>
                        <div className="value">{treeStats.height}</div>
                      </div>
                      <div className="stat-card">
                        <h4>Total Nodes</h4>
                        <div className="value">{treeStats.nodeCount}</div>
                      </div>
                      <div className="stat-card">
                        <h4>Is Balanced</h4>
                        <div className="value">
                          {treeStats.balanced ? "Yes" : "No"}
                        </div>
                      </div>
                    </div>

                    <div className="mermaid-container" style={{ flex: 1 }}>
                      {isLoading && (
                        <div className="loading-overlay">
                          <div className="loading-spinner"></div>
                          <p>Generating your tree visualization...</p>
                        </div>
                      )}
                      <div
                        className="mermaid"
                        ref={mobileMermaidRef}
                        style={{ height: "100%" }}
                      >
                        {/* Mermaid diagram will be inserted here */}
                      </div>
                    </div>

                    <div className="tree-info-text">
                      <p>
                        <strong>Input Array:</strong> {inputArray.join(", ")}
                      </p>
                      <p>
                        <strong>Inorder Traversal (sorted):</strong>{" "}
                        {treeStats.inorder.join(", ")}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
