# 🏛️ Athenaeum — Library Management System

A full-stack, enterprise-grade Library Management System built with **Java Spring Boot 3.4** and **React 19 + Vite**.

![Athenaeum Architecture](https://images.unsplash.com/photo-1507842229452-96c738e4a905?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Features Overview

### 📊 1. Executive Dashboard
- **Real-Time KPIs**: Total unique titles, total physical copies, in-stock ratio, active borrowings, overdue alert counter, active patron members, and uncollected fines.
- **Visual Analytics**: Interactive inventory circulation ratio bar and genre distribution breakdown.
- **Most Circulated Leaderboard**: Ranked top borrowed titles with cover art and loan counts.
- **Live Circulation Audit Log**: Chronological stream of all borrowing and return actions.

### 📚 2. Book Catalog Management
- **Catalog Browsing**: Switch between **Modern Grid View** and **Detailed Data Table**.
- **Real-Time Filtering**: Instant search across Title, Author, and ISBN, plus Category filter and Stock Availability filter.
- **Inventory & Shelving**: Tracks shelf location (e.g. *Aisle 2, Shelf CS-101*), publication year, publisher, total copies, and available copies.
- **CRUD Operations**: Add new titles with validation, edit existing books, and safe-delete with active borrowing protections.
- **Book Details Modal**: Displays detailed synopsis, physical location, and complete borrowing history for that title.
- **Quick Issue**: Direct 1-click checkout trigger from any book card.

### 👥 3. Patron & Member Directory
- **Membership Tiers**: Supports **Faculty** (10 books quota), **Student** (5 books quota), **VIP Researcher** (15 books quota), and **General Public** (4 books quota).
- **Borrowing Quota Progress Bar**: Visual progress indicator showing checked-out books against patron limits.
- **Patron Profile Modal**: Complete record showing current active loans (with 1-click returns) and past return history.
- **Patron Management**: Add, update, and manage member profiles with email, phone, and card IDs.

### 🔄 4. Circulation & Loan Lifecycle
- **Issue / Checkout Workflow**: Intuitive modal to pair any patron with available titles, configure loan periods (7, 14, 21, 30 days), and log circulation notes.
- **Automatic Overdue Tracking**: Daily automated overdue detection and fine calculation ($1.00/day overdue).
- **Book Returns & Fine Settlement**: Return modal displaying calculated overdue penalties with options to waive or record immediate payments.
- **Loan Renewals**: 1-click extension of due dates by +14 days.
- **Multi-Tab Filtering**: Filter by **Active Loans**, **Overdue Only** (with red alert indicators), **Returned History**, or **All Transactions**.

### 🎨 5. Modern UI & Experience
- **Sleek Aesthetic**: Deep modern dark slate & indigo palette with glassmorphism, glowing accents, and a one-click **Dark / Light Mode Toggle**.
- **Modern Typography**: Outfit for metrics and headers, Plus Jakarta Sans for clean readability.
- **Toast Notifications**: Non-intrusive alerts for success, error, and system updates.

---

## 🏗️ Technology Stack

| Layer | Technology |
|---|---|
| **Backend** | Java 21 / 25, Spring Boot 3.4.3 |
| **Data & ORM** | Spring Data JPA, Hibernate ORM |
| **Database** | H2 Embedded Database (File-based in `./data/librarydb` with automatic persistence) |
| **Frontend** | React 19, Vite 8, Lucide React icons, Vanilla CSS Design System |
| **Build & Tooling** | Maven Wrapper (`mvnw`), npm |

---

## 🚀 Running the Project

Both servers are currently configured and running. To run or restart them anytime:

### 1. Backend (Spring Boot)
```bash
cd backend
.\mvnw.cmd spring-boot:run
```
- API Base URL: `http://localhost:8080/api`
- H2 Web Console: `http://localhost:8080/h2-console`
  - **JDBC URL**: `jdbc:h2:file:./data/librarydb`
  - **Username**: `sa`
  - **Password**: *(leave blank)*

### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
- Web Application: `http://localhost:5173`

---

## 🔌 REST API Endpoints

### 📖 Books (`/api/books`)
- `GET /api/books` — List all books (supports query params: `search`, `category`)
- `GET /api/books/{id}` — Get single book by ID
- `GET /api/books/categories` — Get distinct book categories
- `POST /api/books` — Add a new book title
- `PUT /api/books/{id}` — Update book details
- `DELETE /api/books/{id}` — Delete book (guarded if active loans exist)

### 👥 Patrons (`/api/members`)
- `GET /api/members` — List all members (supports `search`)
- `GET /api/members/{id}` — Get member by ID
- `POST /api/members` — Register new patron
- `PUT /api/members/{id}` — Update patron profile
- `DELETE /api/members/{id}` — Delete patron profile

### 🔄 Circulation (`/api/borrow`)
- `GET /api/borrow` — List loans (supports `status`, `memberId`, `bookId`)
- `GET /api/borrow/{id}` — Get loan details
- `POST /api/borrow` — Issue / Checkout a book (`bookId`, `memberId`, `loanDays`, `notes`)
- `POST /api/borrow/{id}/return` — Return book & calculate/settle fines
- `POST /api/borrow/{id}/renew` — Extend loan due date
- `POST /api/borrow/{id}/pay-fine` — Record fine payment

### 📊 Dashboard (`/api/dashboard`)
- `GET /api/dashboard` — Aggregated KPI metrics, top books, categories, and recent activity log

---

## 🗄️ Database Switching (Optional)

The application uses standard JPA repository abstractions. To switch from H2 to **MySQL** or **PostgreSQL**, update `backend/src/main/resources/application.properties`:

### For MySQL:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/librarydb?useSSL=false&serverTimezone=UTC
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
```

### For PostgreSQL:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/librarydb
spring.datasource.username=your_pg_username
spring.datasource.password=your_pg_password
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```
*(Remember to add the `mysql-connector-j` or `postgresql` driver dependency to `pom.xml` if switching).*
