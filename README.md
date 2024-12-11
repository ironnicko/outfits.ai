# 👗 outfits.ai

## Overview

outfits.ai is a sophisticated web application designed to revolutionize wardrobe management. Easily catalog, organize, and style your clothing collection with advanced digital tools.

## 🌟 Features

- **Wardrobe Digitization**: Catalog entire clothing collection
- [To Do] **Outfit Composition**: Create and save outfit combinations
- [To Do] **Smart Recommendations**: AI-powered outfit suggestions
- **Cross-Device Sync**: Seamless experience across platforms
- **Inventory Tracking**: Monitor clothing items and usage

## 🚀 Technologies

Frontend:
![React](https://img.shields.io/badge/React-black?logo=react)
![Typescript](https://img.shields.io/badge/Typescript-black?logo=typescript)
![Zustand](https://img.shields.io/badge/Zustand-black?logo=react)
![Vite](https://img.shields.io/badge/Vite-black?logo=vite)

Backend
![Go](https://img.shields.io/badge/Go-black?logo=go)
![Fiber](https://img.shields.io/badge/Fiber-black?logo=go)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-black?logo=postgresql)
![FastAPI](https://img.shields.io/badge/FastAPI-black?logo=fastapi)

Infrastructure
![AWS](https://img.shields.io/badge/AWS-black?logo=amazon)
![Docker](https://img.shields.io/badge/Docker-black?logo=docker)
![Terraform](https://img.shields.io/badge/Terraform-black?logo=terraform)
![Ansible](https://img.shields.io/badge/Ansible-black?logo=ansible)

## 🔧 Installation

### Prerequisites

- Node.js (v16+)
- Go (v1.18+)
- Docker
- PostgreSQL
- AWS CLI

#### Make sure to configure ".env" and "variables.tf"

## Clone repository

```
git clone https://github.com/ironnicko/outfits.ai
```

## Install frontend dependencies

```
cd Frontend
yarn install
```

## Install backend dependencies

```
cd ./Go-Backend
go mod download

cd ./Segment
pipenv --python 3.9.21
pipenv shell
pipenv install -r requirements.txt
```

## Start AWS

### Make sure to set up your ~/.aws/credentials file with your AWS SECRET KEY and AWS ACCESS KEY ID.

```
cd ./Terraform
terraform init
terraform apply --auto-approve
```

## Build and run entire stack

```
docker-compose up --build
```

## 🌐 Architecture

```
outfits.ai/
│
├── Frontend/ # React TypeScript Application
│
├── Go-Backend/ # Golang Fiber Backend
│
├── Terraform/ # Terraform & Ansible Configs
│ ├── terraform/
│ └── ansible/
│
└── Segment/ # Python FastAPI Service
└── [To Do]Recommendation/ # Python FastAPI Service
```

## 🔒 Environment Variables

### .env:

```
DB_USERNAME=
DB_PORT=
DB_NAME=
DB_PASSWORD=
DB_HOST=
PORT=
SEGMENT_URL=http://segment
JWT_SECRET=
TIMEZONE=
BUCKET_PREFIX=
VITE_PORT=
BUCKET_NAME=
ACCESS_KEY=
SECRET_KEY=
SESSION=
VITE_PUBLIC_IP=http://localhost
```

#### Optional:

```
POSTGRES_PASSWORD=
POSTGRES_USER=
POSTGRES_DB=
```

### variables.tf:

```
variable "ssh_user" {
  type        = string
  description = "SSH user"
  default     = "ec2-user"
}

variable "private_key_path" {
  type        = string
  description = "Private Key Path"
  default     = "<Path to AWS Key Pair>"
}

variable "bucket_name"{
  type = string
  description = "S3 Bucket Name"
  default = "<Your AWS S3 Bucket's Name>"
}
```
