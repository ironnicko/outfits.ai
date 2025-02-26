resource "aws_ecs_cluster" "main" {
  name = "ecs-cluster"
}

resource "aws_cloudwatch_log_group" "ecs_log_group" {
  name = "ecs-log-group"
}

resource "aws_service_discovery_private_dns_namespace" "outfits" {
  name        = "Outfits"
  description = "Namespace for Outfits services"
  vpc         = aws_vpc.main.id
}

resource "aws_ecs_task_definition" "segment" {
  family                   = "segment-task"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "1024" # 1 vCPU
  memory                   = "3072" # 3 GB

  execution_role_arn = var.exec_role_arn
  task_role_arn      = var.exec_role_arn

  runtime_platform {
    cpu_architecture = "ARM64"
  }

  container_definitions = jsonencode([{
    name      = "segment"
    image     = var.segment_image
    essential = true
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.ecs_log_group.name
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "ecs"
      }
    }
    environmentFiles = [
      {
        value = var.s3_env
        type  = "s3"
      }
    ]
    portMappings = [{
      name          = "segment"
      containerPort = 8001
      hostPort      = 8001
      protocol      = "tcp"
    }]
  }])
}

resource "aws_ecs_task_definition" "backend" {
  family                   = "backend-task"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "1024" # 1 vCPU
  memory                   = "3072" # 3 GB

  execution_role_arn = var.exec_role_arn
  task_role_arn      = var.exec_role_arn

  runtime_platform {
    cpu_architecture = "ARM64"

  }

  container_definitions = jsonencode([{
    name      = "backend"
    image     = var.backend_image
    essential = true
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.ecs_log_group.name
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "ecs"
      }
    }
    environmentFiles = [
      {
        value = var.s3_env
        type  = "s3"
      }
    ]
    portMappings = [{
      name          = "backend"
      containerPort = 8000
      hostPort      = 8000
      protocol      = "tcp"
    }]
  }])
}

resource "aws_ecs_task_definition" "rembg" {
  family                   = "rembg-task"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "1024" # 1 vCPU
  memory                   = "8192" # 8 GB

  execution_role_arn = var.exec_role_arn
  task_role_arn      = var.exec_role_arn

  runtime_platform {
    cpu_architecture = "ARM64"

  }

  container_definitions = jsonencode([{
    name      = "rembg"
    image     = var.rembg_image
    essential = true
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.ecs_log_group.name
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "ecs"
      }
    }
    environmentFiles = [
      {
        value = var.s3_env
        type  = "s3"
      }
    ]
    portMappings = [{
      name          = "rembg"
      containerPort = 7001
      hostPort      = 7001
      protocol      = "tcp"
    }]
  }])
}


resource "aws_ecs_service" "rembg_service" {
  name            = "rembg-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.rembg.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.public_subnet[*].id
    security_groups  = [aws_security_group.ecs_sg.id]
    assign_public_ip = true
  }

  service_connect_configuration {
    enabled   = true
    namespace = aws_service_discovery_private_dns_namespace.outfits.arn

    service {
      port_name      = "rembg"
      discovery_name = "rembg"
      client_alias {
        port     = 7001
        dns_name = "rembg"
      }
    }
  }
}

resource "aws_ecs_service" "backend_service" {
  name            = "backend-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.public_subnet[*].id
    security_groups  = [aws_security_group.ecs_sg.id]
    assign_public_ip = true
  }

  service_connect_configuration {
    enabled   = true
    namespace = aws_service_discovery_private_dns_namespace.outfits.arn
  }
}

resource "aws_ecs_service" "segment_service" {
  name            = "segment-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.segment.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.public_subnet[*].id
    security_groups  = [aws_security_group.ecs_sg.id]
    assign_public_ip = true
  }


  service_connect_configuration {
    enabled   = true
    namespace = aws_service_discovery_private_dns_namespace.outfits.arn

    service {
      port_name      = "segment"
      discovery_name = "segment"
      client_alias {
        port     = 8001
        dns_name = "segment"
      }
    }
  }
}