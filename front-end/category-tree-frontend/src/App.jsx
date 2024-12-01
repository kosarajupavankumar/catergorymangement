import React from 'react';
import { useQuery } from 'react-query';
import { fetchCategoryTree } from './api/api';
import CategoryTree from './components/CategoryTree';

const App = () => {
  const { data, error, isLoading } = useQuery('categories', fetchCategoryTree);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <CategoryTree categories={data} />;
};

export default App;
