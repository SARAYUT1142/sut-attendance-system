# 🚀 SUT Student Attendance System — ENG23 3074

> เว็บแอปพลิเคชันเช็คชื่อนักศึกษาผ่านระบบออนไลน์ พัฒนาด้วย React และ Go (Gin/Gorm) พร้อมระบบฐานข้อมูล PostgreSQL และกระบวนการ Deployment อัตโนมัติด้วย DevSecOps Pipeline

---

## 👥 สมาชิกในกลุ่ม

| รหัสนักศึกษา | ชื่อ-นามสกุล | ความรับผิดชอบ |
|-------------|-------------|---------------|
| B6608064 | นายธีรชัย มีดี | Kubernetes, Monitoring |
| B6608347 | นางสาวอรปรียา แตงอ่อน  | Git, App Development |
| B6618599 | นายสรายุทธ อินทร์โสภา | Jenkins, Docker |
| B6629304 | นายเจษฎา ชาวยศ | Terraform, Ansible |

---

## 📌 ภาพรวมโปรเจค

### แอปพลิเคชัน
- ชื่อ: SUT Attendance Check-in
- ประเภท: Full-stack Web Application (SPA + REST API)
- Tech Stack:
    - Frontend: React (Vite) + Tailwind CSS
    - Backend: Go Framework Gin + GORM (ORM)
    - Database: PostgreSQL 15
- คำอธิบาย: ระบบที่ช่วยให้อาจารย์และนักศึกษาสามารถจัดการการเช็คชื่อในคลาสเรียนได้แบบ Real-time รองรับการสรุปผลการเข้าเรียน และการจัดการข้อมูลนักศึกษาผ่าน Database ที่มีความเสถียรสูง

### Architecture Diagram
```
Developer
    │
    ▼  git push
 GitHub ──── webhook ────▶ Jenkins CI/CD
                                │
                    ┌───────────┼───────────┐
                    ▼           ▼           ▼
                 Build        Test      Docker Build
                                            │
                                            ▼
                                       Docker Hub
                                            │
                                    ┌───────┴───────┐
                                    ▼               ▼
                                Terraform        Ansible
                                    │               │
                                    └───────┬───────┘
                                            ▼
                                   Kubernetes Cluster
                                   ┌────────────────┐
                                   │  [React UI]    │
                                   │      ▲         │
                                   │      ▼         │
                                   │  [Go API]  ◀─▶ [PostgreSQL] │
                                   │                │
                                   │  Service (NodePort :30080) │
                                   └────────────────┘
                                            │
                              ┌─────────────┴──────────────┐
                              ▼                             ▼
                          Prometheus  ──────────────▶  Grafana
                        (scrape /metrics)            (dashboard)
```

---

## 📁 โครงสร้าง Repository

```
sut-attendance/
├── app/
│   ├── frontend/               # React application code
│   │   ├── src/
│   │   ├── package.json
│   │   └── Dockerfile          # Build React as static files
│   └── backend/                # Go Gin application code
│       ├── main.go             # Entry point
│       ├── models/             # GORM data models
│       ├── go.mod
│       └── Dockerfile
├── Jenkinsfile             # CI/CD pipeline definition
├── terraform/
│   ├── main.tf          # ไฟล์หลักสำหรับสั่งสร้าง VM
│   └── variables.tf     # เก็บตัวแปรต่างๆ
└── ansible/
│    └── playbook.yml     # ไฟล์สำหรับเข้าไปเซ็ตอัพเครื่องหลังสร้างเสร็จ
├── ansible/                # Config server & Postgres setup
├── k8s/                    # โฟลเดอร์เก็บไฟล์ Kubernetes ทั้งหมด
│    │
│    ├── frontend/           # กลุ่มไฟล์สำหรับหน้าบ้าน
│    │   ├── deployment.yaml
│    │   └── service.yaml
│    │
│    ├── backend/            # กลุ่มไฟล์สำหรับ API หลังบ้าน
│    │   ├── deployment.yaml  # Deployment for React & Go
│    │   └── service.yaml
│    │
│    ├── database/           # กลุ่มไฟล์สำหรับฐานข้อมูล
│    │   ├── deployment.yaml (หรือ StatefulSet)
│    │   ├── service.yaml
│    │   ├── pvc.yaml        # 🚨 จำเป็นต้องมีเพื่อไม่ให้ข้อมูลนักศึกษาหาย
│    │   └── secret.yaml     # ซ่อน Username/Password ของ DB ให้ปลอดภัย
│    │
│    └── ingress.yaml        # ย้ายพนักงานต้อนรับมาไว้ข้างนอกสุด เพื่อจัดการเส้นทางทั้งระบบ
├── monitoring/              # 👈 โครงสร้างใหม่ที่แบ่งโฟลเดอร์ย่อยสวยงาม
│    ├── grafana/
│    │      └── deployment.yaml  # ไฟล์สร้าง Pod และ Service ของ Grafana
│    │
│    └── prometheus/
│            ├── config.yaml      # ไฟล์ ConfigMap ชี้เป้าไปหา Backend
│            └── deployment.yaml  # ไฟล์สร้าง Pod และ Service ของ Prometheus
└── README.md
```

