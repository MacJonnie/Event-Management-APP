import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Event Management Api',
      version: '1.0.0',
      description: 'Create and manage your events seamlessly. (By John Emori)',
    },
    tags: [
      {
        name: "Users",
        description: "Endpoints related to user creation and role management",
      },
      {
        name: "Events",
        description: "Endpoints for creating, retrieving, updating, and deleting events",
      },
      {
        name: "Bookings",
        description: "Endpoints for booking and canceling event reservations",
      },
  ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      },
    },
    servers: [
      {
        url: 'https://event-management-app-w44s.onrender.com/Api-Doc',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;