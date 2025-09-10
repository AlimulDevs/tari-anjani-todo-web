# Step 1: Gunakan image Node.js untuk build
FROM node:23.11.0-alpine AS build


# Step 2: Tentukan working directory di dalam container
WORKDIR /app

# Step 3: Salin file package.json dan package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Salin seluruh file aplikasi
COPY . .

# Step 6: Build aplikasi React
RUN npm run build

# Step 7: Gunakan image Nginx untuk menyajikan aplikasi React yang sudah dibuild
FROM nginx:alpine

# Step 8: Salin hasil build React ke dalam Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Step 9: Expose port untuk mengakses aplikasi
EXPOSE 80

# Step 10: Jalankan Nginx untuk menyajikan aplikasi
CMD ["nginx", "-g", "daemon off;"]
