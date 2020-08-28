export const autoProxyResponse = () => {
  return {
    after: (handler: any, next: any) => {
      if (!handler.response) {
        // Default response is empty object
        handler.response = {};
      }
      if (!handler.response.statusCode) {
        // Convert basic object to LAMBDA_PROXY response
        const body = JSON.stringify(handler.response);
        handler.response = {};
        handler.response.statusCode = 200;
        handler.response.headers = {
          'Content-Type': 'application/json',
        };
        handler.response.body = body;
      }
      next();
    },
  };
};
