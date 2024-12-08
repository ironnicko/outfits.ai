
# Create a VPC
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
}

# Create a public subnet
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
}

# Internet Gateway
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
}

# Route Table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
}

# Associate Route Table with Subnet
resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# Security Group
resource "aws_security_group" "postgres_sg" {
  vpc_id = aws_vpc.main.id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Allow public access to PostgreSQL (restrict in production)
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # SSH access
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Key Pair
resource "aws_key_pair" "key" {
  key_name   = "vockey"
  public_key = file("~/vockey.pem")
}

# EC2 Instance
resource "aws_instance" "postgres_ec2" {
  ami                    = "ami-0c02fb55956c7d316" # Amazon Linux 2 AMI (Update for your region)
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.public.id
  security_groups        = [aws_security_group.postgres_sg.name]
  key_name               = aws_key_pair.key.key_name
  associate_public_ip_address = true

  user_data = <<-EOF
    #!/bin/bash
    sudo yum update -y
    sudo amazon-linux-extras install docker -y
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -aG docker ec2-user
    docker run -d \
      --name postgres-container \
      -e POSTGRES_USER=nikhilivannan \
      -e POSTGRES_PASSWORD=postgres \
      -e POSTGRES_DB=mydb \
      -p 5432:5432 \
      postgres:latest
  EOF

  tags = {
    Name = "Postgres-EC2"
  }
}

# Output Public IP of EC2 Instance
output "ec2_public_ip" {
  value = aws_instance.postgres_ec2.public_ip
}
