import React, { useState, useEffect } from 'react';

const CategoryTree = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/categories/tree')
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);

  const renderTree = (nodes) => (
    <ul>
      {nodes.map((node) => (
        <li key={node._id}>
          {node.name}
          {node.children && node.children.length > 0 && renderTree(node.children)}
        </li>
      ))}
    </ul>
  );

  return (
    <div>
      <h2>Category Tree</h2>
      {renderTree(categories)}
    </div>
  );
};

export default CategoryTree;