---

## ⚙️ สิ่งที่ต้องติดตั้งก่อน (Prerequisites)

ตรวจสอบให้แน่ใจว่าติดตั้งทุก tool ครบก่อนรันโปรเจค

| Tool | Version | หน้าที่ |
|------|---------|---------|
| Git | ≥ 2.x | จัดการ source code |
| Docker | ≥ 24.x | สร้างและรัน container |
| Jenkins | ≥ 2.4xx | ระบบ CI/CD automation |
| Terraform | ≥ 1.x | Provision infrastructure |
| Ansible | ≥ 2.15 | Configure environment |
| kubectl | ≥ 1.28 | สั่งงาน Kubernetes cluster |
| Minikube / K3s | latest | Kubernetes แบบ local |
| Prometheus | ≥ 2.x | เก็บ metrics |
| Grafana | ≥ 10.x | แสดง dashboard |
| Go | ≥ 1.21 | พัฒนา Backend | 
| Node.js | ≥ 18.x | พัฒนา Frontend |
| PostgreSQL | 15 | ระบบฐานข้อมูล |

---

## 🏃 วิธีรันโปรเจค (Quick Start)

### 1. Clone Repository
```bash
git clone https://github.com/SARAYUT1142/sut-attendance-system.git
cd sut-attendance
```

### 2. รันแอปบนเครื่องโดยตรง (ไม่ผ่าน pipeline)
### Backend (Go):
```bash
cd backend
go mod tidy
go run main.go
# API รันที่ http://localhost:8080
```
### Frontend (React):
```bash
cd frontend
npm install
npm run dev
# เว็บรันที่ http://localhost:5173
```

### 3. Build และรันด้วย Docker
```bash
# Build Backend
docker build -t [username]/attendance-backend ./backend:latest
# Build Frontend
docker build -t [username]/attendance-frontend ./frontend:latest
docker run -p 5000:5000 [username]/[app-name]:latest
```

---

## 🔄 CI/CD Pipeline (Jenkins)

### ลำดับการทำงานของ Pipeline

```
Checkout ──▶ Lint/Test ──▶ Docker Build (FE/BE) ──▶ Push to Hub ──▶ Deploy (IaC + K8s)
```

| Stage | คำอธิบาย |
|-------|----------|
| **Checkout** | ดึงโค้ดล่าสุดจาก GitHub |
| **Build** | ติดตั้ง dependencies |
| **Test** | รัน unit test |
| **Docker Build** | สร้าง Docker image |
| **Push to Hub** | อัปโหลด image ขึ้น Docker Hub |
| **Deploy** | รัน Terraform + Ansible แล้ว apply Kubernetes manifests |

### วิธีตั้งค่า Jenkins
1. ติดตั้ง Jenkins และเปิดที่ `http://localhost:8080`
2. ติดตั้ง plugin: **Git**, **Pipeline**, **Docker Pipeline**
3. เพิ่ม credentials สำหรับ Docker Hub (ชื่อ `dockerhub-credentials`)
4. สร้าง Pipeline job ใหม่ และชี้ไปที่ repository นี้
5. ตั้งค่า Webhook ใน GitHub:
   - ไปที่ **Settings → Webhooks → Add webhook**
   - Payload URL: `http://[jenkins-host]:8080/github-webhook/`
   - Content type: `application/json`
   - ติ๊ก trigger: **Just the push event**

---

## 🏗️ Infrastructure as Code

### Terraform — Provision Infrastructure
```bash
#สิ่งที่สร้าง: จัดเตรียม Kubernetes Namespace, Persistence Volume สำหรับ PostgreSQL และ Network Policy เบื้องต้น
cd terraform
terraform init      # ดาวน์โหลด provider plugins
terraform plan      # ตรวจสอบว่าจะสร้างอะไรบ้าง
terraform apply     # สร้าง resource จริง
```
> **สิ่งที่ Terraform สร้าง:** [อธิบาย เช่น Docker network, Kubernetes namespace, local directory]

### Ansible — Configure Environment
```bash
#สิ่งที่ทำ: ติดตั้งและตั้งค่า PostgreSQL ภายใน Cluster, จัดการเรื่อง Database Migration เบื้องต้นผ่าน GORM และติดตั้ง Metrics Exporter
cd ansible
ansible-playbook -i inventory playbook.yml
```
> **สิ่งที่ Ansible ทำ:** [อธิบาย เช่น ติดตั้ง kubectl, copy kubeconfig, ตั้งค่า environment variable]

> ⚠️ **หมายเหตุ:** ใน pipeline จริง Jenkins จะเรียก Terraform และ Ansible อัตโนมัติในขั้นตอน Deploy ไม่ต้องรันด้วยมือ

