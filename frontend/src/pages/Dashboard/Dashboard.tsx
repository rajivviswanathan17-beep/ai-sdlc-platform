import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <div className=\"space-y-6\">
      <div>
        <h2 className=\"text-2xl font-bold text-gray-900\">Dashboard</h2>
        <p className=\"text-gray-600\">Welcome to the AI-driven SDLC collaboration platform</p>
      </div>

      {/* Quick Actions */}
      <div className=\"grid grid-cols-1 md:grid-cols-3 gap-6\">
        <div className=\"card\">
          <div className=\"card-body text-center\">
            <h3 className=\"text-lg font-medium text-gray-900 mb-2\">Create Project</h3>
            <p className=\"text-gray-600 mb-4\">Start a new AI-assisted project</p>
            <Link to=\"/projects\" className=\"btn btn-primary\">
              Get Started
            </Link>
          </div>
        </div>

        <div className=\"card\">
          <div className=\"card-body text-center\">
            <h3 className=\"text-lg font-medium text-gray-900 mb-2\">Generate PRD</h3>
            <p className=\"text-gray-600 mb-4\">AI-powered requirements documentation</p>
            <button className=\"btn btn-secondary\" disabled>
              Coming Soon
            </button>
          </div>
        </div>

        <div className=\"card\">
          <div className=\"card-body text-center\">
            <h3 className=\"text-lg font-medium text-gray-900 mb-2\">View Analytics</h3>
            <p className=\"text-gray-600 mb-4\">Project insights and metrics</p>
            <button className=\"btn btn-secondary\" disabled>
              Coming Soon
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className=\"card\">
        <div className=\"card-header\">
          <h3 className=\"text-lg font-medium text-gray-900\">Recent Activity</h3>
        </div>
        <div className=\"card-body\">
          <p className=\"text-gray-500 text-center py-8\">
            No recent activity. Create your first project to get started!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;