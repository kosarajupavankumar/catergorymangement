import React from 'react';

const CategoryTree = ({ categories }) => {
  const renderTree = (nodes) =>
    nodes.map((node) => (
      <li key={node._id}>
        {node.name}
        {node.children?.length > 0 && <ul>{renderTree(node.children)}</ul>}
      </li>
    ));

  return (
    <div>
      <h1>Category Tree</h1>
      <ul>{renderTree(categories)}</ul>
    </div>
  );
};

export default CategoryTree;