---

## ☸️ Kubernetes Deployment

### Apply Manifests ด้วยตัวเอง
```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

### ตรวจสอบสถานะ
```bash
kubectl get pods -n [namespace]
kubectl get svc  -n [namespace]
```

### ผลลัพธ์ที่ควรจะได้
```
NAME                        READY   STATUS    RESTARTS   AGE
[app-name]-xxxxxxxxx-xxxxx  1/1     Running   0          2m
[app-name]-xxxxxxxxx-yyyyy  1/1     Running   0          2m

NAME            TYPE       CLUSTER-IP     PORT(S)          AGE
[app-name]-svc  NodePort   10.96.xx.xxx   5000:30080/TCP   2m
```

### เข้าถึงแอปพลิเคชัน
```
http://localhost:30080
```

---

## 📊 Monitoring

### Prometheus — เก็บ metrics จาก /metrics endpoint ใน Go Gin (ใช้ middleware gin-prometheus)
- ไฟล์ config: `monitoring/prometheus.yml`
- Scrape ทุก **15 วินาที**
- Target endpoint: `http://[app-host]:[port]/metrics`

รัน Prometheus:
```bash
prometheus --config.file=monitoring/prometheus.yml
# เปิด UI ที่ http://localhost:9090
```

### Grafana — แสดง 
- Student Check-in Rate: จำนวนการเช็คชื่อต่อนาที
- API Latency: ความเร็วในการตอบสนองของระบบ Go
- DB Connection: สถานะการเชื่อมต่อกับ PostgreSQL
- ไฟล์ dashboard: `monitoring/grafana-dashboard.json`
- Data source: Prometheus (`http://localhost:9090`)

วิธี import dashboard:
1. เปิด Grafana ที่ `http://localhost:3000`
2. ไปที่ **Dashboards → Import**
3. อัปโหลดไฟล์ `grafana-dashboard.json`

### Panels ใน Dashboard

| Panel | Metric (PromQL) | แสดงข้อมูลอะไร |
|-------|-----------------|----------------|
| Request Rate | `rate(http_requests_total[1m])` | จำนวน request ต่อวินาที |
| Error Rate | `rate(http_requests_total{status=~"5.."}[1m])` | จำนวน error 5xx ต่อวินาที |
| Latency (p95) | `histogram_quantile(0.95, ...)` | response time ที่ percentile 95 |
| Pod Health | `up{job="[app-name]"}` | service ขึ้นหรือล่ม (1/0) |

---

## 🌿 Branching Strategy

```
main        ──── โค้ดที่พร้อม production, protected branch
dev         ──── รวมโค้ดก่อน merge ขึ้น main
feature/*   ──── พัฒนา feature แต่ละอัน (เช่น feature/add-login)
```

| Branch | Protected | คำอธิบาย |
|--------|-----------|----------|
| `main` | ✅ | trigger pipeline อัตโนมัติเมื่อ merge |
| `dev` | ✅ | ทดสอบก่อน merge ขึ้น main |
| `feature/*` | ❌ | พัฒนาแยกกันแล้วค่อย merge เข้า dev |

---

## 🧪 API Endpoints

| Method | Endpoint | คำอธิบาย |
|--------|----------|----------|
| `GET` | `health` | ตรวจสอบสถานะ Backend |
| `GET` | `/api/checkin` | บันทึกข้อมูลการเช็คชื่อ |
| `GET` | `/api/students` | ดึงรายชื่อนักศึกษา |
| `POST` | `/metrics` | Prometheus metrics |

---

## 🐛 ปัญหาที่พบบ่อย (Troubleshooting)

**Database Connection Failed**
```bash
# ตรวจสอบว่า DATABASE_URL ใน Environment Variable ตรงกับ Service Name ใน Kubernetes หรือไม่
# ไว้เติมเพิ่ม
```

**Jenkins Pipeline Docker Error**
```bash
# ตรวจสอบว่า Jenkins user มีสิทธิ์เข้าถึง /var/run/docker.sock
# ไว้เติมเพิ่ม
```

**Prometheus แสดง target เป็น DOWN**
```bash
# ตรวจว่าแอปเปิด /metrics ได้จริง
curl http://localhost:5000/metrics
# ตรวจ prometheus.yml ว่า host:port ตรงกับแอปจริง
```

---

## 📚 เอกสารอ้างอิง

- [Jenkinsfile Declarative Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/syntax/)
- [Terraform Documentation](https://developer.hashicorp.com/terraform/docs)
- [Ansible Documentation](https://docs.ansible.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Markdown Guide](https://www.markdownguide.org/)
- [GitHub Markdown Syntax](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)
- [Gin Web Framework Documentation](https://gin-gonic.com/)
- [GORM Docs](https://gorm.io/)
- [React Docs](https://react.dev/)
