# image de départ
 #FROM alpine:3.15

# installation des paquets système
 #RUN apk add --no-cache nodejs npm git

 # chemin de travail
 #WORKDIR /app

 # ajout utilisateur node et groupe node
 #RUN addgroup -S node && adduser -S node -G node

 # downgrade des privilèges
 #USER node

 # copie des fichiers du dépôt
 #COPY --chown=node:node . .

 # installation des dépendances avec npm
 #RUN npm install

 # build avec npm
 #RUN npm run build

 # exécution
 #CMD ["npm", "start"]


FROM alpine:3.20 AS builder
RUN apk add nodejs npm
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production && mv node_modules prod_node_modules
RUN npm install
COPY . .
RUN npm run build

FROM alpine:3.20 AS runner
RUN apk add --no-cache nodejs\
&& addgroup -S nodegroup \
&& adduser -S node -G nodegroup
WORKDIR /app
COPY --from=builder /app/prod_node_modules ./node_modules
COPY --from=builder /app/dist ./dist
USER node
EXPOSE 3000
CMD ["node", "dist/index.js"]




