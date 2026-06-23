FROM node:22-alpine
WORKDIR /app
COPY . .
EXPOSE 8765
ENV HOST=0.0.0.0
ENV PORT=8765
CMD ["node", "serve.mjs"]
