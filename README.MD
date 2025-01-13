# 👗 outfits.ai

## Overview

outfits.ai is a sophisticated mobile application designed to revolutionize wardrobe management. Easily catalog, organize, and style your clothing collection with advanced digital tools.

### Check out the video demonstration below:

<video width="320" height="240" controls>
  <source src="https://raw.githubusercontent.com/ironnicko/outfits.ai/main/outfits.ai.mp4" type="video/mp4">
Your browser does not support the video tag.
</video>



## 🌟 Features

- **Wardrobe Digitization**: Catalog entire clothing collection
- **Outfit Composition**: Create and save outfit combinations
- **Smart Recommendations**: AI-powered outfit suggestions
- **Cross-Device Sync**: Seamless experience across platforms
- **Inventory Tracking**: Monitor clothing items and usage

## 🚀 Technologies

Frontend:
![React Native](https://img.shields.io/badge/React-black?logo=react)
![Typescript](https://img.shields.io/badge/Typescript-black?logo=typescript)
![Zustand](https://img.shields.io/badge/Zustand-black?logo=react)
![Vite](https://img.shields.io/badge/Vite-black?logo=vite)

Backend
![Go](https://img.shields.io/badge/Go-black?logo=go)
![Fiber](https://img.shields.io/badge/Fiber-black?logo=go)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-black?logo=postgresql)
![FastAPI](https://img.shields.io/badge/FastAPI-black?logo=fastapi)
![Python](https://img.shields.io/badge/Python-black?logo=python)

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
- AWS CLI
- Python 3.9.21
- Pipenv
- Yarn
- Terraform
- Ansible

#### Make sure to configure ".env" and "variables.tf"

## Clone repository

```
git clone https://github.com/ironnicko/outfits.ai
```

## Install App dependencies

```
cd ./App
yarn install
```

## Install backend dependencies

```
cd ./Go-Backend
go mod download

cd ../Segment
pipenv --python 3.9.21
pipenv shell
pipenv sync
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

## To run locally:

- ## Backend:

  ```
  cd ./Go-Backend
  go run .
  ```

  ### Make sure to set VITE_PUBLIC_IP=http://localhost in .env

- ## Segment:

  ```
  cd ./Segment
  python3 main.py
  ```

- ## App:

  ```
  cd ./App
  yarn install
  yarn run start
  ```

## 🌐 Architecture

```
outfits.ai/
│
├── App/ # React-Native TypeScript Application
│
├── Go-Backend/ # Golang Fiber Backend
│
├── Terraform/ # Terraform & Ansible Configs
│ ├── terraform/
│ └── ansible/
│
├── Segment/ # Python FastAPI Service
 ├── Model/U2Net
 ├── Model/SAM(Segment Anything Model)
 ├── Model/MiniLM-L6-v2(Embedding Model)
 ├── Model/GPT-4o-mini(Recommendation)
 └── s3_upload
```

## 🔒 Environment Variables

### .env:

```
DB_USERNAME=
DB_PORT=
DB_NAME=
DB_PASSWORD=
DB_HOST=
PORT=8000
JWT_SECRET=<JWT secret>
TIMEZONE=UTC
BUCKET_PREFIX=<S3 bucket prefix>
VITE_PORT=3000
BUCKET_NAME=<bucket name>
MODEL=sam
SEGMENT_URL=http://segment
REM_HOST=rembg
URL=<supabase project URL>
ANON=<supabase API KEY>
```

#### VITE_PUBLIC_IP will be necessary when running locally

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
