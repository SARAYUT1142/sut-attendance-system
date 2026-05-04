# ==========================================
# ร่างที่ 1: "ช่างก่อสร้าง" (Build Stage)
# ==========================================
# เลือกใช้ Node.js เวอร์ชั่น Alpine (เล็กและปลอดภัย ลดช่องโหว่)
FROM node:20-alpine AS builder

# กำหนดโฟลเดอร์ทำงานหลักใน Container
WORKDIR /frontend

# ก๊อปปี้ไฟล์รายชื่อ Library เข้ามาก่อน (เพื่อใช้ประโยชน์จาก Docker Cache)
COPY package*.json ./

# สั่งติดตั้ง Library ทั้งหมด
RUN npm install

# ก๊อปปี้ Source Code ทั้งหมดในโฟลเดอร์ frontend เข้ามา
COPY . .

# สั่งแปลงร่างโค้ด React ให้กลายเป็นไฟล์ Static (HTML/JS/CSS)
# 🚨 ข้อควรระวัง: ถ้าเพื่อนใช้ Vite คำสั่งอาจจะเป็น npm run build แล้วได้โฟลเดอร์ชื่อ dist
# แต่ถ้าใช้ Create React App จะได้โฟลเดอร์ชื่อ build
RUN npm run build


# ==========================================
# ร่างที่ 2: "พนักงานต้อนรับ" (Production Stage)
# ==========================================
# เลือกใช้ Nginx เวอร์ชั่น Alpine สำหรับทำ Web Server
FROM nginx:alpine

# ลบไฟล์ตั้งต้นของ Nginx ทิ้งไปก่อนเพื่อความสะอาด
RUN rm -rf /usr/share/nginx/html/*

# พระเอกอยู่ตรงนี้! สั่งก๊อปปี้ "เฉพาะ" โฟลเดอร์ที่ Build เสร็จแล้วจาก ร่างที่ 1 มาใช้งาน
# โค้ดต้นฉบับและ Node.js จะไม่ถูกนำตามมาด้วย ทำให้ Image มีขนาดเล็กจิ๋วและปลอดภัยมาก
COPY --from=builder /frontend/dist /usr/share/nginx/html
# (ถ้าเพื่อนใช้ Vite ให้แก้บรรทัดบนเป็น /app/dist นะครับ)

# เปิดประตูพอร์ต 80 รอรับการเชื่อมต่อ
EXPOSE 80

# สั่งให้ Nginx ทำงานแบบ Background
CMD ["nginx", "-g", "daemon off;"]