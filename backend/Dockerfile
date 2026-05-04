# ==========================================
# ร่างที่ 1: "ช่างก่อสร้าง" (Build Stage)
# ==========================================
FROM golang:1.25-alpine AS builder

# ตั้งค่าให้ Go รองรับการ Build ไฟล์ให้เล็กลงและไม่ต้องพึ่งพา C library (ลดช่องโหว่)
ENV CGO_ENABLED=0 GOOS=linux

WORKDIR /backend

# ก๊อปปี้ไฟล์จัดการ Library มาก่อน
COPY go.mod go.sum* ./

# โหลด Library ทั้งหมด (ถ้าไม่มี go.sum คำสั่งนี้ก็ยังรันผ่านครับ)
RUN go mod download

# ก๊อปปี้ Source Code ทั้งหมด
COPY . .

# สั่ง Build โค้ด Go ให้กลายเป็นไฟล์โปรแกรมที่ชื่อว่า "api-server"
RUN go build -o api-server .


# ==========================================
# ร่างที่ 2: "พนักงานต้อนรับ" (Production Stage)
# ==========================================
# ใช้ Alpine Linux เปล่าๆ ไม่มี Go ติดตั้งอยู่เลย (ปลอดภัยมาก)
FROM alpine:latest

WORKDIR /app

# 🚨 พระเอกอยู่ตรงนี้: ก๊อปปี้เฉพาะ "ไฟล์โปรแกรม api-server" จากร่างที่ 1 มาใช้งาน
COPY --from=builder /backend/api-server .

# เปิดพอร์ต 8080 (ตามที่คุณรันได้ตอนเทสบนเครื่อง)
EXPOSE 8080

# สั่งรันไฟล์โปรแกรม
CMD ["./api-server"]