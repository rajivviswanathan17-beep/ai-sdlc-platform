import React from 'react';

const Projects: React.FC = () => {
  return (
    <div className=\"space-y-6\">
      <div className=\"flex justify-between items-center\">
        <h2 className=\"text-2xl font-bold text-gray-900\">Projects</h2>
        <button className=\"btn btn-primary\">New Project</button>
      </div>
      <div className=\"card\">
        <div className=\"card-body text-center py-12\">
          <p className=\"text-gray-500\">No projects yet. Create your first project to get started!</p>
        </div>
      </div>
    </div>
  );
};

export default Projects;