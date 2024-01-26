# uptimeMon

`uptimeMon` is a backend utility built with FastAPI and the `ping3` library to monitor the uptime of specified IP addresses. It records ping results over time, providing insights into the online/offline status and response times.

## Automatic Documentation

FastAPI generates interactive documentation automatically based on your API's OpenAPI schema. When you run your application and navigate to <http://127.0.0.1:8000/docs>, you will see a Swagger-based UI. This documentation allows you to explore your API's endpoints, test requests, and understand the expected input and output.

## Disclaimer

Note: The default configuration is for development purposes and may not be secure for production use. Ensure that you review and update the configuration files, set proper environment variables, and implement security measures such as authentication and authorization based on your deployment environment. It is recommended to consult the FastAPI and ping3 documentation for additional security considerations and best practices.
